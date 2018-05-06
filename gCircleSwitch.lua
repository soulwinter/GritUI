--# gCirlceSwitch
--[[
gCircleSwitch
v1.0 dev By SoulWINTER
---------------------
更新日志

---------------------
使用方法：
在setup()中写
xxx（取个名字）= gCircleSwitch(x位置,y位置,圆大小【可选】,颜色【可选】,状态【可选】)
例如：test = gCircleSwitch(200,200,40,false) 
在draw()中写
xxx（你刚才取的名字）:draw()
例如：test:draw()
在touched中写
xxx:touched(touch)
例如：test:touched(touch)
xxx.state 为当前开关状态
]]
gCircleSwitch = class()
function gCircleSwitch:init(x,y,size,circleColor,state)
    self.pos = vec2(x,y)
    self.ySize = size or 45
    self.cColor = circleColor or color(255, 134, 0, 255)
    self.state = state or false
    self.isTouching = false
    if self.state then
        self.size = {s=size-10/40*size} or {s=45-10/40*45}
    else
        self.size = {s=0}
    end
end
function gCircleSwitch:draw()
    strokeWidth(1.3/15*17)
    stroke(self.cColor)
    fill(0, 0, 0, 0)
    ellipse(self.pos.x,self.pos.y,self.ySize)
    stroke(255, 0, 0, 0)
    fill(self.cColor)
    ellipse(self.pos.x,self.pos.y,self.size.s)
end
function gCircleSwitch:touched(t)
    if t.state == BEGAN and t.x > self.pos.x-self.ySize/2 and t.x < self.pos.x+self.ySize/2 and t.y > self.pos.y-self.ySize/2 and t.y < self.pos.y+self.ySize/2 then
        if not self.state then
            self.isTouching = true
            local t1 = tween(0.1,self.size,{s=self.ySize-6/40*self.ySize})
            local t2 = tween(0.05,self.size,{s=self.ySize-15/40*self.ySize})
            local t3 = tween(0.1,self.size,{s=self.ySize-10/40*self.ySize})
            tween.sequence(t1,t2,t3)
        end
        if self.state then
            self.isTouching = true
            local t4 = tween(0.1,self.size,{s=self.ySize-6/40*self.ySize})
            local t5 = tween(0.1,self.size,{s=0})
            tween.sequence(t4,t5)
        end
    end
    if t.state == ENDED and self.isTouching == true then
        self.isTouching = false
        self.state = not self.state
    end
end

function gCircleSwitch:Blur(radius)
    local img=image(radius*2,radius*2)
    strokeWidth(0)
    setContext(img)
    for i=0,255 do
        fill(0, 0, 0, 0.5)
        ellipse(radius,radius,radius*2/255*i)
    end
    setContext()
    return img
end