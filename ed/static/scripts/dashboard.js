const sc = new SensitivityConfig();
const api = new backendAPI();
const logEntryManager = new LogEntryManager();


addEventListeners();

// Set magnitude as the default chart
changeDisplayedData('magnitude')

// TODO: Uncomment when backend feature implemented
// api.loadLocalLogs();



// TODO: Uncomment when backend feature implemented
// api.loadUptime()
// setInterval(getUptime,60000); // 60000 milliseconds = 1 minute
