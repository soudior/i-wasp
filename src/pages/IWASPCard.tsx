/**
 * IWASP Premium NFC Digital Business Card
 * Mobile-only, minimal, powerful
 * 
 * Background: #0E0E11 (deep black)
 * Card: #16161D (anthracite)
 * Accent: #FFD400 (electric yellow)
 */

import { Suspense, lazy } from 'react';
import { Phone, Mail, Linkedin, MessageCircle, Download } from 'lucide-react';
import { downloadVCard, VCardData } from '@/lib/vcard';
import iwaspLogo from '@/assets/iwasp-logo.png';

// Lazy load Spline for performance
const Spline = lazy(() => import('@splinetool/react-spline'));

// Contact data
const contact = {
  firstName: "Alexandre",
  lastName: "Dubois",
  role: "Founder & CEO",
  company: "IWASP",
  phone: "+33 6 12 34 56 78",
  email: "contact@iwasp.com",
  linkedin: "alexandre-dubois-iwasp",
  whatsapp: "+33612345678",
  photoUrl: "",
};

// Action button component - thumb-friendly
function ActionButton({ 
  icon: Icon, 
  label, 
  onClick,
  isPrimary = false
}: { 
  icon: typeof Phone; 
  label: string; 
  onClick: () => void;
  isPrimary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-3 
        py-[18px] rounded-2xl font-medium text-[15px]
        transition-all duration-200 ease-out
        active:scale-[0.97] active:opacity-80
        ${isPrimary 
          ? "bg-[#FFD400] text-[#0E0E11]" 
          : "bg-[#1E1E26] text-white/90 border border-white/[0.06]"
        }
      `}
    >
      <Icon size={20} strokeWidth={1.5} />
      <span>{label}</span>
    </button>
  );
}

export default function IWASPCard() {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;

  const handleCall = () => window.location.href = `tel:${contact.phone}`;
  const handleEmail = () => window.location.href = `mailto:${contact.email}`;
  const handleLinkedIn = () => window.open(`https://linkedin.com/in/${contact.linkedin}`, '_blank');
  const handleWhatsApp = () => {
    const num = contact.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${num}`, '_blank');
  };
  const handleAddContact = () => {
    const vcardData: VCardData = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.role,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      linkedin: contact.linkedin,
    };
    downloadVCard(vcardData);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-5 py-10 relative overflow-hidden"
      style={{ backgroundColor: '#0E0E11' }}
    >
      {/* 3D Robot Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Suspense fallback={null}>
          <Spline 
            scene="https://prod.spline.design/c7ea7d61-b5c3-46cf-87e6-76f0be0349bf/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
        {/* Overlay to keep robot subtle */}
        <div className="absolute inset-0 bg-[#0E0E11]/60" />
      </div>

      {/* Card */}
      <div 
        className="relative w-full max-w-[360px] rounded-[28px] overflow-hidden z-10"
        style={{ 
          backgroundColor: '#16161D',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7)'
        }}
      >
        {/* Yellow accent line */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-[#FFD400]/40" />

        <div className="px-7 pt-7 pb-8">
          {/* Logo - top right */}
          <div className="flex justify-end mb-6">
            <img 
              src={iwaspLogo} 
              alt="IWASP" 
              className="h-7 w-auto opacity-70"
            />
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center mb-5">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: contact.photoUrl ? 'transparent' : '#0E0E11',
                backgroundImage: contact.photoUrl ? `url(${contact.photoUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 0 3px #FFD400'
              }}
            >
              {!contact.photoUrl && (
                <span className="text-2xl font-bold text-[#FFD400]">{initials}</span>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-8">
            <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">
              {fullName}
            </h1>
            <p className="text-white/50 text-[14px] mb-1">
              {contact.role}
            </p>
            <p className="text-[#FFD400]/60 text-[11px] font-medium tracking-[0.15em] uppercase">
              {contact.company}
            </p>
          </div>

          {/* Action Buttons - Stacked */}
          <div className="space-y-3">
            <ActionButton icon={Phone} label="Appeler" onClick={handleCall} />
            <ActionButton icon={Mail} label="Email" onClick={handleEmail} />
            <ActionButton icon={Linkedin} label="LinkedIn" onClick={handleLinkedIn} />
            <ActionButton icon={MessageCircle} label="WhatsApp" onClick={handleWhatsApp} />
            <ActionButton icon={Download} label="Ajouter aux contacts" onClick={handleAddContact} isPrimary />
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 border-t border-white/[0.04]">
          <p className="text-center text-[9px] text-white/20 tracking-[0.2em] uppercase">
            Powered by IWASP
          </p>
        </div>
      </div>

      {/* Ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,212,0,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
    </div>
  );
}
