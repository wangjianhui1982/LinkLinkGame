import BaseComponent from "../../Script/BaseComponent";
import { Wzhcq_StorageName } from "../../Script/Enum";
import ResourceLoader from "../../Script/ResourceLoader";
import { Utils } from "../../Script/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class tujianItem extends BaseComponent {

    @property(cc.Node)
    itemArray: cc.Node[] = [];

    tar: any;
    m_index = 0;
    curLevel: any;

    MaxLv: any;

    updateCell(event: any, Wzhcq_index: any) {
        Wzhcq_index = Math.floor(Wzhcq_index);
        this.m_index = Wzhcq_index;

        this.MaxLv = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex) + 1;

        let Wzhcq_level: number;
        if (this.MaxLv % 3 == 0) {
            Wzhcq_level = this.MaxLv;
        }
        else {
            Wzhcq_level = this.MaxLv + (3 - this.MaxLv % 3);
        }


        if (!(Wzhcq_level / 3 <= Wzhcq_index)) {
            for (let i = 0; i < this.itemArray.length; i++) {
                this.setLv(this.itemArray[i], i + Wzhcq_index * 3);
            }
        }
    }

    Refresh() {
        this.updateCell(null, this.m_index);
    }

    playAnim(Wzhcq_node: any, name: any, Wzhcq_bool: any) {
        if (Wzhcq_bool === undefined) {
            Wzhcq_bool = 0;
        }

        return Utils.getInstance.playWithNode(Wzhcq_node, name, false, Wzhcq_bool);
    }

    setLv(Wzhcq_node: cc.Node, Wzhcq_index: number) {
        let self = this;

        if (Wzhcq_index >= this.MaxLv) {
            Wzhcq_node.active = false;
        }
        else {
            Wzhcq_node.active = true;

            let Wzhcq_bg = Wzhcq_node.getChildByName("bg");
            let Wzhcq_bg2 = Wzhcq_node.getChildByName("bg2");
            let Wzhcq_num = Wzhcq_node.getChildByName("title").getChildByName("num");
            let Wzhcq_icon = Wzhcq_node.getChildByName("iconBg").getChildByName("icon");
            let Wzhcq_btn = Wzhcq_node.getChildByName("btn");
            let Wzhcq_selected = Wzhcq_node.getChildByName("selected");
            let Wzhcq_name = Wzhcq_node.getChildByName("name");

            Wzhcq_btn._index = Wzhcq_index;
            if (Wzhcq_index == this.MaxLv - 1) {
                Wzhcq_name.active = true;
                Wzhcq_btn.active = false;

                let material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
                Wzhcq_icon.getComponent(cc.Sprite).setMaterial(0, material);
            }
            else {
                Wzhcq_name.active = false;
                Wzhcq_btn.active = true;
                let material = cc.Material.getBuiltinMaterial("2d-sprite");
                Wzhcq_icon.getComponent(cc.Sprite).setMaterial(0, material);
            }

            let Wzhcq_selectedIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
            if (Wzhcq_selectedIndex == Wzhcq_index) {
                Wzhcq_selected.active = true;
                Wzhcq_btn.active = false;
                Wzhcq_bg2.active = true;
                Wzhcq_bg.active = false;
            }
            else {
                Wzhcq_selected.active = false;
                Wzhcq_bg.active = true;
                Wzhcq_bg2.active = false;
            }

            Wzhcq_num.getComponent(cc.Label).string = "No." + Wzhcq_index;

            let bundleName = Utils.getInstance.getBundleName(Wzhcq_index);

            cc.resources.load(bundleName + "/icons/" + Wzhcq_index, cc.SpriteFrame, function (err, spritaFrame) {
                Wzhcq_icon.getComponent(cc.Sprite).spriteFrame = spritaFrame;
            });
            // let res = ResourceLoader.getInstance.load("resources/" + bundleName, "icons/" + index, cc.SpriteFrame);
            // res.then((spritaFrame: any) => {
            //     icon.getComponent(cc.Sprite).spriteFrame = spritaFrame;
            // })

            Wzhcq_btn.off(cc.Node.EventType.TOUCH_END);
            Wzhcq_btn.on(cc.Node.EventType.TOUCH_END, this.itemBtnClick, this);
        }
    }

    itemBtnClick(event: any, type: any) {
        let index = event.target._index;

        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.selectedIndex, index);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.UPDATEBOARDSPRITE, undefined);

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.REFRESHTUJIAN, undefined);
    }
}
