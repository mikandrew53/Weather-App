class Storage {
    constructor() {
        this.currentCity = {};
        this.defaultCity = {
            city: 'Toronto',
            woeid: 4118
        };
        this.getLocationData();
    }

    getLocationData(){
        if(localStorage.getItem('city') === null)
            this.currentCity = this.defaultCity;
        else
            this.currentCity = JSON.parse(localStorage.getItem('city'));   
        return this.currentCity;
    }

    getwoeid(){
        return this.currentCity.woeid;
    }

    setLocationData(city, woeid){
        this.currentCity.city = city;
        this.currentCity.woeid = woeid;
        localStorage.setItem('city', JSON.stringify(this.currentCity));
    }
}