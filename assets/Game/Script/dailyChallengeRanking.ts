import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import dailyChallengeItem from "./dailyChallengeItem";
import { Wzhcq_StorageName } from "./Enum";
import RankItem from "./RankItem";
import touch_loading from "./touch_loading";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class dailyChallengeRanking extends BaseComponent {

    @property(cc.Node)
    Wzhcq_RankContent: cc.Node = null;

    @property(cc.Node)
    Wzhcq_myRank: cc.Node = null;

    @property(cc.Prefab)
    Wzhcq_rankItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_loadingPrefab: cc.Prefab = null;

    @property(cc.Node)
    Wzhcq_word_tips: cc.Node = null;

    Wzhcq_loadingNode: any;
    Wzhcq_listInfo: any = [];

    @property(cc.SpriteFrame)
    Wzhcq_iconSpriteFrame: cc.SpriteFrame[] = [];

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

    forcusWorldRank() {
        AudioManager.instance.playAudioBtn_Click();
        this.Wzhcq_myRank.active = true;
    }

    onOpen() {
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_REDDOT, undefined);
        Utils.getInstance.rank_redDot = 0;

        Utils.getInstance.hideUserInfoButton();
        this.Wzhcq_word_tips.active = false;

        if (this.Wzhcq_loadingNode) {
            this.Wzhcq_loadingNode.getComponent(touch_loading).showLoading(true, 0);
        }

        console.log("Wzhcq_createUserInfoButton openid10:", Utils.getInstance.openid);
        Utils.getInstance.dailyChallengeRanking((res: any) => {
            if (this.Wzhcq_loadingNode) {
                this.Wzhcq_loadingNode.getComponent(touch_loading).showLoading(false, 1);
            }
            this.Wzhcq_word_tips.active = false;

            this.Wzhcq_listInfo = res;
            if (res != null) {
                this.updateItem();
            }
            if (Utils.getInstance.openid != null && Utils.getInstance.username != null && Utils.getInstance.headurl != null) {
                this.setInfo(this.Wzhcq_myRank, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].playerRanking, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].totalThroughLevelNumber, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].maxThroughLevelNumber, 1);
            }
            else {
                this.setInfo(this.Wzhcq_myRank, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].playerRanking, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].totalThroughLevelNumber, this.Wzhcq_listInfo[this.Wzhcq_listInfo.length - 1].maxThroughLevelNumber, 0);
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

        this.forcusWorldRank();
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
            Wzhcq_rankItem.getComponent(dailyChallengeItem).updateCell(this.Wzhcq_listInfo[i], undefined);
        }
    }

    setInfo(Wzhcq_node: any, Wzhcq_rank: any, totalThroughLevelNumber: any, maxThroughLevelNumber: any, Wzhcq_type: any) {
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

            Wzhcq_node.getChildByName("totalThroughLevelNumber").getComponent(cc.Label).string = totalThroughLevelNumber;
            Wzhcq_node.getChildByName("maxThroughLevelNumber").getComponent(cc.Label).string = "Top连续通关 " + maxThroughLevelNumber;
        }
        else {
            Wzhcq_node.getChildByName("icon_rank1").active = false;
            Wzhcq_node.getChildByName("rank").active = true;
            Wzhcq_node.getChildByName("rank").getComponent(cc.Label).string = "未授权";

            Wzhcq_node.getChildByName("totalThroughLevelNumber").getComponent(cc.Label).string = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
            Wzhcq_node.getChildByName("maxThroughLevelNumber").getComponent(cc.Label).string = "Top连续通关 " + Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);

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
        this.node.active = false;
    }
}
