// Add your JavaScript code here

let filenames2 = ["../data/movie_durations_by_year.csv", "../data/movie_durations_by_year.csv"];

let svg2 = d3.select("#graph2")
.append("svg")
.attr("width", graph_2_width)     
.attr("height", graph_2_height)    
.append("g")
.attr("transform", `translate(${margin.left + 200}, ${margin.top})`); 


let x2 = d3.scaleLinear()
    .range([0, graph_2_width - margin.left - margin.right-150]);

// TODO: Create a scale band for the y axis (artist)
let y2 = d3.scaleBand()
    .range([0, graph_2_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability

// Set up reference to count SVG group
let countRef2 = svg2.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label2 = svg2.append("g");

svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, ${graph_2_height - margin.top - margin.bottom + 10})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Duration (min)");



let y_axis_text2 = svg2.append("text")
    .attr("transform", `translate(-50, ${(graph_2_height - margin.top - margin.bottom)/2})`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle");

// TODO: Add chart title
let title2 = svg2.append("text")
    .attr("transform", `translate(${(graph_2_width - margin.left - margin.right)/2}, -10)`)        // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

var parseTime = d3.timeParse("%Y");

    function setData1(index, attr) {
        // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
        d3.csv(filenames2[index]).then(function(data) {
            // TODO: Clean and strip desired amount of data for barplot
            if (index == 0){
            data = cleanData(data, function(a,b) {return parseInt(b.count) - parseInt(a.count)}, NUM_EXAMPLES);
            } else {
                data = cleanData(data, function(a,b) {return parseInt(a.count) - parseInt(b.count)}, NUM_EXAMPLES);
            }
    
            // TODO: Update the x axis domain with the max count of the provided data
            x2.domain([0, d3.max(data, function(d) {return parseInt(d.count)})]);

            data.forEach(function(d) {
                d.year = d.year.substring(0, d[attr].length - 2)
            });
    
            // TODO: Update the y axis domains with the desired attribute
            y2.domain(data.map(function(d) { return d[attr]}));
            // HINT: Use the attr parameter to get the desired attribute for each data point
    
            // TODO: Render y-axis label
            y_axis_label2.call(d3.axisLeft(y2).tickSize(0).tickPadding(10));
    
            /*
                This next line does the following:
                    1. Select all desired elements in the DOM
                    2. Count and parse the data values
                    3. Create new, data-bound elements for each data value
             */
            let bars = svg2.selectAll("rect").data(data);
    
            // TODO: Render the bar elements on the DOM
            /*
                This next section of code does the following:
                    1. Take each selection and append a desired element in the DOM
                    2. Merge bars with previously rendered elements
                    3. For each data point, apply styling attributes to each element
    
                Remember to use the attr parameter to get the desired attribute for each data point
                when rendering.
             */

            let color = d3.scaleOrdinal()
                .domain(data.map(function(d) { return d[attr] }))
                .range(d3.quantize(d3.interpolateHcl("#E50914", "#ebd4d3"), NUM_EXAMPLES));

            bars.enter()
                .append("rect")
                .merge(bars)
                .attr("fill", function(d) { return color(d[attr])})
                .transition()
                .duration(1250)
                .attr("x", x2(0))
                .attr("y", function(d) { return y2(d[attr]); })               // HINT: Use function(d) { return ...; } to apply styles based on the data point
                .attr("width", function(d) { return x2(parseInt(d.count))})
                .attr("height", y2.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height
    
            /*
                In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
                bar plot. We will be creating these in the same manner as the bars.
             */
            let counts = countRef2.selectAll("text").data(data);
    
            // TODO: Render the text elements on the DOM
            counts.enter()
                .append("text")
                .merge(counts)
                .transition()
                .duration(1250)
                .attr("fill", function(d) { return color(d[attr])})
                .attr("x", function(d) {return x2(parseInt(d.count)) + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
                .attr("y", function(d) {return y2(d[attr]) + 10})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
                .style("text-anchor", "start")
                .text(function(d) { return parseInt(d.count)});           // HINT: Get the count of the artist
    
            y_axis_text2.text(attr.charAt(0).toUpperCase() + attr.slice(1));

            if (index == 0){
            title2.text("Highest Average Movie Durations By Year");
            }
            else{
                title2.text("Lowest Average Movie Durations By Year"); 
            }
            // Remove elements not in use if fewer groups in new dataset
            bars.exit().remove();
            counts.exit().remove();
        });
    }
    setData1(0, "year");

