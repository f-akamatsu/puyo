<template>
  <td class="select-puyo-cell" @click="onClick">
    <template v-if="isKesu">
      <div class="kesu">
        <span class="ke">け</span>
        <span class="su">す</span>
      </div>
    </template>
    <template v-else>
      <svg width="31" height="31" viewBox="0,0,31,31">
          <Puyo :color="color"/>
      </svg>
    </template>
  </td>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Puyo from "@/components/parts/Puyo.vue";

const props = defineProps<{
  color: string;
  isSelected: boolean;
}>();

const emits = defineEmits<{
  (e: "onClick", color: string): void;
}>();

const onClick = (): void => {
  emits("onClick", props.color);
};

const isKesu = computed((): boolean => {
  return props.color === "0";
});
</script>

<style scoped>
.select-puyo-cell {
  border: 1px solid black;
  padding: 4px;
  cursor: pointer;
}

.select-puyo-cell svg {
  display: block;
}

.kesu {
  width: 31px;
  height: 31px;
  font-size: 14px;
  position: relative;
}

.ke {
  position: absolute;
  top: -2px;
  left: 0;
}
.su {
  position: absolute;
  bottom: -2px;
  right: 0;
}
</style>