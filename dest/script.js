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
        const data = yield fetch(`https://api.weatherapi.com/v1/forecast.json?key=${param.key}&q=${param.q}&days=${param.days}&aqi=no&alerts=no`);
        let res = yield data.json();
        return {
            current: {
                condition: {
                    icon: res.current.condition.icon,
                    text: res.current.condition.text
                },
                temp_c: res.current.temp_c,
                wind_kph: res.current.wind_kph,
                precip_mm: res.current.precip_mm,
                pressure_mb: res.current.pressure_mb,
            },
            forecast: {
                forecastday: res.forecast.forecastday.map((day) => ({
                    data: day.date,
                    day: {
                        maxtemp_c: day.day.maxtemp_c
                    },
                    condition: {
                        icon: day.day.condition.icon,
                        text: day.day.condition.text
                    }
                }))
            }
        };
    });
}
function createCards(forecasts) {
    if (resultDiv) {
        let cardsWrapper = document.createElement('div');
        cardsWrapper.classList.add('cards_wrapper');
        forecasts.forEach((item) => {
            cardsWrapper.insertAdjacentHTML('beforeend', createCard(item));
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
        key: API_KEY,
        q: searchedText,
        days: 7,
    };
    getData(param).then((data) => {
        if (resultDiv) {
            resultDiv.innerHTML = '';
            resultDiv.style.display = 'flex';
        }
        createCardCurrent(data);
        createCards(data.forecast.forecastday);
    });
});
function createCardCurrent(data) {
    const { temp_c, wind_kph, precip_mm, pressure_mb } = data.current;
    const html = `
      <div class="current_wrapper">
        <div class="current_wrapper_Left">
            <img src=${getIconPath(data.current.condition.icon)} alt="weather icon" />
            <p>${data.current.condition.text} <p>
        </div>
        <div class="current_wrapper_right">
            <p>Wind: ${wind_kph}kmph</p>
            <p>Presip: ${precip_mm}mm</p>
            <p>Pressure: ${pressure_mb}mm</p>
            <p class="current_deg"> ${temp_c}\u2103 </p>
        </div>
      </div>
      `;
    resultDiv === null || resultDiv === void 0 ? void 0 : resultDiv.insertAdjacentHTML("beforeend", html);
}
function createCard(data) {
    return `<div class="card_wrapper">
               <div>${getWeekDay(data.data)}</div>
               <img src=${getIconPath(data.condition.icon)} alt="icon">
               <div>${data.day.maxtemp_c}℃</div>
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
