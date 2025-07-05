// Initialisierung der Karte
const map = L.map('map').setView([48.45, 10.65], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// ✅ KML-Dateien laden mit Fehlerausgabe in der Konsole
['Hintergrund.kml', 'Linie_Felder.kml', 'Spielfeld_Rand.kml'].forEach(file => {
  omnivore.kml(file)
    .on('ready', () => console.log(`✅ ${file} geladen`))
    .on('error', (e) => console.error(`❌ Fehler in ${file}`, e))
    .addTo(map);
});

// 📍 Tracker-Positionen abrufen (falls API funktioniert)
async function updateTrackers() {
  try {
    const response = await fetch("https://tracki-proxy.onrender.com/api/trackers");
    const data = await response.json();

    data.forEach(t => {
      if (t.latitude && t.longitude) {
        const icon = L.icon({
          iconUrl: t.name + ".jpg",
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

updateTrackers();
setInterval(updateTrackers, 60000);
