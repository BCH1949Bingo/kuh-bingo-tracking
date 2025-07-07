// 🌍 Karte initialisieren mit höherem Zoomfaktor
const map = L.map('map').setView([48.4507, 10.6535], 20);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 🔗 Basis-URL für öffentliche Ressourcen auf GitHub Pages
const baseUrl = "https://bch1949bingo.github.io/kuh-bingo-tracking";

// 🗺️ KML-Feldraster einbinden
omnivore.kml('spielfeld.kml')
  .on('ready', function () {
    this.eachLayer(layer => {
      layer.setStyle({
        color: '#ff0000',
        weight: 3,
        fillOpacity: 0.2
      });

      const name = layer.feature?.properties?.name;
      if (name) {
        layer.bindTooltip(name, { permanent: false, direction: "top" });
      }
    });
    console.log("✅ spielfeld.kml geladen");
  })
  .on('error', (e) => console.error("❌ Fehler beim Laden von spielfeld.kml", e))
  .addTo(map);

// 🐄 Feste Kuhpositionen mit öffentlichen Icons
const kuhdaten = [
  { name: "Moritz", lat: 48.4505, lon: 10.653 },
  { name: "Uli", lat: 48.4508, lon: 10.654 },
  { name: "Uschi", lat: 48.451, lon: 10.655 }
];

kuhdaten.forEach(k => {
  const icon = L.icon({
    iconUrl: `${baseUrl}/${k.name}.jpg`,
    iconSize: [50, 50],
    className: 'tracker-icon'
  });
  L.marker([k.lat, k.lon], { icon }).addTo(map).bindPopup(k.name);
});

// 🔄 Live-Tracking via Trackimo-Proxy (optional)
async function updateTrackers() {
  try {
    const response = await fetch("https://tracki-proxy.onrender.com/api/trackers");
    const data = await response.json();

    data.forEach(t => {
      if (t.latitude && t.longitude) {
        const icon = L.icon({
          iconUrl: `${baseUrl}/${t.name}.jpg`,
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

// 🕐 Optional aktivieren für Live-Daten
// updateTrackers();
// setInterval(updateTrackers, 60000);
