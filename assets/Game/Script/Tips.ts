
const { ccclass, property } = cc._decorator;

@ccclass
export default class Tips extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    initData(Wzhcq_str: any, Wzhcq_delay: any) {
        this.label.string = Wzhcq_str;

        if (Wzhcq_delay == undefined) {
            Wzhcq_delay = 0.5;
        }

        let width = 300;
        if (Wzhcq_str.toString().length * 50 < 300) {
            width = 300;
        }
        else {
            width = Wzhcq_str.toString().length * 50;
        }
        this.node.width = width;

        cc.tween(this.node)
            .delay(Wzhcq_delay)
            .by(2, { position: cc.v3(0, 300), opacity: 0 })
            .delay(0.1)
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
