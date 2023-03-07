<template>
  <rect 
    class="puyo"
    width="30" 
    height="30"
    :x="x"
    :y="y"
    rx="15"
    ry="15"
    :fill="fill"
    :fill-opacity="opacity"
    stroke-width="1" 
    :stroke="stroke"
    :stroke-opacity="opacity"
    ref="$puyo"
  />
</template>

<script setup lang="ts">
import { computed, defineExpose, ref, withDefaults } from "vue";

const props = withDefaults(defineProps<{
  color: string;
  top?: number;
  left?: number;
}>(), {
  top: 0,
  left: 0
});

const stroke = computed((): string => {
  let stroke;
  switch (props.color) {
    case "1":
      stroke = "#236F1A";
      break;
    case "2":
      stroke = "#852D20";
      break;
    case "3":
      stroke = "#254AB2";
      break;
    case "4":
      stroke = "#A44D0F";
      break;
    case "5":
      stroke = "#692797";
      break;
    case "9":
      stroke = "#69686E";
      break;
    default:
      stroke = "#FFFFFF";
      break;
  }
  return stroke;
});

const x = computed((): number => {
  return props.left + 0.5;
});

const y = computed((): number => {
  return props.top + 0.5;
});

const fill = computed((): string => {
  let fill;
  switch (props.color) {
    case "1":
      fill = "#68EE26";
      break;
    case "2":
      fill = "#F34A49";
      break;
    case "3":
      fill = "#0C8EF9";
      break;
    case "4":
      fill = "#FDBA2E";
      break;
    case "5":
      fill = "#B458EB";
      break;
    case "9":
      fill = "#BBBBBB";
      break;
    default:
      fill = "#FFFFFF";
      break;
  }
  return fill;
});

const opacity = computed((): number => {
  let opacity;
  if (props.color === "0") {
    opacity = 0;
  } else {
    opacity = 1;
  }
  return opacity;
});

const $puyo = ref(null);
defineExpose({ $puyo });
</script>

<style scoped>
.puyo {
  pointer-events: none;
}
</style>