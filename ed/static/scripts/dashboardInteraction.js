// Get the lists and the selected items
const intervalList = document.getElementById('interval-list');
const graphDataList = document.getElementById('graph-data-list');
const selectedTimeInterval = document.getElementById('selected-time-interval');
const selectedGraphData = document.getElementById('selected-graph-data');
const scopeList = document.getElementById('log-scope-list');
const selectedScope = document.getElementById('selected-scope');

// Add click event listeners to list items
intervalList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedTimeInterval.innerHTML = e.target.textContent + '<img src="../static/icons/arrow.svg" alt="arrow" class="arrow-img">';
    }
});

graphDataList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedGraphData.innerHTML = e.target.textContent + '<img src="../static/icons/arrow.svg" alt="arrow" class="arrow-img">';
    }
});

scopeList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedScope.innerHTML = e.target.textContent + '<img src="../static/icons/arrow.svg" alt="arrow" class="arrow-img">';
    }
});


// Graph data switching
// Graph data switching
document.getElementById('opt-magnitude')
    .addEventListener('click', () => changeDisplayedData('magnitude'))

document.getElementById('opt-ax')
    .addEventListener('click', () => changeDisplayedData('ax'))

document.getElementById('opt-ay')
    .addEventListener('click', () => changeDisplayedData('ay'))

document.getElementById('opt-az')
    .addEventListener('click', () => changeDisplayedData('az'))


// Log entries
function addLogEntry(entry) {
    let container = document.getElementById('log-entries');

    // const entry = generateRandomEntry();
    let circle;
    if(entry.avg < 1) {
        circle = "../static/icons/green-circle.svg"
    } else if (entry.avg >= 1 && entry.avg < 3) {
        circle = "../static/icons/orange-circle.svg"
    } else {
        circle = "../static/icons/red-circle.svg"
    }
    const circleIcon = `<img src=${circle} class="entry-circle" alt="circle">`

    const timestamp = new Date().toLocaleTimeString()

    container.innerHTML += `
    <div class="entry">
        <div class="entry-top"><h2>${timestamp}</h2></div>
        <h3><span><span style="color: grey;"></span>${Math.round(entry.magnitude * 100) / 100}</span></h3>
    </div>
    `;
}

function generateRandomEntry() {
    // Generate a random number between min and max (inclusive)
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






