<script lang="ts" setup>
//开发模式
import {dev} from '../composables/env'
//单元格属性
import { BlockState } from '../composables/type'
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
    <div v-if="block.flagged">🚩</div>
    <div
      v-else-if="block.revealed || dev"
      :style="{
        'color': fontColor[block.adjancentMines],
      }"
    >
      <img v-if="block.mine" w-6 h-6 src="https://api.iconify.design/ion:ios-nuclear.svg?color=currentColor" />
      <span v-else>{{ (block.adjancentMines ? block.adjancentMines : "") }}</span>
    </div>
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