var margin1 = {top: 30, right: 30, bottom: 70, left: 120},
    width = 960 - margin1.left - margin1.right,
    height = 500 - margin1.top - margin1.bottom;

var x1 = d3.scaleTime()
          .domain([new Date(1954, 1, 1), new Date(2021, 1, 1)])
          .rangeRound([0, width]);

var y1 = d3.scaleLinear()
          .range([height, 0]);

var histogram = d3.histogram()
    .value(function(d) { return d.release_year; })
    .domain(x1.domain())
    .thresholds(x1.ticks(71));

var svg1 = d3.select("body").append("svg")
    .attr("width", width + margin1.left + margin1.right)
    .attr("height", height + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

var parseTime = d3.timeParse("%Y");
          
d3.csv("data/netflix_years.csv").then(function(data) {

  data.forEach(function(d) {
      d.release_year = parseTime(d.release_year)
  });

  var bins = histogram(data);

  y1.domain([0, d3.max(bins, function(d) { return d.length; })]);

  let color1 = d3.scaleOrdinal()
                .domain(data.map(function(d) { return d.release_year }))
                .range(d3.quantize(d3.interpolateHcl("#E50914", "#ebd4d3"), 60));

  let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let mouseover = function(d) {
    let html = `${d.length}`;

    // Show the tooltip and set the position relative to the event X and Y location
    tooltip.html(html)
        .style("left", `${(d3.event.pageX)-15}px`)
        .style("top", `${650 + y1(d.length)}px`)
        .transition()
        .duration(100)
        .style("opacity", 0.9);
        d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.55');
};

let mouseout = function(d) {
  // Set opacity back to 0 to hide
  tooltip.transition()
      .duration(200)
      .style("opacity", 0);
      d3.select(this).transition()
      .duration('50')
      .attr('opacity', '1');
};

  // append the bar rectangles to the svg element
  svg1.selectAll("rect")
      .data(bins)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 1)
      .attr("fill", function(d) { return color1(d.release_year)})
      .attr("transform", function(d) {
		  return "translate(" + x1(d.x0) + "," + y1(d.length) + ")"; })
      .attr("width", function(d) { return x1(d.x1) - x1(d.x0) -1 ; })
      .attr("height", function(d) { return height - y1(d.length); })
      .on('mouseover', mouseover)
      .on('mouseout', mouseout);

  // add the x Axis
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x1));

  // add the y Axis
  svg1.append("g")
      .call(d3.axisLeft(y1));

    svg1.append("text")
      .attr("transform", `translate(${(width - margin1.left - margin.right)/2}, ${height - margin1.top - margin1.bottom + 140})`)       // HINT: Place this at the bottom middle edge of the graph
      .style("text-anchor", "middle")
      .style('fill', 'darkRed')
      .style("font-size", "15px")
      .text("Year");
  
  svg1.append("text")
      .attr("transform", `translate(-70, ${(height - margin1.top - margin1.bottom)/2})`)       // HINT: Place this at the center left edge of the graph
      .style("text-anchor", "middle")
      .style('fill', 'darkRed')
      .style("font-size", "15px")
      .text("Frequency");
  
  // TODO: Add chart title
  svg1.append("text")
      .attr("transform", `translate(${(width - margin1.left - margin1.right)/2}, 0)`)        // HINT: Place this at the top middle edge of the graph
      .style("text-anchor", "middle")
      .style('fill', 'darkRed')
      .style("font-size", "25px")
      .text("Releases Per Year");
});