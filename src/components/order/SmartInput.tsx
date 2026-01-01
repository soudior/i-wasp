/**
 * SmartInput - Input with real-time validation and auto-correction
 * 
 * Features:
 * - Visual validation status (✓ green / ✗ red)
 * - Auto-correction on blur
 * - Premium, human-friendly error messages
 * - Disabled state when form is invalid
 */

import { useState, useCallback, forwardRef, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SmartInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onNormalize?: (value: string) => string;
  validate?: (value: string) => { isValid: boolean; message?: string };
  error?: string;
  required?: boolean;
  helpText?: string;
}

export const SmartInput = forwardRef<HTMLInputElement, SmartInputProps>(
  (
    {
      label,
      value,
      onChange,
      onNormalize,
      validate,
      error,
      required = false,
      helpText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Validate current value
    const validationResult = validate?.(value);
    const isValid = validationResult?.isValid ?? true;
    const validationMessage = validationResult?.message;

    // Show validation status only after user has interacted
    const showValidation = isDirty && !isFocused && value.length > 0;
    const showError = (error || validationMessage) && isDirty;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDirty(true);
        onChange(e.target.value);
      },
      [onChange]
    );

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      setIsDirty(true);

      // Auto-correct on blur
      if (onNormalize && value) {
        const normalized = onNormalize(value);
        if (normalized !== value) {
          onChange(normalized);
        }
      }
    }, [value, onNormalize, onChange]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium",
              showError && "text-destructive"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </Label>

          {/* Validation status indicator */}
          <AnimatePresence mode="wait">
            {isPending && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </motion.div>
            )}
            {showValidation && !isPending && isValid && (
              <motion.div
                key="valid"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-xs text-emerald-600"
              >
                <Check className="h-3.5 w-3.5" />
              </motion.div>
            )}
            {showValidation && !isPending && !isValid && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-xs text-destructive"
              >
                <AlertCircle className="h-3.5 w-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Input
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            className={cn(
              "transition-all duration-200",
              showValidation && isValid && "border-emerald-500 focus-visible:ring-emerald-500/20",
              showError && "border-destructive focus-visible:ring-destructive/20",
              className
            )}
            {...props}
          />
        </div>

        {/* Error or help text */}
        <AnimatePresence mode="wait">
          {showError ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-destructive"
            >
              {error || validationMessage}
            </motion.p>
          ) : helpText ? (
            <motion.p
              key="help"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-muted-foreground"
            >
              {helpText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

SmartInput.displayName = "SmartInput";

export default SmartInput;
