
    let map = L.map('map')
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=xinj6wTWg04tHLy3VyQd', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

    map.setView([52.238208, 6.857163], 12);

    let marker = L.marker([52.239848233169965, 6.849859153909583]).addTo(map);
    marker.bindPopup("<iframe src='https://www.google.com/maps?q=40.7590403,-74.039271+&output=embed'></iframe>");
