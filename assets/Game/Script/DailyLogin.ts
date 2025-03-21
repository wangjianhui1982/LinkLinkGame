import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyLogin extends BaseComponent {

    @property(cc.Node)
    Wzhcq_PropArray: cc.Node[] = [];

    @property(cc.Node)
    Wzhcq_PropEnergy: cc.Node = null;

    @property(cc.Sprite)
    Wzhcq_titleNode: cc.Sprite = null;

    @property(cc.Node)
    Wzhcq_energyDes_Node: cc.Node = null;

    @property(cc.Node)
    Wzhcq_propDes_Node: cc.Node = null;

    @property(cc.SpriteFrame)
    Wzhcq_titleFrame: cc.SpriteFrame[] = [];

    Wzhcq_isclick = true;
    Wzhcq_index = 0;
    Wzhcq_noEnergy: any;

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

        let Wzhcq_getCurTime = Utils.getInstance.getCurTime();

        this.Wzhcq_noEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_NoEnergy);
        if (this.Wzhcq_noEnergy < 1 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life) == 0) {
            this.Wzhcq_PropEnergy.active = true;
            for (let i = 0; i < this.Wzhcq_PropArray.length; i++) {
                this.Wzhcq_PropArray[i].active = false;
            }
            this.Wzhcq_index = 3;

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_NoEnergyDay, Wzhcq_getCurTime);

            this.Wzhcq_titleNode.spriteFrame = this.Wzhcq_titleFrame[0];
            this.Wzhcq_energyDes_Node.active = true;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_NoEnergy, 1);
        }
        else {
            this.Wzhcq_PropEnergy.active = false;
            // this.Wzhcq_index = Math.floor(Math.random() * 3);
            this.Wzhcq_index = Utils.getInstance.RandomSum();

            for (let i = 0; i < this.Wzhcq_PropArray.length; i++) {
                let node = this.Wzhcq_PropArray[i];
                if (this.Wzhcq_index == i) {
                    node.active = true;
                }
                else {
                    node.active = false;
                }
            }
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_DailyLoginDay, Wzhcq_getCurTime);

            this.Wzhcq_titleNode.spriteFrame = this.Wzhcq_titleFrame[1];
            this.Wzhcq_propDes_Node.active = true;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_DailyLogin, 1);
        }
    }

    Wzhcq_clickReward_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        let avtype = 0;
        if (this.Wzhcq_isclick) {
            if (this.Wzhcq_noEnergy < 1 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life) == 0) {
                avtype = 17;
            }
            else {
                avtype = 15;
            }
            this.Wzhcq_isclick = false;
        }

        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
            if (data == 1) {
                //激励视频完整播放 需要做的奖励；
                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                if (this.Wzhcq_noEnergy < 1 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life) == 0) {
                    Utils.getInstance.sjd_close_rewardav(avtype, true);
                }
                else {
                    Utils.getInstance.sjd_close_rewardav(avtype, true);
                }
                AudioManager.instance.playAudioReward();
                this.Wzhcq_getReward();
                this.Wzhcq_isclick = true;
                this.Wzhcq_close();
            }
            else if (data == 2) {

                wx.showToast({
                    title: '暂时没有广告了,请稍后再试',
                    icon: 'none'
                })
                this.Wzhcq_isclick = true;
                if (this.Wzhcq_noEnergy < 1 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life) == 0) {
                }
                else {
                }
            }
            else if (data == 0) {

                wx.showToast({
                    title: '播放中途退出',
                    icon: 'none'
                })
                this.Wzhcq_isclick = true;
                if (this.Wzhcq_noEnergy < 1 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life) == 0) {
                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
                else {
                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
            }
        })
    }

    Wzhcq_clickCancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_close();
    }

    Wzhcq_getReward() {
        switch (this.Wzhcq_index) {
            case 0:
                let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + 3);
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x3");

                break;

            case 1:
                let Wzhcq_PropCancellation = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropCancellation);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropCancellation, Wzhcq_PropCancellation + 3);
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得消牌道具x3");

                break;
            case 2:
                let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + 2);
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x2");

                break;

            case 3:
                let Wzhcq_Life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
                if (Wzhcq_Life + 2 >= 5) {
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, 5);
                }
                else {
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_Life + 3);
                }
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得体力x3");
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_ENERGY, undefined);

                break;
        }

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
    }

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();
    }
}