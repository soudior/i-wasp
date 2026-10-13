import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { DigitalCard } from "@/components/DigitalCard";
import { StepIdentity } from "@/components/card-wizard/steps/StepIdentity";
import { WizardPreview } from "@/components/card-wizard/WizardPreview";
import { demoData } from "@/components/demo/demoData";
import "./demo-draft.css";

export default function Demo() {
  const [data, setData] = useState(demoData);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const intercept = (event: MouseEvent) => {
    if ((event.target as Element).closest("a,button")) {
      event.preventDefault();
      event.stopPropagation();
      setStatus(
        "Action de démonstration : aucun contact, téléchargement ou ajout Wallet effectué."
      );
    }
  };
  return (
    <MotionConfig reducedMotion="always">
      <div className="iw-demo">
        <SEOHead
          title="Créer et partager votre carte de visite : démonstration | i-wasp"
          description="Explorez les étapes de création et le profil mobile i-wasp avec des données fictives. Des usages concrets pour l’accueil hôtelier et la restauration."
          canonical="https://i-wasp.com/demo"
        />
        <a className="demo-skip" href="#demo-main">
          Aller au contenu
        </a>
        <header>
          <Link to="/">← Accueil i-wasp</Link>
          <Link to="/signup">Créer mon compte</Link>
        </header>
        <main id="demo-main" tabIndex={-1}>
          <div className="demo-intro">
            <p className="demo-kicker">
              DÉMONSTRATION · AUCUNE INSCRIPTION EFFECTUÉE
            </p>
            <h1>
              Votre profil prend vie.
              <br />
              Votre contact le découvre.
            </h1>
            <p>
              Après l’inscription, composez votre identité puis découvrez le
              profil qui s’affiche sur le téléphone du destinataire. Essayez ici
              avec une personne fictive.
            </p>
          </div>
          <nav className="demo-steps" aria-label="Étapes de la démonstration">
            {[
              "Après l’inscription",
              "Composer ma fiche",
              "Vue du destinataire",
            ].map((label, i) => (
              <button
                key={label}
                type="button"
                aria-current={step === i ? "step" : undefined}
                onClick={() => {
                  setStep(i);
                  setStatus("");
                }}
              >
                {i + 1}. {label}
              </button>
            ))}
          </nav>
          <section className="demo-stage" aria-labelledby="demo-stage-title">
            <div className="demo-copy">
              <p className="demo-kicker">ÉTAPE {step + 1} / 3</p>
              <h2 id="demo-stage-title">
                {
                  [
                    "Un espace pour votre identité.",
                    "Vos informations, votre style.",
                    "La rencontre continue ici.",
                  ][step]
                }
              </h2>
              <p>
                {
                  [
                    "Dans le parcours réel, vous créez votre compte avant d’enregistrer votre carte. Cet aperçu reprend le composant utilisé pendant la création : aucun compte n’est ouvert ici.",
                    "Modifiez les champs du véritable formulaire d’identité. Les changements restent uniquement dans cette page, jusqu’à son rechargement.",
                    "Voici le véritable composant du profil Signature, présenté dans un cadre de téléphone illustratif. Les informations saisies sont reprises ; les actions sont neutralisées dans cette démo.",
                  ][step]
                }
              </p>
              <p className="demo-notice">
                Données de démonstration. L’emplacement photo reste neutre en
                attendant une vraie photo autorisée. Aucun visage artificiel.
              </p>
              {step < 2 ? (
                <button
                  className="demo-primary"
                  onClick={() => setStep(step + 1)}
                >
                  {step === 0
                    ? "Essayer la création"
                    : "Voir le profil sur téléphone"}{" "}
                  →
                </button>
              ) : (
                <button className="demo-primary" onClick={() => setStep(1)}>
                  ← Modifier la fiche
                </button>
              )}
              {step === 2 && (
                <p>
                  Le NFC et le QR peuvent ouvrir la fiche publiée. Le cadre
                  ci-contre illustre le résultat dans un navigateur : aucun test
                  NFC physique n’a été réalisé. Le Wallet nécessite un service
                  configuré et un ajout confirmé sur l’appareil.
                </p>
              )}
            </div>
            <div className="demo-screen">
              {step === 0 && <WizardPreview data={data} />}
              {step === 1 && (
                <div className="demo-editor">
                  <StepIdentity
                    data={data}
                    onChange={(update) => setData({ ...data, ...update })}
                  />
                </div>
              )}
              {step === 2 && (
                <div
                  className="demo-phone"
                  onMouseDownCapture={(event) => event.stopPropagation()}
                  onTouchStartCapture={(event) => event.stopPropagation()}
                  onClickCapture={intercept}
                >
                  <div className="demo-phone-top" aria-hidden="true" />
                  <DigitalCard
                    data={{ ...data, linkedin: "", instagram: "", twitter: "" }}
                    template="signature"
                    showWalletButtons={false}
                    enableLeadCapture={false}
                  />
                </div>
              )}
              <p className="demo-caption">
                {step === 2
                  ? "PROFIL RÉEL · DONNÉES FICTIVES"
                  : "COMPOSANT DE CRÉATION RÉEL · DÉMONSTRATION"}
              </p>
            </div>
          </section>
          <p role="status" className="demo-status">
            {status}
          </p>
          <section
            className="demo-usecases"
            aria-labelledby="demo-usecases-title"
          >
            <h2 id="demo-usecases-title">
              Un point de contact utile, selon votre métier.
            </h2>
            <div>
              <article>
                <h3>À l’accueil d’un hôtel</h3>
                <p>
                  Rassemblez le contact de la réception, l’adresse et un lien
                  vers les informations de séjour de votre établissement.
                  Utilisez un intitulé clair pour que le voyageur retrouve le
                  bon interlocuteur.
                </p>
              </article>
              <article>
                <h3>Dans un restaurant</h3>
                <p>
                  Présentez le responsable, les coordonnées et le site qui
                  héberge votre menu ou votre réservation. La fiche facilite
                  l’accès à vos liens existants ; elle ne crée pas un système de
                  réservation.
                </p>
              </article>
            </div>
            <Link to="/creer-ma-carte">Préparer ma fiche avec l’équipe →</Link>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}
