let cacheName = 'cache-worker-v1';
// these are automatically cached when the site is first loaded
let initialAssets = [
    './',
    'index.html',
    'index.js',
    'index.css',
    'manifest.json',
    'android-chrome-512x512.png',
    'favicon.ico',
    'apple-touch-icon.png',
    'styles/reset.css',
    // the rest will be auto-discovered
];

// initial bundle (on first load)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(initialAssets);
        })
    );
});

// clear out stale caches after service worker update
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== self.cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// default to fetching from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // other origins bypass the cache
    if (url.origin !== location.origin) {
        networkOnly(event);
    // default to fetching from cache, and updating asynchronously
    } else {
        staleWhileRevalidate(event);
    }
});

const networkOnly = (event) => {
    event.respondWith(fetch(event.request));
}

// fetch events are serviced from cache if possible, but also updated behind the scenes
const staleWhileRevalidate = (event) => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const networkUpdate = 
                fetch(event.request).then(networkResponse => {
                    caches.open(cacheName).then(
                        cache => cache.put(event.request, networkResponse));
                    return networkResponse.clone();
                }).catch(_ => /*ignore because we're probably offline*/_);
            return cachedResponse || networkUpdate;
        })
    );
}