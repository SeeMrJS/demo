<script lang="ts" setup>
//单元格属性
import { BlockState } from '../type'
defineProps<{ block: BlockState }>()

//不同数量下的文字颜色
const fontColor = ["green"/*占位*/, "skyblue", "yellow", "orange", "red", "pink"]
</script>

<template>
  <div
    class="button"
    :class="{
      bg: block.revealed && block.mine,
      revealedBg: block.revealed && !block.mine
    }"
  >
    <span v-if="block.flagged">🚩</span>
    <span
      v-else-if="block.revealed"
      :style="{
        'color': fontColor[block.adjancentMines],
      }"
    >{{ block.mine ? '💣' : (block.adjancentMines ? block.adjancentMines : "") }}</span>
  </div>
</template>

<style>
.button {
  border: 1px solid #fff;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.9rem;
  margin: 2px;

  background-color: #333;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.3s;

  cursor: pointer;
}
.button:hover {
  background-color: #ccc;
}
.bg {
  background-color: rgba(219, 60, 60, 0.3);
}
.bg:hover {
  background-color: rgba(219, 60, 60, 1);
}
.revealedBg {
  background-color: #000;
  opacity: 0.5;
}
</style>