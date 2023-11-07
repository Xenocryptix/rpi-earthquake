// Get the lists and the selected items
const intervalList = document.getElementById('interval-list');
const graphDataList = document.getElementById('graph-data-list');
const selectedTimeInterval = document.getElementById('selected-time-interval');
const selectedGraphData = document.getElementById('selected-graph-data');
const scopeList = document.getElementById('log-scope-list');
const selectedScope = document.getElementById('selected-scope');
const modeList = document.getElementById('mode-list');
const selectedMode = document.getElementById('selected-mode')

const arrowImg = '<img src="../static/icons/arrow.svg" alt="arrow" class="arrow-img">'

// Add click event listeners to list items to display the selected value
intervalList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedTimeInterval.innerHTML = e.target.textContent + arrowImg;
    }
});
graphDataList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedGraphData.innerHTML = e.target.textContent + arrowImg;
    }
});
scopeList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedScope.innerHTML = e.target.textContent + arrowImg;
    }
});
modeList.addEventListener('click', function (e) {
    if (e.target.tagName === 'H3') {
        selectedMode.innerHTML = e.target.textContent + arrowImg;
    }
})


// Graph data switching listeners
document.getElementById('opt-magnitude')
    .addEventListener('click', () => changeDisplayedData('magnitude'))

document.getElementById('opt-ax')
    .addEventListener('click', () => changeDisplayedData('ax'))

document.getElementById('opt-ay')
    .addEventListener('click', () => changeDisplayedData('ay'))

document.getElementById('opt-az')
    .addEventListener('click', () => changeDisplayedData('az'))


// Log switching from local/global listeners
document.getElementById('scope-global')
    .addEventListener('click', () => showLocalLogs(false))

document.getElementById('scope-local')
    .addEventListener('click', () => showLocalLogs(true))

// Mode switching listeners
document.getElementById('mode-standard')
    .addEventListener('click', () => switchDetectionMode('standard'))
document.getElementById('mode-sensitive')
    .addEventListener('click', () => switchDetectionMode('sensitive'))

let localLogEntries = []; // Initialize as an empty array
let globalLogEntries = []; // Initialize as an empty array
function addLogEntry(entry) {
    if (!'localEntry' in entry)
        throw new Error("Entry does not contain the local/global identifier")

    let timestamp, magnitude, html;
    // parse the entry depending on if local or global
    if (entry.localEntry) {
        timestamp = entry.timestamp;
    } else {
        timestamp = new Date(entry.properties.time).toLocaleString();
        magnitude = entry.properties.mag;
    }

    // Build the HTML string
    html = `
    <div class="entry">
        <div class="entry-top"><h2>${timestamp}</h2></div>
        <h3><span><span style="color: grey;"></span>${Math.round(magnitude * 100) / 100}</span></h3>
    </div>
    `;

    if (entry.localEntry) {
        localLogEntries.push(html)
        // Automatically switch to displaying local logs if new one comes in
        document.getElementById('log-entries').innerHTML = localLogEntries.join('');
        selectedScope.innerHTML = "Local" + arrowImg;
    } else {
        globalLogEntries.push(html)
    }
}

function showLocalLogs(t) {
    if (t) {
        document.getElementById('log-entries').innerHTML = localLogEntries.join('');
    } else {
        document.getElementById('log-entries').innerHTML = globalLogEntries.join('');
    }
}

function switchDetectionMode(mode) {
    console.log(`selected mode: ${mode}`)
}


function generateRandomEntry() {
    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Generate a random timestamp within the last 24 hours
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const randomDate = new Date(Date.now() - getRandomNumber(0, oneDay));

    // Format the timestamp to ab:cd in 24h time
    const hours = String(randomDate.getHours()).padStart(2, '0');
    const minutes = String(randomDate.getMinutes()).padStart(2, '0');
    const formattedTimestamp = `${hours}:${minutes}`;

    // Generate random AVG and MAX values
    const randomAvg = getRandomNumber(2.5, 4.5).toFixed(2);
    const randomMax = getRandomNumber(parseFloat(randomAvg), 5.0).toFixed(2);

    // Generate a random location (latitude and longitude)
    const randomLat = getRandomNumber(-90, 90).toFixed(5);
    const randomLon = getRandomNumber(-180, 180).toFixed(5);
    const randomLocation = `${randomLat}°, ${randomLon}°`;

    return {
        avg: randomAvg,
        max: randomMax,
        timestamp: formattedTimestamp, // Use the formatted timestamp
        location: randomLocation
    };
}






