import ResourceLoader from "./ResourceLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class segment extends cc.Component {

    @property(cc.SpriteFrame)
    sprite: cc.SpriteFrame[] = [];

    initData(index: any, num: any) {
        let self = this;
        // let count = num % 5;
        // if(count <= 3 && count != 0) {
        //     let callBack = function callBack(idx: any) {
        //         let node = self.node.children[idx];
        //         let sprite = node.getComponent(cc.Sprite);
        //         ResourceLoader.getInstance.load("paintBoard", "segment/segment" + (index + 1), cc.SpriteFrame)
        //             .then(function (spriteFrame: any) {
        //                 sprite.spriteFrame = spriteFrame;
        //                 node.opacity = 0;
        //                 cc.tween(node)
        //                     .delay(0.1 * idx)
        //                     .to(0.2, { opacity: 255 })
        //                     .start();
        //             });
        //     };

        //     for (let i = 0; i < self.node.children.length; i++) {
        //         callBack(i);
        //     }
        // }

        // this.scheduleOnce(() => {
        //     for (let i = 0; i < self.node.children.length; i++) {
        //         let node = self.node.children[i];
        //         node.active = false;
        //     }
        //     self.node.getComponent(cc.Sprite).spriteFrame = self.sprite[index];
        // }, 0.5);

        self.node.getComponent(cc.Sprite).spriteFrame = self.sprite[index % 10];
    }

    moveStart(callBack: any) {
        cc.log("tmp rope moveStart");
        cc.tween(this.node)
            .to(0.5, { scale: 1 })
            .call(function () {
                callBack();
            })
            .start();
    };
}
