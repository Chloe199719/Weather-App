let city = `Munich`;
let unit = `C`;
let unitlong = `metric`;
const apikey = `5d1cc257e99203c5d51d3dc88e914990`;

const weather = async function () {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&units=metric`
  );
  const procData = await data.json();
  console.log(procData);
  return procData;
};

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
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apikey}&units=${unitlong}`
  );
  const procData = await data.json();
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

const apirequests = (() => {
  const relevantData = {};

  const weather = async function () {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&units=${unitlong}`
    ).catch(function (err) {
      console.log(err);
    });
    if (data.status === 200) {
      const procData = await data.json();
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
  };
  return { weather, parseData, relevantData };
})();

const DomUpdates = (() => {
  const setWeatherNow = async () => {
    await apirequests.parseData();
    const tempdata = await apirequests.relevantData;
    const parsetemps = await parsedatahigh();
    const forecast = await weatherforecast();
    const weatherImg = document.querySelector(`#weather-img`);
    const cityName = document.querySelector(`#city-name`);
    const weather = document.querySelector(`#weather`);
    const temp = document.querySelector(`#temp`);
    const range = document.querySelector(`#range`);
    const header = document.querySelector(`#cityname`);
    const container = document.querySelector(`.container`);
    const localTime = document.querySelector(`.localTime`);
    localTime.textContent = `Local Time:  ${new Date(
      new Date().getTime() +
        new Date().getTimezoneOffset() * 60 * 1000 +
        tempdata.timezone * 1000
    ).toLocaleString(`pt-pt`, {
      dateStyle: `medium`,
      timeStyle: `short`,
    })}`;
    header.textContent = tempdata.cityname;
    cityName.textContent = tempdata.cityname;
    weather.textContent =
      tempdata.weather[0].description.charAt(0).toUpperCase() +
      tempdata.weather[0].description.slice(1);
    weatherImg.src = `http://openweathermap.org/img/wn/${tempdata.weather[0].icon}@2x.png`;
    temp.textContent = `${Math.floor(tempdata.temps.temp)}° ${unit}`;
    range.textContent = `H:${Math.floor(
      parsetemps[0]
    )}°${unit} | L:${Math.floor(parsetemps[1])}°${unit}`;
    container.innerHTML = `<div class="test">
    <div class="row legend">
      <div>Hour</div>
      <div class="center"></div>
      <div class="center">Chance of Rain</div>
      <div class="center">Humidity</div>
      <div class="right">Temperature</div>
    </div>
    <hr />
  </div>`;
    forecast.list.forEach((a) => {
      const tempDiv = document.createElement(`div`);
      const hr = document.createElement(`hr`);
      tempDiv.classList.add(`row`);
      tempDiv.innerHTML = `<div>${new Date(
        a.dt * 1000 +
          new Date().getTimezoneOffset() * 60 * 1000 +
          tempdata.timezone * 1000
      ).toLocaleString(`pt-pt`, {
        dateStyle: `medium`,
        timeStyle: `short`,
      })}</div>

      <div class="center">
        <img
          src="https://openweathermap.org/img/wn/${a.weather[0].icon}@4x.png"
          alt="${
            a.weather[0].description.charAt(0).toUpperCase() +
            a.weather[0].description.slice(1)
          }"
          title= "${
            a.weather[0].description.charAt(0).toUpperCase() +
            a.weather[0].description.slice(1)
          }"
          width="80px
          "
        />
      </div>
      <div class="center">${Math.floor(a.pop * 100)}%</div>
      <div class="center">${a.main.humidity}%</div>
      <div class="right">${Math.floor(a.main.temp)}° ${unit}</div>
    </div>`;
      container.append(tempDiv, hr);
    });
  };

  const searchBar = function () {
    const search = document.querySelector(`#search`);
    if (search.value !== "") {
      city = search.value;
    }
    DomUpdates.setWeatherNow();
    search.value = "";
  };
  const init = function () {
    document
      .querySelector(`#searchBtn`)
      .addEventListener(`click`, DomUpdates.searchBar);
    document.querySelector(`.slider`).addEventListener(`click`, function (e) {
      DomUpdates.unitChanger();
    });
  };
  const unitChanger = function () {
    const temptoggleinput = document.querySelector(`#temptoggle`);

    if (temptoggleinput.checked) {
      unit = `C`;
      unitlong = `metric`;
    } else {
      unit = `F`;
      unitlong = `imperial`;
    }
    DomUpdates.setWeatherNow();
  };
  return { setWeatherNow, searchBar, init, unitChanger };
})();

DomUpdates.setWeatherNow();
DomUpdates.init();

const yeartxt = document.querySelector(`#year`);
const now = new Date();
const yearNow = now.getFullYear();

yeartxt.textContent = yearNow;

const hoverpath = document.querySelector(`path`);
const svg = document.querySelector(`svg`);

svg.addEventListener(`mouseover`, function (e) {
  hoverpath.setAttribute(`fill`, `black`);
});

svg.addEventListener(`mouseleave`, function (e) {
  hoverpath.setAttribute(`fill`, `blue`);
});
