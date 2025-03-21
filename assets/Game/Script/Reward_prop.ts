import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reward_prop extends BaseComponent {

    isclick = true;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();
    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        WxPlatform.getInstance.showBanner();

    }

    reward_btn() {
        AudioManager.instance.playAudioBtn_Click();
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        if (this.isclick) {
            this.isclick = false;
        }

        let avtype = 14;
        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
            if (data == 1) {
                //激励视频完整播放 需要做的奖励；
                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                Utils.getInstance.sjd_close_rewardav(avtype, true);

                this.getReward(6);

                this.isclick = true;
                this.close();
            }
            else if (data == 2) {

                wx.showToast({
                    title: '暂时没有广告了,请稍后再试',
                    icon: 'none'
                })
                this.isclick = true;
            }
            else if (data == 0) {

                wx.showToast({
                    title: '播放中途退出',
                    icon: 'none'
                })
                this.isclick = true;

                Utils.getInstance.sjd_close_rewardav(avtype, false);
            }
        })
    }

    cancel_btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.getReward(3);
        this.close();
    }

    getReward(Wzhcq_propNum: any) {
        let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
        let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + Wzhcq_propNum);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + Wzhcq_propNum);

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + Wzhcq_propNum, 0.3, 100);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + Wzhcq_propNum, 0.8, 99);
    }

    close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();
    }
}