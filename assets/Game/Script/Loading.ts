import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { HttpUtil } from "./HttpUtil";
import touch_loading from "./touch_loading";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

const GameInfo_http = "https://admin.tmoretek.cn/wxadmin/protocol/saveGameInfo";
// const GameInfo_http = "http://192.168.0.5:9090/wxadmin/protocol/saveGameInfo";


// const url_http = "http://192.168.2.100:16888/quweifangkuaixiaoxiao/getadtype";
// const url_http = "https://121.40.188.126:16888/quweifangkuaixiaoxiao/getadtype";
// const url_http = "https://sjd.xqapp.cn:16888/quweifangkuaixiaoxiao/getadtype";
const url_http = "https://admin.tmoretek.cn/wxadmin/protocol/getAdType";
// const url_http = "http://192.168.0.5:9090/wxadmin/protocol/getAdType";

let data = {
    gid: 143,
    ver: '1.0.0'
}

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Prefab)
    Wzhcq_loadingPrefab: cc.Prefab = null;

    @property(cc.Node)
    Wzhcq_ProgressBarLabel: cc.Node = null;

    @property(cc.ProgressBar)
    Wzhcq_loadingPregress: cc.ProgressBar = null;

    Wzhcq_loadingNode: any;
    Wzhcq_speed: any; //进度条时间
    Wzhcq_isShow: any;
    Wzhcq_loadJSONFrinsh = false;
    Wzhcq_Subpackage = false;
    Wzhcq_localStorage = false;
    Wzhcq_isfrist = true;
    Wzhcq_all_completedCount = 0;
    Wzhcq_version = 0;
    Wzhcq_requestIndex = 0;

    type = 0;

    protected onLoad(): void {
        this.Wzhcq_speed = 0.8;
        this.Wzhcq_isShow = true; //是否显示进度条
        this.Wzhcq_loadingPregress.progress = 0; //进度条
        this.Wzhcq_requestIndex = 0;

        if (!this.Wzhcq_loadingNode) {
            this.Wzhcq_loadingNode = cc.instantiate(this.Wzhcq_loadingPrefab);
            this.Wzhcq_loadingNode.parent = this.node;
        }
        Utils.getInstance.goInLonding = Math.round(new Date().getTime());
        console.log("进入londing时间：", Utils.getInstance.goInLonding)

        this.createGroup();

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let LaunchOptionsSync = wx.getLaunchOptionsSync();

            Utils.getInstance.sceneID = LaunchOptionsSync.scene;
            Utils.getInstance.bannerTime = Math.round(new Date().getTime() / 1000);

            console.log("LaunchOptionsSync:", LaunchOptionsSync);
            console.log("LaunchOptionsSync.scene:", LaunchOptionsSync.scene);

            Utils.getInstance.accountInfo = wx.getAccountInfoSync();
            console.log(Utils.getInstance.accountInfo.miniProgram) // 小程序 appId

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_version2, Utils.getInstance.accountInfo.miniProgram.version);

            let SystemInfoSync = wx.getSystemInfoSync();
            console.log("SystemInfoSync:", SystemInfoSync);

            wx.getSystemInfo({
                success(res) {
                    console.log("model:", res.model)
                    console.log("pixelRatio:", res.pixelRatio)
                    console.log("windowWidth:", res.windowWidth)
                    console.log("windowHeight:", res.windowHeight)
                    console.log("Width:", res.windowWidth * res.pixelRatio)
                    console.log("Height:", res.windowHeight * res.pixelRatio)
                    console.log("language:", res.language)
                    console.log("version:", res.version)
                    console.log("platform:", res.platform)

                    Utils.getInstance.pixelRatioWidth = res.windowWidth;
                    Utils.getInstance.pixelRatioHeight = res.windowHeight;
                }
            })
        }

        // 获取游戏可见宽高
        const gameCanvas = cc.view.getVisibleSize();
        const gameWidthX = gameCanvas.width;
        const gameHeightX = gameCanvas.height;
        console.log('gameVisibleSize = ' + gameWidthX + "*" + gameHeightX);

        let designSize = cc.view.getDesignResolutionSize();
        const width = designSize.width;
        const height = designSize.height;
        console.log('getDesignResolutionSize = ' + width + "*" + height);

        let frame = cc.view.getFrameSize();
        const fitWidth = frame.width;
        const fitHeight = frame.height;
        console.log('getFrameSize = ' + fitWidth + "*" + fitHeight);

        Utils.getInstance.jishi_redDot = 1;
        Utils.getInstance.rank_redDot = 1;

        this.passiveShare();
        this.checkStorageData();
        this.checkTomorrowNewPlayer();

        let Wzhcq_guide = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Guide);
        if (Wzhcq_guide) {
        }

        let view = cc.view.getFrameSize();
        if (view.height / view.width < 1.7) {
            this.node.getComponent(cc.Canvas).fitWidth = true;
            this.node.getComponent(cc.Canvas).fitHeight = true;
        }
        else {
            this.node.getComponent(cc.Canvas).fitWidth = true;
            this.node.getComponent(cc.Canvas).fitHeight = false;
        }
    }

    createGroup() {
        let uuidGroupIdx = Utils.getInstance.Wzhcq_getItem("uuidGroupIdx");
        console.error("uuidGroupIdx:", uuidGroupIdx);

        if (uuidGroupIdx == null || uuidGroupIdx == undefined || uuidGroupIdx == "") {
            let obj = {};
            for (let index = 0; index < 1; index++) {
                let uuid = this.PseudoUUID();
                console.error("UUID:", uuid);

                let group = uuid.charAt(uuid.length - 1);
                console.error("UUID group:", group);

                Utils.getInstance.Wzhcq_setItem("uuid", uuid);
                Utils.getInstance.Wzhcq_setItem("uuidGroupIdx", group);

                const user_create_time = new Date().getTime() / 1000;
                Utils.getInstance.Wzhcq_setItem("user_create_time", Math.floor(user_create_time));

                // if(obj.hasOwnProperty(group)) {
                //     obj[group].push(uuid);
                // }
                // else {
                //     obj[group] = [];
                // }
            }
            // console.error("obj:",obj);
        }
        Utils.getInstance.uuidGroupIdx = Utils.getInstance.Wzhcq_getItem("uuidGroupIdx");
    }

    PseudoUUID() {
        var array = [];
        var hexDigits = '0123456789';
        for (var i = 0; i < 36; i++) {
            array[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        array[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
        array[19] = hexDigits.substr((array[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        array[8] = array[13] = array[18] = array[23] = '-';
        var uuid = array.join('');
        return uuid;
    };

    start() {
        this.loadSubpackage();
        Utils.getInstance.reportScene();
    }

    loadSubpackage () {
        let self = this;
        cc.loader.downloader.loadSubpackage('Texture', function (err) {
            if (err) {
                return;
            }
            cc.loader.downloader.loadSubpackage('Audio', function (err) {
                if (err) {
                    return;
                }
                cc.loader.downloader.loadSubpackage('Font', function (err) {
                    if (err) {
                        return;
                    }
                    cc.loader.downloader.loadSubpackage('paintBoard', function (err) {
                        if (err) {
                            return;
                        }
                        self.loadRequest();
    
                    })
                })
            })
        })
    }

    loadRequest() {
        let self = this;
        HttpUtil.GET(url_http, data)
            .then((res: any) => {
                if (res) {
                    Utils.getInstance.cfgData = JSON.parse(res).data;
                    Utils.getInstance.user_group = JSON.parse(res).data.user_group;
                    Utils.getInstance.report_user_group = JSON.parse(res).data.report_user_group;
                    Utils.getInstance.level_start = parseInt(JSON.parse(res).data.level_start);
                    Utils.getInstance.level_end = parseInt(JSON.parse(res).data.level_end);
                }
                else {
                    Utils.getInstance.cfgData = {
                        c1: "eliminateStrategy",
                        c2: "eliminateStrategy2",
                        user_group: "c1,c1,c1,c1,c1,c2,c2,c2,c2,c2"
                    }
                    Utils.getInstance.user_group = "c1,c1,c1,c1,c1,c2,c2,c2,c2,c2";
                    Utils.getInstance.report_user_group = 0;
                    Utils.getInstance.level_start = 6;
                    Utils.getInstance.level_end = 16;
                }

                Utils.getInstance.sjd_login();
                self.loadEnd_ToGame();
            }).catch(() => {
                setTimeout(() => {
                    self.loadRequest();
                }, 5000);
            })
    }

    checkStorageData() {
        let _getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_StorageDataDay);
        let getCurTime = Utils.getInstance.getCurTime();

        let StorageData = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_StorageData);
        if (StorageData > 0) {
            if (_getCurTime != getCurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_StorageData, 0);
            }
        }
        else {
            if (_getCurTime != getCurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_StorageData, 0);
            }
        }
    }

    checkTomorrowNewPlayer() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayerDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);
        if (Wzhcq_TomorrowNewPlayer > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer, 0);
            }
        }
    }

    loadEnd_ToGame() {
        let Wzhcq_guide = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Guide);
        if (Wzhcq_guide) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer, 1);

            let Wzhcq_CurTime = Utils.getInstance.getCurTime();
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayerDay, Wzhcq_CurTime);

            let czhlDownTime = Math.round(new Date().getTime() / 1000);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_czhlDownTime, czhlDownTime);

            this.type = 1;
            this.loadScene();
        }
        else {
            let Wzhcq_StorageData = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_StorageData);
            if (Wzhcq_StorageData > 0) {
                let Wzhcq_Storage_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_GameType);
                let Wzhcq_Storage_MahjongList = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList);
                if (Object.keys(Wzhcq_Storage_MahjongList).length > 0) {
                    Utils.getInstance.GameType = Wzhcq_Storage_GameType;

                    this.type = 1;
                    this.loadScene();
                }
                else {
                    this.type = 0;
                    this.loadScene();
                }
            }
            else {
                this.type = 0;
                this.loadScene();
            }
        }
    }

    loadScene () {
        Utils.getInstance.goInGame = Math.round(new Date().getTime());
        console.log("进入Game 时间：", Utils.getInstance.goInGame);
        console.log("londing时间：", Utils.getInstance.goInGame - Utils.getInstance.goInLonding);

        if (this.type) {
            cc.director.loadScene('Game');
        }
        else {
            cc.director.loadScene('Start');
        }
    }

    passiveShare() {
        // 监听小程序右上角菜单的「转发」按钮
        if (typeof wx === 'undefined') {
            return;
        }

        // 显示当前页面的转发按钮
        wx.showShareMenu({
            success: (res) => {
                console.log('开启被动转发成功！');
            },
            fail: (res) => {
                console.log(res);
                console.log('开启被动转发失败！');
            }
        });

        var Wzhcq_image_share_common = "images/common_share_img.png";
        // 获取当前棋局oneChess信息，JSON.stringfy()后传入query
        wx.onShareAppMessage(() => {
            Utils.getInstance.InterstitialAd_upTime = Math.round(new Date().getTime() / 1000);

            let Wzhcq_strArray = ["麻将对对碰，都在玩的网红小游戏！", "上厕所玩这个，腿都麻了！", "能过二关的我就服他！", "你能把麻将全挪走吗？"];
            return {
                title: Wzhcq_strArray[Math.floor(Math.random() * 4)],
                imageUrl: Wzhcq_image_share_common,        // 分享图片要放在 wechatgame/res/raw-assets 路径下   cc.url.raw('img.png'),
                query: 'shareMsg=' + '分享卡片上所带的信息'  // query最大长度(length)为2048
            }
        });

        // 绑定分享参数
        wx.onShareTimeline(() => {
            return {
                title: '转发标题',
                imageUrl: '', // 图片 URL
                query: 'a=1&b=2'
            }
        })
        // 取消绑定分享参数
        wx.offShareTimeline()

    }

    update(dt: any) {
        this.Wzhcq_updateProgressBar(this.Wzhcq_loadingPregress, dt);
    }

    //进度条
    Wzhcq_updateProgressBar(Wzhcq_progressBar: any, dt: any) {

        let Wzhcq_progress = Wzhcq_progressBar.progress;
        if (Wzhcq_progress < 1.0 && this.Wzhcq_isShow) {
            Wzhcq_progress += dt * this.Wzhcq_speed;
            if (parseInt(String(Wzhcq_progress * 100)) < 100) {
                this.Wzhcq_ProgressBarLabel.getComponent(cc.Label).string = "努力加载中" + parseInt(String(Wzhcq_progress * 100)) + "%";
            }
            else {
                this.Wzhcq_ProgressBarLabel.getComponent(cc.Label).string = "努力加载中100" + "%";
                console.log("努力加载中100");

                this.scheduleOnce(() => {
                    this.Wzhcq_ProgressBarLabel.getComponent(cc.Label).string = "等待网络连接中。。。";
                }, 1);
            }

        }
        Wzhcq_progressBar.progress = Wzhcq_progress;
    }
}
