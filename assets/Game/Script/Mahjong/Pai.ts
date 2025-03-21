
const { ccclass, property } = cc._decorator;

let FRAMME_NAMES = {
    0: 'tong',
    1: 'wan',
    2: 'tiao',
    3: 'zhong',
    4: 'fa',
    5: 'bai',
    6: 'dong',
    7: 'nan',
    8: 'xi',
    9: 'bei',
    10: 'chun',
    11: 'xia',
    12: 'qiu',
    13: 'dong2',
    14: 'jv',
    15: 'lan',
    16: 'mei',
    17: 'zhu',
};

export enum SUIT {
    TONG = 0,
    WAN = 1,
    TIAO = 2,
    ZHONG = 3,
    FA = 4,
    BAI = 5,
    Dong = 6,
    Nan = 7,
    Xi = 8,
    Bei = 9,
    Chun = 10,
    Xia = 11,
    Qiu = 12,
    Dong2 = 13,
    Jv = 14,
    Lan = 15,
    Mei = 16,
    Zhu = 17,
}

@ccclass
export default class Pai extends cc.Component {

    @property(cc.SpriteAtlas)
    protected mahjongAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    protected MahjongSprite: cc.Sprite = null;

    @property(cc.Node)
    protected TipNode: cc.Node = null;

    public Suit: number;

    public Num: number;

    start() {

    }

    public setData(Wzhcq_data: any, Wzhcq_opacity: any) {
        this.Suit = Wzhcq_data.Suit;
        this.Num = Wzhcq_data.Num;

        let Wzhcq_isFeng: boolean = this.GetIsFeng();
        let Wzhcq_isFeng2: boolean = this.GetIsFeng2();
        let Wzhcq_frame: any;

        // if (Wzhcq_isFeng2) {
        //     let Wzhcq_path: string = Wzhcq_isFeng ? Wzhcq_data.Num + FRAMME_NAMES[Wzhcq_data.Suit] : FRAMME_NAMES[Wzhcq_data.Suit];
        //     Wzhcq_frame = this.mahjongAtlas.getSpriteFrame(Wzhcq_path);
        // }
        // else {
        //     let Wzhcq_path = FRAMME_NAMES[Wzhcq_data.Suit];
        //     Wzhcq_frame = this.mahjongAtlas.getSpriteFrame(Wzhcq_path);
        // }

        let path = Wzhcq_data.Id + "";
        Wzhcq_frame = this.mahjongAtlas.getSpriteFrame(path);
        this.MahjongSprite.spriteFrame = Wzhcq_frame;

        this.node.opacity = Wzhcq_opacity;
    }

    public SetTipNodeVisible(Wzhcq_visible: any): void {
        this.TipNode.active = Wzhcq_visible;
    }

    public GetIsFeng(): boolean {
        return this.Suit != SUIT.BAI && this.Suit != SUIT.ZHONG && this.Suit != SUIT.FA;
    }

    public GetIsFeng2(): boolean {
        return this.Suit != SUIT.Dong && this.Suit != SUIT.Nan && this.Suit != SUIT.Xi && this.Suit != SUIT.Bei
            && this.Suit != SUIT.Chun && this.Suit != SUIT.Xia && this.Suit != SUIT.Qiu && this.Suit != SUIT.Dong2
            && this.Suit != SUIT.Jv && this.Suit != SUIT.Lan && this.Suit != SUIT.Mei && this.Suit != SUIT.Zhu;
    }
}
