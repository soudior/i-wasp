/**
 * Evolis Print Page
 * Professional card printing interface for Evolis printers
 * Admin-only access for production
 */

import { AdminGuard } from "@/components/AdminGuard";
import { EvolisPDFGenerator } from "@/components/print/EvolisPDFGenerator";

export default function EvolisPrintPage() {
  return (
    <AdminGuard>
      <EvolisPDFGenerator />
    </AdminGuard>
  );
}
