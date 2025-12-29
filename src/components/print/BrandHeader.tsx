/**
 * BrandHeader Component
 * 
 * Core visual element for IWASP NFC cards.
 * Single source of truth for all card visuals - used for both UI preview and print PDF.
 * 
 * Features:
 * - Centered logo as dominant visual (36-52mm locked size)
 * - Premium solid or image backgrounds
 * - Fixed IWASP + NFC mark in top-right corner
 * - 1:1 screen-to-print rendering
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

// NFC + IWASP combined mark
function IwaspNfcMark({ 
  color = "currentColor", 
  size = 24,
  opacity = 0.4,
}: { 
  color?: string; 
  size?: number;
  opacity?: number;
}) {
  return (
    <div 
      className="flex flex-col items-end gap-0.5"
      style={{ opacity }}
    >
      {/* NFC waves icon */}
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      >
        <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
        <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
        <path d="M12.91 4.1a16.07 16.07 0 0 1 0 15.8" />
      </svg>
      {/* IWASP text */}
      <span 
        style={{ 
          fontSize: size * 0.35,
          fontWeight: 500,
          letterSpacing: "0.12em",
          color,
        }}
      >
        IWASP
      </span>
    </div>
  );
}

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
  showMark?: boolean; // Show IWASP + NFC mark
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
      showMark = true,
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
      // Fallback to cardColor or white
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
            {/* Background image with blur */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${background.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: imageBlur > 0 ? `blur(${imageBlur}px)` : undefined,
                // Extend slightly to cover blur edges
                margin: imageBlur > 0 ? -imageBlur : 0,
                width: imageBlur > 0 ? `calc(100% + ${imageBlur * 2}px)` : "100%",
                height: imageBlur > 0 ? `calc(100% + ${imageBlur * 2}px)` : "100%",
              }}
            />
            {/* Overlay for logo readability */}
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
            {/* Safe margin */}
            <div
              className="absolute border border-dashed border-blue-400/40 pointer-events-none z-20"
              style={{
                top: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                left: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                right: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                bottom: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
              }}
            />
            {/* NFC zone */}
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

        {/* LOGO - Centered, dominant visual element */}
        {logoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <img
              src={logoUrl}
              alt="Brand Logo"
              style={{
                width: logoWidthPx,
                maxHeight: mmToPx(32), // Max height for aspect ratio
                objectFit: "contain",
                // No cropping, no stretching
                imageRendering: forPrint ? "auto" : undefined,
              }}
            />
          </div>
        )}

        {/* Placeholder when no logo */}
        {!logoUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div 
              className="border-2 border-dashed rounded-xl flex items-center justify-center"
              style={{
                width: logoWidthPx,
                height: mmToPx(20),
                borderColor: bgConfig.accentColor,
                opacity: 0.3,
              }}
            >
              <span 
                style={{ 
                  color: bgConfig.accentColor,
                  fontSize: mmToPx(3),
                  fontWeight: 500,
                }}
              >
                VOTRE LOGO
              </span>
            </div>
          </div>
        )}

        {/* IWASP + NFC Mark - Top right corner */}
        {showMark && (
          <div
            className="absolute z-20"
            style={{
              top: mmToPx(4),
              right: mmToPx(4),
            }}
          >
            <IwaspNfcMark 
              color={background.type === "image" ? "#ffffff" : bgConfig.accentColor}
              size={mmToPx(6)}
              opacity={background.type === "image" ? 0.7 : 0.35}
            />
          </div>
        )}
      </div>
    );
  }
);

BrandHeader.displayName = "BrandHeader";

// ============= HELPER FUNCTIONS =============

/**
 * Validate background image quality
 */
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

/**
 * Check if background is valid for print
 */
export function isBackgroundPrintReady(background: BrandBackgroundConfig): boolean {
  if (background.type === "solid") {
    return !!background.solidColorId;
  }
  return !!background.imageUrl;
}
