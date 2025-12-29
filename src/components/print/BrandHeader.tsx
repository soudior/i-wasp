/**
 * BrandHeader Component - IWASP Signature Front Side
 * 
 * Locked luxury template following Dior-style minimal branding:
 * - IWASP ))) mark fixed in top-right (never customizable)
 * - Client logo centered as dominant visual
 * - No additional text on card
 * 
 * Single source of truth for all card visuals - used for both UI preview and print PDF.
 */

import { forwardRef, useMemo } from "react";
import {
  CARD_DIMENSIONS,
  CARD_PREVIEW_PX,
  PRINT_COLORS,
  PREMIUM_BACKGROUNDS,
  LOGO_SIZE_CONSTRAINTS,
  MM_TO_PX_300DPI,
  PREVIEW_SCALE,
  BrandBackgroundConfig,
  PremiumBackgroundId,
  PrintColor,
  BACKGROUND_IMAGE_REQUIREMENTS,
} from "@/lib/printTypes";

// ============= IWASP ))) MARK - LOCKED DESIGN =============
// This mark is NEVER customizable by users
// Same size and position for ALL cards

interface IwaspMarkProps {
  scale: number; // mm to px conversion
  textColor: string;
  forPrint?: boolean;
}

function IwaspMark({ scale, textColor, forPrint = false }: IwaspMarkProps) {
  const mmToPx = (mm: number) => mm * scale;
  
  // Fixed dimensions - LOCKED
  const markWidth = mmToPx(12);
  const iconSize = mmToPx(4);
  const fontSize = forPrint ? mmToPx(1.8) : mmToPx(2);
  
  return (
    <div 
      className="flex items-center gap-1"
      style={{ 
        opacity: 0.5,
        width: markWidth,
      }}
    >
      {/* IWASP text */}
      <span 
        style={{ 
          fontSize,
          fontWeight: 600,
          letterSpacing: "0.15em",
          color: textColor,
          fontFamily: "'SF Pro Display', 'Inter', -apple-system, sans-serif",
        }}
      >
        IWASP
      </span>
      
      {/* NFC waves ))) */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={textColor} 
        strokeWidth="2" 
        strokeLinecap="round"
        style={{ flexShrink: 0 }}
      >
        <path d="M2 12a5 5 0 0 1 5-5" />
        <path d="M2 12a9 9 0 0 1 9-9" />
        <path d="M2 12a13 13 0 0 1 13-13" />
        <circle cx="2" cy="12" r="1" fill={textColor} />
      </svg>
    </div>
  );
}

// ============= CARD BACK COMPONENT =============

export interface CardBackProps {
  background: BrandBackgroundConfig;
  cardColor?: PrintColor | PremiumBackgroundId;
  forPrint?: boolean;
  className?: string;
}

export const CardBack = forwardRef<HTMLDivElement, CardBackProps>(
  ({ background, cardColor, forPrint = false, className = "" }, ref) => {
    const scale = forPrint ? MM_TO_PX_300DPI : PREVIEW_SCALE;
    const width = forPrint
      ? CARD_DIMENSIONS.WIDTH_MM * MM_TO_PX_300DPI
      : CARD_PREVIEW_PX.WIDTH;
    const height = forPrint
      ? CARD_DIMENSIONS.HEIGHT_MM * MM_TO_PX_300DPI
      : CARD_PREVIEW_PX.HEIGHT;

    const mmToPx = (mm: number) => mm * scale;

    // Get background color (same as front)
    const bgConfig = useMemo(() => {
      if (background.type === "solid" && background.solidColorId) {
        const premiumBg = PREMIUM_BACKGROUNDS[background.solidColorId];
        return {
          hex: premiumBg.hex,
          textColor: premiumBg.textColor,
          accentColor: premiumBg.accentColor,
        };
      }
      if (cardColor && PRINT_COLORS[cardColor as PrintColor]) {
        const colorConfig = PRINT_COLORS[cardColor as PrintColor];
        return {
          hex: colorConfig.hex,
          textColor: colorConfig.textColor,
          accentColor: colorConfig.accentColor,
        };
      }
      return {
        hex: "#ffffff",
        textColor: "#0a0a0a",
        accentColor: "#6b7280",
      };
    }, [background, cardColor]);

    const iconSize = mmToPx(14);
    const nfcIconSize = mmToPx(8);

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: bgConfig.hex,
          borderRadius: forPrint ? 0 : `${mmToPx(CARD_DIMENSIONS.CORNER_RADIUS_MM)}px`,
          fontFamily: "'SF Pro Display', 'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Image Background (same as front) */}
        {background.type === "image" && background.imageUrl && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${background.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: `blur(${background.imageBlur ?? BACKGROUND_IMAGE_REQUIREMENTS.DEFAULT_BLUR}px)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${(background.imageOverlay ?? BACKGROUND_IMAGE_REQUIREMENTS.DEFAULT_OVERLAY) / 100})`,
              }}
            />
          </>
        )}

        {/* Centered NFC + Tap gesture */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* NFC waves icon */}
          <svg 
            width={nfcIconSize} 
            height={nfcIconSize} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={background.type === "image" ? "#ffffff" : bgConfig.accentColor}
            strokeWidth="1.5" 
            strokeLinecap="round"
            style={{ opacity: 0.6, marginBottom: mmToPx(2) }}
          >
            <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
            <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
            <path d="M12.91 4.1a16.07 16.07 0 0 1 0 15.8" />
            <circle cx="2" cy="12" r="2" fill={background.type === "image" ? "#ffffff" : bgConfig.accentColor} />
          </svg>
          
          {/* Tap gesture icon (phone + hand) */}
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 48 48"
            fill="none"
            stroke={background.type === "image" ? "#ffffff" : bgConfig.accentColor}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.4 }}
          >
            {/* Phone outline */}
            <rect x="14" y="4" width="20" height="40" rx="3" />
            <line x1="14" y1="10" x2="34" y2="10" />
            <line x1="14" y1="38" x2="34" y2="38" />
            {/* Tap indicator */}
            <path d="M24 24 L24 28" />
            <circle cx="24" cy="20" r="2" fill={background.type === "image" ? "#ffffff" : bgConfig.accentColor} />
          </svg>
        </div>

        {/* Powered by IWASP - bottom center, subtle */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center z-10"
          style={{ paddingBottom: mmToPx(4) }}
        >
          <span
            style={{
              fontSize: mmToPx(1.6),
              fontWeight: 400,
              letterSpacing: "0.1em",
              color: background.type === "image" ? "#ffffff" : bgConfig.accentColor,
              opacity: 0.4,
              textTransform: "uppercase",
            }}
          >
            Powered by IWASP
          </span>
        </div>
      </div>
    );
  }
);

CardBack.displayName = "CardBack";

// ============= BRAND HEADER (FRONT) =============

export interface BrandHeaderProps {
  // Logo
  logoUrl?: string;
  logoWidthMm?: number; // 36-52mm, default 45mm
  
  // Background
  background: BrandBackgroundConfig;
  
  // Card color (for solid backgrounds)
  cardColor?: PrintColor | PremiumBackgroundId;
  
  // Rendering mode
  forPrint?: boolean; // High-res 300 DPI for PDF
  
  // Optional
  showGuides?: boolean; // Show safe zones
  className?: string;
}

export const BrandHeader = forwardRef<HTMLDivElement, BrandHeaderProps>(
  (
    {
      logoUrl,
      logoWidthMm = LOGO_SIZE_CONSTRAINTS.DEFAULT_WIDTH_MM,
      background,
      cardColor,
      forPrint = false,
      showGuides = false,
      className = "",
    },
    ref
  ) => {
    // Calculate dimensions based on mode
    const scale = forPrint ? MM_TO_PX_300DPI : PREVIEW_SCALE;
    const width = forPrint
      ? CARD_DIMENSIONS.WIDTH_MM * MM_TO_PX_300DPI
      : CARD_PREVIEW_PX.WIDTH;
    const height = forPrint
      ? CARD_DIMENSIONS.HEIGHT_MM * MM_TO_PX_300DPI
      : CARD_PREVIEW_PX.HEIGHT;

    // Convert mm to current scale pixels
    const mmToPx = (mm: number) => mm * scale;

    // Clamp logo width to allowed range
    const clampedLogoWidthMm = Math.max(
      LOGO_SIZE_CONSTRAINTS.MIN_WIDTH_MM,
      Math.min(LOGO_SIZE_CONSTRAINTS.MAX_WIDTH_MM, logoWidthMm)
    );
    const logoWidthPx = mmToPx(clampedLogoWidthMm);

    // Get background color
    const bgConfig = useMemo(() => {
      if (background.type === "solid" && background.solidColorId) {
        const premiumBg = PREMIUM_BACKGROUNDS[background.solidColorId];
        return {
          hex: premiumBg.hex,
          textColor: premiumBg.textColor,
          accentColor: premiumBg.accentColor,
        };
      }
      if (cardColor && PRINT_COLORS[cardColor as PrintColor]) {
        const colorConfig = PRINT_COLORS[cardColor as PrintColor];
        return {
          hex: colorConfig.hex,
          textColor: colorConfig.textColor,
          accentColor: colorConfig.accentColor,
        };
      }
      return {
        hex: "#ffffff",
        textColor: "#0a0a0a",
        accentColor: "#6b7280",
      };
    }, [background, cardColor]);

    // Image background settings
    const imageBlur = background.type === "image" 
      ? (background.imageBlur ?? BACKGROUND_IMAGE_REQUIREMENTS.DEFAULT_BLUR)
      : 0;
    const imageOverlay = background.type === "image"
      ? (background.imageOverlay ?? BACKGROUND_IMAGE_REQUIREMENTS.DEFAULT_OVERLAY)
      : 0;

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: bgConfig.hex,
          borderRadius: forPrint ? 0 : `${mmToPx(CARD_DIMENSIONS.CORNER_RADIUS_MM)}px`,
          fontFamily: "'SF Pro Display', 'Inter', -apple-system, sans-serif",
        }}
      >
        {/* Image Background (optional) */}
        {background.type === "image" && background.imageUrl && (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${background.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: imageBlur > 0 ? `blur(${imageBlur}px)` : undefined,
                margin: imageBlur > 0 ? -imageBlur : 0,
                width: imageBlur > 0 ? `calc(100% + ${imageBlur * 2}px)` : "100%",
                height: imageBlur > 0 ? `calc(100% + ${imageBlur * 2}px)` : "100%",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${imageOverlay / 100})`,
              }}
            />
          </>
        )}

        {/* Safe zone guide (only in preview mode) */}
        {showGuides && (
          <>
            <div
              className="absolute border border-dashed border-blue-400/40 pointer-events-none z-20"
              style={{
                top: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                left: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                right: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                bottom: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
              }}
            />
            <div
              className="absolute border border-dashed border-red-400/50 pointer-events-none flex items-center justify-center z-20"
              style={{
                top: mmToPx(CARD_DIMENSIONS.NFC_ZONE.Y_MM),
                left: mmToPx(CARD_DIMENSIONS.NFC_ZONE.X_MM),
                width: mmToPx(CARD_DIMENSIONS.NFC_ZONE.WIDTH_MM),
                height: mmToPx(CARD_DIMENSIONS.NFC_ZONE.HEIGHT_MM),
              }}
            >
              <span className="text-[8px] text-red-400/70 font-medium">NFC</span>
            </div>
          </>
        )}

        {/* IWASP ))) MARK - Top right corner - LOCKED POSITION */}
        <div
          className="absolute z-20"
          style={{
            top: mmToPx(3),
            right: mmToPx(3),
          }}
        >
          <IwaspMark 
            scale={scale}
            textColor={background.type === "image" ? "#ffffff" : bgConfig.accentColor}
            forPrint={forPrint}
          />
        </div>

        {/* CLIENT LOGO - Centered, dominant visual - NO TEXT */}
        {logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <img
              src={logoUrl}
              alt="Brand Logo"
              style={{
                width: logoWidthPx,
                maxHeight: mmToPx(32),
                objectFit: "contain",
                imageRendering: forPrint ? "auto" : undefined,
              }}
            />
          </div>
        )}

        {/* Placeholder when no logo */}
        {!logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div 
              className="border-2 border-dashed rounded-xl flex items-center justify-center"
              style={{
                width: logoWidthPx,
                height: mmToPx(22),
                borderColor: bgConfig.accentColor,
                opacity: 0.25,
              }}
            >
              <span 
                style={{ 
                  color: bgConfig.accentColor,
                  fontSize: mmToPx(3),
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                YOUR LOGO
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

BrandHeader.displayName = "BrandHeader";

// ============= HELPER FUNCTIONS =============

export function validateBackgroundImage(
  width: number,
  height: number
): { valid: boolean; message?: string } {
  if (
    width < BACKGROUND_IMAGE_REQUIREMENTS.MIN_WIDTH ||
    height < BACKGROUND_IMAGE_REQUIREMENTS.MIN_HEIGHT
  ) {
    return {
      valid: false,
      message: `Image trop petite. Minimum: ${BACKGROUND_IMAGE_REQUIREMENTS.MIN_WIDTH}x${BACKGROUND_IMAGE_REQUIREMENTS.MIN_HEIGHT}px. Votre image: ${width}x${height}px`,
    };
  }
  return { valid: true };
}

export function isBackgroundPrintReady(background: BrandBackgroundConfig): boolean {
  if (background.type === "solid") {
    return !!background.solidColorId;
  }
  return !!background.imageUrl;
}
