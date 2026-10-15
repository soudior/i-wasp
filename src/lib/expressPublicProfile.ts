import type { ExpressCustomerInfo } from '@/contexts/ExpressCheckoutContext';
/** Shipping details are never implicitly published. Old drafts have no consent. */
export function expressPublicProfile(info: ExpressCustomerInfo) {
  if (info.publishNameOnly !== true) return null;
  const first = info.firstName.trim(), last = info.lastName.trim();
  if (!first || !last) throw new Error('Prénom et nom requis pour le profil public.');
  return { first_name: first, last_name: last, email: null, phone: null, template: 'signature' };
}
export function normalizeExpressPhone(value: string) {
  return value.replace(/[\s.()-]/g, '');
}
