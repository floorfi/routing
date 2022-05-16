<template>
  <GeoErrorModal
    v-if="geoError"
    :geoErrorMsg="geoErrorMsg"
    @closeGeoError="closeGeoError"
  />
  <div
    class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
    @click="getGeolocation"
    :class="{ 'bg-slate-600': coords }"
  >
    <font-awesome-icon icon="location-arrow" size="lg" class="'text-slate-600'" :class="{ 'text-white': coords, 'animate-pulse': fetchCoords }" />
  </div>
</template>

<script lang="ts">
import {inject, Ref, ref} from 'vue'
import GeoErrorModal from "../components/GeoErrorModal.vue";
import {Coords} from "@/models/coords.model";
import {Marker} from "mapbox-gl";


export default {
  components: { GeoErrorModal },

  setup() {
    const mapService = inject('mapService') as any

    const coords: Ref<Coords|null> = ref(null);
    const fetchCoords = ref(false);
    const geoMarker: Ref<Marker|null> = ref(null);
    const geoError = ref(false);
    const geoErrorMsg = ref(null);

    // Standort des Users holen und Pin auf Karte setzen
    const getGeolocation = () => {
      // if function is called, only run if we dont have coords
      if (!coords.value) {
        // check to see if we have coods in session sotrage
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords")!);
          geoMarker.value = mapService.addMarker(coords.value, true);
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
      if(geoMarker.value){
        geoMarker.value.remove();
      }
    };

    const setCoords = (pos: any) => {
      // stop fetching
      fetchCoords.value = false;

      // set coords in session storage
      const setSessionCoords: Coords = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

      // set ref coords value
      coords.value = setSessionCoords;

      geoMarker.value = mapService.addMarker(coords.value, true);

    };

    const getLocError = (error: any) => {
      // stop fetching coords
      fetchCoords.value = false;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };

    
    const closeGeoError = () => {
      geoErrorMsg.value = null;
      geoError.value = false;
    };

    return {
      getGeolocation,
      geoError,
      geoErrorMsg,
      closeGeoError,
      fetchCoords,
      coords
    };
  },
};
</script>
