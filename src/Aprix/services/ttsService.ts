/**
 * Text-to-Speech Service - Usa Web Speech API nativa do browser
 * Gratuito e funciona offline!
 */

// Chave para persistência no localStorage
const STORAGE_KEY = "aprix-tts-enabled";

// Callback para notificar quando está falando (para o visualizer)
type SpeakingCallback = (isSpeaking: boolean, intensity: number) => void;

class TTSService {
  private synth: SpeechSynthesis;
  private isEnabled: boolean;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;
  private speakingCallbacks: Set<SpeakingCallback> = new Set();
  private intensityInterval: ReturnType<typeof setInterval> | null = null;
  private currentIntensity: number = 0; // Para suavização
  private targetIntensity: number = 0; // Alvo para interpolar

  constructor() {
    this.synth = window.speechSynthesis;
    this.isEnabled = this.loadPreference();
    this.loadVoices();
  }

  /**
   * Carrega a preferência salva do localStorage
   */
  private loadPreference(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Se não existe preferência salva, ativa por padrão
    if (saved === null) {
      return true;
    }
    return saved === "true";
  }

  /**
   * Salva a preferência no localStorage
   */
  private savePreference(): void {
    localStorage.setItem(STORAGE_KEY, String(this.isEnabled));
  }

  /**
   * Carrega as vozes disponíveis e seleciona a melhor em português
   */
  private loadVoices(): void {
    const setVoice = () => {
      const voices = this.synth.getVoices();

      // Prioridade: pt-BR > pt-PT > qualquer pt > padrão
      this.preferredVoice =
        voices.find((v) => v.lang === "pt-BR") ||
        voices.find((v) => v.lang === "pt-PT") ||
        voices.find((v) => v.lang.startsWith("pt")) ||
        voices[0] ||
        null;

      if (this.preferredVoice) {
        console.log(
          "🔊 [TTS] Voz selecionada:",
          this.preferredVoice.name,
          this.preferredVoice.lang
        );
      }
    };

    // Algumas browsers carregam vozes de forma assíncrona
    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener("voiceschanged", setVoice, { once: true });
    }
  }

  /**
   * Configura voz e idioma para o utterance
   */
  private setVoiceForLanguage(
    utterance: SpeechSynthesisUtterance,
    lang: string
  ): void {
    const voices = this.synth.getVoices();

    let selectedVoice: SpeechSynthesisVoice | null = null;
    let utteranceLang: string;

    if (lang === "pt") {
      // Prioridade para português
      selectedVoice =
        voices.find((v) => v.lang === "pt-BR") ||
        voices.find((v) => v.lang === "pt-PT") ||
        voices.find((v) => v.lang.startsWith("pt")) ||
        null;
      utteranceLang = "pt-BR";
    } else {
      // Inglês
      selectedVoice =
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang === "en-GB") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;
      utteranceLang = "en-US";
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(
        "🔊 [TTS] Voz selecionada para",
        lang + ":",
        selectedVoice.name,
        selectedVoice.lang
      );
    }

    utterance.lang = utteranceLang;
    utterance.rate = 1.5;
    utterance.pitch = 0.8;
    utterance.volume = 1.0;
  }

  /**
   * Registra callback para ser notificado quando está falando
   */
  onSpeakingChange(callback: SpeakingCallback): () => void {
    this.speakingCallbacks.add(callback);
    return () => this.speakingCallbacks.delete(callback);
  }

  /**
   * Notifica callbacks sobre mudança de estado
   */
  private notifyCallbacks(isSpeaking: boolean, intensity: number = 0): void {
    this.speakingCallbacks.forEach((cb) => cb(isSpeaking, intensity));
  }

  /**
   * Simula intensidade de fala com suavização (Web Speech API não dá acesso ao áudio)
   */
  private startIntensitySimulation(): void {
    this.stopIntensitySimulation();
    this.currentIntensity = 0;
    this.targetIntensity = 50;

    let time = 0;
    // Simular variação de intensidade suave enquanto fala
    this.intensityInterval = setInterval(() => {
      if (this.isSpeaking) {
        time += 0.05;
        // Usar ondas senoidais sobrepostas para variação orgânica
        this.targetIntensity =
          45 +
          Math.sin(time * 3) * 15 +
          Math.sin(time * 7) * 10 +
          Math.sin(time * 11) * 5;

        // Interpolar suavemente para o alvo (lerp)
        this.currentIntensity +=
          (this.targetIntensity - this.currentIntensity) * 0.15;
        this.notifyCallbacks(true, this.currentIntensity);
      }
    }, 50); // Atualizar 20x por segundo para mais suavidade
  }

  /**
   * Para simulação de intensidade com fade-out suave
   */
  private stopIntensitySimulation(): void {
    if (this.intensityInterval) {
      clearInterval(this.intensityInterval);
      this.intensityInterval = null;
    }

    // Fade-out suave
    const fadeOut = setInterval(() => {
      this.currentIntensity *= 0.8;
      if (this.currentIntensity < 1) {
        this.currentIntensity = 0;
        clearInterval(fadeOut);
      }
      this.notifyCallbacks(false, this.currentIntensity);
    }, 30);
  }

  /**
   * Verifica se TTS está habilitado
   */
  isActive(): boolean {
    return this.isEnabled;
  }

  /**
   * Ativa/desativa o TTS
   */
  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    this.savePreference();

    // Se desativou enquanto estava falando, para
    if (!this.isEnabled && this.isSpeaking) {
      this.stop();
    }

    return this.isEnabled;
  }

  /**
   * Define o estado do TTS
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.savePreference();

    if (!enabled && this.isSpeaking) {
      this.stop();
    }
  }

  /**
   * Fala o texto fornecido
   */
  speak(text: string, lang: string = "pt"): void {
    if (!this.isEnabled || !text.trim()) {
      return;
    }

    // Limpar texto de emojis e caracteres especiais para melhor pronúncia
    const cleanText = this.cleanTextForSpeech(text);

    if (!cleanText) {
      return;
    }

    // Cancelar fala anterior se houver
    this.stop();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Configurar voz baseada no idioma
    this.setVoiceForLanguage(utterance, lang);

    // Eventos
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startIntensitySimulation();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopIntensitySimulation();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.stopIntensitySimulation();
      console.error("🔊 [TTS] Erro:", event.error);
    };

    this.synth.speak(utterance);
  }

  /**
   * Fala texto sem verificar se está habilitado (para Welcome/Stop)
   */
  speakForced(text: string, lang: string = "pt"): void {
    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    this.setVoiceForLanguage(utterance, lang);

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.startIntensitySimulation();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopIntensitySimulation();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.stopIntensitySimulation();
    };

    this.synth.speak(utterance);
  }

  /**
   * Para a fala atual
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.stopIntensitySimulation();
    }
  }

  /**
   * Verifica se está falando
   */
  speaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Limpa o texto para melhor pronúncia
   */
  private cleanTextForSpeech(text: string): string {
    return (
      text
        // Remove URLs/links
        .replace(/https?:\/\/[^\s]+/g, "")
        .replace(/www\.[^\s]+/g, "")
        // Remove emojis
        .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Símbolos
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transporte
        .replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc
        .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Suplementares
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "") // Símbolos adicionais
        .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // Variation selectors
        .replace(/[\u{200D}]/gu, "") // Zero width joiner
        // Remove markdown básico
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/_/g, " ")
        .replace(/`/g, "")
        .replace(/#{1,6}\s/g, "") // Headers markdown
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links markdown [text](url)
        // Remove múltiplos espaços
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  /**
   * Retorna lista de vozes disponíveis
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }
}

// Exportar instância única
export const ttsService = new TTSService();
export default ttsService;
