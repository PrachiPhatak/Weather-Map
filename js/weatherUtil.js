"use strict";
let weatherObj;
let forecast;

function getWeather(lon, lat) {
    let data1;
    $.ajax({
        url: "https://cors-anywhere.hirshwebsite.website/http://api.openweathermap.org/data/2.5/forecast",
        type: "GET",
        data: {
            APPID: OPEN_WEATHER_TOKEN,
            lon: lon,
            lat: lat,
            units: "imperial"
        },
        success: function (data) {
            console.log(data)
            //showWeatherDOM(getWeatherObj(data));
            showWeatherDOM(getForecastObj(data));
        },
        error: function () {
            alert("Error while getting weather data.")
        }
    });
}

function getWeatherObj(data) {
    weatherObj = {};
    // weatherObj.cityName = data.name;
    weatherObj.location = locationName(data.name, data.sys.country, data.coord.lon, data.coord.lat)
    weatherObj.currentTemp = (data.main.temp).toFixed(0);
    weatherObj.description = capitalized(data.weather[0].description);
    weatherObj.minTemp = (data.main.temp_min).toFixed(0);
    weatherObj.maxTemp = (data.main.temp_max).toFixed(0);
    weatherObj.windSpeed = data.wind.speed;
    weatherObj.timezone = data.timezone;
    //weatherObj.country = data.sys.country;
    weatherObj.sunrise = convertUTCDateToLocalDate(data.sys.sunrise);
    weatherObj.sunset = convertUTCDateToLocalDate(data.sys.sunset);
    weatherObj.windSpeed = (data.wind.speed).toFixed(0) + "mph";
    return weatherObj;
}

function getForecastObj(data) {
    forecast = {};
    forecast.location =
        locationName(data.city.name, data.city.country, data.city.coord.lon, data.city.coord.lat)
    forecast.currentTemp = (data.list[0].main.temp).toFixed(0);
    forecast.description = capitalized(data.list[0].weather[0].description);
    forecast.maxTemp = (data.list[0].main.temp_max).toFixed(0);
    forecast.minTemp = (data.list[0].main.temp_min).toFixed(0);
    forecast.windSpeed = (data.list[0].wind.speed).toFixed(0) + "mph";
    forecast.rain = ((data.list[0].pop) * 100).toFixed(0) + "%";
    forecast.sunrise = convertUTCDateToLocalDate(data.city.sunrise);
    forecast.sunset = convertUTCDateToLocalDate(data.city.sunset);
    forecast.hourly = getHourlyData(data);
    forecast.icon = data.list[0].weather[0].icon;
    forecast.isDay = isDay(data.list[0].weather[0].icon)
    return forecast;
}

function convertUTCDateToLocalDate(date) {
    let dt = new Date(date * 1000);
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    // let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes// + ' ' + ampm;
    return strTime;
}

function isDay(iconName) {
    console.log("isDay "+iconName)
    console.log("isDay "+iconName[iconName.length - 1])
    console.log((iconName[iconName.length - 1] === "d"));
    return (iconName[iconName.length - 1] === "d")
}

function locationName(city, country, lon, lat) {
    let location;
    location = (city ? city : lon)
        + ", "
        + (country ? country : lat);
    return location;
}

function capitalized(str) {
    let transformedString = ''
    let arr = str.split(" ");

    for (let i = 0; i < arr.length; i++) {
        if (transformedString !== "") {
            transformedString = transformedString + " ";
        }
        transformedString = transformedString + arr[i][0].toUpperCase() + arr[i].slice(1);
    }
    return transformedString;
}

function getHourlyData(dataList) {
    let hourlyData = [];
    for (let i = 0; i < dataList.list.length; i++) {
        let forecast = {};
        forecast.temp = (dataList.list[i].main.temp).toFixed(0),
            forecast.time = getHours(dataList.list[i].dt_txt);
        forecast.icon = (dataList.list[i].weather[0].icon)
        hourlyData[i] = forecast;
    }
    return hourlyData;
}

function getHours(dt) {
    let d = new Date(dt);
    let hours = d.getHours();
    let ampm;
    if (hours === 12) {
        ampm = 'pm'
    } else if (hours > 12) {
        ampm = 'pm'
    } else {
        ampm = "am"
    }
    hours = hours % 12;
    hours = hours ? hours : 12;
    let strTime = hours + ampm;
    return strTime;

}