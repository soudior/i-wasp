/**
 * vCard 3.0 Generator - IWASP Professional
 * Compatible: iOS, Android, Outlook, Google Contacts
 * File: contact.vcf
 */

export interface VCardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  nfcPageUrl?: string;
  // Social networks
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
}

/**
 * Escape special characters for vCard format
 */
function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(data.firstName)} ${escapeVCard(data.lastName)}`,
    `N:${escapeVCard(data.lastName)};${escapeVCard(data.firstName)};;;`,
  ];

  if (data.company) {
    lines.push(`ORG:${escapeVCard(data.company)}`);
  }

  if (data.title) {
    lines.push(`TITLE:${escapeVCard(data.title)}`);
  }

  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  }

  if (data.address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCard(data.address)};;;;`);
  }

  if (data.website) {
    const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
    lines.push(`URL;TYPE=WORK:${url}`);
  }

  if (data.nfcPageUrl) {
    lines.push(`URL;TYPE=PREF:${data.nfcPageUrl}`);
  }

  // Social networks as X-SOCIALPROFILE (supported by iOS, Android, Outlook)
  if (data.linkedin) {
    const linkedinUrl = data.linkedin.startsWith('http') 
      ? data.linkedin 
      : `https://linkedin.com/in/${data.linkedin}`;
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${linkedinUrl}`);
  }

  if (data.instagram) {
    const instagramUrl = data.instagram.startsWith('http') 
      ? data.instagram 
      : `https://instagram.com/${data.instagram.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:${instagramUrl}`);
  }

  if (data.twitter) {
    const twitterUrl = data.twitter.startsWith('http') 
      ? data.twitter 
      : `https://twitter.com/${data.twitter.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=twitter:${twitterUrl}`);
  }

  // Note with WhatsApp link if provided
  if (data.whatsapp) {
    const cleanNumber = data.whatsapp.replace(/[^0-9+]/g, '');
    lines.push(`NOTE:WhatsApp: https://wa.me/${cleanNumber.replace('+', '')}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(data: VCardData): void {
  const vcard = generateVCard(data);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  // Generate filename from name
  const filename = `${data.firstName}_${data.lastName}.vcf`
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.-]/g, "");
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "contact.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get vCard preview data for display
 */
export function getVCardPreview(data: VCardData): {
  fields: { label: string; value: string; icon: string }[];
  isComplete: boolean;
} {
  const fields: { label: string; value: string; icon: string }[] = [];
  
  if (data.firstName || data.lastName) {
    fields.push({ 
      label: "Nom", 
      value: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      icon: "user"
    });
  }
  
  if (data.title) {
    fields.push({ label: "Fonction", value: data.title, icon: "briefcase" });
  }
  
  if (data.company) {
    fields.push({ label: "Entreprise", value: data.company, icon: "building" });
  }
  
  if (data.phone) {
    fields.push({ label: "Téléphone", value: data.phone, icon: "phone" });
  }
  
  if (data.email) {
    fields.push({ label: "Email", value: data.email, icon: "mail" });
  }
  
  if (data.address) {
    fields.push({ label: "Adresse", value: data.address, icon: "map-pin" });
  }
  
  if (data.website) {
    fields.push({ label: "Site web", value: data.website, icon: "globe" });
  }
  
  if (data.linkedin) {
    fields.push({ label: "LinkedIn", value: data.linkedin, icon: "linkedin" });
  }
  
  if (data.instagram) {
    fields.push({ label: "Instagram", value: data.instagram, icon: "instagram" });
  }
  
  // Minimum required: name + one contact method
  const hasName = Boolean(data.firstName && data.lastName);
  const hasContact = Boolean(data.phone || data.email);
  
  return {
    fields,
    isComplete: hasName && hasContact
  };
}
