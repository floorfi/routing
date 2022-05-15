<template>
  <div class="relative">
    <div class="w-[350px] mt-[8px] px-4 py-3 bg-white rounded-md">
      <i @click="removeStep()" class="flex justify-end far fa-times-circle"></i>
      <p>{{ step.label }}</p>
    </div>
    <div v-if="correspondingRoute" class="absolute w-[200px] left-[75px] top-[-10px] p-2 bg-white rounded-md">
      {{ (correspondingRoute.travelTime/60/60) }} Stunden
    </div>
  </div>

</template>

<script lang="ts">

import {computed, inject} from 'vue'
import { Route } from '@/models/route.model'

export default {
  props: ["step"],

  setup(props: any) {
    const stepService = inject('stepService') as any
    const routeService = inject('routeService') as any

    const removeStep = () => {
      stepService.removeStop(props.step.id)
    };

    const correspondingRoute = computed((): Route|undefined => {
      console.log(routeService.getRouteByID(props.step.id))
      return routeService.getRouteByID(props.step.id);
    })

    return {
      removeStep,
      correspondingRoute
    };
  }
};
</script>
