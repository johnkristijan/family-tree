<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// No specific script needed for App.vue with just router-view
</script>

<style>
/* Global styles */
body {
  margin: 0;
  font-family: var(--font-family); /* PrimeVue font family */
  background-color: var(--surface-ground); /* PrimeVue surface background for the whole page */
  color: var(--text-color); /* PrimeVue text color */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Utility class for slightly smaller text if needed */
.text-sm {
  font-size: 0.875rem;
}

/* Improve focus rings for accessibility (example) */
/* Adjust as per PrimeVue's focus ring variables if available and preferred */
*:focus-visible {
  outline: 2px solid var(--primary-color) !important;
  outline-offset: 1px;
  box-shadow: none !important; /* Override other focus shadows if they interfere */
}

/* Card styling consistency */
.card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  padding: 1.5rem; /* Default padding, can be overridden */
  border-radius: 8px; /* Default border radius */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1); /* Softer shadow */
}
</style>
