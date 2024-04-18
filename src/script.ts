interface WeatherData{
    weekDay: string
    icon: string
    deg: number
}
interface SearchParams {
    API_KEY: string
    searchedText: string
    daysCount: number
}
interface CurrentData extends WeatherData{
    wind: number
    presip: number
    pressure:number
    text:string
}

const API_KEY:string = 'b8ecddaa7b504d2f969164952241204'


const weatherForm:HTMLFormElement | null = document.querySelector('.weather_form')
const searchInput:HTMLInputElement | null = document.querySelector('.input_text')
let resultDiv: HTMLOutputElement | null = document.querySelector('.result_section')

async function  getData (param:SearchParams):Promise<[ WeatherData[],Omit<CurrentData,'weekDay'>]>{
    const data:Response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${param.API_KEY}&q=${param.searchedText}&days=${param.daysCount}&aqi=no&alerts=no`)
    let res = await data.json()
    console.log(param.searchedText, res)

    const usefulData:WeatherData[] = res.forecast.forecastday.map((day: any):WeatherData => ({
        weekDay: getWeekDay(day.date),
        icon: day.day.condition.icon,
        deg: day.day.avgtemp_c,
    }))
    const currentData :Omit<CurrentData,'weekDay'> = {
        icon: res.current.condition.icon,
        deg: res.current.temp_c,
        wind: res.current.wind_kph,
        presip: res.current.precip_mm,
        pressure: res.current.pressure_mb,
        text: res.current.condition.text
    }
    console.log(param.searchedText, usefulData)
    return [usefulData,currentData]
}

function createCards(weatherData:WeatherData[]):void{
    if (resultDiv){
        let cardsWrapper: HTMLDivElement = document.createElement('div')
        cardsWrapper.classList.add('cards_wrapper')
        weatherData.forEach((item:WeatherData):void=>{
            cardsWrapper.insertAdjacentHTML('beforeend',createCard2(item))
        })
        resultDiv.append(cardsWrapper)
    }
}

weatherForm?.addEventListener('submit',(e: SubmitEvent):void=>{
    e.preventDefault()
    const searchedText :string = searchInput?.value.trim() || '';
    if (!searchedText) return;

    let param:SearchParams = {
        API_KEY,
        searchedText,
        daysCount: 7,
    }

    getData(param).then((data: [WeatherData[],Omit<CurrentData,'weekDay'>]):void=>{
        if(resultDiv){
            resultDiv.innerHTML = ''
        }
        const [weatherData,currentData] = data
        createCardCurrent2(currentData)
        createCards(weatherData)
    })
})

function createCardCurrent2(data:Omit<CurrentData,'weekDay'>):void{
    const {
        icon,
        deg,
        wind,
        presip,
        pressure,
        text
    } = data
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

    resultDiv?.insertAdjacentHTML("beforeend", html);
}

function createCard2({weekDay, deg, icon}:WeatherData):string{
    return`<div class="card_wrapper">
               <div>${weekDay}</div>
               <img src=${getIconPath(icon)} alt="icon">
               <div>${deg}℃</div>
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


