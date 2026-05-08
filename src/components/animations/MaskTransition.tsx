import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@app/providers/theme-provider";
import AtmosphericParticles from "./AtmosphericParticles";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v));

/* ============================================================
   MATERIAL ENHANCEMENT CONSTANTS
============================================================ */

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
   SHRINE SCENE – FULL TRANSFORMATION SYSTEM
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

  /* ============================================================
     MATERIAL RE-AUTHORING & ENHANCEMENT
  ============================================================ */

  useEffect(() => {
    // Removed fog to eliminate "smoke" effect
    threeScene.fog = null;

    // Traverse and enhance all materials
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const mat = child.material;

        if (mat) {
          // Base material enhancement
          mat.roughness = MATERIAL_CONFIG.baseRoughness;
          mat.metalness = MATERIAL_CONFIG.baseMetalness;
          mat.envMapIntensity = MATERIAL_CONFIG.envMapIntensity;

          // Enhance contrast
          mat.color.convertSRGBToLinear();

          // Material depth enhancement
          if (mat.aoMap) {
            mat.aoMapIntensity = MATERIAL_CONFIG.aoMapIntensity;
          }

          // Subtle emissive boost for mystical effect
          // Check for specific material names that should glow
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
          }

          // Optional: Glass mystic accent for specific materials
          if (
            matName.includes("glass") ||
            matName.includes("crystal") ||
            matName.includes("gem")
          ) {
            const glassMat = new THREE.MeshPhysicalMaterial({
              color: mat.color.clone(),
              transmission: MATERIAL_CONFIG.glassTransmission,
              roughness: MATERIAL_CONFIG.glassRoughness,
              thickness: MATERIAL_CONFIG.glassThickness,
              clearcoat: MATERIAL_CONFIG.glassClearcoat,
              clearcoatRoughness: 0,
              metalness: mat.metalness,
              envMapIntensity: mat.envMapIntensity,
            });
            child.material = glassMat;
          }

          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, threeScene, isDark]);

  useFrame(() => {
    if (!groupRef.current) return;

    const p = scrollProgress.current;

    /* ============================================================
       MODEL TRANSFORM STATES
    ============================================================ */

    const positionY =
      p < 0.2
        ? THREE.MathUtils.lerp(-8, -2, p / 0.2)
        : p < 0.4
        ? THREE.MathUtils.lerp(-2, 0, (p - 0.2) / 0.2)
        : 0;

    const rotationY =
      p < 0.3
        ? THREE.MathUtils.lerp(-Math.PI * 0.6, 0, p / 0.3)
        : p < 0.8
        ? groupRef.current.rotation.y + 0.002
        : THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            Math.PI * 0.3,
            (p - 0.8) / 0.2
          );

    const rotationX =
      p > 0.7
        ? THREE.MathUtils.lerp(0, -0.2, (p - 0.7) / 0.3)
        : 0;

    const scale =
      p < 0.4
        ? THREE.MathUtils.lerp(4.2, 5, p / 0.4)
        : p < 0.85
        ? 5
        : THREE.MathUtils.lerp(5, 5.4, (p - 0.85) / 0.15);

    groupRef.current.position.y = positionY;
    groupRef.current.rotation.y = rotationY;
    groupRef.current.rotation.x = rotationX;
    groupRef.current.scale.set(scale, scale, scale);

    /* ============================================================
       CAMERA ORBIT SYSTEM
    ============================================================ */

    const radius =
      p < 0.5
        ? THREE.MathUtils.lerp(13, 10, p / 0.5)
        : THREE.MathUtils.lerp(10, 9, (p - 0.5) / 0.5);

    const azimuth = THREE.MathUtils.lerp(
      0,
      Math.PI * 1.3,
      p
    );

    const polar = THREE.MathUtils.lerp(
      Math.PI * 0.4,
      Math.PI * 0.58,
      p
    );

    const camX =
      MODEL_CENTER.x +
      radius * Math.sin(polar) * Math.sin(azimuth);

    const camY =
      MODEL_CENTER.y +
      radius * Math.cos(polar);

    const camZ =
      MODEL_CENTER.z +
      radius * Math.sin(polar) * Math.cos(azimuth);

    targetCameraPos.current.set(camX, camY, camZ);

    /* Lower framing near end */

    const loweredY = THREE.MathUtils.lerp(
      0.5,
      0.2,
      clamp((p - 0.75) / 0.25)
    );

    targetLookAt.current.set(0, loweredY, 0);

    /* Smooth camera interpolation */

    camera.position.lerp(targetCameraPos.current, 0.08);
    camera.lookAt(targetLookAt.current);

    /* ============================================================
       CAMERA MICRO-SHAKE (Velocity Based)
    ============================================================ */

    const velocity = Math.abs(p - previousProgress.current);
    const shakeStrength = Math.min(velocity * 0.5, 0.02);

    if (shakeStrength > 0.001) {
      camera.position.x += (Math.random() - 0.5) * shakeStrength;
      camera.position.y += (Math.random() - 0.5) * shakeStrength;
    }

    previousProgress.current = p;

    /* ============================================================
       SCROLL-DRIVEN LIGHT COLOR SHIFT
    ============================================================ */

    if (directionalLightRef.current) {
      const hue = isDark
        ? THREE.MathUtils.lerp(260, 190, p)
        : THREE.MathUtils.lerp(200, 30, p);
      const color = new THREE.Color(`hsl(${hue}, 90%, 65%)`);
      directionalLightRef.current.color.lerp(color, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ============================================================
   GROUND CONTACT SHADOW
============================================================ */

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
  const scrollProgress = useRef(0);
  const textRef = useRef<HTMLDivElement>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const bloomRef = useRef<any>(null);
  const dofRef = useRef<any>(null);
  const previousProgress = useRef(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;

          /* ── Velocity Driven Bloom Spike ───────────────────────────────────── */
          const velocity = Math.abs(self.getVelocity());
          if (bloomRef.current) {
            bloomRef.current.intensity = (isDark ? 0.6 : 0.3) + Math.min(velocity * 0.0001, 0.2);
          }

          /* ── Advanced DOF Reactive Focus ───────────────────────────────────── */
          if (dofRef.current) {
            dofRef.current.focusDistance = THREE.MathUtils.lerp(0.01, 0.02, self.progress);
          }

          if (textRef.current) {
            const opacity =
              1 - clamp((self.progress - 0.25) / 0.4);
            textRef.current.style.opacity =
              opacity.toString();
          }

          if (self.progress > 0.99) {
            const canvas = document.querySelector("canvas") as any;
            const camera =
              canvas?.__r3f?.store.getState().camera;

            if (camera) {
              const spherical =
                new THREE.Spherical().setFromVector3(
                  camera.position.clone()
                );
            }
          }

          previousProgress.current = self.progress;
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isDark]);

  // Intersection Observer for viewport-based rendering
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Delay model loading slightly for smoother initial render
            setTimeout(() => setIsLoaded(true), 100);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin: "10%",
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ height: "450vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: isDark ? "#000000" : "#FFFFFF" }}>
        {/* ── Background ───────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background: isDark ? "#000000" : "#FFFFFF",
          }}
        />

        
        <Canvas
          shadows
          camera={{
            fov: 28,
            near: 0.1,
            far: 200,
            position: [0, 2, 14],
          }}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            alpha: false,
              stencil: false,
              depth: true
          }}
          dpr={Math.min(window.devicePixelRatio, 1)}
          frameloop={isVisible ? "always" : "demand"}
          performance={{ min: 0.5 }}
        >
          <color attach="background" args={[isDark ? "#000000" : "#FFFFFF"]} />
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

          {/* Ground contact shadow for realism */}
          {isLoaded && <GroundShadow />}

          {/* Particles outside Suspense for consistent rendering */}
          {isLoaded && <AtmosphericParticles isDark={isDark} />}

          {/* ── Post-Processing Effects ─────────────────────────────────────────── */}
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

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            ref={textRef}
            className="text-center max-w-3xl px-6 transition-opacity duration-300"
          >
            <h1
              style={{
                fontFamily: "Instrument Serif",
                fontSize: "clamp(2rem, 4vw, 4rem)",
                fontStyle: "italic",
                color: isDark ? "#FFFFFF" : "#1A1A1A",
              }}
            >
              Engineered. Intentional. Cinematic.
            </h1>
          </div>
        </div>

        <div className="section-fade-top" style={{ zIndex: 50 }} />
        <div className="section-fade-bottom" style={{ zIndex: 50 }} />
      </div>
    </div>
  );
}
