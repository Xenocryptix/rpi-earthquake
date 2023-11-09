class SensitivityConfig {
    selectedMode = document.getElementById('selected-mode');

    switchDetectionMode(mode) {
        console.log(`selected mode: ${mode}`)

        // TODO: test/change sensitivity scaling factor
        const sensitivity = mode === 'standard' ? 20 : 40;

        const url = '/switch_detection_mode'; // TODO: add the backend url for switching the mode
        fetch(url, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(sensitivity),
        })
            .then((response) => {
                console.log(response)
                console.log(`Switched detection mode to ${mode}, sensitivity: ${sensitivity}`);
                // Changing the HTML text to the selected option
                // The regex is for capitalising the first letter of the string
                this.selectedMode.innerHTML = mode.replace(/^\w/, (c) => c.toUpperCase()) + arrowImg;
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });
    }
}