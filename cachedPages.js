const cacheName = "v1";

const cacheAssets=[
'index.html',
'script.js',
'menu.png',
'send.png',
'send2.png'
];

//call install event
self.addEventListener('install', function(e){
	console.log('service worker: installed');

	e.waitUntil(
		caches
		.open(cacheName)
		.then(function (cache){
			console.log('service worker: caching Files');
			cache.addAll(cacheAssets);
		})
		.then(function(){
			self.skipWaiting();
		})
		);
});


//call the activate event
self.addEventListener('activate', function(e){
	console.log('service worker: activated'); 
	//REMOVE UNWANTED CACHES
	e.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function (cache){
					if(cache !== cacheName){
						console.log('Service worker clearing old Caches');
						return caches.delete(cache);
						}
					})
				)
		})
		);
});


//CALL FETCH EVENT
/*
self.addEventListener('fetch',function(e){
	//console.log('service worker: Fetching...');
	e.respondWith(
		fetch(e.request).catch(function(){
			return caches.match(e.request);
		})
		)
});

*/


self.addEventListener('fetch', function(event) {
//console.log('service worker: Fetching...');
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
