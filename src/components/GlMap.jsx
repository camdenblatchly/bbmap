import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Map, {Source, Layer, NavigationControl } from 'react-map-gl';
import type {FillLayer} from 'react-map-gl';
import { fitBounds } from 'viewport-mercator-project';

import style from "./styles/GlMap.module.css";

import {
    mapboxStyle,
    bb_tr_100_20,
    contourStyle
} from '../styles';

const GlMap = ({ mapboxToken, filter }) => {

  const mapRef = useRef();

  const USA_BOUNDS = [
      [-125, 24], // Southwest coordinates: [Longitude, Latitude]
      [-66, 49]   // Northeast coordinates: [Longitude, Latitude]
  ];

 const { longitude, latitude, zoom } = fitBounds({
    width: window.innerWidth > 1000? 1000: window.innerWidth,
    height: 500,
    bounds: USA_BOUNDS,
    padding: 20 // Optional padding around the bounds
  });

  const MIN_ZOOM_LEVEL = 10;

  const [hoverInfo, setHoverInfo] = useState(null);
  const [layerFilter, setLayerFilter] = useState(['all']);
  const [map_zoom, setMapZoom] = useState(zoom); 

  const onMove = (event) => {
    console.log("Zoom is ", event.viewState.zoom);
    setMapZoom(event.viewState.zoom);
  };

  const onHover = useCallback(event => {
  {

    if (mapRef !== null && mapRef.current !== null) {

        const map = mapRef.current.getMap();

        let featureId = null;

        const {
          features,
          point: {x, y}
        } = event;
        const hoveredFeature = features && features[0];

        setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});

      }
    }
  }, []);


  useEffect(() => {

    const resizeMap = () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.fitBounds(USA_BOUNDS, { padding: 20 });
      }
    };

    window.addEventListener('resize', resizeMap);
    resizeMap(); // Call resizeMap on component mount to fit bounds on load

    return () => {
      window.removeEventListener('resize', resizeMap);
    };
  }, []);

  useEffect(() => {

    if (filter === "all") {
      setLayerFilter(['all']);
    }

    if (filter === "served") {
      setLayerFilter(['==', ['get', 'category'], "Served"]);
    }

    if (filter === "underserved") {
      setLayerFilter(['==', ['get', 'category'], "Underserved"]);
    }

    if (filter === "unserved") {
      setLayerFilter(['==', ['get', 'category'], "Unserved"]);
    }

  }, [filter]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: zoom
      }}
      mapStyle="mapbox://styles/mapbox/light-v9"
      mapboxAccessToken={mapboxToken}
      interactiveLayerIds={[bb_tr_100_20.layers[0]['id']]}
      onMouseMove={onHover}
      onMove={onMove}
    >
      <Source id={"mapbox-terrain"} type={"vector"} url={"mapbox://mapbox.mapbox-terrain-v2"} >
          <Layer {...contourStyle} >
          </Layer>
      </Source>
      <Source {...bb_tr_100_20.sources[0]} >
          <Layer 
            { ...bb_tr_100_20.layers[0]} 
            filter={layerFilter}
          />
          {hoverInfo && (
            <div className="tooltip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
              <div>
                <b>{hoverInfo.feature.properties.geoid_tr}</b>
                <br />
                {hoverInfo.feature.properties.state_abbr}
                <br />
                {hoverInfo.feature.properties.category}
              </div>
            </div>
          )}
      </Source>
      {map_zoom < MIN_ZOOM_LEVEL && (
        <div className={style["zoom-message"]}>Zoom closer to view data</div>
      )}
    </Map>
  );
};

export default GlMap;
