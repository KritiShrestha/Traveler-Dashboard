function getWeatherApi () {
   // var requestUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.02&longitude=-79.02&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&timezone=auto';
    var requestUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.77&longitude=-78.64&daily=weathercode,temperature_2m_max,apparent_temperature_max,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York'

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            appendWeather(data);
            getMapApi(data);
        })
}

function appendWeather(data) {
    var weather = $('.weather-forecast');

    // ID Variables 
    var temp = $('#temp');
    var wind_speed = $('#wind-speed')
    var wind_direct = $('#wind-direction')

    //Weather Values
    temp.text(data.current_weather.temperature + " F");
    wind_speed.text(data.current_weather.windspeed + " mph")
    
    var wind_spot = data.current_weather.winddirection
    console.log(wind_spot)

    // finding wind direction 
    if (wind_spot > 0 && wind_spot < 90) {
        wind_direct.text('Wind Direction: NE')
    } else if (wind_spot > 90 && wind_spot < 180) {
        wind_direct.text('Wind Direction: SE')
    } else if (wind_spot > 180 && wind_spot < 270) {
        wind_direct.text('Wind Direction: SW') 
    } else if (wind_spot > 270 && wind_spot < 360) {
        wind_direct.text('Wind Direction: NW')
    } else if (wind_spot === 0 || wind_spot === 360) {
        wind_direct.text('Wind Direction: N')
    } else if (wind_spot === 90) {
        wind_direct.text('Wind Direction: E')
    } else if (wind_spot === 180) {
        wind_direct.text('Wind Direction: S')
    } else if (wind_spot === 270) {
        wind_direct.text('Wind Direction: W')
    }   

    // weather img
    weatherPic = $('#weather-pic')
    
    
}


function getMapApi() {
    //console.log(data.latitude, data.longitude);
    //var requestUrl2 = 'https://app.cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec?lat=' + data.latitude + '&lng=' + data.longitude + '&zoom=8'

    var requestUrl2 = 'https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec/markers'

    fetch(requestUrl2)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })

}



$(function() {
    getWeatherApi();
   
})