import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.querySelector("#webgl");
if (!container) throw new Error("#webgl not found");

// ---------------------------------------------------------------
// V3.5 — SPACE STATION INTERIOR
// The uploaded interior is now the single architectural scene.
// ---------------------------------------------------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070d);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.05,
  100
);

// Camera starts inside the room, facing the panoramic window.
camera.position.set(-0.05, 1.32, 1.45);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
container.appendChild(renderer.domElement);

// ---------------------------------------------------------------
// LIGHTING
// ---------------------------------------------------------------

scene.add(new THREE.HemisphereLight(0xe7e8ff, 0x101426, 1.45));

const keyLight = new THREE.DirectionalLight(0xf3f0ff, 1.8);
keyLight.position.set(-1.5, 4.5, 1.5);
scene.add(keyLight);

const violetLight = new THREE.PointLight(0x8b7cff, 5.5, 8);
violetLight.position.set(0.8, 2.0, -1.8);
scene.add(violetLight);

const blueLight = new THREE.PointLight(0x6ea8ff, 4.0, 7);
blueLight.position.set(-1.6, 1.25, -2.0);
scene.add(blueLight);

// ---------------------------------------------------------------
// ROOM
// ---------------------------------------------------------------

const loader = new GLTFLoader();
const roomGroup = new THREE.Group();
scene.add(roomGroup);

let roomModel = null;

function prepareRoom(model) {
  model.traverse((node) => {
    if (!node.isMesh) return;

    node.castShadow = false;
    node.receiveShadow = false;

    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];

    materials.forEach((material) => {
      if (!material) return;
      material.side = THREE.FrontSide;

      if (material.color) {
        // Preserve the model's light architecture while introducing
        // a very subtle cool-violet cinematic tint.
        material.color.lerp(new THREE.Color(0xe8e7f3), 0.12);
      }

      if ("roughness" in material) {
        material.roughness = Math.max(0.42, Math.min(material.roughness, 0.82));
      }
    });
  });

  return model;
}

loader.load(
  "./assets/models/interior-room.glb",
  (gltf) => {
    roomModel = prepareRoom(gltf.scene);
    roomGroup.add(roomModel);
    console.log("V3.5 interior room loaded.");
  },
  undefined,
  (error) => {
    console.error("interior-room.glb could not be loaded.", error);
  }
);

// ---------------------------------------------------------------
// PLANET OUTSIDE THE WINDOW
// ---------------------------------------------------------------

const planetGroup = new THREE.Group();
scene.add(planetGroup);

loader.load(
  "./assets/models/planet.glb",
  (gltf) => {
    const planet = gltf.scene;

    const box = new THREE.Box3().setFromObject(planet);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    planet.scale.setScalar(1.1 / maxDimension);

    planet.position.set(0.15, 1.58, -3.62);
    planet.rotation.y = -0.35;

    planet.traverse((node) => {
      if (!node.isMesh) return;
      node.renderOrder = -1;
      if (node.material) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        materials.forEach((material) => {
          if (material.color) material.color.lerp(new THREE.Color(0x7c82c8), 0.22);
        });
      }
    });

    planetGroup.add(planet);
    console.log("V3.5 planet loaded behind the window.");
  },
  undefined,
  (error) => console.warn("planet.glb could not be loaded.", error)
);

// ---------------------------------------------------------------
// SPACE BEHIND THE WINDOW
// ---------------------------------------------------------------

const starCount = 500;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  starPositions[i * 3] = (Math.random() - 0.5) * 16;
  starPositions[i * 3 + 1] = Math.random() * 8 - 1;
  starPositions[i * 3 + 2] = -5.0 - Math.random() * 9;
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xdbe4ff,
  size: 0.018,
  transparent: true,
  opacity: 0.58,
  depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// ---------------------------------------------------------------
// POINTER PARALLAX
// ---------------------------------------------------------------

const pointer = { x: 0, y: 0 };
const smoothPointer = { x: 0, y: 0 };

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
});

// ---------------------------------------------------------------
// ANIMATION
// ---------------------------------------------------------------

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  const pointerSmoothing =
  1 - Math.exp(-2.15 * delta);

smoothPointer.x +=
  (pointer.x - smoothPointer.x) *
  pointerSmoothing;

smoothPointer.y +=
  (pointer.y - smoothPointer.y) *
  pointerSmoothing;

  // Very restrained camera movement: the room remains stable.
  const cameraSmoothing =
  1 - Math.exp(-2.15 * delta);

camera.position.x +=
  ((-0.05 + smoothPointer.x * 0.045) - camera.position.x) *
  cameraSmoothing;

camera.position.y +=
  ((1.32 - smoothPointer.y * 0.025) - camera.position.y) *
  cameraSmoothing;
  camera.lookAt(0.0, 1.32, -2.65);

  if (roomModel) {
  const roomSmoothing =
    1 - Math.exp(-1.52 * delta);

  roomModel.rotation.y +=
    (smoothPointer.x * 0.004 - roomModel.rotation.y) *
    roomSmoothing;
}
  if (planetGroup.children[0]) {
  planetGroup.children[0].rotation.y +=
    0.042 * delta;
}

  stars.rotation.y = elapsed * 0.002;

  violetLight.intensity = 5.5 + Math.sin(elapsed * 0.55) * 0.55;
  blueLight.intensity = 4.0 + Math.cos(elapsed * 0.42) * 0.35;

  renderer.render(scene, camera);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
resize();
animate();
