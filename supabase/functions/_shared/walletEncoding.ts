export function base64urlEncode(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function googleWalletIds(issuer: unknown, id: string) {
  if (typeof issuer !== 'string' || !/^\d+$/.test(issuer)) throw new Error('Google Wallet issuer configuration required');
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error('Invalid card identifier');
  return { classId: `${issuer}.iwasp_business_card`, objectId: `${issuer}.${id}` };
}
