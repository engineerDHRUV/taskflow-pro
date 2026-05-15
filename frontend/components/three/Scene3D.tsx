"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import StarField from "./StarField";
import FloatingOrbs from "./FloatingOrbs";

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} color="#7c3aed" intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#06b6d4" intensity={0.5} />
          <StarField />
          <FloatingOrbs />
        </Suspense>
      </Canvas>
    </div>
  );
}
