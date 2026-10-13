/** Public fallback only. Provider diagnostics stay in existing server logs. */
export function publicAiError(_error: unknown): string {
  return "Le service de génération est momentanément indisponible. Réessayez plus tard.";
}
