import { Utils } from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class touch_loading extends cc.Component {

    @property(cc.Node)
    Wzhcq_loadingNode: cc.Node = null;

    @property(cc.Label)
    Wzhcq_txtDesc: cc.Label = null;

    onLoad() {
        this.Wzhcq_loadingNode.active = false;
        this.Wzhcq_txtDesc.string = "";
    }

    showLoading(Wzhcq_isbool:any, Wzhcq_bool:any) {
        this.Wzhcq_loadingNode.active = Wzhcq_isbool;
        this.playAnim(this.Wzhcq_loadingNode, "anim_game_load", Wzhcq_bool);
    }

    playAnim(Wzhcq_node:any, Wzhcq_name:any, Wzhcq_bool:any) {
        if (Wzhcq_bool === undefined) {
            Wzhcq_bool = 0;
        }

        return Utils.getInstance.playWithNode(Wzhcq_node, Wzhcq_name, false, Wzhcq_bool);
    }

    showDesc(Wzhcq_str:any) {
        this.Wzhcq_txtDesc.string = Wzhcq_str;
    }
}
