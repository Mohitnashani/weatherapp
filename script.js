const API_KEY = "b6cd68134a1443ad814174448251611";
const API_URL = "https://api.weatherapi.com/v1/current.json";

const input = document.getElementById("search-input");
const btn = document.getElementById("search-btn");
const placesContainer = document.getElementById("places-container");

// Fetch weather for a city
async function getWeather(city) {
  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=yes`);
    
    if (!res.ok) {
      throw new Error(`City not found: ${city}`);
    }

    const data = await res.json();
    updateUI(data);
    console.log("Weather data:", data);
    return data;
  } catch (err) {
    showError(`Error fetching weather for ${city}: ${err.message}`);
    console.error(err);
  }
}

// Update main weather display
function updateUI(data) {
  const current = data.current;
  const location = data.location;

  // Update header with location
  document.title = `Weather - ${location.name}`;

  // Update temperature
  document.getElementById("temp-curr").textContent = `${current.temp_c}°C`;
  document.getElementById("temp-max").textContent = `Max: ${"--"}°C`;
  document.getElementById("temp-min").textContent = `Min: ${"--"}°C`;

  // Update wind
  document.getElementById("wind").textContent = `Speed: ${current.wind_kph} km/h`;
  document.getElementById("wind-dir").textContent = `Direction: ${current.wind_degree}°`;
  document.getElementById("wind-feels").textContent = `Feels like: ${current.feelslike_c}°C`;

  // Update humidity
  document.getElementById("humidity").textContent = `Humidity: ${current.humidity}%`;

  // Sunrise and sunset (if available)
  if (data.forecast?.forecastday[0]?.astro) {
    const astro = data.forecast.forecastday[0].astro;
    document.getElementById("sunrise-time").textContent = `Sunrise: ${astro.sunrise}`;
    document.getElementById("sunset-time").textContent = `Sunset: ${astro.sunset}`;
  }

  // Clear input
  input.value = "";
}

// Show error message
function showError(message) {
  alert(message);
}

// Load weather for a specific place card
async function loadCityWeather(cityName) {
  await getWeather(cityName);
}

// Initialize place cards with click handlers
function initializePlaceCards() {
  const placeCards = document.querySelectorAll(".place-card");
  placeCards.forEach((card) => {
    card.addEventListener("click", async () => {
      const cityName = card.getAttribute("data-city");
      await loadCityWeather(cityName);
    });
  });
}

// Load popular cities data
async function loadPopularCities() {
  const cities = ["Mumbai", "Delhi", "London", "Tokyo", "New York"];
  for (const city of cities) {
    try {
      const res = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&aqi=no`);
      if (res.ok) {
        const data = await res.json();
        const card = document.querySelector(`[data-city="${city}"]`);
        if (card) {
          const tempEl = card.querySelector(".city-temp");
          const humidityEl = card.querySelector(".city-humidity");
          const windEl = card.querySelector(".city-wind");

          tempEl.textContent = `${data.current.temp_c}°C`;
          humidityEl.textContent = `${data.current.humidity}% humidity`;
          windEl.textContent = `${data.current.wind_kph} km/h wind`;
        }
      }
    } catch (err) {
      console.error(`Failed to load ${city}:`, err);
    }
  }
}

// Event listeners
btn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city === "") {
    showError("Please enter a city name");
    return;
  }
  getWeather(city);
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  initializePlaceCards();
  loadPopularCities();
  // Load default city
  getWeather("Paris");

});
