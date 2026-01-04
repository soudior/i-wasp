/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FORM FIELD — VERROUILLÉ
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Champ de formulaire optimisé mobile-first:
 * - Validation immédiate
 * - Erreurs visibles et compréhensibles
 * - Feedback visuel instantané
 * - UX premium
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { forwardRef, useState, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isValid?: boolean;
  isValidating?: boolean;
  helpText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      isValid,
      isValidating,
      helpText,
      required,
      className,
      id,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    
    const showError = error && isTouched && !isFocused;
    const showValid = isValid && isTouched && !error;

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsTouched(true);
      onBlur?.(e);
    };

    return (
      <div className="space-y-2">
        {/* Label */}
        <label 
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium transition-colors",
            isFocused && "text-primary",
            showError && "text-destructive",
          )}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>

        {/* Input container */}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              "w-full h-14 px-4 rounded-xl",
              "bg-background border-2 transition-all duration-200",
              "text-foreground placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-0",
              "touch-manipulation",
              
              // Size for mobile
              "text-base", // Prevents iOS zoom on focus
              
              // States
              isFocused && "border-primary shadow-sm shadow-primary/20",
              showError && "border-destructive",
              showValid && "border-green-500",
              !isFocused && !showError && !showValid && "border-border hover:border-primary/50",
              
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            {...props}
          />

          {/* Status indicator */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {isValidating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                </motion.div>
              )}
              
              {showValid && !isValidating && (
                <motion.div
                  key="valid"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Check className="h-5 w-5 text-green-500" />
                </motion.div>
              )}
              
              {showError && !isValidating && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error / Help text */}
        <AnimatePresence mode="wait">
          {showError && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-sm text-destructive flex items-center gap-1"
            >
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {error}
            </motion.p>
          )}
          
          {helpText && !showError && (
            <motion.p
              key="help"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              {helpText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
