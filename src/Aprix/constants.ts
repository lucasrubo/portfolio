// Tamanhos do Aprix (valores numéricos para uso no JS - fonte de verdade: CSS variables no index.css)
export const CONTAINER_SIZE = {
  width: 75, // Sincronizado com --aprix-size
  height: 75, // Sincronizado com --aprix-size
} as const;

export const MODAL_SPHERE_SIZE = 280; // Sincronizado com --aprix-modal-size

export const OFFSET_FROM_EDGE = 20; // Sincronizado com --aprix-offset

export const BLOOM_PARAMS = {
  threshold: 0.1,
  strength: 0.0,
  radius: 0,
} as const;

export const ORBIT_PARAMS = {
  baseRadius: 80,
  radiusVariation: 20,
  offsetRadius: 50,
  zoneSize: 100,
  speed1: 0.3,
  speed2: 0.5,
  variationSpeed: 0.2,
  additionalOffset: 30,
  lerpFactor: 5.0,
} as const;

export const TIMING = {
  idleDelay: 1.0,
  tweenDuration: 2.0,
  mouseThreshold: 1.0,
} as const;

export const GEOMETRY = {
  radius: 4,
  detail: 2,
} as const;

export const AUDIO = {
  fftSize: 32,
  frequencyMultiplier: 1.5, // Aumentado para mais reatividade ao TTS
  baseFrequency: 0.15, // Frequência base para manter animação "viva"
} as const;

export const ROTATION_SPEED = 0.6;

export const UNLOCK_SCROLL_HEIGHT =
  typeof window !== "undefined" ? window.innerHeight : 0;

// Cores da bola (RGB de 0.0 a 1.0) - Baseado no design system
// --primary: 195 100% 50% (ciano) → hsl(195, 100%, 50%) → rgb(0, 191, 255) → (0.0, 0.75, 1.0)
// --secondary: 260 60% 55% (roxo) → hsl(260, 60%, 55%) → rgb(122, 71, 194) → (0.48, 0.28, 0.76)
export const BALL_COLORS = {
  secondary: { r: 0.0, g: 0.75, b: 1.0 }, // Ciano (--primary)
  primary: { r: 0.48, g: 0.28, b: 0.76 }, // Roxo (--secondary)
} as const;

// Configurações do efeito blob/gota
export const BLOB_CONFIG = {
  trailCount: 1, // Temporariamente 1 para testar
  sizes: [80], // Maior para visibilidade
  opacities: [0.8], // Mais opaco
  fillColor: "#122936", // Cyan color to match the sphere
  filterId: "aprix-blob",
  filterStdDeviation: 15, // Reduzido de 35 para 15 para menos blur
  filterColorMatrixValues: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -8",
  fastDuration: 0.1,
  slowDuration: 0.4,
  fastEase: "power3.out",
  slowEase: "power1.out",
} as const;
