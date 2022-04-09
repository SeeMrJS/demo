
//单元格属性
interface BlockState {
  x: number
  y: number
  revealed?: boolean //是否翻开
  mine?: boolean
  flagged?: boolean
  adjancentMines: number
}

export type {
  BlockState
}