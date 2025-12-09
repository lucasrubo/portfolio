import React from "react";
import { AprixProvider } from "./context/AprixContext";
import AudioVisualizer from "./AudioVisualizer";
import { AprixMode } from "./types";

interface AprixProps {
  mode?: AprixMode;
}

const Aprix: React.FC<AprixProps> = ({ mode = "follow" }) => {
  return (
    <AprixProvider initialMode={mode}>
      <AudioVisualizer />
    </AprixProvider>
  );
};

export default Aprix;
