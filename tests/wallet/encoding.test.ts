// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { base64urlEncode } from '../../supabase/functions/_shared/walletEncoding';

describe('Google Wallet JWT UTF-8 encoding', () => {
  it.each([
    ['accents', 'Élodie à Paris, Café, cœur'],
    ['Arabic', 'مرحبا بالعالم'],
    ['emoji', '🤝🌍 👩🏽‍💻'],
    ['combined text', 'Élodie مرحبًا 🌍'],
    ['combining characters', 'Cafe\u0301'],
  ])('round trips JSON claims containing %s', (_label, name) => {
    const claims = {
      aud: 'google',
      typ: 'savetowallet',
      payload: {
        genericObjects: [{
          header: { defaultValue: { language: 'fr-FR', value: name } },
          textModulesData: [{ id: 'company', header: 'Entreprise', body: name }],
        }],
      },
    };
    const json = JSON.stringify(claims);
    const encoded = base64urlEncode(json);

    // Buffer is an independent reference, not the encoder under test.
    expect(encoded).toBe(Buffer.from(json, 'utf8').toString('base64url'));
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))).toEqual(claims);
  });

  it.each(['', 'a', 'ab', 'abc'])('omits padding for %j', input => {
    const encoded = base64urlEncode(input);
    expect(encoded).toBe(Buffer.from(input, 'utf8').toString('base64url'));
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('preserves every binary signature byte without UTF-8 conversion', () => {
    const signature = Uint8Array.from({ length: 256 }, (_, index) => index);
    const encoded = base64urlEncode(signature);
    expect(encoded).toBe(Buffer.from(signature).toString('base64url'));
    expect(encoded).not.toMatch(/[+/=]/);
    expect(Buffer.from(encoded, 'base64url')).toEqual(Buffer.from(signature));
  });
});
