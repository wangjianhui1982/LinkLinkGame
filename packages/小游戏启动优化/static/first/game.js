const pf = globalThis.tt || globalThis.ks || globalThis.wx;

function __initApp() {  // init app
    globalThis.__wxRequire = require;  // FIX: require cannot work in separate engine 
    const createCanvas = pf.createCanvas;
    let canvas = pf.__first__canvas = createCanvas();
    let first = true;
    pf.createCanvas = function () {
        if (first) {
            first = false;
            return wx.__first__canvas;
        } else {
            return createCanvas();
        }
    }

    const firstScreen = require('./first-screen');
    // Adapt for IOS, swap if opposite
    const info = pf.getSystemInfoSync();

    if (canvas) {
        var _w = canvas.width;
        var _h = canvas.height;
        if (info.screenWidth < info.screenHeight) {
            if (canvas.width > canvas.height) {
                _w = canvas.height;
                _h = canvas.width;
            }
        } else {
            if (canvas.width < canvas.height) {
                _w = canvas.height;
                _h = canvas.width;
            }
        }
        canvas.width = _w;
        canvas.height = _h;
    }
    // Adjust initial canvas size
    if (canvas && info.devicePixelRatio >= 2) { canvas.width *= info.devicePixelRatio; canvas.height *= info.devicePixelRatio; }

    firstScreen.start('default', 'default', 'false').then(() => {
        if (pf.loadSubpackage) {
            const task = pf.loadSubpackage({
                name: 'engine',
                success: () => {
                    firstScreen.end();
                }
            });
            task.onProgressUpdate((res) => {
                firstScreen.setProgress(0.5 * res.progress / 100);
            });
        } else {
            require('./subpackages/engine/game');
        }
    }).catch((err) => {
        console.error(err);
    });
}  // init app


var sysInfo = pf.getSystemInfoSync();
if (sysInfo.platform.toLocaleLowerCase() === 'android') {
    GameGlobal.requestAnimationFrame(__initApp);
} else {
    __initApp();
}