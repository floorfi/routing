<template>
  <MapFeatures class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]" />

  <stop-list/>

  <div id="mapid" class="h-full z-[1]"></div>

</template>

<script>
import { onMounted, provide, inject, getCurrentInstance } from "vue";
import MapFeatures from "../components/MapFeatures.vue";
import StopList from "./../components/StopList.vue";

import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapBoxDataService from "@/api/mapbox";


export default {
  name: "HomeView",
  components: { MapFeatures, StopList },

  setup() {
    let map = getCurrentInstance().appContext.config.globalProperties.$map;

    const getRoute  = (coords) => {

      MapBoxDataService.getRoute(coords)
        .then(response => {
            const data = response.data.routes[0];
            const route = data.geometry.coordinates;
            const geojson = buildFeature('LineString', route);
            // if the route already exists on the map, we'll reset it using setData
            console.log(map);

            if (map.getSource('route')) {
              map.getSource('route').setData(geojson);
            }
            // otherwise, we'll make a new request
            else {
              addLayerRoute('route', geojson);
            }
          });
    }

    const addLayerRoute = (id, geojson) => {
      return map.addLayer({
        'id': id,
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': geojson
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      })
    }

    // eslint-disable-next-line no-unused-vars
    const addLayerPoint = (id, coords, type) => {
      return map.addLayer({
        'id': id,
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [ buildFeature('Point', coords) ]
          }
        },
        'paint': {
          'circle-radius': 10,
          'circle-color': '#f30'
        }
      });
    }

    const buildFeature = (type, coords) => {
      return {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': type,
          'coordinates': coords
        }
      }
    }

    // Mapbox Marker hinzufügen
    const addMarker = (coords) => {
      return new mapboxgl.Marker({
        color: "#FFFFFF",
        draggable: true
      }).setLngLat(coords)
          .addTo(map);
    }

    const centerMap = (coords) => {
      map.setCenter(coords);
    }


    onMounted(() => {
      // Mapbox GL
      mapboxgl.accessToken = process.env.VUE_APP_API_KEY;
      map = new mapboxgl.Map({
        container: "mapid",
        // style: "mapbox://styles/floorfi/cl2ncj0b5005114n5kpqbddb1"
        style: "mapbox://styles/mapbox/outdoors-v11"
        // style: "mapbox://styles/mapbox/satellite-streets-v11"

      });

      map.on('load', () => {

      })
    });

    provide('addMarker', addMarker)
    provide('centerMap', centerMap)
    provide('getRoute', getRoute)
  }
};
</script>

<style>
      body {
        margin: 0;
        padding: 0;
      }
      #mapid {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
</style>