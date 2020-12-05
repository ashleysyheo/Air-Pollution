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

fetch("http://api.airvisual.com/v2/nearest_city?key=e398d09b-6ba4-4b55-94d6-e8b73574352b")
    .then(response => response.json())
    .then(data => {
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
        const indexInfo = document.createElement('h2');
        indexInfo.innerHTML = aqi;
        indexInfo.className = 'aqi';
        const unit = document.createElement('span');
        unit.className = 'aqi-unit';
        unit.innerHTML = ' &#x3bc;g/m<sup>3</sup>';
        indexInfo.appendChild(unit);
        aqiInfo.appendChild(indexInfo);

        // city info 
        const cityInfo = document.createElement('h5');
        cityInfo.innerHTML = city;
        cityInfo.className = 'city';
        aqiInfo.appendChild(cityInfo);

        // country info 
        const countryInfo = document.createElement('h5');
        countryInfo.innerHTML = country;
        countryInfo.className = 'country';
        aqiInfo.appendChild(countryInfo);
 
        setTimeout(() => {
            aqiInfo.classList.add('fade-in');
        }, 3000)

        let infoOn = false;

        aqiInfo.addEventListener('click', e => {
            if (infoOn) {
                infoOn = false;
                aqiInfo.classList.add('fade-in');
            } else {
                infoOn = true;
                aqiInfo.classList.remove('fade-in');
            }
        });

        const filterNoise = document.querySelector('.filter-noise');
        const filterColor = document.querySelector('.filter-color');

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