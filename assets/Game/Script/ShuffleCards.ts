import BaseComponent from "./BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShuffleCards extends BaseComponent {

    @property(cc.Node)
    Wzhcq_card1: cc.Node = null;

    @property(cc.Node)
    Wzhcq_card2: cc.Node = null;

    @property(cc.Node)
    Wzhcq_card3: cc.Node = null;

    loadTween() {
        this.Wzhcq_step1();
    }

    Wzhcq_step1() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween1(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step2.bind(this));
    }

    Wzhcq_step2() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween4(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step3.bind(this));
    }

    Wzhcq_step3() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween3(Wzhcq_self.Wzhcq_card1, Wzhcq_self.Wzhcq_step4.bind(this));
    }

    Wzhcq_step4() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween2(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step5.bind(this));
    }

    Wzhcq_step5() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween1(Wzhcq_self.Wzhcq_card1, Wzhcq_self.Wzhcq_step6.bind(this));
    }

    Wzhcq_step6() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween3(Wzhcq_self.Wzhcq_card1, Wzhcq_self.Wzhcq_step7.bind(this));
    }

    Wzhcq_step7() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween4(Wzhcq_self.Wzhcq_card3, Wzhcq_self.Wzhcq_step8.bind(this));
    }

    Wzhcq_step8() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween2(Wzhcq_self.Wzhcq_card1, Wzhcq_self.Wzhcq_step11.bind(this));
    }

    Wzhcq_step11() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween1(Wzhcq_self.Wzhcq_card3, Wzhcq_self.Wzhcq_step12.bind(this));
    }

    Wzhcq_step12() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween4(Wzhcq_self.Wzhcq_card3, Wzhcq_self.Wzhcq_step13.bind(this));
    }

    Wzhcq_step13() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween3(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step14.bind(this));
    }

    Wzhcq_step14() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween2(Wzhcq_self.Wzhcq_card3, Wzhcq_self.Wzhcq_step15.bind(this));
    }

    Wzhcq_step15() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween1(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step16.bind(this));
    }

    Wzhcq_step16() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween3(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step17.bind(this));
    }

    Wzhcq_step17() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween4(Wzhcq_self.Wzhcq_card1, Wzhcq_self.Wzhcq_step18.bind(this));
    }

    Wzhcq_step18() {
        let Wzhcq_self = this;
        Wzhcq_self.Wzhcq_tween2(Wzhcq_self.Wzhcq_card2, Wzhcq_self.Wzhcq_step19.bind(this));
    }

    Wzhcq_step19() {
        let Wzhcq_self = this;
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEEVENT, undefined);

        Wzhcq_self.node.stopAllActions();
        Wzhcq_self.node.removeFromParent();
    }

    Wzhcq_tween1(Wzhcq_node: any, Wzhcq_cbBack: any) {
        cc.tween(Wzhcq_node)
            .by(0.1, { position: cc.v3(0, 90) })
            .call(() => {
                if (Wzhcq_cbBack) {
                    Wzhcq_cbBack();
                }
            })
            .start();
    }

    Wzhcq_tween2(Wzhcq_node: any, Wzhcq_cbBack: any) {
        cc.tween(Wzhcq_node)
            .by(0.1, { position: cc.v3(0, -90) })
            .call(() => {
                if (Wzhcq_cbBack) {
                    Wzhcq_cbBack();
                }
            })
            .start();
    }

    Wzhcq_tween3(Wzhcq_node: any, Wzhcq_cbBack: any) {
        cc.tween(Wzhcq_node)
            .by(0.1, { position: cc.v3(75, 0) })
            .call(() => {
                if (Wzhcq_cbBack) {
                    Wzhcq_cbBack();
                }
            })
            .start();
    }

    Wzhcq_tween4(Wzhcq_node: any, Wzhcq_cbBack: any) {
        cc.tween(Wzhcq_node)
            .by(0.1, { position: cc.v3(-75, 0) })
            .call(() => {
                if (Wzhcq_cbBack) {
                    Wzhcq_cbBack();
                }
            })
            .start();
    }
}
