/* Global Variables */
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
let apiKey = '&appid=7b76466f46622c0d0c716b6ffb4c681c';
let localExpressBaseURL = 'http://localhost:3000';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const generateWeatherForecast = (e) => {
    const zipCode = document.getElementById('zip').value;
    if (zipCode) {
        document.getElementById('zip-error').innerHTML = '';
        getForecast(baseURL, zipCode, apiKey).then((data) => {
                let feelings = document.getElementById('feelings').value;
                if (data.cod && data.cod == '404') {
                    document.getElementById('zip-error').innerHTML = 'Zipcode do not match in the US. Please enter a valid US zipcode.';
                    return false;
                } else if (data.cod && data.cod == '200') {
                    postWeatherData(`${localExpressBaseURL}/weather`, {
                        temperature: data.main.temp + '°',
                        date: newDate,
                        user_response: feelings
                    });
                    return true;
                }
            })
            .then((validity) => {
                if (validity)
                    getWeatherData(`${localExpressBaseURL}/weather`).then((data) => {
                        updateUIMostRecent(data);
                    });
                else {
                    document.getElementById('date').innerHTML = '';
                    document.getElementById('temp').innerHTML = '';
                    document.getElementById('content').innerHTML = '';
                }
            });
    } else {
        document.getElementById('zip-error').innerHTML = 'Zipcode can not be empty.';
    }
}

const getForecast = async (baseURL, zipCode, key) => {
    const res = await fetch(baseURL + zipCode + key)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
}

const postWeatherData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

const getWeatherData = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    try {
        const data = await response.json();
        let dataArr = data.weatherJournal;

        return dataArr[data.weatherJournal.length - 1];
    } catch (error) {
        console.log("error", error);
    }
}

const updateUIMostRecent = (data) => {
    document.getElementById('date').innerHTML = `Date: ${data.date}`;
    document.getElementById('temp').innerHTML = `Temprature: ${data.temperature}`;
    document.getElementById('content').innerHTML = `Your Feelings: ${data.user_response}`;
}

document.getElementById('generate').addEventListener('click', generateWeatherForecast);