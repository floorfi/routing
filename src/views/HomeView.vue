<template>

  <GeoErrorModal
    v-if="geoError"
    :geoErrorMsg="geoErrorMsg"
    @closeGeoError="closeGeoError"
  />
  <MapFeatures
    :fetchCoords="fetchCoords"
    :coords="coords"
    @toggleSearchResults="toggleSearchResults"
    @getGeolocation="getGeolocation"
    @plotResult="plotResult"
    @removeResult="removeResult"
    :searchResults="searchResults"
    class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]"
  />

  <stop-list/>

  <div id="mapid" class="h-full z-[1]"></div>

</template>

<script>
import { onMounted, ref, inject } from "vue";
import GeoErrorModal from "../components/GeoErrorModal.vue";
import MapFeatures from "../components/MapFeatures.vue";
import StopList from "./../components/StopList.vue";

import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';


export default {
  name: "HomeView",
  components: { GeoErrorModal, MapFeatures, StopList },
  setup() {
    const axios = inject('axios')  // inject axios
    onMounted(() => {
      // getGeolocation();

      // Mapbox GL
      mapboxgl.accessToken = "pk.eyJ1IjoiZmxvb3JmaSIsImEiOiJjbDJuYXBqZW4wdmJ4M2lua2F3OTF4NjFjIn0.alPFZ8niF6n98Iky2lEEJg";
      // eslint-disable-next-line no-unused-vars
      map = new mapboxgl.Map({
        container: "mapid",
        style: "mapbox://styles/floorfi/cl2ncj0b5005114n5kpqbddb1"
      });

      map.on('load', () => {
        getGeolocation();
      })
    });

    var map;
    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref(null);

    // eslint-disable-next-line no-unused-vars
    const getRoute  = (start,end) => {
      axios.get(`https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`)
          .then(response => {
            const data = response.data.routes[0];
            const route = data.geometry.coordinates;
            const geojson = buildFeature('LineString', route);
            // if the route already exists on the map, we'll reset it using setData
            if (map.getSource('route')) {
              map.getSource('route').setData(geojson);
            }
            // otherwise, we'll make a new request
            else {
              map.addLayer({
                'id': 'route',
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
              });
            }

            // get the sidebar and add the instructions
            const instructions = document.getElementById('instructions');
            const steps = data.legs[0].steps;

            let tripInstructions = '';
            for (const step of steps) {
              tripInstructions += `<li>${step.maneuver.instruction}</li>`;
            }
            instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
                data.duration / 60
            )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
          });
    }

    // eslint-disable-next-line no-unused-vars
    const addLayer = (id, coords, type) => {
      return map.addLayer({
        'id': id,
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [ buildFeature(type, coords) ]
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

    // Standort des Users holen und Pin auf Karte setzen
    const getGeolocation = () => {
      console.log(map);
      // if function is called, only run if we dont have coords
      if (!coords.value) {
        // check to see if we have coods in session sotrage
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords"));
          geoMarker.value = addMarker(coords.value);
          map.setCenter(coords.value);
          console.log(geoMarker.value)
          return;
        }

        // else get coords from geolocation API
        fetchCoords.value = true;
        navigator.geolocation.getCurrentPosition(setCoords, getLocError);
        return;
      }

      // otherwise, remove location
      coords.value = null;
      sessionStorage.removeItem("coords");
      geoMarker.value.remove();
    };

    const setCoords = (pos) => {
      // stop fetching
      fetchCoords.value = null;

      // set coords in session storage
      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

      // set ref coords value
      coords.value = setSessionCoords;

      geoMarker.value = addMarker(coords.value);
      map.setCenter(coords.value);

    };

    const getLocError = (error) => {
      // stop fetching coords
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };

    const resultMarker = ref(null);
    const plotResult = (coords) => {
      console.log(coords);
      // If there is already a marker, remove it. Only allow 1
      if (resultMarker.value) {
        map.removeLayer(resultMarker.value);
      }

      resultMarker.value = addMarker(coords.coordinates);
      // map.setView([coords.coordinates[1], coords.coordinates[0]], 13);
    };

    const removeResult = () => {
      map.removeLayer(resultMarker.value);
    };

    const closeGeoError = () => {
      geoErrorMsg.value = null;
      geoError.value = null;
    };

    const searchResults = ref(null);
    const toggleSearchResults = () => {
      searchResults.value = !searchResults.value;
    };
    const closeSearchResults = () => {
      searchResults.value = null;
    };

    return {
      geoError,
      closeGeoError,
      geoErrorMsg,
      fetchCoords,
      coords,
      getGeolocation,
      plotResult,
      searchResults,
      toggleSearchResults,
      closeSearchResults,
      removeResult,
    };
  },
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