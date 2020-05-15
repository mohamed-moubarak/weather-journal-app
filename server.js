// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;
const listening = () => {
    console.log(`running on localhost: ${port}`);
};

// Start up an instance of app
// Express to run server and routes
const server = app.listen(port, listening);

const sendWeather = (req, res) => {
    res.send(projectData);
};
app.get('/weather', sendWeather);

const data = [];
const addWeather = (req, res) => {
    addWeatherEntry(req);
    projectData['weatherJournal'] = data;
};
app.post('/weather', addWeather);

const addWeatherEntry = (req) => {
    let newData = req.body;
    let entry = {
        temperature: newData.temperature,
        date: newData.date,
        user_response: newData.user_response
    };
    data.push(entry);
};