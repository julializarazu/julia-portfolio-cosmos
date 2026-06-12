"use client";

import Image from "next/image";
import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUICK_QUESTIONS = [
  "¿Qué tecnologías maneja Julia?",
  "¿Tiene experiencia con IA?",
  "¿Está disponible para trabajar?",
  "¿Cuáles son sus proyectos más importantes?",
];

function JuliaAvatar({ size }: { size: "launcher" | "header" | "message" }) {
  const dimensions = size === "launcher" ? 126 : size === "header" ? 56 : 32;
  const sizeClass = size === "launcher" ? "w-22 h-22" : size === "header" ? "w-14 h-14" : "w-8 h-8";

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden border border-purple-500/30`}
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: "9999px",
        overflow: "hidden",
        border: "1px solid rgba(168,85,247,.3)",
        flexShrink: 0,
      }}
    >
      <Image
        src="/mi_avatar.png"
        alt="Avatar de Julia"
        width={dimensions}
        height={dimensions}
        className={`${sizeClass} rounded-full object-cover border border-purple-500/30`}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export function JuliaChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, append } =
    useChat({ api: "/api/chat", streamProtocol: "text" });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chipsVisible, setChipsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickQuestion = (q: string) => {
    setChipsVisible(false);
    append({ role: "user", content: q });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    setChipsVisible(false);
    handleSubmit(e);
  };

  return (
    <div className="lg:sticky lg:top-24 h-fit">
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          style={{
            position: "fixed",
            right: 32,
            bottom: 32,
            zIndex: 70,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
          className="julia-chat-launcher"
        >
          <div
            className="julia-chat-teaser"
            style={{
              width: 280,
              padding: "14px 16px",
              borderRadius: 18,
              border: "1px solid rgba(167,139,250,.18)",
              background: "rgba(11,14,26,.62)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 18px 44px rgba(0,0,0,.24)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                marginBottom: 8,
                borderRadius: 999,
                border: "1px solid rgba(167,139,250,.28)",
                background: "rgba(167,139,250,.12)",
                color: "#C4B5FD",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              ✨ Clon interactivo
            </div>
            <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.55 }}>
              Este es mi gemelo digital, charlá con él para ver cómo trabajo
            </p>
          </div>

          <button
            type="button"
            aria-label="Abrir chat con Julia"
            onClick={() => setIsOpen(true)}
            className="julia-chat-button rounded-full shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform"
            style={{
              width: 142,
              height: 142,
              borderRadius: "9999px",
              border: "1px solid rgba(167,139,250,.65)",
              background: "rgba(11,14,26,.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 44px rgba(167,139,250,.32), 0 24px 60px rgba(0,0,0,.5)",
              transition: "transform .2s ease, box-shadow .2s ease",
            }}
          >
            <JuliaAvatar size="launcher" />
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="julia-chat-panel fixed top-0 right-0 h-full w-full md:w-[450px] z-50 bg-[#0b0c10]/95 backdrop-blur-md shadow-2xl"
            style={{
              position: "fixed",
              top: 76,
              right: 24,
              zIndex: 80,
              height: "calc(100vh - 100px)",
              width: "min(450px, calc(100vw - 48px))",
              background: "rgba(11,14,26,.96)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(129,140,248,.18)",
              borderRadius: 22,
              overflow: "hidden",
              boxShadow: "-28px 0 80px rgba(0,0,0,.42), 0 0 42px rgba(167,139,250,.12)",
            }}
          >
            <div
              className="chat-panel"
              style={{
                height: "100%",
                borderRadius: 22,
                border: 0,
              }}
            >
      {/* Header */}
      <div
        className="chat-header"
        style={{
          flexShrink: 0,
          minHeight: 90,
          padding: "18px 22px",
        }}
      >
        <JuliaAvatar size="header" />
        <div>
          <p className="chat-title">Julia (IA Clon)</p>
          <p className="chat-sub">Respondiendo en tiempo real</p>
        </div>
        <span className="online-dot" />
        <button
          type="button"
          aria-label="Cerrar chat"
          onClick={() => setIsOpen(false)}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            border: "0.5px solid rgba(255,255,255,.12)",
            background: "rgba(255,255,255,.04)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 8,
          }}
        >
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="chat-messages"
        style={{
          flex: 1,
          minHeight: 0,
          maxHeight: "none",
        }}
      >
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="msg-row bot">
            <JuliaAvatar size="message" />
            <div className="bubble bot">
              ¡Hola! Soy el clon de Julia. Puedo contarte sobre su experiencia,
              proyectos y stack técnico. ¿Qué querés saber?
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`msg-row ${m.role === "user" ? "user" : "bot"}`}
          >
            {m.role === "user" ? (
              <div className="msg-av">Vos</div>
            ) : (
              <JuliaAvatar size="message" />
            )}
            <div className={`bubble ${m.role === "user" ? "user" : "bot"}`}>
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="msg-row bot">
            <JuliaAvatar size="message" />
            <div className="bubble bot typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {error && (
          <div className="msg-row bot">
            <JuliaAvatar size="message" />
            <div className="bubble bot">
              No pude conectar con mi IA ahora. Revisá que la API key esté bien configurada y volvé a probar.
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      {chipsVisible && messages.length === 0 && (
        <div className="chips">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              className="chip"
              onClick={() => handleQuickQuestion(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleFormSubmit} className="chat-input-row">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Preguntale algo a Julia..."
          className="chat-input"
          disabled={isLoading}
        />
        <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
