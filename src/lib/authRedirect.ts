function hasUnsafeCharacters(value: string): boolean {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return character === "\\" || code <= 32 || code === 127;
  });
}

/** N'accepte que des chemins internes, jamais une URL ou un hôte externe. */
export function safeAuthReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || hasUnsafeCharacters(value)) {
    return "/dashboard";
  }
  // Les chemins encodés ambigus peuvent devenir un hôte externe après décodage.
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("//") || hasUnsafeCharacters(decoded)) return "/dashboard";
  } catch {
    return "/dashboard";
  }
  return value;
}
