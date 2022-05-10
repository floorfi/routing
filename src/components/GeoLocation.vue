<template>
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
</template>

<script>
export default {
  props: ["fetchCoords", "coords"],

  setup() {

    return {};
  },
};
</script>
