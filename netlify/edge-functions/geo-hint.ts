/**
 * Same-origin country hint for the public price display.
 * Netlify provides context.geo. Vercel does not run this file; the client
 * ignores a non-JSON response and keeps the timezone/locale result.
 */
export default async (_request: Request, context: { geo?: { country?: { code?: string } } }) => {
  const country = context.geo?.country?.code ?? "";
  return new Response(JSON.stringify({ country }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, max-age=300",
    },
  });
};

export const config = { path: "/geo-hint" };
