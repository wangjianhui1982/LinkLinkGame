import ResourceLoader from "../../Script/ResourceLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeSegmentManager {

    private static instance: RopeSegmentManager = null;
    public static get getInstance(): RopeSegmentManager {
        if (RopeSegmentManager.instance == null) {
            RopeSegmentManager.instance = new RopeSegmentManager();
        }
        return RopeSegmentManager.instance;
    }

    segmentPools = new Map();

    getSegment(Wzhcq_key: any) {
        if (this.segmentPools.has(Wzhcq_key)) {

        }
        else {
            this.segmentPools.set(Wzhcq_key, new cc.NodePool());
        }

        let Wzhcq_pool = this.segmentPools.get(Wzhcq_key);
        if (Wzhcq_pool.size() <= 0) {
            let Wzhcq_node = new cc.Node("RopeSegment");
            let Wzhcq_sprite = Wzhcq_node.addComponent(cc.Sprite);
            ResourceLoader.getInstance.load("paintBoard", "segment/" + (Wzhcq_key + 1), cc.SpriteFrame)
                .then(function (spriteFrame: any) {
                    Wzhcq_sprite.spriteFrame = spriteFrame;
                });

            Wzhcq_pool.put(Wzhcq_node);
        }
        return Wzhcq_pool.get();
    };

    putSegment(Wzhcq_key: any, Wzhcq_node: any) {
        let Wzhcq_pool = this.segmentPools.get(Wzhcq_key);
        if (Wzhcq_pool) {
            Wzhcq_pool.put(Wzhcq_node);
        }
    };

    clearPool(Wzhcq_key: any) {
        var Wzhcq_pool = this.segmentPools.get(Wzhcq_key);
        if (Wzhcq_pool) {
            Wzhcq_pool.clear();
            this.segmentPools.delete(Wzhcq_key);
        }
    };

    clearAllPools() {
        this.segmentPools.forEach(function (Wzhcq_pool) {
            return Wzhcq_pool.clear();
        });
        this.segmentPools.clear();
    };
}
