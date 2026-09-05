import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { CapacitorNfc, type NdefRecord, type NfcEvent } from "@capgo/capacitor-nfc";
import { ArrowLeft, CheckCircle2, Loader2, Radio, ScanLine, Smartphone, Wifi } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCards } from "@/hooks/useCards";
import { publicLegacyCardUrl } from "@/lib/publicUrl";

const URI_PREFIXES = [
  "", "http://www.", "https://www.", "http://", "https://", "tel:", "mailto:",
];

function makeUriRecord(url: string): NdefRecord {
  return {
    tnf: 0x01,
    type: [0x55], // NFC Forum well-known URI record ("U")
    id: [],
    payload: [0x00, ...Array.from(new TextEncoder().encode(url))],
  };
}

function decodeUriRecord(record?: NdefRecord): string | null {
  if (!record || record.type?.[0] !== 0x55 || !record.payload?.length) return null;
  const prefix = URI_PREFIXES[record.payload[0]] ?? "";
  return prefix + new TextDecoder().decode(new Uint8Array(record.payload.slice(1)));
}

export default function NativeNfcStudio() {
  const { data: cards = [] } = useCards();
  const firstCardUrl = useMemo(
    () => (cards[0]?.slug ? publicLegacyCardUrl(cards[0].slug) : "https://i-wasp.com/card/"),
    [cards],
  );
  const [url, setUrl] = useState(firstCardUrl);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [busy, setBusy] = useState<"read" | "write" | null>(null);
  const [lastRead, setLastRead] = useState<string | null>(null);

  useEffect(() => {
    if (cards[0]?.slug) setUrl(publicLegacyCardUrl(cards[0].slug));
  }, [cards]);

  useEffect(() => {
    let active = true;
    if (!Capacitor.isNativePlatform()) {
      setSupported(false);
      return;
    }
    CapacitorNfc.isSupported()
      .then(({ supported: value }) => active && setSupported(value))
      .catch(() => active && setSupported(false));
    return () => { active = false; void CapacitorNfc.stopScanning().catch(() => undefined); };
  }, []);

  const beginSession = async (mode: "read" | "write") => {
    if (!Capacitor.isNativePlatform() || supported === false) {
      toast.error("Ouvrez cette fonction dans l’application iPhone i-WASP.");
      return;
    }
    if (mode === "write" && !/^https:\/\/i-wasp\.com\/card\/[a-z0-9][a-z0-9-]*$/i.test(url.trim())) {
      toast.error("Le lien doit être une fiche canonique https://i-wasp.com/card/…");
      return;
    }

    setBusy(mode);
    let eventListener: Awaited<ReturnType<typeof CapacitorNfc.addListener>> | undefined;
    let endListener: Awaited<ReturnType<typeof CapacitorNfc.addListener>> | undefined;
    try {
      eventListener = await CapacitorNfc.addListener("nfcEvent", async (event: NfcEvent) => {
        try {
          if (mode === "write") {
            await CapacitorNfc.write({ records: [makeUriRecord(url.trim())], allowFormat: true });
            toast.success("Puce programmée avec le lien NFC i-WASP.");
          } else {
            const value = decodeUriRecord(event.tag?.ndefMessage?.[0]);
            setLastRead(value ?? "Tag NFC détecté sans lien URI lisible");
            toast.success("Puce NFC lue.");
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "L’opération NFC a échoué.");
        } finally {
          setBusy(null);
          await CapacitorNfc.stopScanning().catch(() => undefined);
          await eventListener?.remove();
          await endListener?.remove();
        }
      });
      endListener = await CapacitorNfc.addListener("nfcSessionEnd", () => setBusy(null));
      await CapacitorNfc.startScanning({
        iosSessionType: "ndef",
        invalidateAfterFirstRead: false,
        alertMessage: mode === "write"
          ? "Approchez la carte NFC i-WASP pour programmer son lien."
          : "Approchez une carte NFC pour lire son lien.",
      });
    } catch (error) {
      setBusy(null);
      await eventListener?.remove();
      await endListener?.remove();
      toast.error(error instanceof Error ? error.message : "NFC indisponible sur cet appareil.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-5 py-8">
      <div className="mx-auto max-w-xl space-y-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-white/60">
          <ArrowLeft size={16} /> Tableau de bord
        </Link>

        <header className="space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-black">
            <Radio size={28} />
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Fonction native iPhone</p>
          <h1 className="text-4xl font-semibold tracking-tight">Atelier NFC</h1>
          <p className="text-white/60">Lisez une puce ou programmez-la avec le lien public exact de votre carte i-WASP.</p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Smartphone className="text-amber-300" />
            <div>
              <p className="font-medium">État NFC de l’appareil</p>
              <p className="text-sm text-white/50">
                {supported === null ? "Vérification…" : supported ? "iPhone compatible et prêt" : "Disponible uniquement dans l’app iPhone"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 space-y-4">
          <label htmlFor="nfc-url" className="text-sm font-medium">Lien canonique à programmer</label>
          <Input id="nfc-url" value={url} onChange={(event) => setUrl(event.target.value)} className="border-white/10 bg-black/40" />
          <Button className="w-full bg-amber-400 text-black hover:bg-amber-300" disabled={busy !== null} onClick={() => void beginSession("write")}>
            {busy === "write" ? <Loader2 className="mr-2 animate-spin" /> : <Wifi className="mr-2" />}
            Programmer la puce NFC
          </Button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 space-y-4">
          <Button variant="outline" className="w-full border-white/20 bg-transparent text-white" disabled={busy !== null} onClick={() => void beginSession("read")}>
            {busy === "read" ? <Loader2 className="mr-2 animate-spin" /> : <ScanLine className="mr-2" />}
            Lire une puce NFC
          </Button>
          {lastRead && (
            <div className="flex gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="shrink-0" size={20} />
              <span className="break-all">{lastRead}</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
