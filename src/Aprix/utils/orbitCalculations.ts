import { CONTAINER_SIZE, ORBIT_PARAMS } from "../constants";

export const calculateOrbitPosition = (
  time: number,
  isInZone: boolean,
  zonaCenterX: number,
  zonaCenterY: number,
  currentX: number,
  currentY: number
) => {
  const radius =
    ORBIT_PARAMS.baseRadius +
    Math.sin(time * ORBIT_PARAMS.variationSpeed) * ORBIT_PARAMS.radiusVariation;

  let centerX: number, centerY: number;
  if (isInZone) {
    centerX = zonaCenterX;
    centerY = zonaCenterY;
  } else {
    centerX = currentX + CONTAINER_SIZE.width / 2;
    centerY = currentY + CONTAINER_SIZE.height / 2;
  }

  const angle1 = time * ORBIT_PARAMS.speed1;
  const angle2 = time * ORBIT_PARAMS.speed2;

  const targetX =
    centerX +
    Math.cos(angle1) * radius +
    Math.sin(angle2) * ORBIT_PARAMS.additionalOffset -
    CONTAINER_SIZE.width / 2;

  const targetY =
    centerY +
    Math.sin(angle1) * radius +
    Math.cos(angle2) * ORBIT_PARAMS.additionalOffset -
    CONTAINER_SIZE.height / 2;

  return { targetX, targetY };
};

export const calculateTargetPosition = (
  zonaCenterX: number,
  zonaCenterY: number,
  initialOrbitAngle: number
) => {
  const targetX =
    zonaCenterX +
    Math.cos(initialOrbitAngle) * ORBIT_PARAMS.offsetRadius -
    CONTAINER_SIZE.width / 2;

  const targetY =
    zonaCenterY +
    Math.sin(initialOrbitAngle) * ORBIT_PARAMS.offsetRadius -
    CONTAINER_SIZE.height / 2;

  return { targetX, targetY };
};

export const clampPosition = (x: number, y: number) => {
  const clampedX = Math.max(
    0,
    Math.min(x, window.innerWidth - CONTAINER_SIZE.width)
  );
  // Não limitar Y - permitir movimento vertical por todo o documento
  const clampedY = y;
  return { clampedX, clampedY };
};
