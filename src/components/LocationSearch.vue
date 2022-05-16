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
import {Location} from "@/models/location.model";
import {Route} from "@/models/route.model";
import {Step} from "@/models/step.model";

export default {
  components: { LoadingSpinner },

  setup() {
    const stepService = inject('stepService') as any
    const locationService = inject('locationService') as any
    const mapService = inject('mapService') as any
    const routeService = inject('routeService') as any

    const searchQuery: Ref<string|null> = ref(null);
    const searchData: Ref<string|null> = ref(null);
    const queryTimeout: Ref<number|undefined> = ref();
    const showSearchResults: Ref<boolean> = ref(false);

    const toggleSearchResults = () => {
      showSearchResults.value = !showSearchResults.value;
    };

    const search = (): void => {
      if(queryTimeout.value) {
        clearTimeout(queryTimeout.value);
      }

      searchData.value = null;
      queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value) {
          MapBoxDataService.getSearchResults(searchQuery.value)
              .then(result => {
                searchData.value = result.data.features;
              })
        }
      }, 750);
    };

    const selectResult = (result: any): void => {
      // Ggf. vorhandene vorherige Location holen
      let previousLocation: Location|undefined;
      if(locationService.state.locations.length > 0) {
        previousLocation = locationService.state.locations[locationService.state.locations.length - 1];
      }

      // Neue Location ablegen + Marker setzen
      let coords = mapService.convertNumbersToCoords(result.geometry.coordinates)
      let marker = mapService.addMarker(coords, true)
      let location: Location = {
        id: result.id,
        label: result.text_de,
        coords: coords,
        marker: marker
      }
      locationService.addLocation(location);

      if(previousLocation) {
        routeService.getRoute(previousLocation, location).then((route: Route) => {
          console.log(route)
          routeService.addRoute(route);

          let step: Step = {
            id: location.id,
            label: location.label,
            orderID: 1
          }
          stepService.addStep(step);
          console.log('fertig hinzugefügt')

        })
      } else {
        let step: Step = {
          id: location.id,
          label: location.label,
          orderID: 1
        }
        stepService.addStep(step);
        console.log('fertig hinzugefügt')

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
