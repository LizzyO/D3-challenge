// svg container
var svgHeight = 650;
var svgWidth = 800;

// margins
var margin = {
  top: 50,
  right: 20,
  bottom: 100,
  left: 50
};

// chart area minus margins
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// // Append an SVG group shift everything over by the margins, need backticks for margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(povertyData) {

//Parse Data/Cast as numbers
// ==============================
    povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // Initial Params
var chosenXAxis = "poverty";

//Create scale functiions 
// ==============================
var xLinearScale = d3.scaleLinear()
.domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
  d3.max(povertyData, d => d[chosenXAxis]) * 1.0
])
.range([0, width]);

  // scale y to chart height
var yLinearScale = d3.scaleLinear()
  .domain([19, d3.max(povertyData, d => d.obesity)])
  .range([height, 0]);

//Create axis functions
// ==============================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

chartGroup.append("g")
  .call(leftAxis);


//  Create Circles
// ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  chartGroup.selectAll("label")
    .data(povertyData)
    .enter()
    .append("text")
    .attr("y", d => yLinearScale(d.obesity) - 10)
    .attr("x", d => xLinearScale(d.poverty) - 11)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text(d => d.abv);


    //Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}% <br>Obesity: ${d.obesity}%`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 3)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Obesity (%)");

        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
