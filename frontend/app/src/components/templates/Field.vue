<template>
  <div class="field">
    <svg width="181" height="391" viewBox="0,0,181,391">
      <!-- grid -->
      <template v-for="x in xlist" :key="x">
        <template v-for="y in ylist" :key="y">
          <FieldGridCell 
            :coord="new Coord(x, y)"
            :isTrans="isTop(y)"
            :left="left(x)" 
            :top="top(y)"
            @on-click="onClickFieldCell"
          />
        </template>
      </template>

      <!-- puyo -->
      <template v-for="(fieldPuyo, i) in fieldPuyoList" :key="i">
        <Puyo
          :ref="(el: any)=>{setPuyoDomList(el, fieldPuyo.coord.clone())}"
          :color="fieldPuyo.color"
          :left="left(fieldPuyo.coord.x)"
          :top="top(fieldPuyo.coord.y)"
        />
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose, onBeforeUpdate } from "vue";
import { Coord } from "@/class/Coord";
import FieldGridCell from "@/components/parts/FieldGridCell.vue";
import Puyo from "@/components/parts/Puyo.vue";
import { FieldPuyoList } from "@/class/FieldPuyoList";

interface PuyoDom {
  coord: Coord;
  $puyo: any;
}

const xlist = [0,1,2,3,4,5];
const ylist = [0,1,2,3,4,5,6,7,8,9,10,11,12];
const puyoDomList: PuyoDom[] = [];

const props = defineProps<{
  fieldPuyoList: FieldPuyoList;
}>();

const emits = defineEmits<{
  (e: "onClickFieldCell", coord: Coord): void;
}>();

onBeforeUpdate(() => {
  puyoDomList.length = 0;
});

/**
 * computed top
 */
const top = computed(() => (y: number): number => {
  return (12-y)*30;
});

/**
 * computed left
 */
const left = computed(() => (x: number): number => {
  return x*30;
});

/**
 * computed 最上段かどうか
 */
const isTop = computed(() => (y: number): boolean => {
  return y===12;
});

/**
 * フィールドクリック時
 * @param coord 
 */
const onClickFieldCell = (coord: Coord): void => {
  emits("onClickFieldCell", coord);
};

const setPuyoDomList = (el: any, coord: Coord) => {
  if (el !== null) {
    puyoDomList.push({coord: coord, $puyo: el.$puyo});
  }
};

/**
 * 連鎖開始
 */
const startChain = (): FieldPuyoList => {
  const [chainInfoList, allChainAnime] = props.fieldPuyoList.startChain();
  console.log(chainInfoList);
  return props.fieldPuyoList;
};

defineExpose({ startChain });
</script>

<style scoped>
.field {
  display: inline-flex;
  padding: 10px 15px 40px;
  position: relative;
}

.field::before {
  transform: skewY(-5deg);
  content: "";
  position: absolute;
  top: 5px; bottom: 5px; left: 5px; right: 5px;
  z-index: -1;
  background-color:#0AA1FD;
  border-radius: 6%/3%;
}

.field::after {
  transform: skewY(-5deg);
  content: "";
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  z-index: -2;
  background-color:#DDDDDD;
  border-radius: 8%/4%;
}
</style>