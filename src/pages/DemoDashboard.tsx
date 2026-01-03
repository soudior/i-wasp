/**
 * DemoDashboard - i-wasp V1 Elite Command Center Demo
 * 
 * Showcases the full Elite dashboard experience without authentication.
 * Demonstrates: Analytics, Lead CRM, Push Notifications, AI Coach
 */

import EliteDashboard from "@/components/EliteDashboard";

export default function DemoDashboard() {
  return (
    <EliteDashboard 
      userName="Karim Benjelloun"
      isGold={true}
    />
  );
}
