<template>
  <div class="relative">
    <div class="w-[350px] mt-[4px] px-3 pt-5 pb-6 bg-white rounded-md">
      <font-awesome-icon @click="removeStep()" icon="times-circle" class="absolute right-[5px]" />
      <p>{{ step.label }}</p>
      <p>{{ startTime }}</p>
    </div>
    <div v-if="route" class="absolute flex justify-center w-[220px] left-[65px] top-[-23px] p-2 bg-slate-200 rounded-md">
      {{ distance }} km
      <font-awesome-icon icon="car-side" class="mt-[5px] mx-[10px]" />
      {{ travelTime }} h
    </div>
  </div>

</template>

<script lang="ts">

import {computed, inject, onMounted, ref, Ref, watch} from 'vue'
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
      const startTime = moment.utc(JSON.parse(JSON.stringify(travelConfigService.state.config.start)))
      if(!route.value) {
        return startTime.format('DD.MM.YYYY HH:mm')
      } else {
        const addDuration = locationService.getTravelDistanceToLocation(props.step.id)
        return startTime.add(addDuration, 'seconds').format('DD.MM.YYYY HH:mm')
      }
    })

    const distance = computed((): string => {
      let distanceInKm = route.value!.distance/1000
      return distanceInKm.toFixed(1);
    })

    onMounted(() => {
      route.value = routeService.getRouteByID(props.step.id);
    })

    // Folgende beiden, um bei Änderungen die Route für diesen Step zu aktualisieren
    const correspondingRoute = computed((): Route => {
      return routeService.state.routes.find((route:Route)=>route.id===props.step.id);
    })
    watch(correspondingRoute, (newValue: Route) => {
      route.value = newValue;
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
