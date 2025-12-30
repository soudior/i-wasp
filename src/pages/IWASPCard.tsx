/**
 * IWASP Digital Business Card
 * Apple Human Interface Guidelines
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin, MessageCircle, UserPlus, ChevronRight } from 'lucide-react';
import { downloadVCard, VCardData } from '@/lib/vcard';

// Contact data
const contact = {
  firstName: "John",
  lastName: "Doe",
  role: "Founder",
  company: "IWASP",
  phone: "+33 6 12 34 56 78",
  email: "contact@iwasp.com",
  linkedin: "john-doe-iwasp",
  whatsapp: "+33612345678",
  photoUrl: "",
};

// iOS-style list row
function ListRow({ 
  icon: Icon, 
  label, 
  onClick,
}: { 
  icon: typeof Phone; 
  label: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-5 py-4 active:bg-[#F5F5F7] transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#007AFF' }}>
          <Icon size={18} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-[17px]" style={{ color: '#1D1D1F' }}>{label}</span>
      </div>
      <ChevronRight size={20} style={{ color: '#8E8E93' }} />
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
    <div className="min-h-screen flex flex-col px-5 pt-16 pb-10" style={{ backgroundColor: '#F5F5F7' }}>
      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl py-8 px-6"
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        {/* Profile Photo */}
        <div className="flex justify-center mb-5">
          <div 
            className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: contact.photoUrl ? 'transparent' : '#F5F5F7',
              backgroundImage: contact.photoUrl ? `url(${contact.photoUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!contact.photoUrl && (
              <span className="text-[32px] font-medium" style={{ color: '#8E8E93' }}>{initials}</span>
            )}
          </div>
        </div>

        {/* Name & Role */}
        <div className="text-center">
          <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: '#1D1D1F' }}>
            {fullName}
          </h1>
          <p className="text-[17px] mt-1" style={{ color: '#8E8E93' }}>
            {contact.role} · {contact.company}
          </p>
        </div>
      </motion.div>

      {/* Actions Card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
        className="mt-5 rounded-2xl overflow-hidden"
        style={{ 
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <ListRow icon={Phone} label="Call" onClick={handleCall} />
          <ListRow icon={Mail} label="Email" onClick={handleEmail} />
          <ListRow icon={Linkedin} label="LinkedIn" onClick={handleLinkedIn} />
          <ListRow icon={MessageCircle} label="WhatsApp" onClick={handleWhatsApp} />
        </div>
      </motion.div>

      {/* Add Contact Button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.16, ease: "easeOut" }}
        onClick={handleAddContact}
        className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-2xl active:opacity-80 transition-opacity"
        style={{ backgroundColor: '#007AFF' }}
      >
        <UserPlus size={20} className="text-white" strokeWidth={2} />
        <span className="text-[17px] font-semibold text-white">Add to Contacts</span>
      </motion.button>

      {/* Footer */}
      <div className="mt-auto pt-10">
        <p className="text-center text-[13px]" style={{ color: '#8E8E93' }}>
          Powered by IWASP
        </p>
      </div>
    </div>
  );
}
