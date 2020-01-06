class Weather {
    constructor (){
        this.woeid;
    }
    async getWeather (woeid) {
            this.woeid = woeid;
            const weatherResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`);
            // const weatherResponse = await fetch(`https://www.metaweather.com/api/location/${this.woeid}/`);
            if(weatherResponse.ok){
                const weatherResponseData = await weatherResponse.json();
                return weatherResponseData;
            }else
                throw `Error: ${weatherResponse.status} ${weatherResponse.statusText}`;
    }

    async searchCity(userCity){
        const cityIdResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${userCity}`);
        // const cityIdResponse = await fetch(`https://www.metaweather.com/api/location/search/?query=${userCity}`);
        if (cityIdResponse.ok){
            const cityIdResponseData = await cityIdResponse.json();
            const cities = [];
            cityIdResponseData.forEach(city => {
                if (userCity.toUpperCase() === city.title.slice(0, userCity.length).toUpperCase()){
                   cities.push({
                       city: city.title,
                       woeid: city.woeid
                   });
                }
            });
           return cities;
        }else 
            throw `Error: ${cityIdResponse.status} ${cityIdResponse.statusText}`; 
    }

    async searchDate(date, title){
        let day = date.slice(8,10);
        let weather ={
            consolidated_weather: [],
            title: title
        };
        for(let i=0; i < 6; i++){
            let searchDate = date.slice(0,8)+day;
            // const dayResponse = await fetch(`https://www.metaweather.com/api/location/${this.woeid}/${searchDate}/`);
            const dayResponse = await fetch(`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${this.woeid}/${searchDate}/`);
            if(dayResponse.ok){
                const dayResponseData = await dayResponse.json();
                weather.consolidated_weather.push(dayResponseData[0]);
            }
            day++; 
        }
        return weather;
    }
}
