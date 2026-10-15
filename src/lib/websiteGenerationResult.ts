/** A saved site does not itself confirm delivery of email or blog access. */
export function websiteGenerationNotice(result: { alreadyGenerated?: boolean; notificationRetried?: boolean; blogEditorAvailable?: boolean; emailSent?: boolean }): string | null {
  if (result.alreadyGenerated && result.notificationRetried === false) return "Le site existe déjà. L’accès au blog et l’envoi de l’email n’ont pas été revérifiés. Contactez l’équipe si vous ne les avez pas reçus.";
  const details: string[] = [];
  if (result.blogEditorAvailable === false) details.push("L’accès au blog n’a pas pu être créé ; contactez l’équipe pour le rétablir.");
  if (result.emailSent === false) details.push("L’email de notification n’a pas été envoyé. Conservez le lien de votre site.");
  return details.length ? details.join(" ") : null;
}
