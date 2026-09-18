import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const intro = document.querySelector("#intro");
const container = document.querySelector("#intro-webgl");
const skipButton = document.querySelector("#skip-intro");

let mainSceneLoaded = false;

async function loadMainScene() {
  if (mainSceneLoaded) {
    return;
  }

  mainSceneLoaded = true;

  try {
    await import("./main.js");
  } catch (error) {
    console.error(
      "Unable to load the Home 3D scene.",
      error
    );
  }
}

if (!intro || !container) {
  console.warn("Intro elements not found.");
} else {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const seenKey = "lauraPortfolioIntroSeen";

  // ---------------------------------------------------------------
  // INTRO SESSION STATE
  // The intro should only appear once per browser session.
  // ---------------------------------------------------------------

  let introAlreadySeen = false;

  try {
    introAlreadySeen = sessionStorage.getItem(seenKey) === "true";
  } catch (error) {
    console.warn(
      "Session storage unavailable — intro will still work normally."
    );
  }

  const shouldShow = !introAlreadySeen && !reducedMotion;

if (!shouldShow) {
  // Intro has already been seen or reduced motion is enabled.
  intro.remove();

  // Load Home immediately.
  loadMainScene();
} else {
    // Mark the intro as seen immediately when it starts.
    //
    // This is important for navigation:
    // if the user enters Home once and later returns from
    // About / Projects / Contact, the intro will not replay.
    try {
      sessionStorage.setItem(seenKey, "true");
    } catch (error) {
      console.warn(
        "Session storage unavailable — intro state cannot persist between pages."
      );
    }

    initIntro();
  }
}

function initIntro() {
  intro.classList.add("is-active");
  intro.setAttribute("aria-hidden", "false");

  // ---------------------------------------------------------------
  // SCENE
  // ---------------------------------------------------------------

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040a);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 0.35, 8.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  container.appendChild(renderer.domElement);

  // ---------------------------------------------------------------
  // UNIVERSE
  // ---------------------------------------------------------------

  const stars = createStars();
  scene.add(stars);

  const violet = new THREE.PointLight(
    0x8b7cff,
    18,
    16
  );

  violet.position.set(-4, 2.5, 4);
  scene.add(violet);

  const blue = new THREE.PointLight(
    0x6ea8ff,
    13,
    18
  );

  blue.position.set(4, -1.5, 3);
  scene.add(blue);

  scene.add(
    new THREE.AmbientLight(0xffffff, 0.16)
  );

  // ---------------------------------------------------------------
  // PLANET
  // ---------------------------------------------------------------

  const planet = createPlanet();

  planet.position.set(
    1.45,
    -0.25,
    -0.6
  );

  planet.scale.setScalar(1.55);

  scene.add(planet);

  const atmosphere = createAtmosphere();

  atmosphere.position.copy(planet.position);
  atmosphere.scale.copy(planet.scale);

  scene.add(atmosphere);

  // Replace the temporary procedural planet
  // with the real GLB once it loads.

  loadPlanet((model) => {
    scene.remove(planet);
    scene.remove(atmosphere);

    scene.add(model);

    const modelAtmosphere = createAtmosphere();

    modelAtmosphere.position.copy(model.position);
    modelAtmosphere.scale.copy(model.scale);

    scene.add(modelAtmosphere);
  });

  // ---------------------------------------------------------------
  // SPACESHIP
  // ---------------------------------------------------------------

  const spaceshipGroup = new THREE.Group();

  scene.add(spaceshipGroup);

  let spaceship = createFallbackShip();

  spaceshipGroup.add(spaceship);

  loadSpaceship(
    spaceshipGroup,
    (model) => {
      spaceshipGroup.remove(spaceship);

      spaceship = model;

      spaceshipGroup.add(spaceship);
    }
  );

  // ---------------------------------------------------------------
  // INTRO TIMING
  // ---------------------------------------------------------------

  const start = performance.now();

  let finished = false;
  let animationFrame;
  let finishTimer;

  function finishIntro() {
  if (finished) {
    return;
  }

  finished = true;

  clearTimeout(finishTimer);
  cancelAnimationFrame(animationFrame);

  intro.classList.add("is-exiting");

  // Wait for the visual fade-out to finish,
  // then remove the intro and load Home.
  setTimeout(async () => {
    intro.remove();

    await loadMainScene();
  }, 720);
}

  // ---------------------------------------------------------------
  // SKIP
  // ---------------------------------------------------------------

  if (skipButton) {
    skipButton.addEventListener(
      "click",
      finishIntro
    );
  }

  // ---------------------------------------------------------------
  // SAFETY FALLBACK
  // ---------------------------------------------------------------

  // Even if WebGL/animation is interrupted,
  // the intro can never trap the user on this screen.

  finishTimer = setTimeout(
    finishIntro,
    4600
  );

  // ---------------------------------------------------------------
  // ANIMATION
  // ---------------------------------------------------------------

  function animate(now) {
    if (finished) return;

    const elapsed =
      (now - start) / 1000;

    const t = Math.min(
      elapsed / 3.8,
      1
    );

    // Smooth cinematic approach:
    // ease in/out rather than linear movement.

    const ease =
      t * t * (3 - 2 * t);

    spaceshipGroup.position.set(
      THREE.MathUtils.lerp(
        -4.6,
        0.95,
        ease
      ),

      THREE.MathUtils.lerp(
        1.05,
        0.0,
        ease
      ) +
        Math.sin(
          elapsed * 1.2
        ) *
          0.035,

      THREE.MathUtils.lerp(
        0.7,
        0.0,
        ease
      )
    );

    spaceshipGroup.rotation.z =
      THREE.MathUtils.lerp(
        -0.08,
        0.02,
        ease
      );

    spaceshipGroup.rotation.y =
      Math.sin(
        elapsed * 0.7
      ) *
      0.025;

    planet.rotation.y += 0.0015;
    stars.rotation.y += 0.00012;

    const cameraEase = Math.min(
      Math.max(
        (t - 0.55) / 0.45,
        0
      ),
      1
    );

    camera.position.z =
      THREE.MathUtils.lerp(
        8.5,
        6.7,
        cameraEase
      );

    camera.position.x =
      Math.sin(
        elapsed * 0.35
      ) *
      0.05;

    camera.lookAt(
      0.45,
      -0.05,
      0
    );

    renderer.render(
      scene,
      camera
    );

    if (t >= 1) {
      finishIntro();
      return;
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );
  }

  // ---------------------------------------------------------------
  // RESIZE
  // ---------------------------------------------------------------

  window.addEventListener(
    "resize",
    () => {
      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
    }
  );

  animationFrame =
    requestAnimationFrame(
      animate
    );
}

// ---------------------------------------------------------------
// STARS
// ---------------------------------------------------------------

function createStars() {
  const count = 850;

  const positions =
    new Float32Array(
      count * 3
    );

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const radius =
      12 +
      Math.random() * 30;

    const theta =
      Math.random() *
      Math.PI *
      2;

    const phi =
      Math.acos(
        Math.random() * 2 - 1
      );

    positions[i * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    positions[i * 3 + 1] =
      radius *
      Math.cos(phi);

    positions[i * 3 + 2] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xdde5ff,
      size: 0.022,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });

  return new THREE.Points(
    geometry,
    material
  );
}

// ---------------------------------------------------------------
// PLANET LOADER
// ---------------------------------------------------------------

function loadPlanet(onLoaded) {
  const loader =
    new GLTFLoader();

  loader.load(
    "./assets/models/planet.glb",

    (gltf) => {
      const model =
        gltf.scene;

      model.traverse(
        (child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
          }
        }
      );

      const box =
        new THREE.Box3().setFromObject(
          model
        );

      const center =
        new THREE.Vector3();

      const size =
        new THREE.Vector3();

      box.getCenter(center);
      box.getSize(size);

      model.position.sub(center);

      const maxDimension =
        Math.max(
          size.x,
          size.y,
          size.z
        ) || 1;

      model.scale.setScalar(
        3.1 / maxDimension
      );

      model.position.set(
        1.45,
        -0.25,
        -0.6
      );

      onLoaded(model);

      console.log(
        "Real planet loaded for V3.3 intro."
      );
    },

    undefined,

    (error) => {
      console.log(
        "No planet.glb found — using the procedural planet.",
        error
      );
    }
  );
}

// ---------------------------------------------------------------
// PROCEDURAL PLANET
// ---------------------------------------------------------------

function createPlanet() {
  const geometry =
    new THREE.SphereGeometry(
      1,
      48,
      48
    );

  const material =
    new THREE.MeshStandardMaterial({
      color: 0x15192b,
      metalness: 0.12,
      roughness: 0.82,
      emissive: 0x251b5a,
      emissiveIntensity: 0.42
    });

  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );

  // Minimal surface accents:
  // two very subtle rings make the destination feel designed.

  const ringGeometry =
    new THREE.TorusGeometry(
      1.04,
      0.008,
      12,
      128
    );

  const ringMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      transparent: true,
      opacity: 0.22
    });

  const ring =
    new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );

  ring.rotation.set(
    0.45,
    0.2,
    0.2
  );

  mesh.add(ring);

  return mesh;
}

// ---------------------------------------------------------------
// ATMOSPHERE
// ---------------------------------------------------------------

function createAtmosphere() {
  const geometry =
    new THREE.SphereGeometry(
      1.04,
      48,
      48
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      transparent: true,
      opacity: 0.055,
      side: THREE.BackSide,
      blending:
        THREE.AdditiveBlending,
      depthWrite: false
    });

  return new THREE.Mesh(
    geometry,
    material
  );
}

// ---------------------------------------------------------------
// FALLBACK SPACESHIP
// ---------------------------------------------------------------

function createFallbackShip() {
  const group =
    new THREE.Group();

  const body =
    new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.12,
        0.72,
        6,
        16
      ),
      new THREE.MeshStandardMaterial({
        color: 0x9ba4b4,
        metalness: 0.65,
        roughness: 0.3
      })
    );

  body.rotation.z =
    Math.PI / 2;

  group.add(body);

  const wingMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x242a38,
      metalness: 0.5,
      roughness: 0.42
    });

  const wing =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.55,
        0.025,
        0.18
      ),
      wingMaterial
    );

  wing.position.set(
    -0.08,
    0,
    0
  );

  group.add(wing);

  const glow =
    new THREE.PointLight(
      0x6ea8ff,
      2.4,
      1.7
    );

  glow.position.x =
    -0.48;

  group.add(glow);

  group.scale.setScalar(
    0.72
  );

  group.rotation.z =
    -0.12;

  return group;
}

// ---------------------------------------------------------------
// SPACESHIP LOADER
// ---------------------------------------------------------------

function loadSpaceship(
  parent,
  onLoaded
) {
  const loader =
    new GLTFLoader();

  loader.load(
    "./assets/models/spaceship.glb",

    (gltf) => {
      const model =
        gltf.scene;

      model.traverse(
        (child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
          }
        }
      );

      const box =
        new THREE.Box3().setFromObject(
          model
        );

      const center =
        new THREE.Vector3();

      const size =
        new THREE.Vector3();

      box.getCenter(center);
      box.getSize(size);

      model.position.sub(center);

      const maxDimension =
        Math.max(
          size.x,
          size.y,
          size.z
        ) || 1;

      model.scale.setScalar(
        1.15 / maxDimension
      );

      model.rotation.set(
        0,
        0,
        0
      );

      onLoaded(model);

      console.log(
        "Dreamchaser loaded for V3.3 intro."
      );
    },

    undefined,

    () =>
      console.log(
        "No spaceship.glb found — using the lightweight fallback ship."
      )
  );
}