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

// NFC icon SVG component - minimal elegant design
function NfcIcon({ color = "currentColor", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
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
    
    const textColor = colorConfig.textColor;
    const accentColor = colorConfig.accentColor;

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

    const { typography } = templateConfig;
    const isCentered = templateConfig.centered;

    // Font family based on template
    const getFontFamily = () => {
      switch (template) {
        case "iwasp-black":
          return "'SF Pro Display', 'Inter', -apple-system, sans-serif";
        case "iwasp-pure":
          return "'SF Pro Text', 'Inter', -apple-system, sans-serif";
        case "iwasp-corporate":
          return "'SF Pro Display', 'Inter', -apple-system, sans-serif";
        default:
          return "'Inter', -apple-system, sans-serif";
      }
    };

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: colorConfig.hex,
          borderRadius: forPrint ? 0 : `${mmToPx(CARD_DIMENSIONS.CORNER_RADIUS_MM)}px`,
          fontFamily: getFontFamily(),
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
              <span className="text-[8px] text-red-400/70 font-medium">NFC</span>
            </div>
          </>
        )}

        {/* Template-specific decorative elements */}
        {template === "iwasp-black" && (
          <>
            {/* Subtle top gradient line */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: mmToPx(0.3),
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              }}
            />
          </>
        )}

        {template === "iwasp-pure" && (
          <>
            {/* Subtle bottom border accent */}
            <div
              className="absolute bottom-0 left-0"
              style={{
                width: mmToPx(25),
                height: mmToPx(0.5),
                backgroundColor: "#e5e5e5",
              }}
            />
          </>
        )}

        {template === "iwasp-corporate" && (
          <>
            {/* Corporate accent stripe */}
            <div
              className="absolute left-0 top-0 bottom-0"
              style={{
                width: mmToPx(1.5),
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            />
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
          className="absolute"
          style={{
            top: mmToPx(templateConfig.namePosition.y),
            left: isCentered ? "50%" : mmToPx(templateConfig.namePosition.x),
            transform: isCentered ? "translateX(-50%)" : undefined,
            fontSize: `${mmToPx(typography.nameSize)}px`,
            fontWeight: typography.nameFontWeight,
            color: textColor,
            letterSpacing: `${typography.nameLetterSpacing}em`,
            textAlign: isCentered ? "center" : "left",
            whiteSpace: "nowrap",
          }}
        >
          {printedName || "Votre Nom"}
        </div>

        {/* Title */}
        {(printedTitle || !printedName) && (
          <div
            className="absolute"
            style={{
              top: mmToPx(templateConfig.titlePosition.y),
              left: isCentered ? "50%" : mmToPx(templateConfig.titlePosition.x),
              transform: isCentered ? "translateX(-50%)" : undefined,
              fontSize: `${mmToPx(typography.titleSize)}px`,
              fontWeight: 400,
              color: accentColor,
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
            className="absolute"
            style={{
              top: mmToPx(templateConfig.companyPosition.y),
              left: isCentered ? "50%" : mmToPx(templateConfig.companyPosition.x),
              transform: isCentered ? "translateX(-50%)" : undefined,
              fontSize: `${mmToPx(typography.companySize)}px`,
              fontWeight: template === "iwasp-corporate" ? 500 : 400,
              color: template === "iwasp-corporate" ? textColor : accentColor,
              textAlign: isCentered ? "center" : "left",
              whiteSpace: "nowrap",
              opacity: template === "iwasp-corporate" ? 0.9 : 1,
            }}
          >
            {printedCompany || "Votre Entreprise"}
          </div>
        )}

        {/* NFC Icon */}
        {templateConfig.showNfcIcon && (
          <div
            className="absolute"
            style={{
              top: mmToPx(templateConfig.nfcIconPosition.y),
              left: isCentered ? "50%" : mmToPx(templateConfig.nfcIconPosition.x),
              transform: isCentered ? "translateX(-50%)" : undefined,
              opacity: 0.35,
            }}
          >
            <NfcIcon color={accentColor} size={mmToPx(4.5)} />
          </div>
        )}

        {/* IWASP Brand Watermark */}
        {templateConfig.showBrand && (
          <div
            className="absolute tracking-widest uppercase"
            style={{
              bottom: mmToPx(2),
              right: mmToPx(3),
              fontSize: `${mmToPx(1.4)}px`,
              fontWeight: 300,
              color: accentColor,
              opacity: 0.25,
              letterSpacing: "0.15em",
            }}
          >
            IWASP
          </div>
        )}
      </div>
    );
  }
);

PrintCardTemplate.displayName = "PrintCardTemplate";
