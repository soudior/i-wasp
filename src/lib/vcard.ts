/**
 * vCard 4.0 Generator - IWASP Professional
 * Compatible: iOS, Android, Outlook, Google Contacts
 * File: contact.vcf
 * 
 * Supports: Photos, Addresses, Social Links, Multiple URLs
 */

export interface VCardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  nfcPageUrl?: string;
  // Photo (Base64 or URL)
  photoUrl?: string;
  photoBase64?: string;
  // Logo (Gold V4 feature)
  logoUrl?: string;
  logoBase64?: string;
  // Social networks
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  telegram?: string;
  snapchat?: string;
  pinterest?: string;
  github?: string;
  // Additional fields
  note?: string;
  birthday?: string;
  nickname?: string;
  // Gold V4 features
  googleMapsUrl?: string;
  airbnbUrl?: string;
  bookingUrl?: string;
  tripadvisorUrl?: string;
}

/**
 * Escape special characters for vCard 4.0 format
 */
function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Format address for vCard 4.0
 */
function formatAddress(data: VCardData): string | null {
  if (!data.address && !data.city && !data.postalCode && !data.country) {
    return null;
  }
  
  // ADR format: PO Box;Extended;Street;City;Region;Postal Code;Country
  const parts = [
    '', // PO Box
    '', // Extended address
    escapeVCard(data.address || ''), // Street
    escapeVCard(data.city || ''), // City
    '', // Region/State
    escapeVCard(data.postalCode || ''), // Postal code
    escapeVCard(data.country || '') // Country
  ];
  
  return parts.join(';');
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `FN:${escapeVCard(data.firstName)} ${escapeVCard(data.lastName)}`,
    `N:${escapeVCard(data.lastName)};${escapeVCard(data.firstName)};;;`,
  ];

  // Nickname
  if (data.nickname) {
    lines.push(`NICKNAME:${escapeVCard(data.nickname)}`);
  }

  // Organization
  if (data.company) {
    lines.push(`ORG:${escapeVCard(data.company)}`);
  }

  // Title
  if (data.title) {
    lines.push(`TITLE:${escapeVCard(data.title)}`);
  }

  // Phone
  if (data.phone) {
    lines.push(`TEL;TYPE=cell;VALUE=uri:tel:${data.phone.replace(/\s/g, '')}`);
  }

  // Email
  if (data.email) {
    lines.push(`EMAIL;TYPE=work:${data.email}`);
  }

  // Address
  const formattedAddress = formatAddress(data);
  if (formattedAddress) {
    lines.push(`ADR;TYPE=work:${formattedAddress}`);
  }

  // Photo (URL or Base64)
  if (data.photoBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${data.photoBase64}`);
  } else if (data.photoUrl) {
    lines.push(`PHOTO;MEDIATYPE=image/jpeg:${data.photoUrl}`);
  }

  // Birthday
  if (data.birthday) {
    lines.push(`BDAY:${data.birthday}`);
  }

  // Website
  if (data.website) {
    const url = data.website.startsWith('http') ? data.website : `https://${data.website}`;
    lines.push(`URL;TYPE=work:${url}`);
  }

  // NFC Page URL (preferred URL)
  if (data.nfcPageUrl) {
    lines.push(`URL;TYPE=pref:${data.nfcPageUrl}`);
  }

  // Social networks as X-SOCIALPROFILE (vCard 4.0 extension, supported by iOS, Android, Outlook)
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

  if (data.facebook) {
    const facebookUrl = data.facebook.startsWith('http') 
      ? data.facebook 
      : `https://facebook.com/${data.facebook}`;
    lines.push(`X-SOCIALPROFILE;TYPE=facebook:${facebookUrl}`);
  }

  if (data.tiktok) {
    const tiktokUrl = data.tiktok.startsWith('http') 
      ? data.tiktok 
      : `https://tiktok.com/@${data.tiktok.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=tiktok:${tiktokUrl}`);
  }

  if (data.youtube) {
    const youtubeUrl = data.youtube.startsWith('http') 
      ? data.youtube 
      : `https://youtube.com/@${data.youtube.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=youtube:${youtubeUrl}`);
  }

  if (data.telegram) {
    const telegramUrl = data.telegram.startsWith('http') 
      ? data.telegram 
      : `https://t.me/${data.telegram.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=telegram:${telegramUrl}`);
  }

  if (data.snapchat) {
    const snapchatUrl = data.snapchat.startsWith('http') 
      ? data.snapchat 
      : `https://snapchat.com/add/${data.snapchat.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=snapchat:${snapchatUrl}`);
  }

  if (data.pinterest) {
    const pinterestUrl = data.pinterest.startsWith('http') 
      ? data.pinterest 
      : `https://pinterest.com/${data.pinterest.replace('@', '')}`;
    lines.push(`X-SOCIALPROFILE;TYPE=pinterest:${pinterestUrl}`);
  }

  if (data.github) {
    const githubUrl = data.github.startsWith('http') 
      ? data.github 
      : `https://github.com/${data.github}`;
    lines.push(`X-SOCIALPROFILE;TYPE=github:${githubUrl}`);
  }

  // Note with WhatsApp link and all booking/maps if provided (Gold V4)
  const noteParts: string[] = [];
  if (data.whatsapp) {
    const cleanNumber = data.whatsapp.replace(/[^0-9+]/g, '');
    noteParts.push(`WhatsApp: https://wa.me/${cleanNumber.replace('+', '')}`);
  }
  if (data.googleMapsUrl) {
    noteParts.push(`Google Maps: ${data.googleMapsUrl}`);
  }
  if (data.airbnbUrl) {
    noteParts.push(`Airbnb: ${data.airbnbUrl}`);
  }
  if (data.bookingUrl) {
    noteParts.push(`Booking: ${data.bookingUrl}`);
  }
  if (data.tripadvisorUrl) {
    noteParts.push(`Tripadvisor: ${data.tripadvisorUrl}`);
  }
  if (data.note) {
    noteParts.push(data.note);
  }
  if (noteParts.length > 0) {
    lines.push(`NOTE:${escapeVCard(noteParts.join(' | '))}`);
  }

  // Logo as additional URL (Gold V4 feature - visible in some contact apps)
  if (data.logoUrl) {
    lines.push(`LOGO;MEDIATYPE=image/png:${data.logoUrl}`);
  } else if (data.logoBase64) {
    lines.push(`LOGO;ENCODING=b;TYPE=PNG:${data.logoBase64}`);
  }

  // Producer
  lines.push("PRODID:-//IWASP//Digital Business Card//FR");
  
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
    const fullAddress = [data.address, data.city, data.postalCode, data.country]
      .filter(Boolean)
      .join(', ');
    fields.push({ label: "Adresse", value: fullAddress, icon: "map-pin" });
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
  
  if (data.photoUrl) {
    fields.push({ label: "Photo", value: "Incluse", icon: "camera" });
  }
  
  // Minimum required: name + one contact method
  const hasName = Boolean(data.firstName && data.lastName);
  const hasContact = Boolean(data.phone || data.email);
  
  return {
    fields,
    isComplete: hasName && hasContact
  };
}
