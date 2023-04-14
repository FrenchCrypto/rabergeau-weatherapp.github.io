const apiKey = '0f0be55010d44bdb32f9fd7988a10acd';
const unsplashApiKey = 'RT-MYLEc0FSiTGEfhkGMFLCqUZABAqVBtnpq5Z6yjak';
const windyPointAPIKey = 'K3AbrGsRERvO3UYJLkLu9KiOjDXkBZRs';
const windyWebcamsAPIKey = 'ZqmEiw6UPCGt674GH7V1XwZ05Do7i0jU';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherResults = document.getElementById('weather-results');

async function fetchJson(url) {
  const response = await fetch(url);
  return await response.json();
}

function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent form submission

  const city = cityInput.value.trim();

  if (!city) {
    alert('Please enter a city name.');
    return;
  }

  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherData = await fetchJson(weatherUrl);

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
    const unsplashData = await fetchJson(unsplashUrl);

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
  const pointData = await fetchJson(windyPointUrl);
  // Display point forecast data as needed
console.log(pointData);
} catch (error) {
  console.log(error);
  }
  }
  
  async function fetchWebcams(lat, lon) {
  try {
  const webcamsUrl = `https://api.windy.com/api/webcams/v2/list/nearby=${lat},${lon},50/category=city?show=webcams:image,location,title,url&key=${windyWebcamsAPIKey}`;
  const webcamsData = await fetchJson(webcamsUrl);
  // Remove existing webcams container if present
const existingWebcamsContainer = document.getElementById('webcams-container');
if (existingWebcamsContainer) {
  existingWebcamsContainer.remove();
}

const webcamsContainer = createElement('div', { id: 'webcams-container' }, [
  createElement('h2', {}, ['Webcams'])
]);

if (webcamsData.result && webcamsData.result.webcams.length > 0) {
  webcamsData.result.webcams.forEach(webcam => {
    const webcamDiv = createElement('div', { class: 'webcam' }, [
      createElement('img', { src: webcam.image.current.preview, alt: `${webcam.title} - ${webcam.location.city}` }),
      createElement('a', { href: webcam.url.current.desktop, target: '_blank', rel: 'noopener noreferrer' }, ['View live feed'])
    ]);

    webcamsContainer.appendChild(webcamDiv);
  });
} else {
  webcamsContainer.appendChild(createElement('p', {}, ['No webcams available for this city.']));
}

document.body.appendChild(webcamsContainer);
} catch (error) {
  console.log(error);
  }
  }
