import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   CONTAINER
   ========================================================= */

const container = document.querySelector("#webgl");

if (!container) {
    throw new Error("WebGL container not found.");
}


/* =========================================================
   SCENE
   ========================================================= */

const scene = new THREE.Scene();


/* =========================================================
   CAMERA
   ========================================================= */

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    300
);

const isMobile = window.innerWidth <= 560;

camera.position.set(
    0,
    0,
    isMobile ? 11.5 : 8
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

renderer.setClearColor(0x000000, 0);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

container.appendChild(renderer.domElement);


/* =========================================================
   SCENE READY GATE
   ========================================================= */

let sceneReady = false;

function markSceneReady() {

    if (sceneReady) {
        return;
    }

    sceneReady = true;

    renderer.render(
        scene,
        camera
    );

    document.body.classList.remove(
        "scene-loading"
    );

    document.body.classList.add(
        "scene-ready"
    );

}


/* =========================================================
   STARFIELD
   ========================================================= */

const starCount = 5000;

const starPositions = new Float32Array(
    starCount * 3
);

for (let i = 0; i < starCount; i++) {

    const index = i * 3;

    starPositions[index] =
        THREE.MathUtils.randFloatSpread(120);

    starPositions[index + 1] =
        THREE.MathUtils.randFloatSpread(120);

    starPositions[index + 2] =
        THREE.MathUtils.randFloatSpread(120);
}


const starGeometry =
    new THREE.BufferGeometry();

starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);


const starMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });


const stars =
    new THREE.Points(
        starGeometry,
        starMaterial
    );

scene.add(stars);

/* =========================================================
   CENTRAL PURPLE PLANET
   ========================================================= */

/*
 * The planet is rendered in two stages:
 *
 * 1. Lightweight procedural preview → immediate
 * 2. Real GLB model → replaces preview when ready
 *
 * This prevents the scene from showing empty space
 * while purple_planet.glb is loading.
 */

let planet = null;


/* =========================================================
   PLANET PREVIEW
   ========================================================= */

function createPlanetPreview() {

    const group =
        new THREE.Group();


    /* -------------------------------------------------------
       MAIN SURFACE
       ------------------------------------------------------- */

    const geometry =
        new THREE.SphereGeometry(
            1.7,
            48,
            48
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: 0x171329,

            metalness: 0.0,

            roughness: 0.58,

            emissive: 0x180c38,

            emissiveIntensity: 0.18

        });


    const surface =
        new THREE.Mesh(
            geometry,
            material
        );


    group.add(surface);


    /* -------------------------------------------------------
       ATMOSPHERIC RIM
       ------------------------------------------------------- */

    const atmosphereGeometry =
        new THREE.SphereGeometry(
            1.74,
            48,
            48
        );


    const atmosphereMaterial =
        new THREE.ShaderMaterial({

            transparent: true,

            depthWrite: false,

            depthTest: true,

            side: THREE.BackSide,

            blending:
                THREE.AdditiveBlending,

            uniforms: {

                atmosphereColor: {
                    value:
                        new THREE.Color(
                            0x9d8cff
                        )
                },

                atmosphereStrength: {
                    value: 0.22
                }

            },

            vertexShader: `
                varying vec3 vWorldPosition;
                varying vec3 vWorldNormal;

                void main() {

                    vec4 worldPosition =
                        modelMatrix *
                        vec4(position, 1.0);

                    vWorldPosition =
                        worldPosition.xyz;

                    vWorldNormal =
                        normalize(
                            mat3(modelMatrix) *
                            normal
                        );

                    gl_Position =
                        projectionMatrix *
                        viewMatrix *
                        worldPosition;
                }
            `,

            fragmentShader: `
                uniform vec3 atmosphereColor;
                uniform float atmosphereStrength;

                varying vec3 vWorldPosition;
                varying vec3 vWorldNormal;

                void main() {

                    vec3 viewDirection =
                        normalize(
                            cameraPosition -
                            vWorldPosition
                        );

                    float viewAngle =
                        abs(
                            dot(
                                normalize(
                                    vWorldNormal
                                ),
                                viewDirection
                            )
                        );

                    float rim =
                        pow(
                            1.0 - viewAngle,
                            3.5
                        );

                    float intensity =
                        rim *
                        atmosphereStrength;

                    gl_FragColor =
                        vec4(
                            atmosphereColor,
                            intensity
                        );
                }
            `

        });


    const atmosphere =
        new THREE.Mesh(
            atmosphereGeometry,
            atmosphereMaterial
        );


    group.add(
        atmosphere
    );


    /* -------------------------------------------------------
       SUBTLE RING
       ------------------------------------------------------- */

    const ringGeometry =
        new THREE.TorusGeometry(
            1.78,
            0.008,
            12,
            96
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x8b7cff,

            transparent: true,

            opacity: 0.18,

            depthWrite: false

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


    group.add(
        ring
    );


    return group;
}


/* =========================================================
   PLANET FALLBACK
   ========================================================= */

let planetPreview = null;


/* =========================================================
   REAL PLANET MODEL
   ========================================================= */

const gltfLoader =
    new GLTFLoader();


gltfLoader.load(

    "./assets/models/purple_planet.glb",


    (gltf) => {

        const realPlanet =
            gltf.scene;


        realPlanet.scale.setScalar(
            1.64
        );


        realPlanet.position.set(
            0,
            0,
            0
        );


        realPlanet.traverse(
            (object) => {

                if (!object.isMesh) {
                    return;
                }


                object.castShadow =
                    false;

                object.receiveShadow =
                    false;


                if (!object.material) {
                    return;
                }


                /* ------------------------------------------------
                   PLANET SURFACE
                   ------------------------------------------------ */

                if (
                    object.material.name ===
                        "PurplePlanet" &&
                    (
                        object.material
                            .isMeshStandardMaterial ||
                        object.material
                            .isMeshPhysicalMaterial
                    )
                ) {

                    object.material.metalness =
                        0.0;

                    object.material.roughness =
                        0.58;

                    object.material.emissive.set(
                        0x180c38
                    );

                    object.material.emissiveIntensity =
                        0.18;

                }


                /* ------------------------------------------------
                   CLOUDS
                   ------------------------------------------------ */

                if (
                    (
                        object.material.name ===
                            "Clouds_0" ||
                        object.material.name ===
                            "Clouds_1"
                    ) &&
                    (
                        object.material
                            .isMeshStandardMaterial ||
                        object.material
                            .isMeshPhysicalMaterial
                    )
                ) {

                    object.material.emissiveIntensity =
                        0.22;

                }


                object.material.needsUpdate =
                    true;

            }
        );


        /* -------------------------------------------------------
           REAL PLANET ATMOSPHERE
           ------------------------------------------------------- */

        const atmosphereGeometry =
            new THREE.SphereGeometry(
                1.08,
                64,
                64
            );


        const atmosphereMaterial =
            new THREE.ShaderMaterial({

                transparent: true,

                depthWrite: false,

                depthTest: true,

                side: THREE.BackSide,

                blending:
                    THREE.AdditiveBlending,

                uniforms: {

                    atmosphereColor: {
                        value:
                            new THREE.Color(
                                0x9d8cff
                            )
                    },

                    atmosphereStrength: {
                        value: 0.22
                    }

                },

                vertexShader: `
                    varying vec3 vWorldPosition;
                    varying vec3 vWorldNormal;

                    void main() {

                        vec4 worldPosition =
                            modelMatrix *
                            vec4(position, 1.0);

                        vWorldPosition =
                            worldPosition.xyz;

                        vWorldNormal =
                            normalize(
                                mat3(modelMatrix) *
                                normal
                            );

                        gl_Position =
                            projectionMatrix *
                            viewMatrix *
                            worldPosition;
                    }
                `,

                fragmentShader: `
                    uniform vec3 atmosphereColor;
                    uniform float atmosphereStrength;

                    varying vec3 vWorldPosition;
                    varying vec3 vWorldNormal;

                    void main() {

                        vec3 viewDirection =
                            normalize(
                                cameraPosition -
                                vWorldPosition
                            );

                        float viewAngle =
                            abs(
                                dot(
                                    normalize(
                                        vWorldNormal
                                    ),
                                    viewDirection
                                )
                            );

                        float rim =
                            pow(
                                1.0 - viewAngle,
                                3.5
                            );

                        float intensity =
                            rim *
                            atmosphereStrength;

                        gl_FragColor =
                            vec4(
                                atmosphereColor,
                                intensity
                            );
                    }
                `

            });


        const atmosphere =
            new THREE.Mesh(
                atmosphereGeometry,
                atmosphereMaterial
            );


        atmosphere.scale.setScalar(
            1.025
        );


        realPlanet.add(
            atmosphere
        );


        /* -------------------------------------------------------
           SHOW REAL MODEL
           ------------------------------------------------------- */

        planet =
            realPlanet;


        scene.add(
            planet
        );


        markSceneReady();

    },


    undefined,


    (error) => {

        /*
         * Keep the preview planet.
         *
         * The user already sees a complete planet,
         * so a GLB failure is visually harmless.
         */

        console.warn(
            "Unable to load Purple Planet model. Showing fallback preview.",
            error
        );

        planet =
            createPlanetPreview();

        planet.scale.setScalar(
            0.965
        );

        scene.add(
            planet
        );

        markSceneReady();

    }

);


/* =========================================================
   PREVIEW CLEANUP
   ========================================================= */

function disposePlanetPreview(
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
                        : [child.material];


                materials.forEach(
                    (material) => {

                        if (
                            material.map
                        ) {
                            material.map.dispose();
                        }

                        material.dispose();

                    }
                );

            }

        }
    );

}

/* =========================================================
   ORBITAL SYSTEM
   ========================================================= */

const orbitGroup =
    new THREE.Group();

scene.add(orbitGroup);


/* =========================================================
   ORBIT SYSTEM HELPERS
   ========================================================= */

function createOrbit(
    radiusX,
    radiusY,
    color,
    coreRadius,
    coreOpacity,
    glowRadius,
    glowOpacity
) {

    const points = [];
    const segments = 160;

    for (let i = 0; i < segments; i++) {

        const angle =
            (i / segments) * Math.PI * 2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) * radiusX,
                Math.sin(angle) * radiusY,
                0
            )
        );
    }

    const curve =
        new THREE.CatmullRomCurve3(
            points,
            true,
            "catmullrom",
            0.08
        );

    const group =
        new THREE.Group();

    /*
     * Soft outer glow. This sits behind the core line
     * and gives the orbit a subtle light-trail feel.
     */
    const glowGeometry =
        new THREE.TubeGeometry(
            curve,
            segments,
            glowRadius,
            6,
            true
        );

    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: glowOpacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    group.add(glow);

    /*
     * Crisp inner line. The higher opacity keeps the
     * trajectory readable without overpowering the planet.
     */
    const coreGeometry =
        new THREE.TubeGeometry(
            curve,
            segments,
            coreRadius,
            6,
            true
        );

    const coreMaterial =
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: coreOpacity,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    group.add(core);

    return group;
}


/* =========================================================
   ORBIT 1
   ========================================================= */

const orbit1 =
    createOrbit(
        2.55,
        2.00,
        0x9d8cff,
        0.015,
        0.82,
        0.042,
        0.13
    );

orbit1.rotation.x =
    THREE.MathUtils.degToRad(68);

orbit1.rotation.z =
    THREE.MathUtils.degToRad(-18);

orbitGroup.add(orbit1);


/* =========================================================
   ORBIT 2
   ========================================================= */

const orbit2 =
    createOrbit(
        3.15,
        2.35,
        0x6ed6ff,
        0.012,
        0.54,
        0.032,
        0.09
    );

orbit2.rotation.x =
    THREE.MathUtils.degToRad(72);

orbit2.rotation.z =
    THREE.MathUtils.degToRad(32);

orbitGroup.add(orbit2);


/* =========================================================
   ORBIT 3
   ========================================================= */

const orbit3 =
    createOrbit(
        3.75,
        2.70,
        0x9d8cff,
        0.010,
        0.62,
        0.028,
        0.10
    );

orbit3.rotation.x =
    THREE.MathUtils.degToRad(58);

orbit3.rotation.z =
    THREE.MathUtils.degToRad(-42);

orbitGroup.add(orbit3);


/* =========================================================
   TECHNOLOGY SYSTEM
   ========================================================= */

const technologyNodes = [];


/* =========================================================
   TECHNOLOGY CUBE GEOMETRY
   ========================================================= */

const technologyCubeGeometry =
    new RoundedBoxGeometry(
        0.62,
        0.62,
        0.62,
        5,
        0.08
    );


/* =========================================================
   TECHNOLOGY CUBE MATERIAL
   ========================================================= */

const technologyCubeMaterial =
    new THREE.MeshPhysicalMaterial({

        color: 0x24184f,

        transparent: true,
        opacity: 0.68,

        roughness: 0.18,
        metalness: 0.06,

        clearcoat: 0.75,
        clearcoatRoughness: 0.16,

        emissive: 0x24145c,
        emissiveIntensity: 0.26,

        side: THREE.DoubleSide
    });

/* =========================================================
   TECHNOLOGY EDGE MATERIAL
   ========================================================= */

const technologyEdgeMaterial =
    new THREE.LineBasicMaterial({
        color: 0xb7aaff,
        transparent: true,
        opacity: 0.86
    });


/* =========================================================
   TECHNOLOGY LOGO MATERIAL
   ========================================================= */

const technologyLogoMaterialSettings = {
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false
};


/* =========================================================
   CREATE TECHNOLOGY LOGO
   ========================================================= */

function createTechnologyLogo(logoUrl) {

    const canvas =
        document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 256;

    const context =
        canvas.getContext("2d");

    const image =
        new Image();

    const texture =
        new THREE.CanvasTexture(canvas);

    texture.colorSpace =
        THREE.SRGBColorSpace;

    image.onload = () => {

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.drawImage(
            image,
            32,
            32,
            192,
            192
        );

        texture.needsUpdate = true;
    };

    image.src = logoUrl;

    const logoGeometry =
        new THREE.PlaneGeometry(
            0.38,
            0.38
        );

    const logoMaterial =
        new THREE.MeshBasicMaterial({
            map: texture,
            ...technologyLogoMaterialSettings
        });

    const logo =
        new THREE.Mesh(
            logoGeometry,
            logoMaterial
        );

    logo.position.z = 0.39;

    return logo;
}


/* =========================================================
   CREATE TECHNOLOGY CUBE
   ========================================================= */

function createTechnologyNode(
    orbit,
    radiusX,
    radiusY,
    angle,
    scale,
    name,
    logoUrl,
     depth = 0
) {

    const node =
        new THREE.Group();

    node.name = name;


    const cubeMaterial =
        technologyCubeMaterial.clone();

    const cube =
        new THREE.Mesh(
            technologyCubeGeometry,
            cubeMaterial
        );

    cube.castShadow = false;
    cube.receiveShadow = false;

    node.add(cube);

    /* =====================================================
   SUBTLE TECHNOLOGY GLOW
   ===================================================== */

const glowMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x9d8cff,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

const glow =
    new THREE.Mesh(
        technologyCubeGeometry,
        glowMaterial
    );

/*
 * Slightly larger than the main cube so the glow
 * becomes visible around the edges.
 */
glow.scale.setScalar(1.10);

glow.position.z = -0.015;

node.add(glow);


    const edgeGeometry =
        new THREE.EdgesGeometry(
            technologyCubeGeometry
        );

    const edges =
        new THREE.LineSegments(
            edgeGeometry,
            technologyEdgeMaterial.clone()
        );

    edges.scale.setScalar(1.01);
    node.add(edges);


    const logo =
        createTechnologyLogo(logoUrl);

    node.add(logo);


    node.position.set(
        Math.cos(angle) * radiusX,
    Math.sin(angle) * radiusY,
    depth
    );

   node.scale.setScalar(scale);

orbit.add(node);

technologyNodes.push({
    node,
    logo,
    name,

    baseScale: scale,

    floatPhase: Math.random() * Math.PI * 2,

    floatSpeed:
        0.65 + Math.random() * 0.25,


    floatAmplitude:
        0.035 + Math.random() * 0.025
});

return node;
}


/* =========================================================
   TECHNOLOGY ASSETS
   ========================================================= */

const technologyAssets = {

    kotlin:
        "./assets/technologies/kotlin.svg",

    android:
        "./assets/technologies/android.svg",

    java:
        "./assets/technologies/java.svg",

    python:
        "./assets/technologies/python.svg",

    javascript:
        "./assets/technologies/javascript.svg",

    compose:
        "./assets/technologies/compose.svg",

    postgresql:
        "./assets/technologies/postgresql.svg",

    spring:
        "./assets/technologies/spring.svg"
};


/* =========================================================
   ORBIT 1 TECHNOLOGIES
   ========================================================= */

createTechnologyNode(
    orbit1,
    2.75,
    2.15,
    THREE.MathUtils.degToRad(25),
    1,
    "Kotlin",
    technologyAssets.kotlin,
    0.55
);

createTechnologyNode(
    orbit1,
    2.75,
    2.15,
    THREE.MathUtils.degToRad(155),
    0.92,
    "Android",
    technologyAssets.android,
    0.25
);
const javaNode = createTechnologyNode(
    orbit1,
    3.25,
    2.55,
    THREE.MathUtils.degToRad(300),
    1.05,
    "Java",
    technologyAssets.java,
    0.25
);

/*
 * Keep Java readable 
 * When its orbital path passes behind the planet.
 * 
 */

javaNode.renderOrder = 20;

javaNode.traverse((object) => {

    if (!object.material) {
        return;
    }

    object.material.depthTest = false;
    object.material.depthWrite = false;
    object.renderOrder = 20;
});

/* =========================================================
   ORBIT 2 TECHNOLOGIES
   ========================================================= */

createTechnologyNode(
    orbit2,
    3.35,
    2.50,
    THREE.MathUtils.degToRad(55),
    1,
    "Python",
    technologyAssets.python,
    0.20
);

createTechnologyNode(
    orbit2,
    3.35,
    2.50,
    THREE.MathUtils.degToRad(175),
    0.95,
    "JavaScript",
    technologyAssets.javascript,
    0.45
);

createTechnologyNode(
    orbit2,
    3.35,
    2.50,
    THREE.MathUtils.degToRad(305),
    1.05,
    "Jetpack Compose",
    technologyAssets.compose,
    0.30
);

/* =========================================================
   ORBIT 3 TECHNOLOGIES
   ========================================================= */

createTechnologyNode(
    orbit3,
    3.95,
    2.85,
    THREE.MathUtils.degToRad(100),
    1,
    "PostgreSQL",
    technologyAssets.postgresql,
    0.15
);

createTechnologyNode(
    orbit3,
    3.95,
    2.85,
    THREE.MathUtils.degToRad(245),
    0.95,
    "Spring",
    technologyAssets.spring,
    0.40
);

/* =========================================================
   PLANET LIGHTING
   ========================================================= */

const ambientLight =
    new THREE.AmbientLight(
        0x302451,
        0.22
    );

scene.add(ambientLight);


const keyLight =
    new THREE.PointLight(
        0xd8d2ff,
        14,
        16
    );

keyLight.position.set(
    4.8,
    4.2,
    5.2
);

scene.add(keyLight);


const purpleLight =
    new THREE.PointLight(
        0x9d8cff,
        15,
        12
    );

purpleLight.position.set(
    -4,
    2,
    1
);

scene.add(purpleLight);


const blueLight =
    new THREE.PointLight(
        0x6ed6ff,
        7,
        11
    );

blueLight.position.set(
    -3.5,
    -2.5,
    -1
);

scene.add(blueLight);


const topLight =
    new THREE.PointLight(
        0x806cff,
        4,
        9
    );

topLight.position.set(
    0,
    5,
    -2
);

scene.add(topLight);

/* =========================================================
   TECHNOLOGY STACK INTERACTION
   ========================================================= */

const technologyHint =
    document.querySelector(".technology-hint");

const technologyStackPanel =
    document.querySelector("#technology-stack-panel");

const technologyStackClose =
    document.querySelector(".technology-stack-close");

if (
    technologyHint &&
    technologyStackPanel &&
    technologyStackClose
) {

    technologyHint.addEventListener(
        "click",
        () => {

            const isOpen =
                technologyStackPanel.classList.contains(
                    "is-visible"
                );

            if (isOpen) {

                technologyStackPanel.classList.remove(
                    "is-visible"
                );

                technologyHint.setAttribute(
                    "aria-expanded",
                    "false"
                );

                technologyStackPanel.setAttribute(
                    "aria-hidden",
                    "true"
                );

                return;
            }

            technologyStackPanel.classList.add(
                "is-visible"
            );

            technologyHint.setAttribute(
                "aria-expanded",
                "true"
            );

            technologyStackPanel.setAttribute(
                "aria-hidden",
                "false"
            );
        }
    );


    technologyStackClose.addEventListener(
        "click",
        () => {

            technologyStackPanel.classList.remove(
                "is-visible"
            );

            technologyHint.setAttribute(
                "aria-expanded",
                "false"
            );

            technologyStackPanel.setAttribute(
                "aria-hidden",
                "true"
            );
        }
    );
}


/* =========================================================
   ANIMATION
   ========================================================= */

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    if (!sceneReady) {
        return;
    }

    const elapsed =
        clock.getElapsedTime();

    /* Stars */

    stars.rotation.y =
        elapsed * 0.008;

    stars.rotation.x =
        elapsed * 0.002;


    /* Planet */

    if (planet) {

        planet.rotation.y =
            elapsed * 0.08;

        planet.rotation.x =
            elapsed * 0.015;
    }


    /* Orbits */

    orbit1.rotation.y =
        elapsed * 0.08;

    orbit2.rotation.y =
        elapsed * -0.05;

    orbit3.rotation.y =
        elapsed * 0.035;


    /* =====================================================
   TECHNOLOGY MICRO-ANIMATION
   ===================================================== */

technologyNodes.forEach((technology) => {

    const {
        node,
        floatPhase,
        floatSpeed,
        floatAmplitude,
        baseScale
    } = technology;


    node.lookAt(
        camera.position
    );


    node.position.z =
        Math.sin(
            elapsed * floatSpeed +
            floatPhase
        ) * floatAmplitude;

    const breathing =
        1 +
        Math.sin(
            elapsed * floatSpeed * 0.8 +
            floatPhase
        ) * 0.018;

    node.scale.setScalar(
        baseScale * breathing
    );
});


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

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        const isMobile =
            window.innerWidth <= 560;

        camera.position.z =
            isMobile
                ? 11.5
                : 8;

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