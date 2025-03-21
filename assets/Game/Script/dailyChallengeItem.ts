
const { ccclass, property } = cc._decorator;

@ccclass
export default class dailyChallengeItem extends cc.Component {

    @property(cc.Sprite)
    Wzhcq_head: cc.Sprite = null;

    @property(cc.Label)
    Wzhcq_number: cc.Label = null;

    @property(cc.Sprite)
    Wzhcq_icon_rank: cc.Sprite = null;

    @property(cc.Label)
    Wzhcq_nickName: cc.Label = null;

    @property(cc.Label)
    Wzhcq_totalThroughLevelNumber: cc.Label = null;

    @property(cc.Label)
    Wzhcq_maxThroughLevelNumber: cc.Label = null;

    @property(cc.SpriteFrame)
    Wzhcq_iconSpriteFrame: cc.SpriteFrame[] = [];

    updateCell(Wzhcq_data: any, t: any) {
        let self = this;
        let Wzhcq_rank = Wzhcq_data.playerRanking;
        let totalThroughLevelNumber = Wzhcq_data.totalThroughLevelNumber;
        let maxThroughLevelNumber = Wzhcq_data.maxThroughLevelNumber
        let Wzhcq_nickname = Wzhcq_data.playerName;
        let Wzhcq_avatar_url = Wzhcq_data.headSculptureUrl;

        Wzhcq_nickname = this.cutName(Wzhcq_nickname, 12);
        this.Wzhcq_nickName.string = Wzhcq_nickname;

        this.Wzhcq_totalThroughLevelNumber.string = totalThroughLevelNumber + "";
        this.Wzhcq_maxThroughLevelNumber.string = "Top连续通关 " + maxThroughLevelNumber + "";

        if (Wzhcq_rank <= 3) {
            this.Wzhcq_icon_rank.node.active = true;
            this.Wzhcq_icon_rank.spriteFrame = this.Wzhcq_iconSpriteFrame[Wzhcq_rank - 1];
            this.Wzhcq_number.node.active = false;
        }
        else {
            this.Wzhcq_icon_rank.node.active = false;
            this.Wzhcq_number.node.active = true;
            this.Wzhcq_number.string = 0 == Wzhcq_rank ? "100+" : Wzhcq_rank + "";
        }

        if ("" !== Wzhcq_avatar_url) {
            cc.loader.load({ url: Wzhcq_avatar_url, type: "png" }, function (Wzhcq_err: any, Wzhcq_spriteFrame: any) {
                if (cc.isValid(self.Wzhcq_head) && !Wzhcq_err) {
                    self.Wzhcq_head.spriteFrame = new cc.SpriteFrame(Wzhcq_spriteFrame);
                }
            })
        }
    }

    cutName(name: string, length: number): string {
        let len = 0;
        let s = "";
        for (let i = 0; i < name.length; i++) {
            let str = name.substr(i, 1)
            if (/[\u4e00-\u9fa5]/.test(str)) {
                len += 2
            }
            else {
                len++
            }
            if (len < length) {
                s += str
            }
            else { //s += ‘…’;
                break
            }
        }
        return s
    }
}

