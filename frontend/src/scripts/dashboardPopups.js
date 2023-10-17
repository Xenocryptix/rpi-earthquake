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
        selectedTimeInterval.innerHTML = e.target.textContent + '<img src="../icons/arrow.svg" alt="arrow" class="arrow-img">';
    }
});

graphDataList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedGraphData.innerHTML = e.target.textContent + '<img src="../icons/arrow.svg" alt="arrow" class="arrow-img">';
    }
});

scopeList.addEventListener('click', function(e) {
    if (e.target.tagName === 'H3') {
        selectedScope.innerHTML = e.target.textContent + '<img src="../icons/arrow.svg" alt="arrow" class="arrow-img">';
    }
});



