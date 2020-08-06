importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
          console.log(`Workbox berhasil dimuat`);
          //daftarkan appshel / precaching
          workbox.precaching.precacheAndRoute([
            {url: '/', revision: '1'},
            {url: '/nav.html', revision: '1'},
            {url: '/index.html', revision: '1'},
            {url: '/team-detail.html', revision: '1'},
            {url: '/css/materialize.min.css', revision: '1'},
            {url: '/js/materialize.min.js', revision: '1'},
            {url: '/manifest.json', revision: '1'},
            {url: '/js/db.js', revision: '1'},
            {url: '/js/idb.js', revision: '1'},
            {url: '/js/nav.js', revision: '1'},
            {url: '/js/api.js', revision: '1'},
            {url: '/js/sw-add.js', revision: '2'},
            {url: '/images/nodatasaved.png', revision: '1'},
            {url: '/images/favicon.png"', revision: '1'},
            {url: '/images/icon1.png"', revision: '1'},
            {url: '/images/icon2.png"', revision: '1'},
            {url: '/images/icon3.png"', revision: '1'},
            {url: '/images/icon4.png"', revision: '1'},
            {url: '/images/plstars.jpg', revision: '1'},
            {url: '/images/pl.png', revision: '1'},
        ]);
        //cachefrist = mengambil gambar cache yang tersimpan dulu, jika tdk ada / expired request ke network
        workbox.routing.registerRoute(
          /.*(?:png|gif|jpg|jpeg|svg)$/,
          workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
              new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
              }),
              new workbox.expiration.Plugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              }),
            ]
          })
        );
        //stale while revalidate =  mengupdate ketika API di dipanggil
        workbox.routing.registerRoute(
          new RegExp('https://api.football-data.org/v2/'),
          workbox.strategies.staleWhileRevalidate()
        )
        //cacching googlefont
        workbox.routing.registerRoute(
            /^https:\/\/fonts\.googleapis\.com/,
            workbox.strategies.staleWhileRevalidate({
                cacheName: 'google-fonts-stylesheets',
            })
        );
        // menyimpan cache font selama 1 tahun, max enty 30
        workbox.routing.registerRoute(
            /^https:\/\/fonts\.gstatic\.com/,
            workbox.strategies.cacheFirst({
                cacheName: 'google-fonts-webfonts',
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200],
                    }),
                    new workbox.expiration.Plugin({
                        maxAgeSeconds: 60 * 60 * 24 * 365,
                        maxEntries: 30,
                    }),
                ],
            })
        );
        //mengupdate semua yang ada di URI /pages
        workbox.routing.registerRoute(
            new RegExp('/pages/'),
            workbox.strategies.staleWhileRevalidate({
              cacheName: 'pages-wb'
            })
        );
}else{
  console.log(`Workbox gagal dimuat`);
}

//Meminta Izin Notifikasi
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (!event.action) {
        // Penguna menyentuh area notifikasi diluar action
        console.log('Notification Click.');
        return;
    }
    switch (event.action) {
        case 'yes-action':
            console.log('Pengguna memilih action yes.');
            // buka tab baru
            clients.openWindow('/index.html#saved');
            break;
        case 'no-action':
            console.log('Pengguna memilih action no');
            break;
        default:
            console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
            break;
    }
});

//push event
self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    icon: 'images/favicon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
