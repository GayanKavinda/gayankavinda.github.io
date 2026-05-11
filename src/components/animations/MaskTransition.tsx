import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@app/providers/theme-provider";
import AtmosphericParticles from "./AtmosphericParticles";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v));

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
   SHRINE SCENE
============================================================ */

function ShrineScene({
  scrollProgress,
  directionalLightRef,
  isDark,
}: {
  scrollProgress: React.MutableRefObject<number>;
  directionalLightRef: React.RefObject<THREE.DirectionalLight>;
  isDark: boolean;
}) {
  const { scene } = useGLTF("/models/shrine.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene: threeScene } = useThree();

  const MODEL_CENTER = new THREE.Vector3(0, 0.5, 0);
  const targetCameraPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const previousProgress = useRef(0);

  useEffect(() => {
    threeScene.fog = null;

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
          matName.includes("skull") || matName.includes("bull") ||
          matName.includes("horn") || matName.includes("core") ||
          matName.includes("gem")  || matName.includes("crystal") ||
          matName.includes("eye")  || matName.includes("accent")
        ) {
          mat.emissive = new THREE.Color(MATERIAL_CONFIG.emissiveColor);
          mat.emissiveIntensity = MATERIAL_CONFIG.emissiveIntensity;
        }

        if (matName.includes("glass") || matName.includes("crystal") || matName.includes("gem")) {
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
  }, [scene, threeScene, isDark]);

  useFrame(() => {
    if (!groupRef.current) return;

    const p = scrollProgress.current;

    const positionY =
      p < 0.2 ? THREE.MathUtils.lerp(-8, -2, p / 0.2)
      : p < 0.4 ? THREE.MathUtils.lerp(-2, 0, (p - 0.2) / 0.2)
      : 0;

    const rotationY =
      p < 0.3 ? THREE.MathUtils.lerp(-Math.PI * 0.6, 0, p / 0.3)
      : p < 0.8 ? groupRef.current.rotation.y + 0.002
      : THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI * 0.3, (p - 0.8) / 0.2);

    const rotationX = p > 0.7 ? THREE.MathUtils.lerp(0, -0.2, (p - 0.7) / 0.3) : 0;

    const scale =
      p < 0.4  ? THREE.MathUtils.lerp(4.2, 5, p / 0.4)
      : p < 0.85 ? 5
      : THREE.MathUtils.lerp(5, 5.4, (p - 0.85) / 0.15);

    groupRef.current.position.y = positionY;
    groupRef.current.rotation.y = rotationY;
    groupRef.current.rotation.x = rotationX;
    groupRef.current.scale.set(scale, scale, scale);

    const radius =
      p < 0.5 ? THREE.MathUtils.lerp(13, 10, p / 0.5)
      : THREE.MathUtils.lerp(10, 9, (p - 0.5) / 0.5);

    const azimuth = THREE.MathUtils.lerp(0, Math.PI * 1.3, p);
    const polar   = THREE.MathUtils.lerp(Math.PI * 0.4, Math.PI * 0.58, p);

    targetCameraPos.current.set(
      MODEL_CENTER.x + radius * Math.sin(polar) * Math.sin(azimuth),
      MODEL_CENTER.y + radius * Math.cos(polar),
      MODEL_CENTER.z + radius * Math.sin(polar) * Math.cos(azimuth)
    );

    targetLookAt.current.set(
      0,
      THREE.MathUtils.lerp(0.5, 0.2, clamp((p - 0.75) / 0.25)),
      0
    );

    camera.position.lerp(targetCameraPos.current, 0.08);
    camera.lookAt(targetLookAt.current);

    const velocity = Math.abs(p - previousProgress.current);
    const shakeStrength = Math.min(velocity * 0.5, 0.02);
    if (shakeStrength > 0.001) {
      camera.position.x += (Math.random() - 0.5) * shakeStrength;
      camera.position.y += (Math.random() - 0.5) * shakeStrength;
    }
    previousProgress.current = p;

    if (directionalLightRef.current) {
      const hue = isDark
        ? THREE.MathUtils.lerp(260, 190, p)
        : THREE.MathUtils.lerp(200, 30, p);
      directionalLightRef.current.color.lerp(
        new THREE.Color(`hsl(${hue}, 90%, 65%)`), 0.05
      );
    }
  });

  return <group ref={groupRef}><primitive object={scene} /></group>;
}

function GroundShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function MaskTransition() {
  const containerRef     = useRef<HTMLDivElement>(null);
  const scrollProgress   = useRef(0);

  // Layer refs
  const ghostWordRef     = useRef<HTMLDivElement>(null); // L1: BREATHE
  const kanjiRef         = useRef<HTMLDivElement>(null); // L2: 技
  const ch1Ref           = useRef<HTMLDivElement>(null); // L3: chapter 1 h1
  const ch2Ref           = useRef<HTMLDivElement>(null); // L4: chapter 2
  const ch3Ref           = useRef<HTMLDivElement>(null); // L5: chapter 3

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const bloomRef         = useRef<any>(null);
  const previousProgress = useRef(0);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isDarkRef = useRef(isDark);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded,  setIsLoaded]  = useState(false);

  /* ── ScrollTrigger ─────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgress.current = p;

          const velocity = Math.abs(self.getVelocity());
          if (bloomRef.current) {
            bloomRef.current.intensity =
              (isDarkRef.current ? 0.6 : 0.3) + Math.min(velocity * 0.0001, 0.2);
          }

          /* ── L1: BREATHE
             18vw ghost. Slowest parallax. Persists longest. ── */
          if (ghostWordRef.current) {
            const fadeIn  = clamp(p / 0.12);
            const fadeOut = clamp((p - 0.72) / 0.2);
            gsap.set(ghostWordRef.current, {
              y: p * -160,
              opacity: fadeIn * (1 - fadeOut) * 0.07,
            });
          }

          /* ── L2: 技 kanji
             12vw. Faster parallax. Bottom-right. Exits at 0.55. ── */
          if (kanjiRef.current) {
            const fadeIn  = clamp(p / 0.18);
            const fadeOut = clamp((p - 0.48) / 0.18);
            gsap.set(kanjiRef.current, {
              y: p * -240,
              opacity: fadeIn * (1 - fadeOut) * 0.055,
            });
          }

          /* ── L3: Chapter 1 — "Cursed by craft. Bound by code."
             Window: 0.05 → 0.42. Center bottom-third. ── */
          if (ch1Ref.current) {
            const reveal = clamp((p - 0.05) / 0.18);
            const exit   = clamp((p - 0.30) / 0.14);
            gsap.set(ch1Ref.current, {
              y: (1 - reveal) * 55 - exit * 70,
              opacity: reveal * (1 - exit),
            });
          }

          /* ── L4: Chapter 2 — "Every line of code, a vow."
             Window: 0.38 → 0.65. Slightly left of center. ── */
          if (ch2Ref.current) {
            const reveal = clamp((p - 0.38) / 0.14);
            const exit   = clamp((p - 0.55) / 0.12);
            gsap.set(ch2Ref.current, {
              y: (1 - reveal) * 55 - exit * 70,
              opacity: reveal * (1 - exit),
            });
          }

          /* ── L5: Chapter 3 — "Every interface, a domain."
             Window: 0.62 → 0.90. Slightly right, lower. ── */
          if (ch3Ref.current) {
            const reveal = clamp((p - 0.62) / 0.14);
            const exit   = clamp((p - 0.80) / 0.12);
            gsap.set(ch3Ref.current, {
              y: (1 - reveal) * 55 - exit * 70,
              opacity: reveal * (1 - exit),
            });
          }

          previousProgress.current = p;
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []); // stable

  /* ── Intersection observer ─────────────────────────────── */
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

  const fg     = isDark ? "#FFFFFF" : "#0A0A0A";
  const fgSub  = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.42)";

  /* Shared h1 style — smaller, readable */
  const h1Style: React.CSSProperties = {
    fontFamily: "Instrument Serif",
    fontStyle: "italic",
    fontSize: "clamp(1.8rem, 3.2vw, 3.6rem)",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: fg,
    margin: 0,
  };

  /* Chapter label style — DM Mono, tiny */
  const labelStyle: React.CSSProperties = {
    fontFamily: "DM Mono",
    fontSize: "clamp(0.55rem, 0.75vw, 0.7rem)",
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    color: fgSub,
    marginBottom: "0.75rem",
    display: "block",
  };

  return (
    <div ref={containerRef} style={{ height: "450vh" }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden relative"
        style={{ background: isDark ? "#000000" : "#FFFFFF" }}
      >

        {/* ═══════════════════════════════════════════════
            TEXT LAYERS — z-0, behind canvas
        ═══════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

          {/* L1 — BREATHE: 18vw, centered, ultra-ghost */}
          <div
            ref={ghostWordRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: "clamp(7rem, 18vw, 20rem)",
              fontWeight: 400,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: fg,
              opacity: 0,
              whiteSpace: "nowrap",
              willChange: "transform, opacity",
              userSelect: "none",
            }}
          >
            BREATHE
          </div>

          {/* L2 — 技: 12vw, bottom-right, ghost */}
          <div
            ref={kanjiRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "10%",
              right: "6%",
              fontFamily: "serif",
              fontSize: "clamp(5rem, 12vw, 14rem)",
              fontWeight: 900,
              color: fg,
              opacity: 0,
              willChange: "transform, opacity",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            技
          </div>

          {/* L3 — Chapter 1: center, bottom-third */}
          <div
            ref={ch1Ref}
            style={{
              position: "absolute",
              bottom: "26%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              opacity: 0,
              willChange: "transform, opacity",
              whiteSpace: "nowrap",
            }}
          >
            <span style={labelStyle}>— i —</span>
            <h2 style={h1Style}>
              Cursed by craft.
              <br />
              Bound by code.
            </h2>
          </div>

          {/* L4 — Chapter 2: left-of-center, mid */}
          <div
            ref={ch2Ref}
            style={{
              position: "absolute",
              top: "50%",
              left: "18%",
              transform: "translateY(-50%)",
              textAlign: "left",
              opacity: 0,
              willChange: "transform, opacity",
              whiteSpace: "nowrap",
            }}
          >
            <span style={labelStyle}>— ii —</span>
            <h2 style={h1Style}>
              Every line of code,
              <br />
              a vow.
            </h2>
          </div>

          {/* L5 — Chapter 3: right-of-center, upper */}
          <div
            ref={ch3Ref}
            style={{
              position: "absolute",
              top: "30%",
              right: "12%",
              textAlign: "right",
              opacity: 0,
              willChange: "transform, opacity",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ ...labelStyle, textAlign: "right" }}>— iii —</span>
            <h2 style={h1Style}>
              Every interface,
              <br />
              a domain.
            </h2>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════
            CANVAS — z-10, alpha:true
        ═══════════════════════════════════════════════ */}
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

            {isLoaded && (
              <Suspense fallback={null}>
                <ShrineScene
                  scrollProgress={scrollProgress}
                  directionalLightRef={directionalLightRef}
                  isDark={isDark}
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

        <div className="section-fade-top"    style={{ zIndex: 50 }} />
        <div className="section-fade-bottom" style={{ zIndex: 50 }} />
      </div>
    </div>
  );
}