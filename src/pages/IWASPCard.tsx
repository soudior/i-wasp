/**
 * IWASP Premium NFC Digital Business Card
 * Mobile-only, minimal, powerful
 * 
 * Background: #0E0E11 (deep black)
 * Card: #16161D (anthracite)
 * Accent: #FFD400 (electric yellow)
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin, MessageCircle, Download } from 'lucide-react';
import { downloadVCard, VCardData } from '@/lib/vcard';
import iwaspLogo from '@/assets/iwasp-logo.png';

// Contact data
const contact = {
  firstName: "John",
  lastName: "Doe",
  role: "Founder · IWASP",
  company: "IWASP",
  phone: "+33 6 12 34 56 78",
  email: "contact@iwasp.com",
  linkedin: "john-doe-iwasp",
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
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px]"
          style={{ 
            background: 'radial-gradient(ellipse, rgba(255,212,0,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        
        {/* Bottom-left ambient orb (representing the robot presence) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-[350px] h-[400px]"
          style={{ 
            background: 'radial-gradient(ellipse at center, rgba(255,212,0,0.08) 0%, rgba(255,212,0,0.02) 40%, transparent 70%)',
            filter: 'blur(50px)'
          }}
        />
        
        {/* Floating orbs */}
        <div 
          className="absolute top-1/4 right-10 w-32 h-32 rounded-full animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,212,0,0.06) 0%, transparent 70%)',
            filter: 'blur(30px)'
          }}
        />
        <div 
          className="absolute bottom-1/3 left-20 w-20 h-20 rounded-full animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,212,0,0.05) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,212,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,212,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
        }}
      />

      {/* Card with entry animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="relative w-full max-w-[360px] rounded-[28px] overflow-hidden z-10"
        style={{ 
          backgroundColor: '#16161D',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)'
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
                boxShadow: '0 0 0 3px #FFD400, 0 0 30px rgba(255,212,0,0.15)'
              }}
            >
              {!contact.photoUrl && (
                <span className="text-2xl font-bold text-[#FFD400]">{initials}</span>
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-6">
            <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">
              {fullName}
            </h1>
            <p className="text-white/50 text-[14px]">
              {contact.role}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-center text-[#FFD400]/70 text-[12px] font-medium tracking-[0.1em] uppercase mb-8">
            Tap. Connect. Empower.
          </p>

          {/* Action Buttons - Stacked */}
          <div className="space-y-3">
            <ActionButton icon={Phone} label="Call" onClick={handleCall} />
            <ActionButton icon={Mail} label="Email" onClick={handleEmail} />
            <ActionButton icon={Linkedin} label="LinkedIn" onClick={handleLinkedIn} />
            <ActionButton icon={MessageCircle} label="WhatsApp" onClick={handleWhatsApp} />
            <ActionButton icon={Download} label="Add to contact" onClick={handleAddContact} isPrimary />
          </div>
        </div>

        {/* Footer */}
        <div className="py-4 border-t border-white/[0.04]">
          <p className="text-center text-[9px] text-white/20 tracking-[0.2em] uppercase">
            Powered by IWASP
          </p>
        </div>
      </motion.div>

      {/* Bottom ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 pointer-events-none"
        style={{ 
          background: 'radial-gradient(ellipse, rgba(255,212,0,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
    </div>
  );
}
