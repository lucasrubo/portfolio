# Aprix - Assistente Virtual 3D

Um componente React interativo de assistente virtual com visualização 3D, chat com IA (Gemini) e Text-to-Speech nativo.

## 📦 Dependências

### Dependências Principais

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "three": "^0.158.0",
  "gsap": "^3.13.0",
  "@google/generative-ai": "^0.21.0"
}
```

### Dependências de Desenvolvimento

```json
{
  "@types/react": "^19.2.6",
  "@types/react-dom": "^19.2.3",
  "@types/three": "^0.181.0",
  "typescript": "^5.9.3"
}
```

## 🚀 Instalação

```bash
npm install react react-dom three gsap @google/generative-ai
npm install -D @types/react @types/react-dom @types/three typescript
```

## 📖 Uso

```tsx
import { Aprix } from "./Aprix";

function App() {
  return (
    <>
      <YourApp />
      <Aprix mode="floating" />
    </>
  );
}
```

### Props

| Prop   | Tipo                    | Padrão     | Descrição                      |
| ------ | ----------------------- | ---------- | ------------------------------ |
| `mode` | `"floating" \| "fixed"` | `floating` | Modo de exibição do assistente |

## 🎨 Características

- **Visualização 3D**: Esfera icosaédrica com wireframe animado e efeitos de bloom
- **Chat com IA**: Integração com Google Gemini para conversas inteligentes
- **Text-to-Speech**: Web Speech API nativa (gratuita e offline)
- **Drag & Drop**: Arraste a esfera pela tela (desktop)
- **Animações Suaves**: Movimentação fluida usando GSAP
- **Interação com Mouse**: Segue o cursor quando parado por 1 segundo
- **Órbita Dinâmica**: Movimento orbital orgânico e não-linear
- **Scroll Lock**: Inicialmente fixo no canto, liberado após scroll
- **Responsivo**: Funciona em mobile e desktop
- **Visualizador Reativo**: Pulsa conforme o TTS fala

## 📂 Estrutura de Arquivos

```
Aprix/
├── AudioVisualizer.tsx       # Esfera 3D principal
├── index.tsx                 # Export público
├── types.ts                  # Definições de tipos TypeScript
├── constants.ts              # Constantes configuráveis
├── README.md                 # Documentação
├── vertex.glsl               # Vertex shader
├── fragment.glsl             # Fragment shader
├── components/
│   ├── AprixModal.tsx        # Modal do chat
│   └── AprixChat.tsx         # Interface do chat
├── context/
│   └── AprixContext.tsx      # Estado global e lógica
├── services/
│   ├── geminiService.ts      # Integração com Gemini API
│   ├── ttsService.ts         # Text-to-Speech service
│   └── index.ts              # Exports
├── prompts/
│   └── systemPrompt.ts       # Prompt do assistente
├── hooks/
│   ├── useMouseTracking.ts   # Hook de rastreamento do mouse
│   └── useScrollUnlock.ts    # Hook de desbloqueio por scroll
└── utils/
    ├── sceneSetup.ts         # Configuração da cena Three.js
    └── orbitCalculations.ts  # Cálculos de órbita e posição
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_GEMINI_API_KEY=sua_api_key_aqui
```

### Personalização do Assistente

Edite `prompts/systemPrompt.ts` para customizar:

- Personalidade e tom de voz
- Conhecimentos e informações
- Instruções de comportamento

### Constantes (constants.ts)

- **CONTAINER_SIZE**: Tamanho do visualizador (75x75px)
- **ORBIT_PARAMS**: Raio, velocidade e variação da órbita
- **TIMING**: Delays e durações das animações
- **BLOOM_PARAMS**: Intensidade dos efeitos de bloom
- **BALL_COLORS**: Cores da esfera (primary/secondary)
- **AUDIO**: Frequência base e multiplicador para TTS

## 🎯 Comportamento

### Esfera 3D

1. **Início**: Fixo no canto inferior direito
2. **Após scroll**: Liberado para movimento (modo floating)
3. **Mouse parado 1s**: Vai suavemente até a área do mouse
4. **Na zona do mouse**: Orbita em raio de 80-100px
5. **Clique**: Abre o modal de chat

### Text-to-Speech

- Ativado por padrão
- Mensagem de boas-vindas na primeira visita
- Mensagem de despedida ao fechar
- Visualizador pulsa conforme a fala
- Toggle para ativar/desativar no chat

### Chat com IA

- Rate limiting automático (5 req/min)
- Histórico de conversas na sessão
- Respostas limpas para TTS (sem emojis/links)

## 📝 Notas Técnicas

- Usa shaders GLSL customizados para efeitos visuais
- `WebGLRenderer` com transparência habilitada
- Post-processing com UnrealBloomPass
- Web Speech API para TTS (suporte pt-BR)
- Otimizado para performance com `requestAnimationFrame`
- Clean code com separação de responsabilidades

## 📄 Licença

Parte do projeto Aprix - MIT License
