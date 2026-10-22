/**
 * Market currency for public prices.
 * Morocco → MAD. Everywhere else → EUR.
 * Detection is local-first so a blocked IP API cannot silently force EUR
 * on visitors whose device is clearly in Morocco.
 */
export const MOROCCO_TIME_ZONES = ["Africa/Casablanca", "Africa/El_Aaiun"] as const;

export function isMoroccoTimeZone(timeZone: string | null | undefined): boolean {
  return !!timeZone && (MOROCCO_TIME_ZONES as readonly string[]).includes(timeZone);
}

export function isMoroccoLocale(languages: readonly string[] | null | undefined): boolean {
  return (languages ?? []).some((language) => {
    const normalized = language.trim().toLowerCase().replace(/_/g, "-");
    return normalized === "ma" || normalized.endsWith("-ma");
  });
}

export function detectMarketCurrency(input: {
  timeZone?: string | null;
  languages?: readonly string[] | null;
  countryCode?: string | null;
}): "MAD" | "EUR" {
  if (isMoroccoTimeZone(input.timeZone) || isMoroccoLocale(input.languages)) return "MAD";
  if ((input.countryCode ?? "").trim().toUpperCase() === "MA") return "MAD";
  return "EUR";
}
