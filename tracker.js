// Leaflet-Karte mit festem Zentrum und Zoomstufe
const map = L.map('map').setView([48.4507, 10.6535], 18);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// ✅ KML-Datei einbinden (Spielfeld)
omnivore.kml('spielfeld.kml')
  .on('ready', () => console.log("✅ spielfeld.kml geladen"))
  .on('error', (e) => console.error("❌ Fehler beim Laden von spielfeld.kml", e))
  .addTo(map);

// 🐄 Fixe Kuhpositionen mit Icons
const kuhdaten = [
  { name: "Moritz", lat: 48.4505, lon: 10.653 },
  { name: "Uli", lat: 48.4508, lon: 10.654 },
  { name: "Uschi", lat: 48.451, lon: 10.655 }
];

kuhdaten.forEach(k => {
  const icon = L.icon({
    iconUrl: `${k.name}.jpg`,
    iconSize: [50, 50],
    className: 'tracker-icon'
  });
  L.marker([k.lat, k.lon], { icon }).addTo(map).bindPopup(k.name);
});

// Optional: Live-Tracker vorbereiten
async function updateTrackers() {
  try {
    const response = await fetch("https://tracki-proxy.onrender.com/api/trackers");
    const data = await response.json();

    data.forEach(t => {
      if (t.latitude && t.longitude) {
        const icon = L.icon({
          iconUrl: `${t.name}.jpg`,
          iconSize: [50, 50],
          className: 'tracker-icon'
        });
        L.marker([t.latitude, t.longitude], { icon }).addTo(map).bindPopup(t.name);
      }
    });
  } catch (err) {
    console.error("❌ Fehler beim Abrufen der Tracker:", err);
  }
}

// Live-Tracker bei Bedarf aktivieren:
// updateTrackers();
// setInterval(updateTrackers, 60000);
