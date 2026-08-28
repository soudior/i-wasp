import { useEffect } from "react";
import {
  ArrowUpRight,
  Clock3,
  Download,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

const PHONE = "+212661101311";
const MAP_URL =
  "https://maps.google.co.ma/maps?um=1&ie=UTF-8&fb=1&gl=ma&sa=X&ftid=0xdafe9d49e1667f5:0x4fead0e13d9564cd";
const REVIEW_URL =
  "https://www.google.co.ma/searchviewer/10?output=search#lkt=LocalPoiReviews&lpg=cid:CgIgAQ%3D%3D";

const products = [
  { name: "Fromages frais", note: "Délicats & crémeux", tone: "bg-[#f2dfba]" },
  { name: "Fromages affinés", note: "Caractère & savoir-faire", tone: "bg-[#d6a154]" },
  { name: "Sélection du terroir", note: "À partager généreusement", tone: "bg-[#829269]" },
];

export default function AjbanAlKhairCard() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Ajban Al Khair | Fromages artisanaux à Marrakech";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const share = async () => {
    const data = {
      title: "Coopérative Ajban Al Khair Marrakech",
      text: "Découvrez les fromages artisanaux d’Ajban Al Khair à Marrakech.",
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(data);
    else await navigator.clipboard.writeText(window.location.href);
  };

  const saveContact = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Coopérative Ajban Al Khair Marrakech",
      "ORG:Coopérative Ajban Al Khair",
      "TEL;TYPE=CELL:+212661101311",
      "ADR:;;najma 24, Lot Sofia;Marrakech;;40000;Maroc",
      "NOTE:Fabricant de fromage artisanal à Marrakech",
      `URL:${window.location.href}`,
      "END:VCARD",
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    link.download = "ajban-al-khair.vcf";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-[#183328] selection:bg-[#d49a42]/30">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden bg-[#f8f3e8] shadow-2xl shadow-stone-900/10">
        <section className="relative h-[620px] overflow-hidden">
          <img
            src="/images/ajban-al-khair/hero.png"
            alt="Sélection de fromages artisanaux dans un décor marocain"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#122a21]/65 via-transparent to-[#122a21]/95" />
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <div className="flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
              <Sparkles size={13} className="text-[#f3bd63]" /> Tap by iWasp
            </div>
            <button onClick={share} aria-label="Partager" className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-xl transition hover:bg-white/20">
              <Share2 size={18} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 pb-8 text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f0b657] px-3 py-1.5 text-xs font-black text-[#173126] shadow-lg">
              <Star size={14} fill="currentColor" /> 4,7 · 74 avis Google
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#f3bd63]">Coopérative fromagère · Marrakech</p>
            <h1 className="font-['Playfair_Display'] text-[43px] font-semibold leading-[0.95] tracking-[-0.04em]">
              Ajban<br />Al Khair
            </h1>
            <p dir="rtl" className="mt-2 text-right font-['Playfair_Display'] text-xl text-white/80">تعاونية أجبان الخير بمراكش</p>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/80">
              Le goût sincère du terroir, façonné à Marrakech avec patience, générosité et savoir-faire.
            </p>
          </div>
        </section>

        <section className="relative z-10 -mt-1 px-5">
          <div className="grid grid-cols-4 gap-2 rounded-[26px] bg-white p-3 shadow-xl shadow-[#183328]/10">
            {[
              { icon: Phone, label: "Appeler", href: `tel:${PHONE}` },
              { icon: Navigation, label: "Y aller", href: MAP_URL },
              { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${PHONE.replace("+", "")}` },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center text-[10px] font-bold text-[#183328] transition hover:bg-[#f8f3e8]">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#183328] text-[#f3bd63] transition group-hover:scale-105"><Icon size={18} /></span>
                {label}
              </a>
            ))}
            <button onClick={saveContact} className="group flex flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center text-[10px] font-bold text-[#183328] transition hover:bg-[#f8f3e8]">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#183328] text-[#f3bd63] transition group-hover:scale-105"><Download size={18} /></span>
              Enregistrer
            </button>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#a26825]">Notre signature</p>
              <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-semibold leading-tight text-[#183328]">Des fromages qui<br />racontent une terre.</h2>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-full border border-[#183328]/15"><ShieldCheck className="text-[#6d7e51]" /></div>
          </div>

          <div className="space-y-3">
            {products.map((item, index) => (
              <div key={item.name} className="flex items-center gap-4 rounded-[22px] border border-[#183328]/10 bg-white p-3.5">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${item.tone} font-['Playfair_Display'] text-lg font-bold text-[#183328]`}>0{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#183328]">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-[#183328]/55">{item.note}</p>
                </div>
                <ArrowUpRight size={18} className="text-[#a26825]" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-5 overflow-hidden rounded-[30px] bg-[#183328] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[#f2bd62]">
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={17} fill="currentColor" />)}
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Google</span>
          </div>
          <p className="mt-5 font-['Playfair_Display'] text-2xl leading-snug">“La qualité se reconnaît au premier goût.”</p>
          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
            <div>
              <p className="text-3xl font-black">4,7<span className="text-lg text-white/50">/5</span></p>
              <p className="text-xs text-white/55">74 expériences partagées</p>
            </div>
            <a href={REVIEW_URL} target="_blank" rel="noreferrer" className="rounded-full bg-[#efb557] px-4 py-3 text-xs font-black text-[#183328]">Donner mon avis</a>
          </div>
        </section>

        <section className="px-6 py-10">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#a26825]">Nous trouver</p>
          <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-semibold">Au cœur de Marrakech</h2>
          <a href={MAP_URL} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-4 rounded-[24px] border border-[#183328]/10 bg-white p-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#dbe2ce] text-[#183328]"><MapPin /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">najma 24, Lot Sofia</span>
              <span className="mt-1 block text-xs text-[#183328]/55">Marrakech 40000, Maroc</span>
            </span>
            <ArrowUpRight size={18} />
          </a>
          <div className="mt-3 flex items-center gap-3 rounded-[20px] bg-[#eee5d3] p-4 text-sm">
            <Clock3 size={18} className="text-[#718052]" />
            <span className="font-bold text-[#183328]">Ouvert aujourd’hui</span>
            <span className="ml-auto text-[#183328]/60">jusqu’à 22:00</span>
          </div>
        </section>

        <footer className="bg-[#10261e] px-6 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-9 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-['Playfair_Display'] text-2xl">Ajban Al Khair</p>
              <p className="mt-1 text-xs text-white/45">Fromages artisanaux · Marrakech</p>
            </div>
            <div className="flex gap-2">
              <button onClick={share} aria-label="Partager" className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><Share2 size={17} /></button>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><Instagram size={17} /></span>
            </div>
          </div>
          <p className="mt-8 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-white/30">Expérience digitale propulsée par iWasp</p>
        </footer>

        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md bg-gradient-to-t from-[#f8f3e8] via-[#f8f3e8] to-transparent px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-8">
          <a href={`tel:${PHONE}`} className="flex h-14 items-center justify-center gap-3 rounded-full bg-[#d9902f] text-sm font-black text-[#173126] shadow-xl shadow-[#d9902f]/25 transition active:scale-[0.98]">
            <Phone size={18} /> Appeler la coopérative
          </a>
        </div>
      </div>
    </main>
  );
}
