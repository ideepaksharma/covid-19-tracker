import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';

function App() {

  //STATE - How to write a variable in REACT
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });

  }, []);

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

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("countryCode >>>>>", countryCode);

    const endpointURL =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    console.log("endpointURL--->", endpointURL);

    await fetch(endpointURL)
      .then(response => response.json())
      .then(data => {
        setSelectedCountry(countryCode);

        //set all data from the country response.
        setCountryInfo(data);

      });
  };

  console.log("CountryInfo--->", countryInfo);

  return (
    <div className="app">

      <div className="app_left">
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

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></ InfoBox >
        </div >

        <Map></Map>

      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Cases by Country</h3>
          <h3>World wide Cases</h3>
          { /* Country Table */}
          { /* Graph */}
        </CardContent>
      </Card>

    </div >
  );
}

export default App;
