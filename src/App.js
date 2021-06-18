import { React, useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import Table from './Table';
import { prettyPrintStat, sortData } from './util.js';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import MapView from './MapView';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 24, lng: 90 })
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType]=useState("cases");
  // https://disease.sh/v3/covid-19/countries

  //UseEffect-- runs a piece of code based on given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      });

  }, []);

  useEffect(() => {
    //async -> sends a request , wait for its response.
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }
          ));

          setCountries(countries); // dropdown
          const sortedData = sortData(data); // table data.. whole data is passed in sortData.
          setTableData(sortedData);
          setMapCountries(data);
        })
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);

        //for map 
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}>
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>

          </FormControl>

        </div>
        <div className="app__stats">
          <InfoBox
          isRed 
          active={casesType==="cases"}
          onClick={(e) => setCasesType("cases")}
          title="COVID-19 Cases" 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)} />

          <InfoBox
          
          active={casesType==="recovered"}
          onClick={(e) => setCasesType("recovered")}
          title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)} />

          <InfoBox 
          isRed
          active={casesType==="deaths"}
          onClick={(e) => setCasesType("deaths")}
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)} />

        </div>

        <div className="app__map">
          <MapView casesType={casesType}
          countries={mapCountries}  center={mapCenter} zoom={mapZoom} />

        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <br/>
          <h3> Worldwide cases new{casesType}</h3>
        </CardContent>
        <LineGraph casesType={casesType}/>
      </Card>


    </div>
  );
}

export default App;
