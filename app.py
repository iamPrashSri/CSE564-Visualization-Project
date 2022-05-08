import math

from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/')
def loadHomeDashboard():
    # return render_template("index.html")
    # return render_template("pie_chart.html")
    # return render_template("timeline_chart.html")
    # return render_template("bubblescatter_chart.html")
    return render_template("dashboard.html")

@app.route('/bar_chart', methods = ['GET'])
def loadBarChart():
    country = request.args.get("country")
    # Prepare data
    overallDeaths = pd.read_csv('static/data/overallDeaths.csv')
    overallDeaths = overallDeaths.drop(columns=['Unnamed: 0'])
    deathForCountryDf = overallDeaths[overallDeaths['Entity'] == country]
    deathForCountryDf = deathForCountryDf.drop(columns=['Entity'])

    column_headers = deathForCountryDf.columns.values
    deathsData = deathForCountryDf.values[0]
    diseasesCSV = []
    for i in range(len(deathsData)):
        diseasesCSV.append((column_headers[i], math.ceil(deathsData[i])))

    diseaseCount_df = pd.DataFrame(diseasesCSV)
    filename = 'static/data/diseaseCount.csv'
    diseaseCount_df.columns = ['Disease', 'Deaths']
    diseaseCount_df.to_csv(filename)
    return jsonify(key="success")

@app.route('/pie_chart', methods = ['GET'])
def loadPieChart():
    country = request.args.get("country")
    fromYear = int(request.args.get("fromYear"))
    toYear = int(request.args.get("toYear"))
    # Prepare data
    overallDeathsByYear = pd.read_csv('static/data/overallDeathsByCountryAndYear.csv')
    overallDeathsByYear = overallDeathsByYear.drop(columns=['Unnamed: 0'])
    deathForCountryDf = overallDeathsByYear[overallDeathsByYear['Entity'] == country]
    deathForCountryDf = deathForCountryDf[deathForCountryDf['Year'] >= fromYear]
    deathForCountryDf = deathForCountryDf[deathForCountryDf['Year'] <= toYear]
    deathForCountryDf = deathForCountryDf.drop(columns=['Year'])
    deathForCountryDf = deathForCountryDf.groupby('Entity').sum().reset_index()
    deathForCountryDf = deathForCountryDf.drop(columns=['Entity'])

    column_headers = deathForCountryDf.columns.values
    deathsData = deathForCountryDf.values[0]
    diseasesCSV = []
    for i in range(len(deathsData)):
        diseasesCSV.append((column_headers[i], deathsData[i]))

    diseaseCount_df = pd.DataFrame(diseasesCSV)
    filename = 'static/data/PieDCountCtryAndYear.csv'
    diseaseCount_df.columns = ['Disease', 'Deaths']
    diseaseCount_df.to_csv(filename)
    return jsonify(key="success")

@app.route('/timeline_chart', methods = ['GET'])
def loadTimelineChart():
    country = request.args.get("country")
    fromYear = int(request.args.get("fromYear"))
    toYear = int(request.args.get("toYear"))

    # Preparing data
    overallDeathsByYear = pd.read_csv('static/data/overallDeathsByCountryAndYear.csv')
    overallDeathsByYear = overallDeathsByYear.drop(columns=['Unnamed: 0'])
    deathForCountryDf = overallDeathsByYear[overallDeathsByYear['Entity'] == country]
    deathForCountryDf = deathForCountryDf.drop(columns=['Entity'])
    deathForCountryDf = deathForCountryDf[deathForCountryDf['Year'] >= fromYear]
    deathForCountryDf = deathForCountryDf[deathForCountryDf['Year'] <= toYear]
    deathForCountryDf = deathForCountryDf.sort_values('Year')
    deathForCountryDf = deathForCountryDf.reset_index()
    deathForCountryDf = deathForCountryDf.drop(columns=['index'])

    filename = 'static/data/TimelineCntCountryWise.csv'
    deathForCountryDf.to_csv(filename)
    return jsonify(key="success")

@app.route('/getListOfCountries', methods = ['GET'])
def getListOfCountries():
    overallDeaths = pd.read_csv('static/data/overallDeaths.csv')
    allCountries = []
    countriesList = pd.DataFrame(overallDeaths['Entity'])
    for index, country in countriesList.iterrows():
        allCountries.append(country['Entity'])
    return jsonify(allCountries=allCountries)

if __name__ == '__main__':
    app.run()
