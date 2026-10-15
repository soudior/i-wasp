import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ClientForm from './ClientForm';

vi.mock('@/integrations/supabase/client', () => ({ supabase: { storage: { from: vi.fn() } } }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

describe('creation studio presentation', () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(async () => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root.render(<MemoryRouter><ClientForm /></MemoryRouter>));
  });
  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });
  it('gives every visible text input an associated visible label', () => {
    const inputs = [...container.querySelectorAll('input:not([type=file])')];
    expect(inputs).toHaveLength(11);
    for (const input of inputs) {
      expect(input.id).toBeTruthy();
      expect(container.querySelector(`label[for="${input.id}"]`)?.textContent?.trim()).toBeTruthy();
    }
    expect(container.querySelector('textarea')?.getAttribute('aria-label')).toBe('Bio / Description');
  });
  it('keeps the four original template choices and exposes selected state', async () => {
    const choices = [...container.querySelectorAll('button[aria-pressed]')];
    expect(choices.map(choice => choice.textContent)).toEqual(['Signature', 'Minimal', 'Boutique', 'Ultra Luxe']);
    expect(choices[0].getAttribute('aria-pressed')).toBe('true');
    await act(async () => (choices[2] as HTMLButtonElement).click());
    expect(choices[2].getAttribute('aria-pressed')).toBe('true');
    expect(choices[0].getAttribute('aria-pressed')).toBe('false');
  });
  it('keeps home/contact navigation and only one submit action', () => {
    expect(container.querySelector('a[aria-label="i-wasp, accueil"]')?.getAttribute('href')).toBe('/');
    expect(container.querySelector('a[href="/contact"]')).not.toBeNull();
    expect(container.querySelectorAll('button[type=submit]')).toHaveLength(1);
    expect(container.querySelector('button[type=submit]')?.textContent).toContain('Demander ma carte NFC + Wallet');
  });
});
