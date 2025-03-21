
const { ccclass, property } = cc._decorator;

import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

@ccclass
export default class warn_downTimeEnd extends BaseComponent {

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
        Utils.getInstance.sjd_revive_event(4);
        AudioManager.instance.playAudioBtn_Click();

        let avtype = 0;
        if (this.isclick) {
            if (Utils.getInstance.fristAddTime) {
                avtype = 11;
            }
            else {
                avtype = 12;
            }
            this.isclick = false;
        }

        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
            if (data == 1) {
                //激励视频完整播放 需要做的奖励；
                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                let time = 0;
                if (Utils.getInstance.fristAddTime) {
                    time = 60;
                    Utils.getInstance.fristAddTime = 0;
                    Utils.getInstance.sjd_close_rewardav(avtype, true);
                }
                else {
                    time = 30;
                    Utils.getInstance.sjd_close_rewardav(avtype, true);
                }

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, time);

                this.isclick = true;
                this.close();
            }
            else if (data == 2) {

                wx.showToast({
                    title: '暂时没有广告了,请稍后再试',
                    icon: 'none'
                })

                if (Utils.getInstance.fristAddTime) {
                }
                else {
                }
                this.isclick = true;
            }
            else if (data == 0) {

                wx.showToast({
                    title: '播放中途退出',
                    icon: 'none'
                })

                if (Utils.getInstance.fristAddTime) {
                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
                else {
                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
                this.isclick = true;
            }
        })
    }

    close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

    }

    cancel_btn() {
        Utils.getInstance.sjd_revive_event(5);
        AudioManager.instance.playAudioBtn_Click();
        
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REPORT_RESULT, 0);

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_WARN_POPUP, undefined);
    }
}
