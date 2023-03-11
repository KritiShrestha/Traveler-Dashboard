# Traveler Dashboard

## Description 
For this project, we built an application using JavaScript and Bulma that displays city information along with forecast data. We used the Open-Meteo API to display the current weather data for a city along with a 5-day forecast. We used the Teleport API to pull the city population, city rankings, and city images. There is also an image modal that displays a map for each city. In addition, the selected city is saved in local storage so that the information displays after the page reloads.

The webpage can be found here: 

## API Documentation
https://open-meteo.com/en/docs</br>
https://developers.teleport.org/api/getting_started/

## Usage
The webpage displays the city information, current weather data and a 5-day forecast when the user selects a destination.

## User Story

```
AS A traveler
I WANT to see the weather and city information for multiple destinations
SO THAT I can plan which city to visit 
```

## Acceptance Criteria 

```
GIVEN a traveler dashboard with weather data and city rankings
WHEN I select a destination
THEN I am presented with city information and weather data and that city name is added to local storage
WHEN I view current weather conditions for that city
THEN I am presented with an icon of the weather conditions, the temperature, wind speed, and wind direction
WHEN I view hourly forecast for that city
THEN I am presented with a 5-day forecast that displays the temperature, humidity, wind speed, and date
WHEN I view the city information
THEN I presented with population data along with rankings for cost of living, commute, safety, and outdoors
WHEN I click the map of the city
THEN I am presented with a pop up modal of the city map
```

## Mock-Up

The following image shows the web application's appearance and functionality:

![travler-dashboard](assets/images/Atlanta.png)
