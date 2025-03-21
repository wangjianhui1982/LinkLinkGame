import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class addTime extends BaseComponent {

    @property(cc.Label)
    Wzhcq_label: cc.Label = null;

    @property(cc.Node)
    Wzhcq_reward: cc.Node = null;

    @property(cc.Label)
    Wzhcq_labelTime: cc.Label = null;

    @property(cc.Node)
    Wzhcq_icon: cc.Node = null;

    Wzhcq_isclick = true;

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
        let Wzhcq_lookDownTimeCount = Utils.getInstance.lookDownTimeCount;
        this.Wzhcq_label.string = "已使用次数：（" + Wzhcq_lookDownTimeCount + "/2）";

        if (Wzhcq_lookDownTimeCount == 2) {
            let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
            this.Wzhcq_reward.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
            this.Wzhcq_reward.getComponent(cc.Button).interactable = false;
        }
        else {
            let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
            this.Wzhcq_reward.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
            this.Wzhcq_reward.getComponent(cc.Button).interactable = true;
        }

        if (Utils.getInstance.isRevive) {
            if (Utils.getInstance.lookDownTimeCount == 0) {
                this.Wzhcq_labelTime.string = "剩余时间不多了，是否加时2分钟？";
            }
            else if (Utils.getInstance.lookDownTimeCount == 1) {
                this.Wzhcq_labelTime.string = "剩余时间不多了，是否加时2分钟？";
            }
        }
        else {
            if (Utils.getInstance.lookDownTimeCount == 0) {
                this.Wzhcq_labelTime.string = "剩余时间不多了，是否加时2分钟？";
            }
            else if (Utils.getInstance.lookDownTimeCount == 1) {
                this.Wzhcq_labelTime.string = "剩余时间不多了，是否加时2分钟？";
            }
        }

        let Wzhcq_PropAddTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropAddTime);
        if (Wzhcq_PropAddTime > 0) {
            this.Wzhcq_icon.active = false;
        }
        else {
            this.Wzhcq_icon.active = true;
        }

        WxPlatform.getInstance.showBanner();
    }

    reward_btn() {
        AudioManager.instance.playAudioBtn_Click();

        let avtype = 0;
        if (this.Wzhcq_isclick) {
            if (Utils.getInstance.isRevive) {
                avtype = 8;
            }
            else {
                if ((Utils.getInstance.lookDownTimeCount + 1) == 1) {
                    avtype = 9;
                }
                else if ((Utils.getInstance.lookDownTimeCount + 1) == 2) {
                    avtype = 10;
                }
            }
            this.Wzhcq_isclick = false;
        }

        let Wzhcq_PropAddTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropAddTime);
        if (Wzhcq_PropAddTime > 0) {
            Utils.getInstance.usePropAddTime += 1;

            Utils.getInstance.lookDownTimeCount += 1;
            let Wzhcq_time = 0;
            if (Utils.getInstance.isRevive) {
                if (Utils.getInstance.lookDownTimeCount == 1) {
                    Wzhcq_time = 120;
                }
                else if (Utils.getInstance.lookDownTimeCount == 2) {
                    Wzhcq_time = 120;
                }
            }
            else {
                if (Utils.getInstance.lookDownTimeCount == 1) {
                    Wzhcq_time = 120;
                    Utils.getInstance.sjd_close_rewardav(avtype, true);
                }
                else if (Utils.getInstance.lookDownTimeCount == 2) {
                    Wzhcq_time = 120;
                }
            }
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, Wzhcq_time);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropAddTime, Wzhcq_PropAddTime - 1);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
            this.Wzhcq_clickclose_Btn();
        }
        else {
            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                    Utils.getInstance.VideoPropAddTime += 1;

                    Utils.getInstance.lookDownTimeCount += 1;
                    let Wzhcq_time = 0;
                    if (Utils.getInstance.isRevive) {
                        if (Utils.getInstance.lookDownTimeCount == 1) {
                            Wzhcq_time = 120;
                        }
                        else if (Utils.getInstance.lookDownTimeCount == 2) {
                            Wzhcq_time = 120;
                        }
                        Utils.getInstance.sjd_close_rewardav(avtype, true);
                    }
                    else {
                        if (Utils.getInstance.lookDownTimeCount == 1) {
                            Wzhcq_time = 60;
                            Utils.getInstance.sjd_close_rewardav(avtype, true);
                        }
                        else if (Utils.getInstance.lookDownTimeCount == 2) {
                            Wzhcq_time = 30;
                            Utils.getInstance.sjd_close_rewardav(avtype, true);
                        }
                    }
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, Wzhcq_time);

                    this.Wzhcq_isclick = true;
                    this.Wzhcq_clickclose_Btn();
                }
                else if (data == 2) {

                    wx.showToast({
                        title: '暂时没有广告了,请稍后再试',
                        icon: 'none'
                    })

                    if (Utils.getInstance.isRevive) {
                    }
                    else {
                        if (Utils.getInstance.lookDownTimeCount == 1) {
                        }
                        else if (Utils.getInstance.lookDownTimeCount == 2) {
                        }
                    }
                    this.Wzhcq_isclick = true;
                }
                else if (data == 0) {

                    wx.showToast({
                        title: '播放中途退出',
                        icon: 'none'
                    })

                    if (Utils.getInstance.isRevive) {
                        Utils.getInstance.sjd_close_rewardav(avtype, false);
                    }
                    else {
                        if (Utils.getInstance.lookDownTimeCount == 1) {
                            Utils.getInstance.sjd_close_rewardav(avtype, false);
                        }
                        else if (Utils.getInstance.lookDownTimeCount == 2) {
                            Utils.getInstance.sjd_close_rewardav(avtype, false);
                        }
                    }
                    this.Wzhcq_isclick = true;

                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
            })
        }
    }

    Wzhcq_clickclose_Btn() {
        this.node.active = false;
        this.node.scale = 0;
        WxPlatform.getInstance.hideBanner();
    }

    Wzhcq_clickcancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, 0);
        this.Wzhcq_clickclose_Btn();
    }
}
