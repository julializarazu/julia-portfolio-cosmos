import { juliaPrompt } from "@/lib/julia-prompt";

export const maxDuration = 30;

type ChatMessage = {
  role: "user" | "assistant" | "system" | "data";
  content: string;
};

const GEMINI_MODEL = "gemini-2.5-flash";

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

    const contents = messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({
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
            maxOutputTokens: 500,
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
