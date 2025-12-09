import { useEffect } from "react";
import { MouseState, OrbitState } from "../types";
import { TIMING, ORBIT_PARAMS } from "../constants";

export const useMouseTracking = (
  mouseState: React.MutableRefObject<MouseState>,
  orbitState: React.MutableRefObject<OrbitState>
) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;

      const deltaX = Math.abs(newX - mouseState.current.lastX);
      const deltaY = Math.abs(newY - mouseState.current.lastY);
      const isMouseMoving =
        deltaX > TIMING.mouseThreshold || deltaY > TIMING.mouseThreshold;

      if (isMouseMoving) {
        mouseState.current.isMoving = true;
      } else {
        if (mouseState.current.isMoving) {
          orbitState.current.idleTimer = 0;
          orbitState.current.shouldComeToMouse = false;
        }
        mouseState.current.isMoving = false;
      }

      // Verificar se mouse saiu da zona (200px)
      if (
        orbitState.current.isInZone &&
        (Math.abs(newX - orbitState.current.zonaCenterX) >
          ORBIT_PARAMS.zoneSize ||
          Math.abs(newY - orbitState.current.zonaCenterY) >
            ORBIT_PARAMS.zoneSize)
      ) {
        orbitState.current.isInZone = false;
        // Ao sair da zona, NÃO atualizar o centro - ela continua orbitando o último ponto onde estava
      }

      mouseState.current.lastX = newX;
      mouseState.current.lastY = newY;
      mouseState.current.x = newX;
      mouseState.current.y = newY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseState, orbitState]);
};
