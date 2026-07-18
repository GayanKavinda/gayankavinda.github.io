import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AtmosphericParticles({ isDark = true }: { isDark?: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);

  // Shooting stars state
  const shootingStars = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      speed: 0.2 + Math.random() * 0.3,
      delay: Math.random() * 10,
      active: false,
      startPos: new THREE.Vector3(),
      currentPos: new THREE.Vector3(),
    }));
  }, []);

  const COUNT = 800;

  const { positions, colors, sizes, initialPositions } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const initialPositions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const radius = 5 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) - 2;
      const z = radius * Math.cos(phi);

      positions[i * 3] = initialPositions[i * 3] = x;
      positions[i * 3 + 1] = initialPositions[i * 3 + 1] = y;
      positions[i * 3 + 2] = initialPositions[i * 3 + 2] = z;

      const colorChoice = Math.random();
      if (isDark) {
        if (colorChoice < 0.4) {
          colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 1.0;
        } else if (colorChoice < 0.8) {
          colors[i * 3] = 0.0; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
        }
      } else {
        if (colorChoice < 0.5) {
          colors[i * 3] = 0.28; colors[i * 3 + 1] = 0.12; colors[i * 3 + 2] = 0.62;
        } else {
          colors[i * 3] = 0.08; colors[i * 3 + 1] = 0.22; colors[i * 3 + 2] = 0.72;
        }
      }

      sizes[i] = 0.2 + Math.random() * 1.0;
    }

    return { positions, colors, sizes, initialPositions };
  }, [isDark]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = particlesRef.current.geometry.attributes.position;

    // Base rotation
    particlesRef.current.rotation.y = time * 0.01;
    particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.01;

    if (isDark) {
      // Shooting stars logic integrated into the particle system
      for (let i = 0; i < shootingStars.length; i++) {
        const star = shootingStars[i];
        const index = (COUNT - 1 - i) * 3; // Use the last few particles as shooting stars

        const cycleTime = (time + star.delay) % 6;
        if (cycleTime < 1.5) { // 1.5s dash
          const progress = cycleTime / 1.5;
          if (progress < 0.05) {
            // Reset position at start of dash
            star.startPos.set(
              (Math.random() - 0.5) * 40,
              10 + Math.random() * 10,
              (Math.random() - 0.5) * 20
            );
          }

          const moveX = star.startPos.x - progress * 30;
          const moveY = star.startPos.y - progress * 20;

          posAttr.array[index] = moveX;
          posAttr.array[index + 1] = moveY;
          posAttr.array[index + 2] = star.startPos.z;
        } else {
          // Hide far away when not active
          posAttr.array[index] = 1000;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={800} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={800} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={800} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.007}
        sizeAttenuation
        vertexColors
        transparent
        opacity={isDark ? 0.8 : 0.4}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}