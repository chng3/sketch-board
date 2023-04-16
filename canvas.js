// 获取画布元素和上下文
let canvasEl = document.querySelector('#mycanvas')
let context = canvasEl.getContext('2d')
// 获取橡皮擦和画笔元素
let eraserEl = document.querySelector('#eraser')
let brushEl = document.querySelector('#brush')
// 获取动作区域元素
let blackEl = document.querySelector('#black')
let redEl = document.querySelector('#red')
let greenEl = document.querySelector('#green')
let blueEl = document.querySelector('#blue')
let thinEl = document.querySelector('#thin')
let thickEl = document.querySelector('#thick')
let colorsLiEls = document.querySelector('ol.colors > li')
let clearEl = document.querySelector('#clear')
let sizesLiEls = document.querySelector('ol.sizes > li')
// TODO: 完成事件点击，重构任务
// 设置默认画笔大小为5
let lineWidth = 5
// 是否正在使用鼠标
let using = false
// 是否处于橡皮擦模式
let isErase = false
// 记录上一个鼠标位置
let lastPos = {
    x: undefined,
    y: undefined
}

// 调用自动设置画板大小的函数
autoSetCanvasSize(canvasEl)
// 调用设置鼠标监听器的函数
listenToUser(canvasEl, context)
// 调用初始化橡皮擦和画笔的函数
initEraser(eraserEl, brushEl, actionsEl)

// 自动设置画板大小的函数
function autoSetCanvasSize(canvasEl) {
    // 调用设置画板大小的函数
    setCanvasSize(canvasEl)
    // 监听窗口大小变化事件，调用设置画板大小的函数
    window.onresize = function () {
        setCanvasSize(canvasEl)
    }
}
// 设置鼠标监听器的函数
function listenToUser(canvasEl, context) {
    if (document.body.ontouchstart !== undefined) {
        // 
        canvasEl.ontouchstart = function (event) {
            let x = event.touches[0].clientX
            let y = event.touches[0].clientY
            using = true
            if (isErase) {
                context.clearRect(x, y, 10, 10)
            } else {
                lastPos = {
                    x,
                    y
                }
            }
        }
        // 
        canvasEl.ontouchmove = function (event) {
            if (!using) {
                return
            }
            let x = event.touches[0].clientX
            let y = event.touches[0].clientY
            if (isErase) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawLine(lastPos.x, lastPos.y, x, y)
                lastPos = {
                    x,
                    y
                }
            }
        }
        // 
        canvasEl.ontouchend = function (event) {
            using = false
        }
    } else {
        // 鼠标按下事件
        canvasEl.onmousedown = function (event) {
            let x = event.clientX
            let y = event.clientY
            // 设置绘制状态为true
            using = true
            // 判断当前是否为擦除状态，是则清除一小块区域，否则记录上一次的位置
            if (isErase) {
                context.clearRect(x, y, 10, 10)
            } else {
                lastPos = {
                    x,
                    y
                }
            }
        }
        // 鼠标移动事件
        canvasEl.onmousemove = function (event) {
            // 如果绘制状态为false，退出函数
            if (!using) {
                return
            }
            let x = event.clientX
            let y = event.clientY
            // 判断当前是否为擦除状态，是则清除一小块区域，否则绘制一条线段并记录当前位置为上一次位置
            if (isErase) {
                context.clearRect(x - 5, y - 5, 10, 10)
            } else {
                drawLine(lastPos.x, lastPos.y, x, y)
                lastPos = {
                    x,
                    y
                }
            }
        }
        // 鼠标松开事件，设置绘制状态为false
        canvasEl.onmouseup = function (event) {
            using = false
        }

    }

}
// 初始化橡皮擦和画笔的函数
function initEraser(eraserEl, brushEl, actionsEl) {
    // 点击橡皮擦按钮
    eraserEl.onclick = function () {
        // 设置选择橡皮擦
        isErase = true
        // 添加一个class：当用户点击橡皮擦时，类名“is-painting”会被添加到“actions”元素中，此时画笔会显示，橡皮擦会隐藏
        actionsEl.className = 'actions is-painting'
    }
    // 点击画笔按钮
    brushEl.onclick = function () {
        // 设置选择画笔(关掉选择橡皮擦)
        isErase = false
        // 添加一个class
        actionsEl.className = 'actions'
    }
}
// 设置画板大小的函数
function setCanvasSize(canvasEl) {
    canvasEl.width = document.documentElement.clientWidth
    canvasEl.height = document.documentElement.clientHeight
}

// 绘制圆圈
function drawCircle(x, y, radius) {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

// 绘制一条线段
function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineWidth = lineWidth
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}