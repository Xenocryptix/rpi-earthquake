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
}

let displayedDataType = 'ax';

// Define the size of the chart and margins
const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

// Add the X Axis outside the clip path to ensure it's not clipped
// svg.append("g")
//     .attr("transform", "translate(0," + height/2 + ")")
//     .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));

// Function to update the chart with new data
function updateChart(newData) {
  // Push a new data point onto the back.
  dataBuffer.ax.push(newData);

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
        dataBuffer.ax.shift();
        updateChart(newData); // Recursive call to keep the data flowing
      });
}

// Handle incoming data
socket.on('data', function(data) {
  updateRateMs = data.rate - 10; // To compensate for network delay

  const ax = data.ax;
  const ay = data.ay;
  const az = data.az;
  const magnitude = data.magnitude;

  // Only call updateChart if there's new data, to avoid infinite loop during periods without data
  if (data.ax !== undefined) {
    updateChart(data.ax); // Call the update function with the new data
  }
});


