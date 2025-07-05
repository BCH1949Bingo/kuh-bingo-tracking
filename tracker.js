
// Initialisierung der Karte
const map = L.map('map').setView([48.46, 10.73], 17);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// KML-Dateien laden
omnivore.kml('Hintergrund.kml').addTo(map);
omnivore.kml('Linie_Felder.kml').addTo(map);
omnivore.kml('Spielfeld_Rand.kml').addTo(map);

// Dummy-Positionen anzeigen (echte API-Integration mit OAuth erfordert Server-Proxy)
trackerConfig.trackers.forEach(t => {
  const latlng = [48.460 + Math.random() * 0.001, 10.736 + Math.random() * 0.001];
  const icon = L.icon({
    iconUrl: t.image,
    iconSize: [50, 50],
    className: 'tracker-icon'
  });
  L.marker(latlng, { icon }).addTo(map).bindPopup(t.name);
});
