function getMin(arr) {
  let min = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i]
    }
  }
  return min
}
function getMax(arr) {
  let max = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  return max
}

function calcFn(xInfos, yInfos, xBorder, yBorder) {
  if (yBorder == undefined) {
    yBorder = xBorder
  }
  let canvasWidth = 850
  let canvasHeight = 880
  let minX = getMin(xInfos)
  let maxX = getMax(xInfos)
  let minY = getMin(yInfos)
  let maxY = getMax(yInfos)
  let resX = calcArgs(maxX, minX, canvasWidth, xBorder)
  let resY = calcArgs(maxY, minY, canvasHeight, yBorder)

  return {
    x: `(afterOrdinate[0]-${resX.number}) * ${resX.multiplier} - ${resX.between}`,
    y: `(afterOrdinate[1]-${resY.number}) * ${resY.multiplier} - ${resY.between}`
  }
}
function calcArgs(max, min, maxLen, border) {
  if (max < min) {
    return
  }
  border = border || 10
  let contentBorder = maxLen - 2 * border
  let contentWidth = max - min
  let multiplier = parseInt(contentBorder / contentWidth, 10)

  let number = parseInt(min - 1, 10) + 1
  let temLeft = (min - number) * multiplier
  let between = parseInt(temLeft - border, 10)

  return {
    number,
    multiplier,
    between
  }
}

function calculate() {
  let xInfos = []
  let yInfos = []
  // let lineInfos = {}
  // let lineInfoOffsets = {}
  for (let i in info.lineInfo) {
    let lineMsg = info.lineMsg[i + 'MSG']
    let xInfosInline = []
    let yInfosInline = []
    let element = info.lineInfo[i]
    for (const now of element) {
      let ordinate = now.coOrdinate
      let afterOrdinate = ordinate.split(',')
      let x = afterOrdinate[0]
      let y = afterOrdinate[1]
      xInfos.push(x)
      yInfos.push(y)
      xInfosInline.push(x)
      yInfosInline.push(y)
    }
    // lineInfos[i] = {
    //   x: xInfosInline,
    //   y: yInfosInline
    // }
    let offsetCal = calcFn(xInfosInline, yInfosInline, 30)
    lineMsg['offsetCal'] = offsetCal
    // lineInfoOffsets[i] = offsetCal
  }

  let allCal = calcFn(xInfos, yInfos, 10)
  return {
    defaultCal: allCal,
    lineInfoOffsets: offsetCal
  }
}

let { defaultCal, lineInfoOffsets } = calculate()
