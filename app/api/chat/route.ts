import { juliaPrompt } from "@/lib/julia-prompt";

export const maxDuration = 30;

type ChatMessage = {
  role: "user" | "assistant" | "system" | "data";
  content: string;
};

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_REQUESTS_PER_WINDOW = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MIN_REQUEST_INTERVAL_MS = 2500;
const MAX_USER_MESSAGE_CHARS = 900;
const MAX_HISTORY_MESSAGES = 10;
const MAX_INPUT_CHARS = 6000;
const MAX_OUTPUT_TOKENS = 350;

type RateLimitEntry = {
  count: number;
  lastRequestAt: number;
  repeatedMessageCount: number;
  resetAt: number;
  lastMessageHash?: string;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientId(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const vercelIp = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || realIp || vercelIp || "unknown";
}

function normalizeMessage(content: string) {
  return content.trim().replace(/\s+/g, " ").toLowerCase();
}

function hashMessage(content: string) {
  let hash = 0;

  for (let i = 0; i < content.length; i += 1) {
    hash = (hash * 31 + content.charCodeAt(i)) | 0;
  }

  return String(hash);
}

function enforceRateLimit(req: Request, latestUserMessage: string) {
  const now = Date.now();
  const clientId = getClientId(req);
  const messageHash = hashMessage(normalizeMessage(latestUserMessage));
  const current = rateLimitStore.get(clientId);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientId, {
      count: 1,
      lastRequestAt: now,
      repeatedMessageCount: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
      lastMessageHash: messageHash,
    });
    return null;
  }

  if (now - current.lastRequestAt < MIN_REQUEST_INTERVAL_MS) {
    return "Vas un poquito rapido. Espera unos segundos y volve a probar.";
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    const minutes = Math.ceil((current.resetAt - now) / 60000);
    return `Llegaste al limite de mensajes por ahora. Proba de nuevo en ${minutes} min.`;
  }

  const repeatedMessageCount =
    current.lastMessageHash === messageHash ? current.repeatedMessageCount + 1 : 1;

  if (repeatedMessageCount >= 4) {
    return "Detecte mensajes repetidos. Cambia un poco la consulta y vuelvo a ayudarte.";
  }

  current.count += 1;
  current.lastRequestAt = now;
  current.lastMessageHash = messageHash;
  current.repeatedMessageCount = repeatedMessageCount;
  rateLimitStore.set(clientId, current);

  return null;
}

function sanitizeMessages(messages: ChatMessage[]) {
  let totalChars = 0;

  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .slice(-MAX_HISTORY_MESSAGES)
    .reverse()
    .reduce<ChatMessage[]>((acc, message) => {
      const trimmed = message.content.trim().slice(0, MAX_USER_MESSAGE_CHARS);
      const nextTotal = totalChars + trimmed.length;

      if (!trimmed || nextTotal > MAX_INPUT_CHARS) {
        return acc;
      }

      totalChars = nextTotal;
      acc.unshift({ role: message.role, content: trimmed });
      return acc;
    }, []);
}

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return new Response(
        "No pude conectar con Gemini. Revisá que .env.local tenga GEMINI_API_KEY=tu_api_key.",
        { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!Array.isArray(messages)) {
      return new Response("Solicitud invalida.", {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user")
      ?.content?.trim();

    if (!latestUserMessage) {
      return new Response("Mandame una consulta para poder ayudarte.", {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (latestUserMessage.length > MAX_USER_MESSAGE_CHARS) {
      return new Response(
        "Tu mensaje es demasiado largo. Probalo mas corto asi puedo responder mejor.",
        { status: 413, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const rateLimitMessage = enforceRateLimit(req, latestUserMessage);

    if (rateLimitMessage) {
      return new Response(rateLimitMessage, {
        status: 429,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const safeMessages = sanitizeMessages(messages);

    const contents = safeMessages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: juliaPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);

      return new Response(
        "No pude conectar con Gemini. Revisá que la API key sea válida y que tenga acceso a Gemini API.",
        { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim() ||
      "Perdón, no pude generar una respuesta en este momento. ¿Probamos de nuevo?";

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      "No pude conectar con mi IA ahora. Revisá la configuración de Gemini y volvé a probar.",
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
}
