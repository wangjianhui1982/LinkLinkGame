import AudioManager from "../../Script/AudioManager";
import BaseComponent from "../../Script/BaseComponent";
import { Wzhcq_StorageName } from "../../Script/Enum";
import { Utils } from "../../Script/Utils";
import ExtScrollView from "./ExtScrollView";
import tujianItem from "./tujianItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TuJian extends BaseComponent {

    @property(cc.Label)
    numLabel: cc.Label = null;

    @property(ExtScrollView)
    scrollview: ExtScrollView = null;

    @property(cc.Node)
    btn: cc.Node = null;

    level = 0;

    onLoad() {
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.REFRESHTUJIAN, this.initUI, this);
    }

    start() {

    }

    protected onEnable(): void {
        this.initUI();
        Utils.getInstance.hideUserInfoButton();
    }

    initUI() {
        let Wzhcq_boardIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);
        this.numLabel.string = "" + Wzhcq_boardIndex + "/201";

        if (Wzhcq_boardIndex > Utils.getInstance.MaxLv) {
            Wzhcq_boardIndex = Utils.getInstance.MaxLv;
            this.btn.active = false;
        }
        this.level = Wzhcq_boardIndex;

        let Wzhcq_MaxLv = this.level + 1;
        let Wzhcq_count = Math.ceil(Wzhcq_MaxLv / 3);
        let Wzhcq_cur = Math.floor(this.level / 3);
        let Wzhcq_dataList = [];

        for (let idx = 0; idx < Wzhcq_count; idx++) {
            Wzhcq_dataList.push(0);
        }

        this.scrollview.content.removeAllChildren();
        if (this.scrollview.content.childrenCount <= 0) {
            this.scrollview.loadData(Wzhcq_dataList, Wzhcq_count - Wzhcq_cur - 1, undefined)
        }
        else {
            this.scrollview.content.children.forEach(function (node) {
                node.getComponent(tujianItem).Refresh();
            });
        }

    }

    clickBtn() {
        AudioManager.instance.playAudioBtn_Click();
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, undefined);
    }

    closeBtn() {
        AudioManager.instance.playAudioBtn_Click();
        this.node.active = false;
        Utils.getInstance.showUserInfoButton();
    }
}
