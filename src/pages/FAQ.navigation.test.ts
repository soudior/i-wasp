import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('FAQ order navigation', () => {
  it('sends both order links to the registered offer-selection route', () => {
    const faq = readFileSync(path.resolve(process.cwd(), 'src/pages/FAQ.tsx'), 'utf8');
    const routes = readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf8');
    expect(faq.match(/to="\/express\/offre"/g)).toHaveLength(2);
    expect(faq).not.toContain('/express/pack');
    expect(routes).toContain('path="/express/offre" element={<ExpressCheckoutProvider><ExpressOffre /></ExpressCheckoutProvider>}');
  });
});
