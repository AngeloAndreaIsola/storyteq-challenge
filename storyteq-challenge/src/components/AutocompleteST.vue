<template>
  <template v-if="showMinCharsHint">
    <li class="hint">Type at least 3 characters</li>
  </template>

  <template v-if="showNoResultsHint">
    <li class="hint">No results found</li>
  </template>

  <a-auto-complete
    v-model:value="query"
    :options="computedOptions"
    style="width: 100%"
    :placeholder="placeholder"
    @select="onSelect"
    @search="onSearch"
  >
    <template #option="{ label }">
      {{ label }}
    </template>
  </a-auto-complete>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from "vue";

export default defineComponent({
  name: "AutocompleteST",
  props: {
    storeAction: {
      type: Function as PropType<(query: string) => void>,
      required: true,
    },
    results: {
      type: Array as PropType<Array<any>>,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Search...",
    },
  },
  setup(props) {
    const query = ref<string>("");

    const formattedOptions = computed(() =>
      props.results.map((item) => {
        if (typeof item === "string") {
          return { value: item, label: item };
        } else if (item.title && item.author) {
          return {
            value: item.title,
            label: `${item.title} by ${item.author}`,
          };
        } else {
          return {
            value: item.value || item.label,
            label: item.label || item.value,
          };
        }
      })
    );

    // Show "Type at least 3 characters" if query is less than 3 characters
    const showMinCharsHint = computed(
      () => query.value.length > 0 && query.value.length < 3
    );

    // Show "No results found" if results are empty and query has 3 or more characters
    const showNoResultsHint = computed(
      () => query.value.length >= 3 && props.results.length === 0
    );

    // Merge options with hints if necessary
    const computedOptions = computed(() => {
      if (showMinCharsHint.value) {
        return [
          { value: null, label: "Type at least 3 characters", isHint: true },
        ];
      }
      if (showNoResultsHint.value) {
        return [{ value: null, label: "No results found", isHint: true }];
      }
      return formattedOptions.value;
    });

    const onSearch = (value: string) => {
      query.value = value;
      if (query.value.length >= 3) {
        props.storeAction(value);
      }
    };

    const onSelect = (value: string) => {
      console.log("Selected:", value);
    };

    watch(query, () => {
      console.log("Query changed:", query.value);
    });

    return {
      query,
      computedOptions,
      onSearch,
      onSelect,
      showMinCharsHint,
      showNoResultsHint,
    };
  },
});
</script>

<style scoped>
.autocomplete-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #ffffff;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

li {
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  transition: background-color 0.3s ease;
}

li.result-item:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

li.hint {
  color: #6c757d;
  text-align: center;
  font-style: italic;
  pointer-events: none;
}
</style>
