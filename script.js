const search = document.querySelector("#search");

search.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    populateData(search.value);
    search.value = "";
  }
});

populateData("new orleans");

async function getData(location) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=eebca7c5efe5281f48e5bd936f7fd188&units=imperial`
  );
  const currentWeatherData = await response.json();
  const response2 = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=eebca7c5efe5281f48e5bd936f7fd188`
  );
  const locationData = await response2.json();
  const currentWeather = {
    description: currentWeatherData.weather[0].main,
    windSpeed: Math.round(currentWeatherData.wind.speed),
    windDirection: convertWindDirection(currentWeatherData.wind.deg),
    feelsLike: Math.round(currentWeatherData.main.feels_like),
    temp: Math.round(currentWeatherData.main.temp),
    humidity: Math.round(currentWeatherData.main.humidity),
    pressure: currentWeatherData.main.pressure,
    sunrise: currentWeatherData.sys.sunrise,
    sunset: currentWeatherData.sys.sunset,
    visibility: Math.round(currentWeatherData.visibility / 1000),
    name: currentWeatherData.name,
    state: locationData[0].state,
    country: locationData[0].country,
    date: new Date(currentWeatherData.dt * 1000),
  };
  console.log(currentWeather.date);
  return currentWeather;
}

async function populateData(location) {
  const currentWeather = await getData(location);
  const header = document.querySelector("#header");
  const temp = document.querySelector("#temp");
  const feelsLike = document.querySelector("#feels_like");
  const description = document.querySelector("#description");
  const wind = document.querySelector("#wind");
  const humidity = document.querySelector("#humidity");
  const pressure = document.querySelector("#pressure");
  const visibility = document.querySelector("#visibility");
  const weatherImage = document.querySelector("#weather_image");
  const hour = currentWeather.date.getHours();
  if (!currentWeather.state) {
    header.textContent = `Weather Today in ${currentWeather.name}, ${currentWeather.country}`;
  } else if (currentWeather.country == "US") {
    header.textContent = `Weather Today in ${currentWeather.name}, ${currentWeather.state}`;
  } else {
    header.textContent = `Weather Today in ${currentWeather.name}, ${currentWeather.state}, ${currentWeather.country}`;
  }
  temp.textContent = `${currentWeather.temp}°`;
  feelsLike.textContent = `feels like: ${currentWeather.feelsLike}°`;
  description.textContent = `${currentWeather.description}`;
  wind.textContent = `${currentWeather.windDirection} ${currentWeather.windSpeed} mph`;
  humidity.textContent = `${currentWeather.humidity}%`;
  pressure.textContent = `${currentWeather.pressure} mb`;
  visibility.textContent = `${currentWeather.visibility} miles`;
  if (currentWeather.description == "Clear") {
    if (hour > 6 && hour < 19) {
      weatherImage.src = "./images/sun.png";
    } else {
      weatherImage.src = "./images/crescent-moon.png";
    }
    weatherImage.alt = "clear";
  } else if (currentWeather.description == "Rain") {
    weatherImage.src = "./images/raining.png";
    weatherImage.alt = "rain";
  } else if (currentWeather.description == "Clouds") {
    if (hour > 6 && hour < 19) {
      weatherImage.src = "./images/cloudy day.png";
    } else {
      weatherImage.src = "./images/night cloud.png";
    }
    weatherImage.alt = "clouds";
  } else if (currentWeather.description == "Fog") {
    weatherImage.src = "./images/fog.png"; //TODO download picture
    weatherImage.alt = "fog";
  } else if (currentWeather.description == "Snow") {
    weatherImage.src = "./images/snow.png"; //TODO download picture
    weatherImage.alt = "snow";
  }
}

function convertWindDirection(deg) {
  let direction;
  if (deg > 348.75 || deg <= 11.25) {
    direction = "N";
  } else if (deg > 11.25 && deg <= 33.75) {
    direction = "NNE";
  } else if (deg > 33.75 && deg <= 56.25) {
    direction = "NE";
  } else if (deg > 56.25 && deg <= 78.75) {
    direction = "ENE";
  } else if (deg > 78.75 && deg <= 101.25) {
    direction = "E";
  } else if (deg > 101.25 && deg <= 123.75) {
    direction = "ESE";
  } else if (deg > 123.75 && deg <= 146.25) {
    direction = "SE";
  } else if (deg > 146.25 && deg <= 168.75) {
    direction = "SSE";
  } else if (deg > 168.75 && deg <= 191.25) {
    direction = "S";
  } else if (deg > 191.25 && deg <= 213.75) {
    direction = "SSW";
  } else if (deg > 213.75 && deg <= 236.25) {
    direction = "SW";
  } else if (deg > 236.25 && deg <= 258.75) {
    direction = "WSW";
  } else if (deg > 258.75 && deg <= 281.25) {
    direction = "W";
  } else if (deg > 281.25 && deg <= 303.75) {
    direction = "WNW";
  } else if (deg > 303.75 && deg <= 326.25) {
    direction = "NW";
  } else if (deg > 326.25 && deg <= 348.75) {
    direction = "NNW";
  }
  return direction;
}
