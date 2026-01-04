/**
 * NFC Tap Animation 3D Component
 * 
 * Interactive 3D animation showing a phone tapping an NFC card
 * with realistic wave effects and lighting
 */

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  RoundedBox, 
  Text, 
  Environment, 
  ContactShadows,
  Float,
  Html,
  MeshTransmissionMaterial
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

interface NFCTapAnimation3DProps {
  cardColor?: string;
  accentColor?: string;
  className?: string;
  autoPlay?: boolean;
}

// ============================================================
// NFC WAVE EFFECT
// ============================================================

function NFCWave({ 
  delay = 0, 
  color = "#D4AF37",
  active = true 
}: { 
  delay?: number; 
  color?: string;
  active?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useFrame((state) => {
    if (!active) {
      setScale(0);
      setOpacity(0);
      return;
    }

    const time = (state.clock.elapsedTime - delay) % 2;
    if (time < 0) return;

    const progress = time / 2;
    setScale(progress * 1.5);
    setOpacity(Math.max(0, 1 - progress * 1.5));
  });

  if (!active || opacity <= 0) return null;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale, 1]}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity * 0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ============================================================
// NFC CARD 3D
// ============================================================

function NFCCard({ color = "#0B0B0B", accent = "#D4AF37" }: { color?: string; accent?: string }) {
  const cardWidth = 3.2;
  const cardHeight = 2;
  const cardDepth = 0.04;

  return (
    <group position={[0, 0, 0]}>
      {/* Card Body */}
      <RoundedBox
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.08}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* NFC Chip */}
      <mesh position={[-0.9, 0.4, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Chip Lines */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.9, 0.4 - i * 0.08, cardDepth / 2 + 0.002]}>
          <planeGeometry args={[0.35, 0.015]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}

      {/* IWASP Text */}
      <Text
        position={[0, -0.1, cardDepth / 2 + 0.01]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        IWASP
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -0.4, cardDepth / 2 + 0.01]}
        fontSize={0.08}
        color={accent}
        anchorX="center"
        anchorY="middle"
      >
        Tap. Connect. Empower.
      </Text>

      {/* NFC Symbol */}
      <group position={[1.2, 0.7, cardDepth / 2 + 0.002]}>
        {[0.06, 0.1, 0.14].map((radius, i) => (
          <mesh key={i} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[radius, radius + 0.015, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================
// PHONE 3D
// ============================================================

function Phone({ 
  isAnimating, 
  onTapComplete 
}: { 
  isAnimating: boolean; 
  onTapComplete: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [phase, setPhase] = useState<"idle" | "approaching" | "tapping" | "retracting">("idle");
  const startTime = useRef(0);

  // Phone dimensions (iPhone-like proportions)
  const phoneWidth = 1.4;
  const phoneHeight = 2.8;
  const phoneDepth = 0.15;

  useEffect(() => {
    if (isAnimating) {
      setPhase("approaching");
      startTime.current = Date.now();
    } else {
      setPhase("idle");
    }
  }, [isAnimating]);

  useFrame(() => {
    if (!groupRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;

    switch (phase) {
      case "idle":
        groupRef.current.position.set(2.5, 2, 1);
        groupRef.current.rotation.set(-0.3, -0.5, 0.1);
        break;
      
      case "approaching":
        const approachProgress = Math.min(elapsed / 1, 1);
        const easeApproach = 1 - Math.pow(1 - approachProgress, 3);
        
        groupRef.current.position.x = THREE.MathUtils.lerp(2.5, 0.3, easeApproach);
        groupRef.current.position.y = THREE.MathUtils.lerp(2, 0.5, easeApproach);
        groupRef.current.position.z = THREE.MathUtils.lerp(1, 0.3, easeApproach);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(-0.3, -1.4, easeApproach);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.5, 0, easeApproach);

        if (approachProgress >= 1) {
          setPhase("tapping");
          startTime.current = Date.now();
          onTapComplete();
        }
        break;
      
      case "tapping":
        const tapProgress = Math.min(elapsed / 0.5, 1);
        // Small bounce effect
        const bounce = Math.sin(tapProgress * Math.PI) * 0.05;
        groupRef.current.position.z = 0.3 - bounce;

        if (tapProgress >= 1) {
          setPhase("retracting");
          startTime.current = Date.now();
        }
        break;
      
      case "retracting":
        const retractProgress = Math.min(elapsed / 1.2, 1);
        const easeRetract = retractProgress * retractProgress;
        
        groupRef.current.position.x = THREE.MathUtils.lerp(0.3, 2.5, easeRetract);
        groupRef.current.position.y = THREE.MathUtils.lerp(0.5, 2, easeRetract);
        groupRef.current.position.z = THREE.MathUtils.lerp(0.3, 1, easeRetract);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(-1.4, -0.3, easeRetract);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.5, easeRetract);

        if (retractProgress >= 1) {
          setPhase("idle");
        }
        break;
    }
  });

  return (
    <group ref={groupRef} position={[2.5, 2, 1]} rotation={[-0.3, -0.5, 0.1]}>
      {/* Phone Body */}
      <RoundedBox
        args={[phoneWidth, phoneHeight, phoneDepth]}
        radius={0.12}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
          clearcoat={0.5}
        />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox
        args={[phoneWidth - 0.08, phoneHeight - 0.12, 0.01]}
        position={[0, 0, phoneDepth / 2 + 0.005]}
        radius={0.08}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#111111"
          metalness={0}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </RoundedBox>

      {/* Screen Content - NFC Animation */}
      <mesh position={[0, 0.2, phoneDepth / 2 + 0.02]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color="#007AFF" transparent opacity={0.3} />
      </mesh>

      {/* NFC Icon on screen */}
      <group position={[0, 0.2, phoneDepth / 2 + 0.021]}>
        {[0.1, 0.16, 0.22].map((radius, i) => (
          <mesh key={i} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[radius, radius + 0.02, 32, 1, 0, Math.PI]} />
            <meshBasicMaterial color="#007AFF" />
          </mesh>
        ))}
      </group>

      {/* "Ready to Scan" text indicator */}
      <Text
        position={[0, -0.3, phoneDepth / 2 + 0.02]}
        fontSize={0.08}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Ready to Scan
      </Text>

      {/* Camera notch */}
      <mesh position={[0, phoneHeight / 2 - 0.15, phoneDepth / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Home indicator */}
      <mesh position={[0, -phoneHeight / 2 + 0.15, phoneDepth / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.02, 0.2, 4, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

// ============================================================
// SUCCESS PARTICLES
// ============================================================

function SuccessParticles({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles] = useState(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return positions;
  });

  useFrame((state) => {
    if (!particlesRef.current || !active) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 50; i++) {
      positions[i * 3 + 1] += 0.02;
      if (positions[i * 3 + 1] > 3) {
        positions[i * 3 + 1] = 0;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#D4AF37"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================
// SCENE
// ============================================================

function Scene({ 
  cardColor, 
  accentColor, 
  isPlaying,
  onTapComplete,
  showWaves 
}: { 
  cardColor: string; 
  accentColor: string;
  isPlaying: boolean;
  onTapComplete: () => void;
  showWaves: boolean;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        castShadow
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#D4AF37" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#007AFF" />

      {/* Environment */}
      <Environment preset="city" />

      {/* NFC Card with Float animation */}
      <Float
        speed={2}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        <group rotation={[-Math.PI / 6, 0, 0]} position={[0, -0.5, 0]}>
          <NFCCard color={cardColor} accent={accentColor} />
          
          {/* NFC Waves */}
          <group position={[0, 0.1, 0.1]}>
            {[0, 0.4, 0.8, 1.2].map((delay, i) => (
              <NFCWave key={i} delay={delay} color={accentColor} active={showWaves} />
            ))}
          </group>
        </group>
      </Float>

      {/* Phone */}
      <Phone isAnimating={isPlaying} onTapComplete={onTapComplete} />

      {/* Success Particles */}
      <SuccessParticles active={showWaves} />

      {/* Shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={8}
        blur={2}
        far={4}
      />
    </>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted-foreground">Chargement de l'animation...</span>
      </div>
    </Html>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function NFCTapAnimation3D({ 
  cardColor = "#0B0B0B",
  accentColor = "#D4AF37",
  className,
  autoPlay = false
}: NFCTapAnimation3DProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showWaves, setShowWaves] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    setShowWaves(false);
  };

  const handleTapComplete = () => {
    setShowWaves(true);
    setTapCount(prev => prev + 1);
    
    // Hide waves after animation
    setTimeout(() => {
      setShowWaves(false);
      setIsPlaying(false);
    }, 2500);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setShowWaves(false);
    setTapCount(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-border/30",
        className
      )}
      style={{ aspectRatio: "16/10" }}
    >
      {/* Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-medium text-white/80">NFC Demo</span>
      </div>

      {/* Tap Counter */}
      {tapCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30"
        >
          <span className="text-xs font-medium text-primary">
            {tapCount} tap{tapCount > 1 ? "s" : ""}
          </span>
        </motion.div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePlay}
          disabled={isPlaying}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <Play size={14} className="mr-1" />
          {isPlaying ? "En cours..." : "Lancer l'animation"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-8 w-8 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        >
          <RotateCcw size={14} />
        </Button>
      </div>

      {/* Success Message */}
      {showWaves && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 rounded-2xl bg-primary/90 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 text-primary-foreground">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Connexion réussie !</span>
          </div>
        </motion.div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3, 3, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            cardColor={cardColor}
            accentColor={accentColor}
            isPlaying={isPlaying}
            onTapComplete={handleTapComplete}
            showWaves={showWaves}
          />
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10">
        <p className="text-[10px] text-white/40 text-center">
          Cliquez pour simuler un tap NFC
        </p>
      </div>
    </motion.div>
  );
}

export default NFCTapAnimation3D;
