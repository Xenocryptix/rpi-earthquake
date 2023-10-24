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
      x: {
        grid: {
          display: false, // Remove x-axis grid lines if not needed
        }
      },
      y: {
        min: -1,
        max: 1
      },
    },
    animation: {
      duration: 100
    },
    plugins: {
      legend: {
        display: false, // Hide the dataset label
      }
    },
    ticks: {
      stepSize: 0.25, // Adjust the step size based on your data range
    },
  }
});

// WebSocket data handling
let socket = io('/datastream');

socket.on('data', function(data) {
  console.log(`Ay: ${data.ay}`);

  // Assuming `data.timestamp` contains the timestamp for the data point
  const timestamp = new Date(Date.now()).toLocaleTimeString()

  // Add the new data point and timestamp
  dataBuffer.labels.push(timestamp);
  dataBuffer.data.push(data.ay);

  // Remove the oldest data point if the buffer size exceeds 7
  if (dataBuffer.labels.length > 7) {
    dataBuffer.labels.shift();
    dataBuffer.data.shift();
  }

  lineChart.update()
});