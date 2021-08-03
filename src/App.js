import React, { useState, useEffect } from "react";
import "./App.css";
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, formatNumbers } from "./util";
import LineGraph from './LineGraph';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

function App() {

  //STATE - How to write a variable in REACT
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

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
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3
          }));

          let sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const endpointURL =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    console.log("endpointURL--->", endpointURL);

    await fetch(endpointURL)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        //set all data from the country response.
        setCountryInfo(data);
        if (data.countryInfo == null) {
          //set to default
          setMapCenter([34.80746, -40.4796]);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }

        setMapZoom(4);

      });
  };

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
          <InfoBox
            isRed
            active={caseType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Coronavirus Cases"
            cases={formatNumbers(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}>
          </InfoBox>

          <InfoBox
            active={caseType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recovered"
            cases={formatNumbers(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}>
          </InfoBox>

          <InfoBox
            isRed
            active={caseType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={formatNumbers(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div >

        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>

      <Card className="app__right">
        <CardContent>

          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">World wide {caseType}</h3>
          <LineGraph className="app__graph" caseType={caseType} />

        </CardContent>
      </Card>

    </div >
  );
};

export default App;
