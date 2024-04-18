"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = 'b8ecddaa7b504d2f969164952241204';
const weatherForm = document.querySelector('.weather_form');
const searchInput = document.querySelector('.input_text');
let resultDiv = document.querySelector('.result_section');
function getData(param) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetch(`https://api.weatherapi.com/v1/forecast.json?key=${param.API_KEY}&q=${param.searchedText}&days=${param.daysCount}&aqi=no&alerts=no`);
        let res = yield data.json();
        console.log(param.searchedText, res);
        const usefulData = res.forecast.forecastday.map((day) => ({
            weekDay: getWeekDay(day.date),
            icon: day.day.condition.icon,
            deg: day.day.avgtemp_c,
        }));
        const currentData = {
            icon: res.current.condition.icon,
            deg: res.current.temp_c,
            wind: res.current.wind_kph,
            presip: res.current.precip_mm,
            pressure: res.current.pressure_mb,
            text: res.current.condition.text
        };
        console.log(param.searchedText, usefulData);
        return [usefulData, currentData];
    });
}
function createCards(weatherData) {
    if (resultDiv) {
        let cardsWrapper = document.createElement('div');
        cardsWrapper.classList.add('cards_wrapper');
        weatherData.forEach((item) => {
            cardsWrapper.insertAdjacentHTML('beforeend', createCard2(item));
        });
        resultDiv.append(cardsWrapper);
    }
}
weatherForm === null || weatherForm === void 0 ? void 0 : weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchedText = (searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.trim()) || '';
    if (!searchedText)
        return;
    let param = {
        API_KEY,
        searchedText,
        daysCount: 7,
    };
    getData(param).then((data) => {
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
        const [weatherData, currentData] = data;
        createCardCurrent2(currentData);
        createCards(weatherData);
    });
});
function createCardCurrent2(data) {
    const { icon, deg, wind, presip, pressure, text } = data;
    const html = `
      <div class="current_wrapper">
        <div class="current_wrapper_Left">
            <img src="${getIconPath(icon)}" alt="weather" />
            <p>${text} <p> 
        </div>
        <div class="current_wrapper_right">
            <p>Wind: ${wind}kmph</p>
            <p>Presip: ${presip}mm</p>
            <p>Pressure: ${pressure}mm</p>
            <p class="current_deg"> ${deg}."\u2103" </p>
        </div>
      </div>
      `;
    resultDiv === null || resultDiv === void 0 ? void 0 : resultDiv.insertAdjacentHTML("beforeend", html);
}
function createCard2({ weekDay, deg, icon }) {
    return `<div class="card_wrapper">
               <div>${weekDay}</div>
               <img src=${getIconPath(icon)} alt="icon">
               <div>${deg}℃</div>
           </div>
    `;
}
function getIconPath(pathFromFetching) {
    let imgURLSplit = pathFromFetching.split("/");
    return "https://cdn.weatherapi.com/weather/64x64/day/" + imgURLSplit[imgURLSplit.length - 1];
}
function getWeekDay(date) {
    return new Intl.DateTimeFormat("en-US", { weekday: "short" })
        .format(new Date(date));
}
