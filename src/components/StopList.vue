<template>
  <div
      class="md:w-auto w-full absolute md:bottom-[20px] md:left-[20px] z-[2] bg-transparent flex"  v-if="stops.length"
  >
    <div v-for="stop in stops" v-bind:key="stop.id" class="w-[350px] mr-[8px] px-4 py-3 bg-white rounded-md">
      <i @click="removeStep(stop.id)" class="flex justify-end far fa-times-circle"></i>
      <p>{{ stop.label }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import {computed, inject} from 'vue'
import {Step} from "@/models/step.model";
import {Location} from "@/models/location.model";
import {Route} from "@/models/route.model";

export default {

  setup() {
    const store = useStore();
    const getRoute = inject('getRoute') as Function;
    const removeMarker = inject('removeMarker') as Function;
    const removeLayer = inject('removeLayer') as Function;

    const removeStep = (stepID: string) => {
      let stepToRemove: Step = store.state.step.find((step: Step) => step.id === stepID);
      let indexToRemove: number = store.state.step.findIndex((step: Step) => step.id === stepID);
      let previousStep: Step|null = null;
      let followingStep: Step|null = null;

      // Vorherige routeTo entfernen
      store.commit("removeRoute", stepID);
      removeLayer(stepID);

      // Gibt es einen vorherigen Step?
      if(store.state.location[indexToRemove-1]) {
        console.log('vorheriger step vorhanden')
        previousStep = store.state.location[indexToRemove-1];
      }

      // Gibt es einen Folgestep?
      if(store.state.location[indexToRemove+1]) {
        console.log('folgender step vorhanden')
        followingStep = store.state.location[indexToRemove+1];
        store.commit("removeRoute", followingStep!.id);
        removeLayer(followingStep!.id);
      }


      // Recalculate route (if more than one step left)
      if(previousStep && followingStep){
        console.log('es gibt vor und nach step - route berechnen')

        getRoute(previousStep, followingStep).then((route: Route) => {
          store.commit("addRoute", route);
        })
      }


      // Remove objects
      removeMarker(stepToRemove.location.marker)
      store.commit("removeLocation", stepID);
      store.commit("removeStep", stepID);


      // Reindex arrays
      store.state.step.filter((step: Step) => step)
      store.state.location.filter((location: Location) => location)
      store.state.routeTo.filter((route: Route) => route)
    };

    const stops = computed(()=>(store.state.location))

    return {
      removeStep,
      stops,
    };
  },
};
</script>
