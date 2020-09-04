let appId = '1a8fc8b1dcde006cb14c64ff8ea3b6b4';
let units = 'metric';
let searchMethod;
const sunny = 'url("img/sunnyday1.jpg")';
const rain = 'url("img/deszcz.jpg")';
const clouds = 'url("img/cloudy.jpg")';
const snow = 'url("img/wintry-69661_1920.jpg")';
const storm = 'url("img/ligtning-3379045_1920.jpg")';
let longtitude = 0;
let latitude = 0;
let language = 'en';

function getSearchMethod(searchTerm) {
    if (searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q';
}

function searchWeatherByCityName(searchTerm) {
    getSearchMethod(searchTerm);
    fetch(`http://api.openweathermap.org/data/2.5/forecast?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`).then(result => {
        return result.json();
    }).then(result => {
        init(result);
    })
}

function searchWeatherByCoords() {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longtitude}&APPID=${appId}&units=${units}`).then(result => {
        return result.json();
    }).then(result => {
        init(result);
    })
}

function init(resultFromServer) {
    if(typeof resultFromServer.list === 'undefined') {
        alert('Proszę wpisać poprawnie lokalizację');
        return;
    }
    switch (resultFromServer.list[0].weather[0].main) {
        case 'Clear':
            setBackgroundOnElements(sunny);
            break;
        case 'Clouds':
            setBackgroundOnElements(clouds);
            break;
        case 'Mist':
        case 'Drizzle':
        case 'Rain':
            setBackgroundOnElements(rain);
            break;
        case 'Storm':
            setBackgroundOnElements(storm);
            break;
        case 'Snow':
            setBackgroundOnElements(snow);
        default:
            break;
    }
    initUserWeatherView(resultFromServer);
}

function initUserWeatherView(resultFromServer) {
    console.log(resultFromServer)
    let temperature = document.getElementById('feels-temperature');
    let cityHeader = document.getElementById('city-header');
    let country = document.getElementById('country');
    let weatherIcons = document.getElementById('weather-icons');
    let date = document.getElementById('date');
    let hour = document.getElementById('date');
    longtitude = resultFromServer.city.coord.lon;
    latitude = resultFromServer.city.coord.lat;
    let farancheit = document.getElementById('farancheit');
    let celcius = document.getElementById('celcius');
    let changeLanguage = document.getElementById('select');
    let refresh = document.getElementById('refresh');

    changeLanguage.onchange = () => onSelectChange(changeLanguage, resultFromServer);

    weatherIcons.src = 'http://openweathermap.org/img/wn/' + resultFromServer.list[0].weather[0].icon + '.png';
    temperature.innerHTML = Math.floor(resultFromServer.list[0].main.temp) + '&#176' + 'C';
    cityHeader.innerHTML = resultFromServer.city.name + ', ';
    country.innerHTML = resultFromServer.city.country;

    initLanguageElements(resultFromServer);

    farancheit.addEventListener("click", changeTemperatureF);
    function changeTemperatureF() {
        temperature.innerHTML = Math.floor(resultFromServer.list[0].main.temp) + 32 + '&#176' + 'F';
    }

    celcius.addEventListener('click', changeTemperatureC);
    function changeTemperatureC() {
        temperature.innerHTML = Math.floor(resultFromServer.list[0].main.temp) + '&#176' + 'C';
    }

    refresh.addEventListener('click', reloadThePage);
    function reloadThePage() {
        location.reload();
    }

    date.innerHTML = new Date().toLocaleDateString();
    hour.innerHTML = new Date().toLocaleString();
    initMap();

    let firstDayForecast = getWeatherInfoObject(resultFromServer.list[8])
    let secondDayForecast = getWeatherInfoObject(resultFromServer.list[16])
    let thirdDayForecast = getWeatherInfoObject(resultFromServer.list[24])

    setFutureWeatherInfo(firstDayForecast, document.getElementById("day1"))
    setFutureWeatherInfo(secondDayForecast, document.getElementById("day2"))
    setFutureWeatherInfo(thirdDayForecast, document.getElementById("day3"))
}

function getWindSpeed(resultFromServer) {
    return Math.floor(resultFromServer.list[0].wind.speed);
}

function getHumidity(resultFromServer) {
    return resultFromServer.list[0].main.humidity;
}

function getPressure(resultFromServer) {
    return resultFromServer.list[0].main.pressure;
}

function setFutureWeatherInfo(weatherObject, htmlElement) {
    let internalDiv = document.createElement('div');
    htmlElement.innerHTML = '';
    internalDiv.appendChild(createParagraphWithText(weatherObject.date));
    internalDiv.appendChild(createImgWithSrc(weatherObject.icon));
    internalDiv.appendChild(createParagraphWithText(weatherObject.temp));
    htmlElement.appendChild(internalDiv);
}

function getWeatherInfoObject(weatherInfo) {
    return {
        temp: Math.floor(weatherInfo.main.temp) + '°' + 'C',
        icon: weatherInfo.weather[0].icon,
        date: weatherInfo.dt_txt.slice(0, -9).split("-").reverse().join("/")
    }
}

function createParagraphWithText(text) {
    let p = document.createElement('p');
    p.innerText = text;
    return p;
}

function createImgWithSrc(icon) {
    let img = document.createElement('img');
    img.src = 'http://openweathermap.org/img/wn/' + icon + '.png';
    return img;
}

function initMap() {
    var dumbo = { lat: latitude, lng: longtitude };
    var mapOptions = {
        center: dumbo,
        zoom: 12
    };
    var googlemap = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function getWindText(resultFromServer) {
    if (language === 'en') {
        return 'Wind: ' + getWindSpeed(resultFromServer) + 'm/s';
    }
    return 'Wiatr: ' + getWindSpeed(resultFromServer) + 'm/s';
}

function getHumidityText(resultFromServer) {
    if (language === 'en') {
        return 'Humidity: ' + getHumidity(resultFromServer) + 'm/s';
    }
    return 'Wilgotność: ' + getHumidity(resultFromServer) + 'm/s';
}

function initLanguageElements(resultFromServer) {
    setTranslations(resultFromServer);
}

function onSelectChange(changeLanguage, resultFromServer) {
    language = changeLanguage.value;
    setTranslations(resultFromServer);
}

function setTranslations(resultFromServer) {
    if (language === 'en') {
        changeLanguageToEnglish(resultFromServer);
    }
    else {
        changeLanguageToPolish(resultFromServer);
    }
}

function changeLanguageToEnglish(resultFromServer) {
    document.getElementById('humidity').innerHTML = 'Humidity: ' + getHumidity(resultFromServer) + ' m/s';
    document.getElementById('wind').innerHTML = 'Wind: ' + getWindSpeed(resultFromServer) + ' m/s';
    document.getElementById('long').innerHTML = 'Longtitude: ' + longtitude;
    document.getElementById('lat').innerHTML = 'Latitude: ' + latitude;
    document.getElementById('pressure').innerHTML = 'Pressure: ' + getPressure(resultFromServer) + ' hPa';
}

function changeLanguageToPolish(resultFromServer) {
    document.getElementById('humidity').innerHTML = 'Wilgotność: ' + getHumidity(resultFromServer) + ' m/s';
    document.getElementById('wind').innerHTML = 'Wiatr: ' + getWindSpeed(resultFromServer) + ' m/s';
    document.getElementById('long').innerHTML = 'Długość: ' + longtitude;
    document.getElementById('lat').innerHTML = 'Szerokość: ' + latitude;
    document.getElementById('pressure').innerHTML = 'Ciśnienie: ' + getPressure(resultFromServer) + ' hPa';
}

document.getElementById('searchBtn').addEventListener('click', () => {
    let searchTerm = document.getElementById('searchInput').value;
    if (searchTerm) {
        searchWeatherByCityName(searchTerm);
    }

})
function setBackgroundOnElements(imageUrl) {
    let elementsList = document.getElementsByClassName('main-container');
    for (let element of elementsList) {
        element.style.backgroundImage = imageUrl;
    }
}

function success(pos) {
    var coordinates = pos.coords;

    longtitude = coordinates.longitude;
    latitude = coordinates.latitude;

    initMap()
    searchWeatherByCoords();
}

navigator.geolocation.getCurrentPosition(success);




