
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuidanceMask extends cc.Component {

    @property(cc.Node)
    Wzhcq_mask: cc.Node = null;

    @property(cc.Node)
    Wzhcq_touch: cc.Node = null;

    @property(cc.Node)
    Wzhcq_finger: cc.Node = null;

    @property(cc.Node)
    Wzhcq_tips: cc.Node = null;

    Wzhcq_guidanceStep1() {
        //第一步 (-35,86)  70,172
        this.Wzhcq_mask.position = cc.v3(-35, 86);
        this.Wzhcq_mask.width = 72;
        this.Wzhcq_mask.height = 172;
        this.Wzhcq_touch.active = false;

        this.Wzhcq_tips.getComponent(cc.Label).string = "同一行（列）2个相邻“红中”\n点击任意一个消除";
    }

    Wzhcq_guidanceStep2() {
        //第一步 (-35,86)  70,172
        this.Wzhcq_mask.position = cc.v3(-35, 43);
        this.Wzhcq_mask.width = 210;
        this.Wzhcq_mask.height = 86;
        this.Wzhcq_touch.active = false;

        this.Wzhcq_tips.getComponent(cc.Label).string = "同一行（中间没有障碍）2个“白板”\n点击任意一个消除";
    }

    Wzhcq_guidanceStep3() {
        //第一步 (-35,86)  70,172
        this.Wzhcq_mask.position = cc.v3(0, 0);
        this.Wzhcq_mask.width = 420;
        this.Wzhcq_mask.height = 342;
        this.Wzhcq_touch.active = true;
        this.Wzhcq_touch.position = cc.v3(-35, -129);

        this.Wzhcq_tips.getComponent(cc.Label).string = "按住麻将向上移动到同一行\n“二万”就消除啦";
    }


    Wzhcq_guidanceStep4() {
        //第一步 (-35,86)  70,172
        this.Wzhcq_mask.position = cc.v3(0, 0);
        this.Wzhcq_mask.width = 420;
        this.Wzhcq_mask.height = 342;
        this.Wzhcq_touch.active = true;
        this.Wzhcq_touch.position = cc.v3(175, 43);

        this.Wzhcq_tips.getComponent(cc.Label).string = "按住麻将向左移动到同一列\n“二条”就消除啦";
    }

    hideFinger () {

    }

    stopAllActon() {
        this.Wzhcq_touch.active = false;
        this.Wzhcq_finger.stopAllActions();
    }
}
