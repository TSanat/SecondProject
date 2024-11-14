document.getElementById('cityInput').addEventListener('change', fetchWeatherData);

const apiKey = 'e6f5cb4bec1b2d6dff199fb7623c8776';
let isCelsius = true;

document.getElementById('cityInput').addEventListener('change', fetchWeatherData);

function getWeatherForCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data));

      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayForecast(data));
    }, () => {
      alert("Unable to access location");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function fetchWeatherData() {
  let weatherCont = document.querySelector('.weather-container');
  const city = document.getElementById('cityInput').value;
  weatherCont.style.display = 'flex';
  if (!city){
    return;
  }
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => displayCurrentWeather(data));

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => displayForecast(data));
}

function displayCurrentWeather(data) {
  if(data.cod == 404){
    alert("There is no such city\n");
  }
  else{
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' });

    document.getElementById('currentDate').textContent = formattedDate;
    document.getElementById('currentIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('currentDesc').textContent = data.weather[0].description;
    document.getElementById('currentHumidity').innerHTML = `
    <img src="../img/humidity-icon.svg" alt="Humidity Icon" class="weather-icon">
    ${data.main.humidity}%
  `;
    document.getElementById('currentWindSpeed').innerHTML = `
    <img src="../img/wind-icon.svg" alt="Wind Icon" class="weather-icon">
    ${Math.round(data.wind.speed * 3.6)} km/h
  `;
  }
}
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecastContainer');
  forecastContainer.innerHTML = '';

  for (let i = 1; i <= 4; i++) {
    const forecastData = data.list[i * 8];

    const date = new Date(forecastData.dt_txt);
    const day = date.toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' });

    const dayElement = document.createElement('div');
    dayElement.className = 'forecast-day';
    dayElement.innerHTML = `
            <div>${day}</div>
            <img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="Weather Icon">
            <div>${Math.round(forecastData.main.temp)}°C</div>
            <div class = "forecast-desc">${forecastData.weather[0].description}</div>
        `;
    forecastContainer.appendChild(dayElement);
  }
}

function toggleTemperatureUnit() {
  const city = document.getElementById('cityInput').value;
  if (!city) return;

  isCelsius = !isCelsius;
  const unit = isCelsius ? 'metric' : 'imperial';
  const unitSymbol = isCelsius ? '°C' : '°F';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
    });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${unit}`)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecastContainer');
      forecastContainer.innerHTML = '';

      for (let i = 1; i <= 4; i++) {
        const forecastData = data.list[i * 8];

        const date = new Date(forecastData.dt_txt);
        const day = date.toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short' });

        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <div>${day}</div>
            <img src="https://openweathermap.org/img/wn/${forecastData.weather[0].icon}@2x.png" alt="Weather Icon">
            <div>${Math.round(forecastData.main.temp)}°C</div>
            <div class = "forecast-desc">${forecastData.weather[0].description}</div>
        `;
        forecastContainer.appendChild(dayElement);
      }
    });
}
