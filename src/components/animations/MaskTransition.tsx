import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { animate, createTimeline } from "animejs";
import { useTheme } from "@app/providers/theme-provider";
import AtmosphericParticles from "./AtmosphericParticles";

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

const MATERIAL_CONFIG = {
  baseRoughness: 0.45,
  baseMetalness: 0.3,
  envMapIntensity: 2.5,
  aoMapIntensity: 1.2,
  emissiveColor: "#7C5CFC",
  emissiveIntensity: 0.8,
  glassTransmission: 1,
  glassRoughness: 0,
  glassThickness: 0.6,
  glassClearcoat: 1,
};

/* ============================================================
   CHAPTER CONFIG
============================================================ */

type ChapterConfig = {
  id: "ch1" | "ch2" | "ch3";
  numeral: string;
  title: string;
  detail: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  align: "left" | "right" | "center";
};

const CHAPTERS: ChapterConfig[] = [
  {
    id: "ch1",
    numeral: "i",
    title: "Event-driven architecture",
    detail: "Systems that react, not poll.",
    position: { bottom: "26%", left: "50%" },
    align: "center",
  },
  {
    id: "ch2",
    numeral: "ii",
    title: "Observability-first design",
    detail: "If you can't see it, you can't ship it.",
    position: { top: "50%", left: "18%" },
    align: "left",
  },
  {
    id: "ch3",
    numeral: "iii",
    title: "Zero-downtime deployment",
    detail: "The user never notices the change.",
    position: { top: "30%", right: "12%" },
    align: "right",
  },
];

/* ============================================================
   SHARED SCROLL STATE
============================================================ */

type SceneState = {
  modelY: number;
  modelRotY: number;
  modelRotX: number;
  modelScale: number;
  camRadius: number;
  camAzimuth: number;
  camPolar: number;
  lookAtY: number;
  lightHue: number;
  ch1Y: number;
  ch1Opacity: number;
  ch2Y: number;
  ch2Opacity: number;
  ch3Y: number;
  ch3Opacity: number;
};

function createSceneState(): SceneState {
  return {
    modelY: -8,
    modelRotY: -Math.PI * 0.6,
    modelRotX: 0,
    modelScale: 4.2,
    camRadius: 13,
    camAzimuth: 0,
    camPolar: Math.PI * 0.4,
    lookAtY: 0.5,
    lightHue: 0,
    ch1Y: 55,
    ch1Opacity: 0,
    ch2Y: 55,
    ch2Opacity: 0,
    ch3Y: 55,
    ch3Opacity: 0,
  };
}

/**
 * Builds a paused anime.js timeline that is scrubbed with .seek().
 */
function buildScrollTimeline(state: SceneState, isDark: boolean) {
  const tl = createTimeline({ autoplay: false });

  // Model vertical entrance
  tl.add(state, { modelY: [-8, -2], duration: 200, ease: "outQuad" }, 0);
  tl.add(state, { modelY: [-2, 0], duration: 200, ease: "outQuad" }, 200);

  // Initial turn into frame, then a settle at the end
  tl.add(state, { modelRotY: [-Math.PI * 0.6, 0], duration: 300, ease: "outCubic" }, 0);
  tl.add(state, { modelRotX: [0, -0.2], duration: 300, ease: "inOutSine" }, 700);

  // Scale breathing across the whole scroll arc
  tl.add(state, { modelScale: [4.2, 5], duration: 400, ease: "outQuad" }, 0);
  tl.add(state, { modelScale: [5, 5.4], duration: 150, ease: "inQuad" }, 850);

  // Orbit camera
  tl.add(state, { camRadius: [13, 10], duration: 500, ease: "inOutSine" }, 0);
  tl.add(state, { camRadius: [10, 9], duration: 500, ease: "inOutSine" }, 500);
  tl.add(state, { camAzimuth: [0, Math.PI * 1.3], duration: 1000, ease: "linear" }, 0);
  tl.add(state, { camPolar: [Math.PI * 0.4, Math.PI * 0.58], duration: 1000, ease: "linear" }, 0);
  tl.add(state, { lookAtY: [0.5, 0.2], duration: 250, ease: "inOutSine" }, 750);

  // Lighting mood shift, direction depends on theme
  const hueRange = isDark ? [260, 190] : [200, 30];
  tl.add(state, { lightHue: hueRange, duration: 1000, ease: "linear" }, 0);

  // L3 — chapter 1
  tl.add(state, { ch1Y: [55, 0], duration: 180, ease: "outBack" }, 50);
  tl.add(state, { ch1Opacity: [0, 1], duration: 180, ease: "outSine" }, 50);
  tl.add(state, { ch1Y: [0, -70], duration: 140, ease: "inSine" }, 300);
  tl.add(state, { ch1Opacity: [1, 0], duration: 140, ease: "inSine" }, 300);

  // L4 — chapter 2
  tl.add(state, { ch2Y: [55, 0], duration: 140, ease: "outBack" }, 380);
  tl.add(state, { ch2Opacity: [0, 1], duration: 140, ease: "outSine" }, 380);
  tl.add(state, { ch2Y: [0, -70], duration: 120, ease: "inSine" }, 550);
  tl.add(state, { ch2Opacity: [1, 0], duration: 120, ease: "inSine" }, 550);

  // L5 — chapter 3
  tl.add(state, { ch3Y: [55, 0], duration: 140, ease: "outBack" }, 620);
  tl.add(state, { ch3Opacity: [0, 1], duration: 140, ease: "outSine" }, 620);
  tl.add(state, { ch3Y: [0, -70], duration: 120, ease: "inSine" }, 800);
  tl.add(state, { ch3Opacity: [1, 0], duration: 120, ease: "inSine" }, 800);

  return tl;
}

/* ============================================================
   SCROLL DRIVER
============================================================ */

function ScrollDriver({
  containerRef,
  sceneState,
  timelineRef,
  chapterRefs,
  progressDotRef,
  bloomRef,
  isDarkRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  sceneState: SceneState;
  timelineRef: React.MutableRefObject<anime.AnimeTimelineInstance | null>;
  chapterRefs: React.MutableRefObject<
    Partial<Record<"ch1" | "ch2" | "ch3", { el: HTMLDivElement }>>
  >;
  progressDotRef: React.RefObject<HTMLDivElement>;
  bloomRef: React.MutableRefObject<any>;
  isDarkRef: React.MutableRefObject<boolean>;
}) {
  const smoothProgress = useRef(0);
  const prevSmooth = useRef(0);

  useFrame(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height - vh;
    const raw = total > 0 ? clamp(-rect.top / total) : 0;

    // scrub smoothing
    smoothProgress.current += (raw - smoothProgress.current) * 0.09;
    const p = smoothProgress.current;
    const velocity = Math.abs(p - prevSmooth.current);
    prevSmooth.current = p;

    timelineRef.current?.seek(p * 1000);

    if (bloomRef.current) {
      bloomRef.current.intensity =
        (isDarkRef.current ? 0.6 : 0.3) + Math.min(velocity * 20, 0.2);
    }

    // Focus-pull chapters
    (["ch1", "ch2", "ch3"] as const).forEach((id) => {
      const refs = chapterRefs.current[id];
      if (!refs) return;
      const y = sceneState[`${id}Y` as const];
      const focus = clamp(sceneState[`${id}Opacity` as const] * 1.6); // stays visible longer, sharpens late

      refs.el.style.filter = `blur(${(1 - focus) * 9}px)`;
      refs.el.style.transform = `scale(${1 + (1 - focus) * 0.07}) translateY(${y * 0.35}px)`;
      refs.el.style.opacity = String(Math.min(focus + 0.15, 1));
    });

    // Quiet progress dot
    if (progressDotRef.current) {
      const travel = window.innerHeight * 0.6; // matches the 20%..80% thread span
      progressDotRef.current.style.transform = `translateY(${p * travel}px)`;
    }
  });

  return null;
}

/* ============================================================
   SHRINE SCENE
============================================================ */

function ShrineScene({
  sceneState,
  directionalLightRef,
  isDark,
  isLoaded,
}: {
  sceneState: SceneState;
  directionalLightRef: React.RefObject<THREE.DirectionalLight>;
  isDark: boolean;
  isLoaded: boolean;
}) {
  const { scene } = useGLTF("/models/shrine.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene: threeScene } = useThree();

  const MODEL_CENTER = new THREE.Vector3(0, 0.5, 0);
  const targetCameraPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const scaleFactorRef = useRef(1);
  const isMobileRef = useRef(false);
  const emissiveMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const spinRef = useRef(0);

  const idleState = useRef({ scale: 1 }).current;
  const glowState = useRef({ intensity: MATERIAL_CONFIG.emissiveIntensity }).current;
  const entranceState = useRef({ scale: 0 }).current;
  const mouseState = useRef({ x: 0, y: 0 }).current;

  useEffect(() => {
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
      scaleFactorRef.current = isMobileRef.current ? 0.7 : 1;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const idle = animate(idleState, {
      scale: [1, 1.015],
      duration: 3200,
      ease: "inOutSine",
      alternate: true,
      loop: true,
    });
    return () => idle.pause();
  }, [idleState]);

  useEffect(() => {
    const glow = animate(glowState, {
      intensity: [
        MATERIAL_CONFIG.emissiveIntensity * 0.7,
        MATERIAL_CONFIG.emissiveIntensity * 1.4,
      ],
      duration: 2400,
      ease: "inOutQuad",
      alternate: true,
      loop: true,
    });
    return () => glow.pause();
  }, [glowState]);

  useEffect(() => {
    if (!isLoaded) return;
    animate(entranceState, {
      scale: [0, 1],
      duration: 1800,
      ease: "outElastic(1, .6)",
    });
  }, [isLoaded, entranceState]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      animate(mouseState, {
        x: nx,
        y: ny,
        duration: 700,
        ease: "outQuad",
      });
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseState]);

  useEffect(() => {
    threeScene.fog = null;
    const emissiveMats: THREE.MeshStandardMaterial[] = [];

    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = child.material;
        if (!mat) return;

        mat.roughness = MATERIAL_CONFIG.baseRoughness;
        mat.metalness = MATERIAL_CONFIG.baseMetalness;
        mat.envMapIntensity = MATERIAL_CONFIG.envMapIntensity;
        mat.color.convertSRGBToLinear();

        if (mat.aoMap) mat.aoMapIntensity = MATERIAL_CONFIG.aoMapIntensity;

        const matName = mat.name?.toLowerCase() || "";
        if (
          matName.includes("skull") ||
          matName.includes("bull") ||
          matName.includes("horn") ||
          matName.includes("core") ||
          matName.includes("gem") ||
          matName.includes("crystal") ||
          matName.includes("eye") ||
          matName.includes("accent")
        ) {
          mat.emissive = new THREE.Color(MATERIAL_CONFIG.emissiveColor);
          mat.emissiveIntensity = MATERIAL_CONFIG.emissiveIntensity;
          emissiveMats.push(mat);
        }

        if (
          matName.includes("glass") ||
          matName.includes("crystal") ||
          matName.includes("gem")
        ) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: mat.color.clone(),
            transmission: MATERIAL_CONFIG.glassTransmission,
            roughness: MATERIAL_CONFIG.glassRoughness,
            thickness: MATERIAL_CONFIG.glassThickness,
            clearcoat: MATERIAL_CONFIG.glassClearcoat,
            clearcoatRoughness: 0,
            metalness: mat.metalness,
            envMapIntensity: mat.envMapIntensity,
          });
        } else {
          mat.needsUpdate = true;
        }
      }
    });

    emissiveMaterialsRef.current = emissiveMats;
  }, [scene, threeScene, isDark]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const p = clamp(sceneState.camAzimuth / (Math.PI * 1.3));

    const scaleFactor = scaleFactorRef.current;

    let rotationY: number;
    if (p < 0.3) {
      rotationY = sceneState.modelRotY;
      spinRef.current = rotationY;
    } else if (p < 0.8) {
      spinRef.current += delta * 0.35;
      rotationY = spinRef.current;
    } else {
      rotationY = THREE.MathUtils.lerp(
        spinRef.current,
        Math.PI * 0.3,
        (p - 0.8) / 0.2
      );
    }

    const targetScale =
      sceneState.modelScale * scaleFactor * idleState.scale * entranceState.scale;

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12)
    );
    groupRef.current.position.y = sceneState.modelY;
    groupRef.current.rotation.y = rotationY + mouseState.x * 0.08;
    groupRef.current.rotation.x = sceneState.modelRotX + mouseState.y * 0.05;

    const radiusFactor = isMobileRef.current ? 1.15 : 1;
    const radius = sceneState.camRadius * radiusFactor;

    targetCameraPos.current.set(
      MODEL_CENTER.x +
        radius * Math.sin(sceneState.camPolar) * Math.sin(sceneState.camAzimuth),
      MODEL_CENTER.y + radius * Math.cos(sceneState.camPolar),
      MODEL_CENTER.z +
        radius * Math.sin(sceneState.camPolar) * Math.cos(sceneState.camAzimuth)
    );

    targetCameraPos.current.x += mouseState.x * 0.35;
    targetCameraPos.current.y += mouseState.y * 0.2;

    targetLookAt.current.set(0, sceneState.lookAtY, 0);

    camera.position.lerp(targetCameraPos.current, 0.08);
    camera.lookAt(targetLookAt.current);

    if (directionalLightRef.current) {
      directionalLightRef.current.color.lerp(
        new THREE.Color(`hsl(${sceneState.lightHue}, 90%, 65%)`),
        0.05
      );
    }

    for (const mat of emissiveMaterialsRef.current) {
      mat.emissiveIntensity = glowState.intensity;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

function GroundShadow() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[50, 50]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function MaskTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const chapterRefs = useRef<
    Partial<Record<"ch1" | "ch2" | "ch3", { el: HTMLDivElement }>>
  >({});
  const progressDotRef = useRef<HTMLDivElement>(null);

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const bloomRef = useRef<any>(null);

  const sceneState = useRef(createSceneState()).current;
  const timelineRef = useRef<any>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Object.assign(sceneState, createSceneState());
    timelineRef.current = buildScrollTimeline(sceneState, isDark);
  }, [isDark, sceneState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => setIsLoaded(true), 100);
          } else {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: "10%", threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const fg = isDark ? "#FFFFFF" : "#0A0A0A";
  const fgSub = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.42)";

  return (
    <div ref={containerRef} style={{ height: "450vh" }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden relative"
        style={{ background: isDark ? "#000000" : "#FFFFFF" }}
      >
        {/* TEXT LAYERS */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {CHAPTERS.map((c) => (
            <div
              key={c.id}
              ref={(el) => {
                if (el) chapterRefs.current[c.id] = { el };
              }}
              style={{
                position: "absolute",
                ...c.position,
                textAlign: c.align,
                willChange: "transform, filter, opacity",
                maxWidth: "460px",
                // center the first chapter properly
                ...(c.align === "center" ? { transform: "translateX(-50%)" } : {}),
              }}
            >
              <span
                style={{
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: "0.85rem",
                  color: fgSub,
                  marginRight: "0.5rem",
                  verticalAlign: "top",
                }}
              >
                {c.numeral}.
              </span>
              <h2
                style={{
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: "clamp(1.6rem, 3.4vw, 3.8rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: fg,
                  margin: "0.15rem 0 0.4rem",
                  display: "inline",
                }}
              >
                {c.title}
              </h2>
              <p
                style={{
                  fontFamily: "DM Mono",
                  fontSize: "0.72rem",
                  color: fgSub,
                  letterSpacing: "0.01em",
                  marginTop: "0.3rem",
                }}
              >
                {c.detail}
              </p>
            </div>
          ))}

          {/* Quiet progress marker */}
          <div
            style={{
              position: "absolute",
              left: "4%",
              top: "20%",
              bottom: "20%",
              width: "1px",
              background: fgSub,
              opacity: 0.15,
            }}
          />
          <div
            ref={progressDotRef}
            style={{
              position: "absolute",
              left: "calc(4% - 3px)",
              top: "20%",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--primary)",
              willChange: "transform",
            }}
          />
        </div>

        {/* CANVAS */}
        <div className="absolute inset-0 z-10">
          <Canvas
            shadows
            camera={{ fov: 28, near: 0.1, far: 200, position: [0, 2, 14] }}
            gl={{
              antialias: false,
              powerPreference: "high-performance",
              alpha: true,
              stencil: false,
              depth: true,
            }}
            dpr={Math.min(
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
              1.5
            )}
            frameloop={isVisible ? "always" : "demand"}
            performance={{ min: 0.5 }}
          >
            <ambientLight intensity={isDark ? 0.8 : 1.2} />
            <directionalLight
              ref={directionalLightRef}
              castShadow
              shadow-mapSize-width={128}
              shadow-mapSize-height={128}
              shadow-bias={-0.0001}
              shadow-camera-near={0.1}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              position={[5, 8, 5]}
              intensity={isDark ? 3.5 : 1.5}
            />
            <spotLight
              position={[0, 5, 5]}
              angle={0.35}
              penumbra={0.8}
              intensity={isDark ? 2.5 : 1.0}
            />

            <ScrollDriver
              containerRef={containerRef}
              sceneState={sceneState}
              timelineRef={timelineRef}
              chapterRefs={chapterRefs}
              progressDotRef={progressDotRef}
              bloomRef={bloomRef}
              isDarkRef={isDarkRef}
            />

            {isLoaded && (
              <Suspense fallback={null}>
                <ShrineScene
                  sceneState={sceneState}
                  directionalLightRef={directionalLightRef}
                  isDark={isDark}
                  isLoaded={isLoaded}
                />
              </Suspense>
            )}

            {isLoaded && <GroundShadow />}
            {isLoaded && <AtmosphericParticles isDark={isDark} />}

            {isLoaded && (
              <EffectComposer>
                <Bloom
                  ref={bloomRef}
                  intensity={isDark ? 0.4 : 0.2}
                  luminanceThreshold={isDark ? 0.8 : 0.9}
                  luminanceSmoothing={0.9}
                  mipmapBlur
                />
                <Vignette
                  eskil={false}
                  offset={0.1}
                  darkness={isDark ? 0.6 : 0.3}
                />
              </EffectComposer>
            )}
          </Canvas>
        </div>

        <div className="section-fade-top" style={{ zIndex: 50 }} />
        <div className="section-fade-bottom" style={{ zIndex: 50 }} />
      </div>
    </div>
  );
}