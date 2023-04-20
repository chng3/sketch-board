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
let colorsLiEls = document.querySelectorAll('ol.colors > li')
let clearEl = document.querySelector('#clear')
let saveEl = document.querySelector('#save')
let sizesLiEls = document.querySelectorAll('ol.sizes > li')

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
// 调用绑定点击切换橡皮擦和画笔的事件处理函数
bindSwitchEventHandlers(eraserEl, brushEl)
// 调用绑定点击切换颜色面板的处理函数
bindColorsHandlers()
// 调用绑定点击切换画笔大小的处理函数
bindSizesHandlers()
// 调用清空整个画板事件函数 
bindClearHandler()
// 调用画布内容保存为PNG图片处理程序
bindSavePngHandler()

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
    // 分为两个处理函数1、bindTouchEventHandlers 2、bindMouseEventHandlers
    // 判断是否在移动设备使用或者PC上使用
    if (document.body.ontouchstart !== undefined) {
        // 调用在触摸设备上事件处理函数
        bindTouchEventHandlers()
    } else {
        // 调用鼠标按下事件处理函数
        bindMouseEventHandlers()
    }

}
// 在触摸设备上事件处理函数
function bindTouchEventHandlers() {
    // 处理在触摸设备上开始绘制
    canvasEl.ontouchstart = function (event) {
        // 获取当前触摸点的坐标
        let x = event.touches[0].clientX
        let y = event.touches[0].clientY
        // 将using标志设置为true，表示当前正在绘制
        using = true
        // 如果是使用橡皮擦工具，则在触摸点位置上擦除一个小矩形，
        // 否则记录当前触摸点的坐标作为上一次的位置
        if (isErase) {
            context.clearRect(x, y, 10, 10)
        } else {
            lastPos = {
                x,
                y
            }
        }
    }
    // 实现了在移动设备上触摸画布时绘制图形或擦除图形的功能
    // 为canvas元素添加touchmove事件的处理函数
    canvasEl.ontouchmove = function (event) {
        // 如果当前不是绘画状态，即鼠标没有按下，则直接返回
        if (!using) {
            return
        }
        // 获取当前触摸点的横纵坐标
        let x = event.touches[0].clientX
        let y = event.touches[0].clientY
        // 如果是橡皮擦模式，则清除当前触摸点周围的矩形区域，以实现擦除的效果
        if (isErase) {
            context.clearRect(x - 5, y - 5, 10, 10)
        } else {
            // 如果是绘画模式，则调用drawLine()函数在上一个点和当前点之间绘制一条线段
            drawLine(lastPos.x, lastPos.y, x, y)
            // 更新上一个点的位置为当前点的位置，以便下一次移动时使用
            lastPos = {
                x,
                y
            }
        }
    }
    // 绑定touchend事件的处理函数
    canvasEl.ontouchend = function (event) {
        // 当手指离开屏幕时，using的值被设置为false，标识着画笔不再绘制
        using = false
    }
}
// 鼠标按下事件处理函数
function bindMouseEventHandlers() {
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
            // drawCircle(lastPos.x, lastPos.y, 10)
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
// 绑定保存画布为PNG图片的事件处理
function bindSavePngHandler() {
    saveEl.onclick = function () {
        // 将画布的内容转换为DataURL格式的PNG图片数据，并将其赋值给url变量
        let url = canvasEl.toDataURL('image/png')
        // 创建一个<a>标签元素，并将其添加到页面的<body>元素中
        let a = document.createElement('a')
        document.body.appendChild(a)
        // 将url设置为<a>标签元素的href属性，使其成为下载链接
        a.href = url
        // 将下载链接的文件名设置为'画板截图'
        a.download = '画板截图'
        // 将<a>标签元素的target属性设置为'_blank'，以在新窗口中打开链接
        a.target = '_blank'
        // 模拟用户点击下载链接，以触发浏览器下载PNG图片
        a.click()
    }
}
// 清空整个画板
function bindClearHandler() {
    clearEl.onclick = function () {
        context.clearRect(0, 0, canvasEl.width, canvasEl.height)
    }
}
// 绑定点击切换画笔大小的处理函数
function bindSizesHandlers() {
    thinEl.onclick = function () {
        lineWidth = 5
        // 循环删除每一个颜色画板样式
        sizesLiEls.forEach(liEl => {
            liEl.classList.remove('active')
        })
        // 为选中的红色画板添加样式
        thinEl.classList.add('active')
    }
    thickEl.onclick = function () {
        lineWidth = 10
        // 循环删除每一个颜色画板样式
        sizesLiEls.forEach(liEl => {
            liEl.classList.remove('active')
        })
        // 为选中的红色画板添加样式
        thickEl.classList.add('active')
    }
}
// 绑定点击切换颜色面板的处理函数
function bindColorsHandlers() {
    // 选中红色画笔时
    redEl.onclick = function () {
        // 覆盖改变绘制图形的填充颜色
        context.fillStyle = 'red'
        // 覆盖改变绘制线条的颜色
        context.strokeStyle = 'red'
        // 循环删除每一个颜色画板样式
        colorsLiEls.forEach(liEl => {
            liEl.classList.remove('active')
        })
        // 为选中的红色画板添加样式
        redEl.classList.add('active')
    }
    // 选中黑色画笔时
    blackEl.onclick = function () {
        // 覆盖改变绘制图形的填充颜色
        context.fillStyle = 'black'
        // 覆盖改变绘制线条的颜色
        context.strokeStyle = 'black'
        // 循环删除每一个颜色画板样式
        colorsLiEls.forEach(liEl => {
            liEl.classList.remove('active')
        })
        // 为选中的黑色画板添加样式
        blackEl.classList.add('active')
    }
    // 选中绿色画笔时
    greenEl.onclick = function () {
        // 覆盖改变绘制图形的填充颜色
        context.fillStyle = 'green'
        // 覆盖改变绘制线条的颜色
        context.strokeStyle = 'green'
        // 循环删除每一个颜色画板样式
        colorsLiEls.forEach(liEl => {
            liEl.classList.remove('active')
        })
        // 为选中的绿色画板添加样式
        greenEl.classList.add('active')
    }
    // 选中蓝色画笔时
    blueEl.onclick = function () {
        // 覆盖改变绘制图形的填充颜色
        context.fillStyle = 'blue'
        // 覆盖改变绘制线条的颜色
        context.strokeStyle = 'blue'
        // 循环删除每一个颜色画板样式
        colorsLiEls.forEach(liEl => {
            liEl.classList.remove('active')
        })
        // 为选中的蓝色画板添加样式
        blueEl.classList.add('active')
    }
}
// 绑定切换橡皮擦和画笔的事件处理函数
function bindSwitchEventHandlers(eraserEl, brushEl) {
    // 点击橡皮擦按钮
    eraserEl.onclick = function () {
        // 设置选择橡皮擦
        isErase = true
        // 为橡皮擦的样式添加选中状态
        eraserEl.classList.add('active')
        // 移除画笔的选中状态样式
        brushEl.classList.remove('active')
    }
    // 点击画笔按钮
    brushEl.onclick = function () {
        // 设置选择画笔(关掉选择橡皮擦)
        isErase = false
        // 为画笔的样式添加选中状态
        brushEl.classList.add('active')
        // 移除橡皮擦的选中状态样式
        eraserEl.classList.remove('active')
    }
}
// 设置画板大小的函数
function setCanvasSize(canvasEl) {
    canvasEl.width = document.documentElement.clientWidth
    canvasEl.height = document.documentElement.clientHeight
}
// TODO: 待添加绘制图形等功能
// 绘制圆圈
function drawCircle(x, y, radius) {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
}

// 绘制线段
function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineWidth = lineWidth
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}