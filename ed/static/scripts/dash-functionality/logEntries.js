class LogEntryManager {
    constructor() {
        this.localLogEntries = [];
        this.globalLogEntries = [];
    }

    addGlobalLogEntry(entry) {
        if ('localEntry' in entry && !entry.localEntry) {
            const html = this.createGlobalLogHTML(entry);
            this.globalLogEntries.push(html);
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

    createGlobalLogHTML(entry) {
        const properties = entry.properties;
        const time = this.formatDateTime(new Date(properties.time));
        const geometry = entry.geometry;
        const lat = this.formatGPSCoordinate(geometry.coordinates[1], 'N');
        const lng = this.formatGPSCoordinate(geometry.coordinates[0], 'E');
        const depth = parseFloat(geometry.coordinates[2]).toFixed(2);

        return this.createLogEntryHTML(time, properties.mag, properties.place, lat, lng, depth);
    }

    createLocalLogHTML(entry) {
        // Implement the HTML for local alerts
        // For example, if local alerts have specific properties
        // you can customize the HTML accordingly
        // Replace this example with your actual HTML structure
        const localHTML = `
        <div class="local-entry">
            <h3>Local Entry</h3>
            <!-- Add local entry content here -->
        </div>
    `;
        return localHTML;
    }

    createLogEntryHTML(time, mag, place, lat, lng, depth) {
        return `
        <div class="entry">
            <h3>${time}</h3>
            <hr>
            <p>Magnitude: ${mag}</p>
            <p>Place: ${place}</p>
            <p>Coordinates:</p>
            <p>${lat}</p>
            <p>${lng}</p>
            <p>Depth: ${depth} km</p>
        </div>
    `;
    }

    formatDateTime(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString()
            .padStart(2, '0')}-${date.getDate().toString()
            .padStart(2, '0')} | ${date.getHours().toString()
            .padStart(2, '0')}:${date.getMinutes().toString()
            .padStart(2, '0')}:${date.getSeconds().toString()
            .padStart(2, '0')}`;
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

