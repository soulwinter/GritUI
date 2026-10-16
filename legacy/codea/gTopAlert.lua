--# gTopAlert

gTopAlert = class()

function addNewTopAlert(boldText,Text,Color,sec)
    if gTopAlertTable == nil then
        gTopAlertTable = {}
    end
    table.insert(gTopAlertTable,gTopAlert(boldText,Text,Color,sec))
end
function gTopAlert:init(boldText,Text,Color,sec)
    noStroke()
    self.sec = sec or 3
    self.secc = {s=0}
    self.bText = boldText
    self.Text = Text or ""   
    self.alertColor = Color or color(255, 134, 0, 255)
    self.k = WIDTH/1024    
    fontSize(20)
    textWrapWidth(WIDTH-40)
    local rh1,rh2 = 0
    font("HelveticaNeue-Bold")
    _,rh1 = textSize(self.bText)
    font("HelveticaNeue")
    _,rh2 = textSize(self.Text)
   if self.Text == "" then rh2 = 0 end
    self.rectHeight = rh1+rh2+45
  --  print(self.rectHeight)
    self.img = image(WIDTH+5,self.rectHeight+30)
    fill(self.alertColor)
    setContext(self.img)
    rectMode(CORNER)
    rect(0,8,WIDTH+5,self.rectHeight+21)
    if self.alertColor == color(255, 255, 255, 255)  then
        fill(0, 0, 0, 255)
    else
        fill(255, 255, 255, 255)
    end
    font("HelveticaNeue-Bold")
    textMode(CORNER)
    text(self.bText,30,self.rectHeight-rh1-10)
    font("HelveticaNeue")
    text(self.Text,30,20)
    for i = 0,255 do
        fill(0, 0, 0, 0.7)
        rect(0,i/255*30,WIDTH+5,10-i/255*30-1)
    end
    setContext()
    
    self.y = {y=-self.rectHeight/2}
    self.start1,self.start2 = false,false
    textWrapWidth(WIDTH)
    
end
function gTopAlert:draw()
    for k,v in pairs(gTopAlertTable) do
    if not v.start1 then
        v.start1 = true
        local t1 = tween(0.2,v.y,{y=v.rectHeight/2+6},quad)
        local t2 = tween(0.2,v.y,{y=v.rectHeight/2})
        tween.sequence(t1,t2)
        tween(v.sec,v.secc,{s=v.sec})
    end    
    noStroke()
    sprite(v.img,WIDTH/2,HEIGHT-v.y.y)
    --  print(v.secc.s)
    if v.sec == v.secc.s and v.start2 == false then
        v.start2 = true       
        local t1 = tween(0.2,v.y,{y=v.rectHeight/2+10},quad)
        local t2 = tween(0.2,v.y,{y=-v.rectHeight/2-21},tween.easing.linear,function() table.remove(gTopAlertTable,k) end)
        tween.sequence(t1,t2)       
    end   
       
    end
    
end
function gTopAlert:destroy()
    self = nil
end
