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

        var color = d3.scaleOrdinal(d3.schemeCategory10);
        let colorCode = 0;
        for(let d of filteredData){
            d['colorCode'] = colorCode++%10;
        }

        //sort bars based on value
        filteredData = filteredData.sort(function (a, b) {
            return d3.ascending(a.Deaths, b.Deaths);
        })

        var margin = {
            top: 10,
            right: 0,
            bottom: 15,
            left: 155
        };

        var width = 500 - margin.left - margin.right,
            height = 280 - margin.top - margin.bottom;

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
            .padding(0.1)
            .domain(filteredData.map(function (d) {
                return d.Disease;
            }));

        svg.append("text")
            .attr("class", "heading")
            .attr("y", function () {
                return 5;
            })
            .attr("x", function () {
                return -70;
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

        bars.append("rect")
            .attr("class", "bar")
            .attr("y", function (d) {
                return y(d.Disease);
            })
            .style("fill", function (d, i) {
                return color(+d.colorCode);
            })
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", function (d) {
                return x(d.Deaths/1.5);
            });

        //add a value label to the right of each bar
        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", function (d) {
                return y(d.Disease) + y.bandwidth() / 2 + 4;
            })
            //x position is 3 pixels to the right of the bar
            .attr("x", function (d) {
                return x(d.Deaths/1.5) + 3;
            })
            .text(function (d) {
                return d.Deaths.toLocaleString();
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
        var color = d3.scaleOrdinal(d3.schemeCategory20c);
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

function sliderLoader(selectedCountry, data){
  document.getElementById("slider-range").innerHTML = "";
  var sliderRange = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(800)
    .ticks(16)
    .step(1)
    .default([2000, 2010])
    .fill('#2196f3')
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

        var width = 350;
        var height = 230;
        var margin = 50;
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

        var color = d3.scaleOrdinal(d3.schemeCategory10);

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
                .attr("y", 5);
            })
          .on("mouseout", function(d) {
              svg.select(".title-text").remove();
            })
          .on("click", function(d) {
              alert("Clicked");
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
          .attr("y", 15)
          .attr("transform", "rotate(-90)")
          .attr("fill", "#000")
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

let getData = (selectedCountry, val) => {
    d3.select('p#value-range').text(val.join('-'));
    drawPieChart(selectedCountry, val[0], val[1]);
    drawTimelineChart(selectedCountry, val[0], val[1]);
    drawBarChart(selectedCountry, val[0], val[1]);
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