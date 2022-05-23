import mapboxgl, {
    AnyLayer,
    AnySourceData,
    CircleLayer,
    GeoJSONSource,
    GeoJSONSourceRaw,
    LineLayer,
    Marker
} from "mapbox-gl";
import {Coords} from "@/models/coords.model";
import {Map} from 'mapbox-gl'
import {FeatureCollection} from 'geojson'
import {MapboxStyleDefinition, MapboxStyleSwitcherControl, MapboxStyleSwitcherOptions} from "mapbox-gl-style-switcher";

const styles: MapboxStyleDefinition[] = [
    {
        title: "Standard",
        uri:"mapbox://styles/floorfi/cl2ncj0b5005114n5kpqbddb1"
    },
    {
        title: "Light",
        uri:"mapbox://styles/mapbox/light-v9"
    },
    {
        title: "Outdoor",
        uri:"mapbox://styles/mapbox/outdoors-v11"
    }
];

const state = {
    map: {} as Map
}

const addLayerRoute = (id: string, geojson: FeatureCollection) => {
    // if the id already exists on the map, we'll reset it using setData
    if (state.map.getSource(id)) {
        const source: GeoJSONSource = state.map.getSource(id) as GeoJSONSource
        source.setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
        const geoJsonSource: any = {
            'type': 'geojson',
            'data': geojson
        }

        const layerObj: LineLayer = {
            'id': id,
            'type': 'line',
            'source': geoJsonSource,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
            }
        }

        state.map.addLayer(layerObj)
    }

}

// eslint-disable-next-line no-unused-vars
const addLayerPoint = (id: string, coords: Coords): Map => {
    const layer: CircleLayer = {
        'id': id,
        'type': 'circle',
        'source': buildGeoJsonSource(coords),
        'paint': {
            'circle-radius': 10,
            'circle-color': '#f30'
        }
    }
  return state.map.addLayer(layer);
}

const buildGeoJsonSource = (coords: Coords): GeoJSONSource => {
    const featureCollection: FeatureCollection = {
        'type': 'FeatureCollection',
        'features': [buildFeature('Point', coords)]
    }
    return new GeoJSONSource({
        'data': featureCollection
    })
}

const buildFeature = (type: string, coords: Coords): any => {
  return {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'type': type,
      'coordinates': coords
    }
  }
}

const removeLayer = (id: string) => {
  if(state.map.getLayer(id)) {
    state.map.removeLayer(id)
    state.map.removeSource(id)
  }
}

// Mapbox Marker hinzufügen und ggf. fokussieren
const addMarker = (coords: Coords, setFocus: boolean) => {
  const marker = new mapboxgl.Marker({
    color: "#FFFFFF",
    draggable: true
  }).setLngLat(coords)
      .addTo(state.map);

  if(setFocus) {
    centerMap(coords)
    zoomIn()
  }
  return marker
}

const removeMarker = (marker: Marker) => {
  marker.remove();
}

const centerMap = (coords: Coords) => {
  state.map.setCenter(coords);
}

const zoomIn = () => {
    if(state.map) {
        state.map.zoomTo(5);
    }
}

const convertCoordsToNumbers = (coords: Coords): number[] => {
  return [coords.lat, coords.lon]
}

const convertNumbersToCoords = (coords: number[]): Coords => {
  return {
    lon: coords[0],
    lat: coords[1]
  }
}

const initiateMap = () => {
    mapboxgl.accessToken = process.env.VUE_APP_API_KEY;
    state.map = new mapboxgl.Map({
      container: "mapid",
      style: styles.find(style=>style.title==='Standard')!.uri
    });

    const options: MapboxStyleSwitcherOptions = {
        defaultStyle: "Standard"
    };

    state.map.addControl(new MapboxStyleSwitcherControl(styles, options));

    state.map.on('load', () => {

    })
}

export default {
    addLayerPoint,
    addLayerRoute,
    removeLayer,
    addMarker,
    removeMarker,
    buildFeature,
    centerMap,
    convertCoordsToNumbers,
    convertNumbersToCoords,
    initiateMap
}