import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   CONTAINER
   ========================================================= */

const container =
  document.querySelector("#about-webgl");

if (!container) {
  throw new Error("About WebGL container not found.");
}


/* =========================================================
   SCENE
   ========================================================= */

const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x060708);


/* =========================================================
   CAMERA
   ========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    300
  );

const isMobile = window.innerWidth <= 560;

camera.position.set(
  0,
  isMobile ? 1.0 : 1.2,
  isMobile ? 8.2 : 6
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
  new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

container.appendChild(
  renderer.domElement
);


/* =========================================================
   BRIDGE
   ========================================================= */

const loader =
  new GLTFLoader();

let bridge = null;


loader.load(
  "./assets/models/about-bridge.glb",

  (gltf) => {

    bridge = gltf.scene;


    /* -------------------------------------------------------
       MATERIAL CUSTOMIZATION
       ------------------------------------------------------- */

    bridge.traverse(
      (object) => {

        if (!object.isMesh) {
          return;
        }


        const material =
          object.material;


        if (!material) {
          return;
        }


        /* ---------------------------------------------------
           WALLS
           --------------------------------------------------- */

        if (material.name === "Walls") {

          material.color.set(
            0x17151f
          );

          material.metalness = 0.48;

          material.roughness = 0.42;
        }


        /* ---------------------------------------------------
           FLOOR
           --------------------------------------------------- */

        else if (
          material.name === "Floor"
        ) {

          material.color.set(
            0x0b0b10
          );

          material.metalness = 0.50;

          material.roughness = 0.32;
        }


        /* ---------------------------------------------------
           OUTSIDE SCREENS
           --------------------------------------------------- */

        else if (
          material.name === "ScreensOutside"
        ) {

          material.color.set(
            0x5746a8
          );

          material.emissive.set(
            0x25155f
          );

          material.emissiveIntensity =
            1.2;
        }


        /* ---------------------------------------------------
           MAIN SCREENS
           --------------------------------------------------- */

        else if (
          material.name === "Screens"
        ) {

          material.color.set(
            0x7c72ff
          );

          material.emissive.set(
            0x5345cc
          );

          material.emissiveIntensity =
            1.0;
        }


        /* ---------------------------------------------------
           CHAIR
           --------------------------------------------------- */

        else if (
          material.name === "Chair"
        ) {

          material.color.set(
            0x111116
          );

          material.metalness =
            0.25;

          material.roughness =
            0.38;
        }


        /* ---------------------------------------------------
           SEAT
           --------------------------------------------------- */

        else if (
          material.name === "Seat"
        ) {

          material.color.set(
            0x241c3f
          );

          material.emissive.set(
            0x21123f
          );

          material.emissiveIntensity =
            0.45;
        }


        /* ---------------------------------------------------
           SIDE LIGHTING
           --------------------------------------------------- */

        else if (
          material.name === "SidesLighting"
        ) {

          material.color.set(
            0x6ed6ff
          );

          material.emissive.set(
            0x6ed6ff
          );

          material.emissiveIntensity =
            1.5;
        }


        /* ---------------------------------------------------
           WINDOW
           --------------------------------------------------- */

        else if (
          material.name === "Window"
        ) {

          material.color.set(
            0x7d75c8
          );

          material.opacity =
            0.45;

          material.transparent =
            true;
        }


        /* ---------------------------------------------------
           BLACK MATERIALS
           --------------------------------------------------- */

        else if (
          material.name === "Black" ||
          material.name === "FloorMiddle" ||
          material.name === "TrimRoof"
        ) {

          material.color.set(
            0x050507
          );
        }


        material.needsUpdate =
          true;
      }
    );


    /* -------------------------------------------------------
       POSITION
       ------------------------------------------------------- */

   const isMobile = window.innerWidth <= 560;

bridge.position.set(
  0,
  isMobile ? -2.8 : -1.8,
  isMobile ? -8 : -5
);


    /* -------------------------------------------------------
       SCALE
       ------------------------------------------------------- */

    bridge.scale.setScalar(
      1
    );


    scene.add(
      bridge
    );
  },

  undefined,

  (error) => {

    console.error(
      "Unable to load About bridge.",
      error
    );
  }
);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight =
  new THREE.AmbientLight(
    0x51476d,
    0.42
  );

scene.add(
  ambientLight
);


const purpleLight =
  new THREE.PointLight(
    0x9d8cff,
    18,
    20
  );

purpleLight.position.set(
  4,
  3,
  5
);

scene.add(
  purpleLight
);


const blueLight =
  new THREE.PointLight(
    0x6ed6ff,
    12,
    18
  );

blueLight.position.set(
  -4,
  1,
  3
);

scene.add(
  blueLight
);


/* =========================================================
   PARALLAX
   ========================================================= */

const pointer =
  new THREE.Vector2();

const targetPointer =
  new THREE.Vector2();


window.addEventListener(
  "pointermove",
  (event) => {

    targetPointer.x =
      (event.clientX / window.innerWidth) * 2 - 1;

    targetPointer.y =
      -(
        (event.clientY / window.innerHeight) * 2 - 1
      );
  }
);


/* =========================================================
   ANIMATION
   ========================================================= */

   
const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(
    animate
  );

const delta =
  clock.getDelta();

const pointerSmoothing =
  1 - Math.exp(-1.52 * delta);

pointer.x +=
  (
    targetPointer.x -
    pointer.x
  ) * pointerSmoothing;


pointer.y +=
  (
    targetPointer.y -
    pointer.y
  ) * pointerSmoothing;

  /* -------------------------------------------------------
     Camera parallax
     ------------------------------------------------------- */

  camera.rotation.y =
    pointer.x * 0.025;

  camera.rotation.x =
    -pointer.y * 0.018;


  renderer.render(
    scene,
    camera
  );
}


animate();


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    const isMobile =
      window.innerWidth <= 560;


    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.position.set(
      0,
      isMobile ? 1.0 : 1.2,
      isMobile ? 8.2 : 6
    );


    if (bridge) {

      bridge.position.set(
        0,
        isMobile ? -2.8 : -1.8,
        isMobile ? -8 : -5
      );

    }


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);