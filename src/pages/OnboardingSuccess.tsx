/**
 * OnboardingSuccess - Success page after card creation
 */

import { useSearchParams, Navigate } from "react-router-dom";
import { CardCreationSuccess } from "@/components/onboarding/CardCreationSuccess";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export default function OnboardingSuccess() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");
  const name = searchParams.get("name");

  if (!slug) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <CardCreationSuccess 
        cardSlug={slug} 
        cardName={name || "Votre carte"} 
      />
    </DashboardLayout>
  );
}
