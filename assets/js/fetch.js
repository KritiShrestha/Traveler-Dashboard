function getWeatherApi() {
  var requestUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=35.02&longitude=-79.02&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&timezone=auto";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var lat = data.latitude;
      var lon = data.longitude;

      appendWeather(data);
      getMapApi(lat, lon);
    });
}

function appendWeather(data) {
  var weather = $(".weather-forecast");

  var temp = $("#temp");

  temp.text(data.current_weather.temperature);
}

function getMapApi(lat, lon) {
  //console.log(lat, lon);
  //var requestUrl2 = 'https://app.cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec?lat=' + data.latitude + '&lng=' + data.longitude + '&zoom=8'

  var requestUrl2 =
    "https://cartes.io/api/maps/048eebe4-8dac-46e2-a947-50b6b8062fec/markers";
  //?lat=' + lat + '&lng=' + lon + '

  fetch(requestUrl2)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getDestData() {
  var DestDataUrl =
    "https://api.teleport.org/api/urban_areas/slug:san-francisco-bay-area/scores/";

  fetch(DestDataUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("dest", data);
      console.log();
    });
}

function searchForCity() {
  var APIUrl = "https://api.teleport.org/api/cities/?search=miami&limit=1";
  //var cityName = "miami";
  console.log(APIUrl);

  fetch(APIUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      console.log("citysearch", data);
      console.log("geoname", data._embedded["city:search-results"][0]._links["city:item"].href);
     
    });
}

// function getCityCoordinates() {
//     var APIUrl = "https://api.teleport.org/api/cities/geonameid:" + cityGeoID;
//     var cityGeoID = 
// }

$(function () {
  getWeatherApi();
  getDestData();
  searchForCity();
});
