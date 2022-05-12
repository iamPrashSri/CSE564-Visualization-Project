var color = d3.scaleOrdinal( d3.schemeOrRd[9]);
var fontcolor = 'black'
function barChartLoader(filename, selectedCountry, fromYear, toYear, diseasesToShow){
    document.getElementById("bar_chart").innerHTML = "";
    d3.csv(filename, function(error, data){
        data.forEach(function (d) {
            d.Deaths = +d.Deaths;
        });

        let filteredData = [];
        if(diseasesToShow === undefined){
            filteredData = data;
        } else {
            data.forEach(function (d) {
                if(diseasesToShow.includes(d['Disease'])){
                    filteredData.push(d);
                }
            });
        }

        // var color = d3.scaleOrdinal(d3.schemeCategory10);
        // var color = d3.scaleOrdinal(d3.schemeOrRd[9]);
        color_list = ['#8b0000','#b22222','#ff0000','#dc143c','#cd5c5c','#ffa07a']
        var color = d3.scaleOrdinal(color_list);


        //sort bars based on value
        filteredData = filteredData.sort(function (a, b) {
            return d3.ascending(a.Deaths, b.Deaths);
        })

        let colorCode = 6;

        for(let d of filteredData){
            console.log(d)
            d['colorCode'] = (colorCode);
            colorCode-=1
        }

        var margin = {
            top: 30,
            right: 0,
            bottom: 15,
            left: 185
        };

        var width = 750 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#bar_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "svgProps")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(filteredData, function (d) {
                return d.Deaths;
            })]);

        var y = d3.scaleBand()
            .rangeRound([height, 0])
            .padding(0.3)
            .domain(filteredData.map(function (d) {
                return d.Disease;
            }));

        svg.append("text")
            .attr("class", "heading")
            .attr("y", function () {
                return -10;
            })
            .attr("x", function () {
                return 0;
            })
            .text(function () {
                return "Deaths caused over a period from " + fromYear + " to " + toYear + " (" + selectedCountry + ")";
            });

        var yAxis = d3.axisLeft(y)
            //no tick marks
            .tickSize(0);

        var gy = svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var bars = svg.selectAll(".bar")
            .data(filteredData)
            .enter()
            .append("g")

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.Disease) + y.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.Deaths/1.5) + 8;
            })
            .transition()
            .duration(1500)
            .delay(function(d,i){ return 1300})
            .text(function (d) {
                return d.Deaths.toLocaleString();
            });

        bars.append("rect")
            .attr("class", "bar")
            .on('click', function(d){
                let diseasesToShow = [];
                diseasesToShow.push(d['Disease']);
                timelineChartLoader('static/data/TimelineCntCountryWise.csv', selectedCountry, fromYear, toYear, diseasesToShow);
            })
            .attr("y", function (d) {
                return y(d.Disease);
            })
            .style("fill", function (d, i) {
                return color(+d.colorCode);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", 0)
            .transition()
            .duration(1500)
            .delay(function(d,i){ return i*25})//a different delay for each bar
            .attr("width", function (d) {
                return x(d.Deaths/1.5);
            });

    });
}

function pieChartLoader(filename, selectedCountry, fromYear, toYear){
    document.getElementById("pie_chart").innerHTML = "";
    d3.csv(filename, function(error, data){
        data.forEach(function (d) {
            d.Deaths = +d.Deaths;
        });

        let comm = ['Malaria', 'Tuberculosis', 'Acute hepatitis', 'Digestive diseases', 'Meningitis'];
        let non_comm = ['Neoplasms', 'HIV/AIDS', 'Cardiovascular diseases', 'Alcohol use disorders', 'Nutritional deficiencies'];
        let accidents = ['Drowning', 'Interpersonal violence', 'Road injuries', 'Self-harm', 'Conflict and terrorism'];

        let no_of_comm_deaths = 0;
        let no_of_non_comm_deaths = 0;
        let no_of_accidental_deaths = 0;

        for(let disease of data){
            if(comm.includes(disease['Disease'])){
                no_of_comm_deaths += disease['Deaths'];
            } else if(non_comm.includes(disease['Disease'])){
                no_of_non_comm_deaths += disease['Deaths'];
            } else {
                no_of_accidental_deaths += disease['Deaths'];
            }
        }

        let dataset = [];
        dataset.push({
            label: "Communicable Diseases",
            count: no_of_comm_deaths,
            diseases: comm
        });

        dataset.push({
            label: "Non - Communicable Diseases",
            count: no_of_non_comm_deaths,
            diseases: non_comm
        });

        dataset.push({
            label: "Accidents",
            count: no_of_accidental_deaths,
            diseases: accidents
        });

        // chart dimensions
        var width = 440;
        var height = 280;
        var radius = 100;

        // legend dimensions
        var legendRectSize = 7; // defines the size of the colored squares in legend
        var legendSpacing = 8; // defines spacing between squares

        // define color scale
        // var color = d3.scaleOrdinal(d3.schemeCategory20c);
        // var color = d3.scaleOrdinal(d3.schemeOrRd[9]);

        var color = d3.scaleOrdinal()
            .range(['#AE3232','#F2846D','#FEC99D']);

        var yOffset = 30;
        var xOffset = 150;
        var svg = d3.select('#pie_chart') // select element in the DOM with id 'chart'
          .append('svg') // append an svg element to the element we've selected
          .attr('width', width) // set the width of the svg element we just added
          .attr('height'    , height) // set the height of the svg element we just added
          .append('g') // append 'g' element to the svg element
          .attr('transform', 'translate(' + (width / 4) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

        svg.append("text")
            .attr("class", "heading")
            .attr("y", function () {
                return -height/2 + yOffset;
            })
            .attr("x", function () {
                return -width/2 + xOffset;
            })
            .text(function () {
                return "Deaths caused between " + fromYear + " and " + toYear + " (" + selectedCountry + ")";
            });

        var arc = d3.arc()
          .innerRadius(0) // none for pie chart
          .outerRadius(radius); // size of overall chart

        var pie = d3.pie() // start and end angles of the segments
          .value(function(d) { return d.count; }) // how to extract the numerical data from each entry in our dataset
          .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

        // define tooltip
        var tooltip = d3.select('#pie_chart') // select element in the DOM with id 'chart'
          .append('div') // append a div element to the element we've selected
          .attr('class', 'customTooltip'); // add class 'tooltip' on the divs we just selected

        tooltip.append('div') // add divs to the tooltip defined above
          .attr('class', 'label'); // add class 'label' on the selection

        tooltip.append('div') // add divs to the tooltip defined above
          .attr('class', 'count'); // add class 'count' on the selection

        tooltip.append('div') // add divs to the tooltip defined above
          .attr('class', 'percent'); // add class 'percent' on the selection

        dataset.forEach(function(d) {
          d.count = +d.count; // calculate count as we iterate through the data
          d.enabled = true; // add enabled property to track which entries are checked
        });

        // creating the chart
        var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
          .data(pie(dataset)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
          .enter() //creates placeholder nodes for each of the values
          .append('path') // replace placeholders with path elements
          .attr('d', arc) // define d attribute with arc function above
          .attr('fill', function(d) { return color(d.data.label); }) // use color scale to define fill of each label in dataset
          .each(function(d) { this._current - d; }); // creates a smooth animation for each track
        // mouse event handlers are attached to path so they need to come after its definition
        path.on('mouseover', function(d) {// when mouse enters div
         path.style('cursor', 'pointer');
         var total = d3.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset
          return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase
          }));
         var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
         tooltip.select('.label').html(d.data.label); // set current label
         tooltip.select('.count').html('' + d.data.count.toLocaleString()); // set current count
         tooltip.select('.percent').html(percent + '%'); // set percent calculated above
         tooltip.style('display', 'block'); // set display
        });
        path.on('mouseout', function() { // when mouse leaves div
          tooltip.style('display', 'none'); // hide tooltip for that element
        });

        path.on('mousemove', function(d) { // when mouse moves
          tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
            .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
          });

        // define legend
        var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
          .data(color.domain()) // refers to an array of labels from our dataset
          .enter() // creates placeholder
          .append('g') // replace placeholders with g elements
          .attr('class', 'legend') // each g is given a legend class
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing
            var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements
            var horz = 18 * legendRectSize; // the legend is shifted to the left to make room for the text
            var vert = i * height - offset; // the top of the element is shifted up or down from the center using the offset defiend earlier and the index of the current element 'i'
              return 'translate(' + horz + ',' + vert + ')'; //return translation
           });

        // adding colored squares to legend
        legend.append('rect') // append rectangle squares to legend
          .attr('width', legendRectSize) // width of rect size is defined above
          .attr('height', legendRectSize) // height of rect size is defined above
          .style('fill', color) // each fill is passed a color
          .style('stroke', color) // each stroke is passed a color
          .on('click', function(label) {
            var rect = d3.select(this); // this refers to the colored squared just clicked
            var enabled = true; // set enabled true to default
            var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
                return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
            }));
            if (rect.attr('class') === 'disabled') { // if class is disabled
              rect.attr('class', ''); // remove class disabled
            } else { // else
              if (totalEnabled < 2) return; // if less than two labels are flagged, exit
              rect.attr('class', 'disabled'); // otherwise flag the square disabled
              enabled = false; // set enabled to false
            }
            pie.value(function(d) {
              if (d.label === label) d.enabled = enabled; // if entry label matches legend label
                return (d.enabled) ? d.count : 0; // update enabled property and return count or 0 based on the entry's status
            });

            path = path.data(pie(dataset)); // update pie with new data
            let diseasesToShow = [];
            dataset.map(function(d) {
                if(d.enabled){
                    for(let disease of d.diseases){
                       diseasesToShow.push(disease);
                    }
                }
            });

            path.transition() // transition of redrawn pie
              .duration(750) //
              .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
                var interpolate = d3.interpolate(this._current, d); // this = current path element
                this._current = interpolate(0); // interpolate between current value and the new value of 'd'
                return function(t) {
                  return arc(interpolate(t));
                };
              });

            // Re - draw barchart and timeline chart with new data points
            barChartLoader(filename, selectedCountry, fromYear, toYear, diseasesToShow);
            timelineChartLoader('static/data/TimelineCntCountryWise.csv', selectedCountry, fromYear, toYear, diseasesToShow);
          });

        // adding text to legend
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          // .attr('y', legendRectSize - legendSpacing)
          .attr('y', 8)
          .text(function(d) { return d; }); // return label
    });
}

function StackedAreaChartLoader(filename, selectedCountry, fromYear, toYear) {
    document.getElementById("stacked_area_chart").innerHTML = "";
    var margin = {top: 60, right: 150, bottom: 50, left: 80},
        width = 550 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    var svg = d3.select("#stacked_area_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    d3.csv(filename, function(data) {
        // List of groups = header of the csv files
        let max_range = 0;
        data.forEach(function (d) {
            d['5-14 yrs'] = +d['5-14 yrs']
            d['15-49 yrs'] = +d['15-49 yrs']
            d['50-69 yrs'] = +d['50-69 yrs']
            d['70+ yrs'] = +d['70+ yrs']
            d['Under 5'] = +d['Under 5']
            d['year'] = +d['year']
            max_range = Math.max(d['5-14 yrs'], d['15-49 yrs'], d['50-69 yrs'], d['70+ yrs'], d['Under 5'], max_range)
        });

        var keys = data.columns.slice(2)
        let classNames = new Map();

        for(let key of keys){
            let cleanString = key.replace(/[+-\s]/g, "");
            classNames[key] = "chart_" + cleanString;
        }

        // color palette
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(['#AE3232','#DF594E','#F2846D','#FCA47C','#FEC99D']);

        // var color = d3.scaleOrdinal(d3.schemeOrRd[9]);
        // var color = d3.scaleOrdinal(d3.schemeReds[6]);

        // var color = ['#AE3232','#DF594E','#F2846D','#FCA47C','#FEC99D']
        var stackedData = d3.stack()
            .keys(keys)
            (data)

        var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return d.year; }))
            .range([ 0, width ]);
        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(5))


        svg.append("text")
            .attr("class", "heading")
            .attr("y", function () {
                return height+40;
            })
            .attr("x", function () {
                return 0;
            })
            .style('fill', fontcolor)
            .text(function () {
                return "Deaths by age over a period from " + fromYear + " to " + toYear + " (" + selectedCountry + ")";
            });

        var y = d3.scaleLinear()
            .domain([0, max_range * 2.5])
            .range([ height, 0 ]);

        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))

        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        var areaChart = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // Area generator
        var area = d3.area()
            .x(function(d) { return x(d.data.year); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); })

        // Show the areas
        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function(d) { return "myArea " + classNames[d.key] })
            .style("fill", function(d) { return color(d.key); })
            .attr("d", area)

        // Add the brushing
        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        var idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart() {
            extent = d3.event.selection
            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain(d3.extent(data, function(d) { return d.year; }))
            }else{
                x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
                areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }
            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
            areaChart
                .selectAll("path")
                .transition().duration(1000)
                .attr("d", area)
        }

        // What to do when one group is hovered
        var highlight = function(d){
            // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)

            // expect the one that is hovered
            d3.select(".myArea."+classNames[d]).style("opacity", 1);
        }

        // And when it is not hovered anymore
        var noHighlight = function(d){
            d3.selectAll(".myArea").style("opacity", 1)
        }

        // Add one dot in the legend for each name.
        var size = 20
        svg.selectAll("myrect")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 350)
            .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 350 + size*1.2)
            .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    })
}

function sliderLoader(selectedCountry, data){
  document.getElementById("slider-range").innerHTML = "";
  var sliderRange = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(800)
    .ticks(16)
    .tickFormat(d3.format('.0f'))
    .step(1)
    .default([2000, 2010])
    .fill('#27c2e5')
    .on('onchange', val => {
        // Debouncing call on each step
        debounceFunction(selectedCountry, val);
    });

  var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', 900)
    .attr('height', 70)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);
  d3.select('p#value-range').text(
    sliderRange
      .value()
      .join('-')
  );
}

function timelineChartLoader(filename, selectedCountry, fromYear, toYear, diseasesToShow){
    document.getElementById("timeline_chart").innerHTML = "";
    d3.csv(filename, function(error, df){
        let overallDataObj = {};
        let firstYearD = df[0];
        for(let disease in firstYearD){
            if(disease !== "" && disease !== "Year"){
                if(overallDataObj[disease] === undefined){
                    let newObj = {
                        name: disease,
                        values: []
                    };
                    overallDataObj[disease] = newObj;
                }
            }
        }

        for(let yearD of df){
            let year = yearD['Year'];
            let valuesArr;
            for(let key in yearD){
                if(key !== "" && key !== 'Year'){
                    if(key in overallDataObj){
                        valuesArr = overallDataObj[key]['values'];
                        valuesArr.push({
                            date: year,
                            price: yearD[key]
                        });
                    }
                }
            }
        }

        let data = [];
        if(diseasesToShow === undefined){
            for(let key in overallDataObj){
                data.push(overallDataObj[key]);
            }
        } else {
            for(let key in overallDataObj){
                if(diseasesToShow.includes(key)){
                    data.push(overallDataObj[key]);
                }
            }
        }

        var width = 400;
        var height = 220;
        var margin = 70;
        var duration = 250;

        var lineOpacity = "0.25";
        var lineOpacityHover = "0.85";
        var otherLinesOpacityHover = "0.1";
        var lineStroke = "1.5px";
        var lineStrokeHover = "2.5px";

        var circleOpacity = '0.85';
        var circleOpacityOnLineHover = "0.25"
        var circleRadius = 3;
        var circleRadiusHover = 6;

        /* Format Data */
        var parseDate = d3.timeParse("%Y");
        let allDiseaseCount = [];
        data.forEach(function(d) {
          d.values.forEach(function(d) {
            d.date = parseDate(d.date);
            d.price = +d.price/1000;
            allDiseaseCount.push(d);
          });
        });

        /* Scale */
        var xScale = d3.scaleTime()
          .domain(d3.extent(data[0].values, d => d.date))
          .range([0, width-margin]);

        var yScale = d3.scaleLinear()
          .domain([0, d3.max(allDiseaseCount, d => d.price)])
          .range([height-margin, 0]);

        // var color = d3.scaleOrdinal(d3.schemeCategory10);
        // var color = d3.scaleOrdinal(d3.schemeOrRd[9]);
        color_list = ['#8b0000','#b22222','#ff0000','#dc143c','#cd5c5c','#ffa07a']
        var color = d3.scaleOrdinal(color_list);
        /* Add SVG */
        var svg = d3.select("#timeline_chart").append("svg")
          .attr("width", (width+margin)+"px")
          .attr("height", (height+margin)+"px")
          .append('g')
          .attr("transform", `translate(${margin}, ${margin})`);

        /* Add line into SVG */
        var line = d3.line()
          .x(d => xScale(d.date))
          .y(d => yScale(d.price))
          .curve(d3.curveMonotoneX);

        let lines = svg.append('g')
          .attr('class', 'lines');

        lines.selectAll('.line-group')
          .data(data).enter()
          .append('g')
          .attr('class', 'line-group')
          .on("mouseover", function(d, i) {
              svg.append("text")
                .attr("class", "title-text")
                .style("fill", color(i))
                .text(d.name)
                .attr("text-anchor", "middle")
                .attr("x", (width-margin)/2)
                .attr("y", -30);
            })
          .on("mouseout", function(d) {
              svg.select(".title-text").remove();
            })
          .on("click", function(d) {
              // Do Something
            })
          .append('path')
          .attr('class', 'line')
          .attr('d', d => line(d.values))
          .style('stroke', (d, i) => color(i))
          .style('opacity', lineOpacity)
          .on("mouseover", function(d) {
              d3.selectAll('.line')
                            .style('opacity', otherLinesOpacityHover);
              d3.selectAll('.circle')
                            .style('opacity', circleOpacityOnLineHover);
              d3.select(this)
                .style('opacity', lineOpacityHover)
                .style("stroke-width", lineStrokeHover)
                .style("cursor", "pointer");
            })
          .on("mouseout", function(d) {
              d3.selectAll(".line")
                            .style('opacity', lineOpacity);
              d3.selectAll('.circle')
                            .style('opacity', circleOpacity);
              d3.select(this)
                .style("stroke-width", lineStroke)
                .style("cursor", "none");
            });

        /* Add circles in the line */
        lines.selectAll("circle-group")
          .data(data).enter()
          .append("g")
          .style("fill", (d, i) => color(i))
          .selectAll("circle")
          .data(d => d.values).enter()
          .append("g")
          .attr("class", "circle")
          .on("mouseover", function(d) {
              d3.select(this)
                .style("cursor", "pointer")
                .append("text")
                .attr("class", "text")
                .text(`${d.price}`)
                .attr("x", d => xScale(d.date) + 5)
                .attr("y", d => yScale(d.price) - 10);
            })
          .on("mouseout", function(d) {
              d3.select(this)
                .style("cursor", "none")
                .transition()
                .duration(duration)
                .selectAll(".text").remove();
            })
          .append("circle")
          .attr("cx", d => xScale(d.date))
          .attr("cy", d => yScale(d.price))
          .attr("r", circleRadius)
          .style('opacity', circleOpacity)
          .on("mouseover", function(d) {
                d3.select(this)
                  .transition()
                  .duration(duration)
                  .attr("r", circleRadiusHover);
              })
            .on("mouseout", function(d) {
                d3.select(this)
                  .transition()
                  .duration(duration)
                  .attr("r", circleRadius);
              });

        /* Add Axis into SVG */
        var xAxis = d3.axisBottom(xScale).ticks(5);
        var yAxis = d3.axisLeft(yScale).ticks(5);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", `translate(0, ${height-margin})`)
          .call(xAxis);

        // Add heading
        svg.append("text")
            .attr("class", "heading")
            .attr("y", function () {
                return height;
            })
            .style('fill', fontcolor)
            .attr("x", function () {
                return 0;
            })
            .text(function () {
                return "Deaths across all diseases from " + fromYear + " to " + toYear + " (" + selectedCountry + ")";
            });

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append('text')
          .attr("y", -60)
          .attr("transform", "rotate(-90)")
          .style('fill', fontcolor)
          .text("Total Deaths");
    });
}

function dropdownLoader(allCountries){
    let dropdownSelector = document.getElementById("countryDropdown");
    for(let country of allCountries){
        let option = document.createElement("option");
        option.value = country;
        option.text = country;
        dropdownSelector.add(option);
    }
}

function choroplethMapLoader(filename, fromYear, toYear){
    document.getElementById("choropleth_map").innerHTML = "";
    let margin = {
      top: 50,
      left: 50,
      right: 50,
      bottom: 50
    };

    let height = 400 - margin.top - margin.bottom;
    let width = 750 - margin.left - margin.right;

    let svg = d3.select("#choropleth_map")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

	let path = d3.geoPath();
	let data = d3.map();
	let worldmap = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
    let worldpopulation = filename;

    let centered, world;

    // style of geographic projection and scaling
    const projection = d3.geoRobinson()
        .scale(120)
        .translate([width / 2, height / 2]);

    // Define color scale
    const color = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 50000000, 70000000])
        .range(d3.schemeOrRd[7]);

    // add tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load external data and boot
    d3.queue()
        .defer(d3.json, worldmap)
        .defer(d3.csv, worldpopulation, function(d) {
            data.set(d.code, +d.deaths);
        })
        .await(ready);

    // Add clickable background
    svg.append("rect")
      .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", click);

    function ready(error, topo) {
        let mouseOver = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
                .style("stroke", "transparent");
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")
                .style("cursor", "pointer");
            tooltip.style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition().duration(400)
                .style("opacity", 1)
                .text(d.properties.name + ': ' + Math.round((d.total / 1000000) * 10) / 10 + ' mio.');
        }

        let mouseLeave = function() {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "transparent");
            tooltip.transition().duration(300)
                .style("opacity", 0);
        }

        // Draw the map
        world = svg.append("g")
        .attr("class", "world");
        world.selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            // d3.geoPath() is a built-in function of d3 v4 and takes care of showing the map from a properly formatted geojson file, if necessary filtering it through a predefined geographic projection
            .attr("d", d3.geoPath().projection(projection))

            //retrieve the name of the country from data
            .attr("data-name", function(d) {
                return d.properties.name
            })

            // set the color of each country
            .attr("fill", function(d) {
                d.total = data.get(d.id) || 0;
                return color(d.total);
            })

            // add a class, styling and mouseover/mouseleave and click functions
            .style("stroke", "transparent")
            .attr("class", function(d) {
                return "Country"
            })
            .attr("id", function(d) {
                return d.id
            })
            .style("opacity", 1)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            .on("click", click);

        // Legend
        const x = d3.scaleLinear()
            .domain([2.6, 75.1])
            .rangeRound([600, 860]);

        const legend = svg.append("g")
            .attr("id", "legend");

        const legend_entry = legend.selectAll("g.legend")
            .data(color.range().map(function(d) {
                d = color.invertExtent(d);
                if (d[0] == null) d[0] = x.domain()[0];
                if (d[1] == null) d[1] = x.domain()[1];
                return d;
            }))
            .enter().append("g")
            .attr("class", "legend_entry");

        const ls_w = 20,
            ls_h = 20;

        legend_entry.append("rect")
            .attr("x", 20)
            .attr("y", function(d, i) {
                return height - (i * ls_h) - 2 * ls_h;
            })
            .attr("width", ls_w)
            .attr("height", ls_h)
            .style("fill", function(d) {
                return color(d[0]);
            })
            .style("opacity", 0.8);

        legend_entry.append("text")
            .attr("x", 50)
            .attr("y", function(d, i) {
                return height - (i * ls_h) - ls_h - 6;
            })
            .text(function(d, i) {
                if (i === 0) return "< " + d[1] / 1000000 + " m";
                if (d[1] < d[0]) return d[0] / 1000000 + " m +";
                return d[0] / 1000000 + " m - " + d[1] / 1000000 + " m";
            });

        legend.append("text").attr("x", 0).attr("y", 300).text("Overall Deaths (Million): " + fromYear + " - " + toYear);
    }

    // Zoom functionality
    function click(d) {
      var x, y, k;

      if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = -(centroid[0] * 5);
        y = (centroid[1] * 8);
        k = 3;
        centered = d;
      } else {
        x = 0;
        y = 0;
        k = 1;
        centered = null;
      }

      world.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

      world.transition()
          .duration(750)
          .attr("transform", "translate(" + x + "," + y + ") scale(" + k + ")" );

      // Redraw all charts for selected country with new data based on slider info
      // That too while zooming in. Not zooming out
      if(k == 3){
          let selectedCountry = d.properties.name;
          if (selectedCountry == 'USA'){
              selectedCountry = 'United States'
          }
          if (selectedCountry == 'Democratic Republic of the Congo'){
              selectedCountry = 'Democratic Republic of Congo'
          }
          drawBarChart(selectedCountry, fromYear, toYear);
          drawPieChart(selectedCountry, fromYear, toYear);
          // drawStackedAreaChart(selectedCountry, fromYear, toYear);
          drawTimelineChart(selectedCountry, fromYear, toYear);
          drawStackedAreaChart(selectedCountry, fromYear, toYear);

          $('#countryDropdown').val(selectedCountry);
          $('#countryDropdown').trigger('change');
      }
    }
}

let getData = (selectedCountry, val) => {
    d3.select('p#value-range').text(val.join('-'));
    drawPieChart(selectedCountry, val[0], val[1]);
    drawTimelineChart(selectedCountry, val[0], val[1]);
    drawBarChart(selectedCountry, val[0], val[1]);
    drawStackedAreaChart(selectedCountry, val[0], val[1]);
    drawChoroplethMap(undefined, val[0], val[1]);
};

let performDebouncing = function(fn, delay) {
    let timerId;
    return function(selectedCountry, val) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(selectedCountry, val)
        }, delay);
    }
};

let debounceFunction = performDebouncing(getData, 500);