--# Main
-- GritUI v1.2.2 By SoulWINTER
displayMode(FULLSCREEN)

-- Use this function to perform your initial setup
function setup()
    version = "1.2.2"
    ver = 122
    Color1 = color(0, 193, 255, 255)
    slider = gSlider(300,0,1,WIDTH/2,HEIGHT-400,30,Color1)
    Color2 = color(255, 86, 0, 255)
    CB = gCircleSwitch(WIDTH/2-200,HEIGHT-400,40,Color2,true)
    Color3 = color(30, 159, 70, 255)
    addNewTopAlert("Welcome to GritUI v"..version.."!","Available components:\n- gSlider A playful slider\n- gCircleSwitch A simple circular switch\n- gTopAlert An animated top banner\n- gSmoothButton A rounded button\n- gPopAlert A two-action popup\n\nPlease report any issues to the author, SoulWINTER.",Color3)
    Color4 = color(255, 0, 186, 255)
    Button = gSmoothButton(WIDTH/2,HEIGHT-500,'Show slider value',function() addNewTopAlert(slider.num or "...") end,Color4,20)
    Button2 = gSmoothButton(WIDTH/2,HEIGHT-600,"Test gPopAlert",function() addNewPopAlert("Test gPopAlert","Would you like to show a top alert?\nver."..version,Color3,"Show alert","Close",function() addNewTopAlert("A colorful top alert","Opened from a popup!",color(math.random(1,255),math.random(1,255),math.random(1,255),255)) pop() end,function() pop() end) end,Color4,20)    
    http.request("https://raw.githubusercontent.com/soulwinter/gritui/master/version.txt",didGetData)
end
function didGetData(data)
    if tonumber(data) ~= nil then
        if tonumber(data) > ver then
            addNewTopAlert("A new GritUI version (v"..tonumber(data)..") is available. Use the button to download it.")
            downloadButton = gSmoothButton(WIDTH/2,HEIGHT-300,"Copy update to clipboard",function() http.request("https://raw.githubusercontent.com/soulwinter/gritui/master/code.txt",downloadCode) end,Color2,20)
        end
    end
end
function downloadCode(data)
    pasteboard.copy(data)
    addNewTopAlert("The updated code has been copied to the clipboard.")
end
function draw()
    -- print(slider.num)
   -- addNewTopAlert(slider.num or "...")
    -- This sets a dark background color
    background(255, 255, 255, 255)
    --  Button.button.x = slider.num
    if CB.state then
        slider:draw()
    end
    CB:draw()
    if downloadButton ~= nil then
        downloadButton:draw()
    end
    Button:draw()
    Button2:draw()
    gTopAlert:draw()
    gPopAlert:draw()
    fill(0, 0, 0, 255)
    strokeWidth(5)
end

function touched(x)
    if CB.state then
        slider:touched(x)
    end
    if downloadButton ~= nil then
        downloadButton:touched(x)
    end
    Button:touched(x)
 CB:touched(x)
    gPopAlert:touched(x)
    Button2:touched(x)
 --   if newVersion ~= nil then newVersion:touched(x) end
end
