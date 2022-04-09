<template>
  <canvas ref="el" width="600" height="600"></canvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const el = ref<HTMLCanvasElement>(null)
const context = computed(() => el.value!.getContext("2d")!)

//canvas容器宽高
const WIDTH = 600
const HEIGHT = 600

//interfaces
interface Point {
  x: number,
  y: number
}
interface Branch {
  start: Point,
  length: number,
  theta: number
}

//初始化
const init = () => {
  context.value.fillRect(0, 0, WIDTH, HEIGHT)
  const branch = {
    start: { x: WIDTH / 2, y: HEIGHT },
    length: 20,
    theta: -Math.PI / 2
  }
  setup(branch)
}

const pendingTasks: Function[] = []

const setup = (branch: Branch, depth = 1) => {
  const end = getEndPoint(branch)
  drawBranch(branch); //先把第一步画了

  //后续的绘画步骤先扔进列表里
  //左侧树
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() => setup({
      start: end,
      length: branch.length + Math.random() * 10 - 5,
      theta: branch.theta - 0.3 * Math.random()
    }, depth + 1))
  } else {
    arcTo(branch.start, depth)
  }
  //右侧树
  if (depth < 4 || Math.random() < 0.5) {
    pendingTasks.push(() => setup({
      start: end,
      length: branch.length + Math.random() * 10 - 5,
      theta: branch.theta + 0.3 * Math.random()
    }, depth + 1))
  } else {
    arcTo(branch.start, depth)
  }
}

//动画帧的时候画出扔进去的步骤，画完当前步骤再往里扔下一步
function frame() {
  const tasks = [...pendingTasks]
  pendingTasks.length = 0
  tasks.forEach(fn => fn())
}

let animationCount = 0

function startFrame() {
  requestAnimationFrame(() => {
    animationCount++
    if (animationCount % 3 == 0)
      frame()
    startFrame()
  })
}

//action
startFrame()

//直线绘画
const lineTo = (p1: Point, p2: Point) => {
  let ctx = context.value
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#ccc'
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)  //直线绘图起点
  ctx.lineTo(p2.x, p2.y)  //直线绘图终点
  ctx.stroke()
} 

//梅花
const arcTo = (p: Point, depth: number) => {
  if (depth < 5) return
  if(Math.random() < 0.2) return
  const dertaX = Math.random() * (5 - (-5) + 1) + (-5)
  const dertaY = Math.random() * (5 - (-5) + 1) + (-5)
  const dertaR = Math.random()
  const ctx = context.value
  ctx.beginPath();//开始绘制
  ctx.arc(p.x + dertaX, p.y + dertaY, 1 + dertaR, 0, 2 * Math.PI);//arc 的意思是“弧”,梅花随机左右生长
  ctx.strokeStyle = "pink";//将线条颜色设置为pink
  ctx.fillStyle = "pink";//设置填充颜色
  ctx.fill();//开始填充
  ctx.stroke();//stroke() 方法默认颜色是黑色（如果没有上面一行，则会是黑色）。
}

//获取每一次绘图结束点的坐标
const getEndPoint = (b: Branch) => {
  return {
    x: b.start.x + b.length * Math.cos(b.theta),
    y: b.start.y + b.length * Math.sin(b.theta),
  }
}

//绘图
const drawBranch = (b: Branch) => {
  lineTo(b.start, getEndPoint(b))
}

onMounted(() => {
  init()
})
</script>
