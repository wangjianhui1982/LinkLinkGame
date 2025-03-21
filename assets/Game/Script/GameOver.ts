import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOver extends BaseComponent {

    Wzhcq_propNum = 1;

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
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REPORT_RESULT, 1);
    }

    initData() {
        WxPlatform.getInstance.showBanner();

        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Guide, 0);
    }

    Wzhcq_clickNext_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
        let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + this.Wzhcq_propNum);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + this.Wzhcq_propNum);

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + this.Wzhcq_propNum, 0.3, 100);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + this.Wzhcq_propNum, 0.8, 99);

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);

        this.close();
    }

    close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS);
    }

}
