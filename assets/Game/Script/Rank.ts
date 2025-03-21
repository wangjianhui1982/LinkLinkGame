import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import RankItem from "./RankItem";
import touch_loading from "./touch_loading";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rank extends BaseComponent {

    @property(cc.Node)
    Wzhcq_RankContent: cc.Node = null;

    @property(cc.Node)
    Wzhcq_rank_world: cc.Node = null;

    @property(cc.Node)
    Wzhcq_rankBtn1: cc.Node = null;

    @property(cc.Node)
    Wzhcq_rankBtn2: cc.Node = null;

    @property(cc.Node)
    Wzhcq_myRank: cc.Node = null;

    @property(cc.Node)
    Wzhcq_authorBtn: cc.Node = null;

    @property(cc.Prefab)
    Wzhcq_rankItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_loadingPrefab: cc.Prefab = null;

    @property(cc.Node)
    Wzhcq_wxSubContextView: cc.Node = null;

    @property(cc.Node)
    Wzhcq_word_tips: cc.Node = null;

    Wzhcq_loadingNode: any;
    Wzhcq_listInfo: any = [];

    @property(cc.SpriteFrame)
    Wzhcq_rankBtnFrame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    Wzhcq_iconSpriteFrame: cc.SpriteFrame[] = [];

    Wzhcq_tabIndex = 0;

    Wzhcq_myRankIndex = 100;

    protected onLoad(): void {

        if (!this.Wzhcq_loadingNode) {
            this.Wzhcq_loadingNode = cc.instantiate(this.Wzhcq_loadingPrefab);
            this.Wzhcq_loadingNode.parent = this.node;
        }
        Utils.getInstance.rank_redDot = 0;
    }

    protected onEnable(): void {
        this.onOpen();
    }

    updateTitleBtn() {
        if (this.Wzhcq_tabIndex == 0) {
            this.Wzhcq_rankBtn1.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_rankBtnFrame[1];
            this.Wzhcq_rankBtn2.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_rankBtnFrame[0];

            this.Wzhcq_rankBtn1.zIndex = 100;
            this.Wzhcq_rankBtn2.zIndex = 50;
        }
        else {
            this.Wzhcq_rankBtn1.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_rankBtnFrame[0];
            this.Wzhcq_rankBtn2.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_rankBtnFrame[1];

            this.Wzhcq_rankBtn1.zIndex = 50;
            this.Wzhcq_rankBtn2.zIndex = 100;
        }
    }

    focusTab(Wzhcq_type: any) {

        this.Wzhcq_tabIndex = Wzhcq_type;

        this.updateTitleBtn();

        switch (Wzhcq_type) {
            case 0:
                this.forcusWorldRank();
                break;
            case 1:
                this.forcusFriendRank();
                break;
        }
    }

    initUserInfoButton() {
        if (typeof wx === 'undefined') {
            return;
        }
        let score = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);

        let value = {
            score: score,
            level: level
        }
        var kvDataList = new Array();
        kvDataList.push({
            key: "nuoduidui",
            value: JSON.stringify(value),
        });
        wx.setUserCloudStorage({
            KVDataList: kvDataList,
            success(res) {
                console.log("上传用户数据成功");
                console.log(res);
            },
            fail(res) {
                console.log("上传用户数据失败");
                console.log(res);
            },
        }
        );

    }

    shareBtn() {
        AudioManager.instance.playAudioBtn_Click();

        let Wzhcq_str = "麻麻多人的榜单，我>" + this.Wzhcq_myRankIndex + "<名~~~";
        if (this.Wzhcq_myRankIndex > 100) {
            Wzhcq_str = "麻麻多人的榜单，我>" + this.Wzhcq_myRankIndex + "<名~~~";
        }
        else if (this.Wzhcq_myRankIndex <= 100 && this.Wzhcq_myRankIndex > 50) {
            Wzhcq_str = "偷偷告诉你，我上榜了！！！";
        }
        else if (this.Wzhcq_myRankIndex <= 50) {
            Wzhcq_str = "全球榜" + this.Wzhcq_myRankIndex + "名，我只跟你说。";
        }

        Utils.getInstance.shareAppMessage(Wzhcq_str);
    }

    forcusFriendRank() {
        AudioManager.instance.playAudioBtn_Click();
        this.Wzhcq_myRank.active = false;

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            var self = this;
            wx.getSetting({
                success(res) {
                    console.log("openSetting:", res);

                    if (res.authSetting['scope.WxFriendInteraction'] == undefined) {
                        wx.authorize({
                            scope: 'scope.WxFriendInteraction',
                            success() {
                                wx.getUserInfo({
                                    success: (res) => {
                                        console.log('success WxFriendInteraction', res);

                                        window.wx.postMessage({
                                            messageType: 1,
                                            MAIN_MENU_NUM: "nuoduidui",
                                        });

                                        self.Wzhcq_authorBtn.active = false;
                                        Utils.getInstance.Wzhcq_setFriend_Auth(1);
                                        self.initUserInfoButton();
                                    },
                                    fail: (res) => {
                                        console.log('fail WxFriendInteraction', res)

                                        window.wx.postMessage({
                                            messageType: 1,
                                            MAIN_MENU_NUM: "nuoduidui",
                                        });

                                        self.Wzhcq_authorBtn.active = false;
                                        Utils.getInstance.Wzhcq_setFriend_Auth(1);
                                        self.initUserInfoButton();
                                    }
                                });
                            },
                            fail: (res) => {
                                console.log('WxFriendInteraction 2', res)

                                window.wx.postMessage({
                                    messageType: 1,
                                    MAIN_MENU_NUM: "nuoduidui",
                                });

                                self.Wzhcq_authorBtn.active = true;
                            }
                        })
                    }
                    else if (res.authSetting['scope.WxFriendInteraction'] == false) {
                        wx.authorize({
                            scope: 'scope.WxFriendInteraction',
                            success() {
                                wx.getUserInfo({
                                    success: (res) => {
                                        console.log('success WxFriendInteraction', res);

                                        window.wx.postMessage({
                                            messageType: 1,
                                            MAIN_MENU_NUM: "nuoduidui",
                                        });

                                    },
                                    fail: (res) => {
                                        console.log('fail WxFriendInteraction', res)

                                        window.wx.postMessage({
                                            messageType: 1,
                                            MAIN_MENU_NUM: "nuoduidui",
                                        });

                                        self.Wzhcq_authorBtn.active = true;
                                    }
                                });

                            },
                            fail: (res) => {
                                console.log('WxFriendInteraction 2', res)

                                window.wx.postMessage({
                                    messageType: 1,
                                    MAIN_MENU_NUM: "nuoduidui",
                                });

                                self.Wzhcq_authorBtn.active = true;
                            }
                        })
                    }
                    else if (res.authSetting['scope.WxFriendInteraction'] == true) {
                        wx.authorize({
                            scope: 'scope.WxFriendInteraction',
                            success() {
                                wx.getUserInfo({
                                    success: (res) => {
                                        console.log('success WxFriendInteraction', res);

                                        window.wx.postMessage({
                                            messageType: 1,
                                            MAIN_MENU_NUM: "nuoduidui",
                                        });

                                        self.Wzhcq_authorBtn.active = false;
                                        Utils.getInstance.Wzhcq_setFriend_Auth(1);
                                        self.initUserInfoButton();
                                    },
                                    fail: (res) => {
                                        console.log('fail WxFriendInteraction', res)

                                        window.wx.postMessage({
                                            messageType: 1,
                                            MAIN_MENU_NUM: "nuoduidui",
                                        });

                                        self.Wzhcq_authorBtn.active = false;
                                        Utils.getInstance.Wzhcq_setFriend_Auth(1);
                                        self.initUserInfoButton();
                                    }
                                });

                            },
                            fail: (res) => {
                                console.log('WxFriendInteraction 2', res)

                                window.wx.postMessage({
                                    messageType: 1,
                                    MAIN_MENU_NUM: "nuoduidui",
                                });

                                self.Wzhcq_authorBtn.active = true;
                            }
                        })
                    }
                }
            });
        }

        this.Wzhcq_tabIndex = 1;
        this.updateTitleBtn();

        this.Wzhcq_rank_world.active = false;

        this.initUserInfoButton();
        this.Wzhcq_wxSubContextView.active = true;

    }

    forcusWorldRank() {
        AudioManager.instance.playAudioBtn_Click();
        this.Wzhcq_myRank.active = true;

        this.Wzhcq_authorBtn.active = false;
        this.Wzhcq_tabIndex = 0;
        this.updateTitleBtn();

        this.Wzhcq_rank_world.active = true;
        this.Wzhcq_wxSubContextView.active = false;
    }

    authorClick() {
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            wx.openSetting({
                success(res) {
                    console.log("openSetting:", res)
                    if (res.authSetting['scope.WxFriendInteraction']) {
                        console.log("发送消息给子欲22222");

                        window.wx.postMessage({
                            messageType: 1,
                            MAIN_MENU_NUM: "nuoduidui",
                        });

                        self.Wzhcq_authorBtn.active = false;
                        Utils.getInstance.Wzhcq_setFriend_Auth(1);
                    }
                    else if (res.authSetting['scope.WxFriendInteraction'] == undefined) {
                        console.log("发送消息给子欲3333333");

                        window.wx.postMessage({
                            messageType: 1,
                            MAIN_MENU_NUM: "nuoduidui",
                        });

                    }
                    else if (res.authSetting['scope.WxFriendInteraction'] == false) {
                        console.log('success', res.data);
                        console.log("发送消息给子欲3333333");

                        window.wx.postMessage({
                            messageType: 1,
                            MAIN_MENU_NUM: "nuoduidui",
                        });

                    }
                }
            });
        }

    }

    onOpen() {
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_REDDOT, undefined);
        Utils.getInstance.rank_redDot = 0;

        Utils.getInstance.hideUserInfoButton();
        this.Wzhcq_word_tips.active = false;

        if (this.Wzhcq_loadingNode) {
            this.Wzhcq_loadingNode.getComponent(touch_loading).showLoading(true, 0);
        }
        Utils.getInstance.pointsRanking((res: any) => {
            if (this.Wzhcq_loadingNode) {
                this.Wzhcq_loadingNode.getComponent(touch_loading).showLoading(false, 1);
            }
            this.Wzhcq_word_tips.active = false;

            this.Wzhcq_listInfo = res;
            if (res != null) {
                this.updateItem();
            }
            if (Utils.getInstance.openid != null && Utils.getInstance.username != null && Utils.getInstance.headurl != null) {
                this.setInfo(this.Wzhcq_myRank, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].playerRanking, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].points, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].throughLevelNumber, 1);
            }
            else {
                this.setInfo(this.Wzhcq_myRank, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].playerRanking, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].points, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].throughLevelNumber, 0);
            }
        },
            () => {
                if (this.Wzhcq_RankContent.children.length == 0) {
                    this.Wzhcq_word_tips.active = true;
                }
                else {
                    this.Wzhcq_word_tips.active = false;
                }
                if (this.Wzhcq_loadingNode) {
                    this.Wzhcq_loadingNode.getComponent(touch_loading).showLoading(false, 1);
                }
            });

        this.focusTab(0);
    }

    updateItem() {
        this.Wzhcq_RankContent.removeAllChildren();
        let Wzhcq_len = 100;
        if (Utils.getInstance.openid != null && Utils.getInstance.username != null && Utils.getInstance.headurl != null) {
            Wzhcq_len = this.Wzhcq_listInfo.length - 1;
        }
        else {
            Wzhcq_len = this.Wzhcq_listInfo.length;
        }

        let count = Wzhcq_len < 100 ? Wzhcq_len : 100;
        for (let i = 0; i < count; i++) {
            let Wzhcq_rankItem = cc.instantiate(this.Wzhcq_rankItemPrefab);
            this.Wzhcq_RankContent.addChild(Wzhcq_rankItem);
            Wzhcq_rankItem.getComponent(RankItem).updateCell(this.Wzhcq_listInfo[i], undefined);
        }
    }

    setInfo(Wzhcq_node: any, Wzhcq_rank: any, Wzhcq_lv: any, Wzhcq_level: any, Wzhcq_type: any) {
        //name="水电费水电费水电费神鼎飞丹砂";
        // if(name&&name.length&&name.length>6){
        //     name=name.substring(0,6);
        // }
        Wzhcq_node.active = true;
        // name = this.cutName(name, 12);

        if (Wzhcq_type) {
            if (Wzhcq_rank <= 3) {
                Wzhcq_node.getChildByName("icon_rank1").active = true;
                Wzhcq_node.getChildByName("icon_rank1").getComponent(cc.Sprite).spriteFrame = this.Wzhcq_iconSpriteFrame[Wzhcq_rank - 1];
                Wzhcq_node.getChildByName("rank").active = false;
            }
            else {
                Wzhcq_node.getChildByName("icon_rank1").active = false;
                Wzhcq_node.getChildByName("rank").active = true;
                Wzhcq_node.getChildByName("rank").getComponent(cc.Label).string = (Wzhcq_rank > 1000 ? "未上榜" : Wzhcq_rank) + "";
            }

            this.Wzhcq_myRankIndex = Wzhcq_rank;

            Wzhcq_node.getChildByName("score").getComponent(cc.Label).string = Wzhcq_lv;
            Wzhcq_node.getChildByName("level").getComponent(cc.Label).string = "通关" + Wzhcq_level;
        }
        else {
            Wzhcq_node.getChildByName("icon_rank1").active = false;
            Wzhcq_node.getChildByName("rank").active = true;
            Wzhcq_node.getChildByName("rank").getComponent(cc.Label).string = "未授权";

            Wzhcq_node.getChildByName("score").getComponent(cc.Label).string = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
            Wzhcq_node.getChildByName("level").getComponent(cc.Label).string = "通关" + Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);

            this.Wzhcq_myRankIndex = 101;
        }
        // cc.assetManager.loadRemote<cc.Texture2D>(url, { ext: '.png' }, (err, texture) => {
        //     if (err) {
        //         console.log("加载图片信息失败");
        //         //Start.instance.Tipmsg("加载底图失败...");
        //         return;
        //     }
        //     console.log("加载图片信息成功");
        //     node.getChildByName("head").getChildByName("image").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        // });
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
            } else { //s += ‘…’;
                break
            }
        }
        return s
    }

    close() {
        if (Utils.getInstance.openid == null || Utils.getInstance.username == null || Utils.getInstance.headurl == null) {
            Utils.getInstance.showUserInfoButton();
        }
        else {
            Utils.getInstance.hideUserInfoButton();
        }
        this.node.active = false;
    }
}
