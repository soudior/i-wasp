export interface VCardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  nfcPageUrl?: string; // URL to the client's NFC page
  location?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  tagline?: string;
  photoUrl?: string;
  photoBase64?: string;
  includeNfcNote?: boolean;
}

function formatDateFrench(): string {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function generateVCard(data: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
  ];

  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }

  // Primary URL - NFC page or website
  if (data.nfcPageUrl) {
    lines.push(`URL:${data.nfcPageUrl}`);
  } else if (data.website) {
    const url = data.website.startsWith("http") ? data.website : `https://${data.website}`;
    lines.push(`URL:${url}`);
  }

  if (data.location) {
    lines.push(`ADR;TYPE=WORK:;;${data.location};;;;`);
  }

  if (data.linkedin) {
    const linkedinUrl = data.linkedin.startsWith("http") 
      ? data.linkedin 
      : `https://linkedin.com/in/${data.linkedin}`;
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${linkedinUrl}`);
  }

  if (data.instagram) {
    const handle = data.instagram.replace("@", "");
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/${handle}`);
  }

  if (data.twitter) {
    const handle = data.twitter.replace("@", "");
    lines.push(`X-SOCIALPROFILE;TYPE=twitter:https://twitter.com/${handle}`);
  }

  // Photo en base64 (compatible iOS & Android)
  if (data.photoBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${data.photoBase64}`);
  }

  // Note avec tagline et/ou mention NFC
  const noteParts: string[] = [];
  if (data.tagline) {
    noteParts.push(data.tagline);
  }
  if (data.includeNfcNote !== false) {
    noteParts.push(`Carte de visite NFC – scannée le ${formatDateFrench()}`);
  }
  if (noteParts.length > 0) {
    lines.push(`NOTE:${noteParts.join(' | ')}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(data: VCardData) {
  const vcard = generateVCard(data);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.firstName}_${data.lastName}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
