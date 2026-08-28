/**
 * Rendu d'une carte servie par le repli (iwallet-card), sous le domaine i-wasp.
 *
 * Volontairement sobre : le résolveur n'expose que des champs publics, et on
 * n'invente rien. Une action dont la donnée manque n'est simplement pas
 * affichée — trois actions fiables valent mieux que huit inventées.
 */

import { useEffect } from "react";
import { MapPin, Phone, Globe, Instagram, Download } from "lucide-react";
import type { ResolvedCard } from "@/hooks/useResolvedCard";

interface Props {
  card: ResolvedCard;
}

export function ResolvedCardFallback({ card }: Props) {
  useEffect(() => {
    const previous = document.title;
    document.title = card.company || card.name || "Carte i-Wasp";
    return () => {
      document.title = previous;
    };
  }, [card.company, card.name]);

  const phoneDigits = card.phone.replace(/[^\d+]/g, "");

  const saveContact = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${card.name}`,
      card.company ? `ORG:${card.company}` : "",
      card.role ? `TITLE:${card.role}` : "",
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : "",
      card.website ? `URL:${card.website}` : "",
      card.city ? `ADR:;;;${card.city};;;` : "",
      `URL:${window.location.href}`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    link.download = `${card.id}.vcf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="min-h-dvh bg-[#F5F5F7] text-[#1D1D1F]">
      <div className="mx-auto min-h-dvh max-w-md bg-white shadow-xl">
        <header className="px-6 pb-8 pt-[max(3rem,env(safe-area-inset-top))]">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8E8E93]">
            {card.role || "Carte digitale"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">{card.name}</h1>
          {card.company && <p className="mt-1 text-[15px] text-[#6E6E73]">{card.company}</p>}
          {card.city && (
            <p className="mt-3 flex items-center gap-2 text-sm text-[#8E8E93]">
              <MapPin size={15} /> {card.city}
            </p>
          )}
        </header>

        <section className="grid gap-2.5 px-6 pb-10">
          {card.phone && (
            <a
              href={`tel:${phoneDigits}`}
              className="flex h-13 items-center gap-3 rounded-2xl bg-[#1D1D1F] px-5 py-4 text-sm font-semibold text-white transition active:scale-[0.99]"
            >
              <Phone size={17} /> Appeler
            </a>
          )}
          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-[#E5E5EA] px-5 py-4 text-sm font-semibold transition active:scale-[0.99]"
            >
              <Globe size={17} /> Site web
            </a>
          )}
          {card.instagram && (
            <a
              href={card.instagram.startsWith("http") ? card.instagram : `https://instagram.com/${card.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-[#E5E5EA] px-5 py-4 text-sm font-semibold transition active:scale-[0.99]"
            >
              <Instagram size={17} /> Instagram
            </a>
          )}
          <button
            onClick={saveContact}
            className="flex items-center gap-3 rounded-2xl border border-[#E5E5EA] px-5 py-4 text-sm font-semibold transition active:scale-[0.99]"
          >
            <Download size={17} /> Enregistrer le contact
          </button>
        </section>

        <footer className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C7C7CC]">
            Propulsé par i-Wasp
          </p>
        </footer>
      </div>
    </main>
  );
}
