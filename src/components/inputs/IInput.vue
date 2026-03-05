<script setup lang="ts">
import { EnumDirection } from "@/utilities/EnumSystem";
import Input from "../ui/input/Input.vue";
import Label from "../ui/label/Label.vue";

const modelValue = defineModel<any>();

const props = defineProps({
  type: { type: String, default: "text" },
  validateColor: { type: String, default: "" },
  label: { type: String },
  id: { type: String },
  name: { type: String, default: "" },
  // ⚠️ `ref` is a reserved attribute in Vue; avoid using it as a prop name
  inputRef: { type: String, default: "" }, // <-- rename if you need a ref name
  placeholder: { type: String, default: "" },
  IsRequire: { type: Boolean, default: false },
  max: { type: [Number, String], default: null },
  min: { type: [Number, String], default: null },
  minLen: { type: [Number, String], default: 0 },
  maxLen: { type: [Number, String], default: 10000 },
  disabled: { type: Boolean, default: false },
  dir: { type: String as () => EnumDirection, default: EnumDirection.Auto },

  // callbacks (optional)
  getDataByInter: { type: Function, default: () => {} },
  onInput: { type: Function, default: () => {} },

  isLabelFlex: { type: Boolean, default: false },
  tabindex: { type: String, default: "0" },
  lableFontSize: { type: String, default: "" },
});

// Re-emit DOM-like events so the parent can listen with @input/@change/etc.
const emit = defineEmits<{
  (e: "input", ev: Event): void;
  (e: "change", ev: Event): void;
  (e: "focus", ev: FocusEvent): void;
  (e: "blur", ev: FocusEvent): void;
}>();

const handleChange = (ev: Event) => {
  // keep your legacy callback
  props.getDataByInter?.();
  emit("change", ev);
};

const handleInput = (ev: Event) => {
  // optional hook
  props.onInput?.(ev);
  // forward to parent so @input works
  emit("input", ev);
};
</script>

<template>
  <div class="mb-2" :class="{ 'flex items-center': isLabelFlex }">
    <Label class="mb-2 mx-1" :style="{ fontSize: lableFontSize }">
      <span v-if="IsRequire" class="text-red-600">*</span>
      {{ label }}
    </Label>

    <!--
      If your inner <Input> supports v-model, bind it here; Vue 3 will
      automatically handle update:modelValue between this wrapper and the parent
    -->
    <Input
      v-model="modelValue"
      :id="id"
      :name="name"
      :type="type"
      :tabindex="tabindex"
      :placeholder="placeholder"
      :style="{ direction: dir }"
      :disabled="disabled"
      :max="max"
      :min="min"
      :minlength="minLen"
      :maxlength="maxLen"
      @input="handleInput"
      @change="handleChange"
      @focus="(e) => emit('focus', e)"
      @blur="(e) => emit('blur', e)"
    />
  </div>
</template>
