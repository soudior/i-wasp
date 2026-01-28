/**
 * Cache Version Manager
 * Forces cache invalidation for external users with stale PWA caches
 */

// INCREMENT THIS VERSION when deploying critical updates
// This will force all users to get fresh content
const CACHE_VERSION = "2026-01-28-v1";
const VERSION_KEY = "iwasp:cache_version";
const REFRESH_ATTEMPT_KEY = "iwasp:cache_refresh_attempted";

function safeGetLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocal(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore (private mode / blocked storage)
  }
}

function safeRemoveLocal(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function safeGetSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetSession(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function checkAndClearStaleCache(): boolean {
  try {
    const storedVersion = safeGetLocal(VERSION_KEY);
    const alreadyAttemptedThisSession = safeGetSession(REFRESH_ATTEMPT_KEY) === "1";
    
    if (storedVersion !== CACHE_VERSION) {
      console.log(`[CacheVersion] Stale cache detected: ${storedVersion} → ${CACHE_VERSION}`);

      // Anti-boucle: si le stockage local est indisponible (Safari/private mode),
      // on évite de reloader en boucle et on laisse l'app essayer de démarrer.
      if (alreadyAttemptedThisSession) {
        safeSetLocal(VERSION_KEY, CACHE_VERSION);
        return false;
      }
      safeSetSession(REFRESH_ATTEMPT_KEY, "1");
      
      // Clear all caches and service workers
      void clearAllCachesSync();
      
      // Store new version
      safeSetLocal(VERSION_KEY, CACHE_VERSION);
      
      return true; // Cache was stale
    }
    
    return false; // Cache is fresh
  } catch (error) {
    console.error("[CacheVersion] Error checking cache version:", error);
    return false;
  }
}

async function clearAllCachesSync(options?: { reload?: boolean }): Promise<void> {
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
    if (options?.reload !== false) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    
  } catch (error) {
    console.error("[CacheVersion] Error clearing caches:", error);
  }
}

export function forceRefresh(): void {
  safeRemoveLocal(VERSION_KEY);
  void clearAllCachesSync();
}
