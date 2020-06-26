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

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(povertyData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povertyData, d => d[chosenXAxis]) * 0.8,
      d3.max(povertyData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

    // function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);

      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

      return xAxis;
    }

    // function used for updating circles group with a transition to new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

      return circlesGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

      var label;

      if (chosenXAxis === "poverty") {
        label = "Poverty (%)";
      }
      else {
        label = "Age(median)";
      }

      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });

      circlesGroup.call(toolTip);

      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

      return circlesGroup;
    }

// Import Data
d3.csv("data.csv").then(function(povertyData) {

//Parse Data/Cast as numbers
// ==============================
    povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.age = +data.age;
  });


//Create scale functiions 
// ==============================
// xLinearScale function above csv import
var xLinearScale = xScale(povertyData, chosenXAxis);

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
  .classed("x-axis", true)
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
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5");

  //create text within circles
  chartGroup.selectAll("label")
    .data(povertyData)
    .enter()
    .append("text")
    .attr("y", d => yLinearScale(d.obesity) - 10)
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 11)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text(d => d.abv);


  //   //Initialize tool tip
  //   // ==============================
  //   var toolTip = d3.tip()
  //     .attr("class", "tooltip")
  //     .offset([80, -60])
  //     .html(function(d) {
  //       return (`${d.state}<br>Poverty: ${d.poverty}% <br>Obesity: ${d.obesity}%`);
  //     });

  //   // Create tooltip in the chart
  //   // ==============================
  //   chartGroup.call(toolTip);

  //   // Create event listeners to display and hide the tooltip
  //   // ==============================
  //   circlesGroup.on("click", function(data) {
  //     toolTip.show(data, this);
  //   })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   });

  // // updateToolTip function above csv import
  // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

   // Create group for two x-axis labels
      var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

     // Create axes labels
        var povertyLabel = chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "poverty") // value to grab for event listener
          .attr("class", "axisText")
          .classed("inactive", true)
          .text("In Poverty (%)");

          var ageLabel = chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
          .attr("value", "age") // value to grab for event listener
          .attr("class", "axisText")
          .classed("inactive", true)
          .text("Age (Median");

        //create y axis
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 3)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Obesity (%)");

            // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(povertyData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


  }).catch(function(error) {
    console.log(error);
  });
