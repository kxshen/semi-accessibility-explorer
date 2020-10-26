import * as React from 'react';
import ReactMapGL, { NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';
//import { DeckGL, GeoJsonLayer } from 'deck.gl';

function Map() {
    const [viewState, setViewState] = React.useState({
        longitude: -83.0458,
        latitude: 42.3314,
        zoom: 8,
        pitch: 0,
        bearing: 0,
      });
    const handleChangeViewState = ({ viewState }) => setViewState(viewState);

    //Fetch API data for transit routes
    //need to set the initial state to a real GeoJSON format in order to get thing started properly
    const [transitData, setTransitData] = React.useState({
        type: 'FeatureCollection',
        features: []
      });

    React.useEffect(() => {
            getData();
    }, []);

    async function getData() {
        const res = await fetch('/api/maplayers')  
        const data = await res.json();
        console.log('Loaded data', data)
        //transform the geojson to get rid of the _id thing that makes it invalid?
        const transform = await data.map(shape => {
            return {
                type: shape.type,
                geometry: {
                    type: shape.geometry.type,
                    coordinates: shape.geometry.coordinates,
                },
                properties: {
                    shape_id: shape.properties.shape_id,
                    route: shape.properties.route,
                    agency: shape.properties.agency,
                    route_name: shape.properties.route_name,
                }
            }
        });
        const feature_collection = await {
            type: 'FeatureCollection',
            features: transform
        }
        setTransitData(feature_collection)
    }

/*      const layers = [
        new GeoJsonLayer({
            id: 'transit_routes',
            data: 'api/maplayers',
            lineWidthMinPixels: 1,
            getLineColor: [0, 0, 0, 20],
          })
    ]  */

    return (
    <ReactMapGL
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=exZ5EI9ZzPeWj7DkSjKi&optimize=true"
    >

        <Source 
            id="transit-routes" 
            type="geojson" 
            data={transitData}>
            <Layer 
                id="transit-layer" 
                type="line" 
                paint= {{
                    'line-color': [
                        'match',
                        ['get', 'agency'],
                        'AAATA', '#043A80',
                        'SMART', '#ED594D', 
                        'DDOT', '#024547',
                        /* other */ '#ccc'
                    ],
                    'line-opacity': 0.5,
                    'line-width': 4
                    }}
            />
        </Source>
{/*         <DeckGL viewState={viewState} layers={layers} />
 */}
        <div style={{position: 'absolute', right: '5px', top: '5px'}}>
            <NavigationControl />
            <FullscreenControl container={document.querySelector('body')}/>
        </div>
        <div style={{position: 'absolute', right: '5px', bottom: '20px'}}>
            <ScaleControl maxWidth={100} unit={"metric"}/>
        </div>
        </ReactMapGL>
    );
}

export default Map;