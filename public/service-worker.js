const APP_PREFIX = 'Budget-Tracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    './index.html',
    './css/style.css',
    './js/index.js'
];

// respond with cached resources
self.addEventListener('fetch', function(e) {
    console.log('fetch request: ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(request) {
            // if cache is available, respond with cached assets
            if (request) {
                console.log('responding with cache: ' + e.request.url);
                return request;
            } else {
                // if no cache, try fetching
                console.log('file is not cached, fetching: ' + e.request.url);
                return fetch(e.request);
            }
        })
    )
})