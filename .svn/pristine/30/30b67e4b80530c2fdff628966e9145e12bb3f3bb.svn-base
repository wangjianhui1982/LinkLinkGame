const PKG_NAME = 'minigame-launch-fast';
const CONFIG_FILE_DIR = 'settings';
const CONFIG_FILE_NAME = `${PKG_NAME}.json`;
const LOG = `[${PKG_NAME}]`;

const mfs = require('./util/mfs');

function onBuildFinish(options, callback) {
    if ('mini-game' === options.platform) {
        const config = getConfig();
        if (!config.launchFast) {
            Editor.log(LOG, '小游戏启动优化未开启');
            callback && callback();
            return;
        }
        Editor.log(LOG, '小游戏首屏启动优化开始');
        // 首屏优化
        // 1. 移动引擎文件
        const enginePath = mfs.join(options.dest, 'subpackages', 'engine');
        // 复制assets的脚本文件
        const assets = mfs.readdirAllSync(mfs.join(options.dest, 'assets'));
        assets.forEach((item) => {
            if (mfs.extname(item) === '.js' || endWith(item, '.js.map')) {
                const relativePath = mfs.relative(options.dest, item);
                const newPath = mfs.join(enginePath, relativePath);
                mfs.mkdirSync(mfs.parse(newPath).dir);
                mfs.renameSync(item, newPath);
            }
        });
        // 复制cocos文件夹
        const cocosDest = mfs.join(enginePath, 'cocos');
        mfs.rmSync(cocosDest);
        mfs.renameSync(mfs.join(options.dest, 'cocos'), cocosDest);
        // 复制src文件夹
        const srcDest = mfs.join(enginePath, 'src');
        mfs.rmSync(srcDest);
        mfs.renameSync(mfs.join(options.dest, 'src'), srcDest);
        // 复制引擎文件
        const files = mfs.readdirSync(options.dest);
        const extFiles = ['assets', 'subpackages', 'game.json', 'project.config.json', 'remote'];
        let templatesFiles;
        const templatesPath = mfs.join(options.project, 'build-templates', options.actualPlatform);
        if (mfs.existsSync(templatesPath)) {
            templatesFiles = mfs.readdirSync(templatesPath);
        } else {
            templatesFiles = [];
        }
        files.forEach((item) => {
            if (extFiles.indexOf(item) !== -1 || templatesFiles.indexOf(item) !== -1) {
                return;
            }
            const newPath = mfs.join(enginePath, item);
            mfs.mkdirSync(mfs.parse(newPath).dir);
            mfs.renameSync(mfs.join(options.dest, item), newPath);
        });
        // 加入定制文件
        mfs.copySync(mfs.join(options.project, 'settings', config.imageFile), mfs.join(options.dest, config.imageFile));
        // 移动game.js
        mfs.copySync(mfs.join(__dirname, 'static', 'first', 'game.js'), mfs.join(options.dest, 'game.js'));
        // 处理first.js
        const firstJS = mfs.readFileSync(mfs.join(__dirname, 'static', 'first', 'first-screen.js'), 'utf-8')
            .replace('__BG_COLOR_R__', `${config.bgColor[0]}/255`)
            .replace('__BG_COLOR_G__', `${config.bgColor[1]}/255`)
            .replace('__BG_COLOR_B__', `${config.bgColor[2]}/255`)
            .replace('__IMAGE_NAME__', `'${config.imageFile}'`)
            .replace('__IMAGE_RATIO__', `${config.imageRatio}`)
            .replace('__IMAGE_MODE__', `'${config.imageMode}'`)
            .replace('__BAR_RATIO__', config.barRatio)
            .replace('__BAR_OFFSET__', config.barOffset)
            .replace('__BAR_COLOR_R__', `${config.barColor[0]}/255`)
            .replace('__BAR_COLOR_G__', `${config.barColor[1]}/255`)
            .replace('__BAR_COLOR_B__', `${config.barColor[2]}/255`)
            .replace('__BAR_COLOR_A__', `${config.barColor[3]}`)
            .replace('__BAR_BG_COLOR_R__', `${config.barBgColor[0]}/255`)
            .replace('__BAR_BG_COLOR_G__', `${config.barBgColor[1]}/255`)
            .replace('__BAR_BG_COLOR_B__', `${config.barBgColor[2]}/255`)
            .replace('__BAR_BG_COLOR_A__', `${config.barBgColor[3]}`);
        mfs.writeFileSync(mfs.join(options.dest, 'first-screen.js'), firstJS);
        const gameConfig = JSON.parse(mfs.readFileSync(mfs.join(options.dest, 'game.json')));
        if (!gameConfig.subpackages) {
            gameConfig.subpackages = [];
        }
        let addSub = true;
        gameConfig.subpackages.forEach(item => {
            if (item.name === 'engine') {
                addSub = false;
            }
        });
        let save = false;
        if (gameConfig.plugins && gameConfig.plugins.cocos) {
            gameConfig.plugins.cocos.path = 'subpackages/engine/cocos'
            save = true;
        }
        if (addSub) {
            gameConfig.subpackages.push({ name: 'engine', root: 'subpackages/engine' });
            save = true;
        }
        if (save) {
            mfs.writeFileSync(mfs.join(options.dest, 'game.json'), JSON.stringify(gameConfig));
        }
    }
    Editor.log(LOG, '小游戏启动优化结束');
    callback();
}

function saveConfig(config) {
    // 查找目录
    const projectPath = Editor.Project.path || Editor.projectPath;
    const configFilePath = mfs.join(projectPath, CONFIG_FILE_DIR, CONFIG_FILE_NAME);
    let object = {};
    if (mfs.existsSync(configFilePath)) {
        object = JSON.parse(mfs.readFileSync(configFilePath, 'utf8'));
    }
    // 写入配置
    for (const key in config) {
        object[key] = config[key];
    }
    mfs.writeFileSync(configFilePath, JSON.stringify(object, null, 4));
    return configFilePath;
}


function getConfig() {
    const projectPath = Editor.Project.path || Editor.projectPath;
    const configFilePath = mfs.join(projectPath, CONFIG_FILE_DIR, CONFIG_FILE_NAME);
    let config = null;
    if (mfs.existsSync(configFilePath)) {
        config = JSON.parse(mfs.readFileSync(configFilePath, 'utf8'));
    } else {
        config = {};
    }
    return Object.assign({
        launchFast: true,
        bgColor: [0, 0, 0, 1],
        imageFile: 'first.jpg',
        imageRatio: 0.5,
        imageMode: 1,
        barRatio: 0.45,
        barOffset: -0.25,
        barBgColor: [100, 111, 118, 1],
        barColor: [61, 197, 222, 1]
    }, config);
}

function endWith(str, endStr) {
    if (str.length < endStr.length) {
        return false;
    }
    const len = str.length - endStr.length;
    return str.lastIndexOf(endStr) === len;
}

module.exports = {
    load() {
        Editor.Builder.on('build-finished', onBuildFinish);
    },

    unload() {
        Editor.Builder.removeListener('build-finished', onBuildFinish);
    },

    messages: {

        'open-panel'() {
            Editor.Panel.open(PKG_NAME);
            Editor.log(LOG, '打开设置窗口');
        },

        'save-config'(event, config) {
            saveConfig(config);
            event.reply(null, true);
            Editor.log(LOG, '配置存储成功');
        },

        'read-config'(event) {
            let config = getConfig();
            event.reply(null, config);
            Editor.log(LOG, '配置读取成功', config);
        }
    },
};