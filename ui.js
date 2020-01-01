class Ui {
    constructor (filter){
        this.output = document.getElementById('output');
        this.cityWeather;
        this.cities = document.getElementById('search-results');
        this.unavailable = document.getElementById('data-unavilable');
        this.loading = document.getElementById('loading');
        this.weekBtn = document.getElementById('week-view');
        this.dayBtn = document.getElementById('today-view');
        this.filter = filter;
    }
    setWeather(weather){
        this.cityWeather = weather;
    }

    paintDay(){
        const today = this.cityWeather.consolidated_weather[0]; 
        this.output.innerHTML = '';
        this.output.className = 'bg-info text-info text-center';
        let temp = today.the_temp === null?  (today.max_temp + today.min_temp)/2 : today.the_temp;
        this.output.innerHTML += `
        <div class="col-md-10 bg-info">
            <h1>${this.cityWeather.title}</h1> 
            <h4 id="w-desc">${today.weather_state_name}</h3>
            <h3 id="w-string">${Math.round(temp)}&#8451;</h3>
            <img id="w-icon" src= "https://www.metaweather.com/static/img/weather/png/64/${today.weather_state_abbr}.png">
            <ul class="list-group" id="w-details">
                <li class="list-group-item" id="w-humidity">Humidity: ${today.humidity}%</li>
                <li class="list-group-item" id="w-high-of">High of: ${Math.round(today.max_temp)}&#8451;</li>
                <li class="list-group-item" id="w-low-of">Low of: ${Math.round(today.min_temp)}&#8451;</li>
                <li class="list-group-item" id="w-wind">Wind: From the ${today.wind_direction_compass} at ${Math.round(today.wind_speed)} mph</li>
            </ul>   
        </div>`
    }

    paintWeek(){
        this.output.className = 'bg-info text-info text-center col-md-10';
        this.output.innerHTML = `<h1 id="w-location">${this.cityWeather.title}</h1> `
        this.cityWeather.consolidated_weather.forEach(day => {
            const date = new Date(day.applicable_date);
            let temp = day.the_temp === null?  (day.max_temp + day.min_temp)/2 : day.the_temp;
            this.output.innerHTML += `
            <div class="col-md-2">
            <h1 id="w-day">${this.filter.getDay(date)}</h1> 
            <h4 id="w-desc">${day.weather_state_name}</h3>
            <h3 id="w-string">${Math.round(temp)}&#8451;</h3>
            <img id="w-icon" src= "https://www.metaweather.com/static/img/weather/png/64/${day.weather_state_abbr}.png">
            <ul class="list-group" id="w-details">
                <li class="list-group-item" id="w-humidity">Humidity: ${day.humidity}%</li>
                <li class="list-group-item" id="w-high-of">High of: ${Math.round(day.max_temp)}&#8451;</li>
                <li class="list-group-item" id="w-low-of">Low of: ${Math.round(day.min_temp)}&#8451;</li>
                <li class="list-group-item" id="w-wind">Wind: From the ${day.wind_direction_compass} at ${Math.round(day.wind_speed)} mph</li>
            </ul>   
        </div>`
        });
    }

    paintCities(){
        this.clearSearch();
        this.filter.citiesArr.forEach(city => {
            this.cities.innerHTML += `<li class="list-group-item text-info select-item" id="${city.woeid}">${city.city}</li>`;
        });    
    }

    clearSearch(){
        this.cities.innerHTML ='';
    }

    dateUnavailable(unavialble){
        unavialble ? this.unavailable.className = 'text-danger' : this.unavailable.className = 'text-danger hide';
    }

    displayLoadingGif(display){
        if (display){
            this.loading.style.display = 'flex';
            this.loading.style.justifyContent = 'center';
        }else         
            this.loading.style.display = 'none';
    }

    disableDayBtn(){
        this.dayBtn.disabled = true;
        this.weekBtn.disabled = false;
    }
    disableWeekBtn(){
        this.weekBtn.disabled = true;
        this.dayBtn.disabled = false;
    }
}