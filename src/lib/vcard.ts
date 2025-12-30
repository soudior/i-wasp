/**
 * vCard 3.0 Generator
 * Compatible: iOS, Android
 * File: contact.vcf
 */

export interface VCardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  nfcPageUrl?: string;
}

export function generateVCard(data: VCardData): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.firstName} ${data.lastName}`,
    `N:${data.lastName};${data.firstName};;;`,
  ];

  if (data.company) {
    lines.push(`ORG:${data.company}`);
  }

  if (data.title) {
    lines.push(`TITLE:${data.title}`);
  }

  if (data.phone) {
    lines.push(`TEL;TYPE=CELL:${data.phone}`);
  }

  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  if (data.nfcPageUrl) {
    lines.push(`URL:${data.nfcPageUrl}`);
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

export function downloadVCard(data: VCardData): void {
  const vcard = generateVCard(data);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = "contact.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
