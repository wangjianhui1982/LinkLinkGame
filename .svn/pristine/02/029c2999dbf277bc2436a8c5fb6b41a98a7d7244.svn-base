const { ccclass, property } = cc._decorator;

@ccclass
export default class DoubleFitScore extends cc.Component {

    @property(cc.Label)
    Wzhcq_label: cc.Label = null;

    @property(cc.Node)
    Wzhcq_word: cc.Node = null;

    @property(cc.Node)
    Wzhcq_count: cc.Node = null;

    @property(cc.ProgressBar)
    Wzhcq_pregressBar: cc.ProgressBar = null;

    Wzhcq_isDownTime = true;
    Wzhcq_add_time: any;
    Wzhcq_act_time: any;
    Wzhcq_sub_time: any;

    tweenFun: any;

    initData(Wzhcq_num: any, Wzhcq_type: any, Wzhcq_count: any) {
        this.Wzhcq_isDownTime = true;
        this.Wzhcq_add_time = 5;
        this.Wzhcq_act_time = 5;
        this.Wzhcq_sub_time = this.Wzhcq_act_time;

        this.Wzhcq_label.string = "+" + Wzhcq_num;
        this.Wzhcq_count.getComponent(cc.Label).string = Wzhcq_count;

        if (Wzhcq_type) {
            this.Wzhcq_word.active = true;
            this.Wzhcq_count.active = true;
            this.Wzhcq_pregressBar.node.active = true;

            this.Wzhcq_pregressBar.progress = 1;
            if (this.tweenFun) {
                this.tweenFun.stop();
            }
            cc.tween(this.Wzhcq_count)
                .to(0.1, { scale: 1.2 })
                .to(0.1, { scale: 1 })
                .start();

            this.tweenFun = cc.tween(this.node)
                .delay(0.3)
                .by(5, { opacity: 0 })
                .delay(0.3)
                .call(() => {
                    this.node.active = false;
                })
                .start();
        }
        else {
            this.Wzhcq_word.active = false;
            this.Wzhcq_count.active = false;
            this.Wzhcq_pregressBar.node.active = false;

            cc.tween(this.node)
                .delay(0.3)
                .by(1.5, { opacity: 0 })
                .delay(0.3)
                .call(() => {
                    this.node.active = false;
                })
                .start();
        }


    }

    update(dt: any) {
        if (this.Wzhcq_isDownTime) {
            this.Wzhcq_add_time -= dt;
            var Wzhcq_persent = this.Wzhcq_add_time / this.Wzhcq_act_time;
            if (Wzhcq_persent <= 0) {
                Wzhcq_persent = 0;
                this.Wzhcq_add_time = 5;
                this.Wzhcq_isDownTime = false;
                this.node.active = false;
            }
            this.Wzhcq_pregressBar.progress = Wzhcq_persent;

            this.Wzhcq_sub_time -= dt;
            var Wzhcq_per = this.Wzhcq_sub_time / this.Wzhcq_act_time;
            if (Wzhcq_per <= 0) {
                Wzhcq_per = 0;
                this.Wzhcq_sub_time = this.Wzhcq_act_time;
            }
        }
    }
}
