import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import {
  AudioVisualizerProps,
  MouseState,
  OrbitState,
  PositionState,
} from "./types";
import { useMouseTracking } from "./hooks/useMouseTracking";
import { useScrollUnlock } from "./hooks/useScrollUnlock";
import { useAprix } from "./context";
import { ttsService } from "./services";
import {
  createRenderer,
  createScene,
  createCamera,
  createComposer,
  createMesh,
} from "./utils/sceneSetup";
import {
  calculateOrbitPosition,
  calculateTargetPosition,
  clampPosition,
} from "./utils/orbitCalculations";
import {
  CONTAINER_SIZE,
  OFFSET_FROM_EDGE,
  MODAL_SPHERE_SIZE,
  TIMING,
  ORBIT_PARAMS,
  ROTATION_SPEED,
  AUDIO,
  BLOB_CONFIG,
} from "./constants";

const AudioVisualizer: React.FC<AudioVisualizerProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const returnTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // Integração com contexto do Aprix
  const { openModal, mode, isModalOpen, setMode } = useAprix();
  const isFixedMode = mode === "fixed";

  // Ref para acessar isModalOpen dentro do loop de animação
  const isModalOpenRef = useRef(isModalOpen);
  useEffect(() => {
    isModalOpenRef.current = isModalOpen;

    // Redimensionar o canvas quando o modal abre/fecha
    if (rendererRef.current && cameraRef.current && composerRef.current) {
      const size = isModalOpen ? MODAL_SPHERE_SIZE : CONTAINER_SIZE.width;
      rendererRef.current.setSize(size, size);
      cameraRef.current.aspect = 1;
      cameraRef.current.updateProjectionMatrix();
      composerRef.current.setSize(size, size);
    }
  }, [isModalOpen]);

  // Estados para drag e throw
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const dragInitialPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const isThrowingRef = useRef(false);

  // Refs para blob effect
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Ref para intensidade do TTS (quando está falando)
  const ttsIntensityRef = useRef<number>(0);

  // Refs para Three.js (para redimensionar)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<ReturnType<typeof createComposer> | null>(null);

  const positionState = useRef<PositionState>({
    currentX: window.innerWidth - CONTAINER_SIZE.width - OFFSET_FROM_EDGE,
    currentY: window.innerHeight - CONTAINER_SIZE.height - OFFSET_FROM_EDGE,
    isLocked: true,
    scrollDistance: 0,
  });

  const mouseState = useRef<MouseState>({
    x: 0,
    y: 0,
    isMoving: false,
    lastX: 0,
    lastY: 0,
  });

  const orbitState = useRef<OrbitState>({
    isInZone: false,
    zonaCenterX: 0,
    zonaCenterY: 0,
    shouldComeToMouse: false,
    idleTimer: 0,
    initialOrbitAngle: 0,
  });

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || "ontouchstart" in window;
      setIsMobile(mobile);
      if (mobile) {
        setMode("fixed");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setMode]);

  // Registrar callback do TTS para o visualizer reagir à voz
  useEffect(() => {
    const unsubscribe = ttsService.onSpeakingChange((isSpeaking, intensity) => {
      ttsIntensityRef.current = isSpeaking ? intensity : 0;
    });
    return unsubscribe;
  }, []);

  // Forçar posição fixa em mobile ou modo fixo
  useEffect(() => {
    if (isMobile || isFixedMode) {
      positionState.current.isLocked = true;
    }
  }, [isMobile, isFixedMode]);

  useMouseTracking(mouseState, orbitState);
  useScrollUnlock(positionState, isFixedMode);

  // Animar para o modal quando abre
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    if (isModalOpen) {
      // Cancelar qualquer animação em andamento
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
        activeTweenRef.current = null;
      }
      if (returnTweenRef.current) {
        returnTweenRef.current.kill();
        returnTweenRef.current = null;
      }

      // Parar física de arremesso
      isThrowingRef.current = false;
      isDraggingRef.current = false;
      velocityRef.current = { x: 0, y: 0 };

      // Resetar estados de órbita
      orbitState.current.isInZone = false;
      orbitState.current.shouldComeToMouse = false;
      orbitState.current.idleTimer = 0;

      // Aguardar o modal renderizar e encontrar o container
      const findModalContainer = () => {
        const modalContainer = document.getElementById(
          "aprix-modal-sphere-container"
        );
        if (modalContainer) {
          // Aguardar para o modal terminar a animação de entrada (400ms no modal)
          setTimeout(() => {
            const rect = modalContainer.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2 - MODAL_SPHERE_SIZE / 2;
            const targetY = rect.top + rect.height / 2 - MODAL_SPHERE_SIZE / 2;

            // Aumentar z-index para ficar acima do modal
            container.style.zIndex = "10000";

            // Animar para o centro do container do modal
            gsap.to(container, {
              left: targetX,
              top: targetY,
              width: MODAL_SPHERE_SIZE,
              height: MODAL_SPHERE_SIZE,
              duration: 0.4,
              ease: "power2.out",
            });
          }, 350); // Aguardar animação do modal (400ms - um pouco menos para overlap suave)
        } else {
          // Tentar novamente após um breve delay
          requestAnimationFrame(findModalContainer);
        }
      };

      requestAnimationFrame(findModalContainer);

      // Esconder blobs durante modal
      blobsRef.current.forEach((el) => {
        if (el) {
          gsap.to(el, { opacity: 0, duration: 0.3 });
        }
      });
    } else {
      // Resetar z-index
      container.style.zIndex = "999";

      // Forçar posição locked para animação de retorno
      positionState.current.isLocked = true;

      // Voltar para a posição original
      const targetX =
        window.innerWidth - CONTAINER_SIZE.width - OFFSET_FROM_EDGE;
      const targetY =
        window.innerHeight - CONTAINER_SIZE.height - OFFSET_FROM_EDGE;

      gsap.to(container, {
        left: targetX,
        top: targetY,
        width: CONTAINER_SIZE.width,
        height: CONTAINER_SIZE.height,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Atualizar posição no state após animação
          positionState.current.currentX = targetX;
          positionState.current.currentY = targetY;

          // Resetar blobs para a posição correta
          const blobTargetX = targetX + CONTAINER_SIZE.width / 2;
          const blobTargetY = targetY + CONTAINER_SIZE.height / 2;
          blobsRef.current.forEach((el) => {
            if (el) {
              el.style.left = `${blobTargetX}px`;
              el.style.top = `${blobTargetY}px`;
            }
          });
        },
      });

      // Mostrar blobs novamente
      blobsRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            opacity: BLOB_CONFIG.opacities[i],
            duration: 0.3,
            delay: 0.3,
          });
        }
      });
    }
  }, [isModalOpen]);

  // Inicializar posição dos blobs
  useEffect(() => {
    // Usar posição relativa ao viewport, não ao documento
    const initialX =
      window.innerWidth - CONTAINER_SIZE.width / 2 - OFFSET_FROM_EDGE;
    const initialY =
      window.innerHeight - CONTAINER_SIZE.height / 2 - OFFSET_FROM_EDGE;

    blobsRef.current.forEach((el, i) => {
      if (!el) {
        console.log("Blob ref", i, "is null");
        return;
      }
      el.style.left = `${initialX}px`;
      el.style.top = `${initialY}px`;
      el.style.transform = `translate(-50%, -50%)`;
    });
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const renderer = createRenderer(container);
    const scene = createScene();
    const camera = createCamera();
    const bloomComposer = createComposer(renderer, scene, camera);
    const { mesh, uniforms } = createMesh();
    scene.add(mesh);

    // Salvar refs para redimensionamento
    rendererRef.current = renderer;
    cameraRef.current = camera;
    composerRef.current = bloomComposer;

    // TTS é usado para áudio agora (sem MP3)

    // Posicionar o div inicial
    container.style.position = "fixed";
    container.style.left = `${positionState.current.currentX}px`;
    container.style.top = `${positionState.current.currentY}px`;

    const clock = new THREE.Clock();

    // Função para calcular frequência do TTS com pulsação base
    const getTTSFrequency = (): number => {
      const time = clock.getElapsedTime();
      // Pulsação base suave para manter a bola "viva"
      const basePulse = AUDIO.baseFrequency * (1 + 0.3 * Math.sin(time * 2));
      // Intensidade do TTS quando está falando
      const ttsIntensity = ttsIntensityRef.current * AUDIO.frequencyMultiplier;
      // Retorna o maior entre a pulsação base e a intensidade TTS
      return Math.max(basePulse, ttsIntensity);
    };

    const animate = () => {
      const deltaTime = clock.getDelta();
      const { currentX, currentY, isLocked } = positionState.current;

      // Se o modal está aberto, apenas renderizar sem mover
      if (isModalOpenRef.current) {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = getTTSFrequency();
        mesh.rotation.y += deltaTime * ROTATION_SPEED;
        bloomComposer.render();
        requestAnimationFrame(animate);
        return;
      }

      // Se está sendo animado de volta ao canto, não fazer nada
      if (returnTweenRef.current) {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = getTTSFrequency();
        mesh.rotation.y += deltaTime * ROTATION_SPEED;
        bloomComposer.render();
        requestAnimationFrame(animate);
        return;
      }

      // Física de arremesso
      if (isThrowingRef.current && !isDraggingRef.current) {
        // Aplicar velocidade
        positionState.current.currentX += velocityRef.current.x * deltaTime;
        positionState.current.currentY += velocityRef.current.y * deltaTime;

        // Aplicar atrito
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;

        // Clamping
        const { clampedX, clampedY } = clampPosition(
          positionState.current.currentX,
          positionState.current.currentY
        );
        positionState.current.currentX = clampedX;
        positionState.current.currentY = clampedY;

        if (container) {
          container.style.left = `${clampedX}px`;
          container.style.top = `${clampedY}px`;
        }

        // Atualizar blobs durante throw
        const targetBlobX = clampedX + CONTAINER_SIZE.width / 2;
        const targetBlobY = clampedY + CONTAINER_SIZE.height / 2;

        blobsRef.current.forEach((el, i) => {
          if (!el) return;
          const currentX = parseFloat(el.style.left) || targetBlobX;
          const currentY = parseFloat(el.style.top) || targetBlobY;

          const lerpSpeed = i === 0 ? 0.2 : 0.1 - i * 0.02;
          const newX = currentX + (targetBlobX - currentX) * lerpSpeed;
          const newY = currentY + (targetBlobY - currentY) * lerpSpeed;

          el.style.left = `${newX}px`;
          el.style.top = `${newY}px`;
        });

        // Parar quando velocidade for muito baixa
        if (
          Math.abs(velocityRef.current.x) < 10 &&
          Math.abs(velocityRef.current.y) < 10
        ) {
          isThrowingRef.current = false;
          velocityRef.current = { x: 0, y: 0 };
        }

        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = getTTSFrequency();
        mesh.rotation.y += deltaTime * ROTATION_SPEED;
        bloomComposer.render();
        requestAnimationFrame(animate);
        return;
      }

      // Durante drag, não fazer nada
      if (isDraggingRef.current) {
        // Atualizar blobs durante drag
        const targetBlobX =
          positionState.current.currentX + CONTAINER_SIZE.width / 2;
        const targetBlobY =
          positionState.current.currentY + CONTAINER_SIZE.height / 2;

        blobsRef.current.forEach((el, i) => {
          if (!el) return;
          const currentX = parseFloat(el.style.left) || targetBlobX;
          const currentY = parseFloat(el.style.top) || targetBlobY;

          const lerpSpeed = i === 0 ? 0.25 : 0.12 - i * 0.03;
          const newX = currentX + (targetBlobX - currentX) * lerpSpeed;
          const newY = currentY + (targetBlobY - currentY) * lerpSpeed;

          el.style.left = `${newX}px`;
          el.style.top = `${newY}px`;
        });

        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = getTTSFrequency();
        mesh.rotation.y += deltaTime * ROTATION_SPEED;
        bloomComposer.render();
        requestAnimationFrame(animate);
        return;
      }

      if (isLocked) {
        // Animar retorno ao canto se ainda não está animando
        if (!returnTweenRef.current) {
          // Cancelar animações ativas
          if (activeTweenRef.current) {
            activeTweenRef.current.kill();
            activeTweenRef.current = null;
          }

          // Resetar estados
          orbitState.current.isInZone = false;
          orbitState.current.shouldComeToMouse = false;
          orbitState.current.idleTimer = 0;

          const targetX =
            window.innerWidth - CONTAINER_SIZE.width - OFFSET_FROM_EDGE;
          const targetY =
            window.innerHeight - CONTAINER_SIZE.height - OFFSET_FROM_EDGE;

          returnTweenRef.current = gsap.to(
            { x: currentX, y: currentY },
            {
              x: targetX,
              y: targetY,
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: function () {
                positionState.current.currentX = this.targets()[0].x;
                positionState.current.currentY = this.targets()[0].y;

                if (container) {
                  container.style.left = `${this.targets()[0].x}px`;
                  container.style.top = `${this.targets()[0].y}px`;
                }

                // Atualizar blobs durante retorno
                const targetBlobX =
                  this.targets()[0].x + CONTAINER_SIZE.width / 2;
                const targetBlobY =
                  this.targets()[0].y + CONTAINER_SIZE.height / 2;

                blobsRef.current.forEach((el, i) => {
                  if (!el) return;
                  const currentX = parseFloat(el.style.left) || targetBlobX;
                  const currentY = parseFloat(el.style.top) || targetBlobY;

                  const lerpSpeed = i === 0 ? 0.15 : 0.08 - i * 0.02;
                  const newX = currentX + (targetBlobX - currentX) * lerpSpeed;
                  const newY = currentY + (targetBlobY - currentY) * lerpSpeed;

                  el.style.left = `${newX}px`;
                  el.style.top = `${newY}px`;
                });
              },
              onComplete: () => {
                returnTweenRef.current = null;
              },
            }
          );
        }
      } else {
        // Se desbloqueou durante animação de retorno, cancelar
        if (returnTweenRef.current) {
          (returnTweenRef.current as gsap.core.Tween).kill();
          returnTweenRef.current = null;
        }
        // Liberado
        const { isMoving } = mouseState.current;
        const { isInZone, shouldComeToMouse } = orbitState.current;

        if (!isMoving && !isInZone) {
          orbitState.current.idleTimer += deltaTime;

          if (
            orbitState.current.idleTimer >= TIMING.idleDelay &&
            !shouldComeToMouse
          ) {
            orbitState.current.shouldComeToMouse = true;
            orbitState.current.initialOrbitAngle = Math.random() * Math.PI * 2;
            orbitState.current.zonaCenterX = mouseState.current.x;
            orbitState.current.zonaCenterY = mouseState.current.y;
          }
        } else if (isMoving) {
          orbitState.current.idleTimer = 0;
          // Não cancelar mais - deixar orbitando mesmo com mouse movendo
        }

        if (shouldComeToMouse && !activeTweenRef.current) {
          // Ir até o mouse
          const { targetX, targetY } = calculateTargetPosition(
            orbitState.current.zonaCenterX,
            orbitState.current.zonaCenterY,
            orbitState.current.initialOrbitAngle
          );

          activeTweenRef.current = gsap.to(
            { x: currentX, y: currentY },
            {
              x: targetX,
              y: targetY,
              duration: TIMING.tweenDuration,
              ease: "power1.inOut",
              onUpdate: function () {
                const { clampedX, clampedY } = clampPosition(
                  this.targets()[0].x,
                  this.targets()[0].y
                );
                positionState.current.currentX = clampedX;
                positionState.current.currentY = clampedY;

                if (container) {
                  container.style.left = `${clampedX}px`;
                  container.style.top = `${clampedY}px`;
                }
              },
              onComplete: () => {
                orbitState.current.isInZone = true;
                orbitState.current.shouldComeToMouse = false;
                activeTweenRef.current = null;
              },
            }
          );
        } else if (!shouldComeToMouse) {
          // Orbitar
          const time = clock.getElapsedTime();
          const { targetX, targetY } = calculateOrbitPosition(
            time,
            isInZone,
            orbitState.current.zonaCenterX,
            orbitState.current.zonaCenterY,
            currentX,
            currentY
          );

          const dx = targetX - currentX;
          const dy = targetY - currentY;

          const lerpFactor = ORBIT_PARAMS.lerpFactor * deltaTime;
          positionState.current.currentX += dx * lerpFactor;
          positionState.current.currentY += dy * lerpFactor;

          const { clampedX, clampedY } = clampPosition(
            positionState.current.currentX,
            positionState.current.currentY
          );
          positionState.current.currentX = clampedX;
          positionState.current.currentY = clampedY;

          if (container) {
            container.style.left = `${clampedX}px`;
            container.style.top = `${clampedY}px`;
          }
        }
      }

      // Atualizar blobs para seguir a bola (sem criar novos tweens a cada frame)
      const targetBlobX =
        positionState.current.currentX + CONTAINER_SIZE.width / 2;
      const targetBlobY =
        positionState.current.currentY + CONTAINER_SIZE.height / 2;

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const currentX = parseFloat(el.style.left) || targetBlobX;
        const currentY = parseFloat(el.style.top) || targetBlobY;

        const lerpSpeed = i === 0 ? 0.3 : 0.15 - i * 0.03;
        const newX = currentX + (targetBlobX - currentX) * lerpSpeed;
        const newY = currentY + (targetBlobY - currentY) * lerpSpeed;

        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
      });

      uniforms.u_time.value = clock.getElapsedTime();
      uniforms.u_frequency.value = getTTSFrequency();
      mesh.rotation.y += deltaTime * ROTATION_SPEED;

      bloomComposer.render();
      requestAnimationFrame(animate);
    };

    animate();

    // Chave para verificar se é primeira visita
    const WELCOME_KEY = "aprix-welcome-shown";

    const playHandler = () => {
      // TTS Welcome apenas na primeira vez
      const hasShownWelcome = localStorage.getItem(WELCOME_KEY);
      if (!hasShownWelcome) {
        ttsService.speakForced(
          "Olá! Sou o Aprix, assistente virtual do Lucas. Como posso ajudar?"
        );
        localStorage.setItem(WELCOME_KEY, "true");
      }
    };

    const stopHandler = () => {
      // TTS Stop
      ttsService.speakForced("A-Í!!");
    };

    // Handler para abrir modal (referência externa)
    const handleOpenModal = () => {
      playHandler();
      openModal();
    };

    // Salvar referência para uso externo
    (container as HTMLDivElement & { __openModal?: () => void }).__openModal =
      handleOpenModal;

    // Handlers para drag e throw
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevenir comportamento padrão do click

      // Bloquear drag se modal está aberto
      if (isModalOpenRef.current) {
        return;
      }

      // Se está fixo (locked), abrir modal e tocar som no clique
      if (isMobile || positionState.current.isLocked) {
        handleOpenModal();
        return;
      }

      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
      dragInitialPosRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      // Cancelar animações
      if (activeTweenRef.current) {
        activeTweenRef.current.kill();
        activeTweenRef.current = null;
      }
      if (returnTweenRef.current) {
        (returnTweenRef.current as gsap.core.Tween).kill();
        returnTweenRef.current = null;
      }

      orbitState.current.isInZone = false;
      orbitState.current.shouldComeToMouse = false;
      isThrowingRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Bloquear se modal aberto ou não está arrastando
      if (isModalOpenRef.current || !isDraggingRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Atualizar posição durante drag
      positionState.current.currentX += deltaX;
      positionState.current.currentY += deltaY;

      const { clampedX, clampedY } = clampPosition(
        positionState.current.currentX,
        positionState.current.currentY
      );
      positionState.current.currentX = clampedX;
      positionState.current.currentY = clampedY;

      if (container) {
        container.style.left = `${clampedX}px`;
        container.style.top = `${clampedY}px`;
      }

      dragStartRef.current.x = e.clientX;
      dragStartRef.current.y = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const timeDelta = Date.now() - dragStartRef.current.time;
      const totalDeltaX = e.clientX - dragInitialPosRef.current.x;
      const totalDeltaY = e.clientY - dragInitialPosRef.current.y;
      const totalDistance = Math.sqrt(
        totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY
      );

      // Se foi um clique rápido (< 250ms e < 10px movimento total), abrir modal
      if (timeDelta < 250 && totalDistance < 10) {
        handleOpenModal();
        isDraggingRef.current = false;

        // Manter a bola orbitando perto do mouse - não sair voando
        orbitState.current.isInZone = true;
        orbitState.current.zonaCenterX = e.clientX;
        orbitState.current.zonaCenterY = e.clientY;
        return;
      }

      // Se houve movimento significativo, calcular velocidade para arremesso
      if (totalDistance >= 10) {
        const velocity = {
          x: (totalDeltaX / (timeDelta / 1000)) * 0.5,
          y: (totalDeltaY / (timeDelta / 1000)) * 0.5,
        };

        velocityRef.current = velocity;
        isThrowingRef.current = true;

        // Parar som ao soltar (drag and drop)
        stopHandler();
      }

      isDraggingRef.current = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [openModal, isMobile, isFixedMode]);

  return (
    <>
      {/* SVG Filter para efeito blob */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id={BLOB_CONFIG.filterId}>
          <feGaussianBlur
            in="SourceGraphic"
            result="blur"
            stdDeviation={BLOB_CONFIG.filterStdDeviation}
          />
          <feColorMatrix
            in="blur"
            values={BLOB_CONFIG.filterColorMatrixValues}
          />
        </filter>
      </svg>

      {/* Blobs de fundo (efeito gota) - só em desktop */}
      {!isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 998,
            // filter: `url(#${BLOB_CONFIG.filterId})`, // Temporariamente removido para testar
          }}
        >
          {Array.from({ length: BLOB_CONFIG.trailCount }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                blobsRef.current[i] = el;
              }}
              style={{
                position: "absolute",
                width: BLOB_CONFIG.sizes[i],
                height: BLOB_CONFIG.sizes[i],
                borderRadius: "50%",
                backgroundColor: BLOB_CONFIG.fillColor,
                opacity: BLOB_CONFIG.opacities[i],
                transform: "translate(-50%, -50%)",
                willChange: "transform",
              }}
            />
          ))}
        </div>
      )}

      {/* Container da bola 3D */}
      <div
        ref={mountRef}
        style={{
          position: "fixed",
          width: `${CONTAINER_SIZE.width}px`,
          height: `${CONTAINER_SIZE.height}px`,
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor:
            isMobile || positionState.current.isLocked ? "default" : "grab",
        }}
      />
    </>
  );
};

export default AudioVisualizer;
