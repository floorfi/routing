<template>
  <button type="button"
          class="focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md border text-sm font-medium px-5 py-2.5 focus:z-10"
          :class="{
            'text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800': color==='blue',
            'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-900 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600': color==='gray',
          }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import {computed, inject, ref, Ref, toRaw} from "vue";
import {Route} from "@/models/route.model";
import {Step} from "@/models/step.model";
import moment from "moment";

export default {
  name: 'TButton',
  inheritAttrs: true,
  props: ["color"]


}
</script>

<style scoped>

</style>