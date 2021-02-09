// Init Storage object
const storage = new Storage();
// Init Weather object
const weather = new Weather ();
// Init Filter object
const filter = new Filter();
// Init Ui Object
const ui = new Ui(filter);
// Init Date Object to get today's date
const today = new Date();

// Get Weather on DOM load
document.addEventListener('DOMContentLoaded', getWeather);
// Declare DOM Elements for listening
const dateSearch = document.getElementById('date-search');
const todayBtn = document.getElementById('present-day');
const weekBtn = document.getElementById('week-view');
const dayBtn = document.getElementById('today-view');
const dateDisplayed = document.getElementById('date-displayed');
const cityDisplayed = document.getElementById('already-displayed');
const searchCity = document.getElementById('search-city');
const searchDay = document.getElementById('search-day');
let promiseFulfilled = false;

// Set current date and to empty string
let currentSearchDate = '';
// Set max date for Date Input
const month = (today.getMonth()+1) < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
const day = (today.getDate()-1) < 10 ? `0${today.getDate() - 1}` : today.getDate() - 1;
const todayStr = `${today.getFullYear()}-${month}-${day}`;
dateSearch.setAttribute('max', todayStr);


// Fetch weather Weather
function getWeather() {
    ui.displayLoadingGif(true);
     dateSearch.value = '';
     weather.getWeather(storage.getwoeid())
     .then(data => {
         ui.displayLoadingGif(false);
         ui.setWeather(data);
         todayBtn.disabled = true;
         dayBtn.disabled ? ui.paintDay() : ui.paintWeek();
     })
     .catch(error => {console.log('error' + error);});    
 }

// Week View
weekBtn.addEventListener('click', e =>{
    ui.paintWeek();
    ui.disableWeekBtn();
    e.preventDefault();
});

// Day View
dayBtn.addEventListener('click', e=>{
    ui.paintDay();
    ui.disableDayBtn();
    e.preventDefault();
});

/*
    * Search City 
    * case 1: if the search field is empty => clear the seach results
    * case 2: if the user enters backspace => filter the new search string and display the new cities
    * case 3: if the user enters a letter for the first time or a new letter => fetch and filter the cities for the new search string
    * case 4: if the adds a letter to the existing string => filter and display the new cities
 */
searchCity.addEventListener('keyup', e =>{
    if (searchCity.value === ''){
        ui.clearSearch(); 
        promiseFulfilled = false;
    }else if(e.keyCode === 8){
        filter.searchCitiesBackspace(searchCity.value);
        ui.paintCities();
    }else if(!promiseFulfilled || !filter.isNewSearch(searchCity.value)){     
        weather.searchCity(searchCity.value.slice(0,1))
        .then(data => {
            filter.setCitiesArr(data);
            if (searchCity.value){
                filter.searchResults(searchCity.value);
                ui.paintCities();
            }
            promiseFulfilled = true;
        });   
    }else{
        filter.searchResults(searchCity.value);
        ui.paintCities();
    }
});

// Search Pasted City
searchCity.addEventListener('paste', () =>{
    weather.searchCity(searchCity.value.slice(0,1))
    .then(data => {
        filter.setCitiesArr(data);
        filter.searchResults(searchCity.value);
        ui.paintCities();
    });  
});

// Pick city
document.getElementById('search-results').addEventListener('click', e =>{
    if (e.target.id !== storage.getwoeid()){
        storage.setLocationData(e.target.textContent, e.target.id);
        promiseFulfilled = false;
        getWeather();
        searchCity.value = '';
    }else {
        searchCity.value = '';
        cityDisplayed.className = 'text-danger text-center';
        setTimeout(()=> {cityDisplayed.className = 'text-danger text-center hide';}, 3000);
    }
    ui.clearSearch();
});

// Get today's weather
todayBtn.addEventListener('click', e =>{
    getWeather();
    ui.displayLoadingGif(true);
    todayBtn.disabled = true;
    currentSearchDate = '';
    e.preventDefault();
});

// Search Weather of Previous date
searchDay.addEventListener('click', e=>{
    if (dateSearch.value === ''){
        dateSearch.style.border = 'solid 1px red';
    }else {
        if (currentSearchDate !== dateSearch.value){
            dateSearch.style.border = 'solid 1px black';
            const dateToSend = dateSearch.value.slice(0,4) + '/' + dateSearch.value.slice(5,7) + '/' + dateSearch.value.slice(8,10);
            ui.displayLoadingGif(true);
            currentSearchDate = dateSearch.value;
            getPastWaether(dateToSend);
        }else {
            dateDisplayed.className = 'text-danger';
            setTimeout(()=>{ dateDisplayed.className = 'text-danger hide'; }, 3000);
        }
    }
    e.preventDefault();
});
function getPastWaether(dateToSend) {
    weather.searchDate(dateToSend, ui.cityWeather.title)
    .then(data => {
        ui.displayLoadingGif(false)
        if(data.consolidated_weather.length === 0){
            ui.dateUnavailable(true);
            setTimeout(()=>{ui.dateUnavailable(false);}, 3000);
        }
        else{
            let display = true;
            if (!data.consolidated_weather[0]){
                display = false;
                ui.dateUnavailable(true);
                setTimeout(()=>{ui.dateUnavailable(false);}, 3000);
            }
            if (display){
                todayBtn.disabled=false;
                ui.setWeather(data); 
                dayBtn.disabled ? ui.paintDay() : ui.paintWeek();
                ui.dateUnavailable(false);
            }
        }
    });
}
