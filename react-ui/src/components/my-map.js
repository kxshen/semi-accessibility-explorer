import React, { useEffect } from 'react';
import './my-map.css';
import L from 'leaflet';
import {} from 'mapbox-gl-leaflet';
import {} from 'leaflet-ajax'
//import {GeoJSON} from 'react-leaflet'
import local_data from './data/smart_gtfs_short.js';
//import $ from 'jquery'

//Reset default icon, bugs in the package. See https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Actual Map
function MyMap() {
  let mapContainer;

  useEffect(() => {
    //Initially center the map on Detroit
    const initialState = {
      lng: -83.0458,
      lat: 42.3314,
      zoom: 8
    };

    const map = L.map(mapContainer).setView([initialState.lat, initialState.lng], initialState.zoom);

    const attribution = `© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>`

    // Set basemap layer default (Positron)
    const greyscale_basemap = L.mapboxGL({
      accessToken: 'no-token',
      attribution,
      interactive: false,
      style: 'https://api.maptiler.com/maps/positron/style.json?key=exZ5EI9ZzPeWj7DkSjKi' 
    }).addTo(map);

    // Add basemap layer option (OSM)
    const streets_basemap = L.mapboxGL({
      accessToken: 'no-token',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=exZ5EI9ZzPeWj7DkSjKi' 
    });

    //add MongoDB database via API routing
    var transitroutes = new L.GeoJSON.AJAX(
      "/api/maplayers",
      {
        style: function(feature) {
          switch (feature.properties.agency) {
            case 'SMART': return {color: '#ED594D', opacity: '50%'};
            case 'DDOT':   return {color: '#024547', opacity: '50%'};
          }
        },
      onEachFeature: function(feature, layer) {
          layer.bindPopup(`<b>${feature.properties.agency} </b>Route ${feature.properties.route}<br>${feature.properties.route_name}`);
        }
      });
    transitroutes.on('data:loaded', function(){
      transitroutes.setStyle({CANVAS: true}).addTo(map);
    });

    // Layer control add here
    var baseMaps = {
      "Greyscale": greyscale_basemap,
      "OpenStreetMaps": streets_basemap,
    }
    var overlayMaps = {
      "Transit Routes": transitroutes,
    }
    // Create layers control panel, do not collapse into the layer icon
    L.control.layers(baseMaps, overlayMaps,
      {collapsed: false}
      ).addTo(map);

  }, [mapContainer]);

  return (
    <div className="map-container" ref={el => mapContainer = el}>
    </div>
  )
}

export default MyMap;