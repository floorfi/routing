<template>
<div>
  <div
    class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
  >
    <!-- Search -->
    <location-search />
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
</div>

</template>

<script>
import { ref } from "vue";
import { useStore } from 'vuex'
import axios from "axios";
import LocationSearch from "./LocationSearch.vue";



export default {
  props: ["fetchCoords", "coords"],

  components: { LocationSearch },

  setup(props, { emit }) {
    const searchQuery = ref(null);
    const searchData = ref(null);
    const queryTimeout = ref(null);
    const selectedResult = ref(null);
    const store = useStore()

    const search = () => {
      clearTimeout(queryTimeout.value);

      // reset data on a new search
      searchData.value = null;
      queryTimeout.value = setTimeout(async () => {
        // Only make search, if there is value in query input
        if (searchQuery.value !== "") {
          const data = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?language=de&access_token=${process.env.VUE_APP_API_KEY}`);
          searchData.value = data.data.features;
        }
      }, 750);
    };

    const selectResult = (result) => {
      selectedResult.value = result;
      emit("plotResult", result.geometry);
      store.commit("addLocation", result);
    };

    const removeResult = () => {
      selectedResult.value = null;
      emit("removeResult");
    };



    return {
      searchQuery,
      search,
      searchData,
      selectResult,
      selectedResult,
      removeResult,
    };
  },
};
</script>
