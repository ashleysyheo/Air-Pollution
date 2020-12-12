if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    var constraints = {
        audio: false,
        video: {
            facingMode: 'environment'
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            var video = document.querySelector('video');
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        })
        .catch(function (err) {
            console.log(err);
        });
} else {
    console.log("navigator.mediaDevices not supported")
}

let indexInfo;
let cityInfo;
let countryInfo;

let filterNoise = document.querySelector('.filter-noise');
let filterColor = document.querySelector('.filter-color');
let aqiInfo = document.querySelector('#aqi-info');

let infoOn = false;
const main = document.querySelector('.filter-noise');

window.addEventListener('click', e => {
    if (infoOn) {
        infoOn = false;
        aqiInfo.classList.add('fade-in');
    } else {
        infoOn = true;
        aqiInfo.classList.remove('fade-in');
    }
});

fetch('https://api.airvisual.com/v2/nearest_city?key=6f2530f7-f187-4341-b0a1-75e7744681d1')
    .then(response => response.json())
    .then(data => {
        const aqiData = data.data;
        const city = aqiData.city;
        const country = aqiData.country;
        const aqi = aqiData.current.pollution.aqius;

        // particle: PM 10 
        const particleInfo = document.createElement('p');
        particleInfo.innerHTML = 'PM10';
        particleInfo.className = 'particle';
        aqiInfo.appendChild(particleInfo);

        // air quality index
        indexInfo = document.createElement('h2');
        indexInfo.innerHTML = aqi;
        indexInfo.className = 'aqi';
        const unit = document.createElement('span');
        unit.className = 'aqi-unit';
        unit.innerHTML = ' &#x3bc;g/m<sup>3</sup>';
        indexInfo.appendChild(unit);
        aqiInfo.appendChild(indexInfo);

        // city info 
        cityInfo = document.createElement('h5');
        cityInfo.innerHTML = city;
        cityInfo.className = 'city';
        aqiInfo.appendChild(cityInfo);

        // country info 
        countryInfo = document.createElement('h5');
        countryInfo.innerHTML = country;
        countryInfo.className = 'country';
        aqiInfo.appendChild(countryInfo);
 
        setTimeout(() => {
            aqiInfo.classList.add('fade-in');
        }, 4000)

        if (aqi > 50 && aqi <= 100) {
            aqiInfo.classList.add('moderate');
            filterNoise.classList.add('filter-moderate--noise');
            filterColor.classList.add('filter-moderate--color')
        } else if (aqi > 100 && aqi <= 150) {
            aqiInfo.classList.add('sensitive');
            filterNoise.classList.add('filter-sensitive--noise');
            filterColor.classList.add('filter-sensitive--color')
        } else if (aqi > 150 && aqi <= 200) {
            aqiInfo.classList.add('unhealthy');
            filterNoise.classList.add('filter-unhealthy--noise');
            filterColor.classList.add('filter-unhealthy--color')
        } else if (aqi > 200) {
            aqiInfo.classList.add('very-unhealthy');
            filterNoise.classList.add('filter-veryunhealthy--noise');
            filterColor.classList.add('filter-veryunhealthy--color')
        } else {
            aqiInfo.classList.add('good');
        }
    })
    .catch(function (error) {
        console.log("error:", error)
    })

const button = document.querySelector('.btn');
button.addEventListener('click', () => {
    fetch('./city.json')
        .then(response => response.json())
        .then(data => {
            let citiesLength = data.cities.length;
            let randomCityIdx = Math.floor(Math.random() * citiesLength);

            let city = data.cities[randomCityIdx].city;
            let state = data.cities[randomCityIdx].state;
            let country = data.cities[randomCityIdx].country;
            
            fetch(`https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=6f2530f7-f187-4341-b0a1-75e7744681d1`)
                .then(response => response.json())
                .then(data => {
                    let aqiData = data.data;
                    let aqi = aqiData.current.pollution.aqius;
                    let city = aqiData.city;
                    let country = aqiData.country;

                    if (aqi > 50 && aqi <= 100) {
                        aqiInfo.className = 'moderate';
                        filterNoise.className = 'filter-noise filter-moderate--noise';
                        filterColor.className = 'filter-color filter-moderate--color';
                    } else if (aqi > 100 && aqi <= 150) {
                        aqiInfo.className = 'sensitive';
                        filterNoise.className = 'filter-noise filter-sensitive--noise';
                        filterColor.className = 'filter-color filter-sensitive--color';
                    } else if (aqi > 150 && aqi <= 200) {
                        aqiInfo.className = 'unhealthy';
                        filterNoise.className = 'filter-noise filter-unhealthy--noise';
                        filterColor.className = 'filter-color filter-unhealthy--color';
                    } else if (aqi > 200) {
                        aqiInfo.className = 'very-unhealthy';
                        filterNoise.className = 'filter-noise filter-veryunhealthy--noise';
                        filterColor.className = 'filter-color filter-veryunhealthy--color';
                    } else {
                        aqiInfo.className = 'good';
                        filterNoise.className = 'filter-noise';
                        filterColor.className = 'filter-color';
                    }

                    indexInfo.innerHTML = aqi;
                    cityInfo.innerHTML = city;
                    countryInfo.innerHTML = country;

                    aqiInfo.classList.remove("fade-in");
                    setTimeout(() => {
                        aqiInfo.classList.add('fade-in');
                    }, 4000)
                })
                .catch(function (error) {
                    console.log("error:", error)
                })
        })
        .catch(function (error) {
            console.log("error:", error)
        })
});