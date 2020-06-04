
if('serviceWorker' in navigator){
	window.addEventListener('load', function(){
		navigator.serviceWorker
		.register('cachedPages.js')
		.then(function(reg){console.log("serviceWorker:registered")})
		.catch(function(err){console.log(`ServiceWorker: Error: ${err}`)});
	})
}