--# gSmoothButton
--[[
gSmoothButton
v1.0.1 By SoulWINTER
---------------------
更新日志
v1.0.1
- 修复按住动画却消失的 bug
- 文字可以换行
- 修改动画
- 优化代码
---------------------
使用方法：
在setup()中写
xxx（取个名字）= gSmoothButton(x,y,文本,轻按按钮触发的函数,按钮颜色,文本大小【可选】)
例如：test = gSmoothButton(200,200,"Start",function() print("Checked 1") end,color(xxxx),30) 
在draw()中写
xxx（你刚才取的名字）:draw()
例如：test:draw()
在touched中写
xxx:touched(touch)
例如：test:touched(touch)
]]
gSmoothButton = class()
function gSmoothButton:init(x,y,str,clickedFunc,ButtonColor,size)
   -- self.pos = vec2(x,y)
    fontSize(size or 20)
    self.string = str
    local a,b
    a,b = textSize(self.string)
    b = b + 40/25*(size or 20)
    self.button = {
    y = y,
    size = size or 20,
    buttonColor = ButtonColor or color(255, 134, 0, 255),
    width = textSize(self.string)+110/25*(size or 20),
    height = b,
    alpha = 116
    }
    self.button.x = x+self.button.height/2
    self.buttonImg = image(self.button.width+self.button.height*2,self.button.height)
    setContext(self.buttonImg)
    strokeWidth(self.button.height)
    stroke(255, 255, 255, 255)
    lineCapMode(ROUND)
    line(self.button.height,self.button.height/2,self.button.width,self.button.height/2)
    setContext()
    self.isTouching = false
    self.clicked = clickedFunc
    textMode(CENTER)
    self.pushColor = color(255, 255, 255, 0)
    self.currentLine = {x=0,y=0,alpha=0,width=0,height=0}
    self.isEnded = false
end
function gSmoothButton:draw()
    textMode(CENTER) 
    self.pushColor.a = self.currentLine.alpha
    tint(self.button.buttonColor)
    sprite(self.buttonImg,self.button.x,self.button.y)
    tint(self.pushColor)
    sprite(self.buttonImg,self.currentLine.x,self.currentLine.y,self.currentLine.width,self.currentLine.height)
    noTint()
    fontSize(self.button.size)
    fill(255, 255, 255, 255)
    text(self.string,self.button.x-self.button.height/2,self.button.y)
    if self.isEnded == true and self.currentLine.alpha > 0 then
        self.currentLine.alpha = self.currentLine.alpha - 2
    end
    if self.isEnded and self.currentLine.alpha <= 0 then
        self.isEnded = false
        self.currentLine = {x=0,y=0,alpha=0,width=0,height=0}
    end
end
function gSmoothButton:touched(t)
    if t.state == BEGAN and t.x > self.button.x - self.button.width/2 - self.button.height/2 and t.x < self.button.x + self.button.width/2 - self.button.height/2 and t.y > self.button.y - self.button.height/2 and t.y < self.button.y + self.button.height/2  then
        if self.isEnded then
            self.isEnded = false 
        end
        self.isTouching = true
        self.currentLine.width = 0
        self.currentLine.height = 0
        self.currentLine.x = t.x
        self.currentLine.y = t.y
        tween(0.2,self.currentLine,{x = self.button.x,y = self.button.y,height =self.button.height,alpha=150})
        tween(0.2,self.currentLine,{width= self.button.width+self.button.height*2},tween.easing.quadInOut)
    end
    if self.isTouching == true and t.state == ENDED then
        self.clicked()
        self.isTouching = false
        self.isEnded = true
    end
end