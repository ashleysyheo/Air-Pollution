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
 
        console.log(city, country, aqi);

        const main = document.querySelector('.main');

        setTimeout(() => {
            aqiInfo.classList.add('fade-in');
        }, 3000)

        let infoOn = false;

        aqiInfo.addEventListener('click', e => {
            if (infoOn) {
                console.log('no info!')
                infoOn = false;
                aqiInfo.classList.add('fade-in');
            } else {
                console.log('info!')
                infoOn = true;
                aqiInfo.classList.remove('fade-in');
            }
        })
    })
    .catch(function (error) {
        console.log("error:", error)
    })