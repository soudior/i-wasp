/**
 * Cache Version Manager
 * Forces cache invalidation for external users with stale PWA caches
 */

// INCREMENT THIS VERSION when deploying critical updates
// This will force all users to get fresh content
const CACHE_VERSION = "2025-01-25-v3";
const VERSION_KEY = "iwasp:cache_version";

export function checkAndClearStaleCache(): boolean {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    
    if (storedVersion !== CACHE_VERSION) {
      console.log(`[CacheVersion] Stale cache detected: ${storedVersion} → ${CACHE_VERSION}`);
      
      // Clear all caches and service workers
      clearAllCachesSync();
      
      // Store new version
      localStorage.setItem(VERSION_KEY, CACHE_VERSION);
      
      return true; // Cache was stale
    }
    
    return false; // Cache is fresh
  } catch (error) {
    console.error("[CacheVersion] Error checking cache version:", error);
    return false;
  }
}

async function clearAllCachesSync(): Promise<void> {
  try {
    // 1. Unregister all service workers
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("[CacheVersion] Service worker unregistered");
      }
    }

    // 2. Clear Cache Storage (PWA caches)
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
        console.log(`[CacheVersion] Cache deleted: ${name}`);
      }
    }

    // 3. Force reload to get fresh content
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
  } catch (error) {
    console.error("[CacheVersion] Error clearing caches:", error);
  }
}

export function forceRefresh(): void {
  localStorage.removeItem(VERSION_KEY);
  clearAllCachesSync();
}
