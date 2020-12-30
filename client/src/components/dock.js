import React from 'react'

//import message from '../message'

import Icon from './icon'

export default function Dock(props) {
  return (
    <div className="Dock">
      <div className="Dock-content">
        <div className="title">
          <Icon icon="map" /> Detroit Accessibility
        </div>
        {props.componentError && (
          <div>
            <h1>Error</h1>
            <p>{props.componentError.info}</p>
          </div>
        )}
        {props.children}
      </div>
    </div>
  )
}