/**
 * Country and timezone hint from Vercel request headers.
 * The SPA rewrite must not capture this path (see vercel.json).
 */
export const config = { runtime: "edge" };

export default function handler(request: Request) {
  const country = request.headers.get("x-vercel-ip-country") ?? "";
  const timeZone = request.headers.get("x-vercel-ip-timezone") ?? "";
  return new Response(JSON.stringify({ country, timeZone }), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, max-age=300",
    },
  });
}
