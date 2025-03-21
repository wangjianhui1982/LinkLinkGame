
const { ccclass, property } = cc._decorator;

import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

@ccclass
export default class PropReward extends BaseComponent {

    @property(cc.Node)
    Wzhcq_anim_popglow: cc.Node = null;

    @property(cc.Node)
    Wzhcq_closeNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_nextBtn: cc.Node = null;

    @property(cc.Node)
    Wzhcq_video: cc.Node = null;

    Wzhcq_isclick = true;

    Wzhcq_propNum = 1;

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
        cc.tween(this.Wzhcq_nextBtn)
            .repeatForever(
                cc.tween()
                    .to(0.8, { scale: 1.1 })
                    .to(0.8, { scale: 1 })
            )
            .start();


        cc.tween(this.Wzhcq_anim_popglow).repeatForever(
            cc.tween().by(3, { angle: -180 })
                .by(6, { angle: -360 })

        ).start();

        this.Wzhcq_closeNode.active = false;

        this.Wzhcq_propNum = 1;

        this.Wzhcq_video.active = false;
    }

    Wzhcq_clickReward_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
        let Wzhcq_PropCancellation = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropCancellation);
        let Wzhcq_PropAddTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropAddTime);
        let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + this.Wzhcq_propNum);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropCancellation, Wzhcq_PropCancellation + this.Wzhcq_propNum);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropAddTime, Wzhcq_PropAddTime + this.Wzhcq_propNum);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + this.Wzhcq_propNum);

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + this.Wzhcq_propNum, 0.3, 100);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得加时道具x" + this.Wzhcq_propNum, 0.8, 99);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得消牌道具x" + this.Wzhcq_propNum, 1.3, 98);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + this.Wzhcq_propNum, 1.8, 97);
        AudioManager.instance.playAudioReward();
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
        this.Wzhcq_close();
    }

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;
        WxPlatform.getInstance.hideBanner();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS);
    }

    Wzhcq_clickCancel_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_close();
    }
}
