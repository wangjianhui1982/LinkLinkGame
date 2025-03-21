import RopeSegmentManager from "./RopeSegmentManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RopeTexture extends cc.Component {

    @property({
        tooltip: "终点X坐标",
        type: cc.Float,
        displayName: "终点X"
    })
    endX = 0;

    @property({
        tooltip: "终点Y坐标",
        type: cc.Float,
        displayName: "终点Y"
    })
    endY = -300;

    @property({
        tooltip: "段落之间的重叠像素数",
        type: cc.Integer,
        min: 0,
        max: 31,
        step: 1,
        displayName: "重叠像素"
    })
    overlap = 28;

    @property({
        tooltip: "段落之间的间距偏移",
        type: cc.Integer,
        min: -5,
        max: 5,
        step: 1,
        displayName: "间距微调"
    })
    offsetY = -2;

    @property({
        tooltip: "水平摆动幅度",
        type: cc.Float,
        min: 0,
        step: 1,
        displayName: "水平幅度"
    })
    amplitude = 20;

    @property({
        tooltip: "波浪频率",
        type: cc.Float,
        min: 0.1,
        step: 0.1,
        displayName: "摆动频率"
    })
    frequency = 2;

    @property({
        tooltip: "波浪数量",
        type: cc.Float,
        min: 0.1,
        max: 10,
        step: 0.1,
        displayName: "波浪数量"
    })
    waveCount = 1;

    type = -1;
    SEGMENT_SIZE = 32;
    TWO_PI = 2 * Math.PI;
    segments = [];
    originalPositions = [];
    segmentCount = 0;
    time = 0;
    lastAngles = [];
    lastPositions = [];
    SMOOTH_SPEED = 0.3;
    isMoving = !1;
    moveStartX = 0;
    moveStartY = 0;
    moveTargetX = 0;
    moveTargetY = 0;
    moveTime = 0;
    moveElapsed = 0;

    onLoad() { };

    updateEndPoint(e: any, t: any) {
        var o = cc.v2(e, t).mag();
        var n = this.SEGMENT_SIZE - this.overlap + this.offsetY;
        var i = Math.ceil(o / n);
        var r = Math.ceil((this.amplitude / n) * 2);
        var a = Math.max(5, i + r);
        if (a !== this.segmentCount) {
            this.updateSegmentCount(a);
        }
        this.updateRopeSegments(e, t);
    };

    updateSegmentCount(count: any) {
        let max = count - this.segmentCount;
        if (max > 0) {
            for (let o = 0; o < max; o++) {
                node = RopeSegmentManager.getInstance.getSegment(this.type);
                node.parent = this.node;
                this.segments.push(node);
            }
        }
        else if (max < 0) {
            for (let o = 0; o < -max; o++) {
                var node: any;
                if ((node = this.segments.pop())) {
                    RopeSegmentManager.getInstance.putSegment(this.type, node);
                }
            }
        }
        this.segmentCount = count;
    };

    updateRopeSegments(e: any, t: any) {
        var o = this.segments.length;
        if (this.originalPositions.length !== o) {
            this.originalPositions = new Array(o);
            this.lastAngles = new Array(o);
            this.lastPositions = new Array(o);
            for (var n = 0; n < o; n++) {
                this.originalPositions[n] = cc.v2();
                this.lastPositions[n] = cc.v2();
                this.lastAngles[n] = 0;
            }
        }
        for (n = 0; n < o; n++) {
            var i = this.segments[n];
            var r = n / (o - 1);
            var a = r * e;
            var s = r * t;
            this.originalPositions[n].x = a;
            this.originalPositions[n].y = s;
            i.x = a;
            i.y = s;
            if (n < o - 1) {
                var c = (n + 1) / (o - 1);
                var l = c * e - i.x;
                var u = c * t - i.y;
                var p = (180 * Math.atan2(u, l)) / Math.PI - 90;
                this.lastAngles[n] = cc.misc.lerp(this.lastAngles[n], p, this.SMOOTH_SPEED);
                i.angle = this.lastAngles[n];
            }
            else {
                i.angle = this.lastAngles[n - 1] || 0;
            }
        }
    };

    moveToTarget(e: any, t: any, o: any) {
        this.isMoving = !0;
        this.moveStartX = this.endX;
        this.moveStartY = this.endY;
        this.moveTargetX = e;
        this.moveTargetY = t;
        this.moveTime = o;
        this.moveElapsed = 0;
    };

    update(dt: any) {
        if (this.isMoving) {
            this.moveElapsed += dt;
            if (this.moveElapsed >= this.moveTime) {
                this.endX = this.moveTargetX;
                this.endY = this.moveTargetY;
                this.isMoving = !1;
            }
            else {
                var t = this.moveElapsed / this.moveTime;
                this.endX = cc.misc.lerp(this.moveStartX, this.moveTargetX, t);
                this.endY = cc.misc.lerp(this.moveStartY, this.moveTargetY, t);
            }
            this.updateEndPoint(this.endX, this.endY);
        }
        this.time += dt;
        var o = this.segments.length;
        if (0 !== o) {
            var n = this.time * this.frequency;
            var i = this.TWO_PI * this.waveCount;

            for (var r = 0; r < o; r++) {
                var a = this.segments[r];
                if (a && a.active) {
                    var s = r / (o - 1);
                    var c = n + s * i;
                    var l = this.originalPositions[r];
                    var u = Math.sin(c) * this.amplitude * Math.sin(s * Math.PI);
                    a.x = l.x + u;
                    a.y = l.y;
                }
            }
        }
    };

    destroyByReset() {
        var self = this;
        this.segments.forEach(function (node: any) {
            if (node) {
                RopeSegmentManager.getInstance.putSegment(self.type, node);
            }
        });
        this.segments = [];
        this.node.destroy();
    };

    easeInOut(e: any) {
        if (e < 0.5) {
            return 2 * e * e;
        }
        else {
            return (4 - 2 * e) * e - 1;
        }
    };
}
