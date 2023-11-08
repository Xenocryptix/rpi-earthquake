class backendAPI {
    loadLocalLogs() {
        const url = '';
        fetch(url)
            .then((response) => {
                // Check if the response status is okay (status code 200)
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    data.forEach((entry) => {
                        logEntryManager.addLocalLogEntry(entry)
                        logEntryManager.printLocalEntry(entry);
                    });
                } else {
                    throw new Error('Received data is not an array.');
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    loadUptime() {
        const url = ''; // TODO: add URL to fetch the startup time of the Pi/Server
        const uptimeElement = document.getElementById('uptime'); // Get the HTML element

        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
            })
            .then((data) => {
                console.log(data.starTime) // Debug

                const startTime = new Date(data.startTime);
                const currentTime = new Date();
                const uptimeMilliseconds = currentTime - startTime;

                const days = Math.floor(uptimeMilliseconds / (1000 * 60 * 60 * 24));
                const hours = Math.floor((uptimeMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((uptimeMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                uptimeElement.textContent = `${days} days, ${hours} hours, ${minutes} minutes`;
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
}
