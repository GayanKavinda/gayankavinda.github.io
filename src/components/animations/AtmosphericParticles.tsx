import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AtmosphericParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  const { positions, colors, sizes } = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in a sphere around the shrine
      const radius = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 2;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle violet/cyan color variation
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        // Violet - softer
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.2;
        colors[i * 3 + 2] = 0.6;
      } else {
        // Cyan - softer
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 0.7;
      }

      // Random sizes for depth variation
      sizes[i] = 0.5 + Math.random() * 0.5;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const delta = time - timeRef.current;
    timeRef.current = time;

    // Gentle floating animation - only rotate, don't update positions
    particlesRef.current.rotation.y = time * 0.01;
    particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.01;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={200}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
