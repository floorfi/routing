<template>
  <div
    class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
  >
    <div class="relative flex-1 md:min-w-[350px]">
      <div class="absolute bottom-0">
        <!-- Selected Search Result -->
        <div v-for="location in locations" v-bind:key="location.id" class="mt-[8px] px-4 py-3 bg-white rounded-md">
          <i @click="removeResult" class="flex justify-end far fa-times-circle"></i>
          <h1 class="text-lg">{{ location.text }}</h1>
          <p class="text-xs mb-1">
            {{ location.place_name }}
          </p>
          <p class="text-xs">{{ location.properties.category }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ["selectedResult"],

  methods: {
    removeResult() {
      this.props.selectedResult.value = null;
    }
  },

  computed: {
    locations() {
      return this.$store.state.locations
    }
  }
};
</script>
