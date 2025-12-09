import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type {
  AprixContextType,
  AprixState,
  AprixMode,
  ChatMessage,
  AprixProviderProps,
} from "../types";
import { geminiService, ttsService } from "../services";

const STORAGE_KEY = "aprix-mode";
const MESSAGES_STORAGE_KEY = "aprix-messages";

/**
 * Carrega mensagens salvas do localStorage
 */
const loadSavedMessages = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Converter timestamps string de volta para Date
      return parsed.map((msg: ChatMessage & { timestamp: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error loading saved messages:", error);
  }
  return [];
};

/**
 * Salva mensagens no localStorage
 */
const saveMessages = (messages: ChatMessage[]): void => {
  try {
    // Limitar a 50 mensagens para não sobrecarregar o storage
    const messagesToSave = messages.slice(-50);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesToSave));
  } catch (error) {
    console.error("Error saving messages:", error);
  }
};

const initialState: AprixState = {
  isModalOpen: false,
  mode: "follow",
  messages: [],
  isLoading: false,
  ttsEnabled: ttsService.isActive(),
};

const AprixContext = createContext<AprixContextType | undefined>(undefined);

/**
 * Generates a unique ID for messages
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * AprixProvider - Global state provider for Aprix Assistant
 */
export const AprixProvider: React.FC<AprixProviderProps> = ({
  children,
  initialMode,
}) => {
  const [state, setState] = useState<AprixState>(() => {
    // Recuperar modo salvo do localStorage
    const savedMode = localStorage.getItem(STORAGE_KEY) as AprixMode | null;
    // Recuperar mensagens salvas
    const savedMessages = loadSavedMessages();
    return {
      ...initialState,
      mode: savedMode || initialMode || "follow",
      messages: savedMessages,
    };
  });

  // Modo pendente que será aplicado ao fechar o modal
  const [pendingMode, setPendingMode] = useState<AprixMode | null>(null);

  // Persistir modo no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, state.mode);
  }, [state.mode]);

  // Persistir mensagens no localStorage
  useEffect(() => {
    if (state.messages.length > 0) {
      saveMessages(state.messages);
    }
  }, [state.messages]);

  const openModal = useCallback(() => {
    // Ao abrir, resetar o pending mode
    setPendingMode(null);
    setState((prev) => ({ ...prev, isModalOpen: true }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => {
      // Aplicar o modo pendente ao fechar, se houver
      const newMode = pendingMode !== null ? pendingMode : prev.mode;
      return { ...prev, isModalOpen: false, mode: newMode };
    });
    setPendingMode(null);
  }, [pendingMode]);

  const toggleMode = useCallback(() => {
    if (state.isModalOpen) {
      // Se o modal está aberto, apenas atualiza o pending mode
      const currentMode = pendingMode !== null ? pendingMode : state.mode;
      setPendingMode(currentMode === "follow" ? "fixed" : "follow");
    } else {
      // Se modal fechado, muda diretamente
      setState((prev) => ({
        ...prev,
        mode: prev.mode === "follow" ? "fixed" : "follow",
      }));
    }
  }, [state.isModalOpen, state.mode, pendingMode]);

  const setMode = useCallback(
    (mode: AprixMode) => {
      if (state.isModalOpen) {
        setPendingMode(mode);
      } else {
        setState((prev) => ({ ...prev, mode }));
      }
    },
    [state.isModalOpen]
  );

  // Getter para o modo visual (usado no toggle do modal)
  const getDisplayMode = useCallback((): AprixMode => {
    if (state.isModalOpen && pendingMode !== null) {
      return pendingMode;
    }
    return state.mode;
  }, [state.isModalOpen, state.mode, pendingMode]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Parar TTS se estiver falando
      ttsService.stop();

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
      }));

      try {
        // Chamar o serviço do Gemini
        const response = await geminiService.sendMessage(
          content.trim(),
          state.messages
        );

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));

        // Falar a resposta se TTS estiver ativo
        ttsService.speak(response);
      } catch (error) {
        console.error("Error sending message:", error);

        const errorMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content:
            "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          isLoading: false,
        }));
      }
    },
    [state.messages]
  );

  const clearMessages = useCallback(() => {
    geminiService.resetHistory();
    ttsService.stop();
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    setState((prev) => ({ ...prev, messages: [] }));
  }, []);

  const toggleTTS = useCallback(() => {
    const newState = ttsService.toggle();
    setState((prev) => ({ ...prev, ttsEnabled: newState }));
  }, []);

  const stopTTS = useCallback(() => {
    ttsService.stop();
  }, []);

  const value: AprixContextType = {
    ...state,
    openModal,
    closeModal,
    toggleMode,
    setMode,
    sendMessage,
    clearMessages,
    getDisplayMode,
    toggleTTS,
    stopTTS,
  };

  return (
    <AprixContext.Provider value={value}>{children}</AprixContext.Provider>
  );
};

/**
 * Hook to access Aprix context
 */
export const useAprix = (): AprixContextType => {
  const context = useContext(AprixContext);
  if (!context) {
    throw new Error("useAprix must be used within an AprixProvider");
  }
  return context;
};

export default AprixContext;
