export const NFC_ORDER_CATALOG = {
  essentiel: { id: "essentiel", name: "Essentielle", priceCents: 32900, quantity: 1 },
  signature: { id: "signature", name: "Professionnelle", priceCents: 54900, quantity: 1 },
  alliance: { id: "alliance", name: "Prestige", priceCents: 98900, quantity: 1 },
} as const;

export type NfcOfferId = keyof typeof NFC_ORDER_CATALOG;
