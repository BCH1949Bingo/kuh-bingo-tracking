// Initialisierung der Karte
const map = L.map('map').setView([48.46, 10.73], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// KML-Dateien laden
omnivore.kml('Hintergrund.kml').addTo(map);
omnivore.kml('Linie_Felder.kml').addTo(map);
omnivore.kml('Spielfeld_Rand.kml').addTo(map);

// Tracker-Positionen live abrufen
async function updateTrackers() {
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
}

updateTrackers(); // Initialer Aufruf
setInterval(updateTrackers, 60000); // alle 60 Sekunden aktualisieren

