
//Initializes jQuery & waits for DOM elements to load
$(function() {
    console.log("Page & jQuery initialized ✔️")

    
    var destBtn = $('.dest-btn')

    //adding event listener for destination buttons
    destBtn.click(function(event) {
        console.log('button click event listener works ✔️')
        event.preventDefault()

       var destClicked = $(event.target).text();
        console.log('event.target ✔️', $(event.target).text())

       getGeocode(destClicked)

    });
    
})


function getGeocode(destClicked) {
    var geocodeUrl= 'https://api.teleport.org/api/cities/?search=' + destClicked;
    console.log('geocode', geocodeUrl)
    
    fetch(geocodeUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
}

function getWeatherApi () {
    console.log('getWeatherApi ✔️')
    var requestUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.02&longitude=-79.02&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&timezone=auto';

    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            var lat= data.latitude;
            var lon= data.longitude;

            // appendWeather(data);
            // getMapApi(lat, lon);
        })
}