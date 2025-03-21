cc.Class({
    extends: cc.Component,
    name: "RankItem",
    properties: {
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,

        icon_rank: cc.Sprite,

        iconSpriteFrame: {
            default: [],
            type: cc.SpriteFrame
        },

        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
        levelLabel: cc.Label,
    },
    start() {

    },

    init: function (rank, data) {
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;

        let score = 0;
        if (data.KVDataList.length != 0) {
            if (JSON.parse(data.KVDataList[0].value).score == undefined) {
                score = 0;
            }
            else {
                score = JSON.parse(data.KVDataList[0].value).score;
            }
        }
        else {
            score = 0;
        }
        let level = 0;
        if (data.KVDataList.length != 0) {
            if (JSON.parse(data.KVDataList[0].value).level == undefined) {
                level = 0;
            }
            else {
                level = JSON.parse(data.KVDataList[0].value).level;
            }
        }
        else {
            level = 0;
        }

        if (rank < 3) {
            this.icon_rank.node.active = true;
            this.icon_rank.spriteFrame = this.iconSpriteFrame[rank];
            this.rankLabel.node.active = false;
        }
        else {
            this.icon_rank.node.active = false;
            this.rankLabel.node.active = true;
            this.rankLabel.string = 0 == rank ? "100+" : (rank + 1) + "";
        }
        if ("" !== avatarUrl) {
            this.createImage(avatarUrl);
        }
        this.nickLabel.string = nick;
        this.topScoreLabel.string = score;
        this.levelLabel.string = "通关" + level;
    },
    createImage(avatarUrl) {
        cc.assetManager.loadRemote(avatarUrl, { ext: '.jpg' }, (err, texture) => {
            this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

});
