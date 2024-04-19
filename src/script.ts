interface WeatherResponse {
    current: {
        condition: WeatherConditionData;
        temp_c: number;
        wind_kph: number;
        precip_mm: number;
        pressure_mb: number;
    };
    forecast: {
        forecastday: WeatherForecastdayData[];
    };
}
interface WeatherConditionData {
    icon: string;
    text: string;
}
interface WeatherForecastdayData {
    data: string;
    day: {
        maxtemp_c: number;
    };
    condition: WeatherConditionData;
}
interface WeatherRequest {
    key: string;
    q: string;
    days: number;
}

const API_KEY:string = 'b8ecddaa7b504d2f969164952241204'

const weatherForm:HTMLFormElement | null = document.querySelector('.weather_form')
const searchInput:HTMLInputElement | null = document.querySelector('.input_text')
let resultDiv: HTMLOutputElement | null = document.querySelector('.result_section')

async function  getData (param:WeatherRequest):Promise<WeatherResponse>{
    const data:Response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${param.key}&q=${param.q}&days=${param.days}&aqi=no&alerts=no`)
    let res = await data.json()

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
            forecastday: res.forecast.forecastday.map((day: any) => ({
                data: day.date,
                day:{
                    maxtemp_c: day.day.maxtemp_c
                },
                condition:{
                    icon:day.day.condition.icon,
                    text:day.day.condition.text
                }
            }))
        }
    }
}

function createCards(forecasts:WeatherForecastdayData[]):void{
    if (resultDiv){
        let cardsWrapper: HTMLDivElement = document.createElement('div')
        cardsWrapper.classList.add('cards_wrapper')
        forecasts.forEach((item:WeatherForecastdayData):void=>{
            cardsWrapper.insertAdjacentHTML('beforeend',createCard(item))
        })
        resultDiv.append(cardsWrapper)
    }
}

weatherForm?.addEventListener('submit',(e: SubmitEvent):void=>{
    e.preventDefault()
    const searchedText :string = searchInput?.value.trim() || '';
    if (!searchedText) return;

    let param:WeatherRequest = {
        key: API_KEY,
        q:searchedText,
        days: 7,
    }

    getData(param).then((data:WeatherResponse):void=>{
        if(resultDiv){
            resultDiv.innerHTML = ''
            resultDiv.style.display = 'flex'
        }
        createCardCurrent(data)
        createCards(data.forecast.forecastday)
    })
})

function createCardCurrent(data:WeatherResponse):void{
    const {
        temp_c,
        wind_kph,
        precip_mm,
        pressure_mb
    } = data.current
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
    resultDiv?.insertAdjacentHTML("beforeend", html);
}

function createCard(data:WeatherForecastdayData):string{
    return`<div class="card_wrapper">
               <div>${getWeekDay(data.data)}</div>
               <img src=${getIconPath(data.condition.icon)} alt="icon">
               <div>${data.day.maxtemp_c}℃</div>
           </div>
    `
}

function getIconPath(pathFromFetching: string) :string{
    let imgURLSplit: string[] = pathFromFetching.split("/");
    return "https://cdn.weatherapi.com/weather/64x64/day/" + imgURLSplit[imgURLSplit.length - 1]
}

function getWeekDay(date:string) :string{
    return new Intl.DateTimeFormat("en-US", { weekday: "short" })
                   .format(new Date(date))
}


