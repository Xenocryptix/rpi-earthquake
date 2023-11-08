let socket = io('/datastream');
const dataBuffer = {
    timestamps: [],
    ax: [],
    ay: [],
    az: [],
    magnitude: [],
};

const bufferLength = 30;

// Initialize graph settings
let displayedDataType = 'magnitude';
let updateRateMs = 500;

// Initialize the data buffer
for (let i = 0; i < bufferLength; i++) {
    dataBuffer.ax.push(0);
    dataBuffer.ay.push(0);
    dataBuffer.az.push(0);
    dataBuffer.magnitude.push(0);
}

const container = d3.select("#graph-container");
const containerWidth = container.node().getBoundingClientRect().width;
const containerHeight = containerWidth * 0.5;

const margin = {top: 10, right: 20, bottom: 50, left: 40},
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom;

// Presets for the style of the line drawn depending on the data type
const graphSettings = {
    ax: {
        lineColor: "#7189FF",
        yDomain: [-2, 2],
        xAxisTransform: "translate(0," + height / 2 + ")",
    },
    ay: {
        lineColor: "#009fc9",
        yDomain: [-2, 2],
        xAxisTransform: "translate(0," + height / 2 + ")",
    },
    az: {
        lineColor: "#68A357",
        yDomain: [-2, 2],
        xAxisTransform: "translate(0," + height / 2 + ")",
    },
    magnitude: {
        lineColor: "#FF6542",
        yDomain: [0, 50],
        xAxisTransform: "translate(0," + height + ")",
    },
    default: {
        lineColor: "#7189FF",
        yDomain: [-2, 2],
        xAxisTransform: "translate(0," + height / 2 + ")",
    },
};

// Define the line
const valueLine = d3.line()
    .curve(d3.curveCardinal.tension(0.3)) // Interpolate between the values
    .x(function (d, i) {
        return x(i);
    })
    .y(function (d) {
        return y(d);
    });

const svg = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the ranges of the axes
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Set the domain for the axes
x.domain([0, bufferLength - 1]);
y.domain([-1, 1]);

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
    .attr("stroke", `${graphSettings.ax.lineColor}`)
    .attr("stroke-width", 3);

// Add the X Axis outside the clip path to ensure it's not clipped
svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height / 2 + ")") // Adjust the 'translate' value
    .attr("stroke-width", "0.1rem")
    .call(d3.axisBottom(x).tickValues([])); // Removed the tick values for aesthetics

// Add the Y Axis
svg.append("g")
    .attr("class", "y-axis")
    .attr("stroke-width", "0.1rem")
    .call(d3.axisLeft(y));

// Function to update the chart with new data
function updateChart() {
    // Redraw the line, and slide it to the left.
    path
        .attr("d", valueLine)
        .attr("transform", null)
        .transition()
        .duration(updateRateMs)
        .ease(d3.easeLinear)
        .attr("transform", "translate(" + x(-1) + ",0)")
        .on("end", function () {
            // When the transition finishes, we remove the oldest data point
            // and call the update function again.
            dataBuffer.ax.shift();
            dataBuffer.ay.shift();
            dataBuffer.az.shift();
            dataBuffer.magnitude.shift();
            updateChart(); // Recursive call to keep the data flowing
        });
}

// Handle incoming acceleration / magnitude readings
socket.on('data', function (data) {
    updateRateMs = data.rate - 10; // To compensate for network delay

    // Add incoming data to the dataBuffer
    dataBuffer.ax.push(data.ax);
    dataBuffer.ay.push(data.ay);
    dataBuffer.az.push(data.az);
    dataBuffer.magnitude.push(data.magnitude);

    // Only call updateChart if there's new data, to avoid infinite loop during periods without data
    if (data[displayedDataType] !== undefined) {
        updateChart(); // Call the update function with the new data
    }
});

// Handle alerts
socket.on('alert', function (data) {
    data.localEntry = true;
    logEntryManager.addLocalLogEntry(data)
    console.log(data);
});

function changeDisplayedData(value) {
    displayedDataType = value;
    path.data([dataBuffer[displayedDataType]]);

    const setting = graphSettings[value] || graphSettings.default;

    path.attr("stroke", setting.lineColor);

    // Set the y-axis domain
    y.domain(setting.yDomain);

    // Redraw the y-axis with the updated domain
    svg.select(".y-axis").call(d3.axisLeft(y));

    // Set the x-axis transform
    svg.select(".x-axis").attr("transform", setting.xAxisTransform);

    // Redraw the line
    path.attr("d", valueLine);
}
