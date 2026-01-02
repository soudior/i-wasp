import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const lastUpdated = "2 janvier 2025";
  const companyName = "IWASP";
  const contactEmail = "contact@i-wasp.ma";
  const websiteUrl = "https://i-wasp.ma";

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 safe-top">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">Politique de confidentialité</h1>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <p className="text-muted-foreground text-sm">
          Dernière mise à jour : {lastUpdated}
        </p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bienvenue sur {companyName}. Nous respectons votre vie privée et nous nous engageons à protéger 
            vos données personnelles. Cette politique de confidentialité vous informe sur la façon dont nous 
            traitons vos données personnelles lorsque vous utilisez notre application et vous informe de vos 
            droits en matière de protection de la vie privée.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Données que nous collectons</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous pouvons collecter les types de données suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Données d'identité :</strong> prénom, nom, photo de profil</li>
            <li><strong>Données de contact :</strong> adresse email, numéro de téléphone, adresse WhatsApp</li>
            <li><strong>Données professionnelles :</strong> titre de poste, nom de l'entreprise, localisation</li>
            <li><strong>Données de profil social :</strong> liens vers vos profils LinkedIn, Instagram, Twitter</li>
            <li><strong>Données techniques :</strong> adresse IP, type d'appareil, navigateur, système d'exploitation</li>
            <li><strong>Données d'utilisation :</strong> pages visitées, durée de visite, interactions avec l'application</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">3. Comment nous utilisons vos données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous utilisons vos données personnelles pour :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Créer et gérer votre carte de visite numérique NFC</li>
            <li>Vous permettre de partager vos informations de contact avec d'autres personnes</li>
            <li>Traiter vos commandes de cartes NFC physiques</li>
            <li>Vous envoyer des notifications importantes concernant votre compte</li>
            <li>Améliorer notre application et nos services</li>
            <li>Fournir un support client</li>
            <li>Détecter et prévenir les fraudes</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Partage de vos données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Fournisseurs de services :</strong> hébergement cloud, traitement des paiements, livraison</li>
            <li><strong>Partenaires commerciaux :</strong> uniquement avec votre consentement explicite</li>
            <li><strong>Autorités légales :</strong> si requis par la loi</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Lorsque vous partagez votre carte de visite numérique, les destinataires peuvent voir les 
            informations que vous avez choisi de rendre publiques sur votre profil.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">5. Stockage et sécurité des données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vos données sont stockées sur des serveurs sécurisés avec chiffrement. Nous utilisons des 
            mesures de sécurité techniques et organisationnelles pour protéger vos données contre 
            l'accès non autorisé, la perte ou l'altération.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Nous conservons vos données aussi longtemps que votre compte est actif ou selon les 
            exigences légales applicables.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">6. Vos droits (RGPD)</h2>
          <p className="text-muted-foreground leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous avez le droit de :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Accès :</strong> demander une copie de vos données personnelles</li>
            <li><strong>Rectification :</strong> corriger les données inexactes ou incomplètes</li>
            <li><strong>Effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Limitation :</strong> restreindre le traitement de vos données</li>
            <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Retrait du consentement :</strong> retirer votre consentement à tout moment</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">7. Suppression de compte</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vous pouvez supprimer votre compte et toutes les données associées à tout moment depuis 
            les paramètres de l'application. La suppression est irréversible et entraînera :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>La suppression de votre profil et de vos cartes de visite numériques</li>
            <li>La suppression de vos données de contact et informations professionnelles</li>
            <li>La désactivation de tous les liens de partage associés</li>
            <li>La suppression des leads et statistiques de scans</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Pour supprimer votre compte, accédez à <strong>Paramètres → Mon compte → Supprimer mon compte</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">8. Cookies et technologies similaires</h2>
          <p className="text-muted-foreground leading-relaxed">
            Notre application peut utiliser des cookies et technologies similaires pour améliorer votre 
            expérience, analyser l'utilisation et personnaliser le contenu. Vous pouvez gérer vos 
            préférences de cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">9. Modifications de cette politique</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous 
            informerons de tout changement important par email ou via une notification dans l'application.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">10. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
            contactez-nous :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Email :</strong> {contactEmail}</li>
            <li><strong>Site web :</strong> {websiteUrl}</li>
            <li><strong>Entreprise :</strong> {companyName}</li>
          </ul>
        </section>

        <div className="pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {companyName}. Tous droits réservés.
          </p>
        </div>
      </main>
    </div>
  );
}
