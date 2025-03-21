import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Energy extends BaseComponent {

    Wzhcq_isclick = true;
    Wzhcq_state = 1;

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

    initState(Wzhcq_state: any) {
        this.Wzhcq_state = Wzhcq_state;
    }

    Wzhcq_clickSure_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        let avtype = 5;
        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
            if (data == 1) {
                //激励视频完整播放 需要做的奖励；
                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                Utils.getInstance.sjd_close_rewardav(avtype, true);

                let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
                if (this.Wzhcq_state == 2) {

                    if(Wzhcq_life + 2 > 10) {
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, 10);
                    }
                    else {
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life + 2);
                    }
                }
                else if (this.Wzhcq_state == 1) {
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life + 1);

                    Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                    let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                    if (level > Utils.getInstance.MaxLevel) {
                        level = Utils.getInstance.getLevelRange(level);
                    }
                    Utils.getInstance.GameType = Utils.getInstance.levelData[level].type;

                    cc.director.loadScene("Game");
                }
                else if (this.Wzhcq_state == 0) {
                    if (Utils.getInstance.GameType == 3) {
                        Utils.getInstance.isEnergyLookVideo = 1;
                    }

                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life + 1);

                    let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                    Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                    let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                    if (level > Utils.getInstance.MaxLevel) {
                        level = Utils.getInstance.getLevelRange(level);
                    }
                    Utils.getInstance.GameType = Utils.getInstance.levelData[level].type;

                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_RESTARTGAME, 0);
                }

                let Wzhcq_EnergyCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyCount);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyCount, Wzhcq_EnergyCount + 1);

                let Wzhcq_getCurTime = Utils.getInstance.getCurTime();
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyDay, Wzhcq_getCurTime);

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_ENERGY, undefined);

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

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

    }

    Wzhcq_clickCancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (Utils.getInstance.GameType == 0) {

        }
        else {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

            cc.director.loadScene("Start");
        }

        this.Wzhcq_close();
    }
}
