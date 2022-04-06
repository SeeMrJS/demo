<script setup lang="ts">
import { ref, reactive } from 'vue'
//单元格属性
interface BlockState {
  x: number
  y: number
  revealed?: boolean //是否翻开
  mine?: boolean
  flagged?: boolean
  adjancentMines: number
}

//初次点击
let mineGenerator = false
let dev = true

//按钮点击事件
function sweeperClick(block:BlockState) {
  //是否是初次点击，初次点击则初始化
  if(!mineGenerator) {
    generatorMines(block)
    mineGenerator = true
  }

  //已翻转的内容不会再翻转
  if(block.revealed) return

  //翻转到炸弹游戏结束
  if(block.mine) {
    block.revealed = true
    return  mineBoom()
  }

  //翻开
  block.revealed = true
}

//点击到0的时候 会将周围的全部翻开
function expendZero() {

}

//失败
function mineBoom() {
  state.forEach(row => {
    row.forEach(item => item.revealed = true)
  })
}

//矩阵
const WEIGH = 10
const HEIGHT = 10
const state = reactive(Array.from(
  { length: HEIGHT },
  (_, x) => Array.from(
    { length: WEIGH },
    (_, y): BlockState => ({ x, y, adjancentMines: 0,revealed:false })
  )
)
)

//生成炸弹
function generatorMines(initial:BlockState) {
  for (let row of state) {
    for (let item of row) {
      //当第一次点击的时候，对被点击的点四周进行处理
      if(Math.abs(initial.x - item.x) <= 1) continue
      if(Math.abs(initial.y - item.y) <= 1) continue
      item.mine = (Math.random() < 0.2)
    }
  }
  //计算格子周围的炸弹数量
  genneratorMinesNumber()
}

//计算各自周围的炸弹数量
let directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0,-1],
  [0,1],
  [1,-1],
  [1,0],
  [1,1]
]
function genneratorMinesNumber() {
  state.forEach((row) => {
    row.forEach((item) => {
      if (item.mine) return
      directions.forEach(([dx, dy]) => {
        let y = item.y + dy
        let x = item.x + dx
        if (x < 0 || x >= WEIGH || y < 0 || y >= HEIGHT) return
        if (state[x][y].mine) item.adjancentMines += 1
      })
    })
  })
}

//不同数量下的文字颜色
const fontColor = [
  "green",
  "skyblue",
  "yellow",
  "orange",
  "red",
  "pink"
]

</script>

<template>
  <div class="mine-sweeper">
    <header>Minesweeper</header>
    <div class="row" v-for="row in state">
      <div class="button" v-for="i in row" :class="{bg:i.revealed && i.mine}" @click="sweeperClick(i)">
        <span v-if="i.revealed || dev" :style="{'color':fontColor[i.adjancentMines]}">{{ i.mine ? '💣' : i.adjancentMines }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.mine-sweeper {
  color: #fff;
}
header {
  text-align: center;
  margin: 3rem 0;
  font-size: larger;
}
.row {
  display: flex;
}
.button {
  border: 1px solid #fff;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 0.9rem;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 2px;

  transition: all .3s;

  cursor: pointer;
}
.button:hover {
  background-color: #ccc;
}
.bg {
  background-color: rgba(219, 60, 60, 0.25);
}
.bg:hover {
  background-color: rgba(219, 60, 60, 1);
}
</style>