<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import Label from "../ui/label/Label.vue";

const modelValue = defineModel<any>();
const emits = defineEmits<{
  //(e: "change", id: number): void;
  (e: "onChange"): void;
}>();
defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
  },
  label: {
    type: String,
  },
  labelVSelect: {
    type: String,
    default: "name",
  },
  options: {
    type: Array<any>,
    required: true,
  },
  IsRequire: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  IsLabel: {
    type: Boolean,
    default: true,
  },
});
const Change = () => {
  emits("onChange");
};
// import { useI18n } from "@/stores/i18n/useI18n";
// const { t } = useI18n();
</script>
<template>
  <div class="my-2 mx-1 text-left">
    <Label class="mb-1" :for="name" v-if="IsLabel">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </Label>
    <vSelect
      :id="id"
      class="shadow focus:border-blue-500 appearance-none border-2 text--title border-light-nav dark:border-gray-600 rounded-lg w-full px-3 leading-tight focus:outline-none focus:shadow-outline"
      v-model="modelValue"
      :options="options"
      :reduce="(user: any) => user"
      :label="labelVSelect"
      :name="name"
      :getOptionLabel="(user: any) => user.name"
      @change="Change"
      :multiple="multiple"
      :disabled="disabled"
    >
      <template #option="{ name }">
        <div class="_input">
          <span class="_input">{{ name }}</span>
        </div>
      </template>
    </vSelect>
  </div>
</template>
