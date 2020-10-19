import L from 'leaflet'
import {} from 'mapbox-gl-leaflet'
import {GridLayer, withLeaflet} from 'react-leaflet'

import {MB_TOKEN} from 'lib/constants'

const attribution = `© <a href='https://www.mapbox.com/about/maps/'>MapboxHELLO?</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>`
const defaultStyle =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'conveyal/cjwu7oipd0bf41cqqv15huoim'
const getStyle = (style = defaultStyle) => `mapbox://styles/${style}`

class MapBoxGLLayer extends GridLayer {
  componentDidUpdate() {
    if (this.leafletElement && this.leafletElement._glMap) {
      this.leafletElement._glMap.resize()
    }
  }

  createLeafletElement(props) {
    const glLayer = (window.MapboxGLLayer = L.mapboxGL({
      accessToken: 'no-token', // MB_TOKEN,
      attribution,
      interactive: false,
      pane: props.leaflet.map._panes.tilePane,
      style: 'https://api.maptiler.com/maps/positron/style.json?key=exZ5EI9ZzPeWj7DkSjKi' // USE OPEN SOURCE POSITRON, go to MapTiler.com for a free key instead of getStyle(props.style). 800 views max with free
    }))
    return glLayer
  }
}

export default withLeaflet(MapBoxGLLayer)
