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


const weatherForm:HTMLFormElement | null = document.querySelector('#weatherForm')
const searchInput:HTMLInputElement | null = document.querySelector('#inputText')
let resultDiv: HTMLOutputElement | null = document.querySelector('#result_section')

async function  getData (param:SearchParams):Promise<[ WeatherData[],CurrentData]>{
    const data:Response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${param.API_KEY}&q=${param.searchedText}&days=${param.daysCount}&aqi=no&alerts=no`)
    let res = await data.json()
    console.log(param.searchedText, res)

    const usefulData:WeatherData[] = res.forecast.forecastday.map((day: any) => ({
        weekDay: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(day.date)),
        icon: day.day.condition.icon,
        deg: day.day.avgtemp_c,
    }))
    const currentData = {
        weekDay: '',
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
    let cardsWrapper = document.createElement('div')
    cardsWrapper.classList.add('cards_wrapper')
    weatherData.forEach((item:WeatherData):void=>{
        cardsWrapper.append(createCard(item))
    })
    resultDiv?.append(cardsWrapper)

}
function createCard({weekDay, deg, icon}:WeatherData):HTMLElement{
    let cardWrapper:HTMLDivElement = document.createElement('div')
    cardWrapper.classList.add('card_wrapper')

    let cardWeekDay:HTMLDivElement = document.createElement('div')
    cardWeekDay.innerText = weekDay
    cardWrapper.append(cardWeekDay)

    let cardImg:HTMLImageElement = document.createElement('img')
    let imgURLSplit:string[] = icon.split('/')
    cardImg.setAttribute('src',`https://cdn.weatherapi.com/weather/64x64/day/${imgURLSplit[imgURLSplit.length-1]}`)
    cardWrapper.append(cardImg)

    let cardDeg:HTMLDivElement = document.createElement('div')
    cardDeg.innerText = deg.toFixed(1).toString() + '\u2103'
    cardWrapper.append(cardDeg)

    return cardWrapper
}

weatherForm?.addEventListener('submit',(e: SubmitEvent)=>{
    e.preventDefault()
    const searchedText :string = searchInput?.value.trim() || '';
    if (!searchedText) return;

    let param:SearchParams = {
        API_KEY: 'b8ecddaa7b504d2f969164952241204',
        searchedText,
        daysCount: 7,
    }

    getData(param).then((data: [WeatherData[],CurrentData]):void=>{
        if(resultDiv){
            resultDiv.innerHTML = ''
        }
        const [weatherData,currentData] = data
        createCardCurrent(currentData)
        createCards(weatherData)
    })
})

function createCardCurrent(currentData:CurrentData){
    const {
        weekDay,
        icon,
        deg,
        wind,
        presip,
        pressure,
        text
    } = currentData

    let CurrentWrapper:HTMLDivElement = document.createElement('div')
    CurrentWrapper.classList.add('current_wrapper')

    let CurrentWrapperLeft:HTMLDivElement = document.createElement('div')
    CurrentWrapperLeft.classList.add('current_wrapper_Left')


    let cardImg:HTMLImageElement = document.createElement('img')
    let imgURLSplit = icon.split('/')
    cardImg.setAttribute('src',`https://cdn.weatherapi.com/weather/64x64/day/${imgURLSplit[imgURLSplit.length-1]}`)
    CurrentWrapperLeft.append(cardImg)

    let textElement:HTMLDivElement = document.createElement('div')
    textElement.innerText = text
    CurrentWrapperLeft.append(textElement)

    CurrentWrapper.append(CurrentWrapperLeft)

    let CurrentWrapperRight:HTMLDivElement = document.createElement('div')
    CurrentWrapperRight.classList.add('current_wrapper_right')

    let windText:HTMLDivElement = document.createElement('div')
    windText.innerText = `Wind: ${wind}kmph`
    CurrentWrapperRight.append(windText)

    let presipText:HTMLDivElement = document.createElement('div')
    presipText.innerText = `Presip: ${presip}mm`
    CurrentWrapperRight.append(presipText)

    let pressureText:HTMLDivElement = document.createElement('div')
    pressureText.innerText = `Pressure: ${pressure}mm`
    CurrentWrapperRight.append(pressureText)


    let cardDeg:HTMLDivElement = document.createElement('div')
    cardDeg.classList.add('current_deg')
    cardDeg.innerText = deg.toFixed(1).toString() + ' \u2103'
    CurrentWrapperRight.append(cardDeg)

    CurrentWrapper.append(CurrentWrapperRight)

    if (resultDiv){
        resultDiv.style.display = 'flex'
        resultDiv?.append(CurrentWrapper)

    }
}


