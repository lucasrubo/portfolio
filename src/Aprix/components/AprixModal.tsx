import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAprix } from "../context";
import { useLanguage } from "../../contexts/LanguageContext";
import AprixChat from "./AprixChat";

/**
 * AprixModal - Modal de interação com o assistente Aprix
 */
const AprixModal: React.FC = () => {
  const {
    isModalOpen,
    closeModal,
    messages,
    isLoading,
    sendMessage,
    toggleMode,
    getDisplayMode,
    ttsEnabled,
    toggleTTS,
    stopTTS,
    apiOnline,
  } = useAprix();

  const { t } = useLanguage();

  const displayMode = getDisplayMode();

  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll do body quando modal está aberto
  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isModalOpen]);

  // Animação de entrada/saída
  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    if (isModalOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isModalOpen]);

  const handleClose = () => {
    if (!modalRef.current || !contentRef.current) {
      closeModal();
      return;
    }

    gsap.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: closeModal,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 flex justify-center items-center z-[9999] p-5 max-sm:p-0 "
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aprix-modal-title"
      tabIndex={-1}
    >
      <div
        ref={contentRef}
        className="rounded-3xl bg-[#1c1c1cd9] aprix-border aprix-shadow backdrop-blur-sm  mt-20 w-full max-w-[680px] max-h-[90vh] sm:max-h-[75vh] md:max-h-[85vh] flex flex-col max-sm:max-h-none max-sm:h-full max-sm:w-full max-sm:max-w-none max-sm:rounded-none max-sm:mt-0 max-sm:p-0 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 aprix-border-light border-t-0 border-l-0 border-r-0">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                apiOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-white/60 text-sm">
              {apiOnline ? t("aprix.online") : t("aprix.offline")}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 border-none bg-white/10 rounded-full text-white/70 cursor-pointer flex items-center justify-center transition-all hover:bg-white/20 hover:text-white"
            aria-label={t("aprix.closeModal")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Container do Aprix - a esfera 3D será animada para cá */}
        <div
          id="aprix-modal-sphere-container"
          className="w-full flex justify-center items-center p-5 h-[125px] absolute max-sm:h-[200px] max-sm:relative -mt-8 z-20 pointer-events-none"
        >
          {/* Espaço reservado para a esfera 3D */}
        </div>

        <h2
          id="aprix-modal-title"
          className="lg:hidden self-center mb-4 m-0 text-lg font-semibold aprix-gradient-text z-20 relative"
        >
          {t("aprix.title")}
        </h2>
        {/* Chat - scroll passa por trás do container do Aprix */}
        <div className="rounded-3xl flex-1 min-h-0 p-5 pt-0 relative z-10 max-h-none sm:max-h-[350px] md:max-h-[500px] flex">
          <AprixChat
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            ttsEnabled={ttsEnabled}
            onToggleTTS={toggleTTS}
            onStopTTS={stopTTS}
            apiOnline={apiOnline}
          />
        </div>
        {/* Configurações */}
        <div className="hidden md:block px-5 py-4 aprix-border-light border-b-0 border-l-0 border-r-0">
          <label className="flex justify-between items-center cursor-pointer text-white/80 text-sm">
            <span>{t("aprix.fixedMode")}</span>
            <button
              onClick={toggleMode}
              className={`relative w-12 h-[26px] border-none rounded-[13px] cursor-pointer p-0 transition-colors duration-300 ${
                displayMode === "fixed"
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : "bg-white/20"
              }`}
              aria-pressed={displayMode === "fixed"}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  displayMode === "fixed" ? "translate-x-[22px]" : ""
                }`}
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AprixModal;
