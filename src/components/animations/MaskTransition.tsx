import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@app/providers/theme-provider";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, v));

/* ============================================================
   SHRINE SCENE – FULL TRANSFORMATION SYSTEM
============================================================ */

function ShrineScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF("/models/shrine.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene: threeScene } = useThree();

  const MODEL_CENTER = new THREE.Vector3(0, 0.5, 0);

  const targetCameraPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    threeScene.fog = new THREE.FogExp2("#000000", 0.04);
  }, [threeScene]);

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
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function MaskTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const textRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;

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

              console.log("Camera Position:", camera.position.toArray());
              console.log("Camera Rotation:", camera.rotation.toArray());
              console.log("Spherical:", {
                radius: spherical.radius,
                phi: spherical.phi,
                theta: spherical.theta,
              });
            }
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ height: "450vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-[hsl(var(--background))]">
        {/* ── Atmospheric Layer ───────────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(124, 92, 252, 0.015), transparent 60%), " +
              "radial-gradient(ellipse at 80% 70%, rgba(0, 212, 255, 0.01), transparent 70%)",
            mixBlendMode: "screen",
            animation: "atmosphereShift 12s ease-in-out infinite alternate",
          }}
        />

        <Canvas
          camera={{
            fov: 22,
            near: 0.1,
            far: 200,
            position: [0, 2, 14],
          }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={isDark ? 0.4 : 0.8} />
          <directionalLight position={[5, 8, 5]} intensity={2.2} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.35}
            penumbra={0.8}
            intensity={1.5}
          />

          <Suspense fallback={null}>
            <ShrineScene scrollProgress={scrollProgress} />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            ref={textRef}
            className="text-center max-w-3xl px-6 transition-opacity duration-300"
          >
            <h1
              style={{
                fontFamily: "Instrument Serif",
                fontSize: "clamp(2rem, 4vw, 4rem)",
                fontStyle: "italic",
              }}
            >
              Engineered. Intentional. Cinematic.
            </h1>
          </div>
        </div>

        {/* ── Top Fade ─────────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-x-0 top-0 h-[15vh] z-10 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)` }}
        />

        {/* ── Bottom Fade ──────────────────────────────────────────────────────── */}
        <div
          className="absolute inset-x-0 bottom-0 h-[15vh] z-10 pointer-events-none"
          style={{ background: `linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)` }}
        />
      </div>
    </div>
  );
}