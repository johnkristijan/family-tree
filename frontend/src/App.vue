<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// No specific script needed for App.vue with just router-view
</script>

<style>
/* Global styles can go here or in a separate CSS file imported in main.ts */
body {
  margin: 0;
  font-family: var(--font-family); /* PrimeVue font family */
  background-color: var(--surface-b); /* PrimeVue surface background */
  color: var(--text-color); /* PrimeVue text color */
}
</style>
