
const { ccclass, property } = cc._decorator;

import { Utils } from "./Utils";

@ccclass
export default class SpriteLabel extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property(cc.Color)
    spriteColor: cc.Color = cc.color(255, 255, 255, 255);

    @property(cc.SpriteFrame)
    spriteFrames: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    spritePlus: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteMinus: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteTimes: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteProgress: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteDiv: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteColon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spriteInfinite: cc.SpriteFrame = null;

    @property(cc.Integer)
    layoutSpaceX = 2;

    @property(cc.Integer)
    stepTime = 0.05;

    @property(cc.Integer)
    stepRate = 0.2;

    @property(cc.Boolean)
    isNumberAdd = false;

    spriteCachesArray = [];

    _step = 0;
    _value = 0;
    _offset = 0;
    _char: any;

    start() {
        this.sprite.node.active = false;
        if (this.layoutSpaceX) {
            (this.node.getComponent(cc.Layout).spacingX = this.layoutSpaceX);
            this.isNumberAdd && this.setText("0");
        }
    }

    setText(num: any) {
        // this.node.children.forEach(function (node) {
        //     node.active = false;
        // });

        for (var i = 0; i < this.spriteCachesArray.length; i++) {
            this.spriteCachesArray[i].node.active = false;
        }
        for (var j = 0; j < num.length; j++) {

            let data;
            if (j < this.spriteCachesArray.length) {
                data = this.spriteCachesArray[j];
            }
            else {
                data = this.createSpriteNode();
            }

            data.node.active = true;
            data.node.color = this.spriteColor;
            data.spriteFrame = this.getSpriteFrame(num.charAt(j));
        }
    }

    setValue(num, str, n) {

        if (str === undefined) {
            str = "";
        }

        if (n === undefined) {
            n = true;
        }
        this._char = str;
        if (num != this._value && n) {
            this._offset = num - this._value;
            this._step = Math.abs(Math.floor(this._offset * this.stepRate));
            this._value = num;
            this.unschedule(this.updateNumber);
            this.schedule(this.updateNumber, this.stepTime);
        }
        else {
            this._value = num;
            this.setText("" + this._char + this._value);
        }
    }

    reset(value: any) {
        this._char = "";
        this._step = 0;
        this._offset = 0;
        this._value = value;
    }

    getSpriteFrame(index) {
        var t = +index;
        if (!Number.isNaN(t)) {
            return this.spriteFrames[index];
        }
        switch (index) {
            case "+":
                return this.spritePlus;
            case "-":
                return this.spriteMinus;
            case "*":
            case "x":
            case "X":
                return this.spriteTimes;
            case "/":
                return this.spriteDiv;
            case "%":
                return this.spriteProgress;
            case ":":
            case "：":
                return this.spriteColon;
            case "∞":
                return this.spriteInfinite;
        }
        return null;
    }

    createSpriteNode() {
        var node = cc.instantiate(this.sprite.node);
        node.parent = this.node;
        let _node = node.getComponent(cc.Sprite);
        this.spriteCachesArray.push(_node);
        return _node;
    }

    updateNumber(index) {
        if (0 == this._offset) {
            this.unschedule(this.updateNumber);
        }
        else {
            index = Math.floor(this._step * (1 + index));
            index = Utils.getInstance.range(Math.floor(0.8 * index), index);

            if (0 != this._offset && 0 == index) {
                index = 1;
            }

            if (0 < this._offset) {
                this._offset -= index;
                this._offset = Math.max(this._offset, 0);
            }
            else if (this._offset < 0) {
                this._offset += index;
                this._offset = Math.min(this._offset, 0);
            }

            index = this._value - this._offset;
            this.setText("" + this._char + index);
        }

    }
}
