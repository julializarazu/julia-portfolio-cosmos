# Julia Lizarazu — Portfolio Cosmos Dark + IA Clon

## Stack
- **Framework:** Next.js 14 (App Router)
- **IA:** Anthropic Claude via `@ai-sdk/anthropic` + Vercel AI SDK
- **Animaciones:** Framer Motion
- **Estilos:** CSS custom (Cosmos Dark system)
- **Deploy:** Vercel

---

## Setup en 5 pasos

### 1. Clonar e instalar
```bash
git clone https://github.com/tu-usuario/mi-portafolio
cd mi-portafolio
npm install
```

### 2. Variables de entorno
Crear `.env.local` en la raíz:
```env
ANTHROPIC_API_KEY=sk-ant-...   # tu clave de https://console.anthropic.com
```
> En Vercel: Settings → Environment Variables → agregar `ANTHROPIC_API_KEY`

### 3. Personalizar el clon
Editá `lib/julia-prompt.ts` con tu información real:
- Tu stack técnico actual
- Tus proyectos reales con descripción
- Tu disponibilidad y preferencias laborales
- Tu contacto y ubicación

### 4. Correr en local
```bash
npm run dev
# → http://localhost:3000
```

### 5. Deploy en Vercel
```bash
npm i -g vercel
vercel --prod
```
O simplemente conectá tu repo de GitHub en vercel.com.

---

## Estructura de archivos

```
/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        ← API del clon IA (streaming)
│   ├── globals.css             ← Sistema visual Cosmos Dark
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── JuliaChat.tsx           ← Widget de chat completo
├── lib/
│   └── julia-prompt.ts         ← El "cerebro" del clon (editá esto)
└── package.json
```

---

## Cómo funciona el clon

```
Usuario escribe → /api/chat → Anthropic API
                              (claude-sonnet con tu system prompt)
                              → Respuesta streameada en tiempo real
                              → Se muestra letra por letra en el chat
```

El streaming hace que las respuestas aparezcan "escribiéndose" en tiempo real,
lo que da una sensación muy natural de conversación.

---

## Personalización avanzada

### Cambiar el modelo
En `app/api/chat/route.ts`:
```typescript
model: anthropic("claude-haiku-4-5-20251001")  // más rápido y barato
model: anthropic("claude-sonnet-4-6")           // recomendado (balance)
model: anthropic("claude-opus-4-6")             // más inteligente, más caro
```

### Ajustar temperatura
- `temperature: 0.5` → respuestas más consistentes/predecibles
- `temperature: 0.85` → más creatividad y variedad

### Agregar historial de contexto
El `useChat` hook de Vercel AI SDK ya maneja el historial automáticamente —
cada mensaje previo se envía como contexto al modelo.

### Rate limiting (para producción)
Agregar en `route.ts`:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
// 10 mensajes por IP por minuto
```

---

## Costo estimado
- Claude Sonnet: ~$0.003 por conversación de 10 mensajes
- Con 100 visitantes/día × 5 mensajes: ~$1.50/mes
- Muy bajo para el impacto que genera
