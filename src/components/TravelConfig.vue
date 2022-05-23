<template>
  <div class="absolute md:left-[20px] md:bottom-[20px] bg-transparent">
    <div class="relative">
      <!-- Modal toggle -->

      <button @click="modalOpen = true" class="relative z-10 block rounded-md bg-white p-2 focus:outline-none">
        <font-awesome-icon icon="gear" size="lg" class="'text-slate-600'" />
      </button>

      <v-tailwind-modal v-model="modalOpen" @confirm="confirm" @cancel="cancel">
        <template v-slot:title>Hello, vue-final-modal</template>
        <div>
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
          </p>
          <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
          </p>

          <form class="space-y-6" action="#">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
              <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your password</label>
              <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
            </div>
          </form>
        </div>
      </v-tailwind-modal>

    </div>
  </div>
</template>

<script lang="ts">

import {computed, inject, ref, Ref} from 'vue'
import StopListEntry from "@/components/StopListEntry.vue";
import VTailwindModal from "@/components/shared/VTailwindModal.vue";

export default {
  components: {VTailwindModal},
  setup() {
    const stepService = inject('stepService') as any

    const steps = computed(()=>(stepService.state.steps))

    const modalOpen: Ref<boolean> = ref(false);

    const confirm = () => {
      modalOpen.value = false
    }

    const cancel = () => {

    }

    return {
      steps,
      modalOpen,
      confirm,
      cancel
    };
  }
};
</script>
