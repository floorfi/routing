
<template>
  <router-view />
</template>

<style></style>

<script lang="ts">
import map from "@/services/map"
import step from "@/services/step"
import location from "@/services/location"
import route from "@/services/route"
import travelConfig from "@/services/travelConfig"
import {provide} from "vue";

export default {
  setup() {
    provide('mapService', map)
    provide('stepService', step)
    provide('locationService', location)
    provide('routeService', route)
    provide('travelConfigService', travelConfig)
  }
}
</script>