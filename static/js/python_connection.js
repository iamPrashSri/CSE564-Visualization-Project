function drawChloropethMap(){
    console.log("Hello");
    let rename = new Map([
      ["Antigua and Barbuda", "Antigua and Barb."],
      ["Bolivia (Plurinational State of)", "Bolivia"],
      ["Bosnia and Herzegovina", "Bosnia and Herz."],
      ["Brunei Darussalam", "Brunei"],
      ["Central African Republic", "Central African Rep."],
      ["Cook Islands", "Cook Is."],
      ["Democratic People's Republic of Korea", "North Korea"],
      ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
      ["Dominican Republic", "Dominican Rep."],
      ["Equatorial Guinea", "Eq. Guinea"],
      ["Iran (Islamic Republic of)", "Iran"],
      ["Lao People's Democratic Republic", "Laos"],
      ["Marshall Islands", "Marshall Is."],
      ["Micronesia (Federated States of)", "Micronesia"],
      ["Republic of Korea", "South Korea"],
      ["Republic of Moldova", "Moldova"],
      ["Russian Federation", "Russia"],
      ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
      ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
      ["Sao Tome and Principe", "São Tomé and Principe"],
      ["Solomon Islands", "Solomon Is."],
      ["South Sudan", "S. Sudan"],
      ["Swaziland", "eSwatini"],
      ["Syrian Arab Republic", "Syria"],
      ["The former Yugoslav Republic of Macedonia", "Macedonia"],
      ["United Republic of Tanzania", "Tanzania"],
      ["Venezuela (Bolivarian Republic of)", "Venezuela"],
      ["Viet Nam", "Vietnam"]
    ])

    d3.csv("static/data/hale.csv", function(error, data){
        // let newData = data.map(d => ({name: rename.get(d.country) || d.country, hale: +d.hale}));
        let svg = Choropleth(data, {
            id: d => d.name, // country name, e.g. Zimbabwe
            value: d => d.hale, // health-adjusted life expectancy
            range: d3.interpolateYlGnBu,
            featureId: d => d.properties.name,
            // projection: d3.geoNaturalEarth(),
        });
        console.log(svg);
    });
}

// Bar Chart to show count of all diseases for country. Do not mess with data manipulation logic
function drawBarChart(selectedCountry){
    $.ajax({
        type: "GET",
        data: {
            country: selectedCountry,
        },
        url: '/bar_chart',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            let filename = 'static/data/diseaseCount.csv';
            barChartLoader(filename, selectedCountry);
        }
    });
}

function drawPieChart(selectedCountry, fromYear, toYear){
    $.ajax({
        type: "GET",
        data: {
            country: selectedCountry,
            fromYear: fromYear,
            toYear: toYear
        },
        url: '/pie_chart',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            let filename = 'static/data/PieDCountCtryAndYear.csv';
            pieChartLoader(filename, selectedCountry, fromYear, toYear);
        }
    });
}

function drawYearlySlider(selectedCountry){
    var data = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000,
                2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
                2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
    sliderLoader(selectedCountry, data);
}

function drawTimelineChart(selectedCountry, fromYear, toYear){
    $.ajax({
        type: "GET",
        data: {
            country: selectedCountry,
            fromYear: fromYear,
            toYear: toYear
        },
        url: '/timeline_chart',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            let filename = 'static/data/TimelineCntCountryWise.csv';
            timelineChartLoader(filename, selectedCountry, fromYear, toYear);
        }
    });
}

function drawBubbleScatterChart(selectedCountry, fromYear, toYear){
    $.ajax({
        type: "GET",
        data: {
            country: selectedCountry,
            fromYear: fromYear,
            toYear: toYear
        },
        url: '/timeline_chart',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            let filename = '';
            bubbleScatterLoader(filename, selectedCountry, fromYear, toYear);
        }
    });
}