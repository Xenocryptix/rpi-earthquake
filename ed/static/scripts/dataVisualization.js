const dataBuffer = {
  labels: [],
  data: [],
};

const ctx = document.getElementById('graph').getContext('2d');
const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: dataBuffer.labels,
    datasets: [
      {
        label: 'Ay',
        data: dataBuffer.data,
        borderColor: 'blue',
        fill: false,
      }
    ]
  },
  options: {
    scales: {
      y: {
        min: -1,
        max: 1
      }
    },
    animation: {
      duration: 0
    }
  }
});

// Function to add new data and update the chart
function addDataToChart(timestamp, ay) {
  // Add the new data point and timestamp
  dataBuffer.labels.push(timestamp);
  dataBuffer.data.push(ay);

  // Remove the oldest data point if the buffer size exceeds 7
  if (dataBuffer.labels.length > 7) {
    dataBuffer.labels.shift();
    dataBuffer.data.shift();
  }

  // Update the chart
  lineChart.update();
}

// WebSocket data handling
let socket = io('/datastream');

socket.on('data', function(data) {
  console.log(`Ay: ${data.ay}`);

  // Assuming `data.timestamp` contains the timestamp for the data point
  const timestamp = new Date().toLocaleTimeString();

  dataBuffer.labels.push(timestamp);
  dataBuffer.data.push(data.ay);

  // Remove the oldest data point if the buffer size exceeds 7
  if (dataBuffer.labels.length > 8) {
    dataBuffer.labels.shift();
    dataBuffer.data.shift();
  }

  console.log(dataBuffer)
  lineChart.update()
});