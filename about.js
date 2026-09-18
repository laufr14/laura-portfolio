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

/*
 * The bridge is rendered in two stages:
 *
 * 1. Lightweight procedural preview → immediate
 * 2. Real GLB model → replaces preview when ready
 *
 * This keeps the main visual element visible while
 * about-bridge.glb is loading.
 */

let bridge = null;


/* =========================================================
   BRIDGE PREVIEW
   ========================================================= */

function createBridgePreview() {

  const group =
    new THREE.Group();


  /* -------------------------------------------------------
     MATERIALS
     ------------------------------------------------------- */

  const darkMaterial =
    new THREE.MeshStandardMaterial({

      color: 0x101016,

      metalness: 0.48,

      roughness: 0.42

    });


  const floorMaterial =
    new THREE.MeshStandardMaterial({

      color: 0x09090d,

      metalness: 0.50,

      roughness: 0.34

    });


  const purpleScreenMaterial =
    new THREE.MeshStandardMaterial({

      color: 0x7c72ff,

      emissive: 0x5345cc,

      emissiveIntensity: 1.0,

      metalness: 0.05,

      roughness: 0.28

    });


  const blueLightMaterial =
    new THREE.MeshBasicMaterial({

      color: 0x6ed6ff

    });


  const purpleLightMaterial =
    new THREE.MeshBasicMaterial({

      color: 0x9d8cff

    });


  /* -------------------------------------------------------
     FLOOR
     ------------------------------------------------------- */

  const floor =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        5.8,
        0.18,
        4.2
      ),

      floorMaterial

    );

  floor.position.set(
    0,
    -1.05,
    0
  );

  group.add(
    floor
  );


  /* -------------------------------------------------------
     BACK WALL
     ------------------------------------------------------- */

  const backWall =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        5.8,
        3.2,
        0.16
      ),

      darkMaterial

    );

  backWall.position.set(
    0,
    0.55,
    -1.95
  );

  group.add(
    backWall
  );


  /* -------------------------------------------------------
     SIDE WALLS
     ------------------------------------------------------- */

  const leftWall =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.16,
        3.2,
        4.2
      ),

      darkMaterial

    );

  leftWall.position.set(
    -2.82,
    0.55,
    0
  );

  group.add(
    leftWall
  );


  const rightWall =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.16,
        3.2,
        4.2
      ),

      darkMaterial

    );

  rightWall.position.set(
    2.82,
    0.55,
    0
  );

  group.add(
    rightWall
  );


  /* -------------------------------------------------------
     CONTROL SCREENS
     ------------------------------------------------------- */

  const screenPositions = [
    -1.85,
    -0.95,
    0,
    0.95,
    1.85
  ];


  screenPositions.forEach(
    (x) => {

      const screen =
        new THREE.Mesh(

          new THREE.BoxGeometry(
            0.62,
            1.05,
            0.08
          ),

          purpleScreenMaterial

        );


      screen.position.set(
        x,
        0.55,
        -1.83
      );


      group.add(
        screen
      );

    }
  );


  /* -------------------------------------------------------
     CONTROL DESK
     ------------------------------------------------------- */

  const desk =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        4.2,
        0.34,
        0.85
      ),

      darkMaterial

    );

  desk.position.set(
    0,
    -0.22,
    -0.72
  );

  group.add(
    desk
  );


  /* -------------------------------------------------------
     DESK EDGE LIGHT
     ------------------------------------------------------- */

  const deskLight =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        3.9,
        0.035,
        0.04
      ),

      blueLightMaterial

    );

  deskLight.position.set(
    0,
    -0.03,
    -1.15
  );

  group.add(
    deskLight
  );


  /* -------------------------------------------------------
     CENTRAL CONSOLE
     ------------------------------------------------------- */

  const console =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        1.25,
        0.48,
        0.58
      ),

      darkMaterial

    );

  console.position.set(
    0,
    0.16,
    -0.55
  );

  group.add(
    console
  );


  const consoleScreen =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.72,
        0.34,
        0.04
      ),

      purpleScreenMaterial

    );

  consoleScreen.position.set(
    0,
    0.40,
    -0.86
  );

  group.add(
    consoleScreen
  );


  /* -------------------------------------------------------
     CENTRAL CHAIR
     ------------------------------------------------------- */

  const chairSeat =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.82,
        0.18,
        0.72
      ),

      darkMaterial

    );

  chairSeat.position.set(
    0,
    -0.45,
    0.05
  );

  group.add(
    chairSeat
  );


  const chairBack =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.82,
        0.95,
        0.18
      ),

      darkMaterial

    );

  chairBack.position.set(
    0,
    0.02,
    0.36
  );

  group.add(
    chairBack
  );


  /* -------------------------------------------------------
     UPPER FRAME
     ------------------------------------------------------- */

  const topBeam =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        5.6,
        0.13,
        0.13
      ),

      darkMaterial

    );

  topBeam.position.set(
    0,
    2.05,
    -1.72
  );

  group.add(
    topBeam
  );


  /* -------------------------------------------------------
     PURPLE TOP LIGHT
     ------------------------------------------------------- */

  const topLight =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        3.6,
        0.025,
        0.06
      ),

      purpleLightMaterial

    );

  topLight.position.set(
    0,
    1.95,
    -1.78
  );

  group.add(
    topLight
  );


  /* -------------------------------------------------------
     SIDE LIGHT STRIPS
     ------------------------------------------------------- */

  const sideLightLeft =
    new THREE.Mesh(

      new THREE.BoxGeometry(
        0.04,
        2.2,
        0.05
      ),

      blueLightMaterial

    );

  sideLightLeft.position.set(
    -2.72,
    0.65,
    -1.72
  );

  group.add(
    sideLightLeft
  );


  const sideLightRight =
    sideLightLeft.clone();


  sideLightRight.position.x =
    2.72;

  group.add(
    sideLightRight
  );


  return group;
}


/* =========================================================
   IMMEDIATE PREVIEW
   ========================================================= */

const bridgePreview =
  createBridgePreview();


/*
 * Use the same placement as the real GLB.
 */

bridgePreview.position.set(
  0,
  window.innerWidth <= 560
    ? -2.8
    : -1.8,
  window.innerWidth <= 560
    ? -8
    : -5
);


bridgePreview.scale.setScalar(
  1
);


scene.add(
  bridgePreview
);


/* =========================================================
   REAL BRIDGE MODEL
   ========================================================= */

const loader =
  new GLTFLoader();


loader.load(

  "./assets/models/about-bridge.glb",


  (gltf) => {

    const realBridge =
      gltf.scene;


    /* -------------------------------------------------------
       MATERIAL CUSTOMIZATION
       ------------------------------------------------------- */

    realBridge.traverse(
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

        if (
          material.name ===
          "Walls"
        ) {

          material.color.set(
            0x17151f
          );

          material.metalness =
            0.48;

          material.roughness =
            0.42;
        }


        /* ---------------------------------------------------
           FLOOR
           --------------------------------------------------- */

        else if (
          material.name ===
          "Floor"
        ) {

          material.color.set(
            0x0b0b10
          );

          material.metalness =
            0.50;

          material.roughness =
            0.32;
        }


        /* ---------------------------------------------------
           OUTSIDE SCREENS
           --------------------------------------------------- */

        else if (
          material.name ===
          "ScreensOutside"
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
          material.name ===
          "Screens"
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
          material.name ===
          "Chair"
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
          material.name ===
          "Seat"
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
          material.name ===
          "SidesLighting"
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
          material.name ===
          "Window"
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
          material.name ===
            "Black" ||
          material.name ===
            "FloorMiddle" ||
          material.name ===
            "TrimRoof"
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

    const isMobile =
      window.innerWidth <= 560;


    realBridge.position.set(
      0,
      isMobile ? -2.8 : -1.8,
      isMobile ? -8 : -5
    );


    /* -------------------------------------------------------
       SCALE
       ------------------------------------------------------- */

    realBridge.scale.setScalar(
      1
    );


    /* -------------------------------------------------------
       SWAP PREVIEW → REAL
       ------------------------------------------------------- */

    scene.remove(
      bridgePreview
    );


    disposeBridgePreview(
      bridgePreview
    );


    bridge =
      realBridge;


    scene.add(
      bridge
    );

  },


  undefined,


  (error) => {

    /*
     * Keep the preview if the GLB fails.
     */

    console.warn(
      "Unable to load About bridge. Keeping preview.",
      error
    );

  }

);


/* =========================================================
   PREVIEW CLEANUP
   ========================================================= */

function disposeBridgePreview(
  object
) {

  if (!object) {
    return;
  }


  object.traverse(
    (child) => {

      if (child.geometry) {
        child.geometry.dispose();
      }


      if (child.material) {

        const materials =
          Array.isArray(
            child.material
          )
            ? child.material
            : [
                child.material
              ];


        materials.forEach(
          (material) => {

            material.dispose();

          }
        );

      }

    }
  );

}

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