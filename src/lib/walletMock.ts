import { toast } from "sonner";

export interface WalletCardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
}

// Mock Apple Wallet .pkpass generation
export function downloadAppleWalletPass(data: WalletCardData): void {
  // Generate mock pkpass data (in production, this would be a proper .pkpass file)
  const passData = {
    formatVersion: 1,
    passTypeIdentifier: "pass.com.iwasp.card",
    serialNumber: `IWASP-${Date.now()}`,
    teamIdentifier: "IWASP",
    organizationName: data.company || "IWASP",
    description: `${data.firstName} ${data.lastName} - Digital Business Card`,
    generic: {
      primaryFields: [
        {
          key: "name",
          label: "NAME",
          value: `${data.firstName} ${data.lastName}`,
        },
      ],
      secondaryFields: [
        {
          key: "title",
          label: "TITLE",
          value: data.title || "",
        },
        {
          key: "company",
          label: "COMPANY",
          value: data.company || "",
        },
      ],
      auxiliaryFields: [
        {
          key: "phone",
          label: "PHONE",
          value: data.phone || "",
        },
        {
          key: "email",
          label: "EMAIL",
          value: data.email || "",
        },
      ],
    },
  };

  // Create a mock .pkpass file (JSON representation)
  const blob = new Blob([JSON.stringify(passData, null, 2)], {
    type: "application/vnd.apple.pkpass",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.firstName}_${data.lastName}_AppleWallet.pkpass`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success("Pass Apple Wallet téléchargé !");
}

// Mock Google Wallet pass generation
export function downloadGoogleWalletPass(data: WalletCardData): void {
  // Generate mock Google Wallet pass data
  const passData = {
    iss: "iwasp@iwasp-wallet.iam.gserviceaccount.com",
    aud: "google",
    typ: "savetowallet",
    origins: ["https://iwasp.app"],
    payload: {
      genericObjects: [
        {
          id: `IWASP_${Date.now()}`,
          classId: "IWASP.digital_card",
          state: "ACTIVE",
          cardTitle: {
            defaultValue: {
              language: "fr",
              value: "Carte de visite numérique",
            },
          },
          header: {
            defaultValue: {
              language: "fr",
              value: `${data.firstName} ${data.lastName}`,
            },
          },
          subheader: {
            defaultValue: {
              language: "fr",
              value: data.title || "",
            },
          },
          textModulesData: [
            {
              id: "company",
              header: "ENTREPRISE",
              body: data.company || "",
            },
            {
              id: "phone",
              header: "TÉLÉPHONE",
              body: data.phone || "",
            },
            {
              id: "email",
              header: "EMAIL",
              body: data.email || "",
            },
          ],
        },
      ],
    },
  };

  // Create a mock Google Wallet file (JSON representation)
  const blob = new Blob([JSON.stringify(passData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.firstName}_${data.lastName}_GoogleWallet.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success("Pass Google Wallet téléchargé !");
}

// Check if device likely supports Apple Wallet
export function supportsAppleWallet(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua);
}

// Check if device likely supports Google Wallet
export function supportsGoogleWallet(): boolean {
  const ua = navigator.userAgent;
  return /Android/.test(ua);
}
