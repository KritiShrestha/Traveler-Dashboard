var city= "New York City"
var cityHist = []

//Initializes jQuery & waits for DOM elements to load
$(function() {
    console.log("Page & jQuery initialized ✔️")

    getExampleCity();

    clickListener();

	

    // loadCities()
    
})

function clickListener() {
    //references dest-button id from html
    var destBtn = $('.dest-btn')

    //adds event listener for destination button click
    destBtn.click(function (event) {
        console.log('button click event listener works ✔️')
        event.preventDefault()

        //creating var that specifies the text where the click event occurred
        var city = $(event.target).text();
        console.log('event.target ✔️', $(event.target).text())

        //calls getGeocode function & passes the city var
        getGeocode(city)
    });
}

//gets example city to display initially
function getExampleCity() {

    localStorage.setItem('city', JSON.stringify(city));

    var cityHistStore = JSON.parse(localStorage.getItem('city'));
    console.log('cityhiststore: ', cityHistStore)

    // if (cityHistStore !== null) {
	// 	cityHist = cityHistStore
	// }

    getGeocode(city);
}

function getGeocode(city) {
    //created a new var which strings together the base Teleport api url & the var destClicked var
    var geocodeUrl= 'https://api.teleport.org/api/cities/?search=' + city;
    //logs the whole url
    console.log('geocode url ✔️', geocodeUrl)

    // fetches the geocode api url
    fetch(geocodeUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //logs the geocode Url data
            console.log('geocode Url DATA: ✔️', data);

            //names a var which holds the url containing the city's geoname ID
            var geohref = data._embedded["city:search-results"][0]._links["city:item"].href;
            //logs the url
            console.log('geohref url ✔️', geohref);

            //creates a var that holds a portion of the string after character 36, specifically the geoname ID portion at the endpoint
            var geonameID = geohref.substring(36)
            //logs the specific portion
            console.log('geoname ID ✔️', geonameID)

            //calls the getCoordinates function & passes the geonameID var
            getCoordinates(geonameID);
        })
}

function getCoordinates(geonameID) {
    //created a new var which strings together the base Teleport api url & the geoname ID var
    var coordinatesUrl = 'https://api.teleport.org/api/cities/' + geonameID;
    console.log('coordinates Url ✔️', coordinatesUrl)
    
    //fetches the coordinates api url
    fetch(coordinatesUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //logs the coordinates url data
            console.log('coordinates Url DATA: ✔️', data);

        //creates a new var which holds the city's latitude aka the data's latitude property
        var lat= data.location.latlon.latitude;
        console.log('Latitude: ✔️', lat);

        //creates a new var which holds the city's latitude aka the data's latitude property
        var lon= data.location.latlon.longitude;
        console.log('Longitude: ✔️', lon);

        //calls the getWeatherApi function
        getWeatherApi(lat, lon)
        })

}    

function getWeatherApi (lat, lon) {
    //created a new var which strings together the base OpenMeteo api url & the lat/lon vars
    var weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=weathercode,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&timezone=auto';
    console.log('getWeatherApi Url: ✔️', weatherUrl)

    //fetches the weather Api Url
    fetch(weatherUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //logs weather Url data
            console.log('weather Url DATA: ✔️', data);

            //calls appenWeather function & passes data
            appendWeather(data);
            // getMapApi(lat, lon);
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
