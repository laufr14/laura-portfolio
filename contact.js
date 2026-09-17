import * as THREE from "three";

import {
  RoundedBoxGeometry
} from "three/addons/geometries/RoundedBoxGeometry.js";

import {
  CSS3DRenderer,
  CSS3DObject
} from "three/addons/renderers/CSS3DRenderer.js";


/* =========================================================
   CONTACT — CUSTOM THREE.JS TERMINAL
   BILINGUAL EN / ES
   ========================================================= */

const container =
  document.querySelector(
    "#contact-webgl"
  );


if (!container) {

  throw new Error(
    "Contact WebGL container not found."
  );

}


/* =========================================================
   LANGUAGE
   ========================================================= */

const isSpanish =
  window.location.pathname.endsWith(
    "contacto-es.html"
  );


const translations = {

  en: {

    terminal:
      "LF // COMMUNICATION TERMINAL",

    online:
      "ONLINE",

    initialized:
      "SYSTEM INITIALIZED",

    secure:
      "SECURE CONNECTION ESTABLISHED",

    ready:
      "CHANNEL READY",

    build:
      "LET'S BUILD",

    together:
      "SOMETHING TOGETHER.",

    email:
      "EMAIL",

    linkedin:
      "LINKEDIN",

    github:
      "GITHUB",

    name:
      "NAME",

    emailField:
      "EMAIL",

    message:
      "MESSAGE",

    namePlaceholder:
      "ENTER YOUR NAME",

    emailPlaceholder:
      "ENTER YOUR EMAIL",

    messagePlaceholder:
      "ENTER YOUR MESSAGE",

    transmit:
      "TRANSMIT MESSAGE",

    transmitting:
      "TRANSMITTING...",

    connection:
      "CONNECTION: SECURE",

    zoom:
      "Zoom screen",

    focus:
      "Focus screen"

  },


  es: {

    terminal:
      "LF // TERMINAL DE COMUNICACIÓN",

    online:
      "EN LÍNEA",

    initialized:
      "SISTEMA INICIALIZADO",

    secure:
      "CONEXIÓN SEGURA ESTABLECIDA",

    ready:
      "CANAL LISTO",

    build:
      "CONSTRUYAMOS",

    together:
      "ALGO JUNTOS.",

    email:
      "EMAIL",

    linkedin:
      "LINKEDIN",

    github:
      "GITHUB",

    name:
      "NOMBRE",

    emailField:
      "EMAIL",

    message:
      "MENSAJE",

    namePlaceholder:
      "INTRODUCE TU NOMBRE",

    emailPlaceholder:
      "INTRODUCE TU EMAIL",

    messagePlaceholder:
      "INTRODUCE TU MENSAJE",

    transmit:
      "ENVIAR MENSAJE",

    transmitting:
      "ENVIANDO...",

    connection:
      "CONEXIÓN: SEGURA",

    zoom:
      "Ampliar pantalla",

    focus:
      "Enfocar pantalla"

  }

};


const t =
  isSpanish
    ? translations.es
    : translations.en;


/* =========================================================
   SCENE
   ========================================================= */

const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    0x060708
  );


/* =========================================================
   CAMERA
   ========================================================= */

const isMobileViewport =
  () => window.innerWidth <= 560;


const initialIsMobile =
  isMobileViewport();


const initialCameraFov =
  initialIsMobile
    ? 65
    : 45;


const camera =
  new THREE.PerspectiveCamera(
    initialCameraFov,
    window.innerWidth /
      window.innerHeight,
    0.1,
    100
  );


let targetCameraFov =
  initialCameraFov;


/* =========================================================
   CAMERA POSITIONS
   ========================================================= */

const normalCameraPosition =
  new THREE.Vector3(
    0,
    initialIsMobile
      ? 1.45
      : 1.65,
    initialIsMobile
      ? 8.8
      : 6.2
  );


const zoomCameraPosition =
  new THREE.Vector3(
    0,
    initialIsMobile
      ? 2.05
      : 2.20,
    initialIsMobile
      ? 7.2
      : 4.35
  );


const normalLookAt =
  new THREE.Vector3(
    0,
    1.85,
    0
  );


const zoomLookAt =
  new THREE.Vector3(
    0,
    2.55,
    0
  );


let isScreenZoomed =
  false;


let cameraTargetPosition =
  normalCameraPosition.clone();


let cameraTargetLookAt =
  normalLookAt.clone();


camera.position.copy(
  normalCameraPosition
);


camera.lookAt(
  normalLookAt
);


/* =========================================================
   WEBGL RENDERER
   ========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    antialias: true,

    alpha: false

  });


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.domElement.style.position =
  "fixed";

renderer.domElement.style.top =
  "0";

renderer.domElement.style.left =
  "0";

renderer.domElement.style.width =
  "100%";

renderer.domElement.style.height =
  "100%";

renderer.domElement.style.zIndex =
  "1";


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  1.05;


container.appendChild(
  renderer.domElement
);


/* =========================================================
   CSS3D RENDERER
   ========================================================= */

const cssRenderer =
  new CSS3DRenderer();


cssRenderer.setSize(
  window.innerWidth,
  window.innerHeight
);


cssRenderer.domElement.style.position =
  "fixed";


cssRenderer.domElement.style.top =
  "0";


cssRenderer.domElement.style.left =
  "0";


cssRenderer.domElement.style.width =
  "100%";


cssRenderer.domElement.style.height =
  "100%";


cssRenderer.domElement.style.pointerEvents =
  "none";


cssRenderer.domElement.style.zIndex =
  "2";


container.appendChild(
  cssRenderer.domElement
);


/* =========================================================
   MATERIALS
   ========================================================= */

const darkMetalMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x11141c,

    metalness: 0.78,

    roughness: 0.3

  });


const darkSurfaceMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x0b0e15,

    metalness: 0.65,

    roughness: 0.35

  });


const purpleMetalMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x29243e,

    metalness: 0.72,

    roughness: 0.28

  });


const keyboardMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x181b24,

    metalness: 0.55,

    roughness: 0.4

  });


const keyMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x252a35,

    metalness: 0.35,

    roughness: 0.42

  });


const screenFrameMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x171a24,

    metalness: 0.72,

    roughness: 0.24

  });


const screenMaterial =
  new THREE.MeshBasicMaterial({

    color: 0x07111d

  });


const cyanMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x6ed6ff,

    emissive: 0x6ed6ff,

    emissiveIntensity: 2.2,

    metalness: 0.1,

    roughness: 0.25

  });


const purpleLightMaterial =
  new THREE.MeshStandardMaterial({

    color: 0x9d8cff,

    emissive: 0x9d8cff,

    emissiveIntensity: 2,

    metalness: 0.1,

    roughness: 0.25

  });


/* =========================================================
   TERMINAL GROUP
   ========================================================= */

const terminal =
  new THREE.Group();


terminal.position.y =
  -0.45;


scene.add(
  terminal
);


/* =========================================================
   HELPER — ROUNDED BOX
   ========================================================= */

function createRoundedBox(
  width,
  height,
  depth,
  radius,
  material
) {

  const geometry =
    new RoundedBoxGeometry(
      width,
      height,
      depth,
      6,
      radius
    );


  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );


  mesh.castShadow = true;

  mesh.receiveShadow = true;


  return mesh;

}


/* =========================================================
   MAIN BASE
   ========================================================= */

const base =
  createRoundedBox(
    7.2,
    0.55,
    2.65,
    0.14,
    darkMetalMaterial
  );


base.position.set(
  0,
  0.25,
  0
);


terminal.add(
  base
);


/* =========================================================
   BASE INNER SURFACE
   ========================================================= */

const baseSurface =
  createRoundedBox(
    6.7,
    0.12,
    2.15,
    0.05,
    darkSurfaceMaterial
  );


baseSurface.position.set(
  0,
  0.55,
  0
);


terminal.add(
  baseSurface
);


/* =========================================================
   LEFT ACCENT
   ========================================================= */

const leftAccent =
  createRoundedBox(
    0.04,
    0.12,
    1.75,
    0.015,
    cyanMaterial
  );


leftAccent.position.set(
  -3.25,
  0.58,
  0.15
);


terminal.add(
  leftAccent
);


/* =========================================================
   RIGHT ACCENT
   ========================================================= */

const rightAccent =
  createRoundedBox(
    0.04,
    0.12,
    1.75,
    0.015,
    purpleLightMaterial
  );


rightAccent.position.set(
  3.25,
  0.58,
  0.15
);


terminal.add(
  rightAccent
);


/* =========================================================
   MONITOR SUPPORT
   ========================================================= */

const support =
  createRoundedBox(
    1.25,
    1.05,
    0.65,
    0.08,
    purpleMetalMaterial
  );


support.position.set(
  0,
  1.02,
  -0.05
);


terminal.add(
  support
);


/* =========================================================
   KEYBOARD DECK
   ========================================================= */

const keyboardDeck =
  createRoundedBox(
    6.45,
    0.25,
    2.2,
    0.08,
    purpleMetalMaterial
  );


keyboardDeck.position.set(
  0,
  0.78,
  0.15
);


keyboardDeck.rotation.x =
  -0.12;


terminal.add(
  keyboardDeck
);


/* =========================================================
   KEYBOARD INNER AREA
   ========================================================= */

const keyboardSurface =
  createRoundedBox(
    5.55,
    0.10,
    1.65,
    0.045,
    keyboardMaterial
  );


keyboardSurface.position.set(
  0,
  0.93,
  0.18
);


keyboardSurface.rotation.x =
  -0.12;


terminal.add(
  keyboardSurface
);


/* =========================================================
   KEYBOARD
   ========================================================= */

const keyRows = [

  {
    count: 14,
    width: 0.29,
    gap: 0.055
  },

  {
    count: 13,
    width: 0.32,
    gap: 0.06
  },

  {
    count: 12,
    width: 0.34,
    gap: 0.06
  },

  {
    count: 10,
    width: 0.38,
    gap: 0.07
  }

];


const keyboardStartY =
  1.02;


keyRows.forEach(
  (row, rowIndex) => {

    const totalWidth =
      row.count *
        row.width +
      (row.count - 1) *
        row.gap;


    const startX =
      -totalWidth / 2 +
      row.width / 2;


    for (
      let i = 0;
      i < row.count;
      i++
    ) {

      const key =
        createRoundedBox(
          row.width,
          0.075,
          0.28,
          0.025,
          keyMaterial
        );


      key.position.set(

        startX +
          i *
            (
              row.width +
              row.gap
            ),

        keyboardStartY -
          rowIndex *
            0.28,

        0.16

      );


      key.rotation.x =
        -0.12;


      terminal.add(
        key
      );

    }

  }
);


/* =========================================================
   SPACE BAR
   ========================================================= */

const spaceBar =
  createRoundedBox(
    2.05,
    0.08,
    0.28,
    0.025,
    keyMaterial
  );


spaceBar.position.set(
  0,
  0.17,
  0.14
);


spaceBar.rotation.x =
  -0.12;


terminal.add(
  spaceBar
);


/* =========================================================
   EXTRA KEYS
   ========================================================= */

const specialKeys = [

  {
    x: -1.65,
    width: 0.5
  },

  {
    x: 1.65,
    width: 0.5
  }

];


specialKeys.forEach(
  (item) => {

    const key =
      createRoundedBox(
        item.width,
        0.08,
        0.28,
        0.025,
        keyMaterial
      );


    key.position.set(
      item.x,
      0.17,
      0.14
    );


    key.rotation.x =
      -0.12;


    terminal.add(
      key
    );

  }
);


/* =========================================================
   SCREEN FRAME
   ========================================================= */

const screenFrame =
  createRoundedBox(
    6.35,
    3.75,
    0.28,
    0.12,
    screenFrameMaterial
  );


screenFrame.position.set(
  0,
  3.05,
  -0.02
);


terminal.add(
  screenFrame
);


/* =========================================================
   SCREEN BEZEL
   ========================================================= */

const screenBezel =
  createRoundedBox(
    5.85,
    3.25,
    0.10,
    0.05,
    darkSurfaceMaterial
  );


screenBezel.position.set(
  0,
  3.05,
  0.17
);


terminal.add(
  screenBezel
);


/* =========================================================
   SCREEN
   ========================================================= */

const screenGeometry =
  new THREE.PlaneGeometry(
    5.45,
    2.9
  );


const screen =
  new THREE.Mesh(
    screenGeometry,
    screenMaterial
  );


screen.position.set(
  0,
  3.05,
  0.225
);


terminal.add(
  screen
);


/* =========================================================
   SCREEN INTERACTION
   ========================================================= */

screen.userData.isInteractive =
  true;


/* =========================================================
   SCREEN GLOW FRAME
   ========================================================= */

const screenGlowTop =
  createRoundedBox(
    5.45,
    0.025,
    0.025,
    0.01,
    cyanMaterial
  );


screenGlowTop.position.set(
  0,
  4.505,
  0.24
);


terminal.add(
  screenGlowTop
);


const screenGlowBottom =
  createRoundedBox(
    5.45,
    0.025,
    0.025,
    0.01,
    purpleLightMaterial
  );


screenGlowBottom.position.set(
  0,
  1.595,
  0.24
);


terminal.add(
  screenGlowBottom
);


/* =========================================================
   SIDE STATUS LIGHTS
   ========================================================= */

for (
  let i = 0;
  i < 4;
  i++
) {

  const light =
    createRoundedBox(
      0.035,
      0.18,
      0.035,
      0.01,
      i % 2 === 0
        ? cyanMaterial
        : purpleLightMaterial
    );


  light.position.set(
    -3.02,
    2.35 -
      i *
        0.32,
    0.21
  );


  terminal.add(
    light
  );

}


/* =========================================================
   TOP DETAILS
   ========================================================= */

const topPanel =
  createRoundedBox(
    4.1,
    0.08,
    0.06,
    0.02,
    darkSurfaceMaterial
  );


topPanel.position.set(
  0,
  4.66,
  0.1
);


terminal.add(
  topPanel
);


/* =========================================================
   SMALL STATUS LIGHTS
   ========================================================= */

const statusPositions = [
  -1.75,
  -1.25,
  1.25,
  1.75
];


statusPositions.forEach(
  (x, index) => {

    const light =
      createRoundedBox(
        0.08,
        0.08,
        0.04,
        0.02,
        index % 2 === 0
          ? cyanMaterial
          : purpleLightMaterial
      );


    light.position.set(
      x,
      4.67,
      0.16
    );


    terminal.add(
      light
    );

  }
);


/* =========================================================
   KEYBOARD LIGHT STRIP
   ========================================================= */

const keyboardLightStrip =
  createRoundedBox(
    4.7,
    0.025,
    0.025,
    0.01,
    cyanMaterial
  );


keyboardLightStrip.position.set(
  0,
  0.68,
  1.23
);


terminal.add(
  keyboardLightStrip
);


/* =========================================================
   SCREEN HTML INTERFACE
   ========================================================= */

function createTerminalInterface() {

  const isMobile =
    isMobileViewport();


  const screenWidth =
    isMobile
      ? 540
      : 900;


  const screenHeight =
    isMobile
      ? 288
      : 480;


  const element =
    document.createElement(
      "div"
    );


  element.className =
    "contact-terminal-ui";


  element.style.width =
    `${screenWidth}px`;


  element.style.height =
    `${screenHeight}px`;


  element.style.pointerEvents =
    "auto";


  element.innerHTML = `

    <div class="terminal-interface">

      <div class="terminal-topbar">

        <div class="terminal-brand">
          ${t.terminal}
        </div>

        <div class="terminal-status">

          <span class="status-dot"></span>

          ${t.online}

          <button
            type="button"
            class="terminal-zoom-control"
            aria-label="${t.zoom}"
            title="${t.focus}"
          >
            ⤢
          </button>

        </div>

      </div>


      <div class="terminal-system">

        <div class="terminal-line boot-line">
          ${t.initialized}
        </div>

        <div class="terminal-line boot-line">
          ${t.secure}
        </div>

        <div class="terminal-line terminal-muted boot-line">
          ${t.ready}
        </div>

      </div>


      <div class="terminal-main">

        <div class="terminal-heading">

          <span>
            ${t.build}
          </span>

          <span>
            ${t.together}
          </span>

        </div>


        <div class="terminal-channels">

          <a
            href="mailto:lfrcreations.dev@gmail.com"
            class="terminal-channel"
          >

            <span class="channel-index">
              01
            </span>

            <span>
              ${t.email}
            </span>

            <span class="channel-arrow">
              ↗
            </span>

          </a>


          <a
            href="https://www.linkedin.com/in/laura-f%C3%A9lix-87ba612b4/"
            target="_blank"
            rel="noopener noreferrer"
            class="terminal-channel"
          >

            <span class="channel-index">
              02
            </span>

            <span>
              ${t.linkedin}
            </span>

            <span class="channel-arrow">
              ↗
            </span>

          </a>


          <a
            href="https://github.com/laufr14"
            target="_blank"
            rel="noopener noreferrer"
            class="terminal-channel"
          >

            <span class="channel-index">
              03
            </span>

            <span>
              ${t.github}
            </span>

            <span class="channel-arrow">
              ↗
            </span>

          </a>

        </div>


        <form
          class="terminal-form"
          autocomplete="off"
        >

          <div class="terminal-field">

            <label for="terminal-name">
              ${t.name}
            </label>

            <input
              id="terminal-name"
              name="name"
              type="text"
              placeholder="${t.namePlaceholder}"
              required
            />

          </div>


          <div class="terminal-field">

            <label for="terminal-email">
              ${t.emailField}
            </label>

            <input
              id="terminal-email"
              name="email"
              type="email"
              placeholder="${t.emailPlaceholder}"
              required
            />

          </div>


          <div class="terminal-field">

            <label for="terminal-message">
              ${t.message}
            </label>

            <textarea
              id="terminal-message"
              name="message"
              placeholder="${t.messagePlaceholder}"
              required
            ></textarea>

          </div>


          <button
            type="submit"
            class="terminal-submit"
          >

            <span>
              ${t.transmit}
            </span>

            <span>
              →
            </span>

          </button>

        </form>

      </div>


      <div class="terminal-footer">

        <span>
          ${t.connection}
        </span>

        <span>

          <span class="terminal-cursor">
            _
          </span>

        </span>

      </div>

    </div>

  `;


  /* =======================================================
     CSS3D OBJECT
     ======================================================= */

  const object =
    new CSS3DObject(
      element
    );


  object.position.set(
    0,
    0,
    0.012
  );


  const scaleX =
    5.45 /
    screenWidth;


  const scaleY =
    2.9 /
    screenHeight;


  object.scale.set(
    scaleX,
    scaleY,
    1
  );


  screen.add(
    object
  );


  setupForm(
    element
  );


  setupScreenZoomControl(
    element
  );


  startTerminalBoot(
    element
  );


  return object;

}


const screenUI =
  createTerminalInterface();


/* =========================================================
   SCREEN ZOOM
   ========================================================= */

function toggleScreenZoom() {

  isScreenZoomed =
    !isScreenZoomed;


  const mobile =
    isMobileViewport();


  targetCameraFov =
    mobile
      ? (isScreenZoomed ? 72 : 65)
      : 45;


  if (isScreenZoomed) {

    cameraTargetPosition =
      zoomCameraPosition.clone();


    cameraTargetLookAt =
      zoomLookAt.clone();


    document.body.classList.add(
      "contact-screen-zoom"
    );

  } else {

    cameraTargetPosition =
      normalCameraPosition.clone();


    cameraTargetLookAt =
      normalLookAt.clone();


    document.body.classList.remove(
      "contact-screen-zoom"
    );

  }

}


/* =========================================================
   ZOOM CONTROL
   ========================================================= */

function setupScreenZoomControl(
  element
) {

  const control =
    element.querySelector(
      ".terminal-zoom-control"
    );


  if (!control) {
    return;
  }


  control.addEventListener(
    "click",
    (event) => {

      event.preventDefault();

      event.stopPropagation();

      toggleScreenZoom();

    }
  );

}


/* =========================================================
   FORM
   ========================================================= */

function setupForm(
  element
) {

  const form =
    element.querySelector(
      ".terminal-form"
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const name =
        form.elements.name.value.trim();


      const email =
        form.elements.email.value.trim();


      const message =
        form.elements.message.value.trim();


      if (
        !name ||
        !email ||
        !message
      ) {

        return;

      }


      const button =
        form.querySelector(
          ".terminal-submit"
        );


      /*
       * Temporary mail client.
       *
       * The portfolio opens the user's
       * default email application.
       */

      const destination =
        "lfrcreations.dev@gmail.com";


      const subject =
        encodeURIComponent(
          `Portfolio contact from ${name}`
        );


      const body =
        encodeURIComponent(
          `Name: ${name}\n` +
          `Email: ${email}\n\n` +
          `${message}`
        );


      button.disabled =
        true;


      button.innerHTML = `

        <span>
          ${t.transmitting}
        </span>

        <span>
          ◌
        </span>

      `;


      setTimeout(
        () => {

          window.location.href =
            `mailto:${destination}` +
            `?subject=${subject}` +
            `&body=${body}`;


          button.disabled =
            false;


          button.innerHTML = `

            <span>
              ${t.transmit}
            </span>

            <span>
              →
            </span>

          `;

        },
        500
      );

    }
  );

}


/* =========================================================
   BOOT ANIMATION
   ========================================================= */

function startTerminalBoot(
  element
) {

  const lines =
    element.querySelectorAll(
      ".boot-line"
    );


  lines.forEach(
    (line, index) => {

      line.style.opacity =
        "0";


      setTimeout(
        () => {

          line.style.opacity =
            "1";

        },
        400 +
          index *
            450
      );

    }
  );

}


/* =========================================================
   SPACE
   ========================================================= */

const starGeometry =
  new THREE.BufferGeometry();


const starCount =
  1800;


const starPositions =
  new Float32Array(
    starCount * 3
  );


for (
  let i = 0;
  i < starCount;
  i++
) {

  const radius =
    12 +
    Math.random() *
      28;


  const theta =
    Math.random() *
    Math.PI *
      2;


  const phi =
    Math.acos(
      2 *
        Math.random() -
        1
    );


  starPositions[
    i * 3
  ] =
    radius *
    Math.sin(phi) *
    Math.cos(theta);


  starPositions[
    i * 3 + 1
  ] =
    radius *
    Math.sin(phi) *
    Math.sin(theta);


  starPositions[
    i * 3 + 2
  ] =
    radius *
    Math.cos(phi);

}


starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    starPositions,
    3
  )
);


const starMaterial =
  new THREE.PointsMaterial({

    color: 0xb7b9ff,

    size: 0.022,

    transparent: true,

    opacity: 0.55,

    depthWrite: false

  });


const stars =
  new THREE.Points(
    starGeometry,
    starMaterial
  );


scene.add(
  stars
);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight =
  new THREE.AmbientLight(
    0x9d8cff,
    0.38
  );


scene.add(
  ambientLight
);


/* =========================================================
   PURPLE LIGHT
   ========================================================= */

const purpleLight =
  new THREE.PointLight(
    0x9d8cff,
    7,
    15
  );


purpleLight.position.set(
  4,
  4,
  5
);


scene.add(
  purpleLight
);


/* =========================================================
   CYAN LIGHT
   ========================================================= */

const cyanLight =
  new THREE.PointLight(
    0x6ed6ff,
    5,
    12
  );


cyanLight.position.set(
  -4,
  2,
  4
);


scene.add(
  cyanLight
);


/* =========================================================
   FRONT LIGHT
   ========================================================= */

const frontLight =
  new THREE.PointLight(
    0xffffff,
    2,
    10
  );


frontLight.position.set(
  0,
  2,
  5
);


scene.add(
  frontLight
);


/* =========================================================
   KEYBOARD GLOW
   ========================================================= */

const keyboardGlow =
  new THREE.PointLight(
    0x6ed6ff,
    2.2,
    7
  );


keyboardGlow.position.set(
  0,
  0.8,
  2.5
);


scene.add(
  keyboardGlow
);


/* =========================================================
   POINTER
   ========================================================= */

const pointer =
  new THREE.Vector2();


const targetPointer =
  new THREE.Vector2();


window.addEventListener(
  "pointermove",
  (event) => {

    targetPointer.x =
      (
        event.clientX /
        window.innerWidth
      ) *
        2 -
      1;


    targetPointer.y =
      -(
        (
          event.clientY /
          window.innerHeight
        ) *
          2 -
        1
      );

  }
);


/* =========================================================
   SCREEN RAYCAST
   ========================================================= */

const raycaster =
  new THREE.Raycaster();


const mouse =
  new THREE.Vector2();


window.addEventListener(
  "pointerdown",
  (event) => {

    /*
     * The HTML interface handles
     * its own controls and form fields.
     */

    if (
      event.target.closest(
        ".contact-terminal-ui"
      )
    ) {

      return;

    }


    mouse.x =
      (
        event.clientX /
        window.innerWidth
      ) *
        2 -
      1;


    mouse.y =
      -(
        (
          event.clientY /
          window.innerHeight
        ) *
          2 -
        1
      );


    raycaster.setFromCamera(
      mouse,
      camera
    );


    const intersections =
      raycaster.intersectObject(
        screen,
        false
      );


    if (
      intersections.length > 0
    ) {

      toggleScreenZoom();

    }

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


  /* -----------------------------------------------
     Smooth pointer
     ----------------------------------------------- */

  const delta =
    clock.getDelta();


  const pointerSmoothing =
    1 - Math.exp(
      -1.52 * delta
    );


  pointer.x +=
    (
      targetPointer.x -
      pointer.x
    ) *
    pointerSmoothing;


  pointer.y +=
    (
      targetPointer.y -
      pointer.y
    ) *
    pointerSmoothing;


  /* -----------------------------------------------
     Smooth camera movement
     ----------------------------------------------- */

  const finalCameraX =
    cameraTargetPosition.x +
    pointer.x *
      (
        isScreenZoomed
          ? 0.035
          : 0.08
      );


  const finalCameraY =
    cameraTargetPosition.y +
    pointer.y *
      (
        isScreenZoomed
          ? 0.025
          : 0.05
      );


  const cameraSmoothing =
    1 - Math.exp(
      -2.77 * delta
    );


  camera.position.x +=
    (
      finalCameraX -
      camera.position.x
    ) *
    cameraSmoothing;


  camera.position.y +=
    (
      finalCameraY -
      camera.position.y
    ) *
    cameraSmoothing;


  camera.position.z +=
    (
      cameraTargetPosition.z -
      camera.position.z
    ) *
    cameraSmoothing;


  /* -----------------------------------------------
     Camera look-at
     ----------------------------------------------- */

  const finalLookAtX =
    cameraTargetLookAt.x +
    pointer.x *
      (
        isScreenZoomed
          ? 0.015
          : 0.025
      );


  const finalLookAtY =
    cameraTargetLookAt.y +
    pointer.y *
      (
        isScreenZoomed
          ? 0.012
          : 0.025
      );


  camera.lookAt(
    finalLookAtX,
    finalLookAtY,
    cameraTargetLookAt.z
  );


  /* -----------------------------------------------
     Terminal parallax
     ----------------------------------------------- */

  const mobile =
    isMobileViewport();


  const terminalRotationMultiplier =
    mobile
      ? 0
      : (
        isScreenZoomed
          ? 0.006
          : 0.012
      );


  const terminalSmoothing =
    1 - Math.exp(
      -1.52 * delta
    );


  terminal.rotation.y +=
    (
      pointer.x *
        terminalRotationMultiplier -
      terminal.rotation.y
    ) *
    terminalSmoothing;


  terminal.rotation.x +=
    (
      -pointer.y *
        terminalRotationMultiplier *
        0.5 -
      terminal.rotation.x
    ) *
    terminalSmoothing;


  /* -----------------------------------------------
     Subtle star movement
     ----------------------------------------------- */

  stars.rotation.y =
    clock.getElapsedTime() *
    0.002;


  /* -----------------------------------------------
     Render
     ----------------------------------------------- */

  const fovSmoothing =
    1 - Math.exp(
      -4.99 * delta
    );


  camera.fov +=
    (
      targetCameraFov -
      camera.fov
    ) *
    fovSmoothing;


  camera.updateProjectionMatrix();


  renderer.render(
    scene,
    camera
  );


  cssRenderer.render(
    scene,
    camera
  );

}


/* =========================================================
   START
   ========================================================= */

animate();


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    const width =
      window.innerWidth;


    const height =
      window.innerHeight;


    camera.aspect =
      width /
      height;


    /*
     * Responsive field of view and camera distance.
     */

    if (width <= 560) {

      targetCameraFov =
        isScreenZoomed
          ? 72
          : 65;


      normalCameraPosition.z =
        8.8;


      normalCameraPosition.y =
        1.45;


      zoomCameraPosition.z =
        7.2;


      zoomCameraPosition.y =
        2.05;

    } else if (width < 700) {

      targetCameraFov =
        45;


      normalCameraPosition.z =
        8.4;


      normalCameraPosition.y =
        1.55;


      zoomCameraPosition.z =
        5.0;


      zoomCameraPosition.y =
        2.20;

    } else {

      targetCameraFov =
        45;


      normalCameraPosition.z =
        6.2;


      normalCameraPosition.y =
        1.65;


      zoomCameraPosition.z =
        3.65;


      zoomCameraPosition.y =
        2.20;

    }


    cameraTargetPosition =
      isScreenZoomed
        ? zoomCameraPosition.clone()
        : normalCameraPosition.clone();


    cameraTargetLookAt =
      isScreenZoomed
        ? zoomLookAt.clone()
        : normalLookAt.clone();


    camera.updateProjectionMatrix();


    renderer.setSize(
      width,
      height
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );


    cssRenderer.setSize(
      width,
      height
    );

  }
);