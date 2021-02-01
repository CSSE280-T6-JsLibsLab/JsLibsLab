const cursorDisplayElement = htmlToElement(`<div class="container">
<h1 class='text a'>Lax.js</h1>
<h1 class='text b'>Lax.js</h1>
<h1 class='text c'>Lax.js</h1>
<h1 class='text d'>Lax.js</h1>
<h1 class='text a'>Lax.js</h1>
<h1 class='text b'>Lax.js</h1>
<h1 class='text c'>Lax.js</h1>
<h1 class='text d'>Lax.js</h1>
<h1 class='text a'>Lax.js</h1>
<h1 class='text b'>Lax.js</h1>
<h1 class='text c'>Lax.js</h1>
<h1 class='text d'>Lax.js</h1>
<h1 class='text a'>Lax.js</h1>
<h1 class='text b'>Lax.js</h1>
<h1 class='text c'>Lax.js</h1>
<h1 class='text d'>Lax.js</h1>
<h1 class='text a'>Lax.js</h1>
<h1 class='text b'>Lax.js</h1>
<h1 class='text c'>Lax.js</h1>
<h1 class='text d'>Lax.js</h1>
</div>`)

const cursorStyles = htmlToElement(`<style>
body {
    padding: 0;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

.text {
    width: 100vw;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    margin-top: calc(50vh - 40px);
    z-index: 1000;
    font-size: 100px;
    transform-origin: 50% 50%;
  }

  .text.a {
    color: #a94fe4;
  }

  .text.b {
    color: #68e4f1;
  }

  .text.c {
    color: #ffe773;
  }

  .text.d {
    color: #f544ad;
  }

  .container {
    background-color: #f5922c;
    width: 100%;
    height: 100vh;
  }
</style>`);

startCursorEffect = function () {
    lax.init()

    document.querySelector("body").append(cursorStyles);
    document.querySelector(".container-fluid").prepend(cursorDisplayElement);

    // Setup mouse move listener
    document.addEventListener('mousemove', function (e) {
        lax.__cursorX = e.clientX
        lax.__cursorY = e.clientY
    }, false)

    // Add lax driver for cursorX
    lax.addDriver('cursorX', function () {
        return lax.__cursorX || 0
    })

    // Add lax driver for cursorY
    lax.addDriver('cursorY', function () {
        return lax.__cursorY || 0
    })

    // Add lax driver for cursorXY
    lax.addDriver('cursorDistanceFromCenter', function () {
        var pageHeight = document.body.scrollHeight
        var pageWidth = document.body.scrollWidth

        var pageCenterX = pageWidth / 2
        var pageCenterY = pageHeight / 2

        var absDistanceFromCenterY = Math.abs((lax.__cursorY || 0) - pageCenterY) / pageCenterY
        var absDistanceFromCenterX = Math.abs((lax.__cursorX || 0) - pageCenterX) / pageCenterX

        return absDistanceFromCenterX + absDistanceFromCenterY
    })

    lax.addElements(".text", {
        'cursorX': {
            "translateX": [
                [0, 'screenWidth'],
                ['index * 10', 'index * -10'],
            ],
        },
        'cursorY': {
            "translateY": [
                [0, 'screenHeight'],
                ['index * 10', 'index * -10'],
            ],
        },
        'cursorDistanceFromCenter': {
            "scale": [
                [0, 1],
                [1, '1 + (index * 0.05 )'],
            ],
        }
    })

    lax.addElements(".container", {
        'cursorX': {
            "filter": [
                [0, 'screenWidth'],
                [0, 'screenWidth/2'],
                {
                    "cssFn": (val) => {
                        return `hue-rotate(${val % 360}deg)`
                    }
                }
            ],
        },
    })
}

clearCursorEffect = function() {
    document.querySelector("body").removeChild(cursorStyles);
    document.querySelector(".container-fluid").removeChild(cursorDisplayElement);

}
var effectMap = effectMap || new Map();
effectMap.set("Cursor", [startCursorEffect, clearCursorEffect]);