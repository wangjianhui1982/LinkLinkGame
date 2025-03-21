cc.Class({
    extends: cc.Component,
    name: "GameOverRank",
    properties: {
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
    },
    start() {

    },

    init: function (rank, data, isPlayer) {
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        this.rankLabel.string = (rank + 1) + "";
        if ("" !== avatarUrl) {
            this.createImage(avatarUrl);
        }
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade;
    },
    createImage(avatarUrl) {
        cc.assetManager.loadRemote(avatarUrl, { ext: '.jpg' }, (err, texture) => {
            this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

});
