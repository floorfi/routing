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
        v-if="searchQuery && showSearchResults"
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

<script lang="ts">
import { ref, inject } from "vue";
import {Store, useStore} from 'vuex'
import axios from "axios";
import MapBoxDataService from "../api/mapbox"
import LoadingSpinner from "./LoadingSpinner.vue";
import {Ref} from "vue";

export default {
  props: ["fetchCoords", "coords"],

  components: { LoadingSpinner },

  setup(props: any, {emit}: any) {
    const getRoute = inject('getRoute') as Function;

    const searchQuery: Ref<string|null> = ref(null);
    const searchData: Ref<string|null> = ref(null);
    const queryTimeout: Ref<number|undefined> = ref();
    const store: Store<any> = useStore()
    const showSearchResults: Ref<boolean> = ref(false);

    const toggleSearchResults = () => {
      showSearchResults.value = !showSearchResults.value;
    };

    const search = (): void => {
      if(queryTimeout.value) {
        clearTimeout(queryTimeout.value);
      }

      // reset data on a new search
      searchData.value = null;
      queryTimeout.value = setTimeout(async () => {
        // Only make search, if there is value in query input
        if (searchQuery.value) {
          MapBoxDataService.getSearchResults(searchQuery.value)
              .then(result => {
                searchData.value = result.data.features;
              })
        }
      }, 750);
    };

    const selectResult = (result: any): void => {
      store.commit("addLocation", result);

      if(store.state.locations.length > 1) {
        let coords: any = [];
        store.state.locations.forEach((location: any) => {
          coords.push(location.geometry.coordinates)
        });
        getRoute(coords)
      }
    };

    const closeSearchResults = () => {
      showSearchResults.value = false;
    };


    return {
      searchQuery,
      search,
      showSearchResults,
      searchData,
      selectResult,
      closeSearchResults,
      toggleSearchResults,
    };
  },
};
</script>
