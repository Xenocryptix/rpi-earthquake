const graphDataList = document.getElementById('graph-data-list');
const selectedGraphData = document.getElementById('selected-graph-data');
const scopeList = document.getElementById('log-scope-list');
const selectedScope = document.getElementById('selected-scope');

const arrowImg = '<img src="../static/icons/arrow.svg" alt="arrow" class="arrow-img">'

function addEventListeners() {
    // Change the displayed value in the dropdowns to the selected one
    graphDataList.addEventListener('click', function (e) {
        if (e.target.tagName === 'H3') {
            let selected = e.target.textContent;

            // For Ax, Ay and Az set the second character as a subscript
            if(selected.length === 2) {
                selectedGraphData.innerHTML = `${selected[0]}<sub>${selected[1]}</sub> ${arrowImg}`
            } else {
                selectedGraphData.innerHTML = `${selected} ${arrowImg}`
            }
        }
    });
    scopeList.addEventListener('click', function (e) {
        if (e.target.tagName === 'H3') {
            selectedScope.innerHTML = e.target.textContent + arrowImg;
        }
    });

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
        .addEventListener('click', () => logEntryManager.showLocalLogs(false))

    document.getElementById('scope-local')
        .addEventListener('click', () => logEntryManager.showLocalLogs(true))

// Mode switching listeners
    document.getElementById('mode-standard')
        .addEventListener('click', () => sc.switchDetectionMode('standard'))
    document.getElementById('mode-sensitive')
        .addEventListener('click', () => sc.switchDetectionMode('sensitive'))
}