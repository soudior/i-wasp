/**
 * IWASP Digital Business Card
 * Clean Apple Cupertino Style
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin, MessageCircle, UserPlus } from 'lucide-react';
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

// iOS-style action row
function ActionRow({ 
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
      className="w-full flex items-center gap-4 px-4 py-3.5 bg-white active:bg-gray-50 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        <Icon size={16} className="text-white" strokeWidth={2} />
      </div>
      <span className="text-[17px] text-gray-900">{label}</span>
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header with profile */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white pt-12 pb-6 px-6"
      >
        {/* Profile Photo */}
        <div className="flex justify-center mb-4">
          <div 
            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
            style={{ 
              backgroundImage: contact.photoUrl ? `url(${contact.photoUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {!contact.photoUrl && (
              <span className="text-2xl font-semibold text-gray-500">{initials}</span>
            )}
          </div>
        </div>

        {/* Name & Role */}
        <div className="text-center">
          <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">
            {fullName}
          </h1>
          <p className="text-[17px] text-gray-500 mt-0.5">
            {contact.role} · {contact.company}
          </p>
        </div>
      </motion.div>

      {/* Action List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="mt-6 mx-4"
      >
        <div className="rounded-xl overflow-hidden divide-y divide-gray-200">
          <ActionRow icon={Phone} label="Call" onClick={handleCall} />
          <ActionRow icon={Mail} label="Email" onClick={handleEmail} />
          <ActionRow icon={Linkedin} label="LinkedIn" onClick={handleLinkedIn} />
          <ActionRow icon={MessageCircle} label="WhatsApp" onClick={handleWhatsApp} />
        </div>
      </motion.div>

      {/* Add Contact Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="mt-4 mx-4"
      >
        <button
          onClick={handleAddContact}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-500 active:bg-blue-600 rounded-xl transition-colors"
        >
          <UserPlus size={18} className="text-white" strokeWidth={2} />
          <span className="text-[17px] font-medium text-white">Add to Contacts</span>
        </button>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto py-6">
        <p className="text-center text-[13px] text-gray-400">
          Powered by IWASP
        </p>
      </div>
    </div>
  );
}
