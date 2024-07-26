import "./weather.css";

// fetching weather data from the national weather service api

const Weather = (props) => {
  return (
    <div className="weather">
      <div className={`top ${props.backColor}`}>
        <div className="time">
          <p>{props.time}</p>
          <p>{props.date}</p>
        </div>
        <span alt="weather icon" className={`wi ${props.icon} wi-main`}></span>
        <div className={`${props.backColor} description`}>
          <p className="city">{props.city}</p>
          <p className="weather-description">{props.weatherDescription}</p>
        </div>
      </div>
      <div className="bottom">
        <div className="details">
          <div className="parameter-row-description">
            <p className="parameter-description">{props.longdescription}</p>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Temperature:</span>
            <span className="parameter-value">{props.temperature}°</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Precipitation:</span>
            <span className="parameter-value">{props.precipitation}%</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Humidity:</span>
            <span className="parameter-value">{props.humidity}%</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Wind:</span>
            <span className="parameter-value">
              {props.wind},{props.windDirection}
            </span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Dewpoint:</span>
            <span className="parameter-value">{props.dewpoint}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Weather;
