import Achieve from "./Achieve";
import AudioManager from "./AudioManager";
import Energy from "./Energy";
import { Wzhcq_StorageName } from "./Enum";
import Recommend from "./Recommend";
import Tips from "./Tips";
import { WxPlatform } from "./WxPlatform";
import { Utils } from "./Utils";
import BaseComponent from "./BaseComponent";
import ResourceLoader from "./ResourceLoader";

const { ccclass, property } = cc._decorator;

let moveGroup = [
    { "Id": 28, "Suit": 0, "Num": 8, position: cc.v3(-245, 86) },
    { "Id": 10, "Suit": 4, "Num": 1, position: cc.v3(-175, 86) },
    { "Id": 8, "Suit": 2, "Num": 8, position: cc.v3(-105, 86) },
    { "Id": 0, "Suit": 3, "Num": 1, position: cc.v3(-35, 86) },
    { "Id": 18, "Suit": 1, "Num": 8, position: cc.v3(35, 86) },
    { "Id": 5, "Suit": 2, "Num": 5, position: cc.v3(105, 86) },
    { "Id": 25, "Suit": 0, "Num": 5, position: cc.v3(175, 86) },
    { "Id": 2, "Suit": 2, "Num": 2, position: cc.v3(245, 86) },

    { "Id": 25, "Suit": 0, "Num": 5, position: cc.v3(-245, 0) },
    { "Id": 10, "Suit": 4, "Num": 1, position: cc.v3(-175, 0) },
    { "Id": 20, "Suit": 5, "Num": 1, position: cc.v3(-105, 0) },
    { "Id": 0, "Suit": 3, "Num": 1, position: cc.v3(-35, 0) },
    { "Id": 20, "Suit": 5, "Num": 1, position: cc.v3(35, 0) },
    { "Id": 22, "Suit": 0, "Num": 2, position: cc.v3(105, 0) },
    { "Id": 2, "Suit": 2, "Num": 2, position: cc.v3(175, 0) },
    { "Id": 8, "Suit": 2, "Num": 8, position: cc.v3(245, 0) },

    { "Id": 5, "Suit": 2, "Num": 5, position: cc.v3(-245, -86) },
    { "Id": 10, "Suit": 4, "Num": 1, position: cc.v3(-175, -86) },
    { "Id": 10, "Suit": 4, "Num": 1, position: cc.v3(-105, -86) },
    { "Id": 15, "Suit": 1, "Num": 5, position: cc.v3(-35, -86) },
    { "Id": 18, "Suit": 1, "Num": 8, position: cc.v3(35, -86) },
    { "Id": 15, "Suit": 1, "Num": 5, position: cc.v3(105, -86) },
    { "Id": 22, "Suit": 0, "Num": 2, position: cc.v3(175, -86) },
    { "Id": 28, "Suit": 0, "Num": 8, position: cc.v3(245, -86) }
];

@ccclass
export default class Start extends BaseComponent {

    @property(cc.Node)
    Wzhcq_heardArray: cc.Node[] = [];

    @property(cc.Prefab)
    Wzhcq_settingPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_energyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_addDesktopPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_heartPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_tipsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_PaiPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_PaiBackPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_rankPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_recommendPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_achievePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_reward_propPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    tujianPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_dailyLoginPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_chaozhihaoliPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_MeiRiTiaoZhanPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_PropShuffleTilesPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_PropTipsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_PropRewardPrefab: cc.Prefab = null;

    @property(cc.Node)
    Wzhcq_getuserInfo: cc.Node = null;

    @property(cc.Node)
    Wzhcq_time: cc.Node = null;

    @property(cc.Node)
    Wzhcq_JianDanNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_KunNanNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_DiyvNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_lifeNum: cc.Node = null;

    @property(cc.Node)
    Wzhcq_CustomAdNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_stepMask: cc.Node = null;

    @property(cc.Node)
    Wzhcq_finger: cc.Node = null;

    @property(cc.Node)
    Wzhcq_click_effect: cc.Node = null;

    @property(cc.Node)
    Wzhcq_layout: cc.Node = null;

    @property(cc.Node)
    Wzhcq_mahjong_layout: cc.Node = null;

    @property(cc.Node)
    Wzhcq_mahjongBack_layout: cc.Node = null;

    @property(cc.Node)
    Wzhcq_videoNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_heartNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_jishi_redDotNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_rank_redDotNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_addDeskRedDotNode: cc.Node = null;

    @property(cc.SpriteFrame)
    Wzhcq_maskSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Node)
    Wzhcq_tips: cc.Node[] = [];

    @property(cc.Label)
    Wzhcq_all_rank_label: cc.Label = null;

    @property(cc.Label)
    Wzhcq_nuolegenuoCount: cc.Label = null;

    @property(cc.SpriteFrame)
    Wzhcq_releaseSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    Wzhcq_testSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Label)
    Wzhcq_Level: cc.Label = null;

    @property(cc.Node)
    Wzhcq_downTimeNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_czhlReddot: cc.Node = null;

    @property(cc.Node)
    meiritiaozhanNum: cc.Node = null;

    @property(cc.Node)
    meiritiaozhanBtn: cc.Node = null;

    @property(cc.Node)
    startGameBtn: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    @property(cc.JsonAsset)
    cardData: cc.JsonAsset = null;

    @property(cc.Label)
    boardLevel: cc.Label = null;

    @property(cc.Sprite)
    boardSprite: cc.Sprite = null;

    @property(cc.Prefab)
    paintBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    leftNode: cc.Node = null;

    @property(cc.Node)
    rightNode: cc.Node = null;

    @property(cc.Node)
    tujianBtn: cc.Node = null;

    Wzhcq_settingNode: any;
    Wzhcq_energyNode: any;
    Wzhcq_rankNode: any;
    Wzhcq_recommendNode: any;
    Wzhcq_achieveNode: any;
    Wzhcq_reward_propNode: any;
    Wzhcq_addDesktopNode: any;
    Wzhcq_dailyLoginNode: any;
    Wzhcq_chaozhihaoliNode: any;
    Wzhcq_MeiRiTiaoZhan: any;
    Wzhcq_PropRewardNode: any;
    tujianNode: any;
    paintBoardNode: any;

    Wzhcq_life = 0;
    Wzhcq_intervalTime: number;
    Wzhcq_isDownTime: boolean;
    Wzhcq_countdownSecond: number;
    Wzhcq_mahjongArray = [];
    Wzhcq_mahjongBackArray = [];
    Wzhcq_isclick = true;

    czhl_isDownTime = false;
    czhl_intervalTime = -1;
    czhl_countdownSecond = Utils.getInstance.czhl_constDownTime;
    level: any = 0;

    onLoad() {
        this.Wzhcq_countdownSecond = 0
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_intervalTime = -1;
        Utils.getInstance.GameType = 0;

        this.czhl_countdownSecond = Utils.getInstance.czhl_constDownTime
        this.czhl_isDownTime = false;
        this.czhl_intervalTime = -1;

        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_ENERGY, this.Wzhcq_updateEnergy, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSICSTATE, this.Wzhcq_updateMusic, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, this.Wzhcq_gameTips, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_REDDOT, this.Wzhcq_updateRedDot, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RECOMMEND, this.Wzhcq_createRecommend, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_ACHIEVE, this.Wzhcq_createAchieve, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REWARD_PROP, this.Wzhcq_reward_prop, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROP, this.Wzhcq_updatePropState, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RANK, this.Wzhcq_create_rank, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_CHAOZHIHAOLI, this.updateVideoState, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_GAMEPROP, this.Wzhcq_PropReward, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSEMRTZ, this.initData, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.UPDATEBOARDSPRITE, this.updateBoardSprite, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, this.createPaintBoard, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.GOINGAME, this.pointBoardGoInGame, this);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            // console.log("游戏进入后台");
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            // console.log("重新返回游戏");
            // if (this.czhl_countdownSecond < 1) {
            //     this.czhl_isDownTime = false;
            //     this.Wzhcq_downTimeNode.parent.active = false;
            //     this.czhl_countdownSecond = Utils.getInstance.czhl_constDownTime;
            //     Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 1);
            // }

            this.updateVideoState();
        }, this);

        this.Wzhcq_UpdateGameData();

        // this.resetEnergy();
        this.Wzhcq_initEnergy();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_REDDOT, undefined);

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (Utils.getInstance.accountInfo.miniProgram.envVersion == "release") {
                this.Wzhcq_JianDanNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[0];
                this.Wzhcq_KunNanNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[1];
                this.Wzhcq_DiyvNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[2];
            }
            else {
                this.Wzhcq_JianDanNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
                this.Wzhcq_KunNanNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
                this.Wzhcq_DiyvNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
            }
        }
        else {
            this.Wzhcq_JianDanNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
            this.Wzhcq_KunNanNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
            this.Wzhcq_DiyvNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
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

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            if (!WxPlatform.getInstance.rewardVideoState) {
                WxPlatform.getInstance.rewardVideoState = true;
                WxPlatform.getInstance.createRewardVideo();
            }
        }

    }

    createPaintBoard() {
        if (!this.paintBoardNode) {
            this.paintBoardNode = cc.instantiate(this.paintBoardPrefab);
            this.paintBoardNode.parent = this.node;
            this.paintBoardNode.zIndex = 60;
        }
        this.paintBoardNode.active = true;
    }

    resetEnergy() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_resetEnergyDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let resetEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_resetEnergy);
        if (resetEnergy > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_resetEnergy, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_resetEnergy, 0);
            }
        }

        let resetEnergy2 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_resetEnergy);
        if (resetEnergy2 < 1) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_resetEnergy, 1);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, 10);

            let Wzhcq_getCurTime = Utils.getInstance.getCurTime();
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_resetEnergyDay, Wzhcq_getCurTime);
        }
        else {

        }
    }

    isTiaoZhanSuccess() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccessDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let tiaozhanSuccess = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccess);
        if (tiaozhanSuccess > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccess, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccess, 0);
            }
        }

        let tiaozhanSuccess2 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccess);
        if (tiaozhanSuccess2 < 1) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccess, 1);
            return true;
        }
        else {
            return false;
        }
    }

    loadBoardSprite() {
        let self = this;

        this.level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        this.boardLevel.string = "No." + this.level;
        let bundleName = Utils.getInstance.getBundleName(this.level);

        if (this.level == "") {
            this.level = 0;
        }
        else if (this.level > Utils.getInstance.MaxLv) {
            this.level = Utils.getInstance.MaxLv;
        }

        cc.resources.load(bundleName + "/icons/" + this.level, cc.SpriteFrame, function (err, spritaFrame) {
            self.boardSprite.spriteFrame = spritaFrame;
            self.showMaterial();
        });
        // let res = ResourceLoader.getInstance.load("resources", bundleName + "icons/" + this.level, cc.SpriteFrame);
        // res.then((spritaFrame: any) => {
        //     self.boardSprite.spriteFrame = spritaFrame;
        // })

    };

    showMaterial() {
        let boardIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex)
        let selectedIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);

        if (boardIndex == selectedIndex) {
            let material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
            this.boardSprite.setMaterial(0, material);
        }
        else {
            let material = cc.Material.getBuiltinMaterial("2d-sprite");
            this.boardSprite.setMaterial(0, material);
        }
    }

    updateBoardSprite() {
        let boardIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex)
        let selectedIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        this.leftNode.active = true;
        this.rightNode.active = true;

        if (selectedIndex == 0) {
            this.leftNode.active = false;
        }
        if (selectedIndex == Utils.getInstance.MaxLv || selectedIndex == boardIndex) {
            this.rightNode.active = false;
        }

        this.loadBoardSprite();
    }

    leftBtn() {
        AudioManager.instance.playAudioBtn_Click();
        let selectedIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        if (selectedIndex > 0) {
            selectedIndex -= 1;
        }
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.selectedIndex, selectedIndex);

        this.updateBoardSprite();
    }

    rightBtn() {
        AudioManager.instance.playAudioBtn_Click();
        let boardIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex)
        let selectedIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        if (selectedIndex < boardIndex) {
            selectedIndex += 1;
        }
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.selectedIndex, selectedIndex);

        this.updateBoardSprite();
    }

    protected start(): void {
        Utils.getInstance.is_clickSetting = 0;
        Utils.getInstance.levelData = this.cardData.json.关卡;
        Utils.getInstance.meiritiaozhanData = this.cardData.json.每日挑战;
        Utils.getInstance.cardGroup = this.cardData.json.牌组合;
        Utils.getInstance.cardCfg = this.cardData.json.牌;
        Utils.getInstance.MaxLevel = Object.values(this.cardData.json.关卡).length;

        this.updateBoardSprite();

        this.Wzhcq_updateMusic();
        this.Wzhcq_checkEnergyState();
        this.Wzhcq_checkPyramidState();
        this.Wzhcq_checkDailyLogin();
        this.Wzhcq_checkNoEnergy();
        this.Wzhcq_checkRankinfo();
        this.Wzhcq_checkjishiCount();

        Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        if (Utils.getInstance.Level <= Utils.getInstance.UnlockLevel) {
            this.meiritiaozhanNum.getComponent(cc.Label).string = "第" + Utils.getInstance.UnlockLevel + "关解锁";
            this.mask.active = true;
        }
        else {
            let bool = this.isTiaoZhanSuccess();
            if (bool) {
                this.meiritiaozhanNum.getComponent(cc.Label).string = "0/1";
            }
            else {
                this.meiritiaozhanNum.getComponent(cc.Label).string = "1/1";
            }
            this.mask.active = false;
        }

        if (Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_addDesk)) {
            this.Wzhcq_addDeskRedDotNode.active = true;
        }
        else {
            this.Wzhcq_addDeskRedDotNode.active = false;
        }

        Utils.getInstance.checkRecommendState();

        Utils.getInstance.continuousJianDan = 0;
        Utils.getInstance.continuousKunNan = 0;

        this.Wzhcq_Level.string = "关卡" + Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);

        let Wzhcq_all_RankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        this.Wzhcq_all_rank_label.string = Math.floor(Wzhcq_all_RankScore) + '';

        let Wzhcq_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_GameType);
        if (Wzhcq_GameType <= 2) {
            let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
            this.Wzhcq_KunNanNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
        }
        else {
            let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
            this.Wzhcq_KunNanNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
        }

        cc.tween(this.tujianBtn)
            .repeatForever(
                cc.tween()
                    .to(0.08, { angle: 5 })
                    .to(0.08, { angle: 0 })
                    .to(0.08, { angle: -5 })
                    .to(0.08, { angle: 0 })
                    .delay(3)
            )
            .start();

        let Wzhcq_eMengState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_eMengState);
        if (Wzhcq_eMengState && Wzhcq_GameType > 2) {
            cc.tween(this.Wzhcq_KunNanNode)
                .repeatForever(
                    cc.tween()
                        .to(0.8, { scale: 1.1 })
                        .to(0.8, { scale: 1 })
                )
                .start();
        }

        cc.tween(this.startGameBtn)
            .repeatForever(
                cc.tween()
                    .to(1.2, { scale: 1.1 })
                    .to(1.2, { scale: 1 })
                    .delay(1)

            )
            .start();

        this.update_eMengState();

        Utils.getInstance.openid = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_openid);

        // this.Wzhcq_clearData();
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSEMRTZ, undefined);

        if ((Utils.getInstance.sceneID == 1103 || Utils.getInstance.sceneID == 1104 || Utils.getInstance.sceneID == 1023) && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AddGame)) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AddGame, 0);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REWARD_PROP);
        }

        let Wzhcq_PyramidState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PyramidState);
        this.Wzhcq_nuolegenuoCount.string = "(" + Wzhcq_PyramidState + "/1)";

        let Wzhcq_noEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_NoEnergy);
        if (Wzhcq_noEnergy < 1 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life) == 0) {
            if (!this.Wzhcq_dailyLoginNode) {
                this.Wzhcq_dailyLoginNode = cc.instantiate(this.Wzhcq_dailyLoginPrefab);
                this.Wzhcq_dailyLoginNode.parent = this.node;
            }
            this.Wzhcq_dailyLoginNode.active = true;
        }
        else {
            let Wzhcq_DailyLogin = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_DailyLogin);
            if (Wzhcq_DailyLogin < 1) {
                if (!this.Wzhcq_dailyLoginNode) {
                    this.Wzhcq_dailyLoginNode = cc.instantiate(this.Wzhcq_dailyLoginPrefab);
                    this.Wzhcq_dailyLoginNode.parent = this.node;
                }
                this.Wzhcq_dailyLoginNode.active = true;
            }
        }

        this.updateVideoState();
    }

    initData() {
        let self = this;
        // console.log("Utils.getInstance.openid:", Utils.getInstance.openid);
        // console.log("Utils.getInstance.username:", Utils.getInstance.username);
        // console.log("Utils.getInstance.headurl:", Utils.getInstance.headurl);

        this.scheduleOnce(() => {
            if (Utils.getInstance.openid == null || Utils.getInstance.username == null || Utils.getInstance.headurl == null) {
                self.Wzhcq_createUserInfoButton();
                Utils.getInstance.showUserInfoButton();
            }
        }, 0.3);
    }

    protected onDestroy(): void {
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_ENERGY, this.Wzhcq_updateEnergy, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSICSTATE, this.Wzhcq_updateMusic, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, this.Wzhcq_gameTips, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_REDDOT, this.Wzhcq_updateRedDot, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RECOMMEND, this.Wzhcq_createRecommend, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_ACHIEVE, this.Wzhcq_createAchieve, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REWARD_PROP, this.Wzhcq_reward_prop, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROP, this.Wzhcq_updatePropState, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RANK, this.Wzhcq_create_rank, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_CHAOZHIHAOLI, this.updateVideoState, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_GAMEPROP, this.Wzhcq_PropReward, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSEMRTZ, this.initData, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.UPDATEBOARDSPRITE, this.updateBoardSprite, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, this.createPaintBoard, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.GOINGAME, this.pointBoardGoInGame, this);

    }

    Wzhcq_create_rank() {
        if (!this.Wzhcq_rankNode) {
            this.Wzhcq_rankNode = cc.instantiate(this.Wzhcq_rankPrefab);
            this.Wzhcq_rankNode.parent = this.node;
        }
        this.Wzhcq_rankNode.active = true;
    }

    Wzhcq_createRecommend(type) {
        if (!this.Wzhcq_recommendNode) {
            this.Wzhcq_recommendNode = cc.instantiate(this.Wzhcq_recommendPrefab);
            this.Wzhcq_recommendNode.parent = this.node;
        }
        this.Wzhcq_recommendNode.getComponent(Recommend).initState(type);
        this.Wzhcq_recommendNode.active = true;
    }

    Wzhcq_updatePropState() {
        let Wzhcq_PropShuffleTilesPrefab = cc.instantiate(this.Wzhcq_PropShuffleTilesPrefab);
        Wzhcq_PropShuffleTilesPrefab.parent = this.node;
        Wzhcq_PropShuffleTilesPrefab.zIndex = 100;
        Wzhcq_PropShuffleTilesPrefab.position = cc.v3(80, -20);

        cc.tween(Wzhcq_PropShuffleTilesPrefab)
            .to(0.5, { position: cc.v3(165, -600) })
            .call(() => {
                Wzhcq_PropShuffleTilesPrefab.removeFromParent();
            })
            .start();

        let Wzhcq_PropTipsPrefab = cc.instantiate(this.Wzhcq_PropTipsPrefab);
        Wzhcq_PropTipsPrefab.parent = this.node;
        Wzhcq_PropTipsPrefab.zIndex = 100;
        Wzhcq_PropTipsPrefab.position = cc.v3(-100, -20);

        cc.tween(Wzhcq_PropTipsPrefab)
            .to(0.5, { position: cc.v3(-170, -600) })
            .call(() => {
                Wzhcq_PropTipsPrefab.removeFromParent();
            })
            .start();
    }

    createTuJian() {
        if (!this.tujianNode) {
            this.tujianNode = cc.instantiate(this.tujianPrefab);
            this.tujianNode.parent = this.node;
        }
        this.tujianNode.active = true;
    }

    Wzhcq_reward_prop() {
        if (!this.Wzhcq_reward_propNode) {
            this.Wzhcq_reward_propNode = cc.instantiate(this.Wzhcq_reward_propPrefab);
            this.Wzhcq_reward_propNode.parent = this.node;
        }
        this.Wzhcq_reward_propNode.active = true;
    }

    Wzhcq_createAchieve(type: any) {
        if (!this.Wzhcq_achieveNode) {
            this.Wzhcq_achieveNode = cc.instantiate(this.Wzhcq_achievePrefab);
            this.Wzhcq_achieveNode.parent = this.node;
        }
        this.Wzhcq_achieveNode.active = true;
    }

    Wzhcq_updateRedDot() {
        if (Utils.getInstance.jishi_redDot) {
            this.Wzhcq_jishi_redDotNode.active = true;
        }
        else {
            this.Wzhcq_jishi_redDotNode.active = false;
        }

        if (Utils.getInstance.rank_redDot) {
            this.Wzhcq_rank_redDotNode.active = true;
        }
        else {
            this.Wzhcq_rank_redDotNode.active = false;
        }
    }

    update_eMengState() {
        let Wzhcq_eMengState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_eMengState);
        if (Wzhcq_eMengState) {
            this.Wzhcq_videoNode.active = true;
            this.Wzhcq_heartNode.active = false;
        }
        else {
            this.Wzhcq_videoNode.active = false;
            this.Wzhcq_heartNode.active = true;
        }
    }

    Wzhcq_clearData() {
        this.Wzhcq_create_mahjongBack();
        this.Wzhcq_create_mahjong();
        this.Wzhcq_tips_step1();
    }

    Wzhcq_hideTips(Wzhcq_index2: any) {
        for (let Wzhcq_index = 0; Wzhcq_index < this.Wzhcq_tips.length; Wzhcq_index++) {
            let Wzhcq_node = this.Wzhcq_tips[Wzhcq_index];
            if (Wzhcq_index2 == Wzhcq_index) {
                Wzhcq_node.active = true;
            }
            else {
                Wzhcq_node.active = false;
            }
        }
    }

    Wzhcq_create_mahjongBack() {
        this.Wzhcq_mahjongBackArray = [];
        this.Wzhcq_mahjongBack_layout.removeAllChildren();

        for (let Wzhcq_index = 0; Wzhcq_index < 24; Wzhcq_index++) {
            let Wzhcq_PaiBackPrefab = cc.instantiate(this.Wzhcq_PaiBackPrefab);
            let Wzhcq_node: cc.Node = new cc.Node();
            Wzhcq_node.width = Wzhcq_PaiBackPrefab.width;
            Wzhcq_node.height = Wzhcq_PaiBackPrefab.height;
            this.Wzhcq_mahjongBack_layout.addChild(Wzhcq_PaiBackPrefab);
            Wzhcq_PaiBackPrefab.position = moveGroup[Wzhcq_index].position;
            this.Wzhcq_mahjongBackArray.push(Wzhcq_PaiBackPrefab);
        }
    }

    Wzhcq_create_mahjong() {
        this.Wzhcq_mahjongArray = [];
        this.Wzhcq_mahjong_layout.removeAllChildren();

        for (let Wzhcq_index = 0; Wzhcq_index < 24; Wzhcq_index++) {
            let Wzhcq_PaiPrefab = cc.instantiate(this.Wzhcq_PaiPrefab);
            let Wzhcq_node: cc.Node = new cc.Node();
            Wzhcq_node.width = Wzhcq_PaiPrefab.width;
            Wzhcq_node.height = Wzhcq_PaiPrefab.height;
            let Wzhcq_data = {};
            Wzhcq_data["Suit"] = moveGroup[Wzhcq_index].Suit;
            Wzhcq_data["Num"] = moveGroup[Wzhcq_index].Num;
            Wzhcq_data["Id"] = moveGroup[Wzhcq_index].Id;
            this.Wzhcq_mahjong_layout.addChild(Wzhcq_PaiPrefab);
            Wzhcq_PaiPrefab.getComponent("Pai").setData(Wzhcq_data, 255);
            Wzhcq_PaiPrefab.position = moveGroup[Wzhcq_index].position;
            this.Wzhcq_mahjongArray.push(Wzhcq_PaiPrefab);
        }
    }

    Wzhcq_createUserInfoButton() {
        let self = this;
        let Wzhcq_AllRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        if (Wzhcq_AllRankScore > 0) {
            console.log("start Wzhcq_createUserInfoButton openid:", Utils.getInstance.openid)

            if (Utils.getInstance.openid != null && Utils.getInstance.username != null && Utils.getInstance.headurl != null) {
                console.log("start Wzhcq_createUserInfoButton openid1:", Utils.getInstance.openid);
                this.Wzhcq_create_rank();
            }
            else {
                // if (!Utils.getInstance.button) {
                console.log("start Wzhcq_createUserInfoButton111111111111111111:")
                Utils.getInstance.getUserInfo(self.Wzhcq_getuserInfo);
                // }
            }
        }
        else {
            console.log("start openid2:", Utils.getInstance.openid)
            if (Utils.getInstance.openid == null || Utils.getInstance.username == null || Utils.getInstance.headurl == null) {
                Utils.getInstance.getUserInfo(self.Wzhcq_getuserInfo);
                return;
            }
            this.Wzhcq_create_rank();
        }
    }

    Wzhcq_tips_step1() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[3], this.Wzhcq_mahjongArray[11]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[3], this.Wzhcq_mahjongBackArray[11]];

        this.Wzhcq_stepMask.active = true;
        this.Wzhcq_stepMask.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_maskSpriteFrame[0];

        this.Wzhcq_hideTips(0);

        this.Wzhcq_finger.active = true;
        this.Wzhcq_finger.position = cc.v3(-35, 43);
        cc.tween(this.Wzhcq_finger)
            .by(0.5, { position: cc.v3(0, -86) })
            .by(0.5, { position: cc.v3(0, 86) })
            .by(0.5, { position: cc.v3(0, -86) })
            .by(0.5, { position: cc.v3(0, 86) })
            .delay(0.3)
            .call(() => {
                this.Wzhcq_click_effect.active = true;
                this.Wzhcq_click_effect.position = cc.v3(-35, 86);
            })
            .delay(1)
            .call(() => {
                this.Wzhcq_click_effect.active = false;
                this.Wzhcq_stepMask.active = true;
                this.Wzhcq_stepMask.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_maskSpriteFrame[1];
                this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step2());
            })
            .start();
    }

    Wzhcq_tips_step2() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[17], this.Wzhcq_mahjongArray[9]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[17], this.Wzhcq_mahjongBackArray[9]];
        let Wzhcq_nodeArray = [this.Wzhcq_mahjongArray[1], this.Wzhcq_mahjongArray[17]];

        this.Wzhcq_finger.active = true;
        this.Wzhcq_hideTips(1);

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(-175, -43) })
            .delay(1)
            .call(() => {
                cc.tween(Wzhcq_nodeArray[0])
                    .to(0.5, { scale: 0.8 })
                    .to(0.5, { scale: 1 })
                    .to(0.5, { scale: 0.8 })
                    .to(0.5, { scale: 1 })
                    .start();

                cc.tween(Wzhcq_nodeArray[1])
                    .to(0.5, { scale: 0.8 })
                    .to(0.5, { scale: 1 })
                    .to(0.5, { scale: 0.8 })
                    .to(0.5, { scale: 1 })
                    .start();


                cc.tween(this.Wzhcq_finger)
                    .delay(1)
                    .by(0.5, { position: cc.v3(0, -86) })
                    .delay(0.3)
                    .call(() => {
                        this.Wzhcq_click_effect.active = true;
                        this.Wzhcq_click_effect.position = cc.v3(-175, -86);
                    })
                    .delay(1)
                    .call(() => {
                        this.Wzhcq_click_effect.active = false;
                        this.Wzhcq_stepMask.active = true;
                        this.Wzhcq_stepMask.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_maskSpriteFrame[2];
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step3());
                    })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step3() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[10], this.Wzhcq_mahjongArray[12]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[10], this.Wzhcq_mahjongBackArray[12]];

        this.Wzhcq_finger.active = true;
        this.Wzhcq_hideTips(2);

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(-105, -43) })
            .delay(0.3)
            .call(() => {
                cc.tween(this.Wzhcq_finger)
                    .by(0.5, { position: cc.v3(140, 0) })
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .by(0.5, { position: cc.v3(140, 0) })
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .delay(0.3)
                    .call(() => {
                        this.Wzhcq_click_effect.active = true;
                        this.Wzhcq_click_effect.position = cc.v3(-105, 0);
                    })
                    .delay(1)
                    .call(() => {
                        this.Wzhcq_click_effect.active = false;
                        this.Wzhcq_stepMask.active = false;
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step4());
                    })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step4() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[4], this.Wzhcq_mahjongArray[20]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[4], this.Wzhcq_mahjongBackArray[20]];
        this.Wzhcq_stepMask.active = false;

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(35, 43) })
            .delay(0.3)
            .call(() => {
                this.Wzhcq_click_effect.active = true;
                this.Wzhcq_click_effect.position = cc.v3(35, 86);
            })
            .delay(1)
            .call(() => {
                this.Wzhcq_click_effect.active = false;
                this.Wzhcq_stepMask.active = false;
                this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step5());
            })
            .start();
    }

    Wzhcq_tips_step5() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[19], this.Wzhcq_mahjongArray[21]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[19], this.Wzhcq_mahjongBackArray[21]];

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(-35, -129) })
            .delay(0.3)
            .call(() => {
                this.Wzhcq_click_effect.active = true;
                this.Wzhcq_click_effect.position = cc.v3(-35, -86);
            })
            .delay(1)
            .call(() => {
                this.Wzhcq_click_effect.active = false;
                this.Wzhcq_stepMask.active = true;
                this.Wzhcq_finger.active = false;
                this.Wzhcq_stepMask.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_maskSpriteFrame[3];
                this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step6());
            })
            .start();
    }

    Wzhcq_tips_step6() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[22], this.Wzhcq_mahjongArray[13]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[22], this.Wzhcq_mahjongBackArray[13]];

        this.Wzhcq_finger.active = true;
        this.Wzhcq_finger.position = cc.v3(175, -129);

        let Wzhcq_startMove = this.Wzhcq_mahjongArray[22];
        let Wzhcq_startMoveBack = this.Wzhcq_mahjongBackArray[22];
        let Wzhcq_endMove = this.Wzhcq_mahjongBackArray[21];

        let Wzhcq_position = this.Wzhcq_mahjongArray[22].position;
        let Wzhcq_moveGroup = [{ "Suit": 0, "Num": 2, "position": Wzhcq_position }];
        this.Wzhcq_hideTips(3);

        for (let k = 0; k < Wzhcq_moveGroup.length; k++) {
            let Wzhcq_PaiPrefab = cc.instantiate(this.Wzhcq_PaiPrefab);
            let Wzhcq_node: cc.Node = new cc.Node();
            Wzhcq_node.width = Wzhcq_PaiPrefab.width;
            Wzhcq_node.height = Wzhcq_PaiPrefab.height;
            let Wzhcq_data = {};
            Wzhcq_data["Suit"] = Wzhcq_moveGroup[k].Suit;
            Wzhcq_data["Num"] = Wzhcq_moveGroup[k].Num;
            this.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
            Wzhcq_PaiPrefab.getComponent("Pai").setData(Wzhcq_data, 150);

            Wzhcq_PaiPrefab.position = Wzhcq_moveGroup[k].position;
        }

        cc.tween(this.Wzhcq_layout)
            .to(0.5, { position: cc.v3(-moveGroup.length * 70, 0) })
            .call(() => {
                this.Wzhcq_layout.position = cc.v3(0, 0);
            })
            .to(0.5, { position: cc.v3(-moveGroup.length * 70, 0) })
            .call(() => {
                this.Wzhcq_layout.position = cc.v3(0, 0);
                this.Wzhcq_layout.active = false;

                cc.tween(Wzhcq_startMove)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .call(() => {
                        this.Wzhcq_stepMask.active = false;
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step7());
                    })
                    .start();
            })
            .start();

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(105, -129) })
            .call(() => {
                this.Wzhcq_finger.position = cc.v3(175, -129);
            })
            .to(0.5, { position: cc.v3(105, -129) })
            .call(() => {
                this.Wzhcq_finger.position = cc.v3(175, -129);
            })
            .to(0.5, { position: cc.v3(105, -129) })
            .call(() => {
                this.Wzhcq_finger.position = cc.v3(105, -129);
            })
            .start();
    }

    Wzhcq_tips_step7() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[1], this.Wzhcq_mahjongArray[18]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[1], this.Wzhcq_mahjongBackArray[18]];

        let Wzhcq_startMove = this.Wzhcq_mahjongArray[18];
        let Wzhcq_startMoveBack = this.Wzhcq_mahjongBackArray[18];
        let Wzhcq_endMove = this.Wzhcq_mahjongBackArray[17];

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(-70, -129) })
            .delay(0.3)
            .call(() => {
                cc.tween(Wzhcq_startMove)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .call(() => {
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step8());
                    })
                    .start();

                cc.tween(this.Wzhcq_finger)
                    .to(0.5, { position: cc.v3(-175, -129) })
                    .call(() => {

                    })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step8() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[2], this.Wzhcq_mahjongArray[15]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[2], this.Wzhcq_mahjongBackArray[15]];

        let Wzhcq_startMove = this.Wzhcq_mahjongArray[14];
        let Wzhcq_startMove2 = this.Wzhcq_mahjongArray[15];

        let Wzhcq_startMoveBack = this.Wzhcq_mahjongBackArray[14];
        let Wzhcq_startMoveBack2 = this.Wzhcq_mahjongBackArray[15];

        let Wzhcq_endMove1 = this.Wzhcq_mahjongBackArray[13];
        let Wzhcq_endMove2 = this.Wzhcq_mahjongBackArray[12];
        let Wzhcq_endMove3 = this.Wzhcq_mahjongBackArray[11];
        let Wzhcq_endMove4 = this.Wzhcq_mahjongBackArray[10];
        let Wzhcq_endMove5 = this.Wzhcq_mahjongBackArray[9];


        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(245, -43) })
            .delay(0.3)
            .call(() => {
                cc.tween(this.Wzhcq_finger)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMove)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMove2)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack2)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove1)
                    .by(0.5, { position: cc.v3(140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove2)
                    .delay(0.5)
                    .by(0.5, { position: cc.v3(140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove3)
                    .delay(1)
                    .by(0.5, { position: cc.v3(140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove4)
                    .delay(1.5)
                    .by(0.5, { position: cc.v3(140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove5)
                    .delay(2)
                    .by(0.5, { position: cc.v3(140, 0) })
                    .call(() => {
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step9());
                    })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step9() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[6], this.Wzhcq_mahjongArray[8]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[6], this.Wzhcq_mahjongBackArray[8]];

        let Wzhcq_startMove = this.Wzhcq_mahjongArray[14];
        let Wzhcq_startMove2 = this.Wzhcq_mahjongArray[8];

        let Wzhcq_startMoveBack = this.Wzhcq_mahjongBackArray[14];
        let Wzhcq_startMoveBack2 = this.Wzhcq_mahjongBackArray[8];

        let Wzhcq_endMove1 = this.Wzhcq_mahjongBackArray[15];
        let Wzhcq_endMove2 = this.Wzhcq_mahjongBackArray[9];
        let Wzhcq_endMove3 = this.Wzhcq_mahjongBackArray[10];
        let Wzhcq_endMove4 = this.Wzhcq_mahjongBackArray[11];
        let Wzhcq_endMove5 = this.Wzhcq_mahjongBackArray[12];
        let Wzhcq_endMove6 = this.Wzhcq_mahjongBackArray[13];

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(-245, -43) })
            .delay(0.3)
            .call(() => {
                cc.tween(Wzhcq_startMove)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_startMove2)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack2)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove1)
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove2)
                    .delay(0.5)
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove3)
                    .delay(1)
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove4)
                    .delay(1.5)
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove5)
                    .delay(2)
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .start();
                cc.tween(Wzhcq_endMove6)
                    .delay(2.5)
                    .by(0.5, { position: cc.v3(-140, 0) })
                    .call(() => {
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step10());
                    })
                    .start();

                cc.tween(this.Wzhcq_finger)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step10() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[7], this.Wzhcq_mahjongArray[14]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[7], this.Wzhcq_mahjongBackArray[14]];
        this.Wzhcq_stepMask.active = false;

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(245, -43) })
            .delay(0.3)
            .call(() => {
                this.Wzhcq_click_effect.active = true;
                this.Wzhcq_click_effect.position = cc.v3(245, 0);
            })
            .delay(1)
            .call(() => {
                this.Wzhcq_click_effect.active = false;

                this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step11());
            })
            .start();
    }

    Wzhcq_tips_step11() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[5], this.Wzhcq_mahjongArray[16]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[5], this.Wzhcq_mahjongBackArray[16]];

        let Wzhcq_startMove = this.Wzhcq_mahjongArray[5];
        let Wzhcq_startMoveBack = this.Wzhcq_mahjongBackArray[5];

        let Wzhcq_endMove1 = this.Wzhcq_mahjongBackArray[13];
        let Wzhcq_endMove2 = this.Wzhcq_mahjongBackArray[22];

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(105, 43) })
            .delay(0.3)
            .call(() => {
                cc.tween(Wzhcq_startMove)
                    .by(0.5, { position: cc.v3(0, -86) })
                    .by(0.5, { position: cc.v3(0, -86) })
                    .start();

                cc.tween(Wzhcq_startMoveBack)
                    .by(0.5, { position: cc.v3(0, -86) })
                    .by(0.5, { position: cc.v3(0, -86) })
                    .start();

                cc.tween(this.Wzhcq_finger)
                    .by(0.5, { position: cc.v3(0, -86) })
                    .by(0.5, { position: cc.v3(0, -86) })
                    .start();

                cc.tween(Wzhcq_endMove1)
                    .by(0.5, { position: cc.v3(0, 86) })
                    .start();

                cc.tween(Wzhcq_endMove2)
                    .delay(0.5)
                    .by(0.5, { position: cc.v3(0, 86) })
                    .call(() => {
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step12());
                    })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step12() {
        let Wzhcq_mahjongArray = [this.Wzhcq_mahjongArray[0], this.Wzhcq_mahjongArray[23]];
        let Wzhcq_mahjongBackArray = [this.Wzhcq_mahjongBackArray[0], this.Wzhcq_mahjongBackArray[23]];

        let Wzhcq_startMove = this.Wzhcq_mahjongArray[23];
        let Wzhcq_startMoveBack = this.Wzhcq_mahjongBackArray[23];

        let Wzhcq_endMove1 = this.Wzhcq_mahjongBackArray[21];
        let Wzhcq_endMove2 = this.Wzhcq_mahjongBackArray[5];
        let Wzhcq_endMove3 = this.Wzhcq_mahjongBackArray[20];
        let Wzhcq_endMove4 = this.Wzhcq_mahjongBackArray[19];
        let Wzhcq_endMove5 = this.Wzhcq_mahjongBackArray[17];
        let Wzhcq_endMove6 = this.Wzhcq_mahjongBackArray[18];
        let Wzhcq_endMove7 = this.Wzhcq_mahjongBackArray[16];

        cc.tween(this.Wzhcq_finger)
            .to(0.5, { position: cc.v3(245, -129) })
            .delay(0.3)
            .call(() => {
                cc.tween(Wzhcq_startMove)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_startMoveBack)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(this.Wzhcq_finger)
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .by(0.5, { position: cc.v3(-70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove1)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove2)
                    .delay(0.5)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove3)
                    .delay(1)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove4)
                    .delay(1.5)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove5)
                    .delay(2)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove6)
                    .delay(2.5)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .start();

                cc.tween(Wzhcq_endMove7)
                    .delay(3)
                    .by(0.5, { position: cc.v3(70, 0) })
                    .call(() => {
                        this.Wzhcq_finger.active = false;
                        this.Wzhcq_PaiAction(Wzhcq_mahjongArray, Wzhcq_mahjongBackArray, this.Wzhcq_tips_step13());
                    })
                    .start();
            })
            .start();
    }

    Wzhcq_tips_step13() {
        this.Wzhcq_clearData();
    }

    Wzhcq_PaiAction(Wzhcq_mahjongArray: any, Wzhcq_mahjongBackArray: any, Wzhcq_cb: any) {
        for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_mahjongArray.length; Wzhcq_index++) {
            let Wzhcq_node1 = Wzhcq_mahjongBackArray[Wzhcq_index];
            let Wzhcq_node2 = Wzhcq_mahjongArray[Wzhcq_index];

            let Wzhcq_scaleFront = cc.scaleTo(0.1, 0, 1);
            Wzhcq_node1.scaleX = 0;
            let Wzhcq_scaleBack = cc.scaleTo(0.1, 1, 1);

            let Wzhcq_seq = cc.sequence(
                Wzhcq_scaleFront,
                cc.callFunc(() => {
                    Wzhcq_node1.runAction(Wzhcq_scaleBack);
                }),
                cc.removeSelf(),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    if (Wzhcq_cb) {
                        Wzhcq_cb();
                    }
                })
            );
            Wzhcq_node2.runAction(Wzhcq_seq);
        }
    }

    Wzhcq_checkEnergyState() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_EnergyCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyCount);
        if (Wzhcq_EnergyCount >= 3) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyCount, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyCount, 0);
            }
        }
    }

    Wzhcq_checkRankinfo() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RankinfoDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_Rankinfo = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Rankinfo);
        if (Wzhcq_Rankinfo > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Rankinfo, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Rankinfo, 0);
            }
        }
    }

    Wzhcq_checkNoEnergy() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_NoEnergyDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_NoEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_NoEnergy);
        if (Wzhcq_NoEnergy > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_NoEnergy, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_NoEnergy, 0);
            }
        }
    }

    Wzhcq_checkDailyLogin() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_DailyLoginDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_DailyLogin = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_DailyLogin);
        if (Wzhcq_DailyLogin > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_DailyLogin, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_DailyLogin, 0);
            }
        }
    }

    Wzhcq_checkPyramidState() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PyramidDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_PyramidState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PyramidState);
        if (Wzhcq_PyramidState > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PyramidState, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PyramidState, 0);
            }
        }
    }

    Wzhcq_checkjishiCount() {
        let Wzhcq_curDay = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_curDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_jishiCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_jishiCount);
        if (Wzhcq_jishiCount >= 3) {
            if (Wzhcq_CurTime != Wzhcq_curDay) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_curDay, Wzhcq_CurTime);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_jishiCount, 0);
            }

        }
        else {
            if (Wzhcq_CurTime != Wzhcq_curDay) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_curDay, Wzhcq_CurTime);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_jishiCount, 0);
            }
        }
    }

    eventShow() {
        WxPlatform.getInstance.showInterstitialAd(() => {
            WxPlatform.getInstance.CreateCustomAd5(5, () => {
            });
        });
    }

    Wzhcq_initEnergy() {
        this.Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
        if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, 0);
        }
        else {
            let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
            let Wzhcq_curEnergyTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime);

            if (Wzhcq_curEnergyTime != 0) {
                let Wzhcq_energyCount = Math.floor((Wzhcq_cur_time - Wzhcq_curEnergyTime) / Utils.getInstance.energyDownTime);
                let Wzhcq_energyDownTime = (Wzhcq_cur_time - Wzhcq_curEnergyTime) % Utils.getInstance.energyDownTime;
                if (this.Wzhcq_life + Wzhcq_energyCount >= Utils.getInstance.maxlife) {
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Utils.getInstance.maxlife);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime, Utils.getInstance.energyDownTime);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, 0);
                }
                else {
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, this.Wzhcq_life + Wzhcq_energyCount);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_curEnergyTime);
                }

                this.Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
                if (Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime) > Wzhcq_energyDownTime) {
                    this.Wzhcq_countdownSecond = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime) - Wzhcq_energyDownTime;
                }
                else {
                    this.Wzhcq_countdownSecond = Utils.getInstance.energyDownTime - Math.abs(Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime) - Wzhcq_energyDownTime);
                    let Wzhcq_energyCount = Math.floor((Math.abs(Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime) - Wzhcq_energyDownTime)) / Utils.getInstance.energyDownTime) + 1;
                    if (this.Wzhcq_life + Wzhcq_energyCount >= Utils.getInstance.maxlife) {
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Utils.getInstance.maxlife);
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime, Utils.getInstance.energyDownTime);
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, 0);
                    }
                    else {
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, this.Wzhcq_life + Wzhcq_energyCount);
                    }
                }
                this.Wzhcq_updateEnergy();

            }
        }
    }

    Wzhcq_updateMusic() {
        let Wzhcq_isMusic = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Music);
        if (Wzhcq_isMusic) {
            AudioManager.instance.playBgMusic();
        }
        else {
            AudioManager.instance.stopBgMusic();
        }
    }

    Wzhcq_updateEnergy() {
        this.Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);

        this.Wzhcq_lifeNum.getComponent(cc.Label).string = "当前体力" + this.Wzhcq_life;

        for (let Wzhcq_index = 0; Wzhcq_index < this.Wzhcq_heardArray.length; Wzhcq_index++) {

            this.Wzhcq_heardArray[Wzhcq_index].active = true;
            if (Wzhcq_index <= this.Wzhcq_life - 1) {
                this.Wzhcq_heardArray[Wzhcq_index].getComponent(cc.Sprite).fillRange = 1;
            }
            else if (Wzhcq_index <= this.Wzhcq_life) {
                this.Wzhcq_heardArray[Wzhcq_index].getComponent(cc.Sprite).fillRange = 0.5;
            }
            else {
                this.Wzhcq_heardArray[Wzhcq_index].getComponent(cc.Sprite).fillRange = 0;
            }
        }
        if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
            this.Wzhcq_isDownTime = false;
            this.Wzhcq_time.active = false;
        }
    }

    update(Wzhcq_dt: any) {
        if (this.Wzhcq_intervalTime >= 0) {
            this.Wzhcq_intervalTime -= Wzhcq_dt;
        }
        else {
            this.Wzhcq_intervalTime = 1;
            if (this.Wzhcq_isDownTime && this.Wzhcq_countdownSecond > 0) {
                this.updateCountDown();
            }
        }

        if (this.czhl_intervalTime >= 0) {
            this.czhl_intervalTime -= Wzhcq_dt;
        }
        else {
            this.czhl_intervalTime = 1;
            if (this.czhl_isDownTime && this.czhl_countdownSecond > 0) {
                this.czhl_updateCountDown();
            }
        }
    }

    updateVideoState() {
        let VideoState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState);
        if (VideoState) {
            this.Wzhcq_downTimeNode.parent.active = false;
            this.Wzhcq_czhlReddot.active = true;
        }
        else {
            this.Wzhcq_downTimeNode.parent.active = true;
            this.Wzhcq_czhlReddot.active = false;

            let curTime = Math.round(new Date().getTime() / 1000);
            let czhlDownTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_czhlDownTime);

            let offTime = curTime - czhlDownTime;
            if (offTime < Utils.getInstance.czhl_constDownTime) {
                this.czhl_countdownSecond = Utils.getInstance.czhl_constDownTime - offTime;
                this.czhl_isDownTime = true;
                this.Wzhcq_downTimeNode.parent.active = true;
                this.Wzhcq_czhlReddot.active = false;
            }
            else {
                this.czhl_countdownSecond = 0;
                this.czhl_isDownTime = false;
                this.Wzhcq_downTimeNode.parent.active = false;
                this.Wzhcq_czhlReddot.active = true;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 1);
            }
        }
    }

    czhl_updateCountDown() {
        this.czhl_countdownSecond -= 1;
        this.Wzhcq_downTimeNode.getComponent(cc.Label).string = Utils.getInstance.secondsFormatMinutes(this.czhl_countdownSecond);

        if (this.czhl_countdownSecond < 1) {
            this.czhl_isDownTime = false;
            this.Wzhcq_downTimeNode.parent.active = false;
            this.czhl_countdownSecond = Utils.getInstance.czhl_constDownTime;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 1);
        }
    }

    Wzhcq_gameTips(Wzhcq_str: any, Wzhcq_delay: any, zIndex: any = 100) {
        let Wzhcq_tipsPrefab = cc.instantiate(this.Wzhcq_tipsPrefab);
        Wzhcq_tipsPrefab.x = 0;
        Wzhcq_tipsPrefab.y = 0;
        Wzhcq_tipsPrefab.zIndex = zIndex;
        Wzhcq_tipsPrefab.getComponent(Tips).initData(Wzhcq_str, Wzhcq_delay);
        Wzhcq_tipsPrefab.parent = this.node;
    }

    updateCountDown() {
        this.Wzhcq_countdownSecond -= 1;
        let Wzhcq_time = Utils.getInstance.hourFormSecondsFormatMinutes(this.Wzhcq_countdownSecond);

        this.Wzhcq_time.getComponent(cc.Label).string = Wzhcq_time;

        let Wzhcq_cur_energytime = Math.round(new Date().getTime() / 1000);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_energytime);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime, this.Wzhcq_countdownSecond);

        if (this.Wzhcq_countdownSecond < 1) {
            this.Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
            if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
                this.Wzhcq_time.getComponent(cc.Label).string = Utils.getInstance.hourFormSecondsFormatMinutes(0);
                this.Wzhcq_time.active = false;

                this.Wzhcq_updateEnergy();
                this.Wzhcq_isDownTime = false;
            }
            else {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, this.Wzhcq_life + 1);
                this.Wzhcq_UpdateGameData();
                this.Wzhcq_countdownSecond = Utils.getInstance.energyDownTime;
            }

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_LifeState, 1);
        }
    }

    Wzhcq_UpdateGameData() {
        this.Wzhcq_updateEnergy();

        if (this.Wzhcq_life < 0) {
            // let str = "请等待体力恢复";
            // cc.game.emit("GameTips", str);
            // console.log("请等待体力恢复");
        }
        else {

            if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
                this.Wzhcq_time.active = false;
                this.Wzhcq_isDownTime = false;
                Utils.getInstance.removeItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime);
            }
            else {
                this.Wzhcq_countdownSecond = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime);

                this.Wzhcq_isDownTime = true;
            }
        }
    }

    Wzhcq_clickSetting_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (!this.Wzhcq_settingNode) {
            this.Wzhcq_settingNode = cc.instantiate(this.Wzhcq_settingPrefab);
            this.Wzhcq_settingNode.parent = this.node;
        }
        this.Wzhcq_settingNode.active = true;
    }

    Wzhcq_clickRank_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (Utils.getInstance.openid != null && Utils.getInstance.username != null && Utils.getInstance.headurl != null) {
            // console.log("Wzhcq_createUserInfoButton openid1:", Utils.getInstance.openid);

            if (!this.Wzhcq_rankNode) {
                this.Wzhcq_rankNode = cc.instantiate(this.Wzhcq_rankPrefab);
                this.Wzhcq_rankNode.parent = this.node;
            }
            this.Wzhcq_rankNode.active = true;
        }
    }

    Wzhcq_clickAddEnergy_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "体力已满，无法增加体力");
        }
        else {
            if (!this.Wzhcq_energyNode) {
                this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                this.Wzhcq_energyNode.parent = this.node;
            }
            this.Wzhcq_energyNode.getComponent(Energy).initState(2);
            this.Wzhcq_energyNode.active = true;
        }
    }

    Wzhcq_clickAddDesktop_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_addDesk, 0);
        this.Wzhcq_addDeskRedDotNode.active = false;

        if (!this.Wzhcq_addDesktopNode) {
            this.Wzhcq_addDesktopNode = cc.instantiate(this.Wzhcq_addDesktopPrefab);
            this.Wzhcq_addDesktopNode.parent = this.node;
        }
        this.Wzhcq_addDesktopNode.active = true;
    }

    Wzhcq_clickAchieve_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_ACHIEVE, undefined);
    }

    Wzhcq_PropReward() {
        if (!this.Wzhcq_PropRewardNode) {
            this.Wzhcq_PropRewardNode = cc.instantiate(this.Wzhcq_PropRewardPrefab);
            this.Wzhcq_PropRewardNode.parent = this.node;
            this.Wzhcq_PropRewardNode.zIndex = 60;
        }
        this.Wzhcq_PropRewardNode.active = true;
    }

    Wzhcq_clickChaozhihaoli_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_czhlReddot.active = false;

        if (!this.Wzhcq_chaozhihaoliNode) {
            this.Wzhcq_chaozhihaoliNode = cc.instantiate(this.Wzhcq_chaozhihaoliPrefab);
            this.Wzhcq_chaozhihaoliNode.parent = this.node;
        }
        this.Wzhcq_chaozhihaoliNode.active = true;
    }

    Wzhcq_clickMeiritiaozhan_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        if (Utils.getInstance.Level > Utils.getInstance.UnlockLevel) {
            if (!this.Wzhcq_MeiRiTiaoZhan) {
                this.Wzhcq_MeiRiTiaoZhan = cc.instantiate(this.Wzhcq_MeiRiTiaoZhanPrefab);
                this.Wzhcq_MeiRiTiaoZhan.parent = this.node;
            }
            this.Wzhcq_MeiRiTiaoZhan.active = true;
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "通过第" + Utils.getInstance.UnlockLevel + "关解锁");
        }
    }

    Wzhcq_clickStart_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Guide, 0);

        if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
            let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_time);
        }

        let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
        if (Wzhcq_life > 0) {

            let Wzhcq_heartPrefab = cc.instantiate(this.Wzhcq_heartPrefab);
            Wzhcq_heartPrefab.parent = this.node;
            Wzhcq_heartPrefab.position = cc.v3(-230, 600);
            cc.tween(Wzhcq_heartPrefab)
                .to(0.5, { position: cc.v3(-115, this.startGameBtn.y), scale: 1 })
                .call(() => {
                    this.Wzhcq_updateEnergy();
                    // cc.director.preloadScene("Game", function () {
                    // console.log("加载成功");

                    let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                    Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                    let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                    if (level > Utils.getInstance.MaxLevel) {
                        level = Utils.getInstance.getLevelRange(level);
                    }
                    Utils.getInstance.GameType = Utils.getInstance.levelData[level].type;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);

                    cc.director.loadScene("Game");
                    // })
                })
                .start();
        }
        else {
            if (!this.Wzhcq_energyNode) {
                this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                this.Wzhcq_energyNode.parent = this.node;
            }
            this.Wzhcq_energyNode.getComponent(Energy).initState(1);
            this.Wzhcq_energyNode.active = true;
        }
    }

    pointBoardGoInGame() {
        AudioManager.instance.playAudioBtn_Click();
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Guide, 0);

        if (this.Wzhcq_life >= Utils.getInstance.maxlife) {
            let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_time);
        }

        let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
        if (Wzhcq_life > 0) {
            this.Wzhcq_updateEnergy();

            let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

            Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
            let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
            if (level > Utils.getInstance.MaxLevel) {
                level = Utils.getInstance.getLevelRange(level);
            }
            Utils.getInstance.GameType = Utils.getInstance.levelData[level].type;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);

            cc.director.loadScene("Game");
        }
        else {
            if (!this.Wzhcq_energyNode) {
                this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                this.Wzhcq_energyNode.parent = this.node;
            }
            this.Wzhcq_energyNode.getComponent(Energy).initState(1);
            this.Wzhcq_energyNode.active = true;
        }
    }

    Wzhcq_clickXinshou_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        cc.director.preloadScene("Game", function () {
            // console.log("加载成功");
            Utils.getInstance.GameType = 1;
            cc.director.loadScene("Game");
        })
    }

    Wzhcq_clickNuolegenuo_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
        if (Wzhcq_life > 0) {
            let Wzhcq_PyramidState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PyramidState);
            if (Wzhcq_PyramidState < 1) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);
                this.Wzhcq_updateEnergy();

                cc.director.preloadScene("Game", function () {
                    // console.log("加载成功");

                    let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);
                    Utils.getInstance.GameType = 7;

                    Utils.getInstance.nlgnState = 0;

                    cc.director.loadScene("Game");
                })
            }
            else {
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "每日一次已用完，请明天再来");
            }
        }
        else {
            if (!this.Wzhcq_energyNode) {
                this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                this.Wzhcq_energyNode.parent = this.node;
            }
            this.Wzhcq_energyNode.getComponent(Energy).initState(1);
            this.Wzhcq_energyNode.active = true;
        }
    }

    Wzhcq_clickJishi_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        Utils.getInstance.jishi_redDot = 0;
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        let Wzhcq_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_GameType);
        if (Wzhcq_GameType > 0) {

            let Wzhcq_jishiCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_jishiCount);
            if (Wzhcq_jishiCount < 3) {

                cc.director.preloadScene("Game", function () {
                    // console.log("加载成功");
                    Utils.getInstance.GameType = 5;

                    Wzhcq_jishiCount += 1;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_jishiCount, Wzhcq_jishiCount);
                    cc.director.loadScene("Game");
                })
                return;
            }

            if (this.Wzhcq_life >= 5) {
                let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_time);
            }

            let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
            if (Wzhcq_life > 0) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);

                this.Wzhcq_updateEnergy();
                cc.director.preloadScene("Game", function () {
                    // console.log("加载成功");

                    let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                    Utils.getInstance.GameType = 5;

                    let Wzhcq_jishiCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_jishiCount);
                    Wzhcq_jishiCount += 1;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_jishiCount, Wzhcq_jishiCount);

                    cc.director.loadScene("Game");
                })
            }
            else {
                if (!this.Wzhcq_energyNode) {
                    this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                    this.Wzhcq_energyNode.parent = this.node;
                }
                this.Wzhcq_energyNode.getComponent(Energy).initState(1);
                this.Wzhcq_energyNode.active = true;
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "通关1次困难排位赛后解锁");
        }
    }

    Wzhcq_clickJiandan_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Guide, 0);
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        if (this.Wzhcq_life >= 5) {
            let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_time);
        }

        let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
        if (Wzhcq_life > 0) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);

            let Wzhcq_heartPrefab = cc.instantiate(this.Wzhcq_heartPrefab);
            Wzhcq_heartPrefab.parent = this.node;
            Wzhcq_heartPrefab.position = cc.v3(-230, 600);
            cc.tween(Wzhcq_heartPrefab)
                .to(0.5, { position: cc.v3(-155, -135) })
                .call(() => {
                    this.Wzhcq_updateEnergy();
                    cc.director.preloadScene("Game", function () {
                        // console.log("加载成功");

                        let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                        Utils.getInstance.GameType = 2;

                        cc.director.loadScene("Game");
                    })
                })
                .start();
        }
        else {
            if (!this.Wzhcq_energyNode) {
                this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                this.Wzhcq_energyNode.parent = this.node;
            }
            this.Wzhcq_energyNode.getComponent(Energy).initState(1);
            this.Wzhcq_energyNode.active = true;
        }
    }

    Wzhcq_clickKunnan_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        let Wzhcq_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_GameType);
        if (Wzhcq_GameType > 2) {

            if (this.Wzhcq_life >= 5) {
                let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_time);
            }

            let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
            if (Wzhcq_life > 0) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);

                let Wzhcq_heartPrefab = cc.instantiate(this.Wzhcq_heartPrefab);
                Wzhcq_heartPrefab.parent = this.node;
                Wzhcq_heartPrefab.position = cc.v3(-230, 600);
                cc.tween(Wzhcq_heartPrefab)
                    .to(0.5, { position: cc.v3(-155, -278) })
                    .call(() => {
                        this.Wzhcq_updateEnergy();
                        cc.director.preloadScene("Game", function () {
                            // console.log("加载成功");

                            let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                            Utils.getInstance.GameType = 3;

                            Utils.getInstance.click_KunNan = 1;

                            cc.director.loadScene("Game");
                        })
                    })
                    .start();
            }
            else {
                if (!this.Wzhcq_energyNode) {
                    this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                    this.Wzhcq_energyNode.parent = this.node;
                }
                this.Wzhcq_energyNode.getComponent(Energy).initState(1);
                this.Wzhcq_energyNode.active = true;
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "通关1次简单排位赛后解锁");
        }
    }

    Wzhcq_clickEmeng_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        let Wzhcq_eMengState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_eMengState);
        if (Wzhcq_eMengState) {
            if (this.Wzhcq_isclick) {
                this.Wzhcq_isclick = false;
            }

            let avtype = 6;
            WxPlatform.getInstance.showRewardVideo2(avtype, (data: any) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                    Utils.getInstance.sjd_close_rewardav(avtype, true);

                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_eMengState, 0);
                    this.update_eMengState();
                    this.Wzhcq_clickEmengResult();

                    this.Wzhcq_isclick = true;
                }
                else if (data == 2) {

                    wx.showToast({
                        title: '暂时没有广告了,请稍后再试',
                        icon: 'none'
                    })
                    this.Wzhcq_isclick = true;

                }
                else if (data == 0) {

                    wx.showToast({
                        title: '播放中途退出',
                        icon: 'none'
                    })
                    this.Wzhcq_isclick = true;


                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
            })
        }
        else {
            this.Wzhcq_clickEmengResult();
        }
    }

    Wzhcq_clickEmengResult() {
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        let Wzhcq_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_GameType);
        if (Wzhcq_GameType > 0) {
            if (this.Wzhcq_life >= 5) {
                let Wzhcq_cur_time = Math.round(new Date().getTime() / 1000);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_time);
            }

            let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
            if (Wzhcq_life > 0) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);

                let Wzhcq_heartPrefab = cc.instantiate(this.Wzhcq_heartPrefab);
                Wzhcq_heartPrefab.parent = this.node;
                Wzhcq_heartPrefab.position = cc.v3(-230, 600);
                cc.tween(Wzhcq_heartPrefab)
                    .to(0.5, { position: cc.v3(-155, -418) })
                    .call(() => {
                        this.Wzhcq_updateEnergy();
                        cc.director.preloadScene("Game", function () {
                            // console.log("加载成功");

                            let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                            Utils.getInstance.GameType = 4;

                            cc.director.loadScene("Game");
                        })
                    })
                    .start();
            }
            else {
                if (!this.Wzhcq_energyNode) {
                    this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
                    this.Wzhcq_energyNode.parent = this.node;
                }
                this.Wzhcq_energyNode.getComponent(Energy).initState(1);
                this.Wzhcq_energyNode.active = true;
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "通关1次困难排位赛后解锁");
        }
    }
}
