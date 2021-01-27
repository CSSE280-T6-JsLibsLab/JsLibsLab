/**
 * code by lonelydawn 161226
 * color picker 拾色器
 * need jQuery >= v1.10.2
 */

// 1 鼠标点击		click=getMixedColor() 十进制 getHexColor 十六进制
// 2 获取鼠标位置	getPos();
// 3 计算点击位置代表的两个色度  getColorTop/getColorBottom(pos)  pos :x || y
// 4 根据两个色度计算出叠加色度  getMixedColor(color1,color2)
// & 绘制色谱
// & 10进制色值转16进制色值
// & 

// 创建拾色器
var cHexColor = "fff";

var createColorPicker = function () {
    var canvass = $("#canvas"); //获取的是属性集合 [canvas#canvas,context:document,selector:"#canvas"]
    var canvas = $("#canvas")[0];

    // 获取canvas上下文环境 	for 2d
    var getContext = function (width, height) {
        canvas.width = width;
        canvas.height = height;
        return canvas.getContext("2d");
    };

    //绘制色谱
    var drawBackground = function (ctx, width, height) {
        // 初始清空绘图区域
        ctx.clearRect(0, 0, width, height);
        // 绘制水平全色渐变
        var hGrad = ctx.createLinearGradient(0, 0, width, 0);
        hGrad.addColorStop(0 / 6, '#F00'); //	x 		r 				g 	 			b
        hGrad.addColorStop(1 / 6, '#FF0'); //1  - 30  	255 			x/30*255		0
        hGrad.addColorStop(2 / 6, '#0F0'); //31 - 60	(60-x)/30*255	255				0
        hGrad.addColorStop(3 / 6, '#0FF'); //61 - 90	0 				255				(x-60)/30*255
        hGrad.addColorStop(4 / 6, '#00F'); //91 -120 	0 				(120-x)/30*255	255
        hGrad.addColorStop(5 / 6, '#F0F'); //121-150 	(x-120)/30*255	0  				255
        hGrad.addColorStop(6 / 6, '#F00'); //151-180 	255 			0 				(180-x)/30*255
        ctx.fillStyle = hGrad;
        ctx.fillRect(0, 0, width, height);

        // 绘制垂直白色透明度渐变
        var vGrad = ctx.createLinearGradient(0, 0, 0, height);
        vGrad.addColorStop(0, 'rgba(255,255,255,0)'); //	y 		r 	g 	b  	 	α
        vGrad.addColorStop(1, 'rgba(255,255,255,1)'); //1-100 	255 255 255		y/100
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, width, height);
    };

    //获取上层图层色道
    var getColorTop = function (y) {
        return {
            r: 255,
            g: 255,
            b: 255,
            a: y / 100
        };
    };

    //获取下层图层色道
    var getColorBottom = function (x) {
        var r = 255,
            g = 255,
            b = 255;
        if (x > 0 && x <= 30) {
            r = 255;
            g = x / 30 * 255;
            b = 0;
        } else if (x > 30 && x <= 60) {
            r = (60 - x) / 30 * 255;
            g = 255;
            b = 0;
        } else if (x > 60 && x <= 90) {
            r = 0;
            g = 255;
            b = (x - 60) / 30 * 255;
        } else if (x > 90 && x <= 120) {
            r = 0;
            g = (120 - x) / 30 * 255;
            b = 255;
        } else if (x > 120 && x <= 150) {
            r = (x - 120) / 30 * 255;
            g = 0;
            b = 255;
        } else if (x > 150 && x <= 180) {
            r = 255;
            g = 0;
            b = (180 - x) / 30 * 255;
        } else return null;
        return {
            r: r,
            g: g,
            b: b
        };
    };

    /**
     * C=α*A+(1-α)*B  单色道的混合计算公式
     * α为A层(上层)的不透明度
     * 本节的A层是垂直渐变色区域
     */
    var getMixedColor = function (cTop, cBtm) {
        var r = Math.floor(cTop.r * cTop.a + (1 - cTop.a) * cBtm.r),
            g = Math.floor(cTop.g * cTop.a + (1 - cTop.a) * cBtm.g),
            b = Math.floor(cTop.b * cTop.a + (1 - cTop.a) * cBtm.b);
        var value = "rgba(" + r + "," + g + "," + b + ",1);";

        return {
            r: r,
            g: g,
            b: b,
            value: value
        };
    };

    //获取十六进制颜色字符串,如 #999999
    var getHexColorString = function (c) {
        var cStr = "#";
        // 将单位色度值转换为字符
        var getChar = function (value) {
            // var c='';
            // switch(value){
            // 	case 10:
            // 	case 11:
            // 	case 12:
            // 	case 13:
            // 	case 14:
            // 	case 15:
            // 		c=String.fromCharCode(value+87);
            // 		break;
            // 	default:
            // 		c=value.toString();
            // 		break;
            // };
            // return c;
            return "0123456789abcdef" [value];
        };
        // 将单通道色度值转换为字符串
        var passToStr = function (value) { //255
            var pre = Math.floor(value / 16);
            var back = value % 16;
            return getChar(pre) + getChar(back);
        };
        return cStr + passToStr(c.r) + passToStr(c.g) + passToStr(c.b);
    };

    // 事件入口
    var enter = function (event) {
        var ev = event || window.event;
        var rect = canvas.getBoundingClientRect();
        var x = ev.clientX - rect.left * (canvas.width / rect.width);
        var y = ev.clientY - rect.top * (canvas.height / rect.height);
        var cDec = getMixedColor(getColorTop(y), getColorBottom(x));
        var cHex = getHexColorString(cDec);
        cHexColor = cHex;
        exit(cHex);
    };

    // 事件出口
    var exit = function (color) {
        $(".color-value").val(color);
        $(".color-value").css("background", color);
    };

    // colorpicker && 初始化
    var create = function (w, h) {
        // init
        var width = w || 180;
        var height = h || 101;
        var ctx = getContext(width, height);

        drawBackground(ctx, width, height);

        // 绑定事件入口
        canvass.bind("click", enter);
    };

    // 解绑事件  不解绑事件的后果:每次create都会为节点绑定事件,一次触发多次执行
    var destroy = function () {
        canvass.unbind("click");
    };

    return {
        create: create,
        destroy: destroy,
    };
};

// 统治所有的 mouseenter & mouseleave 事件 
// 如果在mouseenter作用域内创建,则需要在mouseleave作用域删除
const cp = new createColorPicker();

/*
// 拾色器显示开关
$('#colorpicker').click(function(){
	console.log("over");
	// $("#colorpicker .canvas-box").css("display","block");
	if(boxs==0){
		$("#colorpicker").append(
			"<div class='canvas-box' style='display:none;padding:10px;border:1px solid #ccc;'>"+
			"<canvas id='canvas' style='display:crosshair;'>你的浏览器不支持canvas.</canvas>"+
			"</div>"
		);
		boxs++;
	}
	$("#colorpicker .canvas-box").css("display","block");
	cp.create();
});
$('#colorpicker').mouseleave(function(){
	console.log("out");
	// $("#colorpicker .canvas-box").css("display","none");
	$("div").remove(".canvas-box");
	if(boxs>0) boxs--;
	cp.destroy();
});
*/

// 拾色器显示开关
$("#colorpicker").mouseenter(function () {
    $("#colorpicker .canvas-box").css("display", "block");
    cp.create();
});

$("#colorpicker").mouseleave(function () {
    $("#colorpicker .canvas-box").css("display", "none");
    cp.destroy();
});


// 判断字符串是否是7位颜色字符串
var isColorStr = function (color) {
    // 判断字符是否存在于字符串
    var charInStr = function (ch, str) {
        // 如果字符串中存在与字符相等的，返回true
        for (var i = 0; i < str.length; i++)
            if (ch == str[i])
                return true;
        // 遍历结束，还没有与字符相等的，返回false
        return false;
    };

    if (color.length != 7 || color[0] != "#")
        return false;
    color = color.toLowerCase();
    for (var i = 1; i < color.length; i++) {
        if (!charInStr(color[i], "0123456789abcdef"))
            return false;
    }
    return true;
}


// 输入框输入字符串若符合颜色格式,则取其值
$("#colorpicker .color-value").keyup(function () {
    var input = $("#colorpicker .color-value");
    console.log(input.val());
    if (isColorStr(input.val()))
        input.css("background", input.val());
});

document.querySelector("#color-toggle").addEventListener("click", (event) => {
    console.log("color-toggle pressed: " + cHexColor);
    document.body.style.backgroundColor = cHexColor;
})