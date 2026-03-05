<script setup lang="ts">
import type { ITableItem, ITableHeader } from "@/types/core/ITable";

const props = defineProps({
  headers: {
    type: Array as () => ITableHeader[],
    required: true,
  },
  items: {
    type: Array as () => ITableItem[],
    required: true,
  },

  tdPadding: {
    type: String,
    default: "p-2",
  },
  class: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div :class="props.class">
    <slot name="tableBar"></slot>
    <div
      v-motion
      :initial="{ opacity: 0, y: -15 }"
      :enter="{ opacity: 1, y: 0 }"
      :variants="{ custom: { scale: 2 } }"
      :delay="200"
      v-if="items.length > 0"
      class="overflow-auto"
    >
      <table class="w-full text-no-wrap py-2">
        <caption></caption>
        <thead>
          <tr>
            <th
              class="text-lg font-bold text--title px-2 py-1"
              v-for="(header, index) in headers"
              :key="index"
            >
              {{ header.caption }}
            </th>
          </tr>
        </thead>
        <tbody class="">
          <tr
            class="border-t duration-300 text--title border-gray-300 dark:border-gray-600 py-2"
            v-for="(row, rowIndex) in items"
            :key="rowIndex"
          >
            <td
              :class="tdPadding"
              v-for="(header, index) in headers"
              :key="index"
            >
              <slot
                :name="header.value"
                :row="row"
                :cell="row[index]"
                :rowIndex="rowIndex"
                :cellIndex="index"
              >
                {{ row[header.value] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
