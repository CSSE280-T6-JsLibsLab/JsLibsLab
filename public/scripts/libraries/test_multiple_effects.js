R = 0;
x1 = .1;
y1 = .05;
x2 = .25;
y2 = .24;
x3 = 1.6;
y3 = .24;
x4 = 300;
y4 = 200;
x5 = 300;
y5 = 200;
var DI = document.getElementsByTagName("img");
var tag;
DIL = DI.length;

function fly() {
    for (i = 0; i < DIL; i++) {
        DIS = DI[i].style;
        DIS.position = 'absolute';
        DIS.left = Math.sin(R * x1 + i * x2 + x3) * x4 + x5 + "px";
        DIS.top = Math.cos(R * y1 + i * y2 + y3) * y4 + y5 + "px"
    }
    R++
}
let startEffectFlyingPics = function() {
    tag = setInterval('fly()', 10);
}

let clearEffectFlyingPics = function() {
    clearInterval(tag);
    for (i = 0; i < DIL; i++) {
        DI[i].style.position = "static";
    }
};
void(0)

let startEffectEditablePage = function() {
    document.body.contentEditable = 'true';
    document.designMode = 'on';
    window.alert("Edit mode on. You can edit the texts on this page.");
}

let clearEffectEditablePage = function() {
    document.body.contentEditable = 'false';
    document.designMode = 'off';
}

var effectMap = effectMap || new Map();
effectMap.set("Flying", [startEffectFlyingPics, clearEffectFlyingPics])
effectMap.set("Toggle Editable", [startEffectEditablePage, clearEffectEditablePage])