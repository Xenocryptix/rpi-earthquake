class LogEntryManager {
    constructor() {
        this.localLogEntries = [];
        this.globalLogEntries = [];

        this.loadGlobalEntries();
    }

    addGlobalLogEntry(entry) {
        if ('localEntry' in entry && !entry.localEntry) {
            const html = this.createGlobalLogHTML(entry);
            this.globalLogEntries.push(html);
        }
    }

    createGlobalLogHTML(entry) {
        const properties = entry.properties;
        const time = this.formatDateTime(new Date(properties.time));
        const mag = parseFloat(properties.mag).toFixed(2); // Round magnitude to 2 decimal places
        const place = properties.place;
        const magnitude = parseFloat(properties.mag);

        const geometry = entry.geometry;
        const lat = this.formatGPSCoordinate(geometry.coordinates[1], 'N');
        const lng = this.formatGPSCoordinate(geometry.coordinates[0], 'E');
        const depth = parseFloat(geometry.coordinates[2]).toFixed(2);

        const borderColor = this.getBorderColor(magnitude);

        return `
        <div class="entry" style="border: 2px solid ${borderColor};">
            <p style="text-align: center"><b>${time}</b></p>
            <hr>
            <p style="text-align: center; margin-bottom: 1.2rem;"><b>${place}</b></p> 

            <p><b>MAG:</b> ${mag}</p>
            <p><b>DEPTH:</b> ${depth} km</p>
<!--                <p style=" font-size: 0.8rem">${lat} | ${lng}</p>-->
        </div>
    `;
    }

    getBorderColor(magnitude) {
        if (magnitude < 1.5) {
            return 'green';
        } else if (magnitude < 4) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    addLocalLogEntry(entry) {
        if ('localEntry' in entry && entry.localEntry) {
            const html = this.createLocalLogHTML(entry);
            this.localLogEntries.push(html);
            document.getElementById('log-entries').innerHTML = this.localLogEntries.join('');
            selectedScope.innerHTML = 'Local' + arrowImg;
        }
    }

    createLocalLogHTML(entry) {
        const time = new Date().toDateString()
        return `
        <div class="entry">
            <h3>${time}</h3>
            <hr>
            <p><b>MAG:</b> ${parseFloat(entry.magnitude).toFixed(2) }</p>
        </div>
    `;
    }

    formatDateTime(date) {
        const timeString = `${date.getHours()
            .toString()
            .padStart(2, '0')}:${date.getMinutes()
            .toString()
            .padStart(2, '0')}`;
        const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString()
            .padStart(2, '0')}-${date.getDate()
            .toString()
            .padStart(2, '0')}`;
        return `${timeString} | ${dateString}`;
    }


    showLocalLogs(t) {
        if (t) {
            document.getElementById('log-entries').innerHTML = this.localLogEntries.join('');
        } else {
            document.getElementById('log-entries').innerHTML = this.globalLogEntries.join('');
        }
    }

    formatGPSCoordinate(coordinate, direction) {
        const absoluteCoordinate = Math.abs(coordinate);
        const degrees = Math.floor(absoluteCoordinate);
        const minutes = Math.floor((absoluteCoordinate - degrees) * 60);
        const seconds = ((absoluteCoordinate - degrees - minutes / 60) * 3600).toFixed(2);

        return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
    }

    loadGlobalEntries() {
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
    }

    printLocalEntry(entry) {
        const avg = entry.avg;
        const id = entry.id;
        const lat = entry.lat;
        const lng = entry.lng;
        const max = entry.max;
        const time = entry.time;

        console.log('Object ID:', id);
        console.log('Average:', avg);
        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
        console.log('Maximum:', max);
        console.log('Time:', time);
    }
}

