const APP_PREFIX = 'Budget-Tracker';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    './index.html',
    './css/style.css',
    './js/index.js'
];

// respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('fetch request: ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
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
});

// cahche resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache: ' + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    )
});

// deleted outdated cached resources
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            // filter out keys with this app prefix to create keep list
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cache: ' + keyList[i])
                }
            }));
        })
    )
});