<template>
  <div class="relative">
    <div class="w-[350px] mt-[4px] px-3 pt-2 pb-6 bg-white rounded-md">
      <font-awesome-icon @click="removeStep()" icon="times-circle" class="flex justify-end" />
      <p>{{ step.label }}</p>
      <p>{{ startTime }}</p>
    </div>
    <div v-if="route" class="absolute flex justify-center w-[220px] left-[65px] top-[-23px] p-2 bg-slate-200 rounded-md">
      {{ distance }} km
      <font-awesome-icon icon="car-side" />
      {{ travelTime }} h
    </div>
  </div>

</template>

<script lang="ts">

import {computed, inject, onMounted, ref, Ref} from 'vue'
import { Route } from '@/models/route.model'
import moment from "moment";

export default {
  props: ["step", "first"],

  setup(props: any) {
    const stepService = inject('stepService') as any
    const routeService = inject('routeService') as any
    const locationService = inject('locationService') as any
    const travelConfigService = inject('travelConfigService') as any

    const route: Ref<Route|undefined> = ref();

    const removeStep = () => {
      stepService.removeStop(props.step.id)
    };

    const travelTime = computed((): string => {
      const seconds = route.value!.travelTime
      return moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("H:mm");
    })

    const startTime = computed((): string => {
      if(!route.value) {
        return travelConfigService.state.config.start.format('DD.MM.YYYY HH:mm')
      } else {
        return travelConfigService.state.config.start.add(locationService.getTravelDistanceToLocation(props.step.id), 'seconds').format('DD.MM.YYYY HH:mm')
      }
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
      startTime,
      distance
    };
  }
};
</script>
