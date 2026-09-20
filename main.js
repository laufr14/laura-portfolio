import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.querySelector("#webgl");
if (!container) throw new Error("#webgl not found");

// ---------------------------------------------------------------
// V3.5 — SPACE STATION INTERIOR
// The uploaded interior is now the single architectural scene.
// ---------------------------------------------------------------

const scene = new THREE.Scene();

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
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
container.appendChild(renderer.domElement);

// ---------------------------------------------------------------
// FIRST-FRAME HANDOFF
// Keep the 3D layer visually hidden until WebGL has rendered
// its first stable frame. This prevents the background -> 3D flash
// on Home and Projects.
// ---------------------------------------------------------------

let main3DReady = false;

// Keep the full-screen layer itself opaque so the page background/ambient
// elements can never flash through while WebGL is booting. Only the canvas
// is faded in after the first rendered frame.
container.style.opacity = "1";
container.style.visibility = "visible";
container.style.background = "transparent";
container.style.zIndex = "0";
container.style.isolation = "isolate";

renderer.domElement.style.opacity = "0";
renderer.domElement.style.visibility = "visible";
renderer.domElement.style.transition = "opacity 0.16s ease";
renderer.domElement.style.willChange = "opacity";

function revealMain3D() {
  if (main3DReady) {
    return;
  }

  main3DReady = true;
  renderer.domElement.style.opacity = "1";
  renderer.domElement.style.visibility = "visible";
  window.__main3DReady = true;

  window.dispatchEvent(
    new CustomEvent("main3d-ready")
  );
}

let roomReady = false;
let planetReady = false;
let mainAnimationStarted = false;

function maybeStartMain3D() {
  if (mainAnimationStarted || !roomReady || !planetReady) {
    return;
  }

  mainAnimationStarted = true;
  resize();
  requestAnimationFrame(animate);
}

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
let roomPreview = null;


/* ---------------------------------------------------------------
   PREVIEW MATERIALS
   --------------------------------------------------------------- */

const previewFloorMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x111522,
    metalness: 0.55,
    roughness: 0.62
  });


const previewWallMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x171b29,
    metalness: 0.42,
    roughness: 0.68
  });


const previewFrameMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x252b40,
    metalness: 0.7,
    roughness: 0.38
  });


const previewWindowMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x222d5a,
    transparent: true,
    opacity: 0.72
  });


const previewLightMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x7f75ff,
    emissive: 0x4c42c7,
    emissiveIntensity: 1.15,
    metalness: 0.1,
    roughness: 0.3
  });


const previewBlueLightMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x6ea8ff,
    emissive: 0x6ea8ff,
    emissiveIntensity: 1.3,
    metalness: 0.1,
    roughness: 0.3
  });


/* ---------------------------------------------------------------
   PREVIEW HELPER
   --------------------------------------------------------------- */

function createRoomPreview() {

  const group =
    new THREE.Group();


  /* FLOOR */

  const floor =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        10,
        0.18,
        12
      ),
      previewFloorMaterial
    );

  floor.position.set(
    0,
    -0.1,
    -2
  );

  group.add(floor);


  /* LEFT WALL */

  const leftWall =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.18,
        6,
        12
      ),
      previewWallMaterial
    );

  leftWall.position.set(
    -5,
    3,
    -2
  );

  group.add(leftWall);


  /* RIGHT WALL */

  const rightWall =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.18,
        6,
        12
      ),
      previewWallMaterial
    );

  rightWall.position.set(
    5,
    3,
    -2
  );

  group.add(rightWall);


  /* BACK WALL */

  const backWall =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        10,
        6,
        0.18
      ),
      previewWallMaterial
    );

  backWall.position.set(
    0,
    3,
    -8
  );

  group.add(backWall);


  /* PANORAMIC WINDOW */

  const windowPanel =
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        7.8,
        3.8
      ),
      previewWindowMaterial
    );

  windowPanel.position.set(
    0,
    3.05,
    -7.88
  );

  group.add(windowPanel);


  /* WINDOW FRAME - TOP */

  const frameTop =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        8.1,
        0.14,
        0.16
      ),
      previewFrameMaterial
    );

  frameTop.position.set(
    0,
    5,
    -7.8
  );

  group.add(frameTop);


  /* WINDOW FRAME - BOTTOM */

  const frameBottom =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        8.1,
        0.14,
        0.16
      ),
      previewFrameMaterial
    );

  frameBottom.position.set(
    0,
    1.1,
    -7.8
  );

  group.add(frameBottom);


  /* WINDOW FRAME - LEFT */

  const frameLeft =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.14,
        4,
        0.16
      ),
      previewFrameMaterial
    );

  frameLeft.position.set(
    -4,
    3.05,
    -7.8
  );

  group.add(frameLeft);


  /* WINDOW FRAME - RIGHT */

  const frameRight =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.14,
        4,
        0.16
      ),
      previewFrameMaterial
    );

  frameRight.position.set(
    4,
    3.05,
    -7.8
  );

  group.add(frameRight);


  /* CENTRAL WINDOW DIVIDER */

  const centerFrame =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.08,
        4,
        0.16
      ),
      previewFrameMaterial
    );

  centerFrame.position.set(
    0,
    3.05,
    -7.78
  );

  group.add(centerFrame);


  /* SIDE LIGHT STRIPS */

  const leftLight =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.06,
        3.8,
        0.06
      ),
      previewBlueLightMaterial
    );

  leftLight.position.set(
    -4.15,
    3.05,
    -7.65
  );

  group.add(leftLight);


  const rightLight =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.06,
        3.8,
        0.06
      ),
      previewLightMaterial
    );

  rightLight.position.set(
    4.15,
    3.05,
    -7.65
  );

  group.add(rightLight);


  /* FLOOR LIGHT STRIPS */

  const leftFloorLight =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.04,
        0.04,
        8.5
      ),
      previewBlueLightMaterial
    );

  leftFloorLight.position.set(
    -4.65,
    0.04,
    -3
  );

  group.add(leftFloorLight);


  const rightFloorLight =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.04,
        0.04,
        8.5
      ),
      previewLightMaterial
    );

  rightFloorLight.position.set(
    4.65,
    0.04,
    -3
  );

  group.add(rightFloorLight);


  /* CENTRAL CONSOLE */

  const consoleBase =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        2.2,
        0.65,
        1.15
      ),
      previewFrameMaterial
    );

  consoleBase.position.set(
    0,
    0.35,
    -1.6
  );

  group.add(consoleBase);


  const consoleTop =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        1.8,
        0.08,
        0.8
      ),
      previewLightMaterial
    );

  consoleTop.position.set(
    0,
    0.72,
    -1.6
  );

  group.add(consoleTop);


  /* UPPER LIGHT */

  const upperLight =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        5.2,
        0.05,
        0.08
      ),
      previewLightMaterial
    );

  upperLight.position.set(
    0,
    5.55,
    -3.5
  );

  group.add(upperLight);


  return group;
}


/* ---------------------------------------------------------------
   PREVIEW DISPOSAL
   --------------------------------------------------------------- */

function disposePreview(group) {

  if (!group) return;

  group.traverse((node) => {

    if (!node.isMesh) return;

    if (node.geometry) {
      node.geometry.dispose();
    }

    const materials =
      Array.isArray(node.material)
        ? node.material
        : [node.material];

    materials.forEach((material) => {

      if (material) {
        material.dispose();
      }

    });

  });
}


function fadeOutPreview(
  group,
  parent,
  duration = 180
) {

  if (!group || !parent) return;

  const materials =
    new Map();

  group.traverse((node) => {

    if (!node.isMesh) return;

    const nodeMaterials =
      Array.isArray(node.material)
        ? node.material
        : [node.material];

    nodeMaterials.forEach((material) => {

      if (!material) return;

      if (!materials.has(material)) {

        materials.set(
          material,
          typeof material.opacity === "number"
            ? material.opacity
            : 1
        );

      }

      material.transparent = true;
      material.depthWrite = false;
      material.needsUpdate = true;

    });

  });


  const startTime =
    performance.now();


  function animateFade(now) {

    const progress =
      Math.min(
        (now - startTime) / duration,
        1
      );


    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    materials.forEach(
      (startOpacity, material) => {

        material.opacity =
          startOpacity *
          (1 - eased);

      }
    );


    if (progress < 1) {

      requestAnimationFrame(
        animateFade
      );

      return;

    }


    parent.remove(
      group
    );

    disposePreview(
      group
    );

  }


  requestAnimationFrame(
    animateFade
  );

}

/* ---------------------------------------------------------------
   REAL ROOM MODEL
   The real GLB is loaded before the first visible WebGL frame.
   The procedural preview is used only if the GLB fails.
   --------------------------------------------------------------- */

function prepareRoom(model) {

  model.traverse((node) => {

    if (!node.isMesh) return;

    node.castShadow = false;
    node.receiveShadow = false;

    const materials =
      Array.isArray(node.material)
        ? node.material
        : [node.material];

    materials.forEach((material) => {

      if (!material) return;

      material.side =
        THREE.FrontSide;

      if (material.color) {

        material.color.lerp(
          new THREE.Color(0xe8e7f3),
          0.12
        );

      }

      if ("roughness" in material) {

        material.roughness =
          Math.max(
            0.42,
            Math.min(
              material.roughness,
              0.82
            )
          );

      }

    });

  });

  return model;
}


loader.load(

  "./assets/models/interior-room.glb",

  (gltf) => {

    roomModel =
      prepareRoom(
        gltf.scene
      );


    /*
     * Replace the lightweight
     * preview with the real room.
     */

    /* -----------------------------------------
   Add the real room first
   ----------------------------------------- */

roomGroup.add(
  roomModel
);


/* -----------------------------------------
   Smoothly remove preview
   ----------------------------------------- */

if (roomPreview) {

  const preview =
    roomPreview;

  roomPreview =
    null;

  fadeOutPreview(
    preview,
    roomGroup,
    220
  );

}


    console.log(
      "V3.5 interior room loaded."
    );

    roomReady = true;
    maybeStartMain3D();

  },

  undefined,

  (error) => {

    console.warn(
      "interior-room.glb could not be loaded. Preview retained.",
      error
    );

    roomPreview = createRoomPreview();
    roomGroup.add(roomPreview);

    roomReady = true;
    maybeStartMain3D();

  }

);

// ---------------------------------------------------------------
// PLANET OUTSIDE THE WINDOW
// ---------------------------------------------------------------

const planetGroup =
  new THREE.Group();

scene.add(
  planetGroup
);

let planetModel = null;
let planetPreview = null;


/* ---------------------------------------------------------------
   PLANET PREVIEW
   --------------------------------------------------------------- */

function createPlanetPreview() {

  const group =
    new THREE.Group();


  const planetGeometry =
    new THREE.SphereGeometry(
      0.55,
      32,
      32
    );


  const planetMaterial =
    new THREE.MeshStandardMaterial({

      color: 0x7167c7,

      metalness: 0.15,

      roughness: 0.7,

      emissive: 0x241b5f,

      emissiveIntensity: 0.55

    });


  const sphere =
    new THREE.Mesh(
      planetGeometry,
      planetMaterial
    );


  group.add(
    sphere
  );


  /* ATMOSPHERE */

  const atmosphereGeometry =
    new THREE.SphereGeometry(
      0.64,
      32,
      32
    );


  const atmosphereMaterial =
    new THREE.MeshBasicMaterial({

      color: 0x8b86ff,

      transparent: true,

      opacity: 0.12,

      side: THREE.BackSide

    });


  const atmosphere =
    new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );


  group.add(
    atmosphere
  );


  return group;
}


/* ---------------------------------------------------------------
   LOAD REAL PLANET
   The real GLB is loaded before the first visible WebGL frame.
   The procedural preview is used only if the GLB fails.
   --------------------------------------------------------------- */

loader.load(

  "./assets/models/planet.glb",

  (gltf) => {

    planetModel =
      gltf.scene;


    const box =
      new THREE.Box3().setFromObject(
        planetModel
      );


    const size =
      new THREE.Vector3();


    box.getSize(
      size
    );


    const maxDimension =
      Math.max(
        size.x,
        size.y,
        size.z
      ) || 1;


    planetModel.scale.setScalar(
      1.1 /
      maxDimension
    );


    planetModel.position.set(
      0.15,
      1.58,
      -3.62
    );


    planetModel.rotation.y =
      -0.35;


    planetModel.traverse(
      (node) => {

        if (!node.isMesh) return;

        node.renderOrder =
          -1;


        if (node.material) {

          const materials =
            Array.isArray(
              node.material
            )
              ? node.material
              : [node.material];


          materials.forEach(
            (material) => {

              if (
                material.color
              ) {

                material.color.lerp(
                  new THREE.Color(
                    0x7c82c8
                  ),
                  0.22
                );

              }

            }
          );

        }

      }
    );


    planetGroup.add(
  planetModel
);


if (planetPreview) {

  const preview =
    planetPreview;

  planetPreview =
    null;

  fadeOutPreview(
    preview,
    planetGroup,
    180
  );

}


    console.log(
      "V3.5 planet loaded behind the window."
    );

    planetReady = true;
    maybeStartMain3D();

  },

  undefined,

  (error) => {

    console.warn(
      "planet.glb could not be loaded. Preview retained.",
      error
    );

    planetPreview = createPlanetPreview();
    planetPreview.position.set(0.15, 1.58, -3.62);
    planetPreview.rotation.y = -0.35;
    planetGroup.add(planetPreview);

    planetReady = true;
    maybeStartMain3D();

  }

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

  // Reveal the environment only after the first real WebGL frame.
  if (!main3DReady) {
    revealMain3D();
  }
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", resize);
resize();
