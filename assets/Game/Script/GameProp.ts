import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

//因为子域跟主域代码不能互相引用，因此定义一个表，分别复制到两边当成一个来使用。
let Consts = {
    OpenDataKeys: {
        LevelKey: "nuoduidui",
    },
    DomainAction: {
        NuoDuiDui_ShowFriend: "NuoDuiDui_ShowFriendRank", //展示好友排行榜
    },
}

@ccclass
export default class GameProp extends BaseComponent {

    @property(cc.Node)
    protected Wzhcq_shuffleNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_tipsNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_anim_popglow: cc.Node = null;

    @property(cc.Node)
    Wzhcq_closeNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_nextBtn: cc.Node = null;

    @property(cc.Node)
    Wzhcq_video: cc.Node = null;

    Wzhcq_isclick = true;

    Wzhcq_propNum = 1;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        this.initData();
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

        if (Utils.getInstance.GameType == 3) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ClearanceDifficulty, 0);
        }

        WxPlatform.getInstance.showBanner();

        if (Utils.getInstance.JianDanTips && Utils.getInstance.GameType == 2) {
        }

        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_propNum = 2;
            this.Wzhcq_shuffleNode.color = cc.color(255, 255, 255)
            this.Wzhcq_tipsNode.color = cc.color(255, 255, 255)
        }
        else {
            this.Wzhcq_propNum = 1;
            this.Wzhcq_shuffleNode.color = cc.color(255, 255, 255)
            this.Wzhcq_tipsNode.color = cc.color(255, 255, 255)
        }

        this.Wzhcq_shuffleNode.getComponent(cc.Label).string = "洗牌x" + this.Wzhcq_propNum;
        this.Wzhcq_tipsNode.getComponent(cc.Label).string = "提示x" + this.Wzhcq_propNum;

        if (Utils.getInstance.GameType == 1) {
            this.Wzhcq_video.active = false;
            this.Wzhcq_closeNode.active = false;
        }
        else {
            this.Wzhcq_video.active = true;
            this.Wzhcq_closeNode.active = true;
        }
    }

    Wzhcq_clickReward_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        if (Utils.getInstance.GameType == 1) {
            let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
            let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + this.Wzhcq_propNum);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + this.Wzhcq_propNum);

            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + this.Wzhcq_propNum, 0.3, 100);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + this.Wzhcq_propNum, 0.8, 99);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
            this.Wzhcq_close();
            AudioManager.instance.playAudioReward();
        }
        else {
            let avtype = 3;
            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                    Utils.getInstance.sjd_close_rewardav(avtype, true);

                    let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
                    let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + this.Wzhcq_propNum);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + this.Wzhcq_propNum);

                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + this.Wzhcq_propNum, 0.3, 100);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + this.Wzhcq_propNum, 0.8, 99);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
                    this.Wzhcq_isclick = true;
                    this.Wzhcq_close();
                    AudioManager.instance.playAudioReward();

                    if (Utils.getInstance.GameType == 3) {
                        Utils.getInstance.isEnergyLookVideo = 1;
                    }
                }
                else if (data == 2) {

                    wx.showToast({
                        title: '暂时没有广告了,请稍后再试',
                        icon: 'none'
                    })
                    this.Wzhcq_isclick = true;
                }
                else if (data == 0) {

                    if (Utils.getInstance.JianDanTips && Utils.getInstance.GameType == 2) {
                    }

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
        WxPlatform.getInstance.hideBanner();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS);
    }

    Wzhcq_clickCancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_close();
    }
}
