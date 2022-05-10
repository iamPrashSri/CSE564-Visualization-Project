// Bar Chart to show count of all diseases for country. Do not mess with data manipulation logic
function drawBarChart(selectedCountry, fromYear, toYear){
    $.ajax({
        type: "GET",
        data: {
            country: selectedCountry,
            fromYear: fromYear,
            toYear: toYear
        },
        url: '/bar_chart',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            let filename = 'static/data/PieDCountCtryAndYear.csv';
            barChartLoader(filename, selectedCountry, fromYear, toYear, undefined);
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
            timelineChartLoader(filename, selectedCountry, fromYear, toYear, undefined);
        }
    });
}

function drawCountryDropdown(){
    $.ajax({
        type: "GET",
        url: '/getListOfCountries',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (allCountries) {
            dropdownLoader(allCountries.allCountries);
        }
    });
}

function drawChoroplethMap(selectedCountry, fromYear, toYear){
    $.ajax({
        type: "GET",
        data: {
            country: selectedCountry,
            fromYear: fromYear,
            toYear: toYear
        },
        url: '/choropleth_map',
        dataType: "json",
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            let filename = 'static/data/choroplethMapData.csv';
            choroplethMapLoader(filename, fromYear, toYear);
        }
    });
}