const API_KEY = "6bcUNwSRTBH9Ic2UFvHg"

// Create the map
let map = L.map('map');
L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${API_KEY}`, {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

// Get the users' geolocation using the browser's geolocation API
navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Set the map's center to the user's geolocation
    map.setView([latitude, longitude], 14);

    // Circle to illustrate the location centre
    L.circleMarker([latitude, longitude], {
        radius: 9,
        fillColor: '#0044FFFF',
        color: 'white',
        weight: 3,
        fillOpacity: 1,
    }).addTo(map);

    // Circle to illustrate the approximate location / possible location error
    L.circle([latitude, longitude], {
        radius: 500,
        color: '#0044FFFF',
        fillOpacity: 0.1,
        weight: 1.5,
        dashArray: '5, 10', // Configure the dashed stroke
    }).addTo(map);
});
