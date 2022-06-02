<template>
  <div class="relative">
    <div class="w-[350px] mt-[4px] px-3 pt-5 pb-6 bg-white rounded-md" @click="modalOpen = true" >
      <p>{{ currentStep.label }}</p>
      <p>{{ startTime }}</p>
    </div>
    <div v-if="route" class="absolute flex justify-center w-[220px] left-[65px] top-[-23px] p-2 bg-slate-200 rounded-md">
      {{ distance }} km
      <font-awesome-icon icon="car-side" class="mt-[5px] mx-[10px]" />
      {{ travelTime }} h
    </div>
  </div>

  <t-modal v-model="modalOpen" @confirm="save" @cancel="modalOpen=false">
    <template v-slot:title>Reiseschritt</template>
    <div class="space-y-6">
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name des Schrittes</label>
        <input type="text" name="label" id="label" v-model="currentStep.label" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required>
      </div>
    </div>
    <button @click="removeStep()" class="relative z-10 block rounded-md bg-white p-2 focus:outline-none">
      <font-awesome-icon icon="times-circle" size="lg" class="'text-slate-600'" /> Entfernen
    </button>
  </t-modal>

</template>

<script lang="ts">

import {computed, inject, onMounted, ref, Ref, toRaw, unref, watch} from 'vue'
import { Route } from '@/models/route.model'
import moment from "moment";
import VTailwindModal from "@/components/shared/VTailwindModal.vue";
import {Step} from "@/models/step.model";
import TModal from "@/components/shared/TModal.vue";

export default {
  components: {TModal},
  props: ["step", "first"],

  setup(props: any) {
    const stepService = inject('stepService') as any
    const routeService = inject('routeService') as any
    const locationService = inject('locationService') as any
    const travelConfigService = inject('travelConfigService') as any

    const modalOpen: Ref<boolean> = ref(false);

    const route: Ref<Route|undefined> = ref();

    const currentStep: Ref<Step> = ref(toRaw(props.step));

    const removeStep = () => {
      stepService.removeStop(props.step.id)
    };

    const travelTime = computed((): string => {
      const seconds = route.value!.travelTime
      return moment.utc(moment.duration(seconds, "seconds").asMilliseconds()).format("H:mm");
    })

    const startTime = computed((): string => {
      const startTime = moment(toRaw(travelConfigService.state.config.start))
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

    const save = () => {
      stepService.updateStep(currentStep.value)
      modalOpen.value = false
      console.log(stepService.state.steps)
    }

    return {
      modalOpen,
      removeStep,
      route,
      travelTime,
      startTime,
      distance,
      currentStep,
      save
    };
  }
};
</script>
