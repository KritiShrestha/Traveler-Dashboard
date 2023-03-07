function getWeatherApi () {
    var requestUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.02&longitude=-79.02&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&timezone=auto';

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

    var temp = $('#temp');

    temp.text(data.current_weather.temperature);
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