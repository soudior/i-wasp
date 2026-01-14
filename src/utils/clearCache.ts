/**
 * Cache clearing utilities for PWA troubleshooting
 * Helps resolve stale build issues on mobile devices
 */

export async function clearAllCaches(): Promise<boolean> {
  try {
    // 1. Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }

    // 2. Clear Cache Storage (PWA caches)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }

    // 3. Clear session storage for stale build markers
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('iwasp:')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));

    return true;
  } catch (error) {
    console.error('[clearAllCaches] Error:', error);
    return false;
  }
}

export async function clearCacheAndReload(): Promise<void> {
  await clearAllCaches();
  // Force a hard reload bypassing cache
  window.location.reload();
}
