--# gSlider

gSlider = class()
function gSlider:init(length,min,max,x,y,startPos,lineColor,radius)
    self.length = length
    self.min = min
    self.max = max
    self.pos = vec2(x,y)
    self.buttonPos = startPos
    self.isTouching = false
    self.num = 0
    self.num2 = 0
    self.radius = radius or 15
    self.lineColor = lineColor or color(255, 134, 0, 255)
    self.strokes = {width = 1.5/1.5*self.radius}
    self.onceStroke = 1.5/1.5*self.radius
    if self.buttonPos > length then self.buttonPos = length end
    self.blurCircle = gSlider:Blur(self.radius+5)
end
function gSlider:draw()
    stroke(self.lineColor)
    strokeWidth(self.strokes.width)
    line(self.pos.x-self.length/2,self.pos.y,self.pos.x-self.length/2+self.buttonPos,self.pos.y)
    -- stroke(223, 215, 215, 255)
    stroke(226, 224, 224, 255)
    line(self.pos.x-self.length/2+self.buttonPos,self.pos.y,self.pos.x+self.length/2,self.pos.y)
    fill(223, 224, 223, 36)
    -- stroke(212, 209, 213, 255)
    -- ellipse
    
    -- sprite(self.img,self.pos.x-self.length/2+self.buttonPos,self.pos.y-3/15*self.radius)
    strokeWidth(1.3/15*self.radius)
    stroke(197, 192, 192, 255)
    noStroke()
    fill(255, 255, 255, 255)
    sprite(self.blurCircle,self.pos.x-self.length/2+self.buttonPos,self.pos.y)
    ellipse(self.pos.x-self.length/2+self.buttonPos,self.pos.y,30/15*self.radius,30/15*self.radius)
    fill(self.lineColor)
    ellipse(self.pos.x-self.length/2+self.buttonPos,self.pos.y,10/15*self.radius)
    self.num = self.buttonPos*((self.max-self.min)/self.length)
    if self.min < 0 then self.num = self.num + self.min end
    self.num2 = self.buttonPos*((self.max-self.min)/self.length)
end
function gSlider:touched(touch)
    if touch.state == BEGAN and touch.x >= (self.pos.x-self.length/2+self.buttonPos)-self.radius and touch.x <= self.pos.x-self.length/2+self.buttonPos+self.radius and touch.y >= self.pos.y-self.radius and touch.y <= self.pos.y+self.radius then
        self.isTouching = true
        tween(0.1,self.strokes,{width = self.onceStroke+self.radius/26*8})
        
    end
    
    if touch.state ~= ENDED and self.isTouching == true then
        if touch.x-(self.pos.x-self.length/2)>=0 and touch.x-(self.pos.x-self.length/2)<=self.length then
            self.buttonPos = touch.x-(self.pos.x-self.length/2)
        end
        if touch.x-(self.pos.x-self.length/2)<=0 then
            self.buttonPos = 0
        end
        if touch.x-(self.pos.x-self.length/2)>=self.length then
            self.buttonPos = self.length
        end
    end
    
    if touch.state == ENDED and self.isTouching == true then
        self.isTouching = false
       local t2 = tween(0.05,self.strokes,{width = self.onceStroke-self.radius/17*12})
        local t3 = tween(0.1,self.strokes,{width = self.onceStroke})
        tween.sequence(t2,t3) 
    end
end

function gSlider:Blur(radius)
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
