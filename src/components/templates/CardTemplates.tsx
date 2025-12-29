import { Phone, Mail, MapPin, Globe, Linkedin, Instagram, MessageCircle, Plus, Wallet, Twitter, Share2 } from "lucide-react";

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
}

export interface TemplateProps {
  data: CardData;
  showWalletButtons?: boolean;
  onShareInfo?: () => void;
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
export function ExecutiveTemplate({ data = defaultData, showWalletButtons = true, onShareInfo }: TemplateProps) {
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

          {/* Contact info */}
          <div className="space-y-2 mb-6">
            {cardData.phone && (
              <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Phone size={16} className="text-amber-400" />
                </div>
                <span className="text-sm text-slate-300">{cardData.phone}</span>
              </a>
            )}
            {cardData.email && (
              <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Mail size={16} className="text-amber-400" />
                </div>
                <span className="text-sm text-slate-300 truncate">{cardData.email}</span>
              </a>
            )}
            {cardData.location && (
              <div className="flex items-center gap-3 p-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                  <MapPin size={16} className="text-slate-500" />
                </div>
                <span className="text-sm text-slate-400">{cardData.location}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { icon: Phone, label: "Appeler" },
              { icon: Mail, label: "Email" },
              { icon: MessageCircle, label: "Message" },
              { icon: Globe, label: "Site" },
            ].map((action) => (
              <button key={action.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/30 transition-all">
                <action.icon size={18} className="text-amber-400" />
                <span className="text-xs text-slate-400">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Social */}
          <div className="flex justify-center gap-4 pb-6 border-b border-slate-700/50">
            {cardData.linkedin && (
              <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Linkedin size={18} className="text-slate-400" />
              </a>
            )}
            {cardData.instagram && (
              <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Instagram size={18} className="text-slate-400" />
              </a>
            )}
          </div>

          {/* CTA */}
          <button className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all">
            <Plus size={18} />
            Ajouter aux contacts
          </button>

          {showWalletButtons && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wallet size={16} className="text-slate-400" />
                <span className="text-xs text-slate-300">Apple</span>
              </button>
              <button className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wallet size={16} className="text-slate-400" />
                <span className="text-xs text-slate-300">Google</span>
              </button>
            </div>
          )}

          {onShareInfo && (
            <button
              onClick={onShareInfo}
              className="w-full mt-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition-all"
            >
              <Share2 size={16} />
              <span className="text-sm">Partager mes coordonnées</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Minimal Template - Clean white with subtle shadows
export function MinimalTemplate({ data = defaultData, showWalletButtons = true, onShareInfo }: TemplateProps) {
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

          {/* Simple contact list */}
          <div className="space-y-3 mb-8">
            {cardData.phone && (
              <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors">
                <Phone size={16} />
                <span className="text-sm">{cardData.phone}</span>
              </a>
            )}
            {cardData.email && (
              <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors">
                <Mail size={16} />
                <span className="text-sm truncate">{cardData.email}</span>
              </a>
            )}
            {cardData.location && (
              <div className="flex items-center gap-3 text-neutral-400">
                <MapPin size={16} />
                <span className="text-sm">{cardData.location}</span>
              </div>
            )}
            {cardData.website && (
              <a href={`https://${cardData.website}`} className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 transition-colors">
                <Globe size={16} />
                <span className="text-sm">{cardData.website}</span>
              </a>
            )}
          </div>

          {/* Social row */}
          <div className="flex justify-center gap-4 mb-8">
            {cardData.linkedin && (
              <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <Linkedin size={20} />
              </a>
            )}
            {cardData.instagram && (
              <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <Instagram size={20} />
              </a>
            )}
            {cardData.twitter && (
              <a href={`https://twitter.com/${cardData.twitter}`} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                <Twitter size={20} />
              </a>
            )}
          </div>

          {/* CTA */}
          <button className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Plus size={18} />
            Ajouter aux contacts
          </button>

          {showWalletButtons && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button className="py-2.5 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-600 transition-colors">
                <Wallet size={16} />
                <span className="text-xs">Apple</span>
              </button>
              <button className="py-2.5 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-600 transition-colors">
                <Wallet size={16} />
                <span className="text-xs">Google</span>
              </button>
            </div>
          )}

          {onShareInfo && (
            <button
              onClick={onShareInfo}
              className="w-full mt-3 py-3 border border-neutral-200 hover:border-neutral-300 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-700 transition-all"
            >
              <Share2 size={16} />
              <span className="text-sm">Partager mes coordonnées</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Modern Template - Glass effect with gradients
export function ModernTemplate({ data = defaultData, showWalletButtons = true, onShareInfo }: TemplateProps) {
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

            {/* Contact */}
            <div className="space-y-2 mb-6">
              {cardData.phone && (
                <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <Phone size={16} className="text-white" />
                  <span className="text-sm text-white/90">{cardData.phone}</span>
                </a>
              )}
              {cardData.email && (
                <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <Mail size={16} className="text-white" />
                  <span className="text-sm text-white/90 truncate">{cardData.email}</span>
                </a>
              )}
              {cardData.location && (
                <div className="flex items-center gap-3 p-2.5">
                  <MapPin size={16} className="text-white/60" />
                  <span className="text-sm text-white/60">{cardData.location}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { icon: Phone, label: "Appeler" },
                { icon: Mail, label: "Email" },
                { icon: MessageCircle, label: "Message" },
                { icon: Globe, label: "Site" },
              ].map((action) => (
                <button key={action.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all">
                  <action.icon size={18} className="text-white" />
                  <span className="text-xs text-white/70">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Social */}
            <div className="flex justify-center gap-4 pb-6 border-b border-white/10">
              {cardData.linkedin && (
                <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Linkedin size={18} className="text-white" />
                </a>
              )}
              {cardData.instagram && (
                <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <Instagram size={18} className="text-white" />
                </a>
              )}
            </div>

            {/* CTA */}
            <button className="w-full mt-6 py-3.5 bg-white hover:bg-white/90 text-purple-600 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-xl">
              <Plus size={18} />
              Ajouter aux contacts
            </button>

            {showWalletButtons && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Wallet size={16} className="text-white" />
                  <span className="text-xs text-white">Apple</span>
                </button>
                <button className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Wallet size={16} className="text-white" />
                  <span className="text-xs text-white">Google</span>
                </button>
              </div>
            )}

            {onShareInfo && (
              <button
                onClick={onShareInfo}
                className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all"
              >
                <Share2 size={16} />
                <span className="text-sm">Partager mes coordonnées</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Creative Template - Asymmetric layout with bold colors
export function CreativeTemplate({ data = defaultData, showWalletButtons = true, onShareInfo }: TemplateProps) {
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

          {/* Contact strips */}
          <div className="space-y-2 mb-6">
            {cardData.phone && (
              <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors">
                <Phone size={18} className="text-rose-400" />
                <span className="text-sm text-stone-200">{cardData.phone}</span>
              </a>
            )}
            {cardData.email && (
              <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors">
                <Mail size={18} className="text-orange-400" />
                <span className="text-sm text-stone-200 truncate">{cardData.email}</span>
              </a>
            )}
          </div>

          {/* Social row */}
          <div className="flex gap-3 mb-6">
            {cardData.linkedin && (
              <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center transition-colors">
                <Linkedin size={20} className="text-stone-400" />
              </a>
            )}
            {cardData.instagram && (
              <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center transition-colors">
                <Instagram size={20} className="text-stone-400" />
              </a>
            )}
            {cardData.website && (
              <a href={`https://${cardData.website}`} className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center transition-colors">
                <Globe size={20} className="text-stone-400" />
              </a>
            )}
          </div>

          {/* CTA */}
          <button className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all">
            <Plus size={18} />
            Ajouter aux contacts
          </button>

          {showWalletButtons && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="py-2.5 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wallet size={16} className="text-stone-400" />
                <span className="text-xs text-stone-300">Apple</span>
              </button>
              <button className="py-2.5 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wallet size={16} className="text-stone-400" />
                <span className="text-xs text-stone-300">Google</span>
              </button>
            </div>
          )}

          {onShareInfo && (
            <button
              onClick={onShareInfo}
              className="w-full mt-4 py-3 bg-stone-800/50 hover:bg-stone-700/50 border border-stone-700/50 rounded-xl flex items-center justify-center gap-2 text-stone-400 hover:text-stone-200 transition-all"
            >
              <Share2 size={16} />
              <span className="text-sm">Partager mes coordonnées</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Tech Template - Cyberpunk with neon accents
export function TechTemplate({ data = defaultData, showWalletButtons = true, onShareInfo }: TemplateProps) {
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

          {/* Data entries */}
          <div className="space-y-2 mb-6">
            {cardData.phone && (
              <a href={`tel:${cardData.phone}`} className="flex items-center gap-3 p-2 rounded bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 transition-colors">
                <Phone size={14} className="text-cyan-500" />
                <span className="text-xs font-mono text-gray-300">{cardData.phone}</span>
              </a>
            )}
            {cardData.email && (
              <a href={`mailto:${cardData.email}`} className="flex items-center gap-3 p-2 rounded bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 transition-colors">
                <Mail size={14} className="text-cyan-500" />
                <span className="text-xs font-mono text-gray-300 truncate">{cardData.email}</span>
              </a>
            )}
            {cardData.location && (
              <div className="flex items-center gap-3 p-2 rounded bg-gray-900/50 border border-gray-800">
                <MapPin size={14} className="text-gray-600" />
                <span className="text-xs font-mono text-gray-500">{cardData.location}</span>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { icon: Phone },
              { icon: Mail },
              { icon: MessageCircle },
              { icon: Globe },
            ].map((action, i) => (
              <button key={i} className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-cyan-500/50 rounded transition-all">
                <action.icon size={16} className="mx-auto text-cyan-500" />
              </button>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-2 mb-6">
            {cardData.linkedin && (
              <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-center gap-2 transition-colors">
                <Linkedin size={14} className="text-gray-500" />
                <span className="text-xs font-mono text-gray-500">LinkedIn</span>
              </a>
            )}
            {cardData.instagram && (
              <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-center gap-2 transition-colors">
                <Instagram size={14} className="text-gray-500" />
                <span className="text-xs font-mono text-gray-500">IG</span>
              </a>
            )}
          </div>

          {/* CTA */}
          <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-mono font-bold rounded flex items-center justify-center gap-2 transition-colors">
            <Plus size={16} />
            CONNECT
          </button>

          {showWalletButtons && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-center gap-2 transition-colors">
                <Wallet size={14} className="text-gray-500" />
                <span className="text-xs font-mono text-gray-400">Apple</span>
              </button>
              <button className="py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded flex items-center justify-center gap-2 transition-colors">
                <Wallet size={14} className="text-gray-500" />
                <span className="text-xs font-mono text-gray-400">Google</span>
              </button>
            </div>
          )}

          {onShareInfo && (
            <button
              onClick={onShareInfo}
              className="w-full mt-3 py-2.5 bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 rounded flex items-center justify-center gap-2 text-gray-500 hover:text-cyan-400 transition-all"
            >
              <Share2 size={14} />
              <span className="text-xs font-mono">SHARE_INFO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Luxe Template - Premium with rich textures
export function LuxeTemplate({ data = defaultData, showWalletButtons = true, onShareInfo }: TemplateProps) {
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

          {/* Contact */}
          <div className="space-y-4 mb-8">
            {cardData.phone && (
              <a href={`tel:${cardData.phone}`} className="flex items-center justify-center gap-3 text-amber-100/70 hover:text-amber-100 transition-colors">
                <Phone size={16} className="text-amber-500/70" />
                <span className="text-sm tracking-wide">{cardData.phone}</span>
              </a>
            )}
            {cardData.email && (
              <a href={`mailto:${cardData.email}`} className="flex items-center justify-center gap-3 text-amber-100/70 hover:text-amber-100 transition-colors">
                <Mail size={16} className="text-amber-500/70" />
                <span className="text-sm tracking-wide">{cardData.email}</span>
              </a>
            )}
            {cardData.location && (
              <div className="flex items-center justify-center gap-3 text-amber-100/40">
                <MapPin size={16} className="text-amber-500/40" />
                <span className="text-sm tracking-wide">{cardData.location}</span>
              </div>
            )}
          </div>

          {/* Social */}
          <div className="flex justify-center gap-4 mb-8">
            {cardData.linkedin && (
              <a href={`https://linkedin.com/in/${cardData.linkedin}`} className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                <Linkedin size={18} className="text-amber-500/70" />
              </a>
            )}
            {cardData.instagram && (
              <a href={`https://instagram.com/${cardData.instagram?.replace('@', '')}`} className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                <Instagram size={18} className="text-amber-500/70" />
              </a>
            )}
            {cardData.website && (
              <a href={`https://${cardData.website}`} className="w-10 h-10 rounded-full bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                <Globe size={18} className="text-amber-500/70" />
              </a>
            )}
          </div>

          {/* CTA */}
          <button className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:via-amber-400 hover:to-amber-500 text-amber-950 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20">
            <Plus size={18} />
            Ajouter aux contacts
          </button>

          {showWalletButtons && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wallet size={16} className="text-amber-500/70" />
                <span className="text-xs text-amber-100/60">Apple</span>
              </button>
              <button className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wallet size={16} className="text-amber-500/70" />
                <span className="text-xs text-amber-100/60">Google</span>
              </button>
            </div>
          )}

          {onShareInfo && (
            <button
              onClick={onShareInfo}
              className="w-full mt-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl flex items-center justify-center gap-2 text-amber-100/50 hover:text-amber-100/80 transition-all"
            >
              <Share2 size={16} />
              <span className="text-sm">Partager mes coordonnées</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Template selector component
export type TemplateType = "executive" | "minimal" | "modern" | "creative" | "tech" | "luxe" | "default";

export function getTemplateComponent(template: TemplateType) {
  switch (template) {
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
      return ExecutiveTemplate;
  }
}

export const templateInfo = [
  { id: "executive", name: "Executive", description: "Design premium pour dirigeants" },
  { id: "minimal", name: "Minimal", description: "Élégance épurée et sobre" },
  { id: "modern", name: "Modern", description: "Effet verre avec dégradés" },
  { id: "creative", name: "Creative", description: "Layout audacieux et coloré" },
  { id: "tech", name: "Tech", description: "Style cyberpunk futuriste" },
  { id: "luxe", name: "Luxe", description: "Raffinement ultime" },
] as const;
