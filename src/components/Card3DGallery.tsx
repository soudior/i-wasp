/**
 * Card3DGallery - Galerie 3D interactive avec rotation 360°
 * Utilise React Three Fiber pour un rendu 3D premium
 */

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import card textures
import cardFront from "@/assets/cards/card-base-front.png";
import cardBack from "@/assets/cards/card-base-back.png";

interface CardModel {
  id: string;
  name: string;
  description: string;
  frontTexture: string;
  backTexture: string;
}

const cardModels: CardModel[] = [
  {
    id: "signature",
    name: "Carte Signature",
    description: "L'essentiel premium",
    frontTexture: cardFront,
    backTexture: cardBack
  },
  {
    id: "executive",
    name: "Carte Executive",
    description: "Pour les professionnels",
    frontTexture: cardFront,
    backTexture: cardBack
  },
  {
    id: "luxury",
    name: "Carte Luxury",
    description: "L'excellence absolue",
    frontTexture: cardFront,
    backTexture: cardBack
  },
  {
    id: "team",
    name: "Pack Team",
    description: "Pour les équipes",
    frontTexture: cardFront,
    backTexture: cardBack
  }
];

// 3D Card Component
function Card3D({ 
  frontTexture, 
  backTexture, 
  isActive,
  autoRotate 
}: { 
  frontTexture: string; 
  backTexture: string;
  isActive: boolean;
  autoRotate: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load textures
  const front = useLoader(THREE.TextureLoader, frontTexture);
  const back = useLoader(THREE.TextureLoader, backTexture);

  // Auto-rotate animation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate && isActive) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Card dimensions (credit card ratio: 85.6mm x 53.98mm)
  const width = 2.4;
  const height = width / 1.586;
  const thickness = 0.02;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[width, height, thickness]} />
      <meshStandardMaterial attach="material-0" color="#1a1a1a" /> {/* Right */}
      <meshStandardMaterial attach="material-1" color="#1a1a1a" /> {/* Left */}
      <meshStandardMaterial attach="material-2" color="#1a1a1a" /> {/* Top */}
      <meshStandardMaterial attach="material-3" color="#1a1a1a" /> {/* Bottom */}
      <meshStandardMaterial attach="material-4" map={front} /> {/* Front */}
      <meshStandardMaterial attach="material-5" map={back} /> {/* Back */}
    </mesh>
  );
}

// Loading placeholder
function LoadingCard() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </Html>
  );
}

// Main Gallery Component
export function Card3DGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeCard = cardModels[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cardModels.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cardModels.length - 1 ? 0 : prev + 1));
  };

  const GalleryContent = ({ height = "h-[400px]" }: { height?: string }) => (
    <div className={`relative ${height} w-full rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black`}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <spotLight
          position={[-10, -10, -10]}
          angle={0.15}
          penumbra={1}
          intensity={0.5}
        />
        
        <Suspense fallback={<LoadingCard />}>
          <Card3D
            frontTexture={activeCard.frontTexture}
            backTexture={activeCard.backTexture}
            isActive={true}
            autoRotate={autoRotate}
          />
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={5}
            blur={2}
            far={4}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        {/* Card Info */}
        <div className="text-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white">{activeCard.name}</h3>
              <p className="text-sm text-zinc-400">{activeCard.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="flex gap-2">
            {cardModels.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-white w-6"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`text-white rounded-full ${autoRotate ? "bg-white/20" : "hover:bg-white/10"}`}
        >
          <RotateCcw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
        </Button>
        {!isFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(true)}
            className="text-white hover:bg-white/10 rounded-full"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Drag hint */}
      <div className="absolute top-4 left-4">
        <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs text-white/60">Glissez pour tourner</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <GalleryContent />

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="w-full h-full max-w-4xl max-h-[80vh] p-4" onClick={(e) => e.stopPropagation()}>
              <GalleryContent height="h-full" />
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white"
            >
              <span className="text-sm">Fermer</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
