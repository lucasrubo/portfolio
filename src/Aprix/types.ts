/**
 * Types for Aprix Component and Assistant
 */

// ============ Visualizer Types ============

export interface AudioVisualizerProps {
  // Props vazias - TTS usado em vez de áudio MP3
}

export interface OrbitState {
  isInZone: boolean;
  zonaCenterX: number;
  zonaCenterY: number;
  shouldComeToMouse: boolean;
  idleTimer: number;
  initialOrbitAngle: number;
}

export interface MouseState {
  x: number;
  y: number;
  isMoving: boolean;
  lastX: number;
  lastY: number;
}

export interface PositionState {
  currentX: number;
  currentY: number;
  isLocked: boolean;
  scrollDistance: number;
}

// ============ Assistant Types ============

export type AprixMode = "follow" | "fixed";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AprixState {
  isModalOpen: boolean;
  mode: AprixMode;
  messages: ChatMessage[];
  isLoading: boolean;
  ttsEnabled: boolean;
}

export interface AprixContextType extends AprixState {
  openModal: () => void;
  closeModal: () => void;
  toggleMode: () => void;
  setMode: (mode: AprixMode) => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  getDisplayMode: () => AprixMode;
  toggleTTS: () => void;
  stopTTS: () => void;
}

export interface AprixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AprixChatProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  ttsEnabled: boolean;
  onToggleTTS: () => void;
  onStopTTS: () => void;
}

export interface AprixProviderProps {
  children: React.ReactNode;
  initialMode?: AprixMode;
}

// ============ Gemini Service Types ============

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export interface GeminiServiceConfig {
  apiKey: string;
  model?: string;
}
