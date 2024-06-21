import "./App.css";
import { useState } from "react";
import Navbar from "./navbar";
import Weather from "./weather";
import Forecast from "./forecast";
import Emergency from "./emergency";
import { API_URL } from "./api";
import { ALERT_URL } from "./api";
import weathericons from "./database/WeatherIconsData.json";
import "./WeatherIcons/css/weather-icons.css";

function App() {
  const [results, setResults] = useState("");
  const [properties, setProperties] = useState("");
  const [forecastinfo, setForecast] = useState("");
  const [forecastinfo2, setForecast2] = useState("");
  const [unitsimperial, setUnitsimperial] = useState(true);
  const [warning, setWarning] = useState(false);
  const [currentPage, setCurrentPage] = useState([1, 6]);
  const [isnextdisabled, setnextDisable] = useState(false);
  const [isprevdisabled, setprevDisable] = useState(true);

  const handleResults = async (results, forecastinfo) => {
    setForecast(forecastinfo);
    setResults(results);
    const { latitude, longitude } = results;
    const weather = fetch(`${API_URL}${latitude},${longitude}`);
    const alert = fetch(`${ALERT_URL}${results.state}`);

    Promise.all([weather])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        setProperties(weatherResponse.properties);
        console.log(weatherResponse.properties);
        console.log(weatherResponse.properties.timeZone);
        const forecast = fetch(`${weatherResponse.properties.forecast}`);
        const forecast2 = fetch(
          `${weatherResponse.properties.forecastGridData}`
        );

        Promise.all([forecast])
          .then(async (response) => {
            const forecastResponse = await response[0].json();
            console.log(forecastResponse);
            setForecast(forecastResponse.properties);
          })
          .catch((err) => console.log(err));

        Promise.all([forecast2])
          .then(async (response) => {
            const forecastResponse2 = await response[0].json();
            console.log(forecastResponse2);
            setForecast2(forecastResponse2.properties);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    Promise.all([alert])
      .then(async (response) => {
        const alertResponse = await response[0].json();
        console.log(alertResponse);
        setWarning(alertResponse.features);
      })
      .catch((err) => console.log(err));
  };

  const Getime = (date) => {
    const tzz = new Date().toLocaleString("en-US", {
      timeZone: forecastinfo ? properties.timeZone : "America/New_York",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return tzz;
  };

  const Getdate = (date) => {
    const tzz = new Date().toLocaleString("en-US", {
      timeZone: forecastinfo ? properties.timeZone : "America/New_York",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    return tzz;
  };

  const handleunitsimperial = () => {
    setUnitsimperial(!unitsimperial);
  };

  const nextForecast = () => {
    if (forecastinfo) {
      setCurrentPage([currentPage[0] + 5, currentPage[1] + 5]);
      setprevDisable(false);
      if (currentPage[1] + 5 > forecastinfo.periods.length) {
        setnextDisable(true);
      } else {
        setnextDisable(false);
      }
    }
  };

  const prevForecast = () => {
    if (forecastinfo) {
      setCurrentPage([currentPage[0] - 5, currentPage[1] - 5]);
      setnextDisable(false);
      if (currentPage[0] < 7) {
        setprevDisable(true);
      } else {
        setprevDisable(false);
      }
    }
  };

  const getIcon = (icon) => {
    const iconTime = icon.replace("/icons/land/", "").split("/")[0];
    const iconName = icon
      .replace("/icons/land/", "")
      .split("/")[1]
      .split("?")[0]
      .split(",")[0];
    /*     console.log(iconName); */
    if (iconTime === "day") {
      return weathericons.icons[iconName].iconName[0];
    } else if (iconTime === "night") {
      return weathericons.icons[iconName].iconName[1];
    }
  };

  const getColor = (icon) => {
    const iconTime = icon.replace("/icons/land/", "").split("/")[0];
    if (iconTime === "day") {
      return "wi-back-day";
    } else if (iconTime === "night") {
      return "wi-back-night";
    }
  };
  return (
    <div className="container">
      <Navbar
        onResultChange={handleResults}
        unitsimperial={handleunitsimperial}
      />
      <div className="emergency-container">
        <div className="emergency-animation-container">
          {warning &&
            warning.map((item, index) => (
              <Emergency
                key={index}
                emergencyLink={`https://alerts.weather.gov/search?area=${results.state}`}
                emergencyText={warning[index].properties.headline}
              />
            ))}
        </div>
      </div>
      <Weather
        time={forecastinfo ? Getime(new Date()) : Getime(new Date())}
        date={Getdate(new Date())}
        city={results ? results.city + "," + results.state : "..."}
        icon={forecastinfo ? getIcon(forecastinfo.periods[0].icon) : "..."}
        backColor={
          forecastinfo ? getColor(forecastinfo.periods[0].icon) : "..."
        }
        weatherDescription={
          forecastinfo ? forecastinfo.periods[0].shortForecast : "..."
        }
        longdescription={
          forecastinfo ? forecastinfo.periods[0].detailedForecast : "..."
        }
        temperature={
          forecastinfo
            ? unitsimperial
              ? forecastinfo.periods[0].temperature
              : Math.round(((forecastinfo.periods[0].temperature - 32) * 5) / 9)
            : "..."
        }
        precipitation={
          forecastinfo
            ? forecastinfo.periods[0].probabilityOfPrecipitation.value === null
              ? "0"
              : forecastinfo.periods[0].probabilityOfPrecipitation.value
            : "..."
        }
        humidity={
          forecastinfo2 ? forecastinfo2.relativeHumidity.values[0].value : "..."
        }
        wind={forecastinfo ? forecastinfo.periods[0].windSpeed : "..."}
        windDirection={
          forecastinfo ? forecastinfo.periods[0].windDirection : "..."
        }
        dewpoint={
          forecastinfo2
            ? unitsimperial
              ? Math.round(
                  (forecastinfo2.dewpoint.values[0].value * 9) / 5 + 32
                )
              : Math.round(forecastinfo2.dewpoint.values[0].value)
            : "..."
        }
      />
      <h3>5 Day Forecast</h3>
      {/*       forecast for desktop
       */}
      {forecastinfo && (
        <div className="forecast-container desktop">
          <button
            className="pagination-button"
            disabled={isprevdisabled}
            id="previous"
            onClick={prevForecast}
          >
            &larr;
          </button>
          {forecastinfo.periods
            .slice(currentPage[0], currentPage[1])
            .map((period, index) => (
              <Forecast
                key={index}
                day={period.name}
                date={Getdate(new Date(period.startTime))}
                icon={getIcon(period.icon)}
                backColor={getColor(period.icon)}
                temperature={
                  unitsimperial
                    ? Math.round(period.temperature)
                    : Math.round(((period.temperature - 32) * 5) / 9)
                }
                weatherDescription={period.shortForecast}
                precipitation={
                  period.probabilityOfPrecipitation.value === null
                    ? "0"
                    : period.probabilityOfPrecipitation.value
                }
                wind={period.windSpeed}
                windDirection={period.windDirection}
              />
            ))}
          <button
            className="pagination-button"
            id="next"
            onClick={nextForecast}
            disabled={isnextdisabled}
          >
            &rarr;
          </button>
        </div>
      )}
      {/*       forecast for mobile
       */}
      {forecastinfo && (
        <div className="forecast-container mobile">
          <button
            className="pagination-button"
            disabled={isprevdisabled}
            id="previous"
            onClick={prevForecast}
          >
            &larr;
          </button>
          {forecastinfo.periods.slice(currentPage[0], 14).map((period, index) => (
            <Forecast
              key={index}
              day={period.name}
              date={Getdate(new Date(period.startTime))}
              icon={getIcon(period.icon)}
              backColor={getColor(period.icon)}
              temperature={
                unitsimperial
                  ? Math.round(period.temperature)
                  : Math.round(((period.temperature - 32) * 5) / 9)
              }
              weatherDescription={period.shortForecast}
              precipitation={
                period.probabilityOfPrecipitation.value === null
                  ? "0"
                  : period.probabilityOfPrecipitation.value
              }
              wind={period.windSpeed}
              windDirection={period.windDirection}
            />
          ))}
          <button
            className="pagination-button"
            id="next"
            onClick={nextForecast}
            disabled={isnextdisabled}
          >
            &rarr;
          </button>
        </div>
      )}
      <footer>
        <p>
          Weather data provided by the National Oceanic and Atmospheric
          Administration
        </p>
      </footer>
    </div>
  );
}

export default App;
