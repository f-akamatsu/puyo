<template>
  <rect 
    class="rect"
    width="30" 
    height="30" 
    :x="x"
    :y="y"
    fill="#FFFFFF" 
    stroke-width="1" 
    stroke="#F0F0F0"
    :fill-opacity="opacity"
    :stroke-opacity="opacity"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { computed, withDefaults } from "vue";
import { Coord } from "@/common/Coord";

const props = withDefaults(defineProps<{
  coord: Coord;
  isTrans: boolean;
  top?: number;
  left?: number;
}>(), {
  top: 0,
  left: 0
});

const emits = defineEmits<{
  (e: "onClick", coord: Coord): void;
}>();

const x = computed((): number => {
  return props.left + 0.5;
});

const y = computed((): number => {
  return props.top + 0.5;
});

const opacity = computed((): number => {
  return props.isTrans ? 0 : 1;
});

const onClick = (): void => {
  emits("onClick", props.coord);
};
</script>

<style scoped>
.rect {
  cursor: pointer;
}
.rect:hover {
  fill-opacity: 1;
  fill: #88FFFF;
}
</style>