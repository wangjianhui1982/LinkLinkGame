import AudioManager from "./AudioManager";
import SpriteLabel from "./SpriteLabel";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class conSteriliPlus extends cc.Component {

    @property(SpriteLabel)
    txtNum: SpriteLabel = null;

    @property(cc.Node)
    txt1: cc.Node = null;

    @property(SpriteLabel)
    plusNum: SpriteLabel = null;

    @property(SpriteLabel)
    scoreNum: SpriteLabel = null;

    show(double_hit_count: any, value2: any) {
        var self = this;

        if (double_hit_count == 1) {
            this.txtNum.node.active = false;
            this.txt1.active = false;
        }
        else {
            this.txtNum.node.active = true;
            this.txt1.active = true;
        }

        if (double_hit_count >= 5 && double_hit_count < 10) {
            this.txtNum.node.scale = 1.2;
        }
        else if (double_hit_count >= 10 && double_hit_count < 15) {
            this.txtNum.node.scale = 1.5;
        }
        else if (double_hit_count >= 15) {
            this.txtNum.node.scale = 1.8;
        }

        this.txtNum.setValue(double_hit_count, "", 0);

        AudioManager.instance.playAudioClear_bubbles(double_hit_count, value2);

        this.plusNum.setText("X");

        this.scoreNum.setValue(value2, "", 0);

        this.playAnim(this.node, "anim_conSteriliPlus", undefined)
            .then(function () {
                return self.actionAddEnd();
            })
    }

    actionAddEnd() {
        if (cc.isValid(this.node)) {
            this.node.removeFromParent();
        }
    }

    playAnim(node: any, name: any, bool: any) {
        if (bool === undefined) {
            bool = 0;
        }

        return Utils.getInstance.playWithNode(node, name, false, bool);
    }
}
