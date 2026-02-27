import { useEffect } from "react";
import { PositionState } from "../types";
import { UNLOCK_SCROLL_HEIGHT } from "../constants";

export const useScrollUnlock = (
  positionState: React.MutableRefObject<PositionState>,
  isFixedMode: boolean = false
) => {
  useEffect(() => {
    // Se está em modo fixo, não fazer nada com scroll
    if (isFixedMode) {
      positionState.current.isLocked = true;
      return;
    }

    const handleScroll = () => {
      const scrollDistance = window.scrollY;
      positionState.current.scrollDistance = scrollDistance;

      // Liberar quando scroll >= 100vh
      if (
        scrollDistance >= UNLOCK_SCROLL_HEIGHT &&
        positionState.current.isLocked
      ) {
        positionState.current.isLocked = false;
      }

      // Prender novamente quando voltar ao topo (scroll < 100vh)
      if (
        scrollDistance < UNLOCK_SCROLL_HEIGHT &&
        !positionState.current.isLocked
      ) {
        positionState.current.isLocked = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [positionState, isFixedMode]);
};
