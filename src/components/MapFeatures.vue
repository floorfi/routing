<template>
  <div
    class="w-full md:w-auto absolute md:top-[20px] md:left-[20px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
  >
    <!-- Search -->
    <location-search />
    <!-- Geolocation -->
    <geo-location />

  </div>
</template>

<script>
import LocationSearch from "./LocationSearch.vue";
import GeoLocation from "./GeoLocation.vue";

export default {
  components: { LocationSearch, GeoLocation },
};
</script>
