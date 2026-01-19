const CACHE_NAME = 'kids-math-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/addition.html',
    '/subtraction.html',
    '/multiplication.html',
    '/division.html',
    '/fun-math.html',
    '/progress.html',
    '/shared-styles.css',
    '/styles.css',
    '/subtraction-styles.css',
    '/multiplication-styles.css',
    '/division-styles.css',
    '/fun-math-styles.css',
    '/progress-styles.css',
    '/app.js',
    '/base-game.js',
    '/menu.js',
    '/progress.js',
    '/manifest.json',
    '/icons/icon-192.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Cache install error:', err);
            })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
            .catch(() => {
                return caches.match('/index.html');
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
