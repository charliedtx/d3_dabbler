// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 700;

var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var padding = 25;
var formatPercent = d3.format('.2%');

var svg = d3
  .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
  .append("g")
    .attr("transform", "translate(" + margin.right + ", " + margin.top + ")");

var chart = svg.append("g");

d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("assets/data/data.csv", function(error, pData) {
  for (var i = 0; i < pData.length; i++){
        console.log(pData[i].abbr)
  }
  if (error) throw error;
  pData.forEach(function(d) {

      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;

  });

  var x = d3.scaleLinear().range([0, width]);
  var y= d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  var xValue = function(d) { return x(d.poverty);};
  var yValue = function(d) { return y(d.healthcare);};

  function findMinMax(i) {
        xMin = d3.min(pData, function(d) {
            return +d[i] * 0.8;
        });

        xMax =  d3.max(pData, function(d) {
            return +d[i] * 1.1;
        });

        yMax = d3.max(pData, function(d) {
            return +d.healthcare * 1.1;
        });
  };

  var mmAxisLabel = "poverty";

  findMinMax(mmAxisLabel);

  xScale=x.domain([xMin, xMax]);
  yScale=y.domain([0, yMax]);

  var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var state = d.abbr;
            var poverty = +d.poverty;
            var healthcare = +d.healthcare;
            return (d.State + "<br> Poverty: " + poverty + "%<br> Healthcare: " + healthcare);
      });

  chart.call(toolTip);

  circles = chart.selectAll('circle')
        .data(pData)
        .enter().append('circle')
        .attr("class", "circle")
        .attr("cx", function(d, index) {
            return x(+d[mmAxisLabel]);
        })
        .attr("cy", function(d, index) {
            return y(d.healthcare);
        })
        .attr('r','10')
        .attr('stroke','black')
        .attr('stroke-width',1)
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
            return x(+d[mmAxisLabel]- 0.08);
        })
         .attr("y", function(d, index) {
            return y(d.healthcare - 0.2);
        })

        .attr("text-anchor", "middle")
        .text(function(d){
            return d.abbr;})
        .attr('fill', 'white')
        .attr('font-size', 9);

  xAxis = d3.axisBottom(x);

  chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

  chart.append("text")
       .attr("class", "label")
       .attr("transform", "translate(" + (width / 2) + " ," + (height - margin.top+ 60) + ")")
       .style("text-anchor", "middle")
       .text('In Poverty (%) ');

  yAxis = d3.axisLeft(y);

  chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

  chart.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - (margin.left + 4))
       .attr("x", 0 - (height/ 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text('Healthcare (%)');
});
