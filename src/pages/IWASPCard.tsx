/**
 * IWASP Digital Business Card
 * Minimal Apple HIG
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Linkedin, MessageCircle, UserPlus } from 'lucide-react';
import { downloadVCard } from '@/lib/vcard';

const contact = {
  firstName: "John",
  lastName: "Doe",
  role: "Founder",
  company: "IWASP",
  phone: "+33 6 12 34 56 78",
  email: "contact@iwasp.com",
  website: "https://i-wasp.com",
  linkedin: "john-doe-iwasp",
  whatsapp: "+33612345678",
  photoUrl: "", // URL de la photo si disponible
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
      website: contact.website,
      linkedin: contact.linkedin,
      includeNfcNote: true,
    });
  };

  const actions = [
    { icon: Phone, label: "Appeler", onClick: handleCall },
    { icon: Mail, label: "Email", onClick: handleEmail },
    { icon: Linkedin, label: "LinkedIn", onClick: handleLinkedIn },
    { icon: MessageCircle, label: "WhatsApp", onClick: handleWhatsApp },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5" style={{ backgroundColor: '#F5F5F7' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {/* Bouton principal "Ajouter aux contacts" en haut */}
        <motion.button
          onClick={handleAddContact}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 mb-6 shadow-lg"
          style={{ backgroundColor: '#007AFF' }}
        >
          <UserPlus size={20} />
          Ajouter aux contacts
        </motion.button>

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden"
            style={{ backgroundColor: '#F5F5F7' }}
          >
            {contact.photoUrl ? (
              <img src={contact.photoUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-medium" style={{ color: '#8E8E93' }}>{initials}</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-center" style={{ color: '#1D1D1F' }}>{fullName}</h1>
          <p className="text-base mt-1 text-center" style={{ color: '#8E8E93' }}>{contact.role} · {contact.company}</p>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-4 gap-2">
          {actions.map(({ icon: Icon, label, onClick }) => (
            <motion.button
              key={label}
              onClick={onClick}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl active:bg-[#F5F5F7] transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#007AFF' }}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-xs" style={{ color: '#8E8E93' }}>{label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
