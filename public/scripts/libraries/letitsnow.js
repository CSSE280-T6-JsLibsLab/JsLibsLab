// Cross-browser-compliant
requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 60);
    };
 
/**
 * Snow Class
 * @param {int}   x      
 * @param {int}   y      
 * @param {int}   radius 
 * @param {Function} fn     Formular to calculate x pos and y pos
 */
function Snow(x, y, radius, fn) {
    this.x = x;
    this.y = y;
    this.r = radius;
    this.fn = fn;
}
Snow.prototype.update = function () {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);
 
    if (this.x > window.innerWidth ||
        this.x < 0 ||
        this.y > window.innerHeight ||
        this.y < 0
    ) {
        this.x = getRandom('x');
        this.y = 0;
    }
}
Snow.prototype.draw = function (cxt) {
    var grd = cxt.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    grd.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    grd.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
    grd.addColorStop(1, "rgba(255, 255, 255, 0)");
    cxt.fillStyle = grd;
    cxt.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
}
 
/**
 * Snowlist class
 * Container to hold snow objects
 */
SnowList = function () {
    this.list = [];
}
SnowList.prototype.push = function (snow) {
    this.list.push(snow);
}
SnowList.prototype.update = function () {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].update();
    }
}
SnowList.prototype.draw = function (cxt) {
    for (var i = 0, len = this.list.length; i < len; i++) {
        this.list[i].draw(cxt);
    }
}
SnowList.prototype.get = function (i) {
    return this.list[i];
}
SnowList.prototype.size = function () {
    return this.list.length;
}
 
/**
 * Generate random x-pos, y-pos or fn functions
 * @param  {string} option x|y|fnx|fny
 * @return {int|Function} 
 */
function getRandom(option) {
    var ret, random;
    switch (option) {
        case 'x':
            ret = Math.random() * window.innerWidth;
            break;
        case 'y':
            ret = Math.random() * window.innerHeight;
            break;
        case 'r':
            ret = 2 + (Math.random() * 6);
            break;
        case 'fnx':
            random = 27 + Math.random() * 100;
            ret = function (x, y) {
                return x + 0.5 * Math.sin(y / random);
            };
            break;
        case 'fny':
            random = 0.4 + Math.random() * 1.4
            ret = function (x, y) {
                return y + random;
            };
            break;
    }
    return ret;
}
 
// Start snow


let startSnowEffect = function () {
    // Create canvas
    var cxt;
    var canvas = document.createElement('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;');
    canvas.setAttribute('id', 'canvas_snow');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    cxt = canvas.getContext('2d');
    // Create snow objects
    var snowList = new SnowList();
    for (var i = 0; i < 200; i++) {
        var snow, randomX, randomY, randomR, randomFnx, randomFny;
        randomX = getRandom('x');
        randomY = getRandom('y');
        randomR = getRandom('r');
        randomFnx = getRandom('fnx');
        randomFny = getRandom('fny');
        snow = new Snow(randomX, randomY, randomR, {
            x: randomFnx,
            y: randomFny
        });
        snow.draw(cxt);
        snowList.push(snow);
    }
    // Update snow position data, and redraw them in each frame
    requestAnimationFrame(function () {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        snowList.update();
        snowList.draw(cxt);
        requestAnimationFrame(arguments.callee);
    })
}

let endSnowEffect = function() {
    document.getElementsByTagName('body')[0].removeChild(document.querySelector("#canvas_snow"));
}



// Handle window resize
window.onresize = function () {
    var canvasSnow = document.getElementById('canvas_snow');
    canvasSnow.width = window.innerWidth;
    canvasSnow.height = window.innerHeight;
}

// Let it snow O(”_”)0
//startSnow();

var effectMap = effectMap || new Map();
effectMap.set("Snow", [startSnowEffect, endSnowEffect])