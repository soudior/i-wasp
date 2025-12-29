import { CardActionButtons } from "./CardActions";
import { ActionsList } from "./ActionsList";
import { SocialLink } from "@/lib/socialNetworks";

export interface CardData {
  firstName?: string;
  lastName?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
  photo?: string;
  photoUrl?: string | null;
  logoUrl?: string | null;
  socialLinks?: SocialLink[];
}

export interface TemplateProps {
  data: CardData;
  showWalletButtons?: boolean;
  onShareInfo?: () => void;
  cardId?: string; // For lead capture on public cards
  enableLeadCapture?: boolean;
}

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

// Executive Template - Premium dark with gold accents
export function ExecutiveTemplate({ data = defaultData, showWalletButtons = true, onShareInfo, cardId, enableLeadCapture }: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/20 shadow-2xl shadow-amber-500/5">
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-amber-500/30">
                {photoSrc ? (
                  <img src={photoSrc} alt={cardData.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-900/50 to-amber-950/50 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-amber-400">
                      {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
              </div>
            </div>
            
            <div className="flex-1">
              {cardData.logoUrl && (
                <img src={cardData.logoUrl} alt="Logo" className="h-5 w-auto mb-2 opacity-70" />
              )}
              <h2 className="text-xl font-bold text-white">
                {cardData.firstName} {cardData.lastName}
              </h2>
              <p className="text-sm text-amber-400 mt-0.5">{cardData.title}</p>
              <p className="text-sm text-slate-400">{cardData.company}</p>
            </div>
          </div>

          {cardData.tagline && (
            <div className="mb-6 pl-4 border-l-2 border-amber-500/50">
              <p className="text-sm text-slate-300 italic">"{cardData.tagline}"</p>
            </div>
          )}

          {/* Actions list with labels - Apple style */}
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

          {/* CTA Buttons */}
          <div className="mt-6">
            <CardActionButtons 
              data={cardData} 
              showWalletButtons={showWalletButtons} 
              onShareInfo={onShareInfo}
              variant="dark"
              cardId={cardId}
              enableLeadCapture={enableLeadCapture}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Template - Clean white with subtle shadows
export function MinimalTemplate({ data = defaultData, showWalletButtons = true, onShareInfo, cardId, enableLeadCapture }: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-xl shadow-neutral-200/50">
        <div className="p-8">
          {/* Centered header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-neutral-100 mb-4">
              {photoSrc ? (
                <img src={photoSrc} alt={cardData.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                  <span className="text-2xl font-medium text-neutral-400">
                    {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {cardData.logoUrl && (
              <img src={cardData.logoUrl} alt="Logo" className="h-4 w-auto mx-auto mb-2 opacity-50" />
            )}
            <h2 className="text-xl font-medium text-neutral-900">
              {cardData.firstName} {cardData.lastName}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">{cardData.title}</p>
            <p className="text-xs text-neutral-400">{cardData.company}</p>
          </div>

          {cardData.tagline && (
            <p className="text-center text-sm text-neutral-500 mb-8 italic">
              {cardData.tagline}
            </p>
          )}

          {/* Actions list with labels - Apple style */}
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
            className="mb-8"
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
      </div>
    </div>
  );
}

// Modern Template - Glass effect with gradients
export function ModernTemplate({ data = defaultData, showWalletButtons = true, onShareInfo, cardId, enableLeadCapture }: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-3xl overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        {/* Glass overlay */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl m-1">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start gap-5 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-xl">
                  {photoSrc ? (
                    <img src={photoSrc} alt={cardData.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-white">
                        {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                </div>
              </div>
              
              <div className="flex-1">
                {cardData.logoUrl && (
                  <img src={cardData.logoUrl} alt="Logo" className="h-5 w-auto mb-2 brightness-200" />
                )}
                <h2 className="text-xl font-bold text-white">
                  {cardData.firstName} {cardData.lastName}
                </h2>
                <p className="text-sm text-white/80 mt-0.5">{cardData.title}</p>
                <p className="text-sm text-white/60">{cardData.company}</p>
              </div>
            </div>

            {cardData.tagline && (
              <div className="mb-6 pl-4 border-l-2 border-white/30">
                <p className="text-sm text-white/70 italic">"{cardData.tagline}"</p>
              </div>
            )}

            {/* Actions list with labels - Apple style */}
            <ActionsList
              phone={cardData.phone}
              email={cardData.email}
              location={cardData.location}
              website={cardData.website}
              linkedin={cardData.linkedin}
              instagram={cardData.instagram}
              twitter={cardData.twitter}
              socialLinks={cardData.socialLinks}
              variant="glass"
              className="mb-6"
            />

            {/* CTA Buttons */}
            <div className="mt-6">
              <CardActionButtons 
                data={cardData} 
                showWalletButtons={showWalletButtons} 
                onShareInfo={onShareInfo}
                variant="glass"
                cardId={cardId}
                enableLeadCapture={enableLeadCapture}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Creative Template - Asymmetric layout with bold colors
export function CreativeTemplate({ data = defaultData, showWalletButtons = true, onShareInfo, cardId, enableLeadCapture }: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-rose-500/20">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative p-8">
          {/* Large photo */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 ring-1 ring-rose-500/20">
            {photoSrc ? (
              <img src={photoSrc} alt={cardData.firstName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-rose-900/50 to-orange-900/50 flex items-center justify-center">
                <span className="text-6xl font-bold text-rose-400">
                  {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                </span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
            {/* Name on image */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white">
                {cardData.firstName} {cardData.lastName}
              </h2>
              <p className="text-rose-400">{cardData.title}</p>
            </div>
          </div>

          {/* Company & tagline */}
          <div className="mb-6">
            {cardData.logoUrl && (
              <img src={cardData.logoUrl} alt="Logo" className="h-6 w-auto mb-2" />
            )}
            <p className="text-stone-400 text-sm">{cardData.company}</p>
            {cardData.tagline && (
              <p className="text-stone-500 text-sm italic mt-2">"{cardData.tagline}"</p>
            )}
          </div>

          {/* Actions list with labels - Apple style */}
          <ActionsList
            phone={cardData.phone}
            email={cardData.email}
            location={cardData.location}
            website={cardData.website}
            linkedin={cardData.linkedin}
            instagram={cardData.instagram}
            twitter={cardData.twitter}
            socialLinks={cardData.socialLinks}
            variant="rose"
            className="mb-6"
          />

          {/* CTA Buttons */}
          <CardActionButtons 
            data={cardData} 
            showWalletButtons={showWalletButtons} 
            onShareInfo={onShareInfo}
            variant="rose"
            cardId={cardId}
            enableLeadCapture={enableLeadCapture}
          />
        </div>
      </div>
    </div>
  );
}

// Tech Template - Cyberpunk with neon accents
export function TechTemplate({ data = defaultData, showWalletButtons = true, onShareInfo, cardId, enableLeadCapture }: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-2xl overflow-hidden bg-gray-950 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        {/* Scan lines effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)]" />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500" />
        
        <div className="relative p-6">
          {/* Status bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs font-mono text-cyan-500">ONLINE</span>
            </div>
            <span className="text-xs font-mono text-gray-500">ID: {cardData.firstName?.slice(0, 3).toUpperCase()}-{Math.random().toString(36).slice(2, 6).toUpperCase()}</span>
          </div>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-cyan-500/50">
                {photoSrc ? (
                  <img src={photoSrc} alt={cardData.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <span className="text-xl font-mono text-cyan-500">
                      {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              {cardData.logoUrl && (
                <img src={cardData.logoUrl} alt="Logo" className="h-4 w-auto mb-1 opacity-70" />
              )}
              <h2 className="text-lg font-mono font-bold text-white">
                {cardData.firstName} {cardData.lastName}
              </h2>
              <p className="text-sm font-mono text-cyan-400">{cardData.title}</p>
              <p className="text-xs font-mono text-gray-500">{cardData.company}</p>
            </div>
          </div>

          {cardData.tagline && (
            <div className="mb-6 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <p className="text-xs font-mono text-cyan-400/80">// {cardData.tagline}</p>
            </div>
          )}

          {/* Actions list with labels - Tech style */}
          <ActionsList
            phone={cardData.phone}
            email={cardData.email}
            location={cardData.location}
            website={cardData.website}
            linkedin={cardData.linkedin}
            instagram={cardData.instagram}
            twitter={cardData.twitter}
            socialLinks={cardData.socialLinks}
            variant="tech"
            className="mb-6"
          />

          {/* CTA Buttons */}
          <CardActionButtons 
            data={cardData} 
            showWalletButtons={showWalletButtons} 
            onShareInfo={onShareInfo}
            variant="tech"
            cardId={cardId}
            enableLeadCapture={enableLeadCapture}
          />
        </div>
      </div>
    </div>
  );
}

// Luxe Template - Premium with rich textures
export function LuxeTemplate({ data = defaultData, showWalletButtons = true, onShareInfo, cardId, enableLeadCapture }: TemplateProps) {
  const cardData = { ...defaultData, ...data };
  const photoSrc = cardData.photoUrl || cardData.photo;

  return (
    <div className="w-full max-w-sm mx-auto animate-card-enter">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-950 via-stone-950 to-amber-950">
        {/* Gold pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_70%)]" />
        
        {/* Decorative border */}
        <div className="absolute inset-2 rounded-2xl border border-amber-500/20" />
        
        <div className="relative p-10">
          {/* Monogram */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-amber-500/30 shadow-2xl shadow-amber-500/20">
                {photoSrc ? (
                  <img src={photoSrc} alt={cardData.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-800/50 to-amber-950/50 flex items-center justify-center">
                    <span className="text-3xl font-serif text-amber-400">
                      {cardData.firstName?.charAt(0)}{cardData.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {cardData.logoUrl && (
              <img src={cardData.logoUrl} alt="Logo" className="h-5 w-auto mx-auto mb-3 opacity-60" />
            )}
            <h2 className="text-2xl font-serif text-amber-100">
              {cardData.firstName} {cardData.lastName}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              <p className="text-sm text-amber-400/80 tracking-widest uppercase">{cardData.title}</p>
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>
            <p className="text-sm text-amber-100/40 mt-1">{cardData.company}</p>
          </div>

          {cardData.tagline && (
            <p className="text-center text-sm text-amber-100/50 italic mb-8 font-serif">
              "{cardData.tagline}"
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="w-2 h-2 rotate-45 bg-amber-500/30" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          </div>

          {/* Actions list with labels - Luxe style */}
          <ActionsList
            phone={cardData.phone}
            email={cardData.email}
            location={cardData.location}
            website={cardData.website}
            linkedin={cardData.linkedin}
            instagram={cardData.instagram}
            twitter={cardData.twitter}
            socialLinks={cardData.socialLinks}
            variant="amber"
            className="mb-8"
          />

          {/* CTA Buttons */}
          <CardActionButtons 
            data={cardData} 
            showWalletButtons={showWalletButtons} 
            onShareInfo={onShareInfo}
            variant="amber"
            cardId={cardId}
            enableLeadCapture={enableLeadCapture}
          />
        </div>
      </div>
    </div>
  );
}

// Import IWASP Signature templates
import { IWASPSignatureTemplate, IWASPSignatureLightTemplate } from "./IWASPSignatureTemplate";

// Template selector component
export type TemplateType = "signature" | "signature-light" | "executive" | "minimal" | "modern" | "creative" | "tech" | "luxe" | "default";

export function getTemplateComponent(template: TemplateType) {
  switch (template) {
    case "signature":
      return IWASPSignatureTemplate;
    case "signature-light":
      return IWASPSignatureLightTemplate;
    case "executive":
      return ExecutiveTemplate;
    case "minimal":
      return MinimalTemplate;
    case "modern":
      return ModernTemplate;
    case "creative":
      return CreativeTemplate;
    case "tech":
      return TechTemplate;
    case "luxe":
      return LuxeTemplate;
    default:
      return IWASPSignatureTemplate; // IWASP Signature is the DEFAULT
  }
}

export const templateInfo = [
  { id: "signature", name: "IWASP Signature", description: "Template officielle IWASP - Recommandée" },
  { id: "signature-light", name: "IWASP Signature Light", description: "Variante claire de la Signature" },
  { id: "executive", name: "Série Business", description: "Pour les dirigeants et cadres" },
  { id: "minimal", name: "Série Essential", description: "Élégance épurée" },
  { id: "modern", name: "Série Contemporary", description: "Design intemporel" },
  { id: "creative", name: "Creative", description: "Layout audacieux" },
  { id: "tech", name: "Tech", description: "Style futuriste" },
  { id: "luxe", name: "Luxe", description: "Raffinement ultime" },
] as const;
