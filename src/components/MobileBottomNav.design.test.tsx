import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { MobileBottomNav } from './MobileBottomNav';

vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: null }) }));

describe('mobile checkout action visibility', () => {
  it('keeps global navigation on marketing pages and removes it from every Express step', async () => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 393 });
    try {
      for (const path of ['/produits', '/express/offre', '/express/infos', '/express/payer', '/express/succes']) {
        const host = document.createElement('div');
        const root = createRoot(host);
        await act(async () => root.render(<MemoryRouter initialEntries={[path]}><MobileBottomNav /></MemoryRouter>));
        expect(host.querySelector('nav') !== null).toBe(path === '/produits');
        await act(async () => root.unmount());
      }
    } finally {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalWidth });
    }
  });
});
