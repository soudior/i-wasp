/**
 * Showroom 3D — Club Privé Futuriste i-wasp
 * Espace immersif avec produits NFC, ambiances, démos
 */

import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Text,
  Float,
  MeshReflectorMaterial,
  Sparkles,
  Html,
  useProgress
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  Users, 
  Wine,
  X,
  CreditCard,
  Zap,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClubNavbar } from "@/components/ClubNavbar";
import * as THREE from "three";

// Product data
const PRODUCTS = [
  {
    id: "card-black",
    name: "Black Edition",
    description: "Carte NFC noir mat premium avec finition soft-touch. Parfait pour les professionnels exigeants.",
    price: "59€",
    position: [-3, 1.2, 0] as [number, number, number],
    color: "#0A0A0A",
    features: ["NFC haute fréquence", "Finition soft-touch", "Personnalisation complète"]
  },
  {
    id: "card-gold",
    name: "Gold Accent",
    description: "Édition limitée avec accents dorés. Le summum du luxe technologique.",
    price: "89€",
    position: [0, 1.2, -2] as [number, number, number],
    color: "#D4AF37",
    features: ["Édition limitée", "Accents or 24K", "Certificat d'authenticité"]
  },
  {
    id: "card-white",
    name: "Minimal White",
    description: "Design épuré blanc pur. L'élégance dans sa forme la plus simple.",
    price: "49€",
    position: [3, 1.2, 0] as [number, number, number],
    color: "#F5F5F5",
    features: ["Design minimal", "PVC premium", "Livraison express"]
  }
];

const AMBIANCES = [
  { id: "night", name: "Nuit", icon: Moon, preset: "night" as const },
  { id: "day", name: "Jour", icon: Sun, preset: "dawn" as const },
  { id: "party", name: "Soirée", icon: Wine, preset: "warehouse" as const },
  { id: "networking", name: "Networking", icon: Users, preset: "city" as const }
];

// Loading screen
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-white/60 text-sm">Chargement du showroom... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

// Floor with reflection
function Floor({ isDark }: { isDark: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={isDark ? 80 : 40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color={isDark ? "#050505" : "#1a1a1a"}
        metalness={isDark ? 0.8 : 0.5}
        mirror={0}
      />
    </mesh>
  );
}

// NFC Card Product
function NFCCard({ 
  product, 
  onClick,
  isSelected 
}: { 
  product: typeof PRODUCTS[0];
  onClick: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <group position={product.position}>
        {/* Pedestal */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.2, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Light ring */}
        <mesh position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 64]} />
          <meshBasicMaterial color="#FFC700" transparent opacity={isSelected ? 1 : 0.5} />
        </mesh>
        
        {/* Card */}
        <mesh 
          ref={meshRef}
          onClick={onClick}
          rotation={[0, Math.PI / 4, 0]}
        >
          <boxGeometry args={[1.6, 0.02, 1]} />
          <meshStandardMaterial 
            color={product.color} 
            metalness={0.7} 
            roughness={0.2}
            emissive={isSelected ? product.color : "#000000"}
            emissiveIntensity={isSelected ? 0.2 : 0}
          />
        </mesh>
        
        {/* Holographic label */}
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.15}
          color="#FFC700"
          anchorX="center"
          anchorY="middle"
        >
          {product.name}
        </Text>
        
        {/* Price tag */}
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.1}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {product.price}
        </Text>

        {/* Click indicator */}
        {!isSelected && (
          <Html position={[0, 0.7, 0]} center>
            <div className="px-2 py-1 bg-amber-500/20 backdrop-blur-sm rounded-full text-xs text-amber-300 whitespace-nowrap animate-pulse">
              Cliquez pour découvrir
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

// Room walls with neon accents
function Room({ isDark }: { isDark: boolean }) {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 5, -8]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color={isDark ? "#080808" : "#151515"} />
      </mesh>
      
      {/* Side walls */}
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color={isDark ? "#0A0A0A" : "#181818"} />
      </mesh>
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color={isDark ? "#0A0A0A" : "#181818"} />
      </mesh>
      
      {/* Neon lines on walls */}
      <mesh position={[0, 3, -7.9]}>
        <boxGeometry args={[20, 0.02, 0.02]} />
        <meshBasicMaterial color="#FFC700" />
      </mesh>
      <mesh position={[0, 7, -7.9]}>
        <boxGeometry args={[20, 0.02, 0.02]} />
        <meshBasicMaterial color="#FFC700" />
      </mesh>
      
      {/* Vertical neon accents */}
      <mesh position={[-9.9, 5, -3]}>
        <boxGeometry args={[0.02, 6, 0.02]} />
        <meshBasicMaterial color="#FFC700" />
      </mesh>
      <mesh position={[9.9, 5, -3]}>
        <boxGeometry args={[0.02, 6, 0.02]} />
        <meshBasicMaterial color="#FFC700" />
      </mesh>
    </group>
  );
}

// Floating logo
function FloatingLogo() {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <group position={[0, 4, -7]}>
        <Text
          fontSize={0.8}
          color="#FFC700"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          i-wasp
        </Text>
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          CLUB SHOWROOM
        </Text>
      </group>
    </Float>
  );
}

// Ambient particles
function AmbientParticles({ isDark }: { isDark: boolean }) {
  return (
    <Sparkles
      count={100}
      scale={15}
      size={isDark ? 2 : 1}
      speed={0.3}
      opacity={isDark ? 0.5 : 0.3}
      color="#FFC700"
    />
  );
}

// Main 3D Scene
function Scene({ 
  ambiance, 
  selectedProduct, 
  onProductClick 
}: { 
  ambiance: string;
  selectedProduct: string | null;
  onProductClick: (id: string) => void;
}) {
  const isDark = ambiance === "night" || ambiance === "party";
  const currentAmbiance = AMBIANCES.find(a => a.id === ambiance);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={60} />
      <OrbitControls 
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1, 0]}
      />
      
      {/* Environment */}
      <Environment preset={currentAmbiance?.preset || "night"} />
      
      {/* Ambient light */}
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
      
      {/* Spotlights for products */}
      <spotLight 
        position={[-3, 5, 2]} 
        angle={0.3} 
        penumbra={1} 
        intensity={isDark ? 1.5 : 1}
        color="#FFFFFF"
        castShadow
      />
      <spotLight 
        position={[0, 5, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={isDark ? 1.5 : 1}
        color="#FFFFFF"
        castShadow
      />
      <spotLight 
        position={[3, 5, 2]} 
        angle={0.3} 
        penumbra={1} 
        intensity={isDark ? 1.5 : 1}
        color="#FFFFFF"
        castShadow
      />
      
      {/* Accent lights */}
      <pointLight position={[0, 3, -5]} intensity={0.5} color="#FFC700" />
      
      {/* Room */}
      <Room isDark={isDark} />
      
      {/* Floor */}
      <Floor isDark={isDark} />
      
      {/* Products */}
      {PRODUCTS.map(product => (
        <NFCCard 
          key={product.id}
          product={product}
          onClick={() => onProductClick(product.id)}
          isSelected={selectedProduct === product.id}
        />
      ))}
      
      {/* Logo */}
      <FloatingLogo />
      
      {/* Particles */}
      <AmbientParticles isDark={isDark} />
    </>
  );
}

// Product detail panel
function ProductPanel({ 
  product, 
  onClose 
}: { 
  product: typeof PRODUCTS[0] | null;
  onClose: () => void;
}) {
  if (!product) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="absolute top-4 right-4 w-80 max-h-[calc(100vh-120px)] overflow-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-20"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Product preview */}
      <div 
        className="w-full aspect-[1.6/1] rounded-xl mb-4 flex items-center justify-center"
        style={{ backgroundColor: product.color === "#F5F5F5" ? "#1a1a1a" : product.color }}
      >
        <CreditCard className="w-16 h-16" style={{ color: product.color === "#F5F5F5" ? "#F5F5F5" : "#FFFFFF" }} />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
      <p className="text-2xl font-bold text-amber-400 mb-4">{product.price}</p>
      
      <p className="text-white/60 text-sm leading-relaxed mb-6">
        {product.description}
      </p>
      
      {/* Features */}
      <div className="space-y-2 mb-6">
        {product.features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-white/80">{feature}</span>
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div className="space-y-3">
        <Link to="/order/offre" className="block">
          <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold gap-2">
            Commander
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/demo" className="block">
          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
            Voir la démo NFC
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// Main component
export default function Showroom3D() {
  const [ambiance, setAmbiance] = useState("night");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const selectedProductData = PRODUCTS.find(p => p.id === selectedProduct) || null;
  
  const handleResetView = () => {
    setSelectedProduct(null);
  };
  
  return (
    <div className="fixed inset-0 bg-[#050508]">
      {/* 3D Canvas */}
      <Canvas shadows className="w-full h-full">
        <Suspense fallback={<Loader />}>
          <Scene 
            ambiance={ambiance}
            selectedProduct={selectedProduct}
            onProductClick={setSelectedProduct}
          />
        </Suspense>
      </Canvas>
      
      {/* ClubNavbar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <ClubNavbar />
      </div>
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Reset button */}
        <div className="absolute top-20 right-4 pointer-events-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/60 hover:text-white hover:bg-white/5 gap-2"
            onClick={handleResetView}
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
        </div>
        
        {/* Showroom status badge */}
        <div className="absolute top-20 left-4 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/60">Showroom actif</span>
          </div>
        </div>
        
        {/* Ambiance selector */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center gap-2 p-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10">
            {AMBIANCES.map(amb => {
              const Icon = amb.icon;
              const isActive = ambiance === amb.id;
              return (
                <button
                  key={amb.id}
                  onClick={() => setAmbiance(amb.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all
                    ${isActive 
                      ? "bg-amber-500 text-black" 
                      : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{amb.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p className="text-xs text-white/40 text-center">
            Cliquez et glissez pour explorer • Scroll pour zoomer • Cliquez sur un produit pour les détails
          </p>
        </div>
        
        {/* Product panel */}
        <div className="pointer-events-auto">
          <AnimatePresence>
            {selectedProductData && (
              <ProductPanel 
                product={selectedProductData} 
                onClose={() => setSelectedProduct(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
