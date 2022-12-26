let city = `Mauern`;
let unit = `C`;
const apikey = `5d1cc257e99203c5d51d3dc88e914990`;
const googeapikey = `AIzaSyA7M6_URpqgHbgO_Z0bRFVyMjsCZ3XrqDs`;

const weather = async function () {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&units=metric`
  );
  const procData = await data.json();
  console.log(procData);
  return procData;
};

// const placeData = async function () {
//   const div = document.createElement(`div`);
//   let date = new Date();
//   let currentdate = new Date();

//   let datatest = await weather();

//   currentdate.setTime(datatest.dt * 1000);
//   date.setTime(datatest.sys.sunrise * 1000);

//   div.textContent = `City ${datatest.name}, ${datatest.timezone} ${
//     datatest.wind.speed * 3.6
//   }, ${date} /////// ${currentdate.toLocaleString(`DE-DE`)} `;

//   //   document.body.appendChild(div);
// };

const hamburger = document.querySelector(`.hamburger`);
const navMenu = document.querySelector(`.nav-menu`);

const acivemenu = function () {
  hamburger.classList.toggle(`active`);
  navMenu.classList.toggle(`active`);
};

hamburger.addEventListener(`click`, acivemenu);
document
  .querySelectorAll(`.nav-link`)
  .forEach((a) => a.addEventListener(`click`, acivemenu));

const weatherforecast = async function () {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apikey}&units=metric`
  );
  const procData = await data.json();
  console.log(procData);
  return procData;
};

const parsedatahigh = async function () {
  let tempdata = await weatherforecast();
  let temphigh = -2000;
  let templow = 2000;
  for (let i = 0; i < 8; i++) {
    if (tempdata.list[i].main.temp > temphigh) {
      temphigh = tempdata.list[i].main.temp;
    }
  }
  for (let i = 0; i < 8; i++) {
    if (tempdata.list[i].main.temp < templow) {
      templow = tempdata.list[i].main.temp;
    }
  }
  return [temphigh, templow];
};

weatherforecast();

const apirequests = (() => {
  const relevantData = {};

  const weather = async function () {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&units=metric`
    ).catch(function (err) {
      console.log(err);
    });
    if (data.status === 200) {
      const procData = await data.json();
      console.log(procData);
      return procData;
    } else {
      alert(`No City Found`);
    }
  };
  const parseData = async function () {
    const rawData = await weather();
    relevantData.cityname = rawData.name;
    relevantData.weather = rawData.weather;
    relevantData.ident = {};
    relevantData.ident.sunrise = rawData.sys.sunrise;
    relevantData.ident.sunset = rawData.sys.sunset;
    relevantData.ident.country = rawData.sys.country;
    relevantData.wind = rawData.wind;
    relevantData.temps = rawData.main;
    relevantData.timezone = rawData.timezone;
    return relevantData;
  };
  return { weather, parseData };
})();

const DomUpdates = (() => {
  const setWeatherNow = async () => {
    const tempdata = await apirequests.parseData();
    const parsetemps = await parsedatahigh();
    const weatherImg = document.querySelector(`#weather-img`);
    const cityName = document.querySelector(`#city-name`);
    const weather = document.querySelector(`#weather`);
    const temp = document.querySelector(`#temp`);
    const range = document.querySelector(`#range`);
    cityName.textContent = tempdata.cityname;
    weather.textContent =
      tempdata.weather[0].description.charAt(0).toUpperCase() +
      tempdata.weather[0].description.slice(1);
    weatherImg.src = `http://openweathermap.org/img/wn/${tempdata.weather[0].icon}@2x.png`;
    temp.textContent = `${Math.floor(tempdata.temps.temp)}° ${unit}`;
    range.textContent = `H:${Math.floor(
      parsetemps[0]
    )}°${unit} | L:${Math.floor(parsetemps[1])}°${unit}`;
  };
  return { setWeatherNow };
})();

DomUpdates.setWeatherNow();
