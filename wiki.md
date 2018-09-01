# Wiki for GritUI (Updating...)
> If you'd like to use GritUI in your projects, please follow the steps below.

## gSlider



This is a slider, you can customize the following arguments:
- length (essential)

You must set the length (for example: 200 pixels)
- minimum (essential)

You must set the minimum for gSlider which will be displayed when the button is pulled to the far left.

- maximum (essential)

... which will be displayed when the button is pulled to the far right.
- the position which includes x and y. (essential)

You must set the position in which the slider displays.
- init value (essential)

You must set the init value of the slider. (attenton: the init value's init is pixel)
- color (optional)

You can set the slider's color. (use the `color()` function)
- the radius of the button (optional)

### How to use

Before using, you need copy the code below to your program:
- `gSlider.lua` 


Text in `setup()`:
```lua
	xxx(take a name)=gSlider(length, mininum, maxinum, x, y, init value, color, radius)
	-- for example:
	-- test = gSlider(500,0,1,WIDTH/2,HEIGHT/2,50)
```


Text in `draw()`:
```lua
	xxx(the slider's name):draw()
	-- for example
	-- test:draw()
```


Text in `touched(touched)`:
```lua
	xxx:touched(touch)
	-- for example:
	-- test:touched(touch)
```


**`xxx.num` is the value returned by the slider, you can see how to use it in `main.lua`.**


## gCircleSwitch

This is an easy switch, you can customize the following arguments:
- position (essential)
- radius of the switch (optional)
- color of the switch (optional)
- init state (`true` or `false`) (optional)

**Some arguments are similar to gSlider.**

### How to use
Before using, you need copy the code below to your program:
- `gCircleSwitch.lua` 

Text in `setup()`:
```lua
	xxx(take a name) = gCircleSwitch(x,y,radiusOfTheSwitch,colorOfTheSwitch,initState)
	-- for example
	test = gCircleSwitch(200,200,40,color(0,0,0,255),false) 
```
Text in `draw()`:
```lua
	xxx:draw()
```

Text in `touched(touch)`:
```lua
	xxx:touched(touch)
```

**`xxx.state` is the state returned by the switch.**


## gSmoothButton

This is a beautiful button, you can customize the following arguments:
- position (essential)
- words displayed on the button (essential)
- function which will be run when you pushed the button (essential)
- color of the button (optional)
- the font size of the words (optional)

### How to use
Before using, you need copy the code below to your program:
- `gSmoothButton.lua` 

Text in `setup()`:
```lua
	xxx = gSmoothButton(x,y,wordsWillBeDisplayed,functionWillBeRun,colorOfButton,fontSizeOfWords)
	-- for example
	-- test = gSmoothButton(200,200,"Start",function() print("Checked 1") end,color(0,0,0),30)
```
Text in `draw()`:
```lua
	xxx:draw()
```

Text in `touched(touch)`:
```lua
	xxx:touched(touch)
```


## gTopAlert

This is a beautiful tool for notifications, you can customize the following arguments:
- Title / Bold Text (essential)
- text (optional)
- background color (optional)
- display time (optional)

### How to use
Before using, you need copy the code below to your program:
- `gTopAlert.lua` 

*The ways of using gTopAlert is different from other GritUI tools.**

Text in where you need to pop up a notification:
```lua
	addNewTopAlert(title,text,background,displayTime)
	-- for example
	-- addNewTopAlert("Hello!","Welcome!",true,5)
```
Text in `draw()`:
```lua
	gTopAlert:draw()
	-- attention: not xxx
```

**This tool doesn't need touching.**


## gPopAlert

> This is a beta version with some bugs.

you can customize the following arguments:
- Title
- text
- color
- words on the left button
- words on the right button
- function will be run when you pushed the left button
- function will be run when you pushed the right button

### How to use
Before using, you need copy the code below to your program:
- `gPopAlert.lua` 
- `gSmoothButton.lua`
**gPopAlert uses gSmoothButton.**

Text in where you need to pop up a notification:
```lua
	addNewPopAlert(title,text,color,wordsLeft,wordsRight,FuncLeft,FuncRight)
```
Text in `draw()`:
```lua
	gPopAlert:draw()
	-- attention: not xxx
```

Text in `touched(touch)`:
```lua
	gPopAlert:touched(touch)
	-- attention: not xxx
```
