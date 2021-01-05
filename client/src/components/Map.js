import * as React from 'react';
import ReactMapGL, { NavigationControl, FullscreenControl, ScaleControl } from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';

//require('dotenv').config()
//import { DeckGL, GeoJsonLayer } from 'deck.gl';

function Map(props) {
    const [viewState, setViewState] = React.useState({
        longitude: -83.512322409556,
        latitude: 42.476398629668644,
        zoom: 9,
        pitch: 0,
        bearing: 0,
      });
    const handleChangeViewState = ({ viewState }) => setViewState(viewState);

    //Setting the dataset to retrieve. Use effect hook watches changes in states to execute
    const [dataindex, setDataindex] = React.useState(1) //Sets tileset index for matching with Mapbox tileset
    React.useEffect(() => {
        const ind = 1 +
            (props.peak ? 6 : 0) +
            (props.cutoff == '30' ? 0 : (props.cutoff == '45' ? 2 : 4)) +
            (props.perc == '50' ? 0 : 1)
        setDataindex(ind)
    }, [props.peak, props.cutoff, props.perc]);

    //Fetch API data for transit routes
    //need to set the initial state to a real GeoJSON format in order to get thing started properly
    const [transitData, setTransitData] = React.useState({
        type: 'FeatureCollection',
        features: []
      });
    //Use effect hook executes ONCE or listens for changes to the states listed in the []
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

    return (
    <ReactMapGL
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        mapboxApiAccessToken="pk.eyJ1Ijoia3NoZW4xMTEwIiwiYSI6ImNraDB5ZTJsOTAwZjgydnF4NzQ5Y2piM2cifQ.w85EWLCniHHEDOD-yZ-RnA"
        mapStyle={props.basemap}
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
                    'line-width': 2
                    }}
                layout={{'visibility': (props.transitvisible ? "visible" : "none")}}
            />
        </Source>
        <Source
            id="dot-density"
            type="vector"
            url="mapbox://kshen1110.results"
            >
            <Layer 
                id="dots-layer" 
                source="dot-density"
                source-layer= 'access'
                type="circle"
                paint= {{
                    /* very roundabout ways of selecting data within Mapbox expressions */
                    'circle-color': [
                        'match',
                        ['get','inc'],
                        'low',
                        [
                            'match',
                            ['get', 'res'+(dataindex+12)],
                            '1', '#ca0020',
                            '2', '#f4a582', 
                            '3', '#f7f7f7',
                            '4', '#92c5de',
                            '5', '#0571b0',
                            /* other */ '#ca0020'
                        ],
                        'high',
                        [
                            'match',
                            ['get', 'res'+dataindex],
                            '1', '#ca0020',
                            '2', '#f4a582', 
                            '3', '#f7f7f7',
                            '4', '#92c5de',
                            '5', '#0571b0',
                            /* other */ '#ca0020'
                        ],
                        '#FF69B4' /* mistakes will turn HOT PINK */
                    ],
                    'circle-opacity': 1 /*[
                        'match',
                        ['get', 'race'],
                        props.race, 1,
                        0
                    ]*/,
                    'circle-radius': { stops: [[8, 1], [9, 1.3], [10,1.7], [13, 2], [15, 4]] }
                    }}
                filter={[
                    'all', 
                    ['any',
                        ['==', 'inc', props.lowinc ? 'low' : ''],
                        ['==', 'inc', props.highinc ? 'high' : ''],
                    ],
                    ['any',
                        ['==', 'race', props.black ? 'black' : ''],
                        ['==', 'race', props.nonblack ? 'nonblack' : ''],
                    ]
                    ]}
            >
            </Layer>
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