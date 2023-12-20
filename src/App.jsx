import './App.css';
import React, { useState } from 'react';

import CountyChoropleth from './components/CountyChoropleth';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { filter } from 'd3';

const theme = createTheme({
    typography: {
        fontFamily: 'Bitter, TT Hoves, Helvetica, Arial',
    },
    palette: {
        primary: {
            main: '#00835D',
            light: '#A3E2B5',
            dark: '#26535C',
            contrastText: 'white',
        },
    },
});

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnVyYWxpbm5vIiwiYSI6ImNqeHl0cW0xODBlMm0zY2x0dXltYzRuazUifQ.zZBovoCHzLIW0wCZveEKzA';

const App = () => {

  const [filter, setFilter] = useState("all");

  function handleChange(event) {
    setFilter(event.target.value);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="controls">
            <h1>Broadband access</h1>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                defaultValue="all"
                name="row-radio-buttons-group"
                onChange={handleChange}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="served" control={<Radio />} label="Served" />
                <FormControlLabel value="underserved" control={<Radio />} label="Underserved" />
                <FormControlLabel value="unserved" control={<Radio />} label="Unserved" />
              </RadioGroup>
            </FormControl>            
          </div>
          <div className="map-container">
            <CountyChoropleth mapboxToken={MAPBOX_TOKEN} filter={filter} />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
