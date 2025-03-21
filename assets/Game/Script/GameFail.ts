import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameFail extends BaseComponent {

    @property(cc.Label)
    protected Wzhcq_str: cc.Label = null;

    Wzhcq_score = 0;
    Wzhcq_allScore = 0;

    Wzhcq_isclick = true;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        this.initData();
    }

    initData() {
        WxPlatform.getInstance.showBanner();

        this.Wzhcq_score = 0;
        this.Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        if (this.Wzhcq_allScore >= 100) {
            this.Wzhcq_score = Math.round(this.Wzhcq_allScore / 100);
        }

        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_str.string = "放弃本局视为挑战失败，将扣除一次挑战机会哟！";
        }
        else {
            if (this.Wzhcq_score > 0) {
                this.Wzhcq_str.string = "桌面上没有符合消除规则的麻将，闯关失败将扣除" + this.Wzhcq_score + "积分，积分将影响您的排名";
            }
            else {
                this.Wzhcq_str.string = "桌面上没有符合消除规则的麻将，闯关失败将扣除一定比例积分，积分将影响您的排名";
            }
        }
    }

    Wzhcq_clickRevive_Btn() {
        Utils.getInstance.sjd_revive_event(1);
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        let avtype = 4;
        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
            if (data == 1) {
                //激励视频完整播放 需要做的奖励；
                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                Utils.getInstance.sjd_close_rewardav(avtype, true);

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_REVIVE, undefined);
                this.Wzhcq_isclick = true;

                this.Wzhcq_close();
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

    Wzhcq_clickClose_Btn() {
        Utils.getInstance.sjd_revive_event(3);
        this.Wzhcq_close();
    }

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

    }

    Wzhcq_clickBackMain_Btn() {
        Utils.getInstance.sjd_revive_event(2);
        AudioManager.instance.playAudioBtn_Click();

        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, this.Wzhcq_allScore - this.Wzhcq_score);

        //每日挑战
        if (Utils.getInstance.GameType == 6) {
            let Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_allSession);
            Utils.getInstance.allSession = Wzhcq_allSession + 1;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_allSession, Utils.getInstance.allSession);

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_winningStreak, 0);

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_continuousNum, 0);
        }
        else {
            //闯关模式 
            let Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession);
            Utils.getInstance.allSession = Wzhcq_allSession + 1;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession, Utils.getInstance.allSession);

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_winningStreak, 0);
        }

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REPORT_RESULT, 0);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

        Utils.getInstance.sjd_clear_stage(false);

        cc.director.loadScene('Start');

        this.Wzhcq_close();
    }
}
