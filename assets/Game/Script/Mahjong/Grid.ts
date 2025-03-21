import BaseComponent from '../BaseComponent';
import { ECellType } from '../Game';
import { Utils } from '../Utils';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid extends BaseComponent {
    public pos: string;

    @property(cc.Node)
    protected water: cc.Node = null;

    protected onLoad(): void {

        if (Utils.getInstance.GameType == 4) {
            this.node.scale = Utils.getInstance.levelData[Utils.getInstance.Level].scale;
        }
        else if (Utils.getInstance.GameType == 1 ||
            Utils.getInstance.GameType == 2 ||
            Utils.getInstance.GameType == 3 ||
            Utils.getInstance.GameType == 5) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                this.node.scale = 0.9;
            }
            else {
                this.node.scale = Utils.getInstance.levelData[Utils.getInstance.Level].scale;
            }

        }
        else if (Utils.getInstance.GameType == 6) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                this.node.scale = 0.9;
            }
            else {
                this.node.scale = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
            }
        }
        else if (Utils.getInstance.GameType == 7) {
            if (Utils.getInstance.StoreyIndex == 0) {
                this.node.scale = 1.3125;
            }
            else if (Utils.getInstance.StoreyIndex == 1) {
                this.node.scale = 1.125;
            }
            else if (Utils.getInstance.StoreyIndex == 2) {
                this.node.scale = 1;
            }
        }
    }

    setType(type: number) {
        let color: cc.Color = cc.color(113, 190, 113);
        switch (type) {
            case ECellType.START: {
                color = cc.color(125, 125, 226);
                break;
            }
            case ECellType.END: {
                color = cc.color(226, 125, 125);
                break;
            }
            case ECellType.PATH: {
                color = cc.color(125, 226, 125);
                this.SetWaterVisible(true);
                break;
            }
            case ECellType.OBSTACLES: {
                // color = cc.color(125, 125, 125);
                color = cc.color(255, 255, 255);
                break;
            }
            case ECellType.NOMAL: {
                color = cc.color(255, 255, 255);
                this.SetWaterVisible(false);
                break;
            }
        }
    }

    setTypePath() {
        this.SetWaterVisible(true);
    }

    setTypeNomal() {
        cc.tween(this.water)
            .to(0.45, { opacity: 0 })
            .call(() => {
                // this.water.active = false;
            })
            .start();
    }

    SetTipNodeVisible(visible: any): void {
        this.node.active = visible;
    }

    public SetWaterVisible(Wzhcq_visible: any): void {
        let self = this;
        if (!Wzhcq_visible) {
            cc.tween(this.water)
                .to(0.45, { opacity: 0 })
                .call(() => {
                    self.water.active = false;
                    if (!self.water.active) {
                        self.water.getComponent(cc.Animation).play("water");
                    }
                })
                .start();
        }
        else {
            this.water.active = Wzhcq_visible;
            if (!this.water.active) {
                this.water.getComponent(cc.Animation).play("water");
            }
        }
    }

    setWaterColor() {
        this.water.color = cc.color(33, 123, 123);
    }

    clearWaterColor() {
        this.water.color = cc.color(255, 255, 255);
    }

    setColor() {
        this.node.getChildByName('Back').color = cc.color(33, 123, 123);
    }

    clearColor() {
        this.node.getChildByName('Back').color = cc.color(255, 255, 255);
    }
}
