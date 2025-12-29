/**
 * Fusion Liana x I-Wasp
 * Transition vers le luxe numérique et l'écologie.
 */

import React from 'react';
import { 
  Mail, 
  Linkedin, 
  Globe, 
  Download, 
  Instagram, 
  MapPin, 
  ShieldCheck,
  ExternalLink,
  Leaf,
  Phone,
} from 'lucide-react';
import { downloadVCard, VCardData } from '@/lib/vcard';
import { CardData, TemplateProps } from './CardTemplates';
import { motion } from 'framer-motion';

interface SocialItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

const SocialItem = ({ icon, label, value, href }: SocialItemProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-emerald-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-white/50 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-white/90 font-medium">{value}</p>
      </div>
    </div>
    <div className="text-white/30 group-hover:text-emerald-400 transition-colors">
      <ExternalLink size={16} />
    </div>
  </motion.a>
);

export function LuxuryProfile({ 
  data, 
  showWalletButtons = true,
  onShareInfo,
  cardId,
  enableLeadCapture = false,
  smartContext
}: TemplateProps) {
  const fullName = `${data.firstName} ${data.lastName}`;
  const initials = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`;
  
  const handleDownloadVCard = () => {
    const vcardData: VCardData = {
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      company: data.company,
      email: data.email,
      phone: data.phone,
      website: data.website,
      location: data.location,
      linkedin: data.linkedin,
      instagram: data.instagram,
      twitter: data.twitter,
      tagline: data.tagline,
    };
    downloadVCard(vcardData);
  };

  const getLinkedInUrl = () => {
    if (!data.linkedin) return undefined;
    if (data.linkedin.startsWith('http')) return data.linkedin;
    return `https://linkedin.com/in/${data.linkedin}`;
  };

  const getInstagramUrl = () => {
    if (!data.instagram) return undefined;
    const handle = data.instagram.replace('@', '');
    return `https://instagram.com/${handle}`;
  };

  const getWebsiteUrl = () => {
    if (!data.website) return undefined;
    if (data.website.startsWith('http')) return data.website;
    return `https://${data.website}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 pb-safe">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-[80px]" />
      </div>

      {/* Container Principal */}
      <motion.div 
        className="w-full max-w-md mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Visual - Ambiance Forêt Noire (Eco-Luxe) */}
        <div className="relative h-40 rounded-t-3xl overflow-hidden">
          {/* Forest gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#0a0a0a] to-[#050505]" />
          
          {/* Subtle leaf pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 text-emerald-500/30">
              <Leaf size={40} />
            </div>
            <div className="absolute top-12 left-10 text-emerald-600/20 rotate-45">
              <Leaf size={24} />
            </div>
          </div>
          
          {/* Mesh gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.1)_0%,_transparent_50%)]" />
        </div>

        {/* Profile Content */}
        <div className="relative bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-b-3xl px-6 pb-8 border border-white/5 border-t-0">
          
          {/* Avatar avec bague de progression/luxe */}
          <div className="relative -mt-16 flex justify-center mb-6">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-emerald-400/30 via-emerald-500/20 to-transparent blur-md" />
              
              {/* Avatar container */}
              <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600">
                {data.photoUrl ? (
                  <img 
                    src={data.photoUrl} 
                    alt={fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <span className="text-3xl font-bold text-emerald-400">{initials}</span>
                  </div>
                )}
              </div>

              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <ShieldCheck size={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {fullName}
            </h1>
            <div className="flex flex-col items-center gap-1">
              {data.title && (
                <p className="text-emerald-400 font-medium">{data.title}</p>
              )}
              {data.company && (
                <p className="text-white/60 text-sm">{data.company}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {data.tagline && (
            <p className="text-center text-white/70 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
              {data.tagline}
            </p>
          )}

          {/* Location Badge */}
          {data.location && (
            <div className="flex items-center justify-center gap-2 text-white/50 text-xs mb-8">
              <MapPin size={12} />
              <span>Basé à {data.location} • Opère mondialement</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="mb-8">
            <motion.button
              onClick={handleDownloadVCard}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 transition-all duration-300"
              whileTap={{ scale: 0.98 }}
            >
              <Download size={20} />
              Ajouter aux Contacts
            </motion.button>
          </div>

          {/* Links Grid */}
          <div className="space-y-3">
            {data.website && (
              <SocialItem 
                icon={<Globe size={20} />} 
                label="Site Officiel" 
                value={data.website}
                href={getWebsiteUrl()}
              />
            )}
            {data.email && (
              <SocialItem 
                icon={<Mail size={20} />} 
                label="Contact Direct" 
                value={data.email}
                href={`mailto:${data.email}`}
              />
            )}
            {data.phone && (
              <SocialItem 
                icon={<Phone size={20} />} 
                label="Téléphone" 
                value={data.phone}
                href={`tel:${data.phone}`}
              />
            )}
            {data.linkedin && (
              <SocialItem 
                icon={<Linkedin size={20} />} 
                label="LinkedIn" 
                value="Réseau Professionnel"
                href={getLinkedInUrl()}
              />
            )}
            {data.instagram && (
              <SocialItem 
                icon={<Instagram size={20} />} 
                label="Instagram" 
                value={data.instagram}
                href={getInstagramUrl()}
              />
            )}
          </div>

          {/* Brand Signature */}
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Leaf size={12} className="text-white" />
              </div>
              <span className="text-white/80 font-semibold tracking-wide text-sm">
                I-WASP
              </span>
            </div>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              Digital Identity • Sustainable Tech
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-4 mt-8 text-white/30 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          NFC Active
        </span>
        <span>•</span>
        <span>Paris Design</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Leaf size={10} />
          Carbon Neutral
        </span>
      </div>
    </div>
  );
}

export default LuxuryProfile;
