<template>
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
import { inject } from 'vue'

export default {
  setup() {
    const { getGeolocation, fetchCoords, coords } = inject('map')

    return {
      getGeolocation,
      fetchCoords,
      coords
    };
  },
};
</script>
