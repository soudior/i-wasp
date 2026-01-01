/**
 * PublicationBlocker - Bloque la publication si des critères manquent
 * 
 * Affiche une checklist claire avec statut de chaque validation
 * Bloque le bouton de publication tant que tout n'est pas validé
 */

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Check, 
  X, 
  AlertTriangle, 
  Shield,
  Lock,
  Unlock,
  Sparkles
} from "lucide-react";
import { 
  PublicationValidation, 
  ValidationResult,
  getValidationSummary 
} from "@/lib/publicationValidator";

interface PublicationBlockerProps {
  validation: PublicationValidation;
  onPublish?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

function StatusIcon({ status }: { status: ValidationResult["status"] }) {
  switch (status) {
    case "valid":
      return (
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
          <Check size={14} className="text-accent-foreground" />
        </div>
      );
    case "warning":
      return (
        <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <AlertTriangle size={14} className="text-yellow-600" />
        </div>
      );
    case "error":
      return (
        <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
          <X size={14} className="text-destructive-foreground" />
        </div>
      );
  }
}

export function PublicationBlocker({ 
  validation, 
  onPublish,
  isSubmitting = false,
  submitLabel = "Sauvegarder ma carte"
}: PublicationBlockerProps) {
  const { canPublish, results, criticalErrors, warnings, completionScore } = validation;

  return (
    <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Header with lock status */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              canPublish ? "bg-accent/10" : "bg-destructive/10"
            }`}>
              {canPublish ? (
                <Unlock size={20} className="text-accent" />
              ) : (
                <Lock size={20} className="text-destructive" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Validation pré-publication</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {getValidationSummary(validation)}
              </p>
            </div>
          </div>
          
          {/* Completion score */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold">{completionScore}%</p>
              <p className="text-xs text-muted-foreground">Complété</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionScore}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${
              completionScore === 100 
                ? "bg-accent" 
                : completionScore >= 70 
                  ? "bg-yellow-500" 
                  : "bg-destructive"
            }`}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Critical errors first */}
        {criticalErrors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <Shield size={16} />
              <span className="text-sm font-medium">
                Éléments requis ({criticalErrors.length})
              </span>
            </div>
            {criticalErrors.map((result, index) => (
              <ValidationItem key={result.id} result={result} index={index} />
            ))}
          </div>
        )}

        {/* All results */}
        <div className="space-y-2">
          {criticalErrors.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground pt-2">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Tous les critères</span>
            </div>
          )}
          
          {results
            .filter(r => !criticalErrors.includes(r))
            .map((result, index) => (
              <ValidationItem 
                key={result.id} 
                result={result} 
                index={index + criticalErrors.length} 
              />
            ))}
        </div>

        {/* Warnings summary */}
        {warnings.length > 0 && canPublish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-600" />
              <p className="text-sm text-yellow-700">
                {warnings.length} amélioration{warnings.length > 1 ? "s" : ""} suggérée{warnings.length > 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>
        )}

        {/* Success message */}
        {canPublish && warnings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-accent">
              <Check size={18} />
              <p className="font-medium">Carte parfaitement validée</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Tous les critères de qualité IWASP sont respectés
            </p>
          </motion.div>
        )}

        {/* Block message */}
        {!canPublish && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
          >
            <div className="flex items-center gap-2 text-destructive">
              <Lock size={18} />
              <p className="font-medium">Publication bloquée</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Complétez les éléments requis pour débloquer la publication
            </p>
          </motion.div>
        )}

        {/* Action button */}
        {onPublish && (
          <button
            onClick={onPublish}
            disabled={!canPublish || isSubmitting}
            className={`w-full h-14 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
              canPublish
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : canPublish ? (
              <>
                <Check size={20} />
                <span>{submitLabel}</span>
              </>
            ) : (
              <>
                <Lock size={20} />
                <span>Compléter les champs requis</span>
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

function ValidationItem({ 
  result, 
  index 
}: { 
  result: ValidationResult; 
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        result.status === "valid"
          ? "bg-accent/5 border border-accent/10"
          : result.status === "warning"
            ? "bg-yellow-500/5 border border-yellow-500/10"
            : "bg-destructive/5 border border-destructive/10"
      }`}
    >
      <StatusIcon status={result.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{result.label}</p>
          {result.required && result.status === "error" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive font-medium">
              REQUIS
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {result.message}
        </p>
      </div>
    </motion.div>
  );
}

export default PublicationBlocker;
