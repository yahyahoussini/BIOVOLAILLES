import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function EggMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  // Egg shape: scaled sphere (taller on Y)
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={[1, 1.35, 1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#c9a84c"
          roughness={0.2}
          metalness={0.6}
          distort={0.05}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.8, 0.02, 16, 64]} />
      <meshBasicMaterial color="#c9a84c" transparent opacity={0.3} />
    </mesh>
  );
}

export function RotatingEgg3D() {
  return (
    <div className="w-full h-[220px] relative">
      {/* Ambient glow behind */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 rounded-full blur-[60px] opacity-20" style={{ background: "hsl(43 52% 54%)" }} />
      </div>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#c9a84c" />
        <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#0a6e3a" />
        <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffffff" />
        <EggMesh />
        <GlowRing />
      </Canvas>
    </div>
  );
}
