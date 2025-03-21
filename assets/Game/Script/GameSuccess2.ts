import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

//因为子域跟主域代码不能互相引用，因此定义一个表，分别复制到两边当成一个来使用。
let Consts = {
    OpenDataKeys: {
        LevelKey: "nuoduidui",
    },
    DomainAction: {
        NuoDuiDui_ShowFriend: "NuoDuiDui_ShowFriendRank", //展示好友排行榜
    },
}

@ccclass
export default class GameSuccess2 extends BaseComponent {

    @property(cc.Label)
    protected Wzhcq_Integral: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_Integral2: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_Time: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_Time2: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_Eliminate: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_Eliminate2: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_score: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_score2: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_count: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_count2: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_leijitongguan: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_leijitongguan2: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_lianxvtongguan: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_lianxvtongguan2: cc.Label = null;

    @property(cc.Sprite)
    protected Wzhcq_biaodianArray: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    protected Wzhcq_biaodianFrame: cc.SpriteFrame[] = [];

    @property(cc.Node)
    protected Wzhcq_backMainNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newTarget0: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newTarget1: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newTarget2: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newTarget3: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newTarget4: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_againNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_tips: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_previousNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_nextNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newUI1: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_newUI2: cc.Node = null;

    @property(cc.Node)
    protected jifenNode: cc.Node = null;

    @property(cc.Node)
    protected lianshengNode: cc.Node = null;

    @property(cc.Node)
    protected leijitongguanNode: cc.Node = null;

    @property(cc.Node)
    protected lianxvtonggguanNode: cc.Node = null;

    @property(cc.PageView)
    protected pageList: cc.PageView = null;

    @property(cc.Label)
    segmentLabel: cc.Label = null;

    @property(cc.Node)
    Wzhcq_anim_popglow: cc.Node = null;

    Wzhcq_rankIndex = 0;
    Wzhcq_isclick = true;
    Wzhcq_propNum = 1;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        cc.tween(this.Wzhcq_anim_popglow).repeatForever(
            cc.tween().by(3, { angle: -180 })
                .by(6, { angle: -360 })

        ).start();

        let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);
        if (level <= Utils.getInstance.MaxLv) {
            let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.segmentCount, segmentCount + Utils.getInstance.segmentCount / 2);
        }
        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        this.segmentLabel.string = Utils.getInstance.segmentCount / 2 + "";

        this.initData();

        if (Utils.getInstance.GameType == 2) {
            Utils.getInstance.continuousJianDan += 1;
        }
        else if (Utils.getInstance.GameType == 3) {
            Utils.getInstance.continuousKunNan += 1;
        }

        this.Wzhcq_rankIndex = 0;
        this.updateData();

        let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
        this.Wzhcq_newTarget0.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
        this.Wzhcq_newTarget0.getComponent(cc.Button).interactable = true;

        this.Wzhcq_score.string = Utils.getInstance.highestIntegral + "";
        this.Wzhcq_Time.string = Utils.getInstance.shortestTime + "";
        this.Wzhcq_Eliminate.string = Utils.getInstance.maximumEliminate + "";
        this.Wzhcq_Integral.string = Utils.getInstance.highestScore + "";
        this.Wzhcq_count.string = Utils.getInstance.winningStreak + "";

        //每日挑战
        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_newUI2.active = false;
            this.Wzhcq_previousNode.active = false;
            this.Wzhcq_nextNode.active = false;
            this.pageList.enabled = false;
            this.Wzhcq_biaodianArray[0].node.active = false;
            this.Wzhcq_biaodianArray[1].node.active = false;

            this.jifenNode.active = false;
            this.lianshengNode.active = false;
            this.leijitongguanNode.active = true;
            this.lianxvtonggguanNode.active = true;

            let Wzhcq_highestIntegral = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestIntegral);
            let Wzhcq_shortestTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_shortestTime);
            let Wzhcq_maximumEliminate = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_maximumEliminate);
            let Wzhcq_highestScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestScore);
            let Wzhcq_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);

            this.Wzhcq_score2.string = Wzhcq_highestIntegral + "";
            this.Wzhcq_Time2.string = Wzhcq_shortestTime + "秒";
            this.Wzhcq_Eliminate2.string = Wzhcq_maximumEliminate + "次";
            this.Wzhcq_Integral2.string = Wzhcq_highestScore + "";
            this.Wzhcq_count2.string = Wzhcq_highestwinningStreak + "";

            this.Wzhcq_leijitongguan.string = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
            this.Wzhcq_leijitongguan2.string = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
            this.Wzhcq_lianxvtongguan.string = Utils.getInstance.winningStreak + "";
            this.Wzhcq_lianxvtongguan2.string = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);

            if (Utils.getInstance.highestIntegral > Wzhcq_highestIntegral) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestIntegral, Utils.getInstance.highestIntegral);
            }

            if (Utils.getInstance.shortestTime < Wzhcq_shortestTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_shortestTime, Utils.getInstance.shortestTime);
                this.Wzhcq_newTarget4.active = true;
            }
            else {
                this.Wzhcq_newTarget4.active = false;
            }

            if (Wzhcq_shortestTime == 0) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_shortestTime, Utils.getInstance.shortestTime);
                this.Wzhcq_newTarget1.active = true;
            }

            if (Utils.getInstance.maximumEliminate > Wzhcq_maximumEliminate) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_maximumEliminate, Utils.getInstance.maximumEliminate);
                this.Wzhcq_newTarget2.active = true;
            }
            else {
                this.Wzhcq_newTarget2.active = false;
            }

            if (Utils.getInstance.highestScore > Wzhcq_highestScore) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestScore, Utils.getInstance.highestScore);
                this.Wzhcq_newTarget3.active = true;
            }
            else {
                this.Wzhcq_newTarget3.active = false;
            }

            if (Utils.getInstance.winningStreak > Wzhcq_highestwinningStreak) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak, Utils.getInstance.winningStreak);
                this.Wzhcq_newTarget1.active = true;
            }
            else {
                this.Wzhcq_newTarget1.active = false;
            }
        }
        else {
            //闯关模式
            this.jifenNode.active = true;
            this.lianshengNode.active = true;
            this.leijitongguanNode.active = false;
            this.lianxvtonggguanNode.active = false;

            let Wzhcq_highestIntegral = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestIntegral);
            let Wzhcq_shortestTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_shortestTime);
            let Wzhcq_maximumEliminate = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_maximumEliminate);
            let Wzhcq_highestScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestScore);
            let Wzhcq_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestwinningStreak);

            this.Wzhcq_score2.string = Wzhcq_highestIntegral + "";
            this.Wzhcq_Time2.string = Wzhcq_shortestTime + "秒";
            this.Wzhcq_Eliminate2.string = Wzhcq_maximumEliminate + "次";
            this.Wzhcq_Integral2.string = Wzhcq_highestScore + "";
            this.Wzhcq_count2.string = Wzhcq_highestwinningStreak + "";

            if (Utils.getInstance.highestIntegral > Wzhcq_highestIntegral) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestIntegral, Utils.getInstance.highestIntegral);
            }

            if (Utils.getInstance.shortestTime < Wzhcq_shortestTime) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_shortestTime, Utils.getInstance.shortestTime);
                this.Wzhcq_newTarget4.active = true;
            }
            else {
                this.Wzhcq_newTarget4.active = false;
            }

            if (Wzhcq_shortestTime == 0) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_shortestTime, Utils.getInstance.shortestTime);
                this.Wzhcq_newTarget1.active = true;
            }

            if (Utils.getInstance.maximumEliminate > Wzhcq_maximumEliminate) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_maximumEliminate, Utils.getInstance.maximumEliminate);
                this.Wzhcq_newTarget2.active = true;
            }
            else {
                this.Wzhcq_newTarget2.active = false;
            }

            if (Utils.getInstance.highestScore > Wzhcq_highestScore) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestScore, Utils.getInstance.highestScore);
                this.Wzhcq_newTarget3.active = true;
            }
            else {
                this.Wzhcq_newTarget3.active = false;
            }

            if (Utils.getInstance.winningStreak > Wzhcq_highestwinningStreak) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestwinningStreak, Utils.getInstance.winningStreak);
                this.Wzhcq_newTarget1.active = true;
            }
            else {
                this.Wzhcq_newTarget1.active = false;
            }
        }
    }

    previous_showUI() {
        this.Wzhcq_rankIndex = 0;
        this.updateData();
    }

    next_showUI() {
        this.Wzhcq_rankIndex = 1;
        this.updateData();
    }

    updateData() {
        if (this.Wzhcq_rankIndex == 0) {
            this.Wzhcq_previousNode.active = false;
            this.Wzhcq_nextNode.active = true;

            this.Wzhcq_biaodianArray[0].spriteFrame = this.Wzhcq_biaodianFrame[0];
            this.Wzhcq_biaodianArray[1].spriteFrame = this.Wzhcq_biaodianFrame[1];

            this.pageList.scrollToPage(0, 1);
        }
        else if (this.Wzhcq_rankIndex == 1) {
            this.Wzhcq_previousNode.active = true;
            this.Wzhcq_nextNode.active = false;

            this.Wzhcq_biaodianArray[0].spriteFrame = this.Wzhcq_biaodianFrame[1];
            this.Wzhcq_biaodianArray[1].spriteFrame = this.Wzhcq_biaodianFrame[0];

            this.pageList.scrollToPage(1, 1);

        }
    }

    huadongPage(event: any) {
        if (event._curPageIdx == 0) {
            this.Wzhcq_previousNode.active = false;
            this.Wzhcq_nextNode.active = true;

            this.Wzhcq_biaodianArray[0].spriteFrame = this.Wzhcq_biaodianFrame[0];
            this.Wzhcq_biaodianArray[1].spriteFrame = this.Wzhcq_biaodianFrame[1];

        }
        else if (event._curPageIdx == 1) {
            this.Wzhcq_previousNode.active = true;
            this.Wzhcq_nextNode.active = false;

            this.Wzhcq_biaodianArray[0].spriteFrame = this.Wzhcq_biaodianFrame[1];
            this.Wzhcq_biaodianArray[1].spriteFrame = this.Wzhcq_biaodianFrame[0];
        }
    }

    initData() {
        WxPlatform.getInstance.showBanner();

        let Wzhcq_jiandanCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_JianDanCount);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_JianDanCount, Wzhcq_jiandanCount + 1);

        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK, this.update_mask, this);

        this.Wzhcq_againNode.active = true;

        cc.tween(this.Wzhcq_againNode)
            .repeatForever(
                cc.tween()
                    .to(0.5, { scale: 1.1 })
                    .to(0.5, { scale: 1 })
            )
            .start();

        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_againNode.active = false;
            this.Wzhcq_backMainNode.active = true;
        }
        else {
            this.Wzhcq_againNode.active = true;
            this.Wzhcq_backMainNode.active = false;

            Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
            let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
            if (level > Utils.getInstance.MaxLevel) {
                level = Utils.getInstance.getLevelRange(level);
            }
            Utils.getInstance.GameType = Utils.getInstance.levelData[level].type;
        }

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REPORT_RESULT, 1);

        let Wzhcq_curRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);

        this.Wzhcq_score.string = Math.floor(Wzhcq_curRankScore) + "";

        let Wzhcq_Rankinfo = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Rankinfo);
        console.log("Rankinfo:", Wzhcq_Rankinfo);

        if (Wzhcq_Rankinfo < 1 && Utils.getInstance.GameType != 1) {
            Utils.getInstance.dailyChallengeSaveData((res: any) => {
                console.log("dailyChallengeSaveData:", res);

                let Wzhcq_getCurTime = Utils.getInstance.getCurTime();
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RankinfoDay, Wzhcq_getCurTime);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Rankinfo, 1);
            });

            Utils.getInstance.playerData((res: any) => {
                console.log("playerData:", res);

                let Wzhcq_getCurTime = Utils.getInstance.getCurTime();
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RankinfoDay, Wzhcq_getCurTime);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Rankinfo, 1);
            });

            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                var self = this;
                wx.getSetting({
                    success(res) {
                        console.log("openSetting:", res);

                        if (res.authSetting['scope.WxFriendInteraction'] == true) {
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

                                            self.initUserInfoButton();
                                        },
                                        fail: (res) => {
                                            console.log('fail WxFriendInteraction', res)

                                            window.wx.postMessage({
                                                messageType: 1,
                                                MAIN_MENU_NUM: "nuoduidui",
                                            });

                                            self.initUserInfoButton();
                                        }
                                    });

                                },
                                fail: (res) => {
                                    console.log('WxFriendInteraction 2', res)
                                }
                            })
                        }
                    }
                });
            }

            this.initUserInfoButton();
        }

        Utils.getInstance.sjd_clear_stage(true);

        if (Utils.getInstance.GameType == 6) {
            let mrtzClearanceNum = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_mrtzClearanceNum);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_mrtzClearanceNum, mrtzClearanceNum + 1);

            let continuousNum = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_continuousNum);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_continuousNum, continuousNum + 1);

            let mrtzMaxClearanceNum = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_mrtzMaxClearanceNum);
            if (continuousNum + 1 > mrtzMaxClearanceNum) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_mrtzMaxClearanceNum, continuousNum + 1);
            }
        }
        else {
            let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Level, level + 1);
        }
    }

    update_mask() {

    }

    Wzhcq_clickAgain_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        let boardIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);//this.levelEditBox.string;
        if (boardIndex <= Utils.getInstance.MaxLv) {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, undefined);
        }
        else {
            let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
            if (Wzhcq_life > 0) {
                Utils.getInstance.Wzhcq_setFriend_Auth(0);

                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life - 1);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

                let Wzhcq_useEnergy = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_UseEnergy);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, Wzhcq_useEnergy + 1);

                Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
                if (level > Utils.getInstance.MaxLevel) {
                    level = Utils.getInstance.getLevelRange(level);
                }
                Utils.getInstance.GameType = Utils.getInstance.levelData[level].type;

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_RESTARTGAME, 0);
            }
            else {
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_ENERGY, undefined);
            }
        }

        this.Wzhcq_close();

    }

    Wzhcq_clickReward_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        if (Utils.getInstance.GameType == 1) {
            let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
            let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + this.Wzhcq_propNum);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + this.Wzhcq_propNum);

            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + this.Wzhcq_propNum, 0.3, 100);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + this.Wzhcq_propNum, 0.8, 99);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK);
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
            this.Wzhcq_close();
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, undefined);
            AudioManager.instance.playAudioReward();
        }
        else {
            let avtype = 3;
            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                if (data == 1) {
                    //激励视频完整播放 需要做的奖励；
                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                    Utils.getInstance.sjd_close_rewardav(avtype, true);

                    let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
                    let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips + this.Wzhcq_propNum);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles + this.Wzhcq_propNum);

                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得提示道具x" + this.Wzhcq_propNum, 0.3, 100);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "获得洗牌道具x" + this.Wzhcq_propNum, 0.8, 99);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROPMASK);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, undefined);
                    this.Wzhcq_isclick = true;
                    this.Wzhcq_close();
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, undefined);
                    AudioManager.instance.playAudioReward();

                    if (Utils.getInstance.GameType == 3) {
                        Utils.getInstance.isEnergyLookVideo = 1;
                    }
                }
                else if (data == 2) {

                    wx.showToast({
                        title: '暂时没有广告了,请稍后再试',
                        icon: 'none'
                    })
                    this.Wzhcq_isclick = true;
                }
                else if (data == 0) {

                    if (Utils.getInstance.JianDanTips && Utils.getInstance.GameType == 2) {
                    }

                    wx.showToast({
                        title: '播放中途退出',
                        icon: 'none'
                    })
                    this.Wzhcq_isclick = true;

                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                }
            })
        }
    }


    rank_btn() {
        AudioManager.instance.playAudioBtn_Click();
    }

    Wzhcq_clickDoubleVideo() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isclick) {
            this.Wzhcq_isclick = false;
        }

        let avtype = 13;
        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
            if (data == 1) {
                //激励视频完整播放 需要做的奖励；
                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                Utils.getInstance.sjd_close_rewardav(avtype, true);

                cc.tween(this.Wzhcq_Integral.node)
                    .to(0.3, { scale: 1.5 })
                    .call(() => {
                        let Wzhcq_score = Utils.getInstance.highestScore * 2;
                        this.Wzhcq_Integral.string = Wzhcq_score + "";
                    })
                    .delay(0.3)
                    .to(0.3, { scale: 1 })
                    .start();

                let Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
                Wzhcq_allScore += Utils.getInstance.highestScore;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, Wzhcq_allScore);

                let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
                this.Wzhcq_newTarget0.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
                this.Wzhcq_newTarget0.getComponent(cc.Button).interactable = false;

                this.Wzhcq_isclick = true;
            }
            else if (data == 2) {

                wx.showToast({
                    title: '暂时没有广告了,请稍后再试',
                    icon: 'none'
                })

                this.Wzhcq_isclick = true;
            }
            else if (data == 0) {

                wx.showToast({
                    title: '播放中途退出',
                    icon: 'none'
                })

                this.Wzhcq_isclick = true;

                Utils.getInstance.sjd_close_rewardav(avtype, false);
            }
        })
    }

    Wzhcq_clickBackMain_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        Utils.getInstance.Wzhcq_setFriend_Auth(0);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

        if (Utils.getInstance.GameType == 6) {
            let Wzhcq_getCurTime = Utils.getInstance.getCurTime();
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhanSuccessDay, Wzhcq_getCurTime);
        }

        cc.director.loadScene('Start');

        this.Wzhcq_close();

    }

    Wzhcq_close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

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
}
