// Use App.js as integrating components
import * as React from 'react';
import './App.css';
import Map from './components/Map';
import { Card, CardText } from 'reactstrap';


function App() {
  return (
    <div>
      <Map></Map>
      <Card className="footer">
          <CardText> Made with <span role="img" aria-label="love">💚</span> by <a href="http://workofthefuture.mit.edu" target="_blank" rel="noopener noreferrer">MIT WotF</a></CardText>
      </Card>
    </div>

  );
}

//Export App to index.js
export default App;
