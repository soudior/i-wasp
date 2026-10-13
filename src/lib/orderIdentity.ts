import type { DigitalIdentity } from "@/contexts/OrderFunnelContext";

export const EMPTY_IDENTITY: DigitalIdentity = {
  clientType: "particulier",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  title: "",
  company: "",
  tagline: "",
  photoUrl: "",
  website: "",
  whatsapp: "",
  instagram: "",
  linkedin: "",
};
export function publicHttpUrl(value: string): string {
  const text = value.trim();
  if (!text) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(text) && !/^https?:\/\//i.test(text))
    throw new Error("Utilisez une adresse http ou https.");
  const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  if (!url.hostname.includes(".") || url.username || url.password)
    throw new Error("Vérifiez l’adresse du lien.");
  return url.href;
}
export function identityErrors(data: DigitalIdentity): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const [key, label] of [
    ["firstName", "prénom"],
    ["lastName", "nom"],
  ] as const) {
    if (!data[key].trim()) errors[key] = `Ajoutez votre ${label}.`;
    else if (data[key].trim().length > 80)
      errors[key] = "Limitez ce champ à 80 caractères.";
  }
  if (
    data.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
  )
    errors.email =
      "Exemple : prenom@entreprise.fr. Vous pouvez aussi laisser ce champ vide.";
  for (const key of ["phone", "whatsapp"] as const)
    if (
      data[key]?.trim() &&
      !/^\+?[0-9]{8,15}$/.test(data[key]!.replace(/[\s.()-]/g, ""))
    )
      errors[key] =
        "Indiquez 8 à 15 chiffres avec l’indicatif international, ou laissez vide.";
  for (const key of ["website", "linkedin"] as const)
    if (data[key]?.trim()) {
      try {
        const url = new URL(publicHttpUrl(data[key]!));
        if (key === "linkedin" && !/(^|\.)linkedin\.com$/.test(url.hostname))
          throw new Error();
      } catch {
        errors[key] =
          key === "linkedin"
            ? "Ajoutez un lien linkedin.com valide, ou laissez vide."
            : "Ajoutez un lien http ou https valide, ou laissez vide.";
      }
    }
  if (
    data.instagram?.trim() &&
    !/^@?[a-zA-Z0-9._]{1,30}$/.test(data.instagram.trim())
  )
    errors.instagram = "Saisissez uniquement le nom du compte, sans URL.";
  if ((data.tagline?.length || 0) > 80)
    errors.tagline = "Votre phrase peut contenir 80 caractères maximum.";
  return errors;
}
export function normalizeIdentity(data: DigitalIdentity): DigitalIdentity {
  return {
    ...data,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    title: data.title?.trim(),
    company: data.company?.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.replace(/[\s.()-]/g, ""),
    whatsapp: data.whatsapp?.replace(/[\s.()-]/g, ""),
    instagram: data.instagram?.trim().replace(/^@/, ""),
    website: publicHttpUrl(data.website || ""),
    linkedin: publicHttpUrl(data.linkedin || ""),
    tagline: data.tagline?.trim(),
  };
}
/** One mapping for the profile insert: never publish the account email as a fallback. */
export function orderProfileFields(
  data: DigitalIdentity,
  template: string | null
) {
  if (
    Object.keys(identityErrors(data)).length ||
    !data.profileVisibilityConfirmed
  )
    throw new Error(
      "Vérifiez et confirmez les informations publiques du profil."
    );
  const d = normalizeIdentity(data);
  return {
    first_name: d.firstName,
    last_name: d.lastName,
    title: d.title || null,
    company: d.company || null,
    email: d.email || null,
    phone: d.phone || null,
    whatsapp: d.whatsapp || null,
    instagram: d.instagram || null,
    linkedin: d.linkedin || null,
    website: d.website || null,
    tagline: (d.tagline ?? d.bio) || null,
    photo_url: d.photoUrl || null,
    template: template || "signature",
  };
}
