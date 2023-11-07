class SensitivityConfig {
    selectedMode = document.getElementById('selected-mode');

    switchDetectionMode(mode) {
        console.log(`selected mode: ${mode}`)

        // TODO: test/change sensitivity scaling factor
        const sensitivity = mode === 'standard' ? 1 : 4;

        const url = ''; // TODO: add the backend url for switching the mode
        fetch(url, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(sensitivity),
        })
            .then((response) => {
                if (response.ok) {
                    console.log(`Switched detection mode to ${mode}, sensitivity: ${sensitivity}`);
                    // Changing the HTML text to the selected option
                    // The regex is for capitalising the first letter of the string
                    this.selectedMode.innerHTML = mode.replace(/^\w/, (c) => c.toUpperCase()) + arrowImg;

                } else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });
    }
}