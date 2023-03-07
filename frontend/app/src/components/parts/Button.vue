<template>
  <button class="button" @click="onClick">
    <slot>
    </slot>
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: "onClick"): void;
}>();

const onClick = () => {
  emits("onClick");
};

</script>

<style scoped>
.button {
  width: 100px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid #404040;
  background-color: #E0E0E0;
  color: #404040;
  cursor: pointer;
}

.button:hover {
  background-color: #C0C0C0;
}

.button:active {
  background-color: #A0A0A0;
}
</style>