import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Contact, Mail, Phone, Radio, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import nfcVisual from "@/assets/cards/iwasp-nfc-tap-realistic-1920x1080.webp";
import walletVisual from "@/assets/cards/iwasp-wallet-realistic-1920x1080.webp";

const steps = [
  { label: "Le geste NFC", short: "Approcher" },
  { label: "Le profil digital", short: "Découvrir" },
  { label: "Le pass Wallet", short: "Conserver" },
];

function ProfilePreview() {
  return (
    <div className="relative mx-auto w-[285px] rounded-[2.7rem] border-[7px] border-[#202020] bg-black p-2 shadow-[0_40px_100px_rgba(0,0,0,0.65)] sm:w-[320px]">
      <div className="overflow-hidden rounded-[2.15rem] bg-[#080808]">
        <div className="h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(220,199,176,0.26),transparent_65%)] px-5 pt-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#DCC7B0]/30 bg-[#DCC7B0]/10 font-display text-2xl text-[#DCC7B0]">W</div>
        </div>
        <div className="px-5 pb-7 text-center">
          <p className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#DCC7B0]/70">Profil i-wasp</p>
          <h2 className="mt-3 font-display text-2xl text-white">Votre nom</h2>
          <p className="mt-1 text-xs text-white/45">Votre fonction · Votre entreprise</p>
          <p className="mx-auto mt-4 max-w-[230px] text-xs font-light leading-5 text-white/55">Votre identité professionnelle, vos coordonnées et vos réseaux réunis au même endroit.</p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {[{ icon: Phone, text: "Appeler" }, { icon: Mail, text: "Écrire" }, { icon: Contact, text: "Enregistrer" }, { icon: WalletCards, text: "Wallet" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] px-2 py-3 text-[10px] text-white/70"><Icon className="h-3.5 w-3.5 text-[#DCC7B0]" aria-hidden />{text}</div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-[#DCC7B0] py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-black">Ajouter aux contacts</div>
        </div>
      </div>
    </div>
  );
}

export default function Demo() {
  const [activeStep, setActiveStep] = useState(0);
  const next = () => setActiveStep((current) => (current + 1) % steps.length);

  return (
    <div className="min-h-screen overflow-hidden bg-[#030303] text-white">
      <SEOHead title="Démonstration NFC & Wallet | i-wasp" description="Découvrez le parcours i-wasp : geste NFC, profil digital et pass Apple Wallet." />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(220,199,176,0.09),transparent_35%)]" aria-hidden />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-white/55 transition hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden /> Retour</Link>
        <span className="font-display text-xl tracking-[0.08em]">i-wasp</span>
        <Link to="/order/offre" className="hidden rounded-full border border-[#DCC7B0]/25 bg-[#DCC7B0]/10 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#DCC7B0] sm:block">Créer ma carte</Link>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-8 sm:pt-14">
        <div className="mb-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[#DCC7B0]">Démonstration interactive</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">Une rencontre.<br /><span className="italic text-[#DCC7B0]">Toute votre présence.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-white/55 sm:text-base">Découvrez exactement ce que vit votre contact lorsqu’il approche votre carte i-wasp.</p>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2">
          {steps.map((step, index) => (
            <button key={step.label} type="button" onClick={() => setActiveStep(index)} className={`rounded-xl px-3 py-3 text-center transition ${activeStep === index ? "bg-[#DCC7B0] text-black" : "text-white/45 hover:bg-white/[0.04] hover:text-white"}`}>
              <span className="block font-mono text-[8px] uppercase tracking-[0.2em]">0{index + 1}</span>
              <span className="mt-1 hidden text-xs sm:block">{step.short}</span>
            </button>
          ))}
        </div>

        <section className="relative min-h-[610px] overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#090909] lg:min-h-[650px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeStep} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.45 }} className="grid min-h-[610px] lg:min-h-[650px] lg:grid-cols-[0.42fr_0.58fr]">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DCC7B0]/20 bg-[#DCC7B0]/10">
                  {activeStep === 0 ? <Radio className="h-5 w-5 text-[#DCC7B0]" /> : activeStep === 1 ? <Contact className="h-5 w-5 text-[#DCC7B0]" /> : <WalletCards className="h-5 w-5 text-[#DCC7B0]" />}
                </div>
                <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.3em] text-[#DCC7B0]/70">Étape 0{activeStep + 1}</p>
                <h2 className="mt-3 font-display text-4xl sm:text-5xl">{steps[activeStep].label}</h2>
                <p className="mt-5 max-w-md text-sm font-light leading-7 text-white/55">
                  {activeStep === 0 && "La carte approche le haut du smartphone. Le NFC déclenche instantanément l’ouverture du profil, sans application."}
                  {activeStep === 1 && "Le contact découvre une fiche mobile élégante : informations, réseaux, portfolio et actions utiles restent toujours à jour."}
                  {activeStep === 2 && "Le pass signé rejoint Apple Wallet. Le QR canonique ouvre la même fiche i-wasp et reste disponible à tout moment."}
                </p>
                <div className="mt-7 space-y-2 text-xs text-white/65">
                  {[activeStep === 0 ? "Compatible iPhone et Android" : activeStep === 1 ? "Modifiable sans réimprimer" : "Pass Wallet signé", activeStep === 0 ? "Aucune application requise" : activeStep === 1 ? "Contact enregistré en un geste" : "QR canonique i-wasp"].map((item) => <div key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" />{item}</div>)}
                </div>
                <button type="button" onClick={next} className="mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-[#DCC7B0] px-6 py-3 text-xs font-semibold text-black transition hover:bg-white">{activeStep === 2 ? "Rejouer la démo" : "Étape suivante"}<ArrowRight className="h-4 w-4" /></button>
              </div>

              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-black/30 p-5 sm:p-10">
                {activeStep === 0 && <img src={nfcVisual} alt="Carte i-wasp approchée d’un smartphone" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />}
                {activeStep === 1 && <ProfilePreview />}
                {activeStep === 2 && <img src={walletVisual} alt="Pass i-wasp dans Apple Wallet" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />}
                {activeStep !== 1 && <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" aria-hidden />}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-[#DCC7B0]/15 bg-[#DCC7B0]/[0.05] p-7 text-center sm:flex-row sm:p-9 sm:text-left">
          <div><p className="font-display text-2xl">Prêt à créer votre expérience ?</p><p className="mt-2 text-sm text-white/50">Carte physique, profil digital, QR et Wallet réunis.</p></div>
          <Link to="/order/offre" className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-semibold text-black">Créer ma carte <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </main>
    </div>
  );
}
