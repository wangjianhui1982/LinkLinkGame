
import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Recommend extends BaseComponent {

    @property(cc.Label)
    Wzhcq_label1: cc.Label = null;

    @property(cc.Label)
    Wzhcq_label2: cc.Label = null;

    Wzhcq_state: any;

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
        switch (Wzhcq_state) {
            case 1:
                this.Wzhcq_label1.string = "惊！！！弹指之间已连闯3关";
                this.Wzhcq_label2.string = "上【困难-排位赛】伺候？";
                break;
            case 2:
                this.Wzhcq_label1.string = "连下2城已无人能挡";
                this.Wzhcq_label2.string = "换个姿势玩一把【挪了个挪】？";
                break;
            case 3:
                this.Wzhcq_label1.string = "不消耗体力，不玩白不玩";
                this.Wzhcq_label2.string = "来一把【挪了个挪】拿海量积分？";
                break;
            case 4:
                this.Wzhcq_label1.string = "不消耗体力，不玩白不玩";
                this.Wzhcq_label2.string = "去【计时挑战】免3体力？";
                break;
        }
    }


    reward_btn() {
        AudioManager.instance.playAudioBtn_Click();
        let TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        if (this.Wzhcq_state == 1) {

            cc.director.preloadScene("Game", function () {
                // console.log("加载成功");
                Utils.getInstance.GameType = 3;

                let getCurTime = Utils.getInstance.getCurTime();
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendDay1, getCurTime);

                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState1, 1);
                cc.director.loadScene("Game");
            })
        }
        else if (this.Wzhcq_state == 2 || this.Wzhcq_state == 3) {
            if (this.Wzhcq_state == 2) {
                let getCurTime = Utils.getInstance.getCurTime();
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendDay2, getCurTime);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState2, 1);

            }
            else {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState3, 1);
            }

            cc.director.preloadScene("Game", function () {
                // console.log("加载成功");
                Utils.getInstance.GameType = 6;
                cc.director.loadScene("Game");
            })
        }
        else if (this.Wzhcq_state == 4) {
            let getCurTime = Utils.getInstance.getCurTime();
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendDay4, getCurTime);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState4, 1);

            let jishiCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_jishiCount);
            jishiCount += 1;
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_jishiCount, jishiCount);

            cc.director.preloadScene("Game", function () {
                // console.log("加载成功");
                Utils.getInstance.GameType = 5;

                cc.director.loadScene("Game");
            })
        }

        this.close();
    }

    close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();
    }

    cancel_btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (Utils.getInstance.GameType != 0) {
            if (this.Wzhcq_state == 1 || this.Wzhcq_state == 2) {
                let life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, life - 1);

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_RESTARTGAME, 0);
            }
            else {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

                cc.director.loadScene("Start")
            }
        }

        this.close();
    }
}



