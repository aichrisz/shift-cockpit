/* Shift Cockpit — minimal app-shell service worker (BASE_URL aware via registration.scope) */
const CACHE_NAME = 'shift-cockpit-shell-v0.2'

function basePath() {
  // scope is absolute URL ending with /
  try {
    return new URL(self.registration.scope).pathname
  } catch {
    return '/'
  }
}

function shellUrls() {
  const base = basePath()
  const prefix = base.endsWith('/') ? base : base + '/'
  return [
    prefix,
    prefix + 'index.html',
    prefix + 'manifest.webmanifest',
    prefix + 'favicon.svg',
    prefix + 'icons/icon.svg',
    prefix + 'icons/icon-maskable.svg',
  ]
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          shellUrls().map((url) =>
            cache.add(url).catch(() => {
              /* optional asset missing — ignore */
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Network-first for navigations; cache fallback for offline shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => {
          const cached =
            (await caches.match(request)) ||
            (await caches.match(basePath() + 'index.html')) ||
            (await caches.match(basePath()))
          return cached || new Response('Offline', { status: 503, statusText: 'Offline' })
        }),
    )
    return
  }

  // Cache-first for same-origin static shell assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((response) => {
          if (response.ok && (url.pathname.endsWith('.svg') || url.pathname.endsWith('.webmanifest') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js'))) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached)
    }),
  )
})
