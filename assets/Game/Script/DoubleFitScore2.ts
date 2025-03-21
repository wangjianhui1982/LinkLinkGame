const { ccclass, property } = cc._decorator;

@ccclass
export default class DoubleFitScore2 extends cc.Component {

    @property(cc.Label)
    Wzhcq_label: cc.Label = null;

    @property(cc.Node)
    Wzhcq_word: cc.Node = null;

    @property(cc.Node)
    Wzhcq_count: cc.Node = null;

    initData(Wzhcq_num: any, Wzhcq_type: any, Wzhcq_count: any) {
        this.Wzhcq_label.string = "+" + Wzhcq_num;
        this.Wzhcq_count.getComponent(cc.Label).string = Wzhcq_count;

        if (Wzhcq_type) {
            this.Wzhcq_word.active = true;
            this.Wzhcq_count.active = true;

            // this.Wzhcq_label.node.color = cc.color(255, 255, 255);
            this.Wzhcq_count.color = cc.color(255, 255, 255);
            this.Wzhcq_word.color = cc.color(255, 255, 255);

            cc.tween(this.node)
                .delay(0.3)
                .by(0.5, { opacity: 0, position: cc.v3(0, 50) })
                .delay(0.3)
                .call(() => {
                    this.node.destroy();
                })
                .start();
        }
        else {
            this.Wzhcq_word.active = false;
            this.Wzhcq_count.active = false;

            cc.tween(this.node)
                .delay(0.3)
                .by(0.5, { opacity: 0, position: cc.v3(0, 30) })
                .delay(0.3)
                .call(() => {
                    this.node.destroy();
                })
                .start();
        }
    }
}
