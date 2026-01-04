/**
 * Card 3D Preview Component
 * 
 * Interactive 3D preview of the NFC card using React Three Fiber
 * Shows a realistic card that can be rotated and viewed from all angles
 */

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  RoundedBox, 
  Text, 
  Environment, 
  ContactShadows,
  PresentationControls,
  Html,
  useTexture
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { RotateCcw, Maximize2, Minimize2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================

export interface Card3DData {
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  photoUrl?: string;
  logoUrl?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
}

interface Card3DPreviewProps {
  data: Card3DData;
  className?: string;
}

// ============================================================
// 3D CARD COMPONENT
// ============================================================

function NFCCard({ data }: { data: Card3DData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Card dimensions (credit card ratio 85.6mm × 53.98mm)
  const cardWidth = 3.2;
  const cardHeight = 2;
  const cardDepth = 0.04;
  
  // Colors
  const bgColor = data.backgroundColor || "#0B0B0B";
  const accentColor = data.accentColor || "#D4AF37";
  const textColor = data.textColor || "#FFFFFF";
  
  // Subtle animation
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group>
      {/* Main Card Body */}
      <RoundedBox
        ref={meshRef}
        args={[cardWidth, cardHeight, cardDepth]}
        radius={0.08}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={bgColor}
          metalness={0.3}
          roughness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* NFC Chip */}
      <mesh position={[-0.9, 0.4, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* NFC Chip Lines */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.9, 0.4 - i * 0.08, cardDepth / 2 + 0.002]}>
          <planeGeometry args={[0.35, 0.02]} />
          <meshStandardMaterial color={bgColor} />
        </mesh>
      ))}

      {/* Name Text */}
      <Text
        position={[0, -0.2, cardDepth / 2 + 0.01]}
        fontSize={0.18}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        maxWidth={2.8}
      >
        {`${data.firstName || "Prénom"} ${data.lastName || "Nom"}`}
      </Text>

      {/* Title Text */}
      {data.title && (
        <Text
          position={[0, -0.45, cardDepth / 2 + 0.01]}
          fontSize={0.1}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
          fillOpacity={0.7}
        >
          {data.title}
        </Text>
      )}

      {/* Company Text */}
      {data.company && (
        <Text
          position={[0, -0.62, cardDepth / 2 + 0.01]}
          fontSize={0.08}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.8}
        >
          {data.company}
        </Text>
      )}

      {/* IWASP Branding */}
      <Text
        position={[1.1, -0.85, cardDepth / 2 + 0.01]}
        fontSize={0.06}
        color={textColor}
        anchorX="right"
        anchorY="middle"
        fillOpacity={0.5}
      >
        IWASP
      </Text>

      {/* NFC Icon Circle */}
      <mesh position={[1.2, 0.7, cardDepth / 2 + 0.001]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color={accentColor} transparent opacity={0.3} />
      </mesh>

      {/* NFC Waves */}
      {[0.06, 0.09, 0.12].map((radius, i) => (
        <mesh key={i} position={[1.2, 0.7, cardDepth / 2 + 0.002]} rotation={[0, 0, Math.PI / 4]}>
          <ringGeometry args={[radius, radius + 0.01, 32, 1, 0, Math.PI]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
      ))}

      {/* Back of card */}
      <mesh position={[0, 0, -cardDepth / 2 - 0.001]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial color={bgColor} />
      </mesh>

      {/* Magnetic Strip on back */}
      <mesh position={[0, 0.5, -cardDepth / 2 - 0.002]}>
        <planeGeometry args={[cardWidth, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

// ============================================================
// LOADING FALLBACK
// ============================================================

function LoadingCard() {
  return (
    <Html center>
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Chargement 3D...</span>
      </div>
    </Html>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function Card3DPreview({ data, className }: Card3DPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative rounded-2xl overflow-hidden bg-gradient-to-br from-background to-muted/50 border border-border/50",
        isFullscreen ? "fixed inset-4 z-50" : "aspect-[4/3]",
        className
      )}
    >
      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={() => setAutoRotate(!autoRotate)}
        >
          <RotateCcw size={14} className={cn(autoRotate && "animate-spin")} style={{ animationDuration: "3s" }} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </Button>
      </div>

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
        <Camera size={12} className="text-primary" />
        <span className="text-[10px] font-medium text-muted-foreground">Aperçu 3D</span>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingCard />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-5, -5, -5]} intensity={0.3} />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Interactive Controls */}
          <PresentationControls
            global
            rotation={[0.1, 0.2, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 300 }}
          >
            <NFCCard data={data} />
          </PresentationControls>

          {/* Shadow */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={5}
            blur={2.5}
            far={4}
          />
        </Suspense>
      </Canvas>

      {/* Instructions */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
        <p className="text-[10px] text-muted-foreground text-center">
          Glissez pour faire pivoter • Pincez pour zoomer
        </p>
      </div>

      {/* Fullscreen backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm -z-10"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </motion.div>
  );
}

export default Card3DPreview;
