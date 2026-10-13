const AUTH_USER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function buildOwnedOrderPhotoPath(
  userId: string,
  fileName: string,
  timestamp = Date.now(),
): string {
  if (!AUTH_USER_ID_PATTERN.test(userId)) {
    throw new Error("Identifiant utilisateur invalide");
  }

  const safeFileName = fileName
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "photo.jpg";

  return `${userId}/order-photos/${timestamp}-${safeFileName}`;
}
