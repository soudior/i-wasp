/**
 * i-wasp Push Notification Service Worker
 * Handles push notifications for profile visitors
 */

self.addEventListener('push', function(event) {
  console.log('[SW Push] Received push event');
  
  let data = {
    title: 'i-wasp',
    body: 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'iwasp-notification',
    data: {}
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        icon: payload.icon || data.icon,
        badge: payload.badge || data.badge,
        tag: payload.tag || data.tag,
        data: payload.data || {}
      };
    } catch (e) {
      console.error('[SW Push] Error parsing push data:', e);
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
    vibrate: [100, 50, 100],
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW Push] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Default action: open the card URL or homepage
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if there's already an open window
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('[SW Push] Notification closed');
});

// Handle service worker install
self.addEventListener('install', function(event) {
  console.log('[SW Push] Installing push service worker');
  self.skipWaiting();
});

// Handle service worker activate
self.addEventListener('activate', function(event) {
  console.log('[SW Push] Activating push service worker');
  event.waitUntil(clients.claim());
});
