cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        prefabGameOverRank: cc.Prefab,
        gameOverRankNode: cc.Node,
        gameOverRankLayout: cc.Node,
        loadingLabel: cc.Node,//加载文字

        iconSpriteFrame: {
            default: [],
            type: cc.SpriteFrame
        },
    },

    onLoad() {
        this.removeChild();

        this.CC_WECHATGAME = true;
        if (this.CC_WECHATGAME) {
            window.wx.onMessage(data => {
                console.log("接收主域发来消息：", data);

                if (data.messageType == 0) {//移除排行榜
                    this.removeChild();
                }
                else if (data.messageType == 1) {//获取好友排行榜
                    this.fetchFriendData();
                }
            });
        }
    },

    removeChild() {
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();
        this.gameOverRankNode.active = false;
        this.gameOverRankLayout.removeAllChildren();
        this.loadingLabel.getComponent(cc.Label).string = "玩命加载中...";
        this.loadingLabel.active = true;
    },

    fetchFriendData() {
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (this.CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    this.loadingLabel.active = false;
                    console.log('success', userRes.data)
                    let userData = userRes.data[0];
                    //取出所有好友数据
                    wx.getFriendCloudStorage({
                        keyList: ["nuoduidui"],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return JSON.parse(b.KVDataList[0].value).score - JSON.parse(a.KVDataList[0].value).score;
                            });

                            this.scrollViewContent.removeAllChildren();
                            for (let i = 0; i < data.length; i++) {
                                let playerInfo = data[i];
                                let item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('RankItem').init(i, playerInfo);
                                this.scrollViewContent.addChild(item);

                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    let score = 0;
                                    if (playerInfo.KVDataList.length != 0) {
                                        if (JSON.parse(playerInfo.KVDataList[0].value).score == undefined) {
                                            score = 0;
                                        }
                                        else {
                                            score = JSON.parse(playerInfo.KVDataList[0].value).score;
                                        }
                                    }
                                    else {
                                        score = 0;
                                    }
                                    let level = 0;
                                    if (playerInfo.KVDataList.length != 0) {
                                        if (JSON.parse(playerInfo.KVDataList[0].value).level == undefined) {
                                            level = 0;
                                        }
                                        else {
                                            level = JSON.parse(playerInfo.KVDataList[0].value).level;
                                        }
                                    }
                                    else {
                                        level = 0;
                                    }

                                }
                            }
                            if (data.length <= 8) {
                                let layout = this.scrollViewContent.getComponent(cc.Layout);
                                layout.resizeMode = cc.Layout.ResizeMode.NONE;
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "好友排名未授权，无法查看";
                        },
                    });
                },
                fail: (res) => {
                    console.log("wx.getFriendCloudStorage2 fail", res);
                    this.loadingLabel.getComponent(cc.Label).string = "好友排名未授权，无法查看";
                }
            });
        }
    },
});
