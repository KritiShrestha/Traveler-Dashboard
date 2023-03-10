//Initializes jQuery & waits for DOM elements to load
$(function() {
    console.log("Page & jQuery initialized ✔️")

    //calls the getInitialCity function
    getInitialCity();

    //calls the clickListener function
    clickListener();
})

//gets initial city to display upon page load
function getInitialCity() {
    //retrieves any city saved in local storage and sets to a new var named cityStored
    var cityStored = JSON.parse(localStorage.getItem("city"));
    console.log("city stored: ", cityStored);

  //makes sure there is at least one city to display initially
    if (cityStored === null) {
        //sets default city to Atlanta if there is no city saved to local storage
        var city = "Atlanta";
        console.log("default city: ", city);
        //saves the var city to local storage
        localStorage.setItem('city', JSON.stringify(city));

        //calls getGeocode function & passes the city var
        getGeocode(city);

        //calls getLocationFacts using Teleport API and passed city var
        getLocationFacts(city);

        //calls getCityPhotos function using Teleport API and passes city var
        getCityPhotos(city);

        //if local storage is not null, then the city var is set to the city already stored
    } else if (cityStored !== null) {
        city = cityStored;

        //calls getGeocode function & passes the city var
        getGeocode(city);

        //calls getLocationFacts using Teleport API and passed city var
        getLocationFacts(city);

        //calls getCityPhotos function using Teleport API and passes city var
        getCityPhotos(city);
    }
}

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

        //saves new city to local storage 
	      localStorage.setItem('city', JSON.stringify(city));
    
        //calls getGeocode function & passes the city var
        getGeocode(city)
        
        //calls getLocationFacts using Teleport API and passed city var
        getLocationFacts(city)
        
        //calls getCityPhotos function using Teleport API and passes city var
        getCityPhotos(city)
    });
}

function getGeocode(city) {
    //created a new var which strings together the base Teleport api url & the city var
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

        //creates a new var which contains the city population information and pushes it to the html page
        var population = data.population;
        $('#population').text("Population: " + population);

        //calls the getWeatherApi function and passes the lat/lon vars
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
    

    displayForecast(data)
  
}
function displayForecast(data) {
    console.log("display forecast works")

    var fiveForecastEl = $('#fiveDayForecast');
    
    fiveForecastEl.empty();
    
    var fiveDayArray = data.hourly;
		var forecast = [];
		//Made a object that would allow for easier data read
		$.each(fiveDayArray, function (index, value) {
			testObj = {
			    humidityRel: data.hourly.relativehumidity_2m,
				temp_2m: data.hourly.temperature_2m,
				time: data.hourly.time,
                wind_10m: data.hourly.windspeed_10m
			}

            forecast.push(testObj)
			
		})

        console.log(testObj)
        console.log(forecast)
	     //Inject the cards to the screen 
		for (let i = 0; i < 5; i++) {

		 	var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
		 	divElCard.attr('style', 'max-width: 215px;');
		 	fiveForecastEl.append(divElCard);

		 	var divElHeader = $('<div>');
		 	divElHeader.attr('class', 'card-header')
		 	// var dayFormat = dayjs(`${forecast[i].date}`).format('MM-DD-YYYY');
		 	// divElHeader.text(dayFormat);
		 	// divElCard.append(divElHeader)

		 	var divElBody = $('<div>');
		 	divElBody.attr('class', 'card-body');
		 	divElCard.append(divElBody);

		 	var divElIcon = $('<img>');
		 	divElIcon.attr('class', 'icons');
		 	// divElIcon.attr('src', `https://openweathermap.org/img/wn/${forecast[i].icon}@2x.png`);
		 	divElBody.append(divElIcon);

		 	//Temp
		 	var pElTemp = $('<p>').text('Temperature: ' + forecast[i].temp_2m.slice(0,5)[i] + ' °F');
		 	divElBody.append(pElTemp);

		 	//Humidity
		 	var pElHumid = $('<p>').text('Humidity: ' + forecast[i].humidityRel.slice(0,5)[i] + ' %');
		 	divElBody.append(pElHumid);

             //Wind
             var pwindEl = $('<p>').text('Wind: ' +  forecast[i].wind_10m.slice(0,5)[i] + ' MPH');
             divElBody.append(pwindEl);

             //Time
             var ptimeEl = $('<p>').text('Time: ' + forecast[i].time.slice(0,5)[i])
             divElBody.append(ptimeEl);
        }
}
function getLocationFacts(city) {
    //converts the destination to lowercase letters which is needed for the API URL
    cityLowercase = city.toLowerCase()
    var APIUrl= 'https://api.teleport.org/api/urban_areas/slug:'+ cityLowercase + "/scores/"
    console.log('getLocationFacts URL ✔️', APIUrl);

    //fetches the location facts api url
    fetch(APIUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            //logs the location facts url data
            console.log('location facts URL DATA: ✔️', data);
        
        //add city name to population facts section so user knows which city is being displayed
        $('#city-name').text(city)

        //get cost of living ranking and add text to the html page
        var costofLiving = data.categories[1]["score_out_of_10"];
        console.log("location facts DATA Cost of Living", costofLiving);     
        $('#cost-of-living').text("Cost of Living: " + costofLiving.toFixed(2) + " out of 10");
        
        //get commute ranking and add text to the html page
        var commute = data.categories[5]["score_out_of_10"];
        console.log("location facts DATA Commute", commute);   
        $('#commute').text("Commute: " + commute.toFixed(2) + " out of 10");
        
        //get safety ranking and add text to the html page
        var safety = data.categories[7]["score_out_of_10"];
        console.log("location facts DATA Safety", safety); 
        $('#safety').text("Safety: " + safety.toFixed(2) + " out of 10");

        //get outoors ranking and add text to the html page
        var outdoors = data.categories[16]["score_out_of_10"];
        console.log("location facts DATA Outdoors", outdoors); 
        $('#outdoors').text("Outdoors: " + outdoors.toFixed(2) + " out of 10");

        })
}

function getCityPhotos(city) {
     //converts the destination to lowercase letters which is needed for the API URL
     cityLowercase = city.toLowerCase()
     var APIUrl= 'https://api.teleport.org/api/urban_areas/slug:'+ cityLowercase + "/images/"
     console.log('getCityPhotos URL ✔️', APIUrl);
 
     //fetches the location facts api url
     fetch(APIUrl)
         .then(function(response) {
             return response.json();
         })
         .then(function(data) {
             //logs the location facts url data
             console.log('City Photos URL DATA: ✔️', data);
        
        //gets city image from API and adds to the html page
        var cityimage = data.photos[0].image.mobile;
        console.log("getCityPhotos DATA image", cityimage);
        $('#city-image').attr("src", cityimage);
        })
}

