import "./forecast.css";
const Forecast = (props) => {
  return (
    <div className="forecast">
      <div className="day">
        <p>{props.day}</p>
        <p>{props.date}</p>
      </div>
      <div className="info">
        <span alt="weather icon" className={`wi ${props.icon} wi-back ${props.backColor} wi-forecast`}></span>
        <div className="parameter-row-content">
          <p className="weather-description">{props.weatherDescription}</p>
          <div className="parameter-row-description">
            <span className="parameter-value">{props.temperature}°</span>
            <span className="parameter-value"> · </span>
            <span className="parameter-value">{props.precipitation}%</span>
            <br />
            <span className="parameter-value">
              {props.wind},{props.windDirection}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
