<script setup lang="ts">
import { ref, watch } from "vue";

// Define the props
const props = defineProps({
  length: Number,
});

// Create a reactive array for the skeleton Rows
const Rows = ref<any>([]);

// Watch for changes in data and update Rows accordingly
watch(
  () => props.length,
  (newlength: any) => {
    // Fill the Rows array with objects to match the length of data
    Rows.value = new Array(newlength || 4)
      .fill({})
      .map((_, index) => ({ id: index }));
  },
  { immediate: true }
);
</script>
<template>
  <section class="py-1 bg-gray-50">
    <div class="sm:px-6 w-full">
      <div class="mx-6 px-1">
        <div class="mt-7">
          <div>
            <table class="min-w-full text-center rounded-md">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="rounded-tl-md rounded-bl-md text-sm font-medium px-6 py-1 animate-pulse"
                  >
                    <div class="bg-gray-200 rounded-lg w-40 h-5"></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-7 py-1 animate-pulse"
                  >
                    <div class="bg-gray-200 rounded-lg w-40 h-5"></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div class="bg-gray-200 rounded-lg w-40 h-5"></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div class="bg-gray-200 rounded-lg w-40 h-5"></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div class="bg-gray-200 rounded-lg w-40 h-5"></div>
                  </th>
                  <th
                    scope="col"
                    class="rounded-tr-md rounded-br-md text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div class="bg-gray-200 rounded-lg w-40 h-5"></div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  tabindex="0"
                  class="focus:outline-none text-center h-16 duration-300 border-b border-gray-500 border-t"
                  v-for="row in Rows"
                  :key="row.id"
                >
                  <td class="animate-pulse">
                    <div class="bg-gray-200 rounded-lg w-32 h-5 ml-8"></div>
                  </td>
                  <td class="animate-pulse">
                    <div class="">
                      <div class="bg-gray-200 rounded-lg w-32 h-5 ml-8"></div>
                    </div>
                  </td>
                  <td class="animate-pulse">
                    <div class="">
                      <div class="bg-gray-200 rounded-lg w-32 h-5 ml-8"></div>
                    </div>
                  </td>
                  <td class="animate-pulse">
                    <div class="">
                      <div class="bg-gray-200 rounded-lg w-32 h-5 ml-8"></div>
                    </div>
                  </td>
                  <td class="animate-pulse">
                    <div>
                      <div class="bg-gray-200 rounded-lg w-32 h-5 ml-8"></div>
                    </div>
                  </td>

                  <td class="animate-pulse">
                    <div class="bg-gray-200 rounded-lg w-32 h-5 ml-8"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
