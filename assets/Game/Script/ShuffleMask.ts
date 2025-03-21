import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShuffleMask extends BaseComponent {

    @property(cc.Node)
    protected mask: cc.Node = null;

    protected onLoad(): void {

    }

    updateMask(width: any, height: any, pos: any) {
        this.mask.width = width;
        this.mask.height = height;
        this.mask.position = pos;
    }

    AbandonGame() {
        AudioManager.instance.playAudioBtn_Click();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_FAIL);
        this.node.active = false;
    }
}
