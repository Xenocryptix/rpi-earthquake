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

// Fetch earthquake API data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'; // Earthquake API
const maxGlobalLogs = 20; // Limit the max loaded logs to speed up the load time
fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let globalLogCount = 0; // Counter for processed earthquakes

        data.features.forEach(function (quake) {
            const lat = quake.geometry.coordinates[1];
            const lng = quake.geometry.coordinates[0];
            const magnitude = quake.properties.mag;

            L.circleMarker([lat, lng], {
                radius: magnitude * 2,
                fillColor: 'red',
                color: 'red',
                opacity: 0.5,
                fillOpacity: 0.5
            }).bindPopup('Magnitude: ' + magnitude).addTo(map);

            if (globalLogCount < maxGlobalLogs) {
                quake.localEntry = false;
                logEntryManager.addGlobalLogEntry(quake);
                globalLogCount++;
            }
        });
    })
    .then(() => {
        // Initially show global logs
        logEntryManager.showLocalLogs(false);
    })
    .catch(function (error) {
        console.error('Error fetching earthquake data:', error);
    });

let userLoc;
let approximateLoc;
// Get the user's geolocation using the browser's geolocation API
navigator.geolocation.getCurrentPosition(function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Set the map's center to the user's geolocation
    map.setView([latitude, longitude], 14);

    // Circle to illustrate the location centre
    userLoc = L.circleMarker([latitude, longitude], {
        radius: 7,
        fillColor: 'blue',
        color: 'white',
        weight: 2,
        fillOpacity: 0.8,
    }).addTo(map);

    // Circle to illustrate the approximate location / possible location error
    approximateLoc = L.circle([latitude, longitude], {
        radius: 1000,
        color: 'grey',
        weight: 2,
        dashArray: '5, 10', // Configure the dashed stroke
        fill: 'grey',
    }).addTo(map);

});

function printEarthquake(quake) {
    const properties = quake.properties;
    const geometry = quake.geometry;
    const lat = geometry.coordinates[1];
    const lng = geometry.coordinates[0];

    console.log('Earthquake Information:');
    console.log('------------------------');
    console.log('Magnitude: ' + properties.mag);
    console.log('Place: ' + properties.place);
    console.log('Time: ' + new Date(properties.time).toLocaleString());
    console.log('Coordinates: Lat ' + lat + ', Lng ' + lng);
    console.log('Depth: ' + geometry.coordinates[2] + ' km');
    console.log('------------------------\n');
}
