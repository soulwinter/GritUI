--# gPopAlert
--[[
gPopAlert
v1.0 beta By SoulWINTER
---------------------
更新日志

---------------------
使用方法：
想要添加 PopAlert 的话仅需要：
addNewPopAlert(标题,正文【可选】,背景颜色【可选，默认橙色】,保持时间【可选】)
例如：addNewPopAlert("Hello!","Welcome!",true,5)
在draw()中写
gPopAlert:draw()
]]
gPopAlert = class()
function addNewPopAlert(boldText,texts,Color,d1Text,d2Text,d1Func,d2Func)
    if gPopAlertTable == nil then
        gPopAlertTable = {}
    end
    table.insert(gPopAlertTable,gPopAlert(boldText,texts,Color,d1Text,d2Text,d1Func,d2Func))
end
function gPopAlert:init(boldText,texts,Color,d1Text,d2Text,d1Func,d2Func)
    -- self.two = useTwoButtons or false
    self.bText = boldText
    self.texts = texts
    self.Color = Color
    self.d1Text = d1Text
    self.d1Func = d1Func
    self.d2Text = d2Text
    self.d2Func = d2Func
    self.tweenStart = false
    -- self.img = image
    fontSize(20)
    textWrapWidth(300)
    local rh1,rh2 = 0
    font("HelveticaNeue-Bold")
    rh3,rh1 = textSize(self.bText)
    font("HelveticaNeue")
    _,rh2 = textSize(self.texts)
    if self.Text == "" then rh2 = 0 end
    self.rectHeight = rh1+rh2+95
    self.y = {}
    self.y.y = HEIGHT+self.rectHeight
    textAlign(CENTER)
    rectMode(CORNER)
    --  print(self.rectHeight)
    self.img = image(355,self.rectHeight+5)
    setContext(self.img)
    fill(196, 196, 196, 255)
    --  rect(+3,self.pos.y+3,350,self.rectHeight)
    noStroke()
    rect(0,0,350+2,self.rectHeight+2)
    fill(255, 255, 255, 255)
    --  strokeWidth(2)
    stroke(187, 187, 187, 255)
    rect(0,2,350,self.rectHeight)
    fill(0, 0, 0, 255)
    font("HelveticaNeue-Bold")
    textMode(CORNER)
    text(self.bText,(350-rh3)/2,self.rectHeight-rh1-20)
    font("HelveticaNeue")    
    text(self.texts,25,self.rectHeight-rh1-rh2-20-10)
    stroke(self.Color)
    strokeWidth(3)
    line(30,self.rectHeight-10,350-30,self.rectHeight-10)
    -- if self.two == false then
    --  end
    setContext()
    self.button1 = gSmoothButton(WIDTH/2-350/4,(HEIGHT-self.rectHeight)/2+30+self.y.y-HEIGHT/2,self.d1Text,self.d1Func,self.Color,15)
    self.button2 = gSmoothButton(WIDTH/2+350/4,(HEIGHT-self.rectHeight)/2+30+self.y.y-HEIGHT/2,self.d2Text,self.d2Func,self.Color,15)
    rectMode(CENTER)
    textAlign(LEFT)
    textMode(CENTER)
    textWrapWidth(WIDTH)
end
function gPopAlert:draw()
    if gPopAlertTable ~= nil then
        if #gPopAlertTable > 0 then
            rectMode(CENTER)
            fill(0, 0, 0, 195)
            rect(WIDTH/2,HEIGHT/2,WIDTH+5,HEIGHT+5)
        end
        for k,v in pairs(gPopAlertTable)  do
            if v.tweenStart == false then
                v.tweenStart = true
               local t1 = tween(0.3,v.y,{y=HEIGHT/2-10})
                local t2 = tween(0.2,v.y,{y=HEIGHT/2})
                tween.sequence(t1,t2)
            end
            sprite(v.img,WIDTH/2,v.y.y)
            v.button1.button.y = (HEIGHT-v.rectHeight)/2+30+v.y.y-HEIGHT/2
            v.button2.button.y = (HEIGHT-v.rectHeight)/2+30+v.y.y-HEIGHT/2
            v.button1:draw()
            v.button2:draw()
        end
    end
end
function gPopAlert:touched(t)
    if gPopAlertTable ~= nil and #gPopAlertTable > 0 then
        gPopAlertTable[#gPopAlertTable].button1:touched(t)
        if gPopAlertTable[#gPopAlertTable] ~= nil then
            gPopAlertTable[#gPopAlertTable].button2:touched(t)
        end
    end
end
function pop()
    tween(0.5,gPopAlertTable[#gPopAlertTable].y,{y=-450},tween.easing.linear,function() table.remove(gPopAlertTable) end)
end