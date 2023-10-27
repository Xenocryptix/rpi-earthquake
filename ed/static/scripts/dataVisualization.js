const bufferLength = 10;
const chartOptions = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Ay',
        data: [],
        borderColor: 'blue',
        fill: false,
      }
    ]
  },
  options: {
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        min: -1,
        max: 1
      },
    },
    animation: {
      duration: 150,
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    ticks: {
      stepSize: 0.33,
    },
  }
};

const ctx = document.getElementById('graph').getContext('2d');
const lineChart = new Chart(ctx, chartOptions);

const dataBuffer = {
  timestamps: [],
  ax: [],
  ay: [],
  az: [],
  magnitude: [],
};

let displayedData = 'ax';

function handleIncomingData(data) {
  const { ax, ay, az, magnitude } = data;
  const timestamp = new Date().toLocaleTimeString();

  dataBuffer.timestamps.push(timestamp);
  dataBuffer.ax.push(ax);
  dataBuffer.ay.push(ay);
  dataBuffer.az.push(az);
  dataBuffer.magnitude.push(magnitude);

  if (dataBuffer.timestamps.length > bufferLength) {
    dataBuffer.timestamps.shift();
    dataBuffer.ax.shift();
    dataBuffer.ay.shift();
    dataBuffer.az.shift();
    dataBuffer.magnitude.shift();
  }
  lineChart.data.labels = dataBuffer.timestamps;
  lineChart.data.datasets[0].data = dataBuffer[displayedData];
  lineChart.update();
}

function changeDisplayedData(type) {
  if (type === displayedData) {
    return; // No need to change if it's the same data
  }
  displayedData = type;
  lineChart.update();


  let borderColor;
  switch (type) {
    case 'ax':
      borderColor = 'blue';
      break;
    case 'ay':
      borderColor = 'green';
      break;
    case 'az':
      borderColor = 'red';
      break;
    case 'magnitude':
      borderColor = 'purple';
      break;
    default:
      // Handle any other cases or data types here
      borderColor = 'blue'; // Default to 'ax' data
      break;
  }

  lineChart.data.datasets[0].borderColor = borderColor;
  lineChart.update();
}

let socket = io('/datastream');

socket.on('data', handleIncomingData);
