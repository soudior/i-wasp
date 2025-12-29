import { forwardRef } from "react";
import {
  CARD_DIMENSIONS,
  CARD_PREVIEW_PX,
  PRINT_COLORS,
  PRINT_TEMPLATES,
  PrintColor,
  PrintTemplateType,
  MM_TO_PX_300DPI,
} from "@/lib/printTypes";

interface PrintCardTemplateProps {
  printedName: string;
  printedTitle?: string;
  printedCompany?: string;
  logoUrl?: string;
  color: PrintColor;
  template: PrintTemplateType;
  showGuides?: boolean;
  forPrint?: boolean; // High-res mode for PDF export
  className?: string;
}

// NFC icon SVG component
function NfcIcon({ color = "currentColor", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
      <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
      <path d="M12.91 4.1a16.07 16.07 0 0 1 0 15.8" />
      <path d="M16.37 2a20.38 20.38 0 0 1 0 20" />
    </svg>
  );
}

export const PrintCardTemplate = forwardRef<HTMLDivElement, PrintCardTemplateProps>(
  (
    {
      printedName,
      printedTitle,
      printedCompany,
      logoUrl,
      color,
      template,
      showGuides = false,
      forPrint = false,
      className = "",
    },
    ref
  ) => {
    const colorConfig = PRINT_COLORS[color];
    const templateConfig = PRINT_TEMPLATES[template];
    const isLight = color === "white" || color === "silver" || color === "gold";
    const textColor = isLight ? "#0a0a0a" : "#fafafa";
    const mutedTextColor = isLight ? "#4a4a4a" : "#a0a0a0";

    // Dimensions based on mode
    const scale = forPrint ? MM_TO_PX_300DPI : CARD_PREVIEW_PX.WIDTH / CARD_DIMENSIONS.WIDTH_MM;
    const width = forPrint
      ? CARD_DIMENSIONS.WIDTH_MM * MM_TO_PX_300DPI
      : CARD_PREVIEW_PX.WIDTH;
    const height = forPrint
      ? CARD_DIMENSIONS.HEIGHT_MM * MM_TO_PX_300DPI
      : CARD_PREVIEW_PX.HEIGHT;

    // Convert mm to current scale pixels
    const mmToPx = (mm: number) => mm * scale;

    // Font sizes (in mm, converted to px)
    const nameFontSize = templateConfig.largeName ? 5 : 4; // mm
    const titleFontSize = 2.5; // mm
    const companyFontSize = 2.2; // mm

    const isCentered = templateConfig.centered;

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: colorConfig.hex,
          borderRadius: forPrint ? 0 : `${mmToPx(CARD_DIMENSIONS.CORNER_RADIUS_MM)}px`,
          fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
        }}
      >
        {/* Safe zone guide (only in preview mode) */}
        {showGuides && (
          <>
            {/* Safe margin */}
            <div
              className="absolute border border-dashed border-blue-400/40 pointer-events-none"
              style={{
                top: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                left: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                right: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
                bottom: mmToPx(CARD_DIMENSIONS.SAFE_MARGIN_MM),
              }}
            />
            {/* NFC zone */}
            <div
              className="absolute border border-dashed border-red-400/50 pointer-events-none flex items-center justify-center"
              style={{
                top: mmToPx(CARD_DIMENSIONS.NFC_ZONE.Y_MM),
                left: mmToPx(CARD_DIMENSIONS.NFC_ZONE.X_MM),
                width: mmToPx(CARD_DIMENSIONS.NFC_ZONE.WIDTH_MM),
                height: mmToPx(CARD_DIMENSIONS.NFC_ZONE.HEIGHT_MM),
              }}
            >
              <span className="text-[8px] text-red-400/70">NFC</span>
            </div>
          </>
        )}

        {/* Logo */}
        {logoUrl && (
          <div
            className="absolute"
            style={{
              top: mmToPx(templateConfig.logoPosition.y),
              left: isCentered ? "50%" : mmToPx(templateConfig.logoPosition.x),
              transform: isCentered ? "translateX(-50%)" : undefined,
              maxWidth: mmToPx(templateConfig.logoPosition.maxWidth),
              maxHeight: mmToPx(templateConfig.logoPosition.maxHeight),
            }}
          >
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                maxWidth: mmToPx(templateConfig.logoPosition.maxWidth),
                maxHeight: mmToPx(templateConfig.logoPosition.maxHeight),
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {/* Name */}
        <div
          className="absolute font-semibold"
          style={{
            top: mmToPx(templateConfig.namePosition.y),
            left: isCentered ? "50%" : mmToPx(templateConfig.namePosition.x),
            transform: isCentered ? "translateX(-50%)" : undefined,
            fontSize: `${mmToPx(nameFontSize)}px`,
            color: textColor,
            letterSpacing: templateConfig.largeName ? "0.05em" : "0.02em",
            textAlign: isCentered ? "center" : "left",
            whiteSpace: "nowrap",
          }}
        >
          {printedName || "Votre Nom"}
        </div>

        {/* Title */}
        {(printedTitle || !printedName) && (
          <div
            className="absolute font-normal"
            style={{
              top: mmToPx(templateConfig.titlePosition.y),
              left: isCentered ? "50%" : mmToPx(templateConfig.titlePosition.x),
              transform: isCentered ? "translateX(-50%)" : undefined,
              fontSize: `${mmToPx(titleFontSize)}px`,
              color: mutedTextColor,
              textAlign: isCentered ? "center" : "left",
              whiteSpace: "nowrap",
            }}
          >
            {printedTitle || "Votre Titre"}
          </div>
        )}

        {/* Company */}
        {(printedCompany || !printedName) && (
          <div
            className="absolute font-normal"
            style={{
              top: mmToPx(templateConfig.companyPosition.y),
              left: isCentered ? "50%" : mmToPx(templateConfig.companyPosition.x),
              transform: isCentered ? "translateX(-50%)" : undefined,
              fontSize: `${mmToPx(companyFontSize)}px`,
              color: mutedTextColor,
              textAlign: isCentered ? "center" : "left",
              whiteSpace: "nowrap",
            }}
          >
            {printedCompany || "Votre Entreprise"}
          </div>
        )}

        {/* NFC Icon */}
        <div
          className="absolute opacity-40"
          style={{
            top: mmToPx(templateConfig.nfcIconPosition.y),
            left: isCentered ? "50%" : mmToPx(templateConfig.nfcIconPosition.x),
            transform: isCentered ? "translateX(-50%)" : undefined,
          }}
        >
          <NfcIcon color={mutedTextColor} size={mmToPx(5)} />
        </div>

        {/* Subtle branding watermark */}
        <div
          className="absolute font-light tracking-widest uppercase opacity-20"
          style={{
            bottom: mmToPx(2),
            right: mmToPx(3),
            fontSize: `${mmToPx(1.5)}px`,
            color: mutedTextColor,
          }}
        >
          IWASP
        </div>
      </div>
    );
  }
);

PrintCardTemplate.displayName = "PrintCardTemplate";
