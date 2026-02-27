import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import {
  CONTAINER_SIZE,
  BLOOM_PARAMS,
  GEOMETRY,
  BALL_COLORS,
} from "../constants";
import vertexShader from "../vertex.glsl?raw";
import fragmentShader from "../fragment.glsl?raw";

export const createRenderer = (container: HTMLDivElement) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(CONTAINER_SIZE.width, CONTAINER_SIZE.height);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.pointerEvents = "none";
  container.appendChild(renderer.domElement);
  return renderer;
};

export const createScene = () => {
  return new THREE.Scene();
};

export const createCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    45,
    CONTAINER_SIZE.width / CONTAINER_SIZE.height,
    0.1,
    1000
  );
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);
  return camera;
};

export const createComposer = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(CONTAINER_SIZE.width, CONTAINER_SIZE.height),
    BLOOM_PARAMS.strength,
    BLOOM_PARAMS.radius,
    BLOOM_PARAMS.threshold
  );

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const outputPass = new OutputPass();
  bloomComposer.addPass(outputPass);

  return bloomComposer;
};

export const createMesh = () => {
  const uniforms = {
    u_time: { type: "f", value: 0.0 },
    u_frequency: { type: "f", value: 0.0 },
    u_colorPrimary: {
      type: "v3",
      value: new THREE.Vector3(
        BALL_COLORS.primary.r,
        BALL_COLORS.primary.g,
        BALL_COLORS.primary.b
      ),
    },
    u_colorSecondary: {
      type: "v3",
      value: new THREE.Vector3(
        BALL_COLORS.secondary.r,
        BALL_COLORS.secondary.g,
        BALL_COLORS.secondary.b
      ),
    },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const geometry = new THREE.IcosahedronGeometry(
    GEOMETRY.radius,
    GEOMETRY.detail
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.material.wireframe = true;
  mesh.material.wireframeLinewidth = 0.1;

  return { mesh, uniforms };
};
