<template>
  <MapFeatures class="w-full md:w-auto absolute md:top-[20px] md:left-[20px] z-[2]" />

  <stop-list/>

  <travel-config/>

  <div id="mapid" class="h-full z-[1]"></div>

</template>

<script lang="ts">
import { onMounted, inject } from "vue";
import MapFeatures from "../components/MapFeatures.vue";
import StopList from "./../components/StopList.vue";

import 'mapbox-gl/dist/mapbox-gl.css';
import "mapbox-gl-style-switcher/styles.css";

import TravelConfig from "@/components/TravelConfig.vue";

export default {
  name: "HomeView",
  components: {TravelConfig, MapFeatures, StopList },

  setup() {
    const mapService = inject('mapService') as any

    onMounted(() => {
      mapService.initiateMap()
    });
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