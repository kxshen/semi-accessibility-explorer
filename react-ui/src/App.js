// This file compiles all the different parts of the UI layout
import React from 'react';
import './App.css';
import MyMap from './components/my-map';
import { Card, CardText, Button } from 'reactstrap';

function App() {
  return (
    <div className="map">
      <MyMap />
      <Card className="footer">
          <CardText> Made with <span role="img" aria-label="love">💚</span> by <a href="http://workofthefuture.mit.edu" target="_blank" rel="noopener noreferrer">MIT WotF</a></CardText>
      </Card>
    </div>
  );
}

//Export App to index.js
export default App;