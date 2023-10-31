let socket = io('/datastream');
let updateRateMs = 500;
const dataBuffer = {
  timestamps: [],
  ax: [],
  ay: [],
  az: [],
  magnitude: [],
};

const bufferLength = 25; // Adjust the size as per your requirement

for (let i = 0; i < bufferLength; i++) {
  dataBuffer.ax.push(0);
  dataBuffer.ay.push(0);
  dataBuffer.az.push(0);
  dataBuffer.magnitude.push(0);
}

let displayedDataType = 'ax';

// Define the size of the chart and margins
const margin = {top: 10, right: 20, bottom: 50, left: 40},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Set the ranges of the axes
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Define the line
const valueLine = d3.line()
    .curve(d3.curveBasis) // Use basis interpolation
    .x(function(d, i) { return x(i); }) // assuming the x-axis represents the index in the buffer
    .y(function(d) { return y(d); }); // d represents the 'ax' value

// Append the svg object to the body and append a 'group' element to 'svg'
const svg = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the domain for the axes
x.domain([0, bufferLength - 1]); // assuming bufferLength is the length of your data buffer
y.domain([-1, 1]); // as per the range specified in your question

// Define the clip path
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

// Modify the 'g' element to use the clip path
const chartBody = svg.append("g")
    .attr("clip-path", "url(#clip)");

// Add the valueLine path inside the clip path
const path = chartBody.append("path")
    .data([dataBuffer.ax])
    .attr("class", "line")
    .attr("d", valueLine)
    .attr("fill", "none")
    .attr("stroke", "rgba(0, 68, 255, 0.9)")
    .attr("stroke-width", 3);

// Add the X Axis outside the clip path to ensure it's not clipped
svg.append("g")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));

// Function to update the chart with new data
function updateChart(newData) {
  // Push a new data point onto the back.
  dataBuffer[displayedDataType].push(newData);

  // Redraw the line, and slide it to the left.
  path
      .attr("d", valueLine)
      .attr("transform", null)
      .transition()
      .duration(updateRateMs)
      .ease(d3.easeLinear)
      .attr("transform", "translate(" + x(-1) + ",0)")
      .on("end", function() {
        // When the transition finishes, we remove the oldest data point
        // and call the update function again.
        dataBuffer[displayedDataType].shift();
        updateChart(newData); // Recursive call to keep the data flowing
      });
}

// Handle incoming data
socket.on('data', function(data) {
  updateRateMs = data.rate - 50; // To compensate for network delay

  // Add incoming data to the dataBuffer
  dataBuffer.ax.push(data.ax);
  dataBuffer.ay.push(data.ay);
  dataBuffer.az.push(data.az);
  dataBuffer.magnitude.push(data.magnitude);

  // Only call updateChart if there's new data, to avoid infinite loop during periods without data
  if (data[displayedDataType] !== undefined) {
    updateChart(data[displayedDataType]); // Call the update function with the new data
  }
});


function changeDisplayedData(value) {
  displayedDataType = value; // Update the global variable

  // Update the path data to reflect the new data type
  path.data([dataBuffer[displayedDataType]]);

  // Change the line color based on the selected data type
  let lineColor;
  switch (value) {
    case 'ax':
      lineColor = "rgba(0, 68, 255, 0.9)"; // original color for ax
      y.domain([-1, 1]); // original y-axis domain
      break;
    case 'ay':
      lineColor = "rgba(255, 0, 0, 0.9)"; // red for ay
      y.domain([-1, 1]); // original y-axis domain
      break;
    case 'az':
      lineColor = "rgba(0, 255, 0, 0.9)"; // green for az
      y.domain([-1, 1]); // original y-axis domain
      break;
    case 'magnitude':
      lineColor = "rgba(255, 0, 255, 0.9)"; // magenta for magnitude
      y.domain([0, 10]); // y-axis domain for magnitude
      break;
    default:
      lineColor = "rgba(0, 68, 255, 0.9)"; // default color
      y.domain([-1, 1]); // default y-axis domain
      break;
  }
  path.attr("stroke", lineColor);

  // Redraw the y-axis with the updated domain
  svg.select("g").call(d3.axisLeft(y));

  // Redraw the line
  path.attr("d", valueLine);
}





