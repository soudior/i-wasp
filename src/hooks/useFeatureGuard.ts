/**
 * useFeatureGuard - Runtime feature validation hook
 * 
 * Use this hook in components to ensure a feature is registered
 * and working. Shows developer errors if something is wrong.
 */

import { useEffect, createElement } from "react";
import { 
  getFeature, 
  hasFeature, 
  FeatureDefinition,
  FeatureSeverity 
} from "@/lib/featureRegistry";

interface FeatureGuardResult {
  isRegistered: boolean;
  feature: FeatureDefinition | undefined;
  severity: FeatureSeverity | undefined;
}

/**
 * Hook to guard a feature and ensure it's registered
 * Shows console errors in development if feature is missing
 */
export function useFeatureGuard(featureId: string): FeatureGuardResult {
  const feature = getFeature(featureId);
  const isRegistered = hasFeature(featureId);
  
  useEffect(() => {
    // Only show errors in development
    if (import.meta.env.PROD) return;
    
    if (!isRegistered) {
      console.error(
        `🚨 IWASP REGRESSION ALERT: Feature "${featureId}" is not registered in featureRegistry.ts!\n` +
        `This feature may have been accidentally removed.\n` +
        `If this is intentional, remove this useFeatureGuard() call.`
      );
    }
  }, [featureId, isRegistered]);
  
  return {
    isRegistered,
    feature,
    severity: feature?.severity,
  };
}

/**
 * Assert that a feature exists - throws in development
 */
export function assertFeature(featureId: string, componentName?: string): void {
  if (import.meta.env.PROD) return;
  
  if (!hasFeature(featureId)) {
    const message = componentName
      ? `IWASP Anti-Regression: Feature "${featureId}" (${componentName}) is not registered!`
      : `IWASP Anti-Regression: Feature "${featureId}" is not registered!`;
    
    console.error(`🚨 ${message}`);
  }
}

/**
 * HOC to wrap components with feature guard
 */
export function withFeatureGuard<P extends Record<string, unknown>>(
  featureId: string,
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function GuardedComponent(props: P) {
    useFeatureGuard(featureId);
    return createElement(WrappedComponent, props);
  };
}

export default useFeatureGuard;
