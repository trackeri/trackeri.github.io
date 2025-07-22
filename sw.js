// sw.js - Ovo je datoteka Service Workera

// Slušajte 'install' događaj. U ovom trenutku možete keširati statičke resurse.
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instaliran.');
    // Skip waiting to activate the new service worker immediately.
    self.skipWaiting();
});

// Slušajte 'activate' događaj. U ovom trenutku možete čistiti stare keševe.
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Aktiviran.');
    // Claim clients to take control of all pages under its scope immediately.
    event.waitUntil(clients.claim());
});

// Slušajte 'fetch' događaj. Ovdje možete presresti mrežne zahtjeve i poslužiti keširane resurse.
self.addEventListener('fetch', (event) => {
    // Za sada ne radimo ništa posebno s fetch događajima.
    // Ovdje bi se mogla dodati logika za offline podršku.
    // console.log('Service Worker: Fetching', event.request.url);
});

// Slušajte 'push' događaj. Ovo je ključno za primanje push notifikacija.
self.addEventListener('push', (event) => {
    console.log('Service Worker: Primljen push događaj.', event);
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Nova Notifikacija';
    const options = {
        body: data.body || 'Primili ste novu obavijest.',
        icon: data.icon || 'https://placehold.co/48x48/007bff/FFFFFF?text=🔔', // Defaultna ikona
        badge: data.badge || 'https://placehold.co/48x48/007bff/FFFFFF?text=🔔', // Ikona za Android statusnu traku
        tag: data.tag || 'default-notification', // Grupiranje notifikacija
        renotify: data.renotify !== undefined ? data.renotify : true, // Ponovno prikaži ako postoji ista oznaka
        data: data.data || {} // Dodatni podaci za notifikaciju
    };

    // Prikaz notifikacije
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Slušajte 'notificationclick' događaj. Ovo se događa kada korisnik klikne na notifikaciju.
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Kliknuta notifikacija.', event);
    event.notification.close(); // Zatvori notifikaciju nakon klika

    // Otvorite prozor preglednika ili prebacite na postojeći prozor
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                // Ako je aplikacija već otvorena, fokusirajte je
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Ako aplikacija nije otvorena, otvorite novi prozor
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
