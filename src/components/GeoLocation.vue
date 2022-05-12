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
    <i
      class="fas fa-location-arrow 'text-slate-600' text-[18px]"
      :class="{ 'text-white': coords, 'animate-pulse': fetchCoords }"
    ></i>
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import GeoErrorModal from "../components/GeoErrorModal.vue";


export default {
  components: { GeoErrorModal },
  setup() {
    const addMarker = inject('addMarker');
    const centerMap = inject('centerMap');

    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref(null);

    // Standort des Users holen und Pin auf Karte setzen
    const getGeolocation = () => {
      // if function is called, only run if we dont have coords
      if (!coords.value) {
        // check to see if we have coods in session sotrage
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords"));
          geoMarker.value = addMarker(coords.value);
          centerMap(coords.value);
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
      centerMap(coords.value);

    };

    const getLocError = (error) => {
      // stop fetching coords
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };

    
    const closeGeoError = () => {
      geoErrorMsg.value = null;
      geoError.value = null;
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
