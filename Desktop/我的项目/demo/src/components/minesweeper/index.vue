<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import MineBlock from './components/block.vue'
import { BlockState } from './type'

//初次点击
let mineGenerator = false

//按钮点击事件
function sweeperClick(block: BlockState) {
  //是否是初次点击，初次点击则初始化
  if (!mineGenerator) {
    generatorMines(block)
    mineGenerator = true
  }
  //已翻转的内容不会再翻转
  if (block.revealed) return
  //flag的内容不会被翻转
  if (block.flagged) return
  //翻开当前block
  block.revealed = true
  //零方格展开
  expendZero(block)
}

//右键点击事件
function onRightClick(block: BlockState) {
  if (block.revealed) return
  block.flagged = !block.flagged
}

//点击到0的时候 会将周围的全部翻开
function expendZero(block: BlockState) {
  if (block.adjancentMines) return  //不为0则不展开

  getSiblings(block).forEach(s => {
    if (!s.revealed) {
      s.flagged = false //展开时清空上面的🚩
      s.revealed = true
      expendZero(s)
    }
  })
}

//失败
function mineBoom() {
  alert('BOOM')
  state.forEach(row => {
    row.forEach(item => {
      item.flagged = false
      item.revealed = true
    })
  })
}

//矩阵
const WEIGH = 10
const HEIGHT = 10
const state = reactive(Array.from(
  { length: HEIGHT },
  (_, x) => Array.from(
    { length: WEIGH },
    (_, y): BlockState => ({ x, y, adjancentMines: 0, revealed: false })
  )
))

//生成炸弹
function generatorMines(initial: BlockState) {
  for (let row of state) {
    for (let item of row) {
      //当第一次点击的时候，对被点击的点四周进行处理
      if (Math.abs(initial.x - item.x) <= 1) continue
      if (Math.abs(initial.y - item.y) <= 1) continue
      item.mine = (Math.random() < 0.2)
    }
  }
  //计算格子周围的炸弹数量
  genneratorMinesNumber()
}

function genneratorMinesNumber() {
  state.forEach((row) => {
    row.forEach((block) => {
      if (block.mine) return
      getSiblings(block).forEach(b => {
        if (b.mine) block.adjancentMines += 1
      })
    })
  })
}

//筛选出方位内存在的格子
let directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
function getSiblings(block: BlockState) {
  return directions
    .map(([dx, dy]) => {
      let y = block.y + dy
      let x = block.x + dx
      if (x < 0 || x >= WEIGH || y < 0 || y >= HEIGHT) return undefined
      return state[x][y]
    })
    .filter(Boolean) as BlockState[]
}

//检查是否胜利
function checkGameStatus() {
  const blocks = state.flat()
  //翻开炸弹直接爆炸
  if(blocks.some(block => block.mine && block.revealed)) {
    return mineBoom()
  }
  //不翻开炸弹常规判断
  if (blocks.every(block => block.revealed || block.flagged)) {
    if (blocks.some(block => !block.mine && block.flagged))
      alert('YOU CHEAT')
    else
      alert("YOU WIN")
  }
}

//监听游戏进度
watchEffect(checkGameStatus)
</script>

<template>
  <div class="mine-sweeper">
    <header>Minesweeper</header>
    <div class="row" v-for="row in state">
      <div v-for="block in row">
        <MineBlock
          :block="block"
          @click.native="sweeperClick(block)"
          @contextmenu.prevent.native="onRightClick(block)"
        ></MineBlock>
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
  font-size: larger;
  transform: translateY(-200%);
}
.row {
  display: flex;
}
</style>