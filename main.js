require('dotenv').config();
const apiKey=process.env.API_KEY;
const app = document.querySelector('.weather-app');
const video = document.querySelector('.background-video source');
const videoElement = document.querySelector('.background-video');
const temp = document.querySelector('.temp');   
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

let cityInput = "Mangalore";


videoElement.addEventListener('error', function() {
    console.log('Error: Failed to load video file.');
});

cities.forEach((city)=> {
    city.addEventListener('click',(e)=> {
        
        cityInput = e.target.innerHTML;

        fetchWeatherData();

        app.style.opacity ="0";
    });
})

form.addEventListener('submit',(e) => {
    if(search.value.length == 0) {
        alert('Please type in a city name');
    }else{
        cityInput = search.value;

        fetchWeatherData();

        search.value = "";

        app.style.opacity = "0";
    }

    e.preventDefault();
});


function dayOfTheWeek(day,month,year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return weekday[new Date(`${year}/${month}/${day}`).getDay()];
};
function fetchWeatherData() {
    return new Promise((resolve, reject) => {
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}&aqi=yes`)
        .then(response => response.json())
        .then(data => {
        console.log(data);

        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;


        const date = data.location.localtime;
        const y = parseInt(date.substr(0,4));
        const d = parseInt(date.substr(8,2));
        const m = parseInt(date.substr(5,2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;

        nameOutput.innerHTML = data.location.name;

        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);

        icon.src = "./videos/weather/icons/" + iconId;

        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        let timeOfDay = data.current.is_day ? "day" : "night";
        const code = data.current.condition.code;
        let videoSrc = "";
        console.log('Condition code:', code); // log the condition code
        if (code === 1000) { // Clear
            videoSrc = `./videos/${timeOfDay}/sunny.mp4`;
            btn.style.background = timeOfDay === "day" ? "#e5ba92" : "#181e27";
        } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) { // Cloudy
            videoSrc = `./videos/${timeOfDay}/cloudy.mp4`;
            btn.style.background = timeOfDay === "day" ? "#487f5b" : "#181e27";
        } else if ([1063, 1069, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) { // Rain
            videoSrc = `./videos/${timeOfDay}/rain.mp4`;
            btn.style.background = timeOfDay === "day" ? "#647d75" : "#325c80";
        } else { // Snow or other
            videoSrc = `./videos/${timeOfDay}/snow.mp4`;
            btn.style.background = timeOfDay === "day" ? "#4d72aa" : "#1b1b1b";
        }
        console.log('Video source:', videoSrc); // log the video source


        // Add a timestamp to the video source URL
        videoSrc += '?t=' + new Date().getTime();

        resolve(videoSrc);


        // Create a new source element
        const newSource = document.createElement('source');
        newSource.src = videoSrc;
        newSource.type = 'video/mp4';


         // Replace the old source element with the new one
         const oldSource = document.querySelector('.background-video source');

        // Load the new video
        const videoElement = document.querySelector('.background-video');
        videoElement.replaceChild(newSource, oldSource);
        videoElement.load();
    })
    .catch(() => {
        alert('City not found, Please try again');
        resolve('./videos/day/dewdrops.mp4'); // set a default video source
    })
    .finally(() => {
        app.style.opacity = "1"; // Move this line here
    });
});
}
fetchWeatherData().then(videoSrc => {
    const videoElement = document.querySelector('.background-video');
    const sourceElement = document.querySelector('.background-video source');
    sourceElement.src = videoSrc;
    videoElement.load(); // Manually load the video
    app.style.opacity = "1";
});
