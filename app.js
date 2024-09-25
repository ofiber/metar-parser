const inject = require("@vercel/analytics");
const injectSpeedInsights = require("@vercel/speed-insights");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000;

const corsOptions = {
    origin: '*',
    methods: 'GET, OPTIONS, PATCH, DELETE, POST, PUT',
    allowedHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    optionsSuccessStatus: 200,
    credentials: true
};

inject.inject();
injectSpeedInsights.injectSpeedInsights();

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
        
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        }

        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.post('/results', (req, res) => {
    console.log(req.body);
    res.send('/public/results.html');
});

app.get('/', (req, res) => {
  res.send('/public/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function getMetar(icaoCode) {

    let time = parseTimeToZulu();

    //console.log(time);
    
    if(!icaoCode) {
        icaoCode = "KATL";
    }
    else icaoCode = icaoCode.toUpperCase();

    let url = `https://aviationweather.gov/api/data/metar?ids=${icaoCode}&format=raw&taf=false&hours=0&date=${time}`;

    //console.log(url);

    return fetch(url, {
        method: 'GET',
    }).then(response => {
        return response.text();
    });
}

function parseTimeToZulu() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');

    return `${year}${month}${day}_${hours}${minutes}` + "Z";
}

async function requestMetar(icao) {
    console.log("Requesting METAR for " + icao);

    await getMetar(icao).then(result => {
        globalRes = result;
    });

    return globalRes;
}

module.exports - { requestMetar };