<template>
  <div class="container">
    <div>
      <Field
        ref="$field"
        :fieldPuyoList="fieldPuyoList"
        @on-click-field-cell="onClickFieldCell"
      />
    </div>
    <div>
      <SelectPuyoTable
        :selectedColor="selectedColor"
        @on-change="onChangeSelectPuyo"
      />
      <Button @on-click="onClickDropButton">落とす</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import Button from "@/components/parts/Button.vue"
import Field from "@/components/templates/Field.vue"
import SelectPuyoTable from "@/components/templates/SelectPuyoTable.vue";
import { Coord } from "@/class/Coord";
import { FieldPuyo } from "@/class/FieldPuyo";
import { FieldPuyoList } from "@/class/FieldPuyoList";

const fieldPuyoList = reactive(new FieldPuyoList());
const selectedColor = ref("1");

const $field = ref();

const onClickDropButton = (): void => {
  const newFieldPuyoList: FieldPuyo[] = $field.value.startChain();
  // fieldPuyoList.value = newFieldPuyoList;
};

const onClickFieldCell = (coord: Coord): void => {
  const color = selectedColor.value;
  
  if (color === "0") {
    fieldPuyoList.removeFieldPuyo(coord);
  } else {
    const fieldPuyo = new FieldPuyo(coord, color);
    fieldPuyoList.setFieldPuyo(fieldPuyo);
  }
};

const onChangeSelectPuyo = (changeColor: string): void => {
  selectedColor.value = changeColor;
};
</script>

<style scoped>
.container {
  margin-top: 20px;
  display: flex;
}

.container div {
  margin-right: 10px;
}
</style>