<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Button from "@/components/ui/button/Button.vue";
import { computed } from "vue";

const props = defineProps({
  open: Boolean,
  title: String,
  description: String,
  confirmLabel: String,
  cancelLabel: String,
});
const emit = defineEmits(["update:open", "confirm", "cancel"]);

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit("update:open", v),
});

const onConfirm = () => {
  emit("confirm");
  emit("update:open", false);
};
const onCancel = () => {
  emit("cancel");
  emit("update:open", false);
};
</script>

<template>
  <AlertDialog :open="isOpen" @update:open="(v:boolean)=> (isOpen = v)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel">
          {{ cancelLabel ?? "No" }}
        </AlertDialogCancel>
        <Button @click="onConfirm">
          {{ confirmLabel ?? "Yes" }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
