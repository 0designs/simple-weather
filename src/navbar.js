import "./navbar.css";
import logo from "./logo.png";
import geodata from "./database/USCities.json";
import { useState } from "react";

const Navbar = ({ onResultChange, unitsimperial, errorfound }) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isimperial, setIsimperial] = useState(true);
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    const isValidZipCode = /^\d{5}(?:[-\s]\d{4})?$/.test(event.target.value);
    if (isValidZipCode) {
      const SearchResults = geodata.find(
        ({ zip_code }) => zip_code === Number(event.target.value)
      );
      if (SearchResults) {
        console.log(SearchResults.city + "," + SearchResults.state);
        onResultChange(SearchResults);
      } else {
        console.log("Not Found");
      }
    } else {
      if (event.target.value.length > 2) {
        if (event.target.value.includes(",")) {
          const searchResults = geodata
            .filter(({ city }) =>
              city
                .toLowerCase()
                .includes(event.target.value.split(",")[0].trim().toLowerCase())
            )
            .filter(({ state }) =>
              state
                .toLowerCase()
                .includes(event.target.value.split(",")[1].trim().toLowerCase())
            )
            .filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.city === item.city && t.state === item.state
                )
            )
            .slice(0, 5); // Limit the suggestions to the first 5 matches
          setSuggestions(searchResults);
        } else {
          const searchResults = geodata
            .filter(({ city }) =>
              city.toLowerCase().includes(event.target.value.toLowerCase())
            )
            .filter(
              (item, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.city === item.city && t.state === item.state
                )
            )
            .slice(0, 5); // Limit the suggestions to the first 5 matches
          setSuggestions(searchResults);
        }
      }
    }
  };
  const focusInput = (suggestion) => {
    if (searchValue) {
      setSearchValue("");
    }
    setSuggestions([]);
  };
  const changeUnits = (event) => {
    if (event.target.id === "imperial") {
      setIsimperial(true);
      unitsimperial(isimperial);
    } else {
      setIsimperial(false);
      unitsimperial(isimperial);
    }
  };
  const toggleSearch = () => {
    if (document.getElementById("search").style.display === "none") {
      document.getElementById("search").style.display = "block";
    } else {
      document.getElementById("search").style.display = "none";
    }
  };

  function searchSubmit(event) {
    event.preventDefault();
    if (searchValue === "") {
      return;
    }
    else if (suggestions.length === 0) {
      return;
    }
    else if (suggestions.find((suggestion) => suggestion.city === searchValue.split(",")[0])) {
      if (suggestions.length === 1) {
        onResultChange(suggestions[0]);
        return;
      }
      else if (suggestions.length > 1) {
        onResultChange(
          suggestions.find(
            (suggestion) =>
              suggestion.city === searchValue.split(",")[0] &&
              suggestion.state === searchValue.split(",")[1]
          )
        );
        return;
      }
    }
    else {
      return;
    }
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>
          <img src={logo} alt="Simple Weather" />
        </h1>
        <button type="button" id="search-button" onClick={toggleSearch}>
          &#x1F50D;
        </button>
        <form id="search" onSubmit={searchSubmit}>
          <input
            type="text"
            placeholder="Enter an US city or zip code"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={focusInput}
            list="suggestions"
          />
          <div className="search-error-message">{errorfound}</div>
          <datalist className="suggestions" id="suggestions" name="suggestions">
            {suggestions.map((suggestion, index) => (
              <option
                key={index}
                className="suggestion-item"
                value={`${suggestion.city},${suggestion.state}`}
              ></option>
            ))}
          </datalist>

        </form>
      </div>

      <div className="units">
        <input
          type="radio"
          name="units"
          id="imperial"
          value="imperial"
          defaultChecked
          onChange={changeUnits}
        />
        <label htmlFor="imperial">°F</label>
        <input
          type="radio"
          name="units"
          id="metric"
          value="metric"
          onChange={changeUnits}
        />
        <label htmlFor="metric">°C</label>
      </div>
    </nav>
  );
};
export default Navbar;
