import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function EggWithQR({ qrDataUrl }: { qrDataUrl?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create egg geometry from a lathe
  const eggGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = i / 32;
      const angle = t * Math.PI;
      // Egg profile: wider at bottom, narrower at top
      const r = Math.sin(angle) * (1 - 0.3 * Math.cos(angle));
      const y = -Math.cos(angle) * 1.3;
      points.push(new THREE.Vector2(r * 0.7, y));
    }
    return new THREE.LatheGeometry(points, 48);
  }, []);

  // Create QR texture
  const qrTexture = useMemo(() => {
    if (!qrDataUrl) return null;
    const tex = new THREE.TextureLoader().load(qrDataUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [qrDataUrl]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Main egg */}
        <mesh ref={meshRef} geometry={eggGeometry} castShadow>
          <meshPhysicalMaterial
            color="#f5efe0"
            roughness={0.25}
            metalness={0.05}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* QR code decal - positioned on the egg surface */}
        {qrTexture && (
          <mesh position={[0, 0, 0.72]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.55, 0.55]} />
            <meshBasicMaterial
              map={qrTexture}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Subtle gold rim light */}
        <pointLight position={[2, 1, 0]} intensity={0.5} color="#c9a84c" distance={5} />
      </group>
    </Float>
  );
}

export function TraceEgg3D({ qrDataUrl }: { qrDataUrl?: string }) {
  return (
    <div className="w-full h-[220px] md:h-[280px]">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} color="#fffbe6" />
        <directionalLight position={[-2, -1, 3]} intensity={0.3} color="#c9a84c" />
        <EggWithQR qrDataUrl={qrDataUrl} />
        <Environment preset="studio" environmentIntensity={0.3} />
      </Canvas>
    </div>
  );
}
