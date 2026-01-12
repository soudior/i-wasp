import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HoneycombBackgroundProps {
  className?: string;
  showDots?: boolean;
  opacity?: number;
}

/**
 * Honeycomb Background Pattern
 * 
 * Ultra-subtle hexagonal grid with animated glowing dots at intersections.
 * Follows "Quiet Luxury" aesthetic - barely visible at 3-6% opacity.
 */
export function HoneycombBackground({ 
  className = "", 
  showDots = true,
  opacity = 0.04 
}: HoneycombBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!showDots || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    
    // Dot positions at hexagon intersections
    const hexSize = 60;
    const dots: { x: number; y: number; phase: number }[] = [];
    
    for (let row = 0; row < canvas.height / hexSize + 2; row++) {
      for (let col = 0; col < canvas.width / hexSize + 2; col++) {
        const x = col * hexSize * 1.5;
        const y = row * hexSize * Math.sqrt(3) + (col % 2 === 1 ? hexSize * Math.sqrt(3) / 2 : 0);
        
        // Only some intersections have dots (sparse distribution)
        if (Math.random() > 0.85) {
          dots.push({ x, y, phase: Math.random() * Math.PI * 2 });
        }
      }
    }
    
    // Animation loop - VERY SLOW pulsing
    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach(dot => {
        // Very slow pulse (5-8 second cycle)
        const pulse = Math.sin(frame * 0.0008 + dot.phase) * 0.5 + 0.5;
        const alpha = pulse * 0.35 + 0.1;
        const radius = 1.5 + pulse * 1;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(175, 142, 86, ${alpha})`;
        ctx.fill();
      });
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [showDots]);
  
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Honeycomb SVG Pattern */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="honeycomb-pattern" 
            x="0" 
            y="0" 
            width="56" 
            height="100" 
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.2)"
          >
            {/* Hexagon paths - 0.5px stroke as specified */}
            <path 
              d="M28 0L56 16.5V49.5L28 66L0 49.5V16.5L28 0Z" 
              fill="none" 
              stroke="#080808" 
              strokeWidth="0.5"
            />
            <path 
              d="M28 66L56 82.5V115.5L28 132L0 115.5V82.5L28 66Z" 
              fill="none" 
              stroke="#080808" 
              strokeWidth="0.5"
              transform="translate(0, -33)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb-pattern)" />
      </svg>
      
      {/* Animated dots canvas */}
      {showDots && (
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.8 }}
        />
      )}
      
      {/* Fine grain texture overlay */}
      <div 
        className="absolute inset-0 w-full h-full mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
    </div>
  );
}

/**
 * Hexagonal Icon Container
 * 
 * Renders content in a hexagonal frame.
 */
export function HexagonIcon({ 
  children, 
  className = "",
  size = 48,
  filled = false
}: { 
  children: React.ReactNode; 
  className?: string;
  size?: number;
  filled?: boolean;
}) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg 
        viewBox="0 0 100 115" 
        className="absolute inset-0 w-full h-full"
      >
        <polygon 
          points="50 0, 100 28.75, 100 86.25, 50 115, 0 86.25, 0 28.75" 
          fill={filled ? "#AF8E56" : "none"}
          stroke="#080808"
          strokeWidth="1"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Hexagonal Image Mask
 */
export function HexagonImage({ 
  src, 
  alt = "",
  className = "",
  size = 120
}: { 
  src: string; 
  alt?: string;
  className?: string;
  size?: number;
}) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: size, 
        height: size * 1.15,
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
      }}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
