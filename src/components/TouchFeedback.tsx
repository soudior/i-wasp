/**
 * Touch Feedback Component
 * 
 * Provides haptic-style visual feedback on touch.
 * Wraps any element to add iOS-like tap animations.
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TouchFeedbackProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  scale?: number;
}

export const TouchFeedback = forwardRef<HTMLDivElement, TouchFeedbackProps>(
  ({ children, className, disabled = false, scale = 0.97, ...props }, ref) => {
    if (disabled) {
      return (
        <div ref={ref} className={className} {...(props as any)}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn("touch-manipulation", className)}
        whileTap={{ scale }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17,
          mass: 0.5 
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

TouchFeedback.displayName = "TouchFeedback";

/**
 * Tap animation for buttons and interactive elements
 */
export const tapAnimation = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

/**
 * Press animation for larger elements like cards
 */
export const pressAnimation = {
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

/**
 * Quick tap for small buttons
 */
export const quickTapAnimation = {
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 500, damping: 15 }
};
