<template>
  <div class="absolute md:left-[20px] md:bottom-[20px] bg-transparent">
    <div class="relative">
      <!-- Modal toggle -->

      <button @click="modalOpen = true" class="relative z-10 block rounded-md bg-white p-2 focus:outline-none">
        <font-awesome-icon icon="gear" size="lg" class="'text-slate-600'" />
      </button>

      <t-modal v-model="modalOpen" @confirm="save">
        <template v-slot:title>Reiseeinstellungen</template>
        <div class="space-y-6">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name der Reise</label>
            <input type="text" name="label" id="label" v-model="label" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required>
          </div>
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Maximale Fahrzeit pro Tag</label>
            <input type="text" name="maxDrivingTime" id="maxDrivingTime" v-model="maxDrivingTime" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required>
          </div>
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Startzeitpunkt</label>
            <input type="datetime-local" name="start" id="start" v-model="start" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required>
          </div>
        </div>
      </t-modal>

    </div>
  </div>
</template>

<script lang="ts">

import {inject, ref, Ref} from 'vue'
import VTailwindModal from "@/components/shared/VTailwindModal.vue";
import moment from "moment-timezone";
import TModal from "@/components/shared/TModal.vue";

export default {
  components: {TModal},
  setup() {
    const travelConfigService = inject('travelConfigService') as any

    const modalOpen: Ref<boolean> = ref(false);

    const label: Ref<string> = ref(travelConfigService.state.config.label);
    const maxDrivingTime: Ref<string> = ref(moment(travelConfigService.state.config.maxDrivingTime, 'X').format('HH:mm'));
    const start: Ref<string> = ref(travelConfigService.state.config.start.format('YYYY-MM-DDTHH:mm'));

    const save = () => {
      const configToSave = {...travelConfigService.state.config}
      configToSave.label = label.value
      configToSave.maxDrivingTime = moment(maxDrivingTime.value, 'HH:mm').format('X')
      configToSave.start = moment(start.value, 'YYYY-MM-DDTHH:mm').tz(moment.tz.guess())
      travelConfigService.saveConfig(configToSave)
      modalOpen.value = false
    }


    return {
      label,
      maxDrivingTime,
      start,
      modalOpen,
      save
    };
  }
};
</script>
