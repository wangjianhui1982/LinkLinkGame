
const { ccclass, property } = cc._decorator;
import tujianItem from "./tujianItem";

export const AnimType = cc.Enum({
    none: 0,
    scale: 1,
    scaleX: 2,
    scaleY: 3
});

@ccclass
export default class ExtScrollView extends cc.ScrollView {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Float)
    itemspace: any = 10;

    @property({ type: AnimType, displayName: "AnimType" })
    animType = AnimType.none;

    itemNodeArr = [];
    itemTempSize = null;
    prevContentPosition = cc.v3(0, 0);
    contentRect: any;
    dataList: any;
    firstNode: any;
    lastNode: any;

    onLoad() {
        if (this.vertical) {
            this.content.anchorX = 0.5;
            this.content.anchorY = 1;
        }
        else {
            this.content.anchorX = 1;
            this.content.anchorY = 0.5;
        }
    }

    loadData(dataList: any, t: any, delay: any) {
        var self = this;
        if (undefined === t) {
            t = 0;
        }
        if (undefined === delay) {
            delay = 0.01;
        }

        this.scheduleOnce(function () {
            self.contentRect = self.node.getBoundingBoxToWorld();
            self.dataList = dataList;
            self.createCellList(t);
            self.content.on(cc.Node.EventType.POSITION_CHANGED, self.updateContentView, self);
        }, delay);
    }

    createCellList(e: any) {
        void 0 === e && (e = 0);
        this.itemTempSize = this.itemPrefab.data.getContentSize();

        if (this.vertical) {
            this.content.height = this.dataList.length * (this.itemTempSize.height + this.itemspace);
            this.content.y = this.content.parent.height / 2 + (this.itemTempSize.height + this.itemspace) * e;
            this.content.y = Math.min(this.content.y, this.content.height - this.content.parent.height / 2);

            if (this.content.height <= this.content.parent.height) {
                this.content.y = this.content.parent.height / 2;
            }

        }
        else {
            this.content.width = this.dataList.length * (this.itemTempSize.width + this.itemspace);
            this.content.x = this.content.parent.width / -2 - (this.itemTempSize.width + this.itemspace) * e;
            this.content.x = Math.max(this.content.x, -this.content.width + this.content.parent.width / 2);

            if (this.content.width <= this.content.parent.width) {
                this.content.x = -this.content.parent.width / 2;
            }

        }

        for (var t, n,

            o = this.vertical
                ?
                Math.ceil(this.node.height / this.itemTempSize.height)
                :
                Math.floor(this.node.width / this.itemTempSize.width),
            i = e = e > this.dataList.length - o
                ?
                Math.max(this.dataList.length - o, 0)
                :
                e, r = 0;
            t = cc.instantiate(this.itemPrefab),
            this.content.addChild(t),
            this.itemNodeArr.push(t),
            i >= this.dataList.length
                ?
                t.active = !1
                :
                t.getComponent(tujianItem).updateCell(this.dataList[i], i),
            this.vertical
                ?
                t.y = -i * (this.itemTempSize.height + this.itemspace) - (this.itemTempSize.height - this.itemTempSize.height * t.anchorY)
                :
                t.x = i * (this.itemTempSize.width + this.itemspace) + (this.itemTempSize.width - this.itemTempSize.width * t.anchorX),
            t.__itemID = i,
            n = t.getBoundingBoxToWorld(),
            this.animType !== AnimType.none &&
            (
                this.animType == AnimType.scale &&
                (t.scale = 0),
                this.animType == AnimType.scaleX && (t.scaleX = 0),
                this.animType == AnimType.scaleY && (t.scaleY = 0),
                t.runAction
                    (
                        cc.sequence
                            (
                                cc.delayTime(.1 * r),
                                cc.scaleTo(.3, 1, 1).easing(cc.easeBackOut())
                            )
                    ),
                r++
            ),
            i == e &&
            (this.firstNode = t),
            this.lastNode = t,
            !(i >= this.dataList.length) &&
            (i++, this.contentRect.intersects(n));
        );
    }

    updateContentView() {
        var e: any;
        var t: any;
        var bool = this.vertical
            ?
            this.content.y < this.prevContentPosition.y
            :
            this.content.x > this.prevContentPosition.x;

        if (bool && 0 < this.firstNode.__itemID) {
            e = this.lastNode.getBoundingBoxToWorld();
            this.contentRect.intersects(e) ||
                (
                    this.lastNode.active = !0,
                    this.vertical ?
                        this.lastNode.y = this.firstNode.y + this.itemTempSize.height + this.itemspace :
                        this.lastNode.x = this.firstNode.x - (this.itemTempSize.width + this.itemspace),
                    t = Math.max(0, this.firstNode.__itemID - 1),
                    this.lastNode.__itemID = t,
                    this.lastNode.getComponent(tujianItem).updateCell(this.dataList[t], t),
                    this.firstNode = this.lastNode,
                    this.itemNodeArr.unshift(this.itemNodeArr.pop()),
                    this.lastNode = this.itemNodeArr[this.itemNodeArr.length - 1]
                )
        }
        else if (!bool && this.lastNode.__itemID < this.dataList.length - 1) {

            e = this.firstNode.getBoundingBoxToWorld();
            this.contentRect.intersects(e) ||
                (
                    this.vertical ?
                        this.firstNode.y = this.lastNode.y - (this.itemTempSize.height + this.itemspace) :
                        this.firstNode.x = this.lastNode.x + this.itemTempSize.width + this.itemspace,
                    t = Math.min(this.dataList.length - 1, this.lastNode.__itemID + 1),
                    this.firstNode.__itemID = t,
                    this.firstNode.getComponent(tujianItem).updateCell(this.dataList[t], t),
                    this.lastNode = this.firstNode,
                    this.itemNodeArr.push(this.itemNodeArr.shift()),
                    this.firstNode = this.itemNodeArr[0]
                )
        }

        this.prevContentPosition = this.content.position
    }
}
