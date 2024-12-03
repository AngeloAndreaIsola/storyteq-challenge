<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo-container">
        <LogoStoryTeq />
        <h1>Autocomplete Challenge</h1>
      </div>
    </header>

    <main>
      <div class="section">
        <h2>Cities</h2>
        <AutocompleteST
          ref="citiesAutocomplete"
          :storeAction="searchCities"
          :results="searchResults.cities"
          placeholder="Search for cities..."
        />
      </div>
      <div class="section">
        <h2>Books</h2>
        <AutocompleteST
          :storeAction="searchBooks"
          :results="searchResults.books"
          placeholder="Search for books..."
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useDatasetStore } from "./store";
import AutocompleteST from "./components/AutocompleteST.vue";
import LogoStoryTeq from "./components/LogoStoryTeq.vue";

export default defineComponent({
  name: "App",
  components: { AutocompleteST, LogoStoryTeq },
  setup() {
    const datasetStore = useDatasetStore();

    return {
      searchCities: datasetStore.searchCities,
      searchBooks: datasetStore.searchBooks,
      searchResults: computed(() => datasetStore.searchResults),
    };
  },
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(
    120deg,
    #0b1872 0%,
    #0b1872 10%,
    #0f40a5 28%,
    #134db3 35%,
    #1b65cb 57%,
    #1e6ed5 74%,
    #3399ff 100%
  ) !important;
  padding: 0;
  color: #ffffff;
  font-family: "Arial", sans-serif;
  text-align: center;
}

.logo-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.app-header {
  display: flex;
  justify-content: center;
  padding: 2em;
}

main {
  padding: 20px;
}

.section {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  margin-bottom: 5em;
  background: #ffffff;
  padding: 20px;
  padding-bottom: 2em;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #333;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1em;
  color: #0b1872;
}
</style>
