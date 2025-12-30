/**
 * NFCAnimation3D - Animation 3D native du geste NFC
 * 
 * Illustre un téléphone approchant une carte NFC.
 * Animation fluide, boucle automatique, aucun contrôle utilisateur.
 * 
 * Usage : Page d'accueil uniquement.
 * INTERDIT sur /card/*, checkout, dashboard.
 */

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

// Carte NFC - Style minimaliste blanc matière
function NFCCard() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={[0, -0.3, 0]} rotation={[0.1, 0.15, 0]}>
      {/* Carte principale */}
      <RoundedBox
        ref={meshRef}
        args={[3.4, 2.1, 0.08]}
        radius={0.15}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#F7F7F5" 
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Puce NFC */}
      <RoundedBox
        position={[-0.9, 0.3, 0.05]}
        args={[0.5, 0.4, 0.02]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#E2E2E0" 
          roughness={0.2}
          metalness={0.4}
        />
      </RoundedBox>

      {/* Logo i-wasp (représenté par un cercle subtil) */}
      <mesh position={[1.2, 0.7, 0.05]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial 
          color="#8E8E93" 
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

// Téléphone animé
function Phone() {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef1 = useRef<THREE.Mesh>(null);
  const waveRef2 = useRef<THREE.Mesh>(null);
  const waveRef3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Animation du téléphone - mouvement doux vers la carte
    if (groupRef.current) {
      const yOffset = Math.sin(t * 0.8) * 0.15;
      const zOffset = Math.sin(t * 0.8 + Math.PI / 4) * 0.1;
      groupRef.current.position.y = 1.2 + yOffset;
      groupRef.current.position.z = 0.8 + zOffset;
      groupRef.current.rotation.x = -0.5 + Math.sin(t * 0.6) * 0.05;
    }

    // Animation des ondes NFC
    const wavePulse = (ref: React.RefObject<THREE.Mesh>, delay: number) => {
      if (ref.current) {
        const scale = 0.5 + (Math.sin(t * 2 - delay) + 1) * 0.3;
        const opacity = 0.6 - (Math.sin(t * 2 - delay) + 1) * 0.25;
        ref.current.scale.setScalar(scale);
        (ref.current.material as THREE.MeshStandardMaterial).opacity = Math.max(0.1, opacity);
      }
    };

    wavePulse(waveRef1, 0);
    wavePulse(waveRef2, 0.8);
    wavePulse(waveRef3, 1.6);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0.5, 1.2, 0.8]} rotation={[-0.5, -0.3, 0.1]}>
        {/* Corps du téléphone */}
        <RoundedBox args={[1.2, 2.4, 0.15]} radius={0.15} smoothness={4}>
          <meshStandardMaterial 
            color="#1C1C1E" 
            roughness={0.1}
            metalness={0.8}
          />
        </RoundedBox>

        {/* Écran */}
        <RoundedBox 
          position={[0, 0, 0.08]} 
          args={[1.05, 2.2, 0.02]} 
          radius={0.1} 
          smoothness={4}
        >
          <meshStandardMaterial 
            color="#2C2C2E" 
            roughness={0.1}
            metalness={0.3}
            emissive="#1a1a2e"
            emissiveIntensity={0.2}
          />
        </RoundedBox>

        {/* Caméra (punch hole) */}
        <mesh position={[0, 0.9, 0.09]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>

        {/* Ondes NFC */}
        <group position={[0, -0.8, 0.1]} rotation={[0.3, 0, 0]}>
          <mesh ref={waveRef1}>
            <ringGeometry args={[0.2, 0.25, 32]} />
            <meshStandardMaterial 
              color="#8E8E93" 
              transparent 
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh ref={waveRef2}>
            <ringGeometry args={[0.35, 0.4, 32]} />
            <meshStandardMaterial 
              color="#8E8E93" 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh ref={waveRef3}>
            <ringGeometry args={[0.5, 0.55, 32]} />
            <meshStandardMaterial 
              color="#8E8E93" 
              transparent 
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

// Scène complète
function Scene() {
  return (
    <>
      {/* Éclairage */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 3, 2]} intensity={0.4} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#ffffff" />

      {/* Objets */}
      <NFCCard />
      <Phone />
    </>
  );
}

// Composant principal exporté
interface NFCAnimation3DProps {
  className?: string;
}

export function NFCAnimation3D({ className = "" }: NFCAnimation3DProps) {
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-[#F7F7F5]">
            <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 1, 5], fov: 45 }}
          style={{ background: "#F7F7F5" }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Overlay pour bloquer les interactions */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ pointerEvents: "auto", cursor: "default" }}
        aria-hidden="true"
      />
    </div>
  );
}

export default NFCAnimation3D;
