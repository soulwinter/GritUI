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
    addNewTopAlert("欢迎使用 GritUI v"..version.." ！","可用控件：\n- gSlider 精美的滑动条\n- gCircleSwitch 简约的圆形开关\n- gTopAlert 带有动画的顶部横幅\n- gSmoothButton 独特的圆角按钮\n- gPopAlert 双选项的窗口弹窗\n\n如果您在使用中出现了问题，请反馈给作者！百度贴吧: @CF万家好",Color3)
    Color4 = color(255, 0, 186, 255)
    Button = gSmoothButton(WIDTH/2,HEIGHT-500,'输出 gSlider 数值',function() addNewTopAlert(slider.num or "...") end,Color4,20)
    Button2 = gSmoothButton(WIDTH/2,HEIGHT-600,"Test gPopAlert",function() addNewPopAlert("Test gPopAlert","您要调用 gTopAlert 吗？\nver."..version,Color3,"调用 gTopAlert","关闭",function() addNewTopAlert("我是一条多彩的 gTopAlert","我也是被 gPopAlert 召唤出来的！",color(math.random(1,255),math.random(1,255),math.random(1,255),255)) pop() end,function() pop() end) end,Color4,20)    
    http.request("https://raw.githubusercontent.com/soulwinter/gritui/master/version.txt",didGetData)
end
function didGetData(data)
    if tonumber(data) ~= nil then
        if tonumber(data) > ver then
            addNewTopAlert("GritUI 有新版本(v"..tonumber(data)..")可用，您可以点击按钮下载新版本。")
            downloadButton = gSmoothButton(WIDTH/2,HEIGHT-300,"下载新版本到剪贴板",function() http.request("https://raw.githubusercontent.com/soulwinter/gritui/master/code.txt",downloadCode) end,Color2,20)
        end
    end
end
function downloadCode(data)
    pasteboard.copy(data)
    addNewTopAlert("新版本代码已下载到剪贴板。")
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