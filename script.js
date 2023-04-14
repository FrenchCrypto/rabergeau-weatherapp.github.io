const apiKey = '0f0be55010d44bdb32f9fd7988a10acd';
const unsplashApiKey = 'RT-MYLEc0FSiTGEfhkGMFLCqUZABAqVBtnpq5Z6yjak';
const windyPointAPIKey = 'K3AbrGsRERvO3UYJLkLu9KiOjDXkBZRs';
const windyWebcamsAPIKey = 'ZqmEiw6UPCGt674GH7V1XwZ05Do7i0jU';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherResults = document.getElementById('weather-results');

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent form submission

  const city = cityInput.value.trim();

  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const { coord: { lat, lon }, main: { temp, humidity }, weather, wind: { speed } } = weatherData;
    const { description, icon } = weather[0];
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    weatherResults.innerHTML = `
      <img src="${iconUrl}" alt="${description}" class="weather-icon">
      <p>The current temperature in ${city} is ${temp} &#8451;</p>
      <p>Weather: ${description}</p>
      <p>Wind Speed: ${speed} m/s</p>
      <p>Humidity: ${humidity}%</p>
    `;

    await setCityImage(city);
    await fetchPointForecast(lat, lon);
    await fetchWebcams(lat, lon);
  } catch (error) {
    console.log(error);
    weatherResults.innerHTML = '<p>Failed to retrieve weather data. Please try again later.</p>';
  }
});

async function setCityImage(city) {
  try {
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}`;
    const unsplashResponse = await fetch(unsplashUrl);
    const unsplashData = await unsplashResponse.json();

    if (unsplashData.results && unsplashData.results.length > 0) {
      const imageUrl = unsplashData.results[0].urls.regular;
      const newImage = new Image();
      newImage.src = imageUrl;
      newImage.onload = () => {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.style.transition = 'background-image 1s ease-in-out';
      };
    } else {
      document.body.style.backgroundImage = '';
    }
  } catch (error) {
    console.log(error);
    document.body.style.backgroundImage = '';
  }
}

async function fetchPointForecast(lat, lon) {
  try {
    const windyPointUrl = `https://api.windy.com/point-forecast/v2?lat=${lat}&lon=${lon}&key=${windyPointAPIKey}`;
    const pointResponse = await fetch(windyPointUrl);
    const pointData = await pointResponse.json();

    // Display point forecast data as needed
    console.log(pointData);
  } catch (error) {
    console.log(error);
  }
}

async function fetchWebcams(lat, lon) {
  try {
  const webcamsUrl = `https://api.windy.com/api/webcams/v2/list/nearby=${lat},${lon},50/category=city?show=webcams:image,location,title,url&key=${windyWebcamsAPIKey}`;
  const webcamsResponse = await fetch(webcamsUrl);
  const webcamsData = await webcamsResponse.json();
  // Remove existing webcams container if present
const existingWebcamsContainer = document.getElementById('webcams-container');
if (existingWebcamsContainer) {
  existingWebcamsContainer.remove();
}

const webcamsContainer = document.createElement('div');
webcamsContainer.setAttribute('id', 'webcams-container');

const webcamsTitle = document.createElement('h2');
webcamsTitle.textContent = 'Webcams';
webcamsContainer.appendChild(webcamsTitle);

if (webcamsData.result && webcamsData.result.webcams.length > 0) {
  webcamsData.result.webcams.forEach(webcam => {
    const webcamDiv = document.createElement('div');
    webcamDiv.classList.add('webcam');

    const webcamImage = document.createElement('img');
    webcamImage.src = webcam.image.current.preview;
    webcamImage.alt = `${webcam.title} - ${webcam.location.city}`;
    webcamDiv.appendChild(webcamImage);

    const webcamLink = document.createElement('a');
    webcamLink.href = webcam.url.current.desktop;
    webcamLink.textContent = 'View live feed';
    webcamLink.target = '_blank';
    webcamLink.rel = 'noopener noreferrer';
    webcamDiv.appendChild(webcamLink);

    webcamsContainer.appendChild(webcamDiv);
  });
} else {
  const noWebcamsMessage = document.createElement('p');
  noWebcamsMessage.textContent = 'No webcams available for this city.';
  webcamsContainer.appendChild(noWebcamsMessage);
}

document.body.appendChild(webcamsContainer);
} catch (error) {
  console.log(error);
  }
  }

