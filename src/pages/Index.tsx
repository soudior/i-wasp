import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, QrCode, Smartphone, Wallet } from "lucide-react";
import { SEOHead, SEO_CONFIGS } from "@/components/SEOHead";
import { HeroProductVisual } from "@/components/home/HeroProductVisual";
import { PricingSection } from "@/components/home/PricingSection";
import { StructuredData, organizationSchema, websiteSchema, productSchema } from "@/components/StructuredData";
import "./home-draft.css";

// Commercial values preserved from the existing homepage, pending owner review.
const schema = [organizationSchema, websiteSchema, productSchema({
  name: "Carte de visite NFC i-wasp", description: "Carte de visite NFC avec profil digital.",
  image: "https://i-wasp.com/og-image.png", lowPrice: 29, highPrice: 79,
})];
const faqs = [
  ["Comment créer ma carte ?", "Choisissez votre offre dans le parcours de commande. Vous pouvez aussi créer votre compte ou demander à l’équipe de préparer votre fiche via le formulaire d’accompagnement."],
  ["Faut-il une application pour lire mon profil ?", "Votre lien et votre QR ouvrent votre fiche dans un navigateur. La lecture NFC dépend du téléphone et de ses réglages ; le QR constitue une alternative."],
  ["Puis-je partager avant de recevoir ma carte ?", "Une fois votre profil créé et publié, vous pouvez partager son lien et son QR. L’ajout dans Apple Wallet ou Google Wallet dépend des droits de votre compte et de la disponibilité du service."],
  ["Le Wallet remplace-t-il le NFC de la carte ?", "Le pass sert à retrouver votre carte de visite et son QR sur votre téléphone. Il ne promet pas un transfert NFC universel entre téléphones et ne constitue pas une carte bancaire."],
];
export default function Index() {
  return <div className="iw-home">
    <SEOHead {...SEO_CONFIGS.home} />
    <StructuredData id="home" schema={schema} />
    <a className="iw-skip" href="#contenu">Aller au contenu</a>
    <header className="iw-header">
      <Link to="/" className="iw-brand" aria-label="i-wasp, accueil"><span aria-hidden="true">◉</span> i-wasp<span className="iw-brand-dot">®</span></Link>
      <nav aria-label="Navigation principale" className="iw-nav">
        <a href="#experience">L’expérience</a><a href="#tarifs">Les cartes</a><a href="#wallet">Wallet</a>
      </nav>
      <Link to="/login" className="iw-account">Mon compte <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </header>
    <main id="contenu" tabIndex={-1}>
      <section className="iw-hero" aria-labelledby="hero-title">
        <div className="iw-hero-copy">
          <p className="iw-eyebrow"><span aria-hidden="true" /> LA CARTE. LE PROFIL. LA RENCONTRE.</p>
          <h1 id="hero-title">Votre prochaine<br />rencontre<br /><em>commence ici.</em></h1>
          <p className="iw-lead">Une carte de visite qui ouvre votre univers. Partagez votre profil, vos coordonnées et vos liens d’un geste, ou avec un QR.</p>
          <div className="iw-actions"><Link className="iw-button" to="/order/offre">Créer ma carte <ArrowRight size={18} aria-hidden="true" /></Link><Link className="iw-text-link" to="/demo">Voir un exemple <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <p className="iw-hero-note">Déjà prêt à commencer ? <Link to="/signup">Créer mon compte</Link></p>
        </div>
        <HeroProductVisual />
        <div className="iw-hero-footer"><span>01 / UNE PREMIÈRE IMPRESSION QUI RESTE</span><a href="#experience">Découvrir l’expérience ↓</a></div>
      </section>
      <section className="iw-section" id="experience" aria-labelledby="experience-title">
        <div className="iw-section-heading"><p className="iw-eyebrow">DU PREMIER CONTACT À LA SUITE</p><h2 id="experience-title">Un geste simple.<br /><em>Plus de possibilités.</em></h2><p>Votre carte physique et votre profil digital se complètent. À chaque étape, vous gardez un lien facile à partager.</p></div>
        <ol className="iw-steps">
          {[['01', 'Composez votre profil', 'Choisissez votre carte, puis renseignez vos coordonnées et vos liens. Un compte vous permet de retrouver votre espace.'], ['02', 'Partagez votre univers', 'Une fois votre fiche publiée, partagez son lien ou son QR, même avant la réception de votre carte physique.'], ['03', 'Faites le premier geste', 'À réception de votre carte NFC, approchez-la d’un téléphone compatible. Votre interlocuteur peut aussi scanner votre QR.']].map(([n,t,d]) => <li key={n}><span className="iw-step-number">{n}</span><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
        <div className="iw-help"><p><strong>Envie d’être accompagné ?</strong><br />Confiez vos informations à l’équipe pour préparer votre fiche.</p><Link to="/creer-ma-carte">Demander une création accompagnée <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
      </section>
      <section id="wallet" className="iw-wallet iw-section" aria-labelledby="wallet-title">
        <div className="iw-wallet-art" aria-hidden="true"><div className="iw-pass"><span>i-wasp / DIGITAL</span><Wallet size={42} /><strong>Votre profil,<br />à portée de main.</strong><div><QrCode size={54} /><span>Illustration<br />non scannable</span></div></div><p>APERÇU ILLUSTRATIF · PAS UN PASS ÉMIS</p></div>
        <div><p className="iw-eyebrow">EN ATTENDANT LA CARTE PHYSIQUE</p><h2>Le lien, déjà là.<br /><em>Le Wallet, en option.</em></h2><p>Votre profil publié se partage par lien ou QR. Apple Wallet et Google Wallet permettent ensuite de retrouver un pass sur votre téléphone, lorsque le service est disponible pour votre compte.</p><div className="iw-wallet-status"><Smartphone size={20} aria-hidden="true" /><p><strong>Disponibilité à confirmer</strong><br />L’intégration existe ; sa configuration et son fonctionnement sur iPhone et Android restent à valider. L’ouverture du lien ne confirme pas l’ajout du pass.</p></div><Link className="iw-text-link" to="/login">Retrouver mon espace <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
      </section>
      <PricingSection />
      <div className="iw-pricing-note">Carte physique et abonnement digital : consultez les détails de chaque offre. <Link to="/pricing">Voir les abonnements</Link></div>
      <section className="iw-section iw-faq" aria-labelledby="faq-title"><div><p className="iw-eyebrow">LES RÉPONSES, SIMPLEMENT</p><h2 id="faq-title">Avant le<br /><em>premier geste.</em></h2></div><div>{faqs.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
      <section className="iw-final"><p className="iw-eyebrow">VOTRE PROCHAINE RENCONTRE VOUS ATTEND</p><h2>Faites-vous<br /><em>remarquer.</em></h2><Link className="iw-button" to="/order/offre">Créer ma carte <ArrowRight size={18} aria-hidden="true" /></Link></section>
    </main>
    <footer className="iw-footer"><Link className="iw-brand" to="/">i-wasp®</Link><nav aria-label="Informations"><Link to="/creer-ma-carte">Être accompagné</Link><Link to="/pricing">Abonnements</Link><Link to="/privacy">Confidentialité</Link></nav><span>© {new Date().getFullYear()} i-wasp</span></footer>
  </div>;
}
