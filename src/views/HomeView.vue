<template>
  <MapFeatures class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]" />

  <stop-list/>

  <div id="mapid" class="h-full z-[1]"></div>

</template>

<script lang="ts">
import { onMounted, provide, inject, getCurrentInstance } from "vue";
import MapFeatures from "../components/MapFeatures.vue";
import StopList from "./../components/StopList.vue";

import mapboxgl, {CustomLayerInterface, Marker} from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapBoxDataService from "@/api/mapbox";
import {Route} from "@/models/route.model";
import {Coords} from "@/models/coords.model";
import {Location} from "@/models/location.model";

export default {
  name: "HomeView",
  components: { MapFeatures, StopList },

  setup() {
    const mapService = inject('mapService') as any
    console.log(mapService)
    //
    // let map = getCurrentInstance()!.appContext.config.globalProperties.$map;
    //
    // const getRoute = (locationA: Location, locationB: Location): Promise<Route> => {
    //   const coords: Coords[] = [];
    //   console.log(locationA)
    //
    //   coords.push(locationA.coords)
    //   coords.push(locationB.coords)
    //   console.log(coords)
    //   return new Promise(resolve => {
    //     MapBoxDataService.getRoute(coords)
    //         .then(response => {
    //           console.log(response)
    //           const data = response.data.routes[0];
    //           const route = data.geometry.coordinates;
    //           const geojson = buildFeature('LineString', route);
    //
    //           // if the route.ts already exists on the map, we'll reset it using setData
    //           if (map.getSource(locationB.id)) {
    //             console.log(map.getSource(locationB.id).setData(geojson))
    //             map.getSource(locationB.id).setData(geojson);
    //           }
    //           // otherwise, we'll make a new request
    //           else {
    //             addLayerRoute(locationB.id, geojson);
    //           }
    //
    //           resolve(
    //             {
    //               id: locationB.id,
    //               travelTime: data.duration,
    //               waypoints: route
    //             }
    //           )
    //         });
    //   })
    // }
    //
    // const addLayerRoute = (id: string, geojson: object) => {
    //   const layerObj: object = {
    //     'id': id,
    //     'type': 'line',
    //     'source': {
    //       'type': 'geojson',
    //       'data': geojson
    //     },
    //     'layout': {
    //       'line-join': 'round',
    //       'line-cap': 'round'
    //     },
    //     'paint': {
    //       'line-color': '#3887be',
    //       'line-width': 5,
    //       'line-opacity': 0.75
    //     }
    //   }
    //   return map.addLayer(layerObj)
    // }
    //
    // // eslint-disable-next-line no-unused-vars
    // const addLayerPoint = (id: string, coords: Coords) => {
    //   return map.addLayer({
    //     'id': id,
    //     'type': 'circle',
    //     'source': {
    //       'type': 'geojson',
    //       'data': {
    //         'type': 'FeatureCollection',
    //         'features': [ buildFeature('Point', coords) ]
    //       }
    //     },
    //     'paint': {
    //       'circle-radius': 10,
    //       'circle-color': '#f30'
    //     }
    //   });
    // }
    //
    // const buildFeature = (type: string, coords: Coords) => {
    //   return {
    //     'type': 'Feature',
    //     'properties': {},
    //     'geometry': {
    //       'type': type,
    //       'coordinates': coords
    //     }
    //   }
    // }
    //
    // const removeLayer = (id: string) => {
    //   if(map.getLayer(id)) {
    //     map.removeLayer(id)
    //     map.removeSource(id)
    //   }
    // }
    //
    // // Mapbox Marker hinzufügen und ggf. fokussieren
    // const addMarker = (coords: Coords, setFocus: boolean) => {
    //   const marker = new mapboxgl.Marker({
    //     color: "#FFFFFF",
    //     draggable: true
    //   }).setLngLat(convertCoordsToNumbers(coords))
    //       .addTo(map);
    //
    //   if(setFocus) {
    //     centerMap(coords)
    //     zoomIn()
    //   }
    //   return marker
    // }
    //
    // const removeMarker = (marker: Marker) => {
    //   marker.remove();
    // }
    //
    // const centerMap = (coords: Coords) => {
    //   map.setCenter(convertCoordsToNumbers(coords));
    // }
    //
    // const zoomIn = () => {
    //   map.zoomTo(5);
    // }
    //
    // const convertCoordsToNumbers = (coords: Coords): number[] => {
    //   return [coords.latitude, coords.longitude]
    // }
    // const convertNumbersToCoords = (coords: number[]): Coords => {
    //   return {
    //     latitude: coords[0],
    //     longitude: coords[1]
    //   }
    // }

    onMounted(() => {
      mapService.initiateMap()
      // Mapbox GL
      // mapboxgl.accessToken = process.env.VUE_APP_API_KEY;
      // map = new mapboxgl.Map({
      //   container: "mapid",
      //   // style: "mapbox://styles/floorfi/cl2ncj0b5005114n5kpqbddb1"
      //   style: "mapbox://styles/mapbox/outdoors-v11"
      //   // style: "mapbox://styles/mapbox/satellite-streets-v11"
      //
      // });
      //
      // map.on('load', () => {
      //
      // })
    });


    // provide('addMarker', addMarker)
    // provide('removeMarker', removeMarker)
    // provide('removeLayer', removeLayer)
    // provide('centerMap', centerMap)
    // provide('zoomIn', zoomIn)
    // provide('getRoute', getRoute)
    // provide('convertCoordsToNumbers', convertCoordsToNumbers)
    // provide('convertNumbersToCoords', convertNumbersToCoords)
    //
    // return{
    //
    // }
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