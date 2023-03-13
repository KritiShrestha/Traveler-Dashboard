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

        getModal(city);

        //add city name html so user knows which city is being displayed
        $('#city-name').text(city)

        //if local storage is not null, then the city var is set to the city already stored
    } else if (cityStored !== null) {
        city = cityStored;

        //calls getGeocode function & passes the city var
        getGeocode(city);

        //calls getLocationFacts using Teleport API and passed city var
        getLocationFacts(city);

        //calls getCityPhotos function using Teleport API and passes city var
        getCityPhotos(city);

        getModal(city);

        //add city name html so user knows which city is being displayed
        $('#city-name').text(city)
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

        getModal(city);

        //add city name html so user knows which city is being displayed
        $('#city-name').text(city)
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

    // ID Variables 
    var weatherIcon = $('#weather-icon')
    var temp = $('#temp');
    var wind_speed = $('#wind-speed')
    var wind_direct = $('#wind-direction')

    //Adding today's date in container header
    $('#todays-date').text(': ' + dayjs().format('M/DD/YY'))

    //Weather Values
    temp.text('Temp: ' + data.current_weather.temperature + " F");
    wind_speed.text('Wind: ' + data.current_weather.windspeed + " mph")
    
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

    // weather icon
    var weatherCode = data.current_weather.weathercode
    console.log("WEATHERCODE", weatherCode)

    //sets specific icon based on weather code
    if (weatherCode === 0) {
        weatherIcon.attr('class', 'fa-solid fa-sun fa-2xl')
    } else if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
        weatherIcon.attr('class', 'fa-solid fa-cloud-sun fa-2xl')
    } else if (weatherCode === 45 || weatherCode === 48) {
        weatherIcon.attr('class', 'fa-solid fa-smog fa-2xl') 
    } else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) {
        weatherIcon.attr('class', 'fa-solid fa-cloud fa-2xl') 
    } else if (weatherCode === 56 || weatherCode === 57 || weatherCode === 61 || weatherCode === 63 || weatherCode === 65 || weatherCode === 66 || weatherCode === 67) {
        weatherIcon.attr('class', 'fa-solid fa-cloud-rain fa-2xl') 
    } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 75 || weatherCode === 77 || weatherCode === 85 || weatherCode === 86) {
        weatherIcon.attr('class', 'fa-solid fa-snowflake fa-2xl') 
    } else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
        weatherIcon.attr('class', 'fa-solid fa-cloud-showers-heavy fa-2xl') 
    } else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) {
        weatherIcon.attr('class', 'fa-solid fa-cloud-bolt fa-2xl') 
    }

    displayForecast(data)
  
}
function displayForecast(data) {
    console.log("display forecast works")

    var fiveForecastEl = $('#fiveDayForecast');
    
    fiveForecastEl.empty();
    
		var forecast = data.hourly;

        console.log(forecast)

	    //Append cards for each forecast day to the screen 
		for (let i = 36; i < 145; i+= 24) {

		 	var divElCard = $('<div>');
			divElCard.attr('class', 'column card');
		 	fiveForecastEl.append(divElCard);

		 	var divElBody = $('<div>');
		 	divElBody.attr('class', 'card-body');
		 	divElCard.append(divElBody);

             console.log("forecast", forecast[i]);

            //Time
            var ptimeEl = $('<p>').text(dayjs(`${forecast.time[i]}`).format('M/DD/YY'))
            divElBody.append(ptimeEl);

		 	//Temp
		 	var pElTemp = $('<p>').text('Temp: ' + forecast.temperature_2m[i] + ' °F');
		 	divElBody.append(pElTemp);
            console.log("pELTemp", pElTemp)

		 	//Humidity
		 	var pElHumid = $('<p>').text('Humidity: ' + forecast.relativehumidity_2m[i] + ' %');
		 	divElBody.append(pElHumid);
            console.log("pElHumid", pElHumid)

            //Wind
            var pwindEl = $('<p>').text('Wind: ' +  forecast.windspeed_10m[i] + ' MPH');
            divElBody.append(pwindEl);

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

//functions displays the correct map when Modal button is clicked
function getModal(city) {
    console.log("TESTING", city)

    //creates var that references the class ID city-map in html
    var cityMap = $('.city-map')
    
    //If/else statement loops through to select correct image that corresponds with city var
    if (city === "Atlanta") {
        cityMap.attr("src", "./assets/images/Atlanta.PNG")
    } else  if (city === "Miami") {
        cityMap.attr("src", "./assets/images/Miami.PNG")
    } else  if (city === "Dallas") {
        cityMap.attr("src", "./assets/images/Dallas.PNG")
    } else  if (city === "Raleigh") {
        cityMap.attr("src", "./assets/images/Raleigh.PNG")
    } else if (city === "Denver") {
        cityMap.attr("src", "./assets/images/Denver.PNG")
    } 

    // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });
}