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