import './App.css';
import { FormControl, Select, MenuItem } from "@material-ui/core";
import { useState, useEffect } from 'react';

function App() {

  //STATE - How to write a variable in REACT
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');

  //USEEFFECT = runs a piece of code based on given condition
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3
          }));

          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    //console.log("countryCode", countryCode);

    setSelectedCountry(countryCode);
  };


  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={selectedCountry} onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map((country) => (
                <MenuItem value={country.value} > {country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>

      { /* Header */}
      { /* Title + Select input dropdown field */}

      { /* InfoBox */}
      { /* InfoBox */}
      { /* InfoBox */}

      { /* Country Table */}
      { /* Graph */}

      { /* Map */}
    </div >
  );
}

export default App;
