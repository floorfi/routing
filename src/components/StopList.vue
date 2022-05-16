<template>
  <div class="absolute md:top-[20px] md:right-[20px] z-[2] bg-transparent flex flex-col"  v-if="steps.length">
    <div>
      <stop-list-entry v-for="step in steps" v-bind:key="step.id" :step="step"/>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, inject} from 'vue'
import StopListEntry from "@/components/StopListEntry.vue";

export default {
  components: { StopListEntry },

  setup() {
    const stepService = inject('stepService') as any

    const steps = computed(()=>(stepService.state.steps))

    return {
      steps
    };
  }
};
</script>
