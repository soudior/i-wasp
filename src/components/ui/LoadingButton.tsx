/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOADING BUTTON — MOBILE-FIRST CTA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A button that:
 * - Triggers on FIRST tap (no double-tap required)
 * - Disables immediately after tap
 * - Shows loading state during async operations
 * - Has minimum 48px height for easy touch
 * - Prevents pointer events during loading
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  /** Loading state - disables button and shows spinner */
  isLoading?: boolean;
  /** Text to show during loading (optional) */
  loadingText?: string;
  /** Prevent double-tap automatically */
  preventDoubleTap?: boolean;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      isLoading = false,
      loadingText,
      preventDoubleTap = true,
      disabled,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const [isClicked, setIsClicked] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    // Reset clicked state when loading completes
    React.useEffect(() => {
      if (!isLoading) {
        // Small delay before re-enabling to prevent accidental double-clicks
        timeoutRef.current = setTimeout(() => {
          setIsClicked(false);
        }, 300);
      }
    }, [isLoading]);

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent if already clicked/loading
        if (isClicked || isLoading) {
          e.preventDefault();
          return;
        }

        if (preventDoubleTap) {
          setIsClicked(true);
        }

        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        onClick?.(e);
      },
      [isClicked, isLoading, preventDoubleTap, onClick]
    );

    const isDisabled = disabled || isLoading || (preventDoubleTap && isClicked);
    const showLoading = isLoading || isClicked;

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          // Ensure minimum height for touch
          "min-h-[48px]",
          // Prevent pointer events during loading
          showLoading && "pointer-events-none",
          // Visual feedback
          "transition-all duration-100",
          className
        )}
        {...props}
      >
        {showLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
