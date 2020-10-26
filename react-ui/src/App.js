// This file compiles all the different parts of the UI layout
import React from 'react';
import './App.css';
import MyMap from './components/my-map';
import { Card, CardText, Button } from 'reactstrap';

// Set initial view
const initialViewState = {
  longitude: -83.0458,
  latitude: 42.3314,
  zoom: 8,
  pitch: 0,
  bearing: 0,
};

function App(){
  <div>  
    <MyMap>
    </MyMap>
  </div>

}

/*
function App() {
  // Using hooks here
  const [viewState, setViewState] = React.useState(initialViewState);
  const handleChangeViewState = ({ viewState }) => setViewState(viewState);

  // Actual output here
  return (
    <div className="map">
      <MyMap>
        width="100vw"
        height="100vh"
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
      </MyMap> 
      <Card className="footer">
          <CardText> Made with <span role="img" aria-label="love">💚</span> by <a href="http://workofthefuture.mit.edu" target="_blank" rel="noopener noreferrer">MIT WotF</a></CardText>
      </Card>
    </div>
  );
}
*/

//Export App to index.js
export default App;