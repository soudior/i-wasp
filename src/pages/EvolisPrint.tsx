/**
 * Evolis Print Page
 * Professional card printing interface for Evolis printers
 * Admin-only access for production
 */

import { AdminOmniaLayout } from "@/layouts/AdminOmniaLayout";
import { EvolisPDFGenerator } from "@/components/print/EvolisPDFGenerator";

export default function EvolisPrintPage() {
  return (
    <AdminOmniaLayout title="Impression Evolis" subtitle="Export PDF professionnel">
      <EvolisPDFGenerator />
    </AdminOmniaLayout>
  );
}
