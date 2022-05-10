<template>
  <div
      class="md:w-auto w-full absolute md:bottom-[20px] md:left-[20px] z-[2] bg-transparent flex"  v-if="stops.length"
  >
    <div v-for="stop in stops" v-bind:key="stop.id" class="w-[350px] mr-[8px] px-4 py-3 bg-white rounded-md">
      <i @click="removeResult" class="flex justify-end far fa-times-circle"></i>
      <h1 class="text-lg">{{ stop.text }}</h1>
      <p class="text-xs mb-1">
        {{ stop.place_name }}
      </p>
      <p class="text-xs">{{ stop.properties.category }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { reactive } from 'vue'



export default {

  setup(props, { emit }) {
    const store = useStore();
    const removeResult = () => {

      emit("removeResult");
    };


    const stops = reactive(store.state.locations)

    return {
      removeResult,
      stops,
    };
  },
};
</script>
