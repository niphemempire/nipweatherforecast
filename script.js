document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "054930a760a97944b6b4de89be3b1cc5";

  const inputField = document.getElementById("inputfield");
  const searchBtn = document.getElementById("searchBtn");
  const video = document.getElementById("myVideo"); // video element
  const displayForecast = document.getElementById("diplayforecast");

  inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const city = inputField.value.trim();
    if (!city) return;
    getWeather(city);
    daysForecast(city);
    localStorage.setItem("Location", city);
  }
});

searchBtn.addEventListener("click", () => {
  const city = inputField.value.trim();
  if (!city) return;
  getWeather(city);
  daysForecast(city);
  localStorage.setItem("Location", city);
});

  const getWeather = async () => {
    const city = inputField.value.trim();
    if (!city) return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
      );
      const data = await response.json();
      console.log(data);

      if (data.cod === "404") {
        displayForecast.innerHTML = `<p class="city">${data.message}</p>`;
        return;
      }

      // --- Change video based on weather ---
      const mainWeather = data.weather[0].description.toLowerCase();

if (mainWeather.includes("cloud")) {
  video.src = "./Video/snow.mp4";
} else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
  video.src = "./Video/raining.mp4";
} else if (mainWeather.includes("snow")) {
  video.src = "./Video/snow.mp4";
} else if (mainWeather.includes("clear")) {
  video.src = "./Video/sunny.mp4";
} else {
  video.src = "./Video/default.mp4";
}

video.load();
video.play();

      // --- Render weather data ---
      displayForecast.innerHTML = `
        <p class="location">Location: ${data.name}</p>
        <div class="twosided">
          <div class="weather-condition">
            <p class="condition-label">Temperature Condition:</p>
            <div class="weather-icon"><i class="fa-solid fa-cloud-moon-rain"></i></div>
            <p class="condition-value">${data.weather[0].description}</p>
          </div>
          <div class="weather-temperature">
            <div class="temperature-label">Temperature:</div>
            <div class="temperature-icon"><i class="fa-solid fa-temperature-three-quarters"></i></div>
            <p class="temperature-value">${data.main.temp}°C</p>
          </div>
        </div>
      `;
    } catch (error) {
      console.log(error);
      displayForecast.innerHTML = `<p class="city">Something went wrong. Try again.</p>`;
    }
  };

  

  const daysForecast = async (city) => {
  const daysDisplay = document.querySelector('.daysdisplay');

  try {
    const forecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const realForecast = await forecast.json();

    const dailyForecast = {};
    realForecast.list.forEach(item => {
      const date = new Date(item.dt_txt).toLocaleDateString("en-US");
      if (!dailyForecast[date]) {
        dailyForecast[date] = item; // pick first 3-hour block for that day
      }
    });

    daysDisplay.innerHTML = `
    <div class="divdaysdisplay">
            <div class="daysdisplays" id="daysdisplay">
                <div class="babro"><div class="forecast-title">5 Days Forecast</div><div class="forecast-container"></div></div>
            </div>
        </div>
    `;
    const container = daysDisplay.querySelector('.forecast-container');
Object.values(dailyForecast).slice(0, 5).forEach(day => {

  const date = new Date(day.dt_txt);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

  container.innerHTML += `
    <div class="day-card">
        <div class="day-header">
          <i class="fa-regular fa-cloud day-icon"></i>
          <span class="day-name">${weekday}</span>
        </div>

        <div class="day-body">
          <p class="day-temp">${day.main.temp}°C</p>
          <span class="day-weather">${day.weather[0].description}</span>
        </div>
    </div>
  `;
});

  } catch (error) {
    console.log('error', error);
    daysDisplay.innerHTML = `<p class="city">Could not load 5-day forecast</p>`;
  }
};
});


