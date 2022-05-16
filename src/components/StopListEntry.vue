<template>
  <div class="relative">
    <div class="w-[350px] mt-[4px] px-3 pt-2 pb-6 bg-white rounded-md">
      <i @click="removeStep()" class="flex justify-end far fa-times-circle"></i>
      <p>{{ step.label }}</p>
    </div>
    <div v-if="route" class="absolute flex justify-center w-[220px] left-[65px] top-[-23px] p-2 bg-slate-200 rounded-md">
      {{ distance }} km
      <font-awesome-icon icon="car-side" />
      {{ travelTime }}
    </div>
  </div>

</template>

<script lang="ts">

import {computed, inject, onMounted, ref, Ref} from 'vue'
import { Route } from '@/models/route.model'

export default {
  props: ["step"],

  setup(props: any) {
    const stepService = inject('stepService') as any
    const routeService = inject('routeService') as any

    const route: Ref<Route|undefined> = ref();

    const removeStep = () => {
      stepService.removeStop(props.step.id)
    };

    const travelTime = computed((): string => {
      const seconds = route.value!.travelTime
      let hours = seconds / 3600;
      let mins = (seconds % 3600) / 60;


      hours = Math.trunc(hours);
      mins = Math.trunc(mins);


      if (!hours && !mins) {
        return "None";
      }

      if (hours) {
        if (mins) {
          return `${hours}:${mins} h`;
        } else {
          `${hours} h`;
        }
      } else {
        return `${mins} min`;
      }

      return ''

      // Alternative:
      // return moment.utc(seconds).format("HH:mm");
    })

    const distance = computed((): string => {
      let distanceInKm = route.value!.distance/1000
      return distanceInKm.toFixed(1);
    })

    onMounted(() => {
      route.value = routeService.getRouteByID(props.step.id);
    })

    return {
      removeStep,
      route,
      travelTime,
      distance
    };
  }
};
</script>
