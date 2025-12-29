/**
 * IWASP Base Signature Template
 * Screen = Print | Zero compromise.
 * 
 * This is the OFFICIAL base template for all IWASP NFC cards.
 * The IWASP logo is ALWAYS positioned top-right and CANNOT be modified by clients.
 */

import { IWASPLogoSimple } from "@/components/IWASPLogo";
import { CardActionButtons } from "./CardActions";
import { ActionsList } from "./ActionsList";
import { CardData, TemplateProps } from "./CardTemplates";

const defaultData: CardData = {
  firstName: "Alexandre",
  lastName: "Dubois",
  title: "Directeur Général",
  company: "Prestige Corp",
  email: "a.dubois@prestige.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  website: "prestige-corp.com",
  linkedin: "alexandre-dubois",
  instagram: "@adubois",
  tagline: "L'excellence en toute simplicité",
};

export function IWASPSignatureTemplate({ 
  data = defaultData, 
  showWalletButtons = true, 
  onShareInfo, 
  cardId, 
  enableLeadCapture 
}: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      {/* Card container - Deep black, luxury minimal */}
      <div className="relative rounded-3xl overflow-hidden bg-[hsl(0,0%,4%)] border border-foreground/5">
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="p-8 pb-6">
          {/* HEADER - IWASP Logo ALWAYS top-right (LOCKED) */}
          <div className="flex items-start justify-between mb-8">
            {/* Client logo or monogram - Left side */}
            <div className="flex-1">
              {cardData.logoUrl ? (
                <img 
                  src={cardData.logoUrl} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain opacity-90" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground/40">
                    {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* IWASP Logo - ALWAYS TOP RIGHT - FIXED POSITION */}
            <IWASPLogoSimple 
              variant="dark" 
              size="sm" 
              className="opacity-40 flex-shrink-0"
            />
          </div>

          {/* IDENTITY SECTION - Clean, luxe typography */}
          <div className="mb-8">
            {/* Photo (optional) */}
            {photoSrc && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 ring-1 ring-foreground/10">
                <img 
                  src={photoSrc} 
                  alt={cardData.firstName} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            {/* Name - Large, elegant */}
            <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight mb-1">
              {cardData.firstName} {cardData.lastName}
            </h1>
            
            {/* Title */}
            {cardData.title && (
              <p className="text-foreground/60 text-sm font-light tracking-wide mb-0.5">
                {cardData.title}
              </p>
            )}
            
            {/* Company */}
            {cardData.company && (
              <p className="text-foreground/40 text-sm font-light tracking-wide">
                {cardData.company}
              </p>
            )}
            
            {/* Tagline - Optional, subtle */}
            {cardData.tagline && (
              <p className="text-foreground/30 text-sm font-light italic mt-4 pl-4 border-l border-foreground/10">
                "{cardData.tagline}"
              </p>
            )}
          </div>

          {/* ACTIONS - Priority hierarchy */}
          <ActionsList
            phone={cardData.phone}
            email={cardData.email}
            location={cardData.location}
            website={cardData.website}
            linkedin={cardData.linkedin}
            instagram={cardData.instagram}
            twitter={cardData.twitter}
            socialLinks={cardData.socialLinks}
            variant="dark"
            className="mb-6"
          />

          {/* CTA Buttons - Add to contacts primary */}
          <CardActionButtons 
            data={cardData} 
            showWalletButtons={showWalletButtons} 
            onShareInfo={onShareInfo}
            variant="dark"
            cardId={cardId}
            enableLeadCapture={enableLeadCapture}
          />
        </div>

        {/* Footer - Powered by IWASP */}
        <div className="border-t border-foreground/5 py-4 text-center">
          <p className="text-[10px] text-foreground/20 tracking-widest uppercase">
            Powered by IWASP
          </p>
        </div>

        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
      </div>
    </div>
  );
}

/**
 * Light variant of the Signature template
 */
export function IWASPSignatureLightTemplate({ 
  data = defaultData, 
  showWalletButtons = true, 
  onShareInfo, 
  cardId, 
  enableLeadCapture 
}: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      {/* Card container - Off-white, luxury minimal */}
      <div className="relative rounded-3xl overflow-hidden bg-[hsl(0,0%,98%)] border border-neutral-200">
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        
        <div className="p-8 pb-6">
          {/* HEADER - IWASP Logo ALWAYS top-right (LOCKED) */}
          <div className="flex items-start justify-between mb-8">
            {/* Client logo or monogram - Left side */}
            <div className="flex-1">
              {cardData.logoUrl ? (
                <img 
                  src={cardData.logoUrl} 
                  alt="Logo" 
                  className="h-10 w-auto object-contain" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center bg-neutral-50">
                  <span className="text-sm font-medium text-neutral-400">
                    {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* IWASP Logo - ALWAYS TOP RIGHT - FIXED POSITION */}
            <div className="flex items-center gap-1.5 text-neutral-400 opacity-50 flex-shrink-0">
              <span className="text-[8px] font-semibold tracking-[0.15em] uppercase">IWasp</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round"
              >
                <path d="M2 12a5 5 0 0 1 5-5" />
                <path d="M2 12a9 9 0 0 1 9-9" />
                <path d="M2 12a13 13 0 0 1 13-13" />
                <circle cx="2" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* IDENTITY SECTION */}
          <div className="mb-8">
            {photoSrc && (
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 ring-1 ring-neutral-200">
                <img 
                  src={photoSrc} 
                  alt={cardData.firstName} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}

            <h1 className="font-display text-2xl font-semibold text-neutral-900 tracking-tight mb-1">
              {cardData.firstName} {cardData.lastName}
            </h1>
            
            {cardData.title && (
              <p className="text-neutral-500 text-sm font-light tracking-wide mb-0.5">
                {cardData.title}
              </p>
            )}
            
            {cardData.company && (
              <p className="text-neutral-400 text-sm font-light tracking-wide">
                {cardData.company}
              </p>
            )}
            
            {cardData.tagline && (
              <p className="text-neutral-400 text-sm font-light italic mt-4 pl-4 border-l border-neutral-200">
                "{cardData.tagline}"
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <ActionsList
            phone={cardData.phone}
            email={cardData.email}
            location={cardData.location}
            website={cardData.website}
            linkedin={cardData.linkedin}
            instagram={cardData.instagram}
            twitter={cardData.twitter}
            socialLinks={cardData.socialLinks}
            variant="light"
            className="mb-6"
          />

          {/* CTA Buttons */}
          <CardActionButtons 
            data={cardData} 
            showWalletButtons={showWalletButtons} 
            onShareInfo={onShareInfo}
            variant="light"
            cardId={cardId}
            enableLeadCapture={enableLeadCapture}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 py-4 text-center">
          <p className="text-[10px] text-neutral-300 tracking-widest uppercase">
            Powered by IWASP
          </p>
        </div>
      </div>
    </div>
  );
}
