/**
 * FeatureValidationProvider - App-level feature validation
 * 
 * Runs validation on app startup and displays critical errors
 * in development mode. Silent in production.
 */

import { useEffect, useState, ReactNode } from "react";
import { 
  validateFeatures, 
  logValidationReport,
  ValidationReport 
} from "@/lib/featureRegistry";

interface FeatureValidationProviderProps {
  children: ReactNode;
  /** Show UI overlay for critical failures (dev only) */
  showOverlay?: boolean;
}

export function FeatureValidationProvider({ 
  children, 
  showOverlay = true 
}: FeatureValidationProviderProps) {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    // Only validate in development
    if (import.meta.env.PROD) return;
    
    const validationReport = validateFeatures();
    setReport(validationReport);
    logValidationReport(validationReport);
    
    // Store validation timestamp
    sessionStorage.setItem(
      "iwasp_feature_validation",
      JSON.stringify({
        timestamp: validationReport.timestamp,
        isValid: validationReport.isValid,
        criticalCount: validationReport.criticalFailures.length,
      })
    );
  }, []);
  
  // In production, just render children
  if (import.meta.env.PROD) {
    return <>{children}</>;
  }
  
  // Show critical failure overlay in development
  const hasCriticalFailures = report && report.criticalFailures.length > 0;
  
  if (hasCriticalFailures && showOverlay && !dismissed) {
    return (
      <>
        {children}
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-destructive/10 border-2 border-destructive rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center">
                <span className="text-xl">🚨</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-destructive">
                  IWASP Anti-Régression
                </h2>
                <p className="text-sm text-destructive/80">
                  {report.criticalFailures.length} fonctionnalité(s) critique(s) manquante(s)
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {report.criticalFailures.map((failure) => (
                <div 
                  key={failure.feature.id}
                  className="bg-destructive/20 rounded-lg p-3 text-sm"
                >
                  <p className="font-semibold text-destructive">
                    {failure.feature.name}
                  </p>
                  <p className="text-destructive/70 text-xs">
                    ID: {failure.feature.id}
                  </p>
                  <p className="text-destructive/70 text-xs">
                    {failure.feature.description}
                  </p>
                  {failure.error && (
                    <p className="text-destructive/60 text-xs mt-1">
                      Erreur: {failure.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setDismissed(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
              >
                Ignorer (dev)
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Recharger
              </button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Cette alerte n'apparaît qu'en développement
            </p>
          </div>
        </div>
      </>
    );
  }
  
  // Show warning badge for non-critical issues
  if (report && report.warnings.length > 0 && !dismissed) {
    return (
      <>
        {children}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setDismissed(true)}
            className="bg-amber-500/90 text-amber-950 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 hover:bg-amber-500 transition-colors"
          >
            <span>⚠️</span>
            <span>{report.warnings.length} avertissement(s)</span>
            <span className="text-amber-950/60">×</span>
          </button>
        </div>
      </>
    );
  }
  
  return <>{children}</>;
}

export default FeatureValidationProvider;
