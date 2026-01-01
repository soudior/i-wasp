/**
 * CreateCard - Page de création de carte IWASP
 * 
 * Utilise le CardWizard premium avec flow linéaire
 */

import { useSearchParams } from "react-router-dom";
import { useCards } from "@/hooks/useCards";
import { CardWizard } from "@/components/card-wizard";
import { TemplateType } from "@/components/templates/CardTemplates";

const CreateCard = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { data: cards = [] } = useCards();

  // Load existing card data if editing
  const existingCard = editId ? cards.find(c => c.id === editId) : null;

  const initialData = existingCard ? {
    firstName: existingCard.first_name || "",
    lastName: existingCard.last_name || "",
    title: existingCard.title || "",
    company: existingCard.company || "",
    email: existingCard.email || "",
    phone: existingCard.phone || "",
    website: existingCard.website || "",
    tagline: existingCard.tagline || "",
    photoUrl: existingCard.photo_url || null,
    logoUrl: existingCard.logo_url || null,
    location: existingCard.location || "",
    template: (existingCard.template as TemplateType) || "signature",
    socialLinks: Array.isArray(existingCard.social_links) ? existingCard.social_links : [],
  } : undefined;

  return (
    <CardWizard 
      editId={editId}
      initialData={initialData}
    />
  );
};

export default CreateCard;