import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class addDesktop extends BaseComponent {

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();
    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

    }

    Wzhcq_clickReward_Btn() {
        this.node.active = false;
        this.node.scale = 0;
    }
}
