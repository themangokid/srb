// Service Worker — cache-first with background refresh
const CACHE = 'srb-v1'

// On install: cache the shell immediately
self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(['./index.html'])
    )
  )
})

// On activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch: cache-first, update cache in background (stale-while-revalidate)
self.addEventListener('fetch', e => {
  // Only handle GET requests for same-origin or Vite assets
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  // Don't cache cross-origin requests (fonts, CDN, YouVersion, etc.)
  if (url.origin !== self.location.origin) return

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request)
      const fetchPromise = fetch(e.request).then(res => {
        if (res.ok) cache.put(e.request, res.clone())
        return res
      }).catch(() => null)

      // Return cached immediately, update in background
      return cached || fetchPromise
    })
  )
})
