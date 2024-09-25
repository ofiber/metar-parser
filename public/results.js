import { requestMetar } from './../app.js';

//const requestMetar = require('/js/ApiHandler.js');
//const result = require('./js/ApiHandler.js');

const text = `
DECODED METAR


ICAO: KALB
STATION NAME: ALBANY INTERNATIONAL AIRPORT
TIME: 1751 Z
WIND: 160 @ 05
VISIBILITY: 10 MILES
CLOUD COVERAGE: FEW AT 5000FT, SCATTERED AT 10000FT, BROKEN AT 12000FT
TEMPERATURE: 21.7 C
DEWPOINT: 16.1 C
ALTIMETER: 29.58 INHG
SEA LEVEL PRESSURE: 1001.7 HPA
WEATHER: N/A
PERCIPITATION: 3HR 0.06"

`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

window.onload = function() {
    var results = document.getElementById('results');
    
    let params = new URLSearchParams(window.location.search);
    let icao = params.get('icao');
    console.log(icao);
    results.textContent = "Loading...";
    sleep(1000).then (() => loadData(results, icao));
}

async function loadData(results, icao) {
    results.textContent = await requestMetar(icao);
    console.log("Request loaded");
}