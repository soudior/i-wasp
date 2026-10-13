import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const COMPANY_NAME = "IWASP";
const CONTACT_EMAIL = "contact@i-wasp.com";
const WEBSITE_URL = "https://www.i-wasp.com";
const CONTACT_URL = "https://www.i-wasp.com/contact";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background safe-top safe-bottom">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 safe-top">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">Politique de confidentialité</h1>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <p className="text-muted-foreground text-sm">Dernière mise à jour : 22 août 2026</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">1. Objet de cette politique</h2>
          <p className="text-muted-foreground leading-relaxed">
            {COMPANY_NAME} permet de créer et partager un profil ou une carte de visite numérique,
            de commander des produits ou services associés et d’utiliser des fonctions de contact,
            de messagerie et de statistiques. Cette politique décrit les données traitées par le site
            et l’application, leurs finalités, leurs destinataires et vos droits.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">2. Données traitées</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Compte et identité :</strong> identifiant de compte, nom, prénom et informations d’authentification gérées par notre fournisseur d’identité.</li>
            <li><strong>Coordonnées et profil :</strong> e-mail, téléphone, adresse, entreprise, poste, liens sociaux et autres informations que vous choisissez d’ajouter.</li>
            <li><strong>Contenu utilisateur :</strong> photos, logos, médias, messages, contenus de messagerie/chat et informations saisies dans les formulaires.</li>
            <li><strong>Commandes :</strong> produits commandés, montant, devise, état de paiement, références de commande et informations nécessaires à la facturation ou à la livraison.</li>
            <li><strong>Localisation :</strong> pays ou zone approximative déduite de l’adresse IP et, uniquement à votre demande, coordonnées précises pour remplir une adresse.</li>
            <li><strong>Utilisation et appareil :</strong> pages et fonctions utilisées, événements, scans, session ou référence de commande, navigateur, système, adresse IP et identifiants techniques.</li>
            <li><strong>Notifications push :</strong> après votre autorisation, point de terminaison, clés techniques, état d’abonnement et agent utilisateur nécessaires à l’envoi.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">3. Finalités</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Créer, sécuriser et administrer votre compte et vos cartes numériques.</li>
            <li>Afficher et partager le profil que vous avez choisi de rendre public.</li>
            <li>Traiter les commandes, paiements, abonnements, livraisons et demandes d’assistance.</li>
            <li>Fournir la messagerie/chat, la localisation demandée, les notifications push et les fonctions NFC ou QR.</li>
            <li>Produire des statistiques internes de fonctionnement, de scans et d’utilisation afin d’améliorer et sécuriser le service.</li>
            <li>Prévenir les abus et respecter nos obligations comptables, fiscales et légales.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Nous ne vendons pas vos données et nous ne les utilisons pas pour suivre votre activité entre
            des applications ou sites appartenant à d’autres sociétés à des fins de publicité ciblée.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Services et destinataires</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Supabase :</strong> authentification, base de données, stockage des fichiers, fonctions serveur et événements de statistiques internes.</li>
            <li><strong>Stripe :</strong> paiements et abonnements. Les données de carte sont saisies directement auprès de Stripe ; {COMPANY_NAME} ne les stocke pas et n’y a pas accès.</li>
            <li><strong>ipapi :</strong> estimation du pays ou de la zone à partir de l’adresse IP, notamment pour adapter la devise.</li>
            <li><strong>Nominatim / OpenStreetMap :</strong> conversion de coordonnées en adresse lorsque vous déclenchez volontairement la fonction de localisation.</li>
            <li><strong>Web Push :</strong> acheminement des notifications après votre consentement système.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Ces prestataires traitent uniquement les données nécessaires à leur service. Des transferts
            internationaux peuvent avoir lieu selon leur infrastructure et sont encadrés par les garanties
            applicables. Nous pouvons aussi communiquer des données aux autorités lorsque la loi l’exige.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">5. Profils publics et partage</h2>
          <p className="text-muted-foreground leading-relaxed">
            Une carte publiée peut être accessible par son lien, QR code ou support NFC. Les visiteurs voient
            alors uniquement les champs et médias que vous avez choisis pour ce profil. Avant publication,
            vérifiez qu’aucune information confidentielle ne figure dans ces champs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">6. Conservation et sécurité</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Les données de compte, profils et fichiers sont conservés pendant l’utilisation du service, puis supprimés ou anonymisés lorsqu’ils ne sont plus nécessaires, sous réserve des obligations légales.</li>
            <li>Les commandes et éléments de paiement sont conservés pendant la durée nécessaire à la comptabilité, à la fiscalité, à la prévention de la fraude et aux litiges.</li>
            <li>Les statistiques, journaux techniques et scans sont conservés pendant la durée nécessaire à l’exploitation, à la sécurité et à l’amélioration du service.</li>
            <li>Les abonnements push sont conservés jusqu’au désabonnement, à leur expiration technique ou à la suppression du compte.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Nous appliquons des mesures techniques et organisationnelles destinées à limiter les accès non
            autorisés, les pertes et les altérations. Aucun système ne peut toutefois garantir une sécurité absolue.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">7. Vos choix et vos droits</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>La localisation précise et les notifications nécessitent votre autorisation et peuvent être désactivées dans les réglages de l’appareil.</li>
            <li>Vous pouvez demander l’accès, la rectification, l’effacement, la limitation, la portabilité ou l’opposition lorsque la loi le prévoit.</li>
            <li>Vous pouvez retirer un consentement sans remettre en cause les traitements déjà réalisés licitement.</li>
            <li>Vous pouvez supprimer votre compte depuis <strong>Paramètres → Mon compte → Supprimer mon compte</strong> ou nous contacter.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Certaines informations peuvent être conservées après une demande de suppression lorsqu’une obligation
            légale ou la défense d’un droit l’impose.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">8. Cookies et statistiques</h2>
          <p className="text-muted-foreground leading-relaxed">
            Le service peut utiliser le stockage local, des cookies techniques et des événements de statistiques
            internes pour maintenir la session, mémoriser vos choix, mesurer l’utilisation et corriger les erreurs.
            Ces données ne servent pas au suivi publicitaire entre services tiers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">9. Évolution de la politique</h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous pouvons mettre cette politique à jour pour refléter une évolution du service ou de la loi.
            La date affichée en haut de la page indique la version en vigueur.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">10. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour toute question ou demande relative à vos données :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>E-mail :</strong> {CONTACT_EMAIL}</li>
            <li><strong>Formulaire :</strong> {CONTACT_URL}</li>
            <li><strong>Site :</strong> {WEBSITE_URL}</li>
            <li><strong>Responsable du service :</strong> {COMPANY_NAME}</li>
          </ul>
        </section>

        <div className="pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} {COMPANY_NAME}. Tous droits réservés.
          </p>
        </div>
      </main>
    </div>
  );
}
