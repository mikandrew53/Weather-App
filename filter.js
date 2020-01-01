class Filter {
    constructor(){
        this.citiesArr = [];
        this.citiesApiResults = [];    
    }

    setCitiesArr(citiesArr){
        this.citiesApiResults = Object.assign([], citiesArr);
        this.citiesArr = Object.assign([], citiesArr);
    }

    getDay(day){
        const dayOfWeek = day.getDay();
        
        if (dayOfWeek === 0) return 'Mon';
        else if (dayOfWeek === 1) return 'Tues';
        else if (dayOfWeek === 2) return 'Wed';
        else if (dayOfWeek === 3) return 'Thurs';
        else if (dayOfWeek === 4) return 'Fri';
        else if (dayOfWeek === 5) return 'Sat';
        else return 'Sun';
    }

    searchResults(cityToSearch){
        for (let i = 0; i < this.citiesArr.length; i++){
             if(this.citiesArr[i].city.slice(0, cityToSearch.length).toUpperCase() !== cityToSearch.toUpperCase()){
                 this.citiesArr.splice(i, 1);
                 i--;
             }
         }
     }

     searchCitiesBackspace(CityToSearch){
        for (let i = 0; i < this.citiesApiResults.length; i++){
            if (this.citiesApiResults[i].city.slice(0, CityToSearch.length).toUpperCase() === CityToSearch.toUpperCase()){
                let match = false
                this.citiesArr.forEach(city => {
                    if(city.city === this.citiesApiResults[i].city)
                        match = true;
                });
                if (!match)
                    this.citiesArr.push(this.citiesApiResults[i]);
            }
        }
    }    

    isNewSearch(searchRequest){
        return searchRequest.slice(0, 1).toUpperCase() === this.citiesApiResults[0].city.slice(0,1).toUpperCase();
    }
}