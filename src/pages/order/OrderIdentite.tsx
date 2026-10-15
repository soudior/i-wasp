import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  useOrderFunnel,
  OrderFunnelGuard,
  type DigitalIdentity,
} from "@/contexts/OrderFunnelContext";
import { supabase } from "@/integrations/supabase/client";
import {
  EMPTY_IDENTITY,
  identityErrors,
  normalizeIdentity,
} from "@/lib/orderIdentity";
import "./order-identity.css";

async function uploadPhoto(dataUrl: string): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    throw new Error(
      "Connectez-vous pour transférer la photo, ou retirez-la et ajoutez-la plus tard. Votre saisie est conservée."
    );
  const blob = await (await fetch(dataUrl)).blob();
  const ext =
    blob.type === "image/png"
      ? "png"
      : blob.type === "image/webp"
      ? "webp"
      : "jpg";
  const path = `${user.id}/photos/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("card-assets")
    .upload(path, blob, { upsert: false, contentType: blob.type });
  if (error)
    throw new Error(
      "La photo n’a pas pu être transférée. Réessayez ou retirez-la pour continuer. Vos informations sont conservées."
    );
  return supabase.storage.from("card-assets").getPublicUrl(path).data.publicUrl;
}

function IdentityContent() {
  const {
    state,
    setDigitalIdentity,
    setIdentityDraft,
    clearIdentityDraft,
    storageWarning,
    nextStep,
    prevStep,
  } = useOrderFunnel();
  const [data, setData] = useState<DigitalIdentity>(() => ({
    ...EMPTY_IDENTITY,
    ...(state.identityDraft || state.digitalIdentity),
    tagline:
      (state.identityDraft || state.digitalIdentity)?.tagline ??
      (state.identityDraft || state.digitalIdentity)?.bio ??
      "",
  }));
  const draftRef = useRef(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoVersion = useRef(0);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const change = (field: keyof DigitalIdentity, value: string | boolean) => {
    const next = {
      ...draftRef.current,
      [field]: value,
      profileVisibilityConfirmed:
        field === "profileVisibilityConfirmed" ? Boolean(value) : false,
    };
    draftRef.current = next;
    setData(next);
    setIdentityDraft(next);
    setMessage("");
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const continueForm = async (event: FormEvent) => {
    event.preventDefault();
    if (lock.current || photoBusy || state.isTransitioning) return;
    const found = identityErrors(data);
    if (!data.profileVisibilityConfirmed)
      found.profileVisibilityConfirmed =
        "Confirmez que vous souhaitez rendre ces informations publiques.";
    if (Object.keys(found).length) {
      setErrors(found);
      setDetailsOpen(true);
      setPreview(false);
      requestAnimationFrame(() =>
        document.getElementById(`profile-${Object.keys(found)[0]}`)?.focus()
      );
      return;
    }
    lock.current = true;
    setBusy(true);
    setMessage("");
    try {
      const normalized = normalizeIdentity(data);
      if (normalized.photoUrl?.startsWith("data:"))
        normalized.photoUrl = await uploadPhoto(normalized.photoUrl);
      draftRef.current = normalized;
      setData(normalized);
      setDigitalIdentity(normalized);
      await nextStep();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de continuer. Votre saisie est conservée."
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const choosePhoto = (file?: File) => {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setMessage("Choisissez une photo JPG, PNG ou WebP de 5 Mo maximum.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    const version = ++photoVersion.current;
    setPhotoBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (version !== photoVersion.current) return;
      change("photoUrl", String(reader.result));
      setPhotoBusy(false);
    };
    reader.onerror = () => {
      if (version !== photoVersion.current) return;
      setPhotoBusy(false);
      if (fileInput.current) fileInput.current.value = "";
      setMessage(
        "Lecture de la photo impossible. Choisissez un autre fichier."
      );
    };
    reader.readAsDataURL(file);
  };
  const field = (
    key: keyof DigitalIdentity,
    label: string,
    type = "text",
    autoComplete?: string
  ) => (
    <div className="oi-field" key={key}>
      <label htmlFor={`profile-${key}`}>{label}</label>
      <input
        id={`profile-${key}`}
        name={key}
        type={type}
        required={key === "firstName" || key === "lastName"}
        autoComplete={autoComplete}
        maxLength={key === "tagline" ? 80 : 300}
        value={String(data[key] || "")}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `profile-${key}-error` : undefined}
        onChange={(e) => change(key, e.target.value)}
      />
      {errors[key] && (
        <p id={`profile-${key}-error`} className="oi-error">
          {errors[key]}
        </p>
      )}
    </div>
  );
  return (
    <div className="order-identity">
      <header>
        <button type="button" disabled={busy} onClick={() => prevStep()}>
          ← Revenir à l’offre
        </button>
        <Link to="/">i-wasp</Link>
      </header>
      <main>
        <p className="oi-step">
          ÉTAPE 2 / 6 AVANT CONFIRMATION · PROFIL NUMÉRIQUE
        </p>
        <h1>
          Les informations qui
          <br />
          vous présentent.
        </h1>
        <p className="oi-intro">
          Votre prénom et votre nom suffisent pour commencer. Ajoutez seulement
          les coordonnées que vous souhaitez partager.
        </p>
        <nav className="oi-path" aria-label="Suite du parcours">
          <span aria-current="step">Profil numérique</span>
          <span>→ Modèle</span>
          <span>→ Carte physique</span>
          <span>→ Livraison et récapitulatif</span>
        </nav>
        <p className="oi-storage">
          Brouillon conservé dans cet onglet. Aucune carte créée à cette étape.{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              photoVersion.current++;
              setPhotoBusy(false);
              draftRef.current = { ...EMPTY_IDENTITY };
              setData({ ...EMPTY_IDENTITY });
              clearIdentityDraft();
              setErrors({});
              setMessage("Brouillon effacé.");
              if (fileInput.current) fileInput.current.value = "";
            }}
          >
            Effacer le brouillon
          </button>
        </p>
        {storageWarning && (
          <p role="alert" className="oi-error">
            Le navigateur ne peut pas conserver le brouillon après un
            rechargement. Gardez cette page ouverte ou réduisez la taille de la
            photo.
          </p>
        )}
        <button
          type="button"
          className="oi-preview-toggle"
          aria-pressed={preview}
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Revenir aux informations" : "Voir mon aperçu"}
        </button>
        <div className="oi-layout">
          <form
            ref={form}
            noValidate
            onSubmit={continueForm}
            className={preview ? "oi-form oi-mobile-hidden" : "oi-form"}
          >
            <fieldset disabled={busy}>
              <legend>Votre identité · nécessaire</legend>
              <div className="oi-name">
                {field("firstName", "Prénom *", "text", "given-name")}
                {field("lastName", "Nom *", "text", "family-name")}
              </div>
              <details
                open={detailsOpen}
                onToggle={(e) => setDetailsOpen(e.currentTarget.open)}
              >
                <summary>
                  Photo, activité et liens · tout est facultatif
                </summary>
                <div className="oi-photo">
                  <label htmlFor="profile-photo">
                    Votre photo · facultative
                  </label>
                  <input
                    ref={fileInput}
                    id="profile-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={photoBusy}
                    onChange={(e) => choosePhoto(e.target.files?.[0])}
                  />
                  <p>
                    Choisissez une vraie photo que vous avez le droit
                    d’utiliser. Elle reste locale jusqu’à « Continuer », puis
                    est transférée dans l’espace média public. Retirer ici ne
                    supprime pas un fichier déjà transféré.
                  </p>
                  {data.photoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        photoVersion.current++;
                        setPhotoBusy(false);
                        change("photoUrl", "");
                        if (fileInput.current) fileInput.current.value = "";
                      }}
                    >
                      Retirer la photo
                    </button>
                  )}
                </div>
                {field(
                  "title",
                  "Fonction · facultative",
                  "text",
                  "organization-title"
                )}
                {field(
                  "company",
                  "Entreprise · facultative",
                  "text",
                  "organization"
                )}
                {field(
                  "tagline",
                  "Votre phrase de présentation · 80 caractères maximum"
                )}
                <p className="oi-note">
                  Ces coordonnées sont destinées à vos visiteurs. L’email du
                  compte et le téléphone de livraison sont distincts.
                </p>
                {field("email", "Email public · facultatif", "email", "email")}
                {field("phone", "Téléphone public · facultatif", "tel", "tel")}
                {field("website", "Site web · facultatif", "text", "url")}
                {field("whatsapp", "WhatsApp public · facultatif", "tel")}
                {field("linkedin", "Lien LinkedIn · facultatif")}
                {field("instagram", "Compte Instagram · facultatif")}
              </details>
              <div className="oi-consent">
                <input
                  id="profile-profileVisibilityConfirmed"
                  type="checkbox"
                  required
                  checked={Boolean(data.profileVisibilityConfirmed)}
                  onChange={(e) =>
                    change("profileVisibilityConfirmed", e.target.checked)
                  }
                  aria-invalid={Boolean(errors.profileVisibilityConfirmed)}
                  aria-describedby={
                    errors.profileVisibilityConfirmed
                      ? "profile-consent-error"
                      : "profile-privacy"
                  }
                />
                <label htmlFor="profile-profileVisibilityConfirmed">
                  Je confirme que les informations renseignées peuvent
                  apparaître sur mon profil public après sa création.
                </label>
              </div>
              {errors.profileVisibilityConfirmed && (
                <p className="oi-error" id="profile-consent-error">
                  {errors.profileVisibilityConfirmed}
                </p>
              )}
              <p id="profile-privacy" className="oi-note">
                Vous pouvez laisser les coordonnées facultatives vides.{" "}
                <Link to="/privacy">Confidentialité</Link> ·{" "}
                <Link to="/cgv">Conditions de vente</Link>.
              </p>
              <button
                className="oi-primary"
                type="submit"
                disabled={photoBusy || state.isTransitioning}
              >
                {busy
                  ? "Enregistrement de l’étape…"
                  : "Continuer vers le modèle"}
              </button>
            </fieldset>
          </form>
          <aside
            className={preview ? "oi-preview" : "oi-preview oi-mobile-hidden"}
            aria-label="Aperçu des informations publiques"
          >
            <p className="oi-step">VOTRE PROFIL · APERÇU DES INFORMATIONS</p>
            <div className="oi-preview-card">
              {data.photoUrl ? (
                <img
                  src={data.photoUrl}
                  alt="Votre photo sélectionnée"
                  width={88}
                  height={88}
                />
              ) : (
                <div className="oi-photo-placeholder">
                  Photo
                  <br />
                  facultative
                </div>
              )}
              <h2>
                {[data.firstName, data.lastName].filter(Boolean).join(" ") ||
                  "Votre nom"}
              </h2>
              <p>{[data.title, data.company].filter(Boolean).join(" · ")}</p>
              {data.tagline && <blockquote>{data.tagline}</blockquote>}
              <dl>
                {[
                  ["Email", data.email],
                  ["Téléphone", data.phone],
                  ["Site", data.website],
                  ["WhatsApp", data.whatsapp],
                  ["LinkedIn", data.linkedin],
                  ["Instagram", data.instagram],
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
              </dl>
              {![data.email, data.phone, data.website, data.whatsapp, data.linkedin, data.instagram].some(Boolean) && (
                <p className="oi-note">Aucune coordonnée publique ajoutée.</p>
              )}
            </div>
            <p className="oi-note">
              Vérifiez le contenu ici ; la présentation finale peut différer de
              cet aperçu. Les actions de contact ne sont pas actives dans cet
              aperçu.
            </p>
            <div className="oi-distinction">
              <h3>Trois choses distinctes</h3>
              <p>
                <strong>Profil numérique :</strong> votre page de contact après
                création.
              </p>
              <p>
                <strong>Pass Wallet :</strong> une option soumise à
                configuration et à validation sur l’appareil.
              </p>
              <p>
                <strong>Carte physique :</strong> une commande distincte. Aucune
                livraison ni lecture NFC n’est confirmée ici.
              </p>
            </div>
          </aside>
        </div>
        <p role="status" className="oi-message">
          {message || (photoBusy ? "Lecture locale de la photo…" : "")}
        </p>
      </main>
    </div>
  );
}
export default function OrderIdentite() {
  return (
    <OrderFunnelGuard step={2}>
      <IdentityContent />
    </OrderFunnelGuard>
  );
}
