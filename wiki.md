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
```
for example:
```lua
	test = gSlider(500,0,1,WIDTH/2,HEIGHT/2,50)
```
Text in `draw()`:
```lua
xxx(the slider's name):draw()
```
for example:
```lua
	test:draw()
```

Text in `touched()`:
```lua
	xxx:touched(touch)
```
for example:
```lua
	test:touched(touch)
```
`xxx.num` is the value you want, you can see how to use it in `main.lua`.
