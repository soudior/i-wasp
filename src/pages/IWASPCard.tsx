/**
 * IWASP Premium NFC Digital Business Card
 * 
 * Style: Dark, minimal, powerful
 * Background: #0E0E11 (deep black)
 * Card: #16161D (anthracite)
 * Accent: #FFD400 (electric yellow)
 */

import { Suspense, lazy } from 'react';
import { Phone, Mail, Linkedin, MessageCircle, Download, User } from 'lucide-react';
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
  photoUrl: "", // Will show initials if empty
};

// Action button component
function ActionButton({ 
  icon: Icon, 
  label, 
  onClick,
  variant = "default"
}: { 
  icon: typeof Phone; 
  label: string; 
  onClick: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-6 py-4 rounded-2xl
        transition-all duration-300 ease-out
        active:scale-[0.98]
        ${variant === "primary" 
          ? "bg-[#FFD400] text-black hover:bg-[#FFD400]/90" 
          : "bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/[0.06]"
        }
      `}
    >
      <Icon size={20} strokeWidth={1.5} />
      <span className="font-medium text-[15px]">{label}</span>
    </button>
  );
}

export default function IWASPCard() {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;

  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contact.email}`;
  };

  const handleLinkedIn = () => {
    window.open(`https://linkedin.com/in/${contact.linkedin}`, '_blank');
  };

  const handleWhatsApp = () => {
    const cleanNumber = contact.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#0E0E11' }}
    >
      {/* 3D Robot Background - Spline */}
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <div className="absolute inset-0 opacity-30">
            <Spline 
              scene="https://prod.spline.design/c7ea7d61-b5c3-46cf-87e6-76f0be0349bf/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Suspense>
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E11] via-transparent to-[#0E0E11]/80" />
      </div>

      {/* Card Container */}
      <div 
        className="relative w-full max-w-sm mx-auto rounded-[2rem] overflow-hidden"
        style={{ 
          backgroundColor: '#16161D',
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)'
        }}
      >
        {/* Top gradient line accent */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #FFD400, transparent)' }}
        />

        <div className="p-8">
          {/* Header: Logo top-right */}
          <div className="flex justify-end mb-8">
            <img 
              src={iwaspLogo} 
              alt="IWASP" 
              className="h-8 w-auto opacity-80"
            />
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center mb-6">
            <div 
              className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ 
                background: contact.photoUrl 
                  ? `url(${contact.photoUrl}) center/cover` 
                  : '#0E0E11',
                boxShadow: '0 0 0 3px #FFD400, 0 0 40px rgba(255,212,0,0.15)'
              }}
            >
              {!contact.photoUrl && (
                <span className="text-3xl font-bold text-[#FFD400]">{initials}</span>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
              {fullName}
            </h1>
            <p className="text-white/50 text-sm font-light">
              {contact.role}
            </p>
            <p className="text-[#FFD400]/70 text-xs font-medium tracking-widest uppercase mt-1">
              {contact.company}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <ActionButton 
              icon={Phone} 
              label="Appeler" 
              onClick={handleCall}
            />
            <ActionButton 
              icon={Mail} 
              label="Email" 
              onClick={handleEmail}
            />
            <ActionButton 
              icon={Linkedin} 
              label="LinkedIn" 
              onClick={handleLinkedIn}
            />
            <ActionButton 
              icon={MessageCircle} 
              label="WhatsApp" 
              onClick={handleWhatsApp}
            />
            <ActionButton 
              icon={Download} 
              label="Ajouter aux contacts" 
              onClick={handleAddContact}
              variant="primary"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-white/[0.04]">
          <p className="text-center text-[10px] text-white/25 tracking-widest uppercase">
            Powered by IWASP
          </p>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,212,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
    </div>
  );
}
