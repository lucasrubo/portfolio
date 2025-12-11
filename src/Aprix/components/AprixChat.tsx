import React, { useState, useRef, useEffect, useMemo } from "react";
import { marked } from "marked";
import type { AprixChatProps } from "../types";

// Configurar marked para permitir HTML
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * AprixChat - Componente de chat estilo ChatGPT
 */
const AprixChat: React.FC<AprixChatProps> = ({
  messages,
  isLoading,
  onSendMessage,
  ttsEnabled,
  onToggleTTS,
  onStopTTS,
  apiOnline,
}) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [animatedIds, setAnimatedIds] = useState<Set<string>>(new Set());

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus no input quando o chat abre (apenas em desktop)
  useEffect(() => {
    if (!("ontouchstart" in window)) {
      inputRef.current?.focus();
    }
  }, []);

  // Marcar mensagens já existentes como animadas na inicialização
  useEffect(() => {
    const existingIds = new Set(messages.map((m) => m.id));
    setAnimatedIds(existingIds);
  }, []);

  // Detectar novas mensagens e animar apenas elas
  useEffect(() => {
    const newIds = messages
      .filter((m) => !animatedIds.has(m.id))
      .map((m) => m.id);
    if (newIds.length > 0) {
      // Adicionar após um breve delay para permitir a animação
      setTimeout(() => {
        setAnimatedIds((prev) => {
          const updated = new Set(prev);
          newIds.forEach((id) => updated.add(id));
          return updated;
        });
      }, 350);
    }
  }, [messages, animatedIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && apiOnline) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading && apiOnline) {
        handleSubmit(e);
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex flex-col max-sm:h-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .aprix-message-content a {
            color: #60a5fa !important;
            text-decoration: underline !important;
            text-decoration-color: #60a5fa !important;
          }
          .aprix-message-content a:hover {
            color: #3b82f6 !important;
          }
          .aprix-message-content strong {
            font-weight: 600 !important;
          }
        `,
        }}
      />
      {/* Área de mensagens - com fade no topo */}
      <div
        className="flex-1 overflow-y-auto py-4 space-y-4 aprix-scrollbar max-sm:py-6 max-sm:space-y-6 min-h-0 md:max-h-[500px]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 100%)",
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <p className="mb-2">Olá! Sou o Aprix, assistente do Lucas.</p>
            <p>Como posso ajudar você hoje?</p>
          </div>
        ) : (
          messages.map((message) => {
            const isNew = !animatedIds.has(message.id);
            const parsedContent = useMemo(
              () => marked(message.content),
              [message.content]
            );
            return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } ${isNew ? "animate-bubble-in" : ""}`}
              >
                <div
                  className={`max-w-[85%] max-sm:max-w-[95%] px-4 py-2.5 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-md"
                      : "bg-white/10 text-white/90 rounded-bl-md"
                  }`}
                >
                  <div
                    className="m-0 text-sm leading-relaxed prose prose-invert max-w-none aprix-message-content"
                    dangerouslySetInnerHTML={{ __html: parsedContent }}
                  />
                  <span className="block text-[10px] text-white/50 mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] max-sm:max-w-[95%] px-4 py-2.5 rounded-2xl bg-[#2f2f2fc9] text-white/90 rounded-bl-md">
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-primary rounded-full animate-typing [animation-delay:0s]" />
                <span className="w-2 h-2 bg-primary rounded-full animate-typing [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-primary rounded-full animate-typing [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-3 max-sm:h-16"
      >
        {/* TTS Toggle Button */}
        <button
          type="button"
          onClick={onToggleTTS}
          className={`w-10 h-10 rounded-xl border-none cursor-pointer flex items-center justify-center transition-all hover:scale-105 ${
            ttsEnabled
              ? "bg-gradient-to-r from-primary to-secondary text-white"
              : "bg-white/10 text-white/50 hover:text-white/80"
          }`}
          title={ttsEnabled ? "Desativar áudio" : "Ativar áudio"}
        >
          {ttsEnabled ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            apiOnline ? "Digite sua mensagem..." : "Aprix está offline..."
          }
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
          disabled={isLoading || !apiOnline}
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary border-none text-white cursor-pointer flex items-center justify-center transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={!inputValue.trim() || isLoading || !apiOnline}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AprixChat;
