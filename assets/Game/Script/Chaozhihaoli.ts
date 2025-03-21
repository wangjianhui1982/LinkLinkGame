import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chaozhihaoli extends BaseComponent {

    @property(cc.Node)
    Wzhcq_closeNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_nextBtn: cc.Node = null;

    @property(cc.Node)
    Wzhcq_downTimeNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_Wordljjs: cc.Node = null;

    @property(cc.Node)
    Wzhcq_Wordmfhq: cc.Node = null;

    @property(cc.Node)
    Wzhcq_lockNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_anim_popglow: cc.Node = null;

    Wzhcq_isclick = true;
    Wzhcq_propNum = 1;
    Wzhcq_isDownTime = false;
    Wzhcq_intervalTime = -1;
    countdownSecond = Utils.getInstance.czhl_constDownTime;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("游戏进入后台");
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("重新返回游戏");

            this.updateData();
        }, this);

    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        this.initData();
    }

    initData() {
        cc.tween(this.Wzhcq_nextBtn)
            .repeatForever(
                cc.tween()
                    .to(0.8, { scale: 1.1 })
                    .to(0.8, { scale: 1 })
            )
            .start();

        cc.tween(this.Wzhcq_anim_popglow).repeatForever(
            cc.tween().by(3, { angle: -180 })
                .by(6, { angle: -360 })

        ).start();

        this.Wzhcq_closeNode.active = true;

        this.Wzhcq_propNum = 1;

        this.updateData();
    }

    updateData() {
        let VideoState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState);
        if (VideoState) {
            this.Wzhcq_lockNode.active = false;
            this.Wzhcq_Wordljjs.active = false;
            this.Wzhcq_Wordmfhq.active = true;
        }
        else {
            let curTime = Math.round(new Date().getTime() / 1000);
            let czhlDownTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_czhlDownTime);

            let offTime = curTime - czhlDownTime;
            if (offTime < Utils.getInstance.czhl_constDownTime) {
                this.countdownSecond = Utils.getInstance.czhl_constDownTime - offTime;
                this.Wzhcq_isDownTime = true;
                this.Wzhcq_lockNode.active = true;
                this.Wzhcq_Wordljjs.active = true;
                this.Wzhcq_Wordmfhq.active = false;
            }
            else {
                this.countdownSecond = 0;
                this.Wzhcq_isDownTime = false;
                this.Wzhcq_lockNode.active = false;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 1);
                this.Wzhcq_Wordljjs.active = false;
                this.Wzhcq_Wordmfhq.active = true;
            }
        }
    }

    protected update(dt: number): void {
        if (this.Wzhcq_intervalTime >= 0) {
            this.Wzhcq_intervalTime -= dt;
        }
        else {
            this.Wzhcq_intervalTime = 1;
            if (this.Wzhcq_isDownTime && this.countdownSecond > 0) {
                this.updateCountDown();
            }
        }
    }

    updateCountDown() {
        this.countdownSecond -= 1;
        this.Wzhcq_downTimeNode.getComponent(cc.Label).string = Utils.getInstance.hourFormSecondsFormatMinutes(this.countdownSecond);

        if (this.countdownSecond < 1) {
            this.Wzhcq_isDownTime = false;
            this.Wzhcq_lockNode.active = false;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 1);
            this.updateData();
        }
    }

    Wzhcq_clickReward_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        let VideoState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState);
        if (VideoState) {
            let avtype = 18;
            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                    Utils.getInstance.sjd_close_rewardav(avtype, true);

                    this.Wzhcq_isclick = true;

                    let czhlDownTime = Math.round(new Date().getTime() / 1000);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_czhlDownTime, czhlDownTime);

                    this.countdownSecond = Utils.getInstance.czhl_constDownTime;
                    this.Wzhcq_isDownTime = true;
                    this.Wzhcq_lockNode.active = true;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 0);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_CHAOZHIHAOLI, undefined);
                    this.Wzhcq_Wordljjs.active = true;
                    this.Wzhcq_Wordmfhq.active = false;

                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_GAMEPROP, undefined);

                    AudioManager.instance.playAudioReward();
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
            let avtype = 19;
            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    this.Wzhcq_isclick = true;

                    this.countdownSecond = 0;
                    this.Wzhcq_isDownTime = false;
                    this.Wzhcq_lockNode.active = false;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ChaozhihaoliVideoState, 1);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_CHAOZHIHAOLI, undefined);

                    this.Wzhcq_Wordljjs.active = false;
                    this.Wzhcq_Wordmfhq.active = true;
                    Utils.getInstance.sjd_close_rewardav(avtype, true);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "已解锁");
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
    }

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS);
    }

    Wzhcq_clickCancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        this.Wzhcq_close();
    }
}
