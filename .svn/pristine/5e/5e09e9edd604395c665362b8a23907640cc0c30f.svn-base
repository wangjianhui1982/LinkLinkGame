import AudioManager from "./AudioManager";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Warn extends cc.Component {

    @property(cc.Label)
    labelStr: cc.Label = null;

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

        this.initData();
    }

    initData() {
        if (Utils.getInstance.GameType == 6) {
            this.labelStr.string = "放弃本局视为挑战失败，将扣除一次挑战机会哟！";
        }
        else {
            this.labelStr.string = "放弃本局视为闯关失败，将扣除一定比例的积分，积分将影响您的排名哟！";
        }
    }

    back_btn() {
        AudioManager.instance.playAudioBtn_Click();

        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

        Utils.getInstance.sjd_clear_stage(false);

        cc.director.loadScene("Start")
    }

    close_btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

    }
}