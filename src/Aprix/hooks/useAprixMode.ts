import { useCallback } from "react";
import { useAprix } from "../context";
import type { AprixMode } from "../types";

interface UseAprixModeReturn {
  mode: AprixMode;
  isFixed: boolean;
  isFollowing: boolean;
  toggleMode: () => void;
  setMode: (mode: AprixMode) => void;
}

/**
 * Hook para gerenciar o modo de comportamento do Aprix
 * - 'follow': Aprix segue o mouse durante a navegação
 * - 'fixed': Aprix fica fixo no canto inferior direito
 */
export const useAprixMode = (): UseAprixModeReturn => {
  const { mode, toggleMode, setMode } = useAprix();

  const isFixed = mode === "fixed";
  const isFollowing = mode === "follow";

  const handleSetMode = useCallback(
    (newMode: AprixMode) => {
      setMode(newMode);
    },
    [setMode]
  );

  return {
    mode,
    isFixed,
    isFollowing,
    toggleMode,
    setMode: handleSetMode,
  };
};

export default useAprixMode;
