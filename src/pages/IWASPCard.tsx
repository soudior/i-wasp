/**
 * IWASP Digital Business Card
 * Minimal Apple HIG
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin, MessageCircle, UserPlus } from 'lucide-react';
import { downloadVCard, VCardData } from '@/lib/vcard';

const contact = {
  firstName: "John",
  lastName: "Doe",
  role: "Founder",
  company: "IWASP",
  phone: "+33 6 12 34 56 78",
  email: "contact@iwasp.com",
  linkedin: "john-doe-iwasp",
  whatsapp: "+33612345678",
};

export default function IWASPCard() {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const initials = `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`;

  const handleCall = () => window.location.href = `tel:${contact.phone}`;
  const handleEmail = () => window.location.href = `mailto:${contact.email}`;
  const handleLinkedIn = () => window.open(`https://linkedin.com/in/${contact.linkedin}`, '_blank');
  const handleWhatsApp = () => window.open(`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`, '_blank');
  const handleAddContact = () => {
    downloadVCard({
      firstName: contact.firstName,
      lastName: contact.lastName,
      title: contact.role,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      linkedin: contact.linkedin,
    });
  };

  const actions = [
    { icon: Phone, label: "Call", onClick: handleCall },
    { icon: Mail, label: "Email", onClick: handleEmail },
    { icon: Linkedin, label: "LinkedIn", onClick: handleLinkedIn },
    { icon: MessageCircle, label: "WhatsApp", onClick: handleWhatsApp },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: '#F5F5F7' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {/* Profile */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#F5F5F7' }}
          >
            <span className="text-2xl font-medium" style={{ color: '#8E8E93' }}>{initials}</span>
          </div>
          <h1 className="text-2xl font-semibold" style={{ color: '#1D1D1F' }}>{fullName}</h1>
          <p className="text-base mt-1" style={{ color: '#8E8E93' }}>{contact.role} · {contact.company}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {actions.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl active:bg-[#F5F5F7] transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#007AFF' }}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-xs" style={{ color: '#8E8E93' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Add Contact */}
        <button
          onClick={handleAddContact}
          className="w-full py-3.5 rounded-xl font-medium text-white active:opacity-80 transition-opacity"
          style={{ backgroundColor: '#007AFF' }}
        >
          Add to Contacts
        </button>
      </motion.div>
    </div>
  );
}
