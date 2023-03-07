<template>
  <table class="select-puyo">
    <tr>
      <SelectPuyoTableTd color="0" :is-selected="isSelected('0')" @on-click="onChange"/>
      <td colspan="2"></td>
    </tr>
    <tr>
      <SelectPuyoTableTd color="1" :is-selected="isSelected('1')" @on-click="onChange"/>
      <SelectPuyoTableTd color="2" :is-selected="isSelected('2')" @on-click="onChange"/>
      <SelectPuyoTableTd color="3" :is-selected="isSelected('3')" @on-click="onChange"/>
    </tr>
    <tr>
      <SelectPuyoTableTd color="4" :is-selected="isSelected('4')" @on-click="onChange"/>
      <SelectPuyoTableTd color="5" :is-selected="isSelected('5')" @on-click="onChange"/>
      <SelectPuyoTableTd color="9" :is-selected="isSelected('9')" @on-click="onChange"/>
    </tr>
  </table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SelectPuyoTableTd from "@/components/parts/SelectPuyoTableTd.vue";

const props = defineProps<{
  selectedColor: string;
}>();

const emits = defineEmits<{
  (e: "onChange", color: string): void;
}>();

const isSelected = computed(() => (color: string): boolean => {
  return props.selectedColor === color;
});

const onChange = (color: string): void => {
  emits("onChange", color);
};
</script>

<style scoped>
</style>