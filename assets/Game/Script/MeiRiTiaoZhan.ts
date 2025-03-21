
const { ccclass, property } = cc._decorator;

import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

@ccclass
export default class MeiRiTiaoZhan extends BaseComponent {

    @property(cc.Node)
    Wzhcq_challengeNumLabel: cc.Node = null;

    @property(cc.Node)
    Wzhcq_Wordqwtz: cc.Node = null;

    @property(cc.Node)
    Wzhcq_Wordhdcs: cc.Node = null;

    @property(cc.Node)
    Wzhcq_video: cc.Node = null;

    @property(cc.Prefab)
    Wzhcq_rankPrefab: cc.Prefab = null;

    @property(cc.Label)
    leijitongguan: cc.Label = null;

    @property(cc.Label)
    lianxvtongguan: cc.Label = null;

    @property(cc.Node)
    meiriguoguan: cc.Node = null;

    @property(cc.Node)
    tips: cc.Node = null;

    @property(cc.Node)
    Wzhcq_getuserInfo: cc.Node = null;

    Wzhcq_rankNode: any;
    Wzhcq_isclick = true;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_MRTZRANK, this.Wzhcq_create_rank, this);
    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        this.initData();
    }

    Wzhcq_createUserInfoButton() {
        let self = this;
        let Wzhcq_AllRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        if (Wzhcq_AllRankScore > 0) {
            // console.log("Wzhcq_createUserInfoButton openid:", Utils.getInstance.openid)

            if (Utils.getInstance.openid != null && Utils.getInstance.username != null && Utils.getInstance.headurl != null) {
                // console.log("Wzhcq_createUserInfoButton openid1:", Utils.getInstance.openid);
                this.Wzhcq_create_rank();
            }
            else {
                // if (!Utils.getInstance.button) {
                // console.log("Wzhcq_createUserInfoButton111111111111111111:")
                Utils.getInstance.getUserInfo2(self.Wzhcq_getuserInfo);
                // }
            }
        }
        else {
            // console.log("openid2:", Utils.getInstance.openid)
            if (Utils.getInstance.openid == null || Utils.getInstance.username == null || Utils.getInstance.headurl == null) {
                Utils.getInstance.getUserInfo2(self.Wzhcq_getuserInfo);
                return;
            }
            this.Wzhcq_create_rank();
        }
    }

    Wzhcq_create_rank() {
        console.log("Wzhcq_createUserInfoButton openid1:", Utils.getInstance.openid);
        if (!this.Wzhcq_rankNode) {
            this.Wzhcq_rankNode = cc.instantiate(this.Wzhcq_rankPrefab);
            this.Wzhcq_rankNode.parent = this.node;
        }
        this.Wzhcq_rankNode.active = true;
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

        this.Wzhcq_MeiritiaozhanState();
        this.isTiaoZhanSuccess();

        this.leijitongguan.string = "累计通关 " + Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        this.lianxvtongguan.string = "Top连续通关 " + Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);

        this.updateData();
    }

    updateData() {
        let challengeNum = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_challengeNum);
        this.Wzhcq_challengeNumLabel.getComponent(cc.Label).string = "挑战次数：" + challengeNum;

        if (challengeNum > 0) {
            this.Wzhcq_Wordqwtz.active = true;
            this.Wzhcq_Wordhdcs.active = false;
            this.Wzhcq_video.active = false;
        }
        else {
            this.Wzhcq_Wordqwtz.active = false;
            this.Wzhcq_Wordhdcs.active = true;
            this.Wzhcq_video.active = true;
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
            this.meiriguoguan.active = true;
            this.tips.active = false;
        }
        else {
            this.meiriguoguan.active = false;
            this.tips.active = true;
        }
    }

    Wzhcq_MeiritiaozhanState() {
        let Wzhcq_getCurTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanDay);
        let Wzhcq_CurTime = Utils.getInstance.getCurTime();

        let Wzhcq_MeiritiaozhanState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanState);
        if (Wzhcq_MeiritiaozhanState > 0) {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanState, 0);
            }
        }
        else {
            if (Wzhcq_getCurTime != Wzhcq_CurTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanState, 0);
            }
        }

        let Wzhcq_MeiritiaozhanState2 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanState);
        if (Wzhcq_MeiritiaozhanState2 < 1) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanState, 1);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_challengeNum, 1);
        }
    }

    Wzhcq_clickReward_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        let challengeNum = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_challengeNum);
        if (challengeNum > 0) {
            challengeNum -= 1;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_challengeNum, challengeNum);
            this.updateData();

            let Wzhcq_getCurTime = Utils.getInstance.getCurTime();
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_MeiritiaozhanDay, Wzhcq_getCurTime);

            Utils.getInstance.GameType = Utils.getInstance.meiritiaozhanData[6].type;
            cc.director.loadScene("Game");
        }
        else {
            let avtype = 6;
            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_challengeNum, 2);
                    this.updateData();
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

    Wzhcq_clickCancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSEMRTZ, undefined);
        this.Wzhcq_close();
    }

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;
    }
}
