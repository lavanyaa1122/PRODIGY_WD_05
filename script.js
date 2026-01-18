const API_KEY = "f9507dce4a9ebc1a4f31a512f29c5366"; // Your API key

const locationBtn = document.getElementById("locationBtn");
const searchBtn = document.getElementById("searchBtn");

locationBtn.addEventListener("click", getLocationWeather);
searchBtn.addEventListener("click", getCityWeather);

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather");

  // Get weather icon
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherDiv.innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <img src="${iconUrl}" alt="${data.weather[0].description}">
    <div class="temp">${Math.round(data.main.temp)}°C</div>
    <div class="weather-description">${data.weather[0].description}</div>
    <div class="weather-details">
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind: ${data.wind.speed} m/s</p>
    </div>
  `;

  changeBackground(data.weather[0].main);
}

function showError(message) {
  document.getElementById("error").textContent = message;
}

// Change background based on weather
function changeBackground(weather) {
  const body = document.body;
  switch(weather.toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(to top, #fddb92, #d1fdff)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(to top, #d7d2cc, #304352)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(to top, #4e54c8, #8f94fb)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(to top, #0f0c29, #302b63, #24243e)";
      break;
    case "snow":
      body.style.background = "linear-gradient(to top, #e0eafc, #cfdef3)";
      break;
    case "mist":
    case "fog":
      body.style.background = "linear-gradient(to top, #757f9a, #d7dde8)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #74ebd5, #9face6)";
  }
}

async function fetchWeather(url) {
  try {
    document.getElementById("error").textContent = "";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

function getCityWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return showError("Please enter a city name");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  fetchWeather(url);
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    showError("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
      fetchWeather(url);
    },
    () => showError("Location access denied")
  );
}

