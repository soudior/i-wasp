/**
 * Card3DGallery - Galerie 3D interactive avec rotation 360°
 * Matériaux réalistes : métal brossé, reflets, finitions premium
 */

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html, useEnvironment } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Maximize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import card textures
import cardFront from "@/assets/cards/card-base-front.png";
import cardBack from "@/assets/cards/card-base-back.png";

type FinishType = "mat" | "brillant" | "metal-brosse" | "chrome";

interface CardModel {
  id: string;
  name: string;
  description: string;
  frontTexture: string;
  backTexture: string;
  finish: FinishType;
  edgeColor: string;
}

const cardModels: CardModel[] = [
  {
    id: "signature",
    name: "Carte Signature",
    description: "Finition mat premium",
    frontTexture: cardFront,
    backTexture: cardBack,
    finish: "mat",
    edgeColor: "#1a1a1a"
  },
  {
    id: "executive",
    name: "Carte Executive",
    description: "Finition brillante miroir",
    frontTexture: cardFront,
    backTexture: cardBack,
    finish: "brillant",
    edgeColor: "#2a2a2a"
  },
  {
    id: "luxury",
    name: "Carte Luxury",
    description: "Métal brossé exclusif",
    frontTexture: cardFront,
    backTexture: cardBack,
    finish: "metal-brosse",
    edgeColor: "#3a3a3a"
  },
  {
    id: "platinum",
    name: "Carte Platinum",
    description: "Chrome ultra-luxe",
    frontTexture: cardFront,
    backTexture: cardBack,
    finish: "chrome",
    edgeColor: "#505050"
  }
];

// Material properties based on finish type
function getFinishMaterial(finish: FinishType): {
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
  envMapIntensity: number;
} {
  switch (finish) {
    case "mat":
      return {
        metalness: 0.1,
        roughness: 0.8,
        clearcoat: 0,
        clearcoatRoughness: 0.5,
        reflectivity: 0.2,
        envMapIntensity: 0.3
      };
    case "brillant":
      return {
        metalness: 0.3,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        reflectivity: 0.9,
        envMapIntensity: 1.2
      };
    case "metal-brosse":
      return {
        metalness: 0.95,
        roughness: 0.35,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2,
        reflectivity: 0.8,
        envMapIntensity: 1.5
      };
    case "chrome":
      return {
        metalness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        envMapIntensity: 2
      };
    default:
      return {
        metalness: 0.5,
        roughness: 0.5,
        clearcoat: 0,
        clearcoatRoughness: 0.5,
        reflectivity: 0.5,
        envMapIntensity: 1
      };
  }
}

// Brushed metal normal map generator
function useBrushedMetalTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Create brushed metal effect
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
    
    // Add horizontal brush strokes
    for (let i = 0; i < size * 2; i++) {
      const y = Math.random() * size;
      const alpha = Math.random() * 0.15 + 0.05;
      const width = Math.random() * 3 + 1;
      
      ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? 180 : 80}, ${Math.random() > 0.5 ? 180 : 80}, ${Math.random() > 0.5 ? 180 : 80}, ${alpha})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    return texture;
  }, []);
}

// 3D Card Component with realistic materials
function Card3D({ 
  frontTexture, 
  backTexture, 
  finish,
  edgeColor,
  isActive,
  autoRotate 
}: { 
  frontTexture: string; 
  backTexture: string;
  finish: FinishType;
  edgeColor: string;
  isActive: boolean;
  autoRotate: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const envMap = useEnvironment({ preset: "city" });
  const brushedTexture = useBrushedMetalTexture();
  
  // Load textures
  const front = useLoader(THREE.TextureLoader, frontTexture);
  const back = useLoader(THREE.TextureLoader, backTexture);

  // Get material properties based on finish
  const materialProps = getFinishMaterial(finish);

  // Auto-rotate animation with smooth easing
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate && isActive) {
      meshRef.current.rotation.y += delta * 0.4;
    }
    
    // Subtle floating animation
    if (meshRef.current && isActive) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  // Card dimensions (credit card ratio: 85.6mm x 53.98mm)
  const width = 2.4;
  const height = width / 1.586;
  const thickness = 0.025;

  // Edge material with metallic finish
  const edgeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(edgeColor),
    metalness: finish === "chrome" ? 1 : 0.9,
    roughness: finish === "metal-brosse" ? 0.4 : 0.2,
    envMap: envMap,
    envMapIntensity: materialProps.envMapIntensity,
    clearcoat: materialProps.clearcoat,
    clearcoatRoughness: materialProps.clearcoatRoughness,
  }), [edgeColor, finish, envMap, materialProps]);

  // Front face material
  const frontMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: front,
      metalness: materialProps.metalness,
      roughness: materialProps.roughness,
      envMap: envMap,
      envMapIntensity: materialProps.envMapIntensity,
      clearcoat: materialProps.clearcoat,
      clearcoatRoughness: materialProps.clearcoatRoughness,
      reflectivity: materialProps.reflectivity,
    });
    
    // Add brushed effect for metal-brosse
    if (finish === "metal-brosse") {
      mat.normalMap = brushedTexture;
      mat.normalScale = new THREE.Vector2(0.15, 0.15);
    }
    
    return mat;
  }, [front, envMap, materialProps, finish, brushedTexture]);

  // Back face material
  const backMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: back,
      metalness: materialProps.metalness,
      roughness: materialProps.roughness,
      envMap: envMap,
      envMapIntensity: materialProps.envMapIntensity,
      clearcoat: materialProps.clearcoat,
      clearcoatRoughness: materialProps.clearcoatRoughness,
      reflectivity: materialProps.reflectivity,
    });
    
    if (finish === "metal-brosse") {
      mat.normalMap = brushedTexture;
      mat.normalScale = new THREE.Vector2(0.15, 0.15);
    }
    
    return mat;
  }, [back, envMap, materialProps, finish, brushedTexture]);

  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <primitive attach="material-0" object={edgeMaterial} /> {/* Right */}
        <primitive attach="material-1" object={edgeMaterial} /> {/* Left */}
        <primitive attach="material-2" object={edgeMaterial} /> {/* Top */}
        <primitive attach="material-3" object={edgeMaterial} /> {/* Bottom */}
        <primitive attach="material-4" object={frontMaterial} /> {/* Front */}
        <primitive attach="material-5" object={backMaterial} /> {/* Back */}
      </mesh>
      
      {/* Subtle glow effect for chrome/brillant */}
      {(finish === "chrome" || finish === "brillant") && (
        <mesh position={[0, 0, -0.02]} scale={[1.02, 1.02, 1]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.05} 
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Loading placeholder
function LoadingCard() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-xs text-white/60">Chargement 3D...</span>
      </div>
    </Html>
  );
}

// Finish indicator badge
function FinishBadge({ finish }: { finish: FinishType }) {
  const labels: Record<FinishType, string> = {
    "mat": "Mat Premium",
    "brillant": "Brillant Miroir",
    "metal-brosse": "Métal Brossé",
    "chrome": "Chrome Ultra-Luxe"
  };
  
  const icons: Record<FinishType, string> = {
    "mat": "○",
    "brillant": "◉",
    "metal-brosse": "≡",
    "chrome": "◈"
  };

  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
      <span className="text-sm">{icons[finish]}</span>
      <span className="text-xs text-white/80">{labels[finish]}</span>
    </div>
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

  const GalleryContent = ({ height = "h-[450px]" }: { height?: string }) => (
    <div className={`relative ${height} w-full rounded-3xl overflow-hidden`} style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)" }}>
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        dpr={[1, 2]}
      >
        {/* Lighting setup for realistic reflections */}
        <ambientLight intensity={0.2} />
        
        {/* Key light */}
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Fill light */}
        <spotLight
          position={[-5, 3, 5]}
          angle={0.4}
          penumbra={1}
          intensity={0.8}
          color="#b0c4de"
        />
        
        {/* Rim light for edge highlights */}
        <pointLight
          position={[0, 0, -5]}
          intensity={0.5}
          color="#ffffff"
        />
        
        {/* Top accent light */}
        <rectAreaLight
          position={[0, 3, 0]}
          width={4}
          height={4}
          intensity={0.5}
          color="#ffffff"
        />
        
        <Suspense fallback={<LoadingCard />}>
          <Card3D
            frontTexture={activeCard.frontTexture}
            backTexture={activeCard.backTexture}
            finish={activeCard.finish}
            edgeColor={activeCard.edgeColor}
            isActive={true}
            autoRotate={autoRotate}
          />
          
          <ContactShadows
            position={[0, -0.9, 0]}
            opacity={0.6}
            scale={6}
            blur={2.5}
            far={4}
            color="#000000"
          />
          
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Finish Badge */}
      <div className="absolute top-4 left-4 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.finish}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <FinishBadge finish={activeCard.finish} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
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
              <h3 className="text-xl font-semibold text-white flex items-center justify-center gap-2">
                {activeCard.name}
                {activeCard.finish === "chrome" && <Sparkles className="w-4 h-4 text-amber-400" />}
              </h3>
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

          {/* Finish type indicators */}
          <div className="flex gap-3">
            {cardModels.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 ${
                  index === activeIndex
                    ? "scale-110"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <div 
                  className={`w-8 h-5 rounded-sm border transition-all ${
                    index === activeIndex 
                      ? "border-white shadow-lg shadow-white/20" 
                      : "border-white/30"
                  }`}
                  style={{
                    background: card.finish === "chrome" 
                      ? "linear-gradient(135deg, #888 0%, #fff 50%, #888 100%)"
                      : card.finish === "metal-brosse"
                      ? "linear-gradient(90deg, #555 0%, #777 50%, #555 100%)"
                      : card.finish === "brillant"
                      ? "linear-gradient(135deg, #333 0%, #666 100%)"
                      : "#222"
                  }}
                />
              </button>
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
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`text-white rounded-full backdrop-blur-sm ${autoRotate ? "bg-white/20" : "bg-black/30 hover:bg-white/10"}`}
        >
          <RotateCcw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
        </Button>
        {!isFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(true)}
            className="text-white bg-black/30 hover:bg-white/10 rounded-full backdrop-blur-sm"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-white/40 flex items-center gap-2"
        >
          <span>↔</span>
          <span>Glissez pour tourner</span>
          <span>•</span>
          <span>Scroll pour zoomer</span>
        </motion.div>
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
          >
            <div className="w-full h-full max-w-5xl max-h-[85vh] p-4">
              <GalleryContent height="h-full" />
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm transition-all"
            >
              Fermer ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
