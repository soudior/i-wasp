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
import iwaspLogo from '@/assets/iwasp-logo.png';
import iwaspLogoWhite from '@/assets/iwasp-logo-white.png';

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
    className="flex items-center justify-between p-4 group cursor-pointer transition-all duration-300"
    style={{
      borderRadius: '1.25rem',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
    }}
    whileHover={{ 
      background: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-4">
      <div 
        className="w-12 h-12 flex items-center justify-center text-emerald-400"
        style={{
          borderRadius: '0.875rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
        }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{value}</p>
      </div>
    </div>
    <div className="group-hover:text-emerald-400 transition-colors" style={{ color: 'rgba(255, 255, 255, 0.25)' }}>
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
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 pb-safe"
      style={{ 
        backgroundColor: '#050505',
        color: '#ffffff',
      }}
    >
      {/* Background Effects - Subtle Emerald Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div 
          className="absolute"
          style={{
            top: '-10%',
            left: '20%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute"
          style={{
            bottom: '-5%',
            right: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Container Principal - iPhone Pro Style */}
      <motion.div 
        className="w-full max-w-md mx-auto relative"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Outer Border Glow - Pro Device Feel */}
        <div 
          className="absolute -inset-px pointer-events-none"
          style={{
            borderRadius: '2rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, rgba(16, 185, 129, 0.1) 100%)',
          }}
        />
        
        {/* Main Card Container */}
        <div
          style={{
            borderRadius: '2rem',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Header Visual - Ambiance Forêt Noire (Eco-Luxe) */}
          <div className="relative" style={{ height: '160px' }}>
            {/* Forest gradient background */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, #0a0a0a 60%, #050505 100%)',
              }}
            />
            
            {/* I-WASP Logo - Floating Badge Top Right "IWasp )))" */}
            <div className="absolute z-10" style={{ top: '20px', right: '20px' }}>
              <div 
                className="flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '1rem',
                  padding: '0.625rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <span 
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    letterSpacing: '0.12em', 
                    color: 'rgba(255, 255, 255, 0.85)',
                    textTransform: 'uppercase',
                  }}
                >
                  IWasp
                </span>
                {/* NFC Waves Icon "))) */}
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.7)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                >
                  <path d="M2 12a5 5 0 0 1 5-5" />
                  <path d="M2 12a9 9 0 0 1 9-9" />
                  <path d="M2 12a13 13 0 0 1 13-13" />
                  <circle cx="2" cy="12" r="2" fill="rgba(255, 255, 255, 0.7)" />
                </svg>
              </div>
            </div>
            
            {/* Subtle leaf pattern overlay */}
            <div className="absolute inset-0" style={{ opacity: 0.08 }}>
              <div className="absolute" style={{ top: '48px', left: '40px', transform: 'rotate(45deg)', color: 'rgba(16, 185, 129, 0.3)' }}>
                <Leaf size={24} />
              </div>
            </div>
            
            {/* Mesh gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.12) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Profile Content */}
          <div 
            className="relative px-6 pb-8"
            style={{
              background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
            }}
          >
          
            {/* Avatar avec bague de progression/luxe */}
            <div className="relative flex justify-center mb-6" style={{ marginTop: '-64px' }}>
              <div className="relative">
                {/* Outer glow ring */}
                <div 
                  className="absolute rounded-full"
                  style={{
                    inset: '-8px',
                    background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.3) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 100%)',
                    filter: 'blur(12px)',
                  }}
                />
                
                {/* Avatar container */}
                <div 
                  className="relative flex items-center justify-center"
                  style={{
                    width: '112px',
                    height: '112px',
                    borderRadius: '50%',
                    padding: '3px',
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
                  }}
                >
                  {data.photoUrl ? (
                    <img 
                      src={data.photoUrl} 
                      alt={fullName}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div 
                      className="flex items-center justify-center"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        backgroundColor: '#0a0a0a',
                      }}
                    >
                      <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#34d399' }}>{initials}</span>
                    </div>
                  )}
                </div>

                {/* Verified badge */}
                <div 
                  className="absolute flex items-center justify-center"
                  style={{
                    bottom: '-4px',
                    right: '-4px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <ShieldCheck size={16} style={{ color: '#ffffff' }} />
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="text-center mb-6">
              <h1 
                style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 700, 
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.025em',
                }}
              >
                {fullName}
              </h1>
              <div className="flex flex-col items-center gap-1">
                {data.title && (
                  <p style={{ color: '#34d399', fontWeight: 500 }}>{data.title}</p>
                )}
                {data.company && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>{data.company}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            {data.tagline && (
              <p 
                className="text-center max-w-xs mx-auto"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.875rem', 
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}
              >
                {data.tagline}
              </p>
            )}

            {/* Location Badge */}
            {data.location && (
              <div 
                className="flex items-center justify-center gap-2"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  fontSize: '0.75rem',
                  marginBottom: '2rem',
                }}
              >
                <MapPin size={12} />
                <span>Basé à {data.location} • Opère mondialement</span>
              </div>
            )}

            {/* Primary Action Button - Apple Style */}
            <div style={{ marginBottom: '2rem' }}>
              <motion.button
                onClick={handleDownloadVCard}
                className="w-full flex items-center justify-center gap-3"
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.5)',
                }}
                whileHover={{ 
                  boxShadow: '0 15px 50px -10px rgba(16, 185, 129, 0.6)',
                }}
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

            {/* Brand Signature with I-WASP Logo */}
            <div 
              className="text-center"
              style={{
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <img 
                  src={iwaspLogo} 
                  alt="I-WASP" 
                  style={{ height: '32px', width: 'auto' }}
                />
              </div>
              <p 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.4)', 
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Digital Identity • Sustainable Tech
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div 
        className="flex items-center justify-center gap-4"
        style={{ 
          marginTop: '2rem',
          color: 'rgba(255, 255, 255, 0.3)',
          fontSize: '0.75rem',
        }}
      >
        <span className="flex items-center gap-1">
          <span 
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              animation: 'pulse 2s infinite',
            }}
          />
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
