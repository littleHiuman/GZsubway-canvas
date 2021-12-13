// 进度条加载
let prog = document.getElementsByClassName('prog')[0]
let progWrap = prog.parentElement
let progress = document.getElementById('progress')
// 控制进度条加载速度
let time = 1
function calculateProgress() {
  let progWidth = +getComputedStyle(progWrap)['width'].replace('px', '') || 0
  let each = progWidth / 10
  let width = +prog.style.width.replace('px', '') || 0
  if (width >= progWidth) {
    prog.style.width = 100 + '%'
    prog.innerText = 100 + '%'
    clearInterval(timer)
    progress.className += ' rotate'
    setTimeout(() => {
      progress.className += ' hidden'
    }, 500)
  } else {
    time += 1.1
    let calcWidth = width + each * time
    let percent = (calcWidth / progWidth) * 100
    if (calcWidth >= progWidth) {
      percent = 100
      calcWidth = progWidth
    }
    prog.style.width = calcWidth + 'px'
    prog.innerText = percent + '%'
  }
}
let timer = setInterval(calculateProgress, 500)

// 获取key值
let allLineKey = []
function getKey() {
  for (let key in info.lineInfo) {
    allLineKey.push(key)
  }
}
getKey()

// 获取name值
let allLineName = []
function getName() {
  for (let key in info.lineMsg) {
    allLineName.push(info.lineMsg[key].name)
  }
}
getName()

// 下拉菜单
let lineSelect = document.getElementById('lineSelect')
function initialOptions() {
  let str = ''
  for (let i = 0; i < allLineName.length; i++) {
    str += '<option value="' + allLineKey[i].replace('line', '') + '"'
    if (i == 0) {
      str += ' selected>'
    } else {
      str += '>'
    }
    str += allLineName[i] + '</option>'
  }
  lineSelect.innerHTML = str
  lineSelect.onchange = function () {
    let optionValue = lineSelect.options[lineSelect.options.selectedIndex].value
    drawPerLine(optionValue)
  }
}
initialOptions()

// 搜索
let button = document.getElementsByClassName('search-btn')[0]
let search = document.getElementById('search')

function checkInput() {
  let chinese = new RegExp(/[\u4e00-\u9fa5]+/)
  let val = search.value.trim()
  if (val && chinese.test(val)) {
    drawPerLine(val)
  } else {
    search.value = ''
    alert('不是中文字符')
  }
}

button.onclick = checkInput
search.onkeyup = function (event) {
  if (event.keyCode == '13') {
    checkInput()
  }
  if (search.value.trim() == '') {
    button.setAttribute('disabled', 'disabled')
  } else {
    button.removeAttribute('disabled')
  }
}

// 搜索结果
let place = document.getElementById('place')

// canvas
let canvas = document.getElementById('canvas')
let canvasHeight = canvas.height
let ctx = canvas.getContext('2d')

let canvasTwo = document.getElementById('canvas-two')
let canvasTwoHeight = canvasTwo.height
let ctxTwo = canvasTwo.getContext('2d')

let defaultCal = {
  x: '(afterOrdinate[0]-112) * 1895.00 - 2095',
  y: '(afterOrdinate[1]-22) * 1445.00 - 1140'
}

// 加载1号线
drawPerLine()
// 加载所有线
drawAllLine()

// 绘制路线图
function drawLine(val, isDefault) {
  let context = isDefault ? ctxTwo : ctx
  // console.log(info.lineInfo, val)
  let lineInfo = info.lineInfo[val]
  let lineMsg = info.lineMsg[val + 'MSG']
  let fillName = isDefault ? '所有' : lineMsg.name

  context.beginPath()
  context.fillStyle = 'red'
  context.font = '40px arial'
  context.fillText('北', 150, 750)
  context.fillText(fillName, 150, 150)
  context.fillStyle = 'black'
  context.font = '12px arial'
  drawEach(lineInfo, lineMsg, isDefault)
}
function drawEach(lineInfo, lineMsg, isDefault) {
  let context = isDefault ? ctxTwo : ctx
  for (const now of lineInfo) {
    let ordinate = now.coOrdinate
    let afterOrdinate = ordinate.split(',')
    let drawColor = lineMsg.color
    let text = isDefault ? '' : now.name
    let calculateX = isDefault ? eval(defaultCal.x) : eval(lineMsg.offsetCal.x)
    let calculateY = isDefault ? eval(defaultCal.y) : eval(lineMsg.offsetCal.y)

    context.strokeStyle = drawColor
    context.lineTo(calculateX, calculateY)
    context.fillText(text, calculateX, calculateY)
    if (!isDefault) {
      context.textBaseline = 'top' //基线
      context.textAlign = 'end'
    }
    context.moveTo(calculateX, calculateY)
    context.arc(calculateX, calculateY, 4, 0, (360 * Math.PI) / 180, false)
    context.closePath()
    context.stroke()
  }
}

// 获取线路
function getLine(val) {
  if (!val) return
  let line = []
  for (let i in info.lineInfo) {
    for (let j in info.lineInfo[i]) {
      if (info.lineInfo[i][j].name.indexOf(val) != -1) {
        line.push(i)
        let name = info.lineMsg[i + 'MSG'].name
        let text = place.innerText
        place.innerText = text.length ? text + ', ' + name : '位于' + name
      }
    }
  }
  place.innerText = place.innerText.length ? place.innerText : '未知'
  return line
}

// 绘制细节图
function drawPerLine(val) {
  place.innerText = ''

  if (!val) {
    // 一打开页面加载的内容
    canvas.height = canvasHeight

    drawLine(allLineKey[lineSelect.options.selectedIndex])
    return
  }
  val = val.trim()
  let letter = new RegExp(/^[A-Za-z]+$/)
  // 如果是英文，代表下拉选择的，则绘制路线，
  // 如果是中文，代表输入的，则打印路线名。
  let line = []
  if (letter.test(val)) {
    line.push('line' + val)
  } else {
    line = getLine(val)
  }
  draw(line)
}
function draw(line) {
  if (!line.length) return
  for (const lineNumber of line) {
    let index = allLineKey.indexOf(lineNumber)
    if (index != -1) {
      canvas.height = canvasHeight

      drawLine(allLineKey[index])
    }
  }
}

// 绘制全览图
function drawAllLine() {
  for (let i in info.lineInfo) {
    drawLine(i, true)
  }
}

// 距离
// function getInstance(coOrdinate1, coOrdinate2) {
//   let coOrdinate1X = coOrdinate1.split(',')[0]
//   let coOrdinate1Y = coOrdinate1.split(',')[1]
//   let coOrdinate2X = coOrdinate2.split(',')[0]
//   let coOrdinate2Y = coOrdinate2.split(',')[1]

//   let afterX = coOrdinate1X - coOrdinate2X
//   afterX = afterX >= 0 ? afterX : -afterX
//   let afterY = coOrdinate1Y - coOrdinate2Y
//   afterY = afterY >= 0 ? afterY : -afterY
//   let distance = Math.sqrt(afterX * afterX + afterY * afterY)
//   console.log(distance)
// }

// getInstance('113.23861,23.070983', '113.23904,23.084633')

// http://www.hhlink.com/%E7%BB%8F%E7%BA%AC%E5%BA%A6
// 0.01365677121431198
// 1.518公里
// 0.943英里
