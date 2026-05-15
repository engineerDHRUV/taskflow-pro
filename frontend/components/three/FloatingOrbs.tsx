"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Orb({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.5;
    meshRef.current.rotation.x = t * 0.5;
    meshRef.current.rotation.z = t * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.4, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default function FloatingOrbs() {
  return (
    <>
      <Orb position={[-4, 2, -2]} color="#7c3aed" speed={0.8} />
      <Orb position={[4, -1, -3]} color="#06b6d4" speed={0.6} />
      <Orb position={[0, 3, -4]} color="#8b5cf6" speed={1.0} />
      <Orb position={[-3, -2, -1]} color="#22d3ee" speed={0.7} />
      <Orb position={[3, 2, -2]} color="#7c3aed" speed={0.9} />
    </>
  );
}
