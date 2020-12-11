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

fetch("https://api.airvisual.com/v2/nearest_city?key=e398d09b-6ba4-4b55-94d6-e8b73574352b")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const aqiData = data.data;
        
        const city = aqiData.city;
        const country = aqiData.country;
        const aqi = aqiData.current.pollution.aqius;

        // aqi info  
        const aqiInfo = document.querySelector('#aqi-info');

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

        let infoOn = false;

        const main = document.querySelector('.filter-noise');

        main.addEventListener('click', e => {
            if (infoOn) {
                infoOn = false;
                aqiInfo.classList.add('fade-in');
            } else {
                infoOn = true;
                aqiInfo.classList.remove('fade-in');
            }
        });


        if (aqi > 50 && aqi <= 100) {
            
            filterNoise.classList.add('filter-moderate--noise');
            filterColor.classList.add('filter-moderate--color')
        } else if (aqi > 100 && aqi <= 150) {
            filterNoise.classList.add('filter-sensitive--noise');
            filterColor.classList.add('filter-sensitive--color')
        } else if (aqi > 150 && aqi <= 200) {
            filterNoise.classList.add('filter-unhealthy--noise');
            filterColor.classList.add('filter-unhealthy--color')
        } else if (aqi > 200) {
            filterNoise.classList.add('filter-veryunhealthy--noise');
            filterColor.classList.add('filter-veryunhealthy--color')
        }
    })
    .catch(function (error) {
        console.log("error:", error)
    })

const button = document.querySelector('.btn');
button.addEventListener('click', () =>

    fetch("https://api.airvisual.com/v2/countries?&key=e398d09b-6ba4-4b55-94d6-e8b73574352b")
        .then(response => response.json())
        .then(data => {
            let countryLength = data.data.length;
            let country = data.data;
            let randomCountryIdx = Math.floor(Math.random() * countryLength);
            let randomCountry = country[randomCountryIdx].country;

            fetch(`https://api.airvisual.com/v2/states?country=${randomCountry}&key=e398d09b-6ba4-4b55-94d6-e8b73574352b`)
                .then(response => response.json())
                .then(data => {
                    let stateLength = data.data.length; 
                    let state = data.data;
                    let randomStateIdx = Math.floor(Math.random() * stateLength);
                    let randomState = state[randomStateIdx].state;

                    fetch(`https://api.airvisual.com/v2/cities?state=${randomState}&country=${randomCountry}&key=e398d09b-6ba4-4b55-94d6-e8b73574352b`)
                        .then(response => response.json())
                        .then(data => {

                            let cityLength = data.data.length;
                            let city = data.data;
                            let randomCityIdx = Math.floor(Math.random() * cityLength);
                            let randomCity = city[randomCityIdx].city;

                            fetch(`https://api.airvisual.com/v2/city?city=${randomCity}&state=${randomState}&country=${randomCountry}&key=e398d09b-6ba4-4b55-94d6-e8b73574352b`)
                                .then(response => response.json())
                                .then(data => {
                                    let aqiData = data.data;
                                    let aqi = aqiData.current.pollution.aqius;
                                    let city = aqiData.city;
                                    let country = aqiData.country;

                                    indexInfo.innerHTML = aqi;
                                    cityInfo.innerHTML = city;
                                    countryInfo.innerHTML = country;

                                    if (aqi > 50 && aqi <= 100) {
                                        filterNoise.className = 'filter-noise filter-moderate--noise';
                                        filterColor.className = 'filter-color filter-moderate--color';
                                    } else if (aqi > 100 && aqi <= 150) {
                                        filterNoise.className = 'filter-noise filter-sensitive--noise';
                                        filterColor.className = 'filter-color filter-sensitive--color';
                                    } else if (aqi > 150 && aqi <= 200) {
                                        filterNoise.className = 'filter-noise filter-unhealthy--noise';
                                        filterColor.className = 'filter-color filter-unhealthy--color';
                                    } else if (aqi > 200) {
                                        filterNoise.className = 'filter-noise filter-veryunhealthy--noise';
                                        filterColor.className = 'filter-color filter-veryunhealthy--color';
                                    }
                                })
                                .catch(function (error) {
                                    console.log("error:", error)
                                })
                        }) 
                        .catch(function (error) {
                            console.log("error:", error)
                        })
                })
                .catch(function (error) {
                    console.log("error:", error)
                })
        })
        .catch(function (error) {
            console.log("error:", error)
        })
);