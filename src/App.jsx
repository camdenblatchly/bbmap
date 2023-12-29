import './App.css';
import React, { useState } from 'react';

import GlMap from './components/GlMap';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { createTheme, ThemeProvider } from '@mui/material/styles';

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

  // const [filter, setFilter] = useState("all");

  const [filter, setFilter] = useState({
    bb_service: "all",
    state: "all",
  });

  function handleChange(event) {

    if (event.target.name === "bb-radio") {
      setFilter({...filter, bb_service: event.target.value});
    }

  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="controls">
            <h1>Broadband access</h1>

            <FormControl>
              <FormLabel id="bb-service-radio">Broadband service level</FormLabel>
              <RadioGroup
                row
                aria-labelledby="bb-service-radio"
                defaultValue="all"
                name="bb-radio"
                onChange={handleChange}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="served" control={<Radio />} label="Served" />
                <FormControlLabel value="underserved" control={<Radio />} label="Underserved" />
                <FormControlLabel value="unserved" control={<Radio />} label="Unserved" />
              </RadioGroup>
            </FormControl>   

            <Autocomplete
              disablePortal
              id="state-select"
              options={["NH", "MA", "VT", "ME"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="State Abbr" />}
              onChange={(event, newValue) => {
                setFilter({...filter, state: newValue});
              }}
            />

          </div>
          <div className="map-container">
            <GlMap mapboxToken={MAPBOX_TOKEN} filter={filter} />
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
