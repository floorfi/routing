<template>
  <!-- Search -->
  <div class="relative flex-1 md:min-w-[350px]">
    <!-- Search Input -->
    <input
      class="pl-9 pr-4 py-3 text-[14px] focus:outline-none w-full shadow-md rounded-md"
      type="text"
      placeholder="Start your search..."
      v-model="searchQuery"
      @input="search"
      @focus="toggleSearchResults"
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
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from 'vuex'
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";



export default {
  props: ["fetchCoords", "coords"],

  components: { LoadingSpinner },

  setup(props, { emit }) {
    const searchQuery = ref(null);
    const searchData = ref(null);
    const queryTimeout = ref(null);
    const selectedResult = ref(null);
    const store = useStore()
    const searchResults = ref(null);

    const toggleSearchResults = () => {
      console.log('toggle')
      searchResults.value = !searchResults.value;
    };

    const search = () => {
      clearTimeout(queryTimeout.value);

      // reset data on a new search
      searchData.value = null;
      queryTimeout.value = setTimeout(async () => {
        // Only make search, if there is value in query input
        if (searchQuery.value !== "") {
          const data = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?language=de&access_token=${process.env.VUE_APP_API_KEY}`);
          searchData.value = data.data.features;
          console.log(searchData);
        }
      }, 750);
    };

    const selectResult = (result) => {
      console.log(result);
      selectedResult.value = result;
      emit("plotResult", result.geometry);
      store.commit("addLocation", result);
    };

    const closeSearchResults = () => {
      searchResults.value = null;
    };


    return {
      searchQuery,
      search,
      searchResults,
      searchData,
      selectResult,
      selectedResult,
      closeSearchResults,
      toggleSearchResults,
    };
  },
};
</script>
