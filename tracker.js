// Karte initialisieren
const map = L.map('map').setView([48.4507, 10.6535], 20);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Spielfeld-KML laden
omnivore.kml('spielfeld.kml')
  .on('ready', function () {
    this.eachLayer(layer => {
      layer.setStyle({
        color: '#ff0000',
        weight: 2,
        fillOpacity: 0.15
      });

      const name = layer.feature?.properties?.name;
      if (name) {
        layer.bindTooltip(name, { permanent: false, direction: "top" });
      }
    });
    console.log("✅ spielfeld.kml geladen");
  })
  .on('error', e => console.error("❌ Fehler beim Laden von spielfeld.kml:", e))
  .addTo(map);

// Fallback-Kuhdaten
const fallbackKuehe = [
  { name: "Moritz", lat: 48.4505, lon: 10.653 },
  { name: "Uli", lat: 48.4508, lon: 10.654 },
  { name: "Uschi", lat: 48.451, lon: 10.655 }
];

// Marker setzen (mit Bild)
function setKuhMarker(name, lat, lon) {
  const icon = L.icon({
    iconUrl: `${name}.jpg`,
    iconSize: [50, 50],
    className: 'tracker-icon'
  });
  L.marker([lat, lon], { icon }).addTo(map).bindPopup(name);
}

// Live-Tracker oder Fallback laden
async function updateTrackers() {
  try {
    const response = await fetch("https://tracki-proxy.onrender.com/api/trackers");
    if (!response.ok) throw new Error("Kein Zugriff auf Tracker");

    const data = await response.json();
    console.log("📡 Live-Tracker geladen:", data);

    if (!Array.isArray(data) || data.length === 0) throw new Error("Leere Trackerliste");

    data.forEach(t => {
      if (t.latitude && t.longitude) {
        setKuhMarker(t.name || "🐄", t.latitude, t.longitude);
      }
    });
  } catch (err) {
    console.warn("⚠️ Fallback: Tracker nicht verfügbar – verwende feste Positionen");
    fallbackKuehe.forEach(k => setKuhMarker(k.name, k.lat, k.lon));
  }
}

// Start
updateTrackers();
setInterval(updateTrackers, 60000); // alle 60 Sekunden aktualisieren
