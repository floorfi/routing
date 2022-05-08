
<template>
  <div class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent">
    <!-- Search -->
    <div class="relative flex-1 md:min-w-[350px]">
      <!-- Search Input -->
      <input
        class="pl-9 pr-4 py-3 text-[14px] focus:outline-none w-full shadow-md rounded-md"
        type="text"
        placeholder="Start your search..."
        v-model="searchQuery"
        @input="search"
        @focus="$emit('toggleSearchResults')"
      />
      <!-- Search Icon -->
      <div class="absolute top-0 left-[8px] h-full flex items-center">
        <i class="fas fa-search"></i>
      </div>
      <!-- Search Results -->
      <div class="absolute mt-[8px] w-full">
        <!-- Search Queries -->
        <div
          v-if="searchQuery && searchResults"
          class="bg-white rounded-md"
        >
          <!-- Loading Spinner -->
          <LoadingSpinner v-if="!searchData" />
          <!-- Display Results -->
          <div v-else>
            <div
              class="px-4 py-2 flex gap-x-2 cursor-pointer hover:rounded-md hover:bg-slate-600 hover:text-white"
              v-for="(result, index) in searchData"
              :key="index"
              @click="selectResult(result)"
            >
              <i class="fas fa-map-marker-alt"></i>
              <p class="text-[12px]">{{ result.place_name }}</p>
            </div>
          </div>
        </div>
        <!-- Selected Search Result -->
        <div v-if="selectedResult" class="mt-[8px] px-4 py-3 bg-white rounded-md">
          <i @click="removeResult" class="flex justify-end far fa-times-circle"></i>
          <h1 class="text-lg">{{ selectedResult.text }}</h1>
          <p class="text-xs mb-1">
            {{ selectedResult.place_name }}
          </p>
          <p class="text-xs">{{ selectedResult.properties.category }}</p>
        </div>
      </div>
    </div>
    <!-- Geolocation -->
    <div
      class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
      @click="$emit('getGeolocation')"
      :class="{ 'bg-slate-600': coords }"
    >
      <i
        class="fas fa-location-arrow 'text-slate-600' text-[18px]"
        :class="{ 'text-white': coords, 'animate-pulse': fetchCoords }"
      ></i>
    </div>
  </div>
  <div id="map"></div>
  <div id="instructions"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { inject, ref } from 'vue'
import { onMounted } from "vue";

export default {
  setup() {
    var map;
    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
        const geoError = ref(null);
    const geoErrorMsg = ref(null);
    const axios = inject('axios')  // inject axios
    const start = [-122.662323, 45.523751];

    mapboxgl.accessToken = "pk.eyJ1IjoiZmxvb3JmaSIsImEiOiJjbDJuYXBqZW4wdmJ4M2lua2F3OTF4NjFjIn0.alPFZ8niF6n98Iky2lEEJg";

    onMounted(() => {
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/floorfi/cl2ncj0b5005114n5kpqbddb1"
      });

      map.on('load', () => {
        getGeolocation();


        // make an initial directions request that
        // starts and ends at the same location
        getRoute(start);

        // Add destination to the map
        addLayer('start', map, start);

        // allow the user to click the map to change the destination
        map.on('click', (event) => {
          const coords = Object.keys(event.lngLat).map(
            (key) => event.lngLat[key]
          );
          const end = {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                  'type': 'Point',
                  'coordinates': coords
                }
              }
            ]
          };
          if (map.getLayer('end')) {
            map.getSource('end').setData(end);
          } else {
            addLayer('end', map, coords);
          }
          getRoute(coords);
        });
      });


      const getRoute  = end => {
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

      const addLayer = (id, map, coords) => {
        map.addLayer({
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


    // Standort des Users holen und Pin auf Karte setzen
    const getGeolocation = () => {
      console.log(map);
      // if function is called, only run if we dont have coords
      if (!coords.value) {
        // check to see if we have coods in session sotrage
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords"));
          geoMarker.value = addLayer('loc', map, coords.value);
          // geoMarker.value = addMarker(coords.value);
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

      // geoMarker.value = addMarker(coords.value);
          geoMarker.value = addLayer('loc', map, coords.value);

      map.setCenter(coords.value);

    };

    const getLocError = (error) => {
      // stop fetching coords
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };


    });
  },

  mounted() {
    
  }
};
</script>

<style>
      body {
        margin: 0;
        padding: 0;
      }
      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
      #instructions {
        position: absolute;
        margin: 20px;
        width: 25%;
        top: 100px;
        bottom: 20%;
        padding: 20px;
        background-color: #fff;
        overflow-y: scroll;
        font-family: sans-serif;
      }
</style>