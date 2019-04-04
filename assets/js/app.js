// @TODO: YOUR CODE HERE!


var svgWidth = 1000;
var svgHeight = 800;

var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};
var padding = 20;

var width = svgWidth - (margin.left - margin.right);
var height = svgHeight - (margin.top - margin.bottom);
var formatPercent = d3.format('.2%');
// Select body, append SVG area to it, and set the dimensions

//SVG Wrapper
var svg = d3.select(".chart")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

var chart = svg.append("g");

d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("assets/data/data.csv", function(error, data) {
  for (var i = 0, i < data.length, i++) {
    console.log(data[i].abbr)
  };
  if (error) throw error;

  data.forEach(function(d) {
    d.poverty = parseInt(d.poverty);
    d.healthcare = parseInt(d.healthcare);
  });

  var xLinearScale = d3.scaleLinear().range([0, width]);
  var yLinearScale = d3.scaleLinear().range([height,0]);
  var xAxis = d3.axisBottom(xLinearScale);
  var yAix  = d3.axisLeft(yLinearScale);

  var xValues = function(xInput) {
    return xLinearScale(d.poverty);
  };
  var yValues = function(yInput) {
    return yLinearScale(d.healthcare);
  };

  function minMax(minmax) {
    xMin = d3.min(data, function(d){
      return (+d[i] * 0.8);
    });
    xMax = d3.max(data, function(d){
      return (+d[i] *1.1);
    });
    yMax = d3.max(data, function(d){
      return (+d.healthcare *1.1)
    });

  };

  var xAxisLabel = "poverty";

  minMax(xAxisLabel);

  xScale = xLinearScale.domain([xMin, xMax]);
  yScale = yLinearScale.domain([0, yMax]);

  var toolTip = d3.tip()
                  .attr("class", "tooltip")
                  .html(function(d) {
                    var state = d.abbr;
                    var poverty = +d.poverty;
                    var healthcare = +d.healthcare;
                    return(d)
                  });

  chart.call(toolTip);

  circles = chart.selectAll('circle')
                 .data(data)
                 .enter().append('circle')
                 .attr("class", "circle")
                 .attr("cx", function(d, index) {
                   return x(+d[xAxisLabel]);
                 })
                 .attr("cy", function(d, index) {
                   return x(d.healthcare);
                 })
                 .attr('r', '10')
                 .attr('stroke', 'black')
                 .attr('stroke-width', 1)
                 .style('fill', "lightblue")
                 .attr("class", "circleText")
                 .on("mouseover", function(d) {
                   toolTip.show(d);
                 })
                 .on("mouseout", function(d, index) {
                   toolTip.hide(d);
                 });
      circles.append('text')
             .attr("x", function(d, index) {
              return x(+d[xAxisLabel]- 0.08);
              })
             .attr("y", function(d, index) {
              return y(d.healthcare - 0.2);
              })
             .attr("text-anchor", "middle")
             .text(function(d){
              return d.abbr;
              })
             .attr('fill', 'white')
             .attr('font-size', 9);

    xAxis = d3.axisBottom(xLinearScale);
    chart.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

    yAxis = d3.axisLeft(yLinearScale);
    chart.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + padding + ",0)")
         .call(yAxis);

});
