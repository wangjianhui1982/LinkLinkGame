/*
 * @Author: PanYu gordon_pp@163.com
 * @Date: 2023-07-15 06:13:10
 * @LastEditors: PanYu gordon_pp@163.com
 * @LastEditTime: 2023-07-27 19:09:48
 * @FilePath: /Nuduidui/assets/Game/Script/Game.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { forEach } from '../../../build/wechatgame/SubGame2/assets/internal/import/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.7871f';
import { Point } from './AStar';
import AudioManager from './AudioManager';
import DoubleFitScore from './DoubleFitScore';
import DoubleFitScore2 from './DoubleFitScore2';
import Energy from './Energy';
import { Wzhcq_StorageName } from './Enum';
import { RemoveData } from './EventMgr';
import GuidanceMask from './GuidanceMask';
import Grid from './Mahjong/Grid';
import MahjongManager from './Mahjong/MahjongManager ';
import MahjongManager2 from './Mahjong/MahjongManager2';
import MahjongTile from './Mahjong/MahjongTile';
import MahjongTileData, { MahjongPos } from './Mahjong/MahjongTileData';
import Pai from './Mahjong/Pai';
import Recommend from './Recommend';
import ShuffleCards from './ShuffleCards';
import Tips from './Tips';
import { WxPlatform } from './WxPlatform';
import { Utils } from './Utils';
import BaseComponent from './BaseComponent';
import pathAStar from './pathAStar';
import MapCell from './MapCell';
import ShuffleMask from './ShuffleMask';
import conSteriliPlus from './conSteriliPlus';

const { ccclass, property } = cc._decorator;

export enum ECellType {
    NOMAL,
    START,
    END,
    PATH,
    OBSTACLES,
}

export enum DIR {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export interface GridInfo {
    key: string;
    grid: cc.Node;
    inRect: boolean;
}

export interface MahjongNode {
    node: cc.Node;
    mahjongTile: MahjongTile;
}

let cfg = [
    { Row: 8, Col: 6, minimumPairsToPreserve: 2, scale: 1.3125 },
    { Row: 10, Col: 8, minimumPairsToPreserve: 5, scale: 1.125 },
    { Row: 12, Col: 10, minimumPairsToPreserve: 10, scale: 1 },
];

let cfgRankScore = {
    1: {
        0: {
            progress: 0.2,
            score: 20000,
            target: 2,
        },
        1: {
            progress: 0.4,
            score: 50000,
            target: 5,
        },
        2: {
            progress: 0.6,
            score: 100000,
            target: 10,
        },
        3: {
            progress: 0.8,
            score: 200000,
            target: 20,
        },
        4: {
            progress: 1,
            score: 400000,
            target: 40,
        },
    },
    2: {
        0: {
            progress: 0.2,
            score: 500000,
            target: 50,
        },
        1: {
            progress: 0.4,
            score: 600000,
            target: 60,
        },
        2: {
            progress: 0.6,
            score: 700000,
            target: 70,
        },
        3: {
            progress: 0.8,
            score: 800000,
            target: 80,
        },
        4: {
            progress: 1,
            score: 1000000,
            target: 100,
        },
    },
    3: {
        0: {
            progress: 0.2,
            score: 1200000,
            target: 120,
        },
        1: {
            progress: 0.4,
            score: 1400000,
            target: 140,
        },
        2: {
            progress: 0.6,
            score: 1600000,
            target: 160,
        },
        3: {
            progress: 0.8,
            score: 2000000,
            target: 200,
        },
        4: {
            progress: 1,
            score: 2500000,
            target: 250,
        },
    },
};

let cfgScore = {
    1: {
        1: 50,
        2: 100,
        3: 500,
        4: 1000,
        5: 1500,
    },
    2: {
        1: 50,
        2: 100,
        3: 500,
        4: 1000,
        5: 1500,
    },
    3: {
        1: 100,
        2: 200,
        3: 1000,
        4: 2000,
        5: 3000,
    },
    4: {
        1: 200,
        2: 300,
        3: 1500,
        4: 3000,
        5: 4500,
    },
    5: {
        1: 100,
        2: 200,
        3: 1000,
        4: 2000,
        5: 3000,
    },
    6: {
        1: 100,
        2: 200,
        3: 1000,
        4: 2000,
        5: 3000,
    },
    7: {
        1: 50,
        2: 100,
        3: 500,
        4: 1000,
        5: 1500,
    },
};

@ccclass
export default class Game extends BaseComponent {
    public static instance: Game = null;

    @property(cc.Node)
    protected Wzhcq_ZhaDanNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_AutoTipsNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_xiaoPaiNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_GridNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_specialGridNode: cc.Node[] = [];

    @property(cc.Node)
    protected Wzhcq_specialMask: cc.Node[] = [];

    @property(cc.Prefab)
    protected Wzhcq_PbMahjong: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_PbGrid: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_pausePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_warnPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_gamePropPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_energyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_recommendPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_gameSuccessPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_gameSuccessPrefab2: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_gameFailPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_authorPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_addTimePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_warn_addTimePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_warn_downTimeEndPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_gameOverPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_DoubleFitScorePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_DoubleFitScorePrefab2: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_ShuffleCardsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_shuffleMaskPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_GuidanceMaskPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_PropShuffleTilesPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected Wzhcq_PropTipsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_PaiPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_tipsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    targetPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    conSteriliPlusPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    Wzhcq_scorePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    paintBoardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    segmentPrefab: cc.Prefab = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioSucess: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioClick: cc.AudioSource = null;

    @property(cc.Node)
    protected Wzhcq_Kuang: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_CustomAd: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_MoveMahjongNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_tips: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_downTimeNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_btn_addTime: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_DoubleScoreNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_DoubleScoreNode2: cc.Node = null;

    @property(cc.Sprite)
    protected Wzhcq_timeBar: cc.Sprite = null;

    @property(cc.Label)
    protected Wzhcq_downTime: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_cur_score_label: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_cur_rank_label: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_all_rank_label: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_PropTipsLable: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_PropAddTimeLable: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_PropShuffleTilesLable: cc.Label = null;

    @property(cc.Label)
    protected Wzhcq_PropCancellationLable: cc.Label = null;

    @property(cc.ProgressBar)
    protected Wzhcq_cur_score_progress: cc.ProgressBar = null;

    @property(cc.Node)
    protected Wzhcq_bar: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_topNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_ShuffleFinger: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_tipsNode: cc.Node = null;

    @property(cc.Node)
    protected Wzhcq_GuidanceMaskParent: cc.Node = null;

    @property(cc.Label)
    protected Wzhcq_target_label: cc.Label[] = [];

    @property(cc.Node)
    protected Wzhcq_target_Node: cc.Node[] = [];

    @property(cc.Node)
    protected Wzhcq_PropShuffleTilesArray: cc.Node[] = [];

    @property(cc.Node)
    protected Wzhcq_PropAddTimeArray: cc.Node[] = [];

    @property(cc.Node)
    protected Wzhcq_PropTipsArray: cc.Node[] = [];

    @property(cc.Node)
    protected Wzhcq_PropCancellationArray: cc.Node[] = [];

    @property(cc.SpriteFrame)
    Wzhcq_releaseSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    Wzhcq_testSpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.Node)
    Wzhcq_btn_TipsNode: cc.Node = null;

    @property(cc.Node)
    Wzhcq_btn_ShuffleTilesNode: cc.Node = null;

    @property(cc.Node)
    downtime: cc.Node = null;

    @property(cc.Node)
    shandianAni: cc.Node = null;

    @property(cc.Node)
    guizeNode: cc.Node = null;

    @property(cc.Node)
    tiaozhanBG: cc.Node = null;

    @property(cc.Node)
    chuangguanBG: cc.Node = null;

    @property(cc.Node)
    tiaozhanMoShiScoreNode: cc.Node = null;

    @property(cc.Node)
    protected flyScoreEnd: cc.Node = null;

    @property(cc.JsonAsset)
    cardData: cc.JsonAsset = null;

    @property(cc.Node)
    downBtnLayout: cc.Node = null;

    @property(cc.Node)
    level: cc.Node = null;

    @property(cc.Node)
    segmentLayout: cc.Node[] = [];

    @property(cc.Node)
    segmentNum: cc.Node = null;

    @property
    public Wzhcq_Row: number = 0;

    @property
    public Wzhcq_Col: number = 0;

    private Wzhcq_mahjongManager: MahjongManager;
    private Wzhcq_mahjongManager2: MahjongManager2;

    Wzhcq_pauseNode: any;
    Wzhcq_warnNode: any;
    Wzhcq_gameSuccessNode: any;
    Wzhcq_gameFailNode: any;
    Wzhcq_gameOverNode: any;
    Wzhcq_gamePropNode: any;
    Wzhcq_shuffleMaskNode: any;
    Wzhcq_GuidanceMaskNode: any;
    Wzhcq_authorNode: any;
    Wzhcq_energyNode: any;
    Wzhcq_recommendNode: any;
    Wzhcq_addTimeNode: any;
    Wzhcq_warn_addTimeNode: any;
    Wzhcq_warn_downTimeEndNode: any;
    Wzhcq_doubleFitScore: any;
    Wzhcq_FitScore: any;
    conSteriliPlusNode: any;
    paintBoardNode: any;
    Wzhcq_score: any;

    Wzhcq_isDownTime: any;
    Wzhcq_isDownTime2 = false;
    Wzhcq_intervalTime = -1;

    Wzhcq_add_time: any;
    Wzhcq_act_time: any;
    Wzhcq_sub_time: any;

    Wzhcq_game_isDownTime: any;
    Wzhcq_game_down_time: any;
    Wzhcq_game_isDialog = true;
    Wzhcq_game_isaddtime = true;

    Wzhcq_double_hit_count = 0;
    Wzhcq_double_hit_state = 0;
    Wzhcq__index = 5;
    Wzhcq_curScore = 0;
    Wzhcq_cur_RankScore = 0;
    Wzhcq_all_RankScore = 0;
    Wzhcq_gameTypeIndex = 1;
    Wzhcq_rankIndex = 1;
    Wzhcq___Index = 0;
    Wzhcq_stepIndex = 1;
    Wzhcq_layout: any;
    Wzhcq_finger: any;
    Wzhcq_fillRange = 0;
    Wzhcq_IsGuidance = 0;
    Wzhcq_LianJiCount = 0;

    public Wzhcq_MahjongList: any;
    public Wzhcq_WaterList: any;

    public Wzhcq_MahjongListObj: any;

    public Wzhcq_CheckMapObj: any;

    public Wzhcq_GridListObj: any;

    public Wzhcq_GridList: any;

    public Wzhcq_GuideGridList: any;

    public Wzhcq_CheckMap: any;

    public Wzhcq_MoveMahjong: any;

    public Wzhcq_TargetMahjong: any;

    public Wzhcq_MoveMahjongHasTarget = false;

    public Wzhcq_MoveTipCdTime = 0.1;

    public Wzhcq_ShowMoveTargetTipTime = this.Wzhcq_MoveTipCdTime;

    public Wzhcq_GuideTipState = false;

    Wzhcq_ShuffleTipState = false;

    public Wzhcq_ShuffleTipTime = 15;
    public Wzhcq_NextShuffleTipTime = 15;

    public Wzhcq_IsGuideTip = false;

    Wzhcq_IsShuffleTip = false;

    public Wzhcq_IsShowMovetip = false;

    public Wzhcq_TipResult = [];

    public Wzhcq_zhadanList = [];

    public Wzhcq_StartTipResult = [];

    Wzhcq_isclick = true;
    Wzhcq_isShuffleFinger = true;
    Wzhcq_isContinuous = true;
    shuffleCount = 0;
    mahjongTouchState = true;

    tiaozhanDistance = 100; //挑战关卡麻将上调100
    chuangguanDistance = -30; //闯关关卡麻将下调-30
    gameState = 0; //游戏状态 = 1游戏成功或失败
    segmentDataArray = [];
    segmentIdx = 0;
    flyRopePos = -165;

    public SetMoveMahjongHasTarget(Wzhcq_mahjong: any, Wzhcq_target: any) {
        if (this.Wzhcq_MoveMahjongHasTarget) {
            return;
        }
        this.Wzhcq_MoveMahjong = Wzhcq_mahjong;
        this.Wzhcq_TargetMahjong = Wzhcq_target;
        this.Wzhcq_MoveMahjongHasTarget = true;
        this.Wzhcq_IsShowMovetip = false;
    }

    public ClearMoveMahjongAndTarget() {
        this.Wzhcq_MoveMahjong = null;
        this.Wzhcq_TargetMahjong = null;
        this.Wzhcq_MoveMahjongHasTarget = false;
        this.Wzhcq_ShowMoveTargetTipTime = this.Wzhcq_MoveTipCdTime;
        this.Wzhcq_IsShowMovetip = true;
    }

    // 假设区域定义为左下角为 (x1, y1)，右上角为 (x2, y2)
    public IsPointInRect(Wzhcq_pointX: any, Wzhcq_pointY: any, Wzhcq_x1: any, Wzhcq_y1: any, Wzhcq_x2: any, Wzhcq_y2: any) {
        return Wzhcq_pointX >= Wzhcq_x1 && Wzhcq_pointX <= Wzhcq_x2 && Wzhcq_pointY >= Wzhcq_y1 && Wzhcq_pointY <= Wzhcq_y2;
    }

    public GetInPosGrid(Wzhcq_pos: cc.Vec3): GridInfo {
        for (let Wzhcq_key in this.Wzhcq_GridList) {
            let Wzhcq_grid = this.Wzhcq_GridList[Wzhcq_key];
            if (this.IsPointInRect(Wzhcq_pos.x, Wzhcq_pos.y, Wzhcq_grid.x - Wzhcq_grid.width / 2, Wzhcq_grid.y - Wzhcq_grid.height / 2, Wzhcq_grid.x + Wzhcq_grid.width / 2, Wzhcq_grid.y + Wzhcq_grid.height / 2)) {
                let Wzhcq_data: GridInfo = {
                    key: Wzhcq_key,
                    grid: Wzhcq_grid,
                    inRect: true,
                };
                return Wzhcq_data;
            }
        }
    }

    public OnMahjongTouchEnd(Wzhcq_mahjongTile: MahjongTile): boolean {
        let Wzhcq_target: MahjongTile = this.GetNeedRemoveMahjong(Wzhcq_mahjongTile);
        if (Wzhcq_target) {
            AudioManager.instance.playAudioXiaoChu();

            delete this.Wzhcq_MahjongList[Wzhcq_mahjongTile.GetPosKey()];
            delete this.Wzhcq_MahjongList[Wzhcq_target.GetPosKey()];
            let Wzhcq_data: RemoveData = {
                self: Wzhcq_mahjongTile,
                target: Wzhcq_target,
            };
            Wzhcq_target.Remove();
            Wzhcq_mahjongTile.Remove();

            if (Utils.getInstance.GameType != 6 && Utils.getInstance.autoState && Utils.getInstance.MoveCount <= Utils.getInstance.MaxMoveCount) {
                Utils.getInstance.MoveCount++;
            }

            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, Wzhcq_data);

            this.Wzhcq_resetGuideData(undefined);

            return true;
        }
        else {
            this.Wzhcq_resetGuideData(1);
            return false;
        }
    }

    public OnMahjongTouchEnd2(Wzhcq_mahjongTile: MahjongTile): boolean {
        let Wzhcq_target: MahjongTile = this.GetNeedRemoveMahjong(Wzhcq_mahjongTile);
        if (Wzhcq_target) {
            AudioManager.instance.playAudioXiaoChu();

            delete this.Wzhcq_MahjongList[Wzhcq_mahjongTile.GetPosKey()];
            delete this.Wzhcq_MahjongList[Wzhcq_target.GetPosKey()];
            let data: RemoveData = {
                self: Wzhcq_mahjongTile,
                target: Wzhcq_target,
            };
            Wzhcq_target.Remove();
            Wzhcq_mahjongTile.Remove();

            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, data);

            this.Wzhcq_resetGuideData(undefined);

            return true;
        }
        else {
            this.Wzhcq_resetGuideData(1);
            return false;
        }
    }

    hideShuffleFinger() {

        this.Wzhcq_ShuffleFinger.active = false;
        this.Wzhcq_isShuffleFinger = false;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ShuffleFinger, 0);
    }

    Wzhcq_closePause() {
        if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_game_isDownTime = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_game_isDownTime = true;
        }
        this.Wzhcq_isDownTime = true;
        this.Wzhcq_ShuffleTipState = true;
    }

    createShuffleCards(): void {
        let ShuffleCardsPrefab = cc.instantiate(this.Wzhcq_ShuffleCardsPrefab);
        ShuffleCardsPrefab.parent = this.node;
        ShuffleCardsPrefab.getComponent(ShuffleCards).loadTween();
    }

    pause(): void {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_game_isDownTime = false;
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_ShuffleTipState = false;

        if (!this.Wzhcq_pauseNode) {
            this.Wzhcq_pauseNode = cc.instantiate(this.Wzhcq_pausePrefab);
            this.Wzhcq_pauseNode.parent = this.node;
        }
        this.Wzhcq_pauseNode.active = true;
    }

    Wzhcq_Warn_Popup() {
        if (!this.Wzhcq_warnNode) {
            this.Wzhcq_warnNode = cc.instantiate(this.Wzhcq_warnPrefab);
            this.Wzhcq_warnNode.parent = this.node;
        }
        this.Wzhcq_warnNode.zIndex = 1000;
        this.Wzhcq_warnNode.active = true;
    }

    Wzhcq_gameProp() {
        this.Wzhcq_game_isDownTime = false;
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_ShuffleTipState = false;

        this.gameState = 1;

        if (this.Wzhcq_warn_downTimeEndNode) {
            this.Wzhcq_warn_downTimeEndNode.active = false;
        }

        if (this.Wzhcq_doubleFitScore) {
            this.Wzhcq_doubleFitScore.active = false;
        }
        this.scheduleOnce(() => {
            // if (!this.Wzhcq_gamePropNode) {
            //     this.Wzhcq_gamePropNode = cc.instantiate(this.Wzhcq_gamePropPrefab);
            //     this.Wzhcq_gamePropNode.parent = this.node;
            //     this.Wzhcq_gamePropNode.zIndex = 60;
            // }
            // this.Wzhcq_gamePropNode.active = true;

            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS);

        }, 1);
    }

    createPaintBoard() {
        if (!this.paintBoardNode) {
            this.paintBoardNode = cc.instantiate(this.paintBoardPrefab);
            this.paintBoardNode.parent = this.node;
            this.paintBoardNode.zIndex = 60;
        }
        this.paintBoardNode.active = true;
    }

    Wzhcq_createEnergy() {
        if (!this.Wzhcq_energyNode) {
            this.Wzhcq_energyNode = cc.instantiate(this.Wzhcq_energyPrefab);
            this.Wzhcq_energyNode.parent = this.node;
        }
        this.Wzhcq_energyNode.getComponent(Energy).initState(0);
        this.Wzhcq_energyNode.active = true;
    }

    Wzhcq_createRecommend(Wzhcq_type: any) {
        if (!this.Wzhcq_recommendNode) {
            this.Wzhcq_recommendNode = cc.instantiate(this.Wzhcq_recommendPrefab);
            this.Wzhcq_recommendNode.parent = this.node;
        }
        this.Wzhcq_recommendNode.getComponent(Recommend).initState(Wzhcq_type);
        this.Wzhcq_recommendNode.active = true;
    }

    Wzhcq_gameSuccess() {
        this.Wzhcq_game_isDownTime = false;
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_ShuffleTipState = false;

        this.gameState = 1;

        this.Wzhcq_clearData();
        this.Wzhcq_btn_addTime.stopAllActions();
        this.Wzhcq_btn_addTime.scale = 1;

        this.scheduleOnce(() => {
            if (Utils.getInstance.GameType == 6) {
                if (!this.Wzhcq_gameSuccessNode) {
                    this.Wzhcq_gameSuccessNode = cc.instantiate(this.Wzhcq_gameSuccessPrefab);
                    this.Wzhcq_gameSuccessNode.parent = this.node;
                    this.Wzhcq_gameSuccessNode.zIndex = 50;
                }
                this.Wzhcq_gameSuccessNode.active = true;

            }
            else {
                if (!this.Wzhcq_gameSuccessNode) {
                    this.Wzhcq_gameSuccessNode = cc.instantiate(this.Wzhcq_gameSuccessPrefab2);
                    this.Wzhcq_gameSuccessNode.parent = this.node;
                    this.Wzhcq_gameSuccessNode.zIndex = 50;
                }
                this.Wzhcq_gameSuccessNode.active = true;
            }

            this.updateAllRankScore();
        }, 1);
    }

    Wzhcq_gameOver() {
        this.Wzhcq_clearData();

        this.scheduleOnce(() => {
            if (!this.Wzhcq_gameOverNode) {
                this.Wzhcq_gameOverNode = cc.instantiate(this.Wzhcq_gameOverPrefab);
                this.Wzhcq_gameOverNode.parent = this.node;
                this.Wzhcq_gameOverNode.zIndex = 50;
            }
            this.Wzhcq_gameOverNode.active = true;
        }, 1);
    }

    Wzhcq_gameFail() {
        this.Wzhcq_game_isDownTime = false;
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_ShuffleTipState = false;

        this.gameState = 1;

        if (this.Wzhcq_warn_downTimeEndNode) {
            this.Wzhcq_warn_downTimeEndNode.active = false;
        }

        this.scheduleOnce(() => {
            if (!this.Wzhcq_gameFailNode) {
                this.Wzhcq_gameFailNode = cc.instantiate(this.Wzhcq_gameFailPrefab);
                this.Wzhcq_gameFailNode.parent = this.node;
                this.Wzhcq_gameFailNode.zIndex = 50;
            }
            this.Wzhcq_gameFailNode.active = true;
        }, 1);
    }

    Wzhcq_author() {
        this.scheduleOnce(() => {
            if (!this.Wzhcq_authorNode) {
                this.Wzhcq_authorNode = cc.instantiate(this.Wzhcq_authorPrefab);
                this.Wzhcq_authorNode.parent = this.node;
                this.Wzhcq_authorNode.zIndex = 100;
            }
            this.Wzhcq_authorNode.active = true;
        }, 1);
    }

    create_addTime() {
        if (!this.Wzhcq_addTimeNode) {
            this.Wzhcq_addTimeNode = cc.instantiate(this.Wzhcq_addTimePrefab);
            this.Wzhcq_addTimeNode.parent = this.node;
            this.Wzhcq_addTimeNode.zIndex = 50;
        }
        this.Wzhcq_addTimeNode.active = true;
        this.Wzhcq_game_isDownTime = false;
    }

    Wzhcq_update_downTime(Wzhcq_time: any) {
        this.Wzhcq_game_down_time += Wzhcq_time;
        if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_game_isDownTime = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_game_isDownTime = true;
        }

        // if (this.Wzhcq_game_down_time > Utils.getInstance.game_warn_addTime) {
        //     this.Wzhcq_game_isDialog = true;
        // }
    }

    create_warn_addTime() {
        if (!this.Wzhcq_warn_addTimeNode) {
            this.Wzhcq_warn_addTimeNode = cc.instantiate(this.Wzhcq_warn_addTimePrefab);
            this.Wzhcq_warn_addTimeNode.parent = this.node;
            this.Wzhcq_warn_addTimeNode.zIndex = 50;
        }
        this.Wzhcq_warn_addTimeNode.active = true;
    }

    create_warn_downTimeEnd() {
        Utils.getInstance.isRevive = 0;

        if (!this.Wzhcq_warn_downTimeEndNode) {
            this.Wzhcq_warn_downTimeEndNode = cc.instantiate(this.Wzhcq_warn_downTimeEndPrefab);
            this.Wzhcq_warn_downTimeEndNode.parent = this.node;
            this.Wzhcq_warn_downTimeEndNode.zIndex = 50;
        }
        this.Wzhcq_warn_downTimeEndNode.active = true;
    }

    Wzhcq_shuffleMask() {
        this.Wzhcq_game_isDownTime = false;
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_ShuffleTipState = false;

        this.gameState = 1;

        this.scheduleOnce(() => {
            if (!this.Wzhcq_shuffleMaskNode) {
                this.Wzhcq_shuffleMaskNode = cc.instantiate(this.Wzhcq_shuffleMaskPrefab);
                this.Wzhcq_shuffleMaskNode.parent = this.node;
            }

            let pos = this.downBtnLayout.convertToWorldSpaceAR(this.Wzhcq_btn_ShuffleTilesNode.position);
            let pos2 = this.node.convertToNodeSpaceAR(pos);

            this.Wzhcq_shuffleMaskNode.getComponent(ShuffleMask).updateMask(this.Wzhcq_btn_ShuffleTilesNode.width + 10, this.Wzhcq_btn_ShuffleTilesNode.height + 10, pos2);
            this.Wzhcq_shuffleMaskNode.active = true;
        }, 1);
    }

    Wzhcq_report_result(stagepass: any) {
        let Wzhcq_point = this.Wzhcq_curScore;
        let Wzhcq_score = this.Wzhcq_cur_RankScore;

        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);
    }

    addScore(Wzhcq_num: any, Wzhcq_type: any, Wzhcq_position: any) {
        this.Wzhcq_FitScore = cc.instantiate(this.Wzhcq_DoubleFitScorePrefab2);
        this.Wzhcq_FitScore.parent = this.node;
        if (Wzhcq_position.x - 200 < - 300) {
            this.Wzhcq_FitScore.x = -300;
            this.Wzhcq_FitScore.y = Wzhcq_position.y + 50;
        }
        else if (Wzhcq_position.x > 300) {
            this.Wzhcq_FitScore.x = Wzhcq_position.x - 100;
            this.Wzhcq_FitScore.y = Wzhcq_position.y + 50;
        }
        else {
            this.Wzhcq_FitScore.x = Wzhcq_position.x;
        }
        this.Wzhcq_FitScore.y = Wzhcq_position.y;

        this.Wzhcq_FitScore.active = true;
        this.Wzhcq_FitScore.getComponent(DoubleFitScore2).initData(Wzhcq_num, Wzhcq_type, this.Wzhcq_double_hit_count);
    }

    DoubleAddScore(Wzhcq_num: any, Wzhcq_type: any, Wzhcq_position: any) {
        if (!this.Wzhcq_doubleFitScore) {
            this.Wzhcq_doubleFitScore = cc.instantiate(this.Wzhcq_DoubleFitScorePrefab);
            this.Wzhcq_doubleFitScore.parent = this.Wzhcq_DoubleScoreNode;
        }
        this.Wzhcq_doubleFitScore.position = cc.v2(0, 0);
        this.Wzhcq_doubleFitScore.active = true;
        this.Wzhcq_doubleFitScore.getComponent(DoubleFitScore).initData(Wzhcq_num, Wzhcq_type, this.Wzhcq_double_hit_count);
    }

    DoubleAddScore2(Wzhcq_num: any, Wzhcq_type: any, Wzhcq_position: any) {
        this.Wzhcq_doubleFitScore = cc.instantiate(this.Wzhcq_DoubleFitScorePrefab2);
        this.Wzhcq_doubleFitScore.parent = this.Wzhcq_DoubleScoreNode2;
        this.Wzhcq_doubleFitScore.position = cc.v2(0, 0);
        this.Wzhcq_doubleFitScore.active = true;
        this.Wzhcq_doubleFitScore.getComponent(DoubleFitScore2).initData(Wzhcq_num, Wzhcq_type, this.Wzhcq_double_hit_count);
    }

    showCustomAd5() {
        if (WxPlatform.getInstance.custom5) {
            WxPlatform.getInstance.custom5.show();
        }
        else {
            WxPlatform.getInstance.showCustomAd5(5, this.Wzhcq_CustomAd, data => {
                if (data == 0) {
                    //如果失败了就关闭弹窗，这里看自己的逻辑是如何的
                    // this.node.destroy();//关闭
                }
            });
        }
    }

    eventShow() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            WxPlatform.getInstance.showInterstitialAd(() => {
                WxPlatform.getInstance.CreateCustomAd5(5, () => { });
            });
        }
    }

    Wzhcq_guidanceStep() {
        if (Utils.getInstance.GameType == 1) {
            if (!this.Wzhcq_GuidanceMaskNode) {
                this.Wzhcq_GuidanceMaskNode = cc.instantiate(this.Wzhcq_GuidanceMaskPrefab);
                this.Wzhcq_GuidanceMaskNode.parent = this.Wzhcq_GuidanceMaskParent;
            }
            this.Wzhcq_GuidanceMaskNode.active = true;
            this.Wzhcq_GuidanceMaskNode.getComponent(GuidanceMask).Wzhcq_guidanceStep1();

            this.Wzhcq_finger.active = true;
            this.Wzhcq_finger.position = cc.v3(-35, 13);
            cc.tween(this.Wzhcq_finger).repeatForever(
                cc.tween().to(0.5, { position: cc.v3(-35, -20) })
                    .call(() => {
                        this.Wzhcq_finger.position = cc.v3(-35, 13);
                    })
            ).start();
        }
        //第一步 (-35,86)  70,172
        //第二步 (-35,43)  210,86
        //第三步 (-105,0)  210,342
        //第四步 (0,0)  420,342
    }

    guideMoveStep() {
        // this.scheduleOnce(() => {
        if (Utils.getInstance.GameType == 1) {
            this.Wzhcq_GuidanceMaskNode.getComponent(GuidanceMask).stopAllActon();
            if (this.Wzhcq_stepIndex == 2) {
                this.Wzhcq_GuidanceMaskNode.getComponent(GuidanceMask).Wzhcq_guidanceStep2();

                this.Wzhcq_finger.active = true;
                this.Wzhcq_finger.position = cc.v3(35, 43);
                cc.tween(this.Wzhcq_finger).repeatForever(
                    cc.tween().to(0.5, { position: cc.v3(35, 10) })
                        .call(() => {
                            this.Wzhcq_finger.position = cc.v3(35, 43);
                        })
                ).start();

            }
            else if (this.Wzhcq_stepIndex == 3) {
                this.scheduleOnce(() => {
                    this.Wzhcq_GuidanceMaskNode.getComponent(GuidanceMask).Wzhcq_guidanceStep3();

                    this.Wzhcq_finger.active = true;
                    this.Wzhcq_finger.position = cc.v3(-35, -159);
                    cc.tween(this.Wzhcq_finger).repeatForever(
                        cc.tween()
                            .delay(1.5)
                            .to(1, { position: cc.v3(-35, 13) })
                            .delay(1.5)
                            .call(() => {
                                this.Wzhcq_finger.position = cc.v3(-35, -159);
                            })
                    ).start();

                    if (Utils.getInstance.GameType == 6) {
                        this.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                    }
                    else {
                        this.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                    }

                    this.Wzhcq_layout.removeAllChildren();
                    let Wzhcq_key1 = { x: 2, y: 3 };
                    let Wzhcq_key2 = { x: 2, y: 2 };
                    let Wzhcq_data = {};
                    Wzhcq_data[JSON.stringify(Wzhcq_key1)] = this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_key1)];
                    Wzhcq_data[JSON.stringify(Wzhcq_key2)] = this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_key2)];

                    let Wzhcq_end_key = { x: 0, y: 1 };
                    let Wzhcq_endData = this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_end_key)];

                    let Wzhcq_startNode: any;
                    for (let k in Wzhcq_data) {
                        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_data[k];

                        let Wzhcq_PaiPrefab = cc.instantiate(this.Wzhcq_PaiPrefab);
                        let Wzhcq_node: cc.Node = new cc.Node();
                        Wzhcq_node.width = Wzhcq_PaiPrefab.width;
                        Wzhcq_node.height = Wzhcq_PaiPrefab.height;
                        let Wzhcq__data = {};
                        Wzhcq__data['Suit'] = Wzhcq_mahjongTile.GetMahjongData().Suit;
                        Wzhcq__data['Num'] = Wzhcq_mahjongTile.GetMahjongData().Num;
                        Wzhcq__data['Id'] = Wzhcq_mahjongTile.GetMahjongData().Id;
                        this.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
                        Wzhcq_PaiPrefab.getComponent('Pai').setData(Wzhcq__data, 150);

                        if (JSON.parse(k).x == Wzhcq_key1.x && JSON.parse(k).y == Wzhcq_key1.y) {
                            Wzhcq_startNode = Wzhcq_PaiPrefab;
                        }

                        Wzhcq_endData.SetTipNodeVisible(true);
                        Wzhcq_PaiPrefab.position = Wzhcq_mahjongTile.node.position;
                    }

                    this.Wzhcq_layout.active = true;
                    cc.tween(this.Wzhcq_layout)
                        .repeatForever(
                            cc
                                .tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(0, 2 * 86) })
                                .call(() => {
                                    Wzhcq_startNode.opacity = 255;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(true);
                                })
                                .delay(1.5)
                                .call(() => {
                                    Wzhcq_startNode.opacity = 150;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(false);
                                    if (Utils.getInstance.GameType == 6) {
                                        this.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                                    }
                                    else {
                                        this.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                                    }

                                })
                        )
                        .start();
                }, 0.5);
            }
            else if (this.Wzhcq_stepIndex == 4) {
                this.scheduleOnce(() => {
                    this.Wzhcq_GuidanceMaskNode.getComponent(GuidanceMask).Wzhcq_guidanceStep4();

                    this.Wzhcq_finger.active = true;
                    this.Wzhcq_finger.position = cc.v3(175, 13);
                    cc.tween(this.Wzhcq_finger).repeatForever(
                        cc.tween()
                            .delay(1.5)
                            .to(1, { position: cc.v3(-105, 13) })
                            .delay(1.5)
                            .call(() => {
                                this.Wzhcq_finger.position = cc.v3(175, 13);
                            })
                    ).start();

                    if (Utils.getInstance.GameType == 6) {
                        this.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                    }
                    else {
                        this.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                    }

                    this.Wzhcq_layout.removeAllChildren();
                    let Wzhcq_key1 = { x: 5, y: 1 };
                    let Wzhcq_key2 = { x: 4, y: 1 };
                    let Wzhcq_data = {};
                    Wzhcq_data[JSON.stringify(Wzhcq_key1)] = this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_key1)];
                    Wzhcq_data[JSON.stringify(Wzhcq_key2)] = this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_key2)];

                    let Wzhcq_end_key = { x: 1, y: 0 };
                    let Wzhcq_endData = this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_end_key)];

                    let startNode: any;
                    for (let k in Wzhcq_data) {
                        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_data[k];

                        let Wzhcq_PaiPrefab = cc.instantiate(this.Wzhcq_PaiPrefab);
                        let Wzhcq_node: cc.Node = new cc.Node();
                        Wzhcq_node.width = Wzhcq_PaiPrefab.width;
                        Wzhcq_node.height = Wzhcq_PaiPrefab.height;
                        let Wzhcq__data = {};
                        Wzhcq__data['Suit'] = Wzhcq_mahjongTile.GetMahjongData().Suit;
                        Wzhcq__data['Num'] = Wzhcq_mahjongTile.GetMahjongData().Num;
                        Wzhcq__data['Id'] = Wzhcq_mahjongTile.GetMahjongData().Id;
                        this.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
                        Wzhcq_PaiPrefab.getComponent('Pai').setData(Wzhcq__data, 150);

                        if (JSON.parse(k).x == Wzhcq_key1.x && JSON.parse(k).y == Wzhcq_key1.y) {
                            startNode = Wzhcq_PaiPrefab;
                        }

                        Wzhcq_endData.SetTipNodeVisible(true);
                        Wzhcq_PaiPrefab.position = Wzhcq_mahjongTile.node.position;
                    }
                    this.Wzhcq_layout.active = true;

                    cc.tween(this.Wzhcq_layout)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(-70 * 4, 0) })
                                .call(() => {
                                    startNode.opacity = 255;
                                    startNode.getComponent('Pai').SetTipNodeVisible(true);
                                })
                                .delay(1.5)
                                .call(() => {
                                    startNode.opacity = 150;
                                    startNode.getComponent('Pai').SetTipNodeVisible(false);
                                    if (Utils.getInstance.GameType == 6) {
                                        this.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                                    }
                                    else {
                                        this.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                                    }

                                })
                        )
                        .start();
                }, 0.5);
            }
            else {
                this.Wzhcq_GuidanceMaskNode.getComponent(GuidanceMask).stopAllActon();
                this.Wzhcq_GuidanceMaskNode.active = false;
                this.Wzhcq_layout.removeAllChildren();
                this.Wzhcq_layout.stopAllActions();

                if (this.Wzhcq_IsGuidance) {
                    this.Wzhcq_tips.active = true;
                    this.Wzhcq_IsGuidance = 0;
                }
                else {
                    this.Wzhcq_tips.active = false;
                }
            }
        }
        // }, 1);

        let Wzhcq_guide = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Guide);
        if (Wzhcq_guide) {
        }
    }

    IsGuide() {
        Utils.getInstance.IsGuideTip = true;
    }

    cancelGuideData() {
        this.Wzhcq_resetGuideData(1);
        if (Utils.getInstance.GameType == 1 && this.Wzhcq_stepIndex <= 4) {
            this.guideMoveStep()
        }
    }

    Wzhcq_resetGuideData(isTime: any) {
        Utils.getInstance.IsGuideTip = false;
        this.Wzhcq_GuideTipState = true;
        if (isTime) {
            Utils.getInstance.GuideTipTime = 1;
        }
        else {
            Utils.getInstance.GuideTipTime = 5;
        }
    }

    IsShuffle() {
        this.Wzhcq_IsShuffleTip = true;
    }

    resetShuffleTipData() {
        this.Wzhcq_ShuffleTipTime = this.Wzhcq_NextShuffleTipTime;

        if (this.Wzhcq_ShuffleFinger.active) {
            this.Wzhcq_IsShuffleTip = false;
            this.Wzhcq_ShuffleFinger.active = false;
            this.Wzhcq_ShuffleTipState = true;
            this.Wzhcq_ShuffleTipTime = this.Wzhcq_NextShuffleTipTime + 5;
            this.Wzhcq_NextShuffleTipTime = this.Wzhcq_ShuffleTipTime;

            this.Wzhcq_btn_ShuffleTilesNode.stopAllActions();
            this.Wzhcq_btn_ShuffleTilesNode.scale = 1;

        }
        // console.log("Wzhcq_ShuffleTipTime:", this.Wzhcq_ShuffleTipTime);
    }

    hideShuffleTip() {
        this.Wzhcq_ShuffleFinger.active = false;

        if (Utils.getInstance.GameType == 5 || Utils.getInstance.GameType == 6) {
            this.Wzhcq_ShuffleFinger.x = 254.5 + 20;
        }
        else {
            this.Wzhcq_ShuffleFinger.x = 169.5 + 20;
        }

        this.Wzhcq_ShuffleFinger.y = this.downBtnLayout.y + 120;
    }

    updateCountDown() {
        Utils.getInstance._countdownSecond -= 1;

        let Wzhcq_cur_energytime = Math.round(new Date().getTime() / 1000);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurEnergyTime, Wzhcq_cur_energytime);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime, Utils.getInstance._countdownSecond);

        // console.error("时间：", Utils.getInstance.hourFormSecondsFormatMinutes(Utils.getInstance._countdownSecond));

        if (Utils.getInstance._countdownSecond < 1) {
            let Wzhcq_life = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Life);
            if (Wzhcq_life >= 5) {
                this.Wzhcq_isDownTime2 = false;
            }
            else {

                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Life, Wzhcq_life + 1);

                if (Wzhcq_life + 1 < 5) {
                    this.Wzhcq_isDownTime2 = true;
                    Utils.getInstance._countdownSecond = Utils.getInstance.energyDownTime;
                }
                else {
                    this.Wzhcq_isDownTime2 = false;
                    Utils.getInstance._countdownSecond = 0;
                }
            }

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_LifeState, 1);
        }
    }

    update(dt: any) {
        if (this.Wzhcq_isDownTime) {
            this.Wzhcq_add_time -= dt;
            var Wzhcq_persent = this.Wzhcq_add_time / this.Wzhcq_act_time;
            if (Wzhcq_persent <= 0) {
                Wzhcq_persent = 0;
                this.Wzhcq_add_time = 30;
                this.Wzhcq_isDownTime = false;
            }
            this.Wzhcq_timeBar.fillRange = Wzhcq_persent;
            this.downtime.getComponent(cc.Label).string = String(Math.floor(this.Wzhcq_add_time));
            // console.error(String(Math.floor(this.Wzhcq_add_time)))
            this.updateScore(this.Wzhcq_add_time);

            this.Wzhcq_sub_time -= dt;
            var Wzhcq_per = this.Wzhcq_sub_time / this.Wzhcq_act_time;
            if (Wzhcq_per <= 0) {
                Wzhcq_per = 0;
                this.Wzhcq_sub_time = this.Wzhcq_act_time;
            }
        }

        if (this.Wzhcq_intervalTime >= 0) {
            this.Wzhcq_intervalTime -= dt;
        }
        else {
            this.Wzhcq_intervalTime = 1;
            if (this.Wzhcq_isDownTime2 && Utils.getInstance._countdownSecond > 0) {
                this.updateCountDown();
            }
        }

        if (this.Wzhcq_game_isDownTime) {


            if (this.Wzhcq_game_down_time >= 0) {
                this.Wzhcq_game_down_time -= dt;
                this.Wzhcq_downTime.string = '' + Utils.getInstance.secondsFormatMinutes(parseInt(this.Wzhcq_game_down_time));
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_JiShi_DownTime, this.Wzhcq_game_down_time);
            }
            if (this.Wzhcq_game_down_time <= Utils.getInstance.game_warn_addTime && this.Wzhcq_game_isDialog) {
                if (this.gameState != 1) {
                    this.Wzhcq_game_isDialog = false;
                    this.Wzhcq_game_isDownTime = false;
                    this.create_warn_addTime();
                }
            }

            if (this.Wzhcq_game_down_time <= 60 && this.Wzhcq_game_isaddtime) {
                this.Wzhcq_game_isaddtime = false;

                cc.tween(this.Wzhcq_btn_addTime)
                    .repeatForever(
                        cc.tween()
                            .to(0.5, { scale: 1.2 })
                            .to(0.5, { scale: 1 })
                    )
                    .start();
            }

            if (this.Wzhcq_game_down_time <= 0) {
                if (this.gameState != 1) {
                    this.Wzhcq_game_isDownTime = false;
                    this.Wzhcq_btn_addTime.stopAllActions();
                    this.Wzhcq_btn_addTime.scale = 1;
                    this.create_warn_downTimeEnd();
                }
            }
        }


        if (this.Wzhcq_GuideTipState) {
            if (!Utils.getInstance.IsGuideTip) {
                Utils.getInstance.GuideTipTime -= dt;

                if (Utils.getInstance.GameType != 6) {
                    if (Utils.getInstance.Level > Utils.getInstance.MaxLevel) {
                        Utils.getInstance.Level = Utils.getInstance.getLevelRange(Utils.getInstance.Level);
                    }
                    if (Utils.getInstance.GuideTipTime <= 0 && ((!this.Wzhcq_IsGuidance && Utils.getInstance.GameType == 1) || (Utils.getInstance.levelData[Utils.getInstance.Level].autotips == 1 && Utils.getInstance.MoveCount < Utils.getInstance.MaxMoveCount))) {
                        this.GuideTipAni();
                    }
                }
            }
        }

        if (this.Wzhcq_ShuffleTipState) {
            if (!this.Wzhcq_IsShuffleTip) {
                this.Wzhcq_ShuffleTipTime -= dt;

                if (this.Wzhcq_ShuffleTipTime <= 0) {
                    this.ShuffleTipAni();
                }
            }
        }

        if (this.Wzhcq_MoveMahjongHasTarget) {
            // console.log("IsShowMovetip:", this.Wzhcq_IsShowMovetip);
            if (!this.Wzhcq_IsShowMovetip && Utils.getInstance.Level > 0) {
                this.Wzhcq_ShowMoveTargetTipTime -= dt;
                if (this.Wzhcq_ShowMoveTargetTipTime <= 0) {
                    this.ShowMoveTipAni();
                }
            }
        }
    }

    closeAutoTips() {
        if (Utils.getInstance.GameType != 6) {
            Utils.getInstance.MoveCount = 6;
        }

        this.Wzhcq_AutoTipsNode.active = false;
    }

    updateMove(movePostion: any) {
        if (this.Wzhcq_TargetMahjong) {
            let Wzhcq_key1 = JSON.parse(this.Wzhcq_MoveMahjong.LastGrid.key);
            let Wzhcq_key2 = JSON.parse(this.Wzhcq_TargetMahjong.LocalKey);

            // console.log("key1:", this.Wzhcq_MoveMahjong.LastGrid.key + "    _____key2:", this.Wzhcq_TargetMahjong.LocalKey);
            if (Wzhcq_key1.x == Wzhcq_key2.x) {
                if (JSON.parse(movePostion.key).y != JSON.parse(this.Wzhcq_TargetMahjong.LocalKey).y) {
                    this.clearColor();
                    this.Wzhcq_TargetMahjong.SetTipNodeVisible(false);
                }
            }
            else if (Wzhcq_key1.y == Wzhcq_key2.y) {
                if (JSON.parse(movePostion.key).x != JSON.parse(this.Wzhcq_TargetMahjong.LocalKey).x) {
                    this.clearColor();
                    this.Wzhcq_TargetMahjong.SetTipNodeVisible(false);
                }
            }
        }
    }

    onBtnAddTime() {
        AudioManager.instance.playAudioBtn_Click();
        this.Wzhcq_btn_addTime.stopAllActions();
        this.Wzhcq_btn_addTime.scale = 1;

        if (Object.keys(this.Wzhcq_MahjongList).length > 2) {
            let Wzhcq_GameType = Utils.getInstance.GameType;
            if (Wzhcq_GameType == 1) {
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, 120);
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "已加时2分钟！");
            }
            else {
                if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, 120);
                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "已加时2分钟！");
                }
                else {
                    let Wzhcq_PropAddTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropAddTime);
                    if (Wzhcq_PropAddTime > 0) {
                        Utils.getInstance.usePropAddTime += 1;
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropAddTime, Wzhcq_PropAddTime - 1);
                        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, 120);
                        this.changePropNum();
                        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "已加时2分钟！");
                    }
                    else {
                        if (this.Wzhcq_isclick) {
                            this.Wzhcq_isclick = false;
                        }
                        this.Wzhcq_game_isDownTime = false;
                        this.Wzhcq_isDownTime = false;
                        this.Wzhcq_ShuffleTipState = false;

                        let avtype = 8;
                        WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                            //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                            if (data == 1) {
                                //激励视频完整播放 需要做的奖励；
                                let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                                Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                                Utils.getInstance.VideoPropAddTime += 1;

                                Utils.getInstance.sjd_close_rewardav(avtype, true);

                                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, 120);
                                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "已加时2分钟！");
                                this.Wzhcq_isclick = true;

                                if (Utils.getInstance.GameType == 3) {
                                    Utils.getInstance.isEnergyLookVideo = 1;
                                }
                            }
                            else if (data == 2) {
                                wx.showToast({
                                    title: '暂时没有广告了,请稍后再试',
                                    icon: 'none',
                                });
                                if (Utils.getInstance.GameType == 5) {
                                    this.Wzhcq_game_isDownTime = true;
                                }
                                else if (Utils.getInstance.GameType == 6) {
                                    this.Wzhcq_game_isDownTime = true;
                                }
                                this.Wzhcq_isclick = true;
                            }
                            else if (data == 0) {
                                wx.showToast({
                                    title: '播放中途退出',
                                    icon: 'none',
                                });
                                if (Utils.getInstance.GameType == 5) {
                                    this.Wzhcq_game_isDownTime = true;
                                }
                                else if (Utils.getInstance.GameType == 6) {
                                    this.Wzhcq_game_isDownTime = true;
                                }
                                this.Wzhcq_isclick = true;

                                Utils.getInstance.sjd_close_rewardav(avtype, false);
                            }

                            this.Wzhcq_isDownTime = true;
                            this.Wzhcq_add_time = 30;
                            this.Wzhcq_ShuffleTipState = true;
                            this.resetShuffleTipData();
                        });
                    }
                }
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "当前牌局不需要加时");
        }
    }

    ShuffleTipAni() {
        this.IsShuffle();
        if (Utils.getInstance.GameType == 5 || Utils.getInstance.GameType == 6) {
            this.Wzhcq_ShuffleFinger.x = 254.5 + 20;
        }
        else {
            this.Wzhcq_ShuffleFinger.x = 169.5 + 20;
        }
        this.Wzhcq_ShuffleFinger.y = this.downBtnLayout.y + 120;

        let self = this;
        this.scheduleOnce(() => {
            this.Wzhcq_ShuffleFinger.active = true;

            if (Utils.getInstance.GameType == 5 || Utils.getInstance.GameType == 6) {
                cc.tween(self.Wzhcq_ShuffleFinger)
                    .repeatForever(cc.tween()
                        .to(1, { position: cc.v3(274.5, self.Wzhcq_ShuffleFinger.y + 10) })
                        .to(1, { position: cc.v3(274.5, self.Wzhcq_ShuffleFinger.y - 10) })
                    )
                    .start();
            }
            else {
                cc.tween(self.Wzhcq_ShuffleFinger)
                    .repeatForever(cc.tween()
                        .to(1, { position: cc.v3(189.5, self.Wzhcq_ShuffleFinger.y + 10) })
                        .to(1, { position: cc.v3(189.5, self.Wzhcq_ShuffleFinger.y - 10) })
                    )
                    .start();
            }


            cc.tween(self.Wzhcq_btn_ShuffleTilesNode)
                .repeatForever(cc.tween()
                    .to(1, { scale: 1.2 })
                    .to(1, { scale: 1 })
                )
                .start();
        }, 0.5);
    }

    hideGuide() {
        // if(Utils.getInstance.GameType != 1) {
        this.Wzhcq_finger.active = false;
        this.Wzhcq_layout.active = false;
        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
        }
        else {
            this.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
        }

        this.Wzhcq_finger.stopAllActions();
        this.Wzhcq_layout.stopAllActions();
        // }
    }

    GuideTipAni() {
        console.log('GuideTipAni===========');
        Utils.getInstance.IsGuideTip = true;
        let self = this;

        Utils.getInstance.autoState = false;

        if (self.Wzhcq_TipResult.length > 0) {
            self.Wzhcq_finger.stopAllActions();
            self.Wzhcq_layout.active = true;
            if (Utils.getInstance.GameType == 6) {
                self.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
            }
            else {
                self.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
            }

            self.Wzhcq_layout.stopAllActions();
            self.Wzhcq_layout.removeAllChildren();

            for (let m = 0; m < self.Wzhcq_TipResult.length; m++) {
                let Wzhcq_data = self.Wzhcq_TipResult[m];
                let Wzhcq_leftMoveGroup = Wzhcq_data.leftMoveGroup;
                let Wzhcq_rightMoveGroup = Wzhcq_data.rightMoveGroup;
                let Wzhcq_upMoveGroup = Wzhcq_data.upMoveGroup;
                let Wzhcq_downMoveGroup = Wzhcq_data.downMoveGroup;
                let Wzhcq_matchMahjong = Wzhcq_data.matchMahjong;

                let Wzhcq__self = Wzhcq_data.self;
                let Wzhcq_endPos = Wzhcq_data.endPos;
                if (Wzhcq__self.MahjongData.Pos.x == Wzhcq_endPos.x && Wzhcq__self.MahjongData.Pos.y == Wzhcq_endPos.y) {
                    if (self.Wzhcq_StartTipResult.length > 0) {
                        self.startTipResultFun();
                        break;
                    }
                    continue;
                }

                //protected CreateMahjong(data: MahjongTileData, pos: MahjongPos): MahjongTile {
                self.Wzhcq_GuideGridList = {};
                let Wzhcq_startPos: any;
                let Wzhcq_frist = true;
                if (Wzhcq_data.moveDir == 'left') {
                    let Wzhcq__index = Math.abs(Wzhcq__self.MahjongData.Pos.x - Wzhcq_endPos.x);
                    let Wzhcq_startNode: any;
                    for (let k in Wzhcq_leftMoveGroup) {
                        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_leftMoveGroup[k];

                        // let mahjong: MahjongTile = self.CreateMahjong(mahjongTile.GetMahjongData(), mahjongTile.GetMahjongData().GetPos());

                        let Wzhcq_PaiPrefab = cc.instantiate(self.Wzhcq_PaiPrefab);
                        let Wzhcq_node: cc.Node = new cc.Node();
                        Wzhcq_node.width = Wzhcq_PaiPrefab.width;
                        Wzhcq_node.height = Wzhcq_PaiPrefab.height;
                        let Wzhcq__data = {};
                        Wzhcq__data['Suit'] = Wzhcq_mahjongTile.GetMahjongData().Suit;
                        Wzhcq__data['Num'] = Wzhcq_mahjongTile.GetMahjongData().Num;
                        Wzhcq__data['Id'] = Wzhcq_mahjongTile.GetMahjongData().Id;
                        self.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
                        Wzhcq_PaiPrefab.getComponent('Pai').setData(Wzhcq__data, 150);

                        if (JSON.parse(Wzhcq__self.LocalKey).x == JSON.parse(Wzhcq_mahjongTile.LocalKey).x && JSON.parse(Wzhcq__self.LocalKey).y == JSON.parse(Wzhcq_mahjongTile.LocalKey).y) {
                            Wzhcq_startNode = Wzhcq_PaiPrefab;
                        }
                        let Wzhcq_endNode = self.Wzhcq_MahjongList[Wzhcq_matchMahjong.LocalKey];
                        Wzhcq_endNode.SetTipNodeVisible(true);

                        Wzhcq_PaiPrefab.position = Wzhcq_mahjongTile.node.position;
                        if (Wzhcq_frist && Wzhcq__self.MahjongData.Pos.x == Wzhcq_mahjongTile.GetMahjongData().GetPos().x && Wzhcq__self.MahjongData.Pos.y == Wzhcq_mahjongTile.GetMahjongData().GetPos().y) {
                            Wzhcq_startPos = Wzhcq_mahjongTile.node.position;
                            if (Utils.getInstance.GameType == 6) {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.tiaozhanDistance;
                            }
                            else {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.chuangguanDistance;
                            }

                            self.Wzhcq_finger.position = Wzhcq_startPos;
                            self.Wzhcq_finger.active = true;
                            Wzhcq_frist = false;
                        }
                    }

                    cc.tween(self.Wzhcq_layout)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(-Wzhcq__index * 70, 0) })
                                .call(() => {
                                    Wzhcq_startNode.opacity = 255;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(true);
                                })
                                .delay(1.5)
                                .call(() => {
                                    Wzhcq_startNode.opacity = 150;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(false);
                                    if (Utils.getInstance.GameType == 6) {
                                        self.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                                    }
                                    else {
                                        self.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                                    }

                                })
                        )
                        .start();

                    cc.tween(self.Wzhcq_finger)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(-Wzhcq__index * 70, 0) })
                                .delay(1.5)
                                .call(() => {
                                    self.Wzhcq_finger.position = Wzhcq_startPos;
                                })
                        )
                        .start();
                    break;
                }
                else if (Wzhcq_data.moveDir == 'down') {
                    let Wzhcq__index = Math.abs(Wzhcq__self.MahjongData.Pos.y - Wzhcq_endPos.y);
                    let Wzhcq_startNode: any;
                    for (let k in Wzhcq_downMoveGroup) {
                        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_downMoveGroup[k];

                        // let mahjong: MahjongTile = self.CreateMahjong(mahjongTile.GetMahjongData(), mahjongTile.GetMahjongData().GetPos());
                        let Wzhcq_PaiPrefab = cc.instantiate(self.Wzhcq_PaiPrefab);
                        let Wzhcq_node: cc.Node = new cc.Node();
                        Wzhcq_node.width = Wzhcq_PaiPrefab.width;
                        Wzhcq_node.height = Wzhcq_PaiPrefab.height;
                        let Wzhcq__data = {};
                        Wzhcq__data['Suit'] = Wzhcq_mahjongTile.GetMahjongData().Suit;
                        Wzhcq__data['Num'] = Wzhcq_mahjongTile.GetMahjongData().Num;
                        Wzhcq__data['Id'] = Wzhcq_mahjongTile.GetMahjongData().Id;
                        self.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
                        Wzhcq_PaiPrefab.getComponent('Pai').setData(Wzhcq__data, 150);

                        if (JSON.parse(Wzhcq__self.LocalKey).x == JSON.parse(Wzhcq_mahjongTile.LocalKey).x && JSON.parse(Wzhcq__self.LocalKey).y == JSON.parse(Wzhcq_mahjongTile.LocalKey).y) {
                            Wzhcq_startNode = Wzhcq_PaiPrefab;
                        }
                        let Wzhcq_endNode = self.Wzhcq_MahjongList[Wzhcq_matchMahjong.LocalKey];
                        Wzhcq_endNode.SetTipNodeVisible(true);

                        Wzhcq_PaiPrefab.position = Wzhcq_mahjongTile.node.position;
                        if (Wzhcq_frist && Wzhcq__self.MahjongData.Pos.x == Wzhcq_mahjongTile.GetMahjongData().GetPos().x && Wzhcq__self.MahjongData.Pos.y == Wzhcq_mahjongTile.GetMahjongData().GetPos().y) {
                            Wzhcq_startPos = Wzhcq_mahjongTile.node.position;
                            if (Utils.getInstance.GameType == 6) {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.tiaozhanDistance;
                            }
                            else {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.chuangguanDistance;
                            }
                            self.Wzhcq_finger.position = Wzhcq_startPos;
                            self.Wzhcq_finger.active = true;
                            Wzhcq_frist = false;
                        }
                    }

                    cc.tween(self.Wzhcq_layout)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(0, -Wzhcq__index * 86) })
                                .call(() => {
                                    Wzhcq_startNode.opacity = 255;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(true);
                                })
                                .delay(1.5)
                                .call(() => {
                                    Wzhcq_startNode.opacity = 150;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(false);
                                    if (Utils.getInstance.GameType == 6) {
                                        self.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                                    }
                                    else {
                                        self.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                                    }

                                })
                        )
                        .start();

                    cc.tween(self.Wzhcq_finger)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(0, -Wzhcq__index * 86) })
                                .delay(1.5)
                                .call(() => {
                                    self.Wzhcq_finger.position = Wzhcq_startPos;
                                })
                        )
                        .start();
                    break;
                }
                else if (Wzhcq_data.moveDir == 'right') {
                    let Wzhcq__index = Math.abs(Wzhcq__self.MahjongData.Pos.x - Wzhcq_endPos.x);
                    let Wzhcq_startNode: any;
                    for (let k in Wzhcq_rightMoveGroup) {
                        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_rightMoveGroup[k];

                        // let mahjong: MahjongTile = self.CreateMahjong(mahjongTile.GetMahjongData(), mahjongTile.GetMahjongData().GetPos());
                        let Wzhcq_PaiPrefab = cc.instantiate(this.Wzhcq_PaiPrefab);
                        let Wzhcq_node: cc.Node = new cc.Node();
                        Wzhcq_node.width = Wzhcq_PaiPrefab.width;
                        Wzhcq_node.height = Wzhcq_PaiPrefab.height;
                        let Wzhcq__data = {};
                        Wzhcq__data['Suit'] = Wzhcq_mahjongTile.GetMahjongData().Suit;
                        Wzhcq__data['Num'] = Wzhcq_mahjongTile.GetMahjongData().Num;
                        Wzhcq__data['Id'] = Wzhcq_mahjongTile.GetMahjongData().Id;
                        self.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
                        Wzhcq_PaiPrefab.getComponent('Pai').setData(Wzhcq__data, 150);

                        if (JSON.parse(Wzhcq__self.LocalKey).x == JSON.parse(Wzhcq_mahjongTile.LocalKey).x && JSON.parse(Wzhcq__self.LocalKey).y == JSON.parse(Wzhcq_mahjongTile.LocalKey).y) {
                            Wzhcq_startNode = Wzhcq_PaiPrefab;
                        }
                        let Wzhcq_endNode = self.Wzhcq_MahjongList[Wzhcq_matchMahjong.LocalKey];
                        Wzhcq_endNode.SetTipNodeVisible(true);

                        Wzhcq_PaiPrefab.position = Wzhcq_mahjongTile.node.position;
                        if (Wzhcq_frist && Wzhcq__self.MahjongData.Pos.x == Wzhcq_mahjongTile.GetMahjongData().GetPos().x && Wzhcq__self.MahjongData.Pos.y == Wzhcq_mahjongTile.GetMahjongData().GetPos().y) {
                            Wzhcq_startPos = Wzhcq_mahjongTile.node.position;
                            if (Utils.getInstance.GameType == 6) {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.tiaozhanDistance;
                            }
                            else {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.chuangguanDistance;
                            }
                            self.Wzhcq_finger.position = Wzhcq_startPos;
                            self.Wzhcq_finger.active = true;
                            Wzhcq_frist = false;
                        }
                    }

                    cc.tween(self.Wzhcq_layout)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(Wzhcq__index * 70, 0) })
                                .call(() => {
                                    Wzhcq_startNode.opacity = 255;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(true);
                                })
                                .delay(1.5)
                                .call(() => {
                                    Wzhcq_startNode.opacity = 150;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(false);
                                    if (Utils.getInstance.GameType == 6) {
                                        self.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                                    }
                                    else {
                                        self.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                                    }

                                })
                        )
                        .start();

                    cc.tween(self.Wzhcq_finger)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(Wzhcq__index * 70, 0) })
                                .delay(1.5)
                                .call(() => {
                                    self.Wzhcq_finger.position = Wzhcq_startPos;
                                })
                        )
                        .start();
                    break;
                }
                else if (Wzhcq_data.moveDir == 'up') {
                    let Wzhcq__index = Math.abs(Wzhcq__self.MahjongData.Pos.y - Wzhcq_endPos.y);
                    let Wzhcq_startNode: any;
                    for (let k in Wzhcq_upMoveGroup) {
                        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_upMoveGroup[k];

                        // let mahjong: MahjongTile = self.CreateMahjong(mahjongTile.GetMahjongData(), mahjongTile.GetMahjongData().GetPos());
                        let Wzhcq_PaiPrefab = cc.instantiate(self.Wzhcq_PaiPrefab);
                        let Wzhcq_node: cc.Node = new cc.Node();
                        Wzhcq_node.width = Wzhcq_PaiPrefab.width;
                        Wzhcq_node.height = Wzhcq_PaiPrefab.height;
                        let Wzhcq__data = {};
                        Wzhcq__data['Suit'] = Wzhcq_mahjongTile.GetMahjongData().Suit;
                        Wzhcq__data['Num'] = Wzhcq_mahjongTile.GetMahjongData().Num;
                        Wzhcq__data['Id'] = Wzhcq_mahjongTile.GetMahjongData().Id;
                        self.Wzhcq_layout.addChild(Wzhcq_PaiPrefab);
                        Wzhcq_PaiPrefab.getComponent('Pai').setData(Wzhcq__data, 150);

                        if (JSON.parse(Wzhcq__self.LocalKey).x == JSON.parse(Wzhcq_mahjongTile.LocalKey).x && JSON.parse(Wzhcq__self.LocalKey).y == JSON.parse(Wzhcq_mahjongTile.LocalKey).y) {
                            Wzhcq_startNode = Wzhcq_PaiPrefab;
                        }
                        let Wzhcq_endNode = self.Wzhcq_MahjongList[Wzhcq_matchMahjong.LocalKey];
                        Wzhcq_endNode.SetTipNodeVisible(true);

                        Wzhcq_PaiPrefab.position = Wzhcq_mahjongTile.node.position;
                        if (Wzhcq_frist && Wzhcq__self.MahjongData.Pos.x == Wzhcq_mahjongTile.GetMahjongData().GetPos().x && Wzhcq__self.MahjongData.Pos.y == Wzhcq_mahjongTile.GetMahjongData().GetPos().y) {
                            Wzhcq_startPos = Wzhcq_mahjongTile.node.position;
                            if (Utils.getInstance.GameType == 6) {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.tiaozhanDistance;
                            }
                            else {
                                Wzhcq_startPos.y = Wzhcq_mahjongTile.node.position.y + this.chuangguanDistance;
                            }
                            self.Wzhcq_finger.position = Wzhcq_startPos;
                            self.Wzhcq_finger.active = true;
                            Wzhcq_frist = false;
                        }
                    }

                    cc.tween(self.Wzhcq_layout)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(0, Wzhcq__index * 86) })
                                .call(() => {
                                    Wzhcq_startNode.opacity = 255;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(true);
                                })
                                .delay(1.5)
                                .call(() => {
                                    Wzhcq_startNode.opacity = 150;
                                    Wzhcq_startNode.getComponent('Pai').SetTipNodeVisible(false);
                                    if (Utils.getInstance.GameType == 6) {
                                        self.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
                                    }
                                    else {
                                        self.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
                                    }

                                })
                        )
                        .start();

                    cc.tween(self.Wzhcq_finger)
                        .repeatForever(
                            cc.tween()
                                .delay(1.5)
                                .by(1, { position: cc.v3(0, Wzhcq__index * 86) })
                                .delay(1.5)
                                .call(() => {
                                    self.Wzhcq_finger.position = Wzhcq_startPos;
                                })
                        )
                        .start();
                    break;
                }
            }
        }
        else {
            self.startTipResultFun();
        }
    }

    startTipResultFun() {
        let self = this;
        let Wzhcq_result = true;
        for (let index = 0; index < self.Wzhcq_StartTipResult.length; index++) {
            let Wzhcq_array = self.Wzhcq_StartTipResult[index];
            let Wzhcq_startPos: any;
            if (Wzhcq_result) {
                Wzhcq_result = false;
                Wzhcq_startPos = Wzhcq_array[0].node.position;
                if (Utils.getInstance.GameType == 6) {
                    Wzhcq_startPos.y = Wzhcq_array[0].node.position.y + this.tiaozhanDistance;
                }
                else {
                    Wzhcq_startPos.y = Wzhcq_array[0].node.position.y + this.chuangguanDistance;
                }

                for (let i = 0; i < Wzhcq_array.length; i++) {
                    let Wzhcq__mahjong = Wzhcq_array[i];
                    Wzhcq__mahjong.blink();
                }
                self.Wzhcq_layout.active = true;

                self.Wzhcq_finger.position = Wzhcq_startPos;
                self.Wzhcq_finger.active = true;
                cc.tween(self.Wzhcq_finger)
                    .repeatForever(
                        cc.tween()
                            .by(0.5, { position: cc.v3(0, -10) })
                            .call(() => {
                                self.Wzhcq_finger.position = Wzhcq_startPos;
                            })
                    )
                    .start();
            }
        }
    }

    public ShowMoveTipAni() {
        //todo显示动画
        this.Wzhcq_IsShowMovetip = true;

        console.log('显示动画');

        let Wzhcq_startPos = cc.v2(this.Wzhcq_MoveMahjong.node.x, this.Wzhcq_MoveMahjong.node.y);
        let Wzhcq_endPos = cc.v2(this.Wzhcq_TargetMahjong.node.x, this.Wzhcq_TargetMahjong.node.y);

        this.Wzhcq_TargetMahjong.SetTipNodeVisible(true);
        this.Wzhcq_TargetMahjong.blink();

        let Wzhcq_key1 = JSON.parse(this.Wzhcq_MoveMahjong.LastGrid.key);
        let Wzhcq_key2 = JSON.parse(this.Wzhcq_TargetMahjong.LocalKey);

        let Wzhcq_array = [];
        if (Wzhcq_key1.x == Wzhcq_key2.x) {
            let Wzhcq_min = Math.min(Wzhcq_key1.y, Wzhcq_key2.y);
            let Wzhcq_max = Math.max(Wzhcq_key1.y, Wzhcq_key2.y);

            for (let y = (Wzhcq_min + 1); y < Wzhcq_max; y++) {
                let Wzhcq_obj = {};
                Wzhcq_obj["x"] = Wzhcq_key1.x;
                Wzhcq_obj["y"] = y;
                Wzhcq_array.push(Wzhcq_obj);
            }
        }
        else if (Wzhcq_key1.y == Wzhcq_key2.y) {
            let Wzhcq_min = Math.min(Wzhcq_key1.x, Wzhcq_key2.x);
            let Wzhcq_max = Math.max(Wzhcq_key1.x, Wzhcq_key2.x);

            for (let x = (Wzhcq_min + 1); x < Wzhcq_max; x++) {
                let Wzhcq_obj = {};
                Wzhcq_obj["x"] = x;
                Wzhcq_obj["y"] = Wzhcq_key1.y;
                Wzhcq_array.push(Wzhcq_obj);
            }
        }
        for (let index = 0; index < Wzhcq_array.length; index++) {
            let Wzhcq_key = Wzhcq_array[index];
            if (Utils.getInstance.GameType == 6) {
                this.Wzhcq_GridList[JSON.stringify(Wzhcq_key)].getComponent(Grid).setWaterColor();
            }
            else {
                this.Wzhcq_GridList[JSON.stringify(Wzhcq_key)].getComponent(Grid).setColor();
            }
        }
    }

    clearColor() {
        for (let key in this.Wzhcq_GridList) {
            if (Utils.getInstance.GameType == 6) {
                this.Wzhcq_GridList[key].getComponent(Grid).clearWaterColor();
            }
            else {
                this.Wzhcq_GridList[key].getComponent(Grid).clearColor();
            }
        }
    }

    updateScore(Wzhcq_time: any) {
        if (Wzhcq_time >= 25 && Wzhcq_time < 30) {
            //绿色第一个刻度线
            this.Wzhcq__index = 5;
            this.Wzhcq_double_hit_state = 1;
        }
        else if (Wzhcq_time <= 25 && Wzhcq_time > 20) {
            //绿色血槽
            this.Wzhcq__index = 4;
            this.Wzhcq_double_hit_state = 0;
        }
        else if (Wzhcq_time <= 20 && Wzhcq_time > 10) {
            //黄色血槽
            this.Wzhcq__index = 3;
            this.Wzhcq_double_hit_state = 0;
        }
        else if (Wzhcq_time <= 10 && Wzhcq_time > 0) {
            //红色血槽
            this.Wzhcq__index = 2;
            this.Wzhcq_double_hit_state = 0;
        }
        else if (Wzhcq_time <= 0) {
            //空槽
            this.Wzhcq__index = 1;
            this.Wzhcq_double_hit_state = 0;
        }
    }

    @property(cc.Prefab)
    ropePrefab: cc.Prefab = null;

    createRopeNode(temp_node: any, type: any, amplitude: any) {
        if (void 0 === amplitude) {
            amplitude = 20;
        }
        var node = cc.instantiate(this.ropePrefab);
        this.node.addChild(node, cc.macro.MAX_ZINDEX);
        var script = node.getComponent("RopeTexture");
        script.type = type;
        script.amplitude = amplitude;
        script.updateEndPoint(0, 0);
        var position = this.convertToNodeSpaceAR(temp_node, node.parent);
        node.position = position;
        return script;
    };

    convertToNodeSpaceAR(node: any, parent: any) {
        var position = node.parent.convertToWorldSpaceAR(node.position);
        return parent.convertToNodeSpaceAR(position);
    };

    addSegment(cardmahjong: any, cardmahjong2: any) {
        //剩余麻将数
        let mahjongNum = Object.keys(this.Wzhcq_MahjongList).length / 2;
        let segmentNum = Utils.getInstance.segmentCount / 2;

        this.segmentIdx += 1;
        let index = Math.floor((this.segmentIdx - 1) / 5);

        let node = cc.instantiate(this.segmentPrefab);
        node.parent = this.segmentDataArray[index];
        node.getComponent("segment").initData(index, this.segmentIdx);

        let RopeNode = this.createRopeNode(cardmahjong.node, index, undefined);
        let RopeNode2 = this.createRopeNode(cardmahjong2.node, index, undefined);
        this.flyRopeNode.x = this.flyRopePos + 37 * index;

        var position = this.convertToNodeSpaceAR(this.flyRopeNode, RopeNode.node);
        var position2 = this.convertToNodeSpaceAR(this.flyRopeNode, RopeNode2.node);

        var array = [
            cc.v3(position.x - 20, position.y, 0),
            cc.v3(position.x, position.y + 20, 0),
            cc.v3(position.x, position.y - 20, 0),
            cc.v3(position.x + 10, position.y + 20, 0),
            cc.v3(position.x + 10, position.y - 20, 0),
            cc.v3(position.x + 20, position.y + 20, 0),
            cc.v3(position.x + 20, position.y - 20, 0)
        ];
        var array2 = [
            cc.v3(position2.x - 20, position2.y, 0),
            cc.v3(position2.x, position2.y + 20, 0),
            cc.v3(position2.x, position2.y - 20, 0),
            cc.v3(position2.x + 10, position2.y + 20, 0),
            cc.v3(position2.x + 10, position2.y - 20, 0),
            cc.v3(position2.x + 20, position2.y + 20, 0),
            cc.v3(position2.x + 20, position2.y - 20, 0)
        ];
        this.handleRopeAnimation(array, RopeNode);
        this.handleRopeAnimation(array2, RopeNode2);

        node.getComponent("segment").moveStart(() => {
            // AudioManager.instance.playAudiomerge_1();

            RopeNode.destroyByReset();
            RopeNode2.destroyByReset();
        })

        this.segmentNum.getComponent(cc.Label).string = Math.floor((this.segmentIdx / segmentNum) * 100) + "%";
    }

    handleRopeAnimation(e, t) {
        for (
            var o = function o(_o2) {
                cc.tween(t.node)
                    .delay(0.05 * _o2)
                    .call(function () {
                        t.moveToTarget(e[_o2].x, e[_o2].y, 0.05);
                    })
                    .start();
            },
            n = 0; n < e.length; n++
        ) {
            o(n);
        }
    };

    Wzhcq_remove_Success(event: any) {

        this.Wzhcq_resetGuideData(undefined);
        this.getResultData();
        this.resetShuffleTipData();
        this.hideShuffleTip();
        this.Wzhcq_MoveMahjongHasTarget = false;

        Utils.getInstance.autoState = true;

        if (Utils.getInstance.GameType != 6) {
            if (Utils.getInstance.MoveCount >= Utils.getInstance.MaxMoveCount) {
                this.Wzhcq_AutoTipsNode.active = false;
            }
        }

        let scoreNum = 0;
        let cardmahjong = event.target;
        let cardmahjong2 = event.self;

        if(Utils.getInstance.GameType != 6) {
            this.addSegment(cardmahjong, cardmahjong2);
        }

        if (Utils.getInstance.GameType != 6) {
            if (this.Wzhcq_double_hit_state) {
                this.Wzhcq_double_hit_count += 1;
            }
            else {
                this.Wzhcq_double_hit_count = 1;
            }

            if (this.Wzhcq_double_hit_count > 1) {
                //连击奖励得分 + 消除得分
                let double_score = (cfgScore[this.Wzhcq_gameTypeIndex][this.Wzhcq__index] / 2) * this.Wzhcq_double_hit_count;
                let score = cfgScore[this.Wzhcq_gameTypeIndex][this.Wzhcq__index] * 2;
                this.Wzhcq_curScore += double_score + score;
                this.Wzhcq_LianJiCount += 1;

                if (this.Wzhcq_LianJiCount > Utils.getInstance.maximumEliminate) {
                    Utils.getInstance.maximumEliminate = this.Wzhcq_LianJiCount + 1;
                }

                if (Utils.getInstance.GameType == 5) {
                    // this.DoubleAddScore2(double_score + score, 1, cc.v3(100, -450));
                }
                else if (Utils.getInstance.GameType == 1 || Utils.getInstance.GameType == 2 ||
                    Utils.getInstance.GameType == 3 ||
                    Utils.getInstance.GameType == 4 ||
                    Utils.getInstance.GameType == 7) {
                    // this.DoubleAddScore2(double_score + score, 1, cc.v3(100, -450));
                }
                // this.addScore(score, 0, Wzhcq_LocalPos);

                this.Wzhcq_cur_RankScore += this.Wzhcq_double_hit_count;
                scoreNum = double_score + score;
                this.playAnim2(cardmahjong, cardmahjong2, this.Wzhcq_double_hit_count);
            }
            else {
                //消除得分
                let Wzhcq_score = cfgScore[this.Wzhcq_gameTypeIndex][this.Wzhcq__index] * 2;
                this.Wzhcq_curScore += Wzhcq_score;
                this.Wzhcq_LianJiCount = 0;

                // this.addScore(Wzhcq_score, 0, Wzhcq_LocalPos);
                // this.DoubleAddScore2(Wzhcq_score, 0, cc.v3(100, -450));
                scoreNum = Wzhcq_score;
            }

            this.Wzhcq_cur_score_label.string = Math.ceil(this.Wzhcq_curScore) + '';
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurScore, Math.ceil(this.Wzhcq_curScore));

            Utils.getInstance.highestIntegral = Math.ceil(this.Wzhcq_curScore);

            // this.Wzhcq_cur_rank_label.string = Math.ceil(this.Wzhcq_cur_RankScore) + '';
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurRankScore, Math.ceil(this.Wzhcq_cur_RankScore));

            this.updateTargetBox();
        }

        if (Utils.getInstance.GameType != 6) {
            this.createConSteriliPlus(scoreNum);
        }

        this.Wzhcq_isDownTime = true;
        this.Wzhcq_add_time = 30;
        this.Wzhcq_act_time = 30;
        this.Wzhcq_sub_time = this.Wzhcq_act_time;
        this.Wzhcq_timeBar.fillRange = 1;

        if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_game_isDownTime = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_game_isDownTime = true;
        }

        Utils.getInstance.XiaoChuCount += 1;

        if (Utils.getInstance.GameType == 1) {
            this.Wzhcq_stepIndex++;
        }
        this.guideMoveStep();

        this.saveGameData();

        this.updateZhaDan(cardmahjong, cardmahjong2, 1);
        // this.shandianPlay(cardmahjong, cardmahjong2);

        let self = this;
        this.scheduleOnce(() => {
            if (Utils.getInstance.GameType == 6) {
                self.updateMap();
            }
        }, 0.3);
    }

    createConSteriliPlus(scoreNum: any) {
        this.conSteriliPlusNode = cc.instantiate(this.conSteriliPlusPrefab);
        this.conSteriliPlusNode.parent = this.Wzhcq_DoubleScoreNode2;
        this.conSteriliPlusNode.getComponent(conSteriliPlus).show(this.Wzhcq_double_hit_count, scoreNum);
        this.conSteriliPlusNode.position = cc.v3(0, 0);
    }

    updateZhaDan(mahjong: any, mahjong2: any, bool: any) {
        if (Utils.getInstance.GameType == 6) {
            if (50 == mahjong.MahjongData.Id) {
                this.mahjongTouchState = false;

                this.zhadanMahiong(mahjong, mahjong2, bool);
            }
        }
        else {
            if (50 == mahjong.MahjongData.Id) {
                this.mahjongTouchState = false;

                this.zhadanMahiong(mahjong, mahjong2, bool);
            }
        }
    }

    zhadanMahiong(mahjong: any, mahjong2: any, bool: any) {
        let Wzhcq_array = [];
        this.UpdateCheckMap();

        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            Wzhcq_array.push(this.Wzhcq_MahjongList[Wzhcq_key]);
        };

        if (Wzhcq_array.length > 0) {
            let Wzhcq_randomIndex = Math.floor(Math.random() * Wzhcq_array.length);
            while (Wzhcq_array[Wzhcq_randomIndex].MahjongData.Id == 50 && (Wzhcq_array[Wzhcq_randomIndex].MahjongData.Pos == mahjong.MahjongData.Pos || Wzhcq_array[Wzhcq_randomIndex].MahjongData.Pos == mahjong2.MahjongData.Pos)) {
                console.log("在随机一次===========");
                Wzhcq_randomIndex = Math.floor(Math.random() * Wzhcq_array.length);
            }
            this.checkZhadan(Wzhcq_randomIndex, Wzhcq_array, true, mahjong, mahjong2, bool);
            this.saveGameData();
        }
        else {
            this.Wzhcq_chenkGameOver(true, () => { });
        }
    }

    playAnim(Wzhcq_node: any, Wzhcq_name: any, Wzhcq_bool: any) {
        if (Wzhcq_bool === undefined) {
            Wzhcq_bool = 0;
        }

        return Utils.getInstance.playWithNode(Wzhcq_node, Wzhcq_name, false, Wzhcq_bool);
    }

    shandianPlay(cardmahjong: any, cardmahjong2: any) {
        if (cardmahjong.node.x == cardmahjong2.node.x) {
            console.log("竖");
            let pos = cc.v2(cardmahjong.node.x - cardmahjong2.node.x, cardmahjong.node.y - cardmahjong2.node.y)
            let dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
            let scale = dis / this.shandianAni.width;
            if (scale < 0.3) {
                scale = 0.5;
            }
            this.shandianAni.scale = scale;
            this.shandianAni.angle = 90;
        }
        else if (cardmahjong.node.y == cardmahjong2.node.y) {
            console.log("横");
            let pos = cc.v2(cardmahjong.node.x - cardmahjong2.node.x, cardmahjong.node.y - cardmahjong2.node.y)
            let dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
            let scale = dis / this.shandianAni.width;
            if (scale < 0.3) {
                scale = 0.5;
            }
            this.shandianAni.scale = scale;
            this.shandianAni.angle = 0;
        }

        if (Utils.getInstance.GameType == 6) {
            this.shandianAni.position = cc.v3((cardmahjong.node.x + cardmahjong2.node.x) / 2, (cardmahjong.node.y + this.tiaozhanDistance + cardmahjong2.node.y + this.tiaozhanDistance) / 2);
        }
        else {
            this.shandianAni.position = cc.v3((cardmahjong.node.x + cardmahjong2.node.x) / 2, (cardmahjong.node.y + this.chuangguanDistance + cardmahjong2.node.y + this.chuangguanDistance) / 2);
        }

        AudioManager.instance.playAudioShanDian();
        this.shandianAni.active = true;
        this.playAnim(this.shandianAni, "shandian", 1);
    }

    checkZhadan(Wzhcq_randomIndex: any, Wzhcq_array: any, bool: any, mahjong: any, mahjong2: any, flag: any) {
        let self = this;
        let Wzhcq_data = Wzhcq_array[Wzhcq_randomIndex];
        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            let temp_mahjong = this.Wzhcq_MahjongList[Wzhcq_key];
            if ((Wzhcq_data.MahjongData.Pos != temp_mahjong.MahjongData.Pos) && (Wzhcq_data.MahjongData.Suit == temp_mahjong.MahjongData.Suit && Wzhcq_data.MahjongData.Num == temp_mahjong.MahjongData.Num)) {

                temp_mahjong.SetTipNodeVisible(true);
                Wzhcq_data.SetTipNodeVisible(true);
                temp_mahjong.blink();
                Wzhcq_data.blink();
                temp_mahjong.SetTsVisible(true);
                Wzhcq_data.SetTsVisible(true);

                let pos = temp_mahjong.node.position;
                let pos2 = Wzhcq_data.node.position;

                if (Utils.getInstance.GameType == 6) {
                    pos.y = temp_mahjong.node.position.y + this.tiaozhanDistance;
                    pos2.y = Wzhcq_data.node.position.y + this.tiaozhanDistance;
                }
                else {
                    pos.y = temp_mahjong.node.position.y + this.chuangguanDistance;
                    pos2.y = Wzhcq_data.node.position.y + this.chuangguanDistance;
                }

                if (flag) {
                    this.shandianPlay(mahjong, mahjong2);
                }
                self.removeTween(mahjong, 1, pos, pos2, Wzhcq_data, temp_mahjong);

                this.scheduleOnce(() => {

                    let data: RemoveData = {
                        self: Wzhcq_data,
                        target: temp_mahjong,
                    };

                    self.EventMgr.emit(self.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, data);

                    // console.error("Wzhcq_key:", Wzhcq_data.GetPosKey());
                    // console.error("Wzhcq_key:", Wzhcq_key);

                    // for (let key in self.Wzhcq_MahjongList) {
                    //     let Wzhcq_element = self.Wzhcq_MahjongList[key];
                    //     Wzhcq_element.SetTipNodeVisible(false);
                    // }

                    for (let Wzhcq_key2 in this.Wzhcq_MahjongList) {
                        self.Wzhcq_MahjongList[Wzhcq_key2].ResetAllMoveGroup();
                    }

                    self.scheduleOnce(() => {
                        if (Utils.getInstance.GameType == 6) {
                            self.updateMap();
                        }
                        self.mahjongTouchState = true;
                        // self.updateZhaDan(temp_mahjong, Wzhcq_data, 0);
                    }, 0.5);
                }, 1.2);

                break;
            }
        }
    }

    removeTween(mahjong: any, scale: any, pos: any, pos2: any, Wzhcq_data: any, temp_mahjong: any) {
        let old_pb = cc.instantiate(this.Wzhcq_PbMahjong);
        let old_node: cc.Node = new cc.Node();
        old_node.width = old_pb.width * scale;
        old_node.height = old_pb.height * scale;
        let old_mahjongTile: MahjongTile = old_pb.getComponent('MahjongTile');
        old_mahjongTile.InitMahjongData(mahjong.MahjongData, this);
        old_mahjongTile.node.position = cc.v3(-300, 0);
        this.node.addChild(old_pb);
        old_mahjongTile.UpdateView();
        old_pb.scale = scale;

        cc.tween(old_mahjongTile.node)
            .to(0.4, { position: cc.v3(-35, 0, 0) })
            .delay(0.2)
            .to(0.6, { position: pos })
            .call(() => {
                old_mahjongTile.node.removeFromParent();
            })
            .start();

        let cur_pb = cc.instantiate(this.Wzhcq_PbMahjong);
        let cur_node: cc.Node = new cc.Node();
        cur_node.width = cur_pb.width * scale;
        cur_node.height = cur_pb.height * scale;
        let cur_mahjongTile: MahjongTile = cur_pb.getComponent('MahjongTile');
        cur_mahjongTile.InitMahjongData(mahjong.MahjongData, this);
        cur_mahjongTile.node.position = cc.v3(300, 0);
        this.node.addChild(cur_pb);
        cur_mahjongTile.UpdateView();
        cur_pb.scale = scale;

        let self = this;
        cc.tween(cur_mahjongTile.node)
            .to(0.4, { position: cc.v3(35, 0, 0) })
            .call(() => {

            })
            .delay(0.2)
            .to(0.6, { position: pos2 })
            .call(() => {
                AudioManager.instance.playAudioBaoZha();
                cur_mahjongTile.node.removeFromParent();

                delete self.Wzhcq_MahjongList[temp_mahjong.GetPosKey()];
                delete self.Wzhcq_MahjongList[JSON.stringify(temp_mahjong.MahjongData.GetPos())];
                temp_mahjong.Remove();

                delete self.Wzhcq_MahjongList[Wzhcq_data.GetPosKey()];
                delete self.Wzhcq_MahjongList[JSON.stringify(Wzhcq_data.MahjongData.GetPos())];
                Wzhcq_data.Remove();

                self.UpdateCheckMap();
                self.Wzhcq_chenkGameOver(true, () => { });
            })
            .start();
    }

    saveGameData() {
        if (Utils.getInstance.GameType != 1) {
            if (Utils.getInstance.GameType != 6) {
                let Wzhcq_Storage_MahjongList = {};
                for (let key in this.Wzhcq_MahjongList) {
                    const Wzhcq__MahjongData = this.Wzhcq_MahjongList[key].MahjongData;
                    Wzhcq_Storage_MahjongList[key] = Wzhcq__MahjongData;
                }

                // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, Wzhcq_Storage_MahjongList);
            }
            else {
                let Wzhcq_Storage_MahjongList = {};
                for (let index in this.Wzhcq_MahjongListObj) {
                    let Wzhcq_MahjongList = this.Wzhcq_MahjongListObj[index];
                    let Wzhcq_obj = {};
                    for (let key in Wzhcq_MahjongList) {
                        const Wzhcq__MahjongData = Wzhcq_MahjongList[key].MahjongData;
                        Wzhcq_obj[JSON.stringify(Wzhcq__MahjongData.Pos)] = Wzhcq__MahjongData;
                    }
                    Wzhcq_Storage_MahjongList[index] = Wzhcq_obj;
                }
                // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, Wzhcq_Storage_MahjongList);
            }

            // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_rankIndex, this.Wzhcq_rankIndex);
            // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage___Index, this.Wzhcq___Index);

            // let Wzhcq_CurTime = Utils.getInstance.getCurTime();
            // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_StorageDataDay, Wzhcq_CurTime);

            // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_StorageData, 1);
        }
    }

    updateTargetBox() {
        if (this.Wzhcq_rankIndex > 3) {
            this.Wzhcq_cur_score_progress.progress = 1;
        }
        else {
            if (this.Wzhcq_curScore >= cfgRankScore[this.Wzhcq_rankIndex][4].score) {
                if (this.Wzhcq_rankIndex < 3) {
                    this.updateTween();

                    this.Wzhcq_cur_RankScore += cfgRankScore[this.Wzhcq_rankIndex][this.Wzhcq___Index].target;
                    this.Wzhcq_rankIndex += 1;
                    this.Wzhcq___Index = 0;
                    // console.error("updateTargetBox1=================");
                }
                else {
                    if (this.Wzhcq___Index == 4) {
                        this.updateTween();

                        this.Wzhcq_cur_RankScore += cfgRankScore[this.Wzhcq_rankIndex][this.Wzhcq___Index].target;
                        this.Wzhcq_rankIndex += 1;
                        // console.error("updateTargetBox2=================");
                    }
                }
            }
            else {
                if (this.Wzhcq_curScore >= cfgRankScore[this.Wzhcq_rankIndex][this.Wzhcq___Index].score) {
                    this.updateTween();

                    this.Wzhcq_cur_RankScore += cfgRankScore[this.Wzhcq_rankIndex][this.Wzhcq___Index].target;
                    this.Wzhcq___Index += 1;
                    // console.error("updateTargetBox3=================");
                }
            }
        }
        for (let i = 0; i < this.Wzhcq_target_label.length; i++) {
            const Wzhcq_label = this.Wzhcq_target_label[i];
            if (this.Wzhcq_rankIndex <= 3) {
                Wzhcq_label.string = '+' + cfgRankScore[this.Wzhcq_rankIndex][i].target;
            }
        }

        if (this.Wzhcq_rankIndex <= 3) {
            if (this.Wzhcq_rankIndex > 1) {
                if (this.Wzhcq_rankIndex > 2) {
                    this.Wzhcq_bar.color = cc.color(255, 0, 0);
                }
                else {
                    this.Wzhcq_bar.color = cc.color(0, 255, 0);
                }
                this.Wzhcq_cur_score_progress.progress = (this.Wzhcq_curScore - cfgRankScore[this.Wzhcq_rankIndex - 1][4].score) / (cfgRankScore[this.Wzhcq_rankIndex][4].score - cfgRankScore[this.Wzhcq_rankIndex - 1][4].score);
            }
            else {
                this.Wzhcq_bar.color = cc.color(255, 255, 0);
                this.Wzhcq_cur_score_progress.progress = this.Wzhcq_curScore / cfgRankScore[this.Wzhcq_rankIndex][4].score;
            }
        }

        this.resetTargetBox();
    }

    updateTween() {
        let self = this;
        let targetEndPos = cc.v3(-130, 39);

        let target = cc.instantiate(this.targetPrefab);
        target.parent = this.Wzhcq_target_Node[this.Wzhcq___Index].parent;
        target.position = this.Wzhcq_target_Node[this.Wzhcq___Index].position;
        target.getChildByName("num").getComponent(cc.Label).string = "+" + cfgRankScore[this.Wzhcq_rankIndex][this.Wzhcq___Index].target;

        cc.tween(target)
            .to(0.5, { position: targetEndPos })
            .call(() => {
                target.removeFromParent();
                if (Utils.getInstance.GameType > 1) {
                    self.Wzhcq_cur_rank_label.string = Math.ceil(self.Wzhcq_cur_RankScore) + '';
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurRankScore, Math.ceil(self.Wzhcq_cur_RankScore));

                    Utils.getInstance.highestScore = Math.ceil(self.Wzhcq_cur_RankScore);
                }
            })
            .start();
    }

    resetTargetBox() {
        for (let i = 0; i < this.Wzhcq_target_Node.length; i++) {
            let Wzhcq_node = this.Wzhcq_target_Node[i];
            if (this.Wzhcq_rankIndex <= 3) {
                if (i < this.Wzhcq___Index) {
                    Wzhcq_node.active = false;
                }
                else {
                    Wzhcq_node.active = true;
                }
            }
            else {
                Wzhcq_node.active = false;
            }
        }
    }

    Wzhcq_clearData() {
        this.resetTargetBox();
        this.Wzhcq_isDownTime = false;
        this.Wzhcq_add_time = 30;
        this.Wzhcq_act_time = 30;
        this.Wzhcq_sub_time = this.Wzhcq_act_time;
        this.Wzhcq_timeBar.fillRange = 1;
    }

    protected onLoad(): void {
        this.Wzhcq_layout = this.Wzhcq_MoveMahjongNode.getChildByName('layout');
        this.Wzhcq_finger = this.Wzhcq_MoveMahjongNode.getChildByName('finger');

        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_WARN_POPUP, this.Wzhcq_Warn_Popup, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSICSTATE, this.Wzhcq_updateMusic, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS, this.Wzhcq_gameSuccess, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_FAIL, this.Wzhcq_gameFail, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_REVIVE, this.Wzhcq_ShuffleTiles, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, this.Wzhcq_remove_Success, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_RESTARTGAME, this.Wzhcq_RestartGame, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_PROP, this.Wzhcq_gameProp, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROP, this.Wzhcq_updatePropState, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEMASK, this.Wzhcq_shuffleMask, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_OVER, this.Wzhcq_gameOver, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_AUTHOR, this.Wzhcq_author, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_ENERGY, this.Wzhcq_createEnergy, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, this.Wzhcq_update_downTime, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSE_PAUSE, this.Wzhcq_closePause, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REPORT_RESULT, this.Wzhcq_report_result, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RECOMMEND, this.Wzhcq_createRecommend, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHECK_GAMEOVER, this.Wzhcq_chenkGameOver, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, this.Wzhcq_gameTips, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEEVENT, this.shuffleEvent, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, this.changePropNum, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_WALLTOWEREND, this.wallTowerEnd, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, this.createPaintBoard, this);

        cc.macro.ENABLE_MULTI_TOUCH = false;

        cc.game.on(
            cc.game.EVENT_HIDE,
            function () {
                console.log('游戏进入后台');
            },
            this
        );
        cc.game.on(
            cc.game.EVENT_SHOW,
            function () {
                console.log('重新返回游戏');
            },
            this
        );

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            let Wzhcq_winSize = wx.getSystemInfoSync();
            // console.error("Wzhcq_winSize:", Wzhcq_winSize);
            this.Wzhcq_topNode.getComponent(cc.Widget).top = Wzhcq_winSize.safeArea.top;

            let view = cc.view.getFrameSize();
            if (view.height / view.width < 1.7) {
                this.node.getComponent(cc.Canvas).fitWidth = true;
                this.node.getComponent(cc.Canvas).fitHeight = true;
            }
            else {
                this.node.getComponent(cc.Canvas).fitWidth = true;
                this.node.getComponent(cc.Canvas).fitHeight = false;
            }

            if (!WxPlatform.getInstance.rewardVideoState) {
                WxPlatform.getInstance.rewardVideoState = true;
                WxPlatform.getInstance.createRewardVideo();
            }
        }

        // if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //     if (Utils.getInstance.accountInfo.miniProgram.envVersion == "release") {
        //         this.Wzhcq_btn_TipsNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[0];
        //         this.Wzhcq_btn_addTime.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[1];
        //         this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[2];
        //         this.Wzhcq_xiaoPaiNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_releaseSpriteFrame[2];
        //     }
        //     else {
        //         this.Wzhcq_btn_TipsNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
        //         this.Wzhcq_btn_addTime.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[1];
        //         this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[2];
        //         this.Wzhcq_xiaoPaiNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[2];
        //     }
        // }
        // else {
        //     this.Wzhcq_btn_TipsNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[0];
        //     this.Wzhcq_btn_addTime.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[1];
        //     this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[2];
        //     this.Wzhcq_xiaoPaiNode.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_testSpriteFrame[2];
        // }

        if (Utils.getInstance.GameType == 6) {
            this.showGuiZe();
            this.tiaozhanBG.active = false;
            this.chuangguanBG.active = true;
        }
        else {
            this.hideGuiZe();
            this.tiaozhanBG.active = false;
            this.chuangguanBG.active = true;
        }
    }

    protected onDestroy(): void {
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_WARN_POPUP, this.Wzhcq_Warn_Popup, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSICSTATE, this.Wzhcq_updateMusic, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_SUCCESS, this.Wzhcq_gameSuccess, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_FAIL, this.Wzhcq_gameFail, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_REVIVE, this.Wzhcq_ShuffleTiles, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, this.Wzhcq_remove_Success, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_RESTARTGAME, this.Wzhcq_RestartGame, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_PROP, this.Wzhcq_gameProp, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_PROP, this.Wzhcq_updatePropState, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEMASK, this.Wzhcq_shuffleMask, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_OVER, this.Wzhcq_gameOver, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_AUTHOR, this.Wzhcq_author, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_ENERGY, this.Wzhcq_createEnergy, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_DOWNTIME, this.Wzhcq_update_downTime, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSE_PAUSE, this.Wzhcq_closePause, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REPORT_RESULT, this.Wzhcq_report_result, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RECOMMEND, this.Wzhcq_createRecommend, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHECK_GAMEOVER, this.Wzhcq_chenkGameOver, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, this.Wzhcq_gameTips, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEEVENT, this.shuffleEvent, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHANGE_PROPNUM, this.changePropNum, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_WALLTOWEREND, this.wallTowerEnd, this);
        this.EventMgr.off(this.EventMgr.Wzhcq_EVENT_NAMES.CREATEPAINTBOARD, this.createPaintBoard, this);


    }

    /** 金币动画启动 */
    @property(cc.Node)
    startNode: cc.Node = null;

    /** 金币动画终点 */
    @property(cc.Node)
    endNode: cc.Node = null;

    @property(cc.Node)
    flyRopeNode: cc.Node = null;

    /** 金币预制节点 */
    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    /** 金币节点池 */
    coinPool: cc.NodePool = null;

    /** 先预先创建几个节点放入节点池中 */
    initCoinPool(count: number = 20) {
        for (let i = 0; i < count; i++) {
            let coin = cc.instantiate(this.coinPrefab);
            this.coinPool.put(coin);
        }
    }

    /** 从节点池中取出节点 */
    getCoinNode() {
        let coin = null;
        if (this.coinPool.size() > 0) {
            coin = this.coinPool.get();
        }
        else {
            coin = cc.instantiate(this.coinPrefab);
        }
        return coin;
    }

    playAnim2(cardmahjong: any, cardmahjong2: any, coinNum: any) {
        let randomCount = 20;//Math.random() * 10 + 10;

        let pos = this.Wzhcq_topNode.convertToWorldSpaceAR(this.endNode.position);
        let edPos = this.node.convertToNodeSpaceAR(pos);
        let stPos = cc.v2((cardmahjong.node.position.x + cardmahjong2.node.position.x) / 2, (cardmahjong.node.position.y + cardmahjong2.node.position.y) / 2)
        // let stPos = this.startNode.getPosition();
        // let edPos = this.endNode.getPosition();
        this.playCoinRewardAnim(coinNum, stPos, edPos);
    }

    /**
     * 金币飞向钱包的动画
     *
     * @param {number} count 金币数量
     * @param {cc.Vec2} stPos 金币起始位置
     * @param {cc.Vec2} edPos 金币终点位置
     * @param {number} [r=130] 金币飞行的半径
     */
    playCoinRewardAnim(coinNum: number, stPos: cc.Vec2, edPos: cc.Vec3, r: number = 130) {
        if (coinNum <= 4) {
            r = 60;
        }
        else {
            r = 130;
        }
        // 生成圆，并且对圆上的点进行排序
        let points = this.getCirclePosition(r, stPos, coinNum);
        let coinNodeList = points.map(pos => {
            let coin = this.getCoinNode();
            coin.setPosition(stPos);
            this.node.addChild(coin);
            return {
                node: coin,
                stPos: stPos,
                mdPos: pos,
                edPos: edPos,
                dis: (pos as any).sub(edPos).mag()
            };
        });
        coinNodeList = coinNodeList.sort((a, b) => {
            if (a.dis - b.dis > 0) return 1;
            if (a.dis - b.dis < 0) return -1;
            return 0;
        });

        // 执行金币落袋的动画
        coinNodeList.forEach((item, idx) => {
            cc.tween(item.node)
                .to(0.3, { position: item.mdPos })
                .delay(idx * 0.01)
                .to(0.5, { position: item.edPos })
                .call(() => {
                    // 金币落袋后，将金币节点放入节点池中，并更新金币数值
                    this.Wzhcq_cur_rank_label.string = this.Wzhcq_cur_RankScore.toString();
                    this.coinPool.put(item.node);
                })
                .start();
        });
    }

    /**
   * 以某点为圆心，生成圆周上等分点的坐标
   * @param {number} radius 半径
   * @param {cc.Vec2} pos 圆心坐标
   * @param {number} count 等分点数量
   * @param {number} randomScope 等分点的随机波动范围
   * @returns {cc.Vec2[]} 返回等分点坐标
   */
    getCirclePosition(radius: number, pos: cc.Vec2, count: number, randomScope: number = 60): cc.Vec2[] {
        let positions = [];
        let radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            let x = pos.x + radius * Math.sin(radians * i);
            let y = pos.y + radius * Math.cos(radians * i);
            positions.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return positions;
    }

    showGuiZe() {
        this.guizeNode.active = true;
    }

    hideGuiZe() {
        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_game_isDownTime = true;
        }
        this.guizeNode.active = false;
    }

    guizeBtn() {
        AudioManager.instance.playAudioBtn_Click();
        this.hideGuiZe();
    }

    Wzhcq_gameTips(Wzhcq_str: any, Wzhcq_delay: any, zIndex: any = 100) {
        let Wzhcq_tipsPrefab = cc.instantiate(this.Wzhcq_tipsPrefab);
        Wzhcq_tipsPrefab.x = 0;
        Wzhcq_tipsPrefab.y = 0;
        Wzhcq_tipsPrefab.zIndex = zIndex;
        Wzhcq_tipsPrefab.getComponent(Tips).initData(Wzhcq_str, Wzhcq_delay);
        Wzhcq_tipsPrefab.parent = this.node;
    }

    storageScore() {
        this.Wzhcq_curScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurScore);
        this.Wzhcq_cur_RankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);

        this.Wzhcq_cur_score_label.string = Math.ceil(this.Wzhcq_curScore) + '';
        this.Wzhcq_cur_rank_label.string = Math.ceil(this.Wzhcq_cur_RankScore) + '';

        this.Wzhcq_rankIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_rankIndex);
        this.Wzhcq___Index = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage___Index);

        this.updateTargetBox();
    }

    initScore() {
        this.Wzhcq_curScore = 0;
        this.Wzhcq_cur_RankScore = 0;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurScore, this.Wzhcq_curScore);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_CurRankScore, this.Wzhcq_cur_RankScore);
        this.Wzhcq_cur_score_label.string = Math.ceil(this.Wzhcq_curScore) + '';
        this.Wzhcq_cur_rank_label.string = Math.ceil(this.Wzhcq_cur_RankScore) + '';
        this.Wzhcq_cur_score_progress.progress = 0;

        for (let i = 0; i < this.Wzhcq_target_label.length; i++) {
            const label = this.Wzhcq_target_label[i];
            label.string = '+' + cfgRankScore[this.Wzhcq_rankIndex][i].target;
        }

        this.resetTargetBox();
    }

    updateAllRankScore() {
        this.Wzhcq_all_RankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        this.Wzhcq_all_rank_label.string = Math.floor(this.Wzhcq_all_RankScore) + '';
    }

    Wzhcq_updatePropState() {
        let Wzhcq_PropShuffleTilesPrefab = cc.instantiate(this.Wzhcq_PropShuffleTilesPrefab);
        Wzhcq_PropShuffleTilesPrefab.parent = this.node;
        Wzhcq_PropShuffleTilesPrefab.zIndex = 100;
        Wzhcq_PropShuffleTilesPrefab.position = cc.v3(80, -20);

        cc.tween(Wzhcq_PropShuffleTilesPrefab)
            .to(0.5, { position: cc.v3(165, -600) })
            .call(() => {
                Wzhcq_PropShuffleTilesPrefab.removeFromParent();
                this.changePropNum();
            })
            .start();

        let Wzhcq_PropTipsPrefab = cc.instantiate(this.Wzhcq_PropTipsPrefab);
        Wzhcq_PropTipsPrefab.parent = this.node;
        Wzhcq_PropTipsPrefab.zIndex = 100;
        Wzhcq_PropTipsPrefab.position = cc.v3(-100, -20);

        cc.tween(Wzhcq_PropTipsPrefab)
            .to(0.5, { position: cc.v3(-170, -600) })
            .call(() => {
                Wzhcq_PropTipsPrefab.removeFromParent();
                this.changePropNum();
            })
            .start();
    }

    changePropNum() {
        let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
        if (Wzhcq_PropTips > 0) {
            this.Wzhcq_PropTipsArray[0].active = false;
            this.Wzhcq_PropTipsArray[1].active = true;
            this.Wzhcq_PropTipsLable.string = Wzhcq_PropTips;
        }
        else {
            this.Wzhcq_PropTipsArray[0].active = true;
            this.Wzhcq_PropTipsArray[1].active = false;
        }

        let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
        if (Wzhcq_PropShuffleTiles > 0) {
            this.Wzhcq_PropShuffleTilesArray[0].active = false;
            this.Wzhcq_PropShuffleTilesArray[1].active = true;
            this.Wzhcq_PropShuffleTilesLable.string = Wzhcq_PropShuffleTiles;
        }
        else {
            this.Wzhcq_PropShuffleTilesArray[0].active = true;
            this.Wzhcq_PropShuffleTilesArray[1].active = false;
        }

        let Wzhcq_PropCancellation = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropCancellation);
        if (Wzhcq_PropCancellation > 0) {
            this.Wzhcq_PropCancellationArray[0].active = false;
            this.Wzhcq_PropCancellationArray[1].active = true;
            this.Wzhcq_PropCancellationLable.string = Wzhcq_PropCancellation;
        }
        else {
            this.Wzhcq_PropCancellationArray[0].active = true;
            this.Wzhcq_PropCancellationArray[1].active = false;
        }

        let Wzhcq_PropAddTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropAddTime);
        if (Wzhcq_PropAddTime > 0) {
            this.Wzhcq_PropAddTimeArray[0].active = false;
            this.Wzhcq_PropAddTimeArray[1].active = true;
            this.Wzhcq_PropAddTimeLable.string = Wzhcq_PropAddTime;
        }
        else {
            this.Wzhcq_PropAddTimeArray[0].active = true;
            this.Wzhcq_PropAddTimeArray[1].active = false;
        }
    }

    Wzhcq_updateMusic() {
        let Wzhcq_isMusic = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Music);
        if (Wzhcq_isMusic) {
            AudioManager.instance.playBgMusic();
        }
        else {
            AudioManager.instance.stopBgMusic();
        }
    }

    hideTipsNode() {

        this.Wzhcq_tipsNode.active = false;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_ShowTips, 0);
    }

    public Wzhcq_RestartGame() {
        let self = this;
        this.Wzhcq_mahjongManager = null;
        this.Wzhcq_GridNode.removeAllChildren();
        this.Wzhcq_GridNode.getComponent(cc.Layout).enabled = true;
        this.scheduleOnce(() => {

            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});

            self.StartGame();
        });
    }

    private StartGame() {

        this.gameState = 0;
        Utils.getInstance.segmentCount = 0;
        this.segmentIdx = 0;

        if (this.flyRopePos == 0) {
            this.flyRopePos = this.flyRopeNode.x;
        }

        Utils.getInstance.allSession = 0; //总场次
        Utils.getInstance.victory = 0; //胜场
        Utils.getInstance.highestScore = 0;//最高分数
        Utils.getInstance.maximumEliminate = 0;//最大连消
        Utils.getInstance.highestIntegral = 0;//最高积分
        Utils.getInstance.startTime = Math.round(new Date().getTime() / 1000);

        this.Wzhcq_isDownTime = false;
        this.Wzhcq_isDownTime2 = true;
        Utils.getInstance._countdownSecond = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EnergyDownTime);

        this.Wzhcq_add_time = 30;
        this.Wzhcq_act_time = 30;
        this.Wzhcq_sub_time = this.Wzhcq_act_time;
        this.Wzhcq_timeBar.fillRange = 1;
        this.Wzhcq_double_hit_count = 0;
        this.Wzhcq_double_hit_state = 0;
        this.Wzhcq_rankIndex = 1;
        this.Wzhcq_gameTypeIndex = Utils.getInstance.GameType;
        this.Wzhcq___Index = 0;
        this.Wzhcq_stepIndex = 1;
        this.Wzhcq_isShuffleFinger = true;
        this.Wzhcq_LianJiCount = 0;

        this.coinPool = new cc.NodePool();
        this.initCoinPool();

        this.mahjongTouchState = true;

        Utils.getInstance.levelData = this.cardData.json.关卡;
        Utils.getInstance.meiritiaozhanData = this.cardData.json.每日挑战;
        Utils.getInstance.cardGroup = this.cardData.json.牌组合;
        Utils.getInstance.cardCfg = this.cardData.json.牌;
        Utils.getInstance.MaxLevel = Object.values(this.cardData.json.关卡).length;
        Utils.getInstance.Level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);

        Utils.getInstance.sjd_enter_stage();

        if (Utils.getInstance.Level > Utils.getInstance.MaxLevel) {
            Utils.getInstance.Level = Utils.getInstance.getLevelRange(Utils.getInstance.Level);
        }

        Utils.getInstance.MoveCount = 0;

        let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
        this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
        this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Button).interactable = true;

        if (Utils.getInstance.GameType == 6) {
            this.tiaozhanMoShiScoreNode.active = false;
            this.Wzhcq_downTimeNode.y = 60;
            this.Wzhcq_GridNode.y = this.tiaozhanDistance;
            this.Wzhcq_Kuang.y = this.tiaozhanDistance;

            this.level.active = false;
        }
        else {
            this.tiaozhanMoShiScoreNode.active = true;
            this.Wzhcq_downTimeNode.y = -40;
            this.Wzhcq_GridNode.y = this.chuangguanDistance;
            this.Wzhcq_Kuang.y = this.chuangguanDistance;

            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                if (Utils.getInstance.accountInfo.miniProgram.envVersion == "release") {
                    this.Wzhcq_ZhaDanNode.active = false;
                }
                else {
                    this.Wzhcq_ZhaDanNode.active = true;
                }
            }
            else {
                this.Wzhcq_ZhaDanNode.active = true;
            }

            this.level.active = true;
            this.level.getComponent(cc.Label).string = "第" + Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level) + "关";
        }

        Utils.getInstance.JianDanTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_JianDanTips);
        if (Utils.getInstance.GameType != 6) {
            if (Utils.getInstance.MoveCount < Utils.getInstance.MaxMoveCount && Utils.getInstance.levelData[Utils.getInstance.Level].autotips == 1) {
                this.Wzhcq_AutoTipsNode.active = true;
            }
            else {
                this.Wzhcq_AutoTipsNode.active = false;
            }

            if (Utils.getInstance.JianDanTips) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_JianDanTips, 0);
            }
        }
        else {
            this.Wzhcq_AutoTipsNode.active = false;
        }

        if (Utils.getInstance.GameType == 7) {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_UseEnergy, 0);
        }

        Utils.getInstance.checkRecommendState();

        Utils.getInstance.XiaoChuCount = 0;
        this.Wzhcq_tipsNode.active = false;

        if (Utils.getInstance.GameType == 6 || Utils.getInstance.GameType == 6) {
            this.Wzhcq_btn_addTime.active = true;
        }
        else {
            this.Wzhcq_btn_addTime.active = false;
        }

        Utils.getInstance.StoreyIndex = 0;

        if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_game_isDownTime = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_game_isDownTime = false;
        }
        else {
            this.Wzhcq_game_isDownTime = false;
        }

        this.Wzhcq_game_isDialog = true;
        this.Wzhcq_game_isaddtime = true;

        this.Wzhcq_fillRange = 0;
        this.Wzhcq_TipResult = [];
        Utils.getInstance.lookDownTimeCount = 0
        Utils.getInstance.fristAddTime = 1;
        Utils.getInstance.isRevive = 1;

        this.Wzhcq_btn_addTime.stopAllActions();
        this.Wzhcq_btn_addTime.scale = 1;

        if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_downTimeNode.active = true;
            this.Wzhcq_btn_addTime.active = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_downTimeNode.active = true;
            this.Wzhcq_btn_addTime.active = true;
        }
        else {
            this.Wzhcq_downTimeNode.active = false;
            this.Wzhcq_btn_addTime.active = false;
        }

        this.Wzhcq_IsShuffleTip = false;
        this.Wzhcq_ShuffleFinger.active = false;
        this.Wzhcq_ShuffleTipState = true;
        this.Wzhcq_ShuffleTipTime = 15;
        this.Wzhcq_NextShuffleTipTime = 15;

        let Wzhcq_guide = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Guide);
        this.Wzhcq_guidanceStep();
        this.Wzhcq_resetGuideData(undefined);
        this.resetShuffleTipData();

        let self = this;
        this.scheduleOnce(() => {
            self.hideShuffleTip();
        }, 0.3);

        this.Wzhcq_layout.removeAllChildren();
        if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_layout.position = cc.v3(0, this.tiaozhanDistance);
        }
        else {
            this.Wzhcq_layout.position = cc.v3(0, this.chuangguanDistance);
        }

        this.changePropNum();
        this.updateAllRankScore();

        let Wzhcq_minimumPairsToPreserve = 0;
        if (Utils.getInstance.GameType == 1) {
            this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
            this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
            this.Wzhcq_IsGuidance = 1;
        }
        else if (Utils.getInstance.GameType == 2) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                if (Utils.getInstance.accountInfo.miniProgram.envVersion == "release") {
                    this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
                    this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
                }
                else {
                    this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
                    this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
                }
            }
            else {
                // this.Wzhcq_Row = 4;
                // this.Wzhcq_Col = 4;

                this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
                this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
            }
            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
        }
        else if (Utils.getInstance.GameType == 3) {
            this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
            this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
        }
        else if (Utils.getInstance.GameType == 4) {
            this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
            this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
        }
        else if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
            this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_Row = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row;
            this.Wzhcq_Col = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].col;
            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
        }
        else if (Utils.getInstance.GameType == 7) {
            this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
            this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;

            Wzhcq_minimumPairsToPreserve = Utils.getInstance.levelData[Utils.getInstance.Level].miniPairs;
        }

        if (Wzhcq_guide) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                if (Utils.getInstance.accountInfo.miniProgram.envVersion == "release") {
                    this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
                    this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
                }
                else {
                    this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
                    this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
                }
            }
            else {
                this.Wzhcq_Row = Utils.getInstance.levelData[Utils.getInstance.Level].row;
                this.Wzhcq_Col = Utils.getInstance.levelData[Utils.getInstance.Level].col;
            }
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Guide, 0);

        }

        let Wzhcq_Storage_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_GameType);
        let Wzhcq_Storage_MahjongList = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList);

        if (Utils.getInstance.GameType == Wzhcq_Storage_GameType && Object.keys(Wzhcq_Storage_MahjongList).length > 0) {
            let Wzhcq_Storage_Row = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_Row);
            let Wzhcq_Storage_Col = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_Col);
            this.Wzhcq_game_down_time = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_JiShi_DownTime);
            this.storageScore();

            if (Utils.getInstance.GameType == 7) {
                let Wzhcq_temp_Storage_MahjongList = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList);
                let Wzhcq_StoreyIndex = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_StoreyIndex);
                for (let key in Wzhcq_temp_Storage_MahjongList) {
                    if (key < Wzhcq_StoreyIndex) {
                        Wzhcq_temp_Storage_MahjongList[key] = {};
                        Wzhcq_Storage_MahjongList[key] = {};
                    }
                    else {
                        for (let key2 in Wzhcq_temp_Storage_MahjongList[key]) {
                            let key3 = JSON.stringify(Wzhcq_temp_Storage_MahjongList[key][key2].Pos);
                            Wzhcq_Storage_MahjongList[key][key3] = Wzhcq_temp_Storage_MahjongList[key][key2];
                            Wzhcq_Storage_MahjongList[key][key3].Pos.x = JSON.parse(key3).x;
                            Wzhcq_Storage_MahjongList[key][key3].Pos.y = JSON.parse(key3).y;
                        }
                    }
                }

                this.Wzhcq_Kuang.active = false;
                this.Wzhcq_mahjongManager2 = new MahjongManager2(Utils.getInstance.GameType);
                this.Wzhcq_mahjongManager2.updateTiles(Utils.getInstance.GameType, Wzhcq_Storage_MahjongList);

                this.Wzhcq_MahjongListObj = {};
                this.Wzhcq_CheckMapObj = {};
                this.Wzhcq_GridListObj = {};

                for (let index = 0; index < cfg.length; index++) {
                    let Wzhcq_mahjongPos: MahjongPos[] = [];
                    this.Wzhcq_MahjongList = {};
                    this.Wzhcq_WaterList = {};
                    this.Wzhcq_GridList = {};
                    this.Wzhcq_CheckMap = [];

                    let Wzhcq_data = cfg[index];
                    for (let i = 0; i < Wzhcq_data.Row; i++) {
                        let Wzhcq_tmp = [];
                        for (let j = 0; j < Wzhcq_data.Col; j++) {
                            let Wzhcq_pos: MahjongPos = {
                                x: j,
                                y: i,
                            };
                            Wzhcq_mahjongPos.push(Wzhcq_pos);

                            if (Wzhcq_Storage_MahjongList[index][JSON.stringify(Wzhcq_pos)]) {
                                Wzhcq_tmp.push(1);
                            }
                            else {
                                Wzhcq_tmp.push(0);
                            }
                        }
                        this.Wzhcq_CheckMap.push(Wzhcq_tmp);
                    }
                    this.Wzhcq_CheckMapObj[index] = this.Wzhcq_CheckMap;

                    let Wzhcq_pairs = this.Wzhcq_mahjongManager2.getTiles()[index];

                    // console.log('取出的牌对:', Wzhcq_pairs);
                    this.Wzhcq_specialGridNode[index].removeAllChildren();
                    Utils.getInstance.StoreyIndex = index;

                    for (let i = 0; i < Wzhcq_mahjongPos.length; i++) {
                        const element = Wzhcq_pairs[i];
                        if (this.update_Pos(Wzhcq_mahjongPos[i], Wzhcq_Storage_MahjongList[index])) {
                            let Wzhcq_mahjongData = this.getMahjongTile(Wzhcq_mahjongPos[i], Wzhcq_pairs)
                            let Wzhcq_mahjong: MahjongTile = this.CreateMahjong2(Wzhcq_mahjongData, Wzhcq_mahjongPos[i], index);
                            Wzhcq_mahjong.setScale(Wzhcq_data.scale);

                            let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbGrid);
                            let Wzhcq_key = JSON.stringify(Wzhcq_mahjongPos[i]);
                            this.Wzhcq_MahjongList[Wzhcq_key] = Wzhcq_mahjong;
                            this.Wzhcq_GridList[Wzhcq_key] = Wzhcq_pb;
                            Wzhcq_pb.opacity = 255;
                            this.Wzhcq_specialGridNode[index].addChild(Wzhcq_pb);
                        }
                        else {
                            let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbGrid);
                            let Wzhcq_key = JSON.stringify(Wzhcq_mahjongPos[i]);
                            this.Wzhcq_GridList[Wzhcq_key] = Wzhcq_pb;
                            Wzhcq_pb.opacity = 255;
                            this.Wzhcq_specialGridNode[index].addChild(Wzhcq_pb);
                        }
                    }

                    this.Wzhcq_MahjongListObj[index] = this.Wzhcq_MahjongList;
                    this.Wzhcq_GridListObj[index] = this.Wzhcq_GridList;

                    this.Wzhcq_Row = Wzhcq_data.Row;
                    this.Wzhcq_Col = Wzhcq_data.Col;
                }

                this.scheduleOnce(() => {
                    for (let _k in this.Wzhcq_MahjongListObj) {
                        this.Wzhcq_specialGridNode[_k].getComponent(cc.Layout).enabled = false;

                        for (let k in this.Wzhcq_MahjongListObj[_k]) {
                            let Wzhcq_mahjongTile: MahjongTile = this.Wzhcq_MahjongListObj[_k][k];
                            Wzhcq_mahjongTile.setScale(cfg[_k].scale);

                            this.Wzhcq_specialGridNode[_k].addChild(Wzhcq_mahjongTile.node);

                            let Wzhcq_pos: cc.Vec3 = cc.v3(this.Wzhcq_GridListObj[_k][k].x, this.Wzhcq_GridListObj[_k][k].y, 0);
                            Wzhcq_mahjongTile.node.position = Wzhcq_pos;

                            Wzhcq_mahjongTile.SetLocalPos(Wzhcq_pos);
                            Wzhcq_mahjongTile.SetLocalKey(Wzhcq_mahjongTile.GetPosKey());
                            Wzhcq_mahjongTile.UpdateView();
                        }

                    }

                    this.UpdateCheckMap();
                    this.getResultData();

                    let Wzhcq_StoreyIndex = Utils.getInstance.StoreyIndex;
                    this.Wzhcq_Row = cfg[Wzhcq_StoreyIndex].Row;
                    this.Wzhcq_Col = cfg[Wzhcq_StoreyIndex].Col;
                    this.Wzhcq_MahjongList = this.Wzhcq_MahjongListObj[Utils.getInstance.StoreyIndex];
                    this.Wzhcq_GridList = this.Wzhcq_GridListObj[Utils.getInstance.StoreyIndex];
                    this.Wzhcq_CheckMap = this.Wzhcq_CheckMapObj[Utils.getInstance.StoreyIndex];

                });

                Utils.getInstance.StoreyIndex = Wzhcq_StoreyIndex;
                for (let j = 0; j < this.Wzhcq_specialGridNode.length; j++) {
                    if (Wzhcq_StoreyIndex <= j) {
                        this.Wzhcq_specialGridNode[j].active = true;
                    }
                    else {
                        this.Wzhcq_specialGridNode[j].active = false;
                        this.Wzhcq_specialMask[j].active = false;
                    }
                }
            }
            else {
                this.Wzhcq_Kuang.active = true;
                for (let index1 = 0; index1 < this.Wzhcq_specialGridNode.length; index1++) {
                    this.Wzhcq_specialGridNode[index1].active = false;
                }
                for (let index2 = 0; index2 < this.Wzhcq_specialMask.length; index2++) {
                    this.Wzhcq_specialMask[index2].active = false;
                }

                if (Utils.getInstance.GameType == 4) {
                    this.Wzhcq_GridNode.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Col;
                    this.Wzhcq_GridNode.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Row;
                    this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                    this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                }
                else if (Utils.getInstance.GameType == 1 ||
                    Utils.getInstance.GameType == 2 ||
                    Utils.getInstance.GameType == 3 ||
                    Utils.getInstance.GameType == 5 ||
                    Utils.getInstance.GameType == 7) {
                    if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                        this.Wzhcq_GridNode.width = 70 * 0.9 * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * 0.9 * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * 0.9;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * 0.9;
                    }
                    else {
                        this.Wzhcq_GridNode.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                    }
                }
                else if (Utils.getInstance.GameType == 6) {
                    if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                        this.Wzhcq_GridNode.width = 70 * 0.9 * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * 0.9 * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * 0.9;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * 0.9;
                    }
                    else {
                        this.Wzhcq_GridNode.width = 70 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
                    }

                }

                let Wzhcq_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_GameType);
                if (Wzhcq_GameType > 2 && Utils.getInstance.GameType == 2 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_ShowTips)) {
                    this.Wzhcq_tipsNode.active = true;
                }

                this.Wzhcq_mahjongManager = new MahjongManager(Utils.getInstance.GameType);
                this.Wzhcq_mahjongManager.updateTiles(Utils.getInstance.GameType, Wzhcq_Storage_MahjongList);

                let Wzhcq_mahjongPos: MahjongPos[] = [];
                this.Wzhcq_MahjongList = {};
                this.Wzhcq_WaterList = {};
                this.Wzhcq_GridList = {};
                this.Wzhcq_CheckMap = [];
                for (let i = 0; i < Wzhcq_Storage_Row; i++) {
                    let Wzhcq_tmp = [];
                    for (let j = 0; j < Wzhcq_Storage_Col; j++) {
                        let Wzhcq_pos = {
                            x: j,
                            y: i,
                        };
                        Wzhcq_mahjongPos.push(Wzhcq_pos);

                        if (Wzhcq_Storage_MahjongList[JSON.stringify(Wzhcq_pos)]) {
                            Wzhcq_tmp.push(1);
                        }
                        else {
                            Wzhcq_tmp.push(0);
                        }
                    }
                    this.Wzhcq_CheckMap.push(Wzhcq_tmp);
                }

                const Wzhcq_pairs = this.Wzhcq_mahjongManager.getTiles();

                for (let i = 0; i < Wzhcq_mahjongPos.length; i++) {
                    const element = Wzhcq_pairs[i];
                    if (this.update_Pos(Wzhcq_mahjongPos[i], Wzhcq_Storage_MahjongList)) {
                        let Wzhcq_mahjongData = this.getMahjongTile(Wzhcq_mahjongPos[i], Wzhcq_pairs)
                        let Wzhcq_mahjong: MahjongTile = this.CreateMahjong(Wzhcq_mahjongData, Wzhcq_mahjongPos[i]);
                        this.CreateGrid(Wzhcq_mahjong, Wzhcq_mahjongPos[i]);
                    }
                    else {
                        this.CreateStorageGrid(Wzhcq_mahjongPos[i]);
                    }
                }

                this.scheduleOnce(() => {
                    this.Wzhcq_Kuang.width = this.Wzhcq_GridNode.width + 40;
                    this.Wzhcq_Kuang.height = this.Wzhcq_GridNode.height + 40;
                    this.Wzhcq_GridNode.getComponent(cc.Layout).enabled = false;
                    for (let k in this.Wzhcq_MahjongList) {
                        let Wzhcq_mahjongTile: MahjongTile = this.Wzhcq_MahjongList[k];
                        this.Wzhcq_GridNode.addChild(Wzhcq_mahjongTile.node);
                        let Wzhcq_pos: cc.Vec3 = cc.v3(this.Wzhcq_GridList[k].x, this.Wzhcq_GridList[k].y, 0);
                        Wzhcq_mahjongTile.node.position = Wzhcq_pos;

                        Wzhcq_mahjongTile.SetLocalPos(Wzhcq_pos);
                        Wzhcq_mahjongTile.SetLocalKey(Wzhcq_mahjongTile.GetPosKey());
                        Wzhcq_mahjongTile.UpdateView();
                    }

                    this.getResultData();

                    this.Wzhcq_chenkGameOver(true, () => { });
                });
            }
        }
        else {
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_Row, this.Wzhcq_Row);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_Col, this.Wzhcq_Col);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_GameType, Utils.getInstance.GameType);
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, {});
            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_StoreyIndex, Utils.getInstance.StoreyIndex);

            if (Utils.getInstance.GameType == 6) {
                this.Wzhcq_game_down_time = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].time;
            }
            else {
                this.Wzhcq_game_down_time = Utils.getInstance.levelData[Utils.getInstance.Level].time;
            }
            this.initScore();

            if (Utils.getInstance.GameType == 7) {

                this.Wzhcq_Kuang.active = false;
                this.Wzhcq_mahjongManager2 = new MahjongManager2(Utils.getInstance.GameType);

                this.Wzhcq_MahjongListObj = {};
                this.Wzhcq_CheckMapObj = {};
                this.Wzhcq_GridListObj = {};

                for (let index = 0; index < cfg.length; index++) {
                    let Wzhcq_mahjongPos: MahjongPos[] = [];
                    this.Wzhcq_MahjongList = {};
                    this.Wzhcq_WaterList = {};
                    this.Wzhcq_GridList = {};
                    this.Wzhcq_CheckMap = [];

                    let Wzhcq_data = cfg[index];
                    for (let i = 0; i < Wzhcq_data.Row; i++) {
                        let Wzhcq_tmp = [];
                        for (let j = 0; j < Wzhcq_data.Col; j++) {
                            let pos: MahjongPos = {
                                x: j,
                                y: i,
                            };
                            Wzhcq_mahjongPos.push(pos);
                            Wzhcq_tmp.push(pos.x + '-' + pos.y);
                        }
                        this.Wzhcq_CheckMap.push(Wzhcq_tmp);
                    }
                    this.Wzhcq_CheckMapObj[index] = this.Wzhcq_CheckMap;

                    let Wzhcq_pairs = this.Wzhcq_mahjongManager2.GetPairsFromTiles((Wzhcq_data.Row * Wzhcq_data.Col) / 2, Wzhcq_data.minimumPairsToPreserve, index);
                    // console.log('取出的牌对:', Wzhcq_pairs);
                    this.Wzhcq_specialGridNode[index].removeAllChildren();
                    Utils.getInstance.StoreyIndex = index;

                    for (let i = 0; i < Wzhcq_pairs.length; i++) {
                        let Wzhcq_element = Wzhcq_pairs[i];
                        let Wzhcq_mahjong: MahjongTile = this.CreateMahjong2(Wzhcq_element, Wzhcq_mahjongPos[i], index);
                        Wzhcq_mahjong.setScale(Wzhcq_data.scale);
                        // this.CreateGrid2(mahjong, mahjongPos[i], i);

                        let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbGrid);
                        let Wzhcq_key = JSON.stringify(Wzhcq_mahjongPos[i]);
                        this.Wzhcq_MahjongList[Wzhcq_key] = Wzhcq_mahjong;
                        this.Wzhcq_GridList[Wzhcq_key] = Wzhcq_pb;
                        Wzhcq_pb.opacity = 255;
                        // this.GridNode.addChild(pb);
                        this.Wzhcq_specialGridNode[index].addChild(Wzhcq_pb);
                    }

                    this.Wzhcq_MahjongListObj[index] = this.Wzhcq_MahjongList;
                    this.Wzhcq_GridListObj[index] = this.Wzhcq_GridList;

                    this.Wzhcq_Row = Wzhcq_data.Row;
                    this.Wzhcq_Col = Wzhcq_data.Col;
                }

                this.scheduleOnce(() => {
                    // this.Kuang.width = this.GridNode.width + 40;
                    // this.Kuang.height = this.GridNode.height + 40;
                    // this.GridNode.getComponent(cc.Layout).enabled = false;

                    for (let _k in this.Wzhcq_MahjongListObj) {
                        this.Wzhcq_specialGridNode[_k].getComponent(cc.Layout).enabled = false;

                        for (let k in this.Wzhcq_MahjongListObj[_k]) {
                            let Wzhcq_mahjongTile: MahjongTile = this.Wzhcq_MahjongListObj[_k][k];
                            Wzhcq_mahjongTile.setScale(cfg[_k].scale);

                            // this.GridNode.addChild(mahjongTile.node);
                            this.Wzhcq_specialGridNode[_k].addChild(Wzhcq_mahjongTile.node);

                            let Wzhcq_pos: cc.Vec3 = cc.v3(this.Wzhcq_GridListObj[_k][k].x, this.Wzhcq_GridListObj[_k][k].y, 0);
                            Wzhcq_mahjongTile.node.position = Wzhcq_pos;

                            Wzhcq_mahjongTile.SetLocalPos(Wzhcq_pos);
                            Wzhcq_mahjongTile.SetLocalKey(Wzhcq_mahjongTile.GetPosKey());
                            Wzhcq_mahjongTile.UpdateView();
                        }

                    }

                    this.UpdateCheckMap();
                    this.getResultData();

                    Utils.getInstance.StoreyIndex = 0;
                    let Wzhcq_StoreyIndex = Utils.getInstance.StoreyIndex;
                    this.Wzhcq_Row = cfg[Wzhcq_StoreyIndex].Row;
                    this.Wzhcq_Col = cfg[Wzhcq_StoreyIndex].Col;
                    this.Wzhcq_MahjongList = this.Wzhcq_MahjongListObj[Utils.getInstance.StoreyIndex];
                    this.Wzhcq_GridList = this.Wzhcq_GridListObj[Utils.getInstance.StoreyIndex];
                    this.Wzhcq_CheckMap = this.Wzhcq_CheckMapObj[Utils.getInstance.StoreyIndex];

                });

            }
            else {
                this.Wzhcq_Kuang.active = true;
                for (let index1 = 0; index1 < this.Wzhcq_specialGridNode.length; index1++) {
                    this.Wzhcq_specialGridNode[index1].active = false;
                }
                for (let index2 = 0; index2 < this.Wzhcq_specialMask.length; index2++) {
                    this.Wzhcq_specialMask[index2].active = false;
                }

                if (Utils.getInstance.GameType == 4) {
                    this.Wzhcq_GridNode.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Col;
                    this.Wzhcq_GridNode.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Row;
                    this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                    this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                }
                else if (Utils.getInstance.GameType == 1 ||
                    Utils.getInstance.GameType == 2 ||
                    Utils.getInstance.GameType == 3 ||
                    Utils.getInstance.GameType == 5 ||
                    Utils.getInstance.GameType == 7) {
                    if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                        this.Wzhcq_GridNode.width = 70 * 0.9 * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * 0.9 * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * 0.9;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * 0.9;
                    }
                    else {
                        this.Wzhcq_GridNode.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                    }

                }
                else if (Utils.getInstance.GameType == 6) {
                    if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                        this.Wzhcq_GridNode.width = 70 * 0.9 * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * 0.9 * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * 0.9;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * 0.9;
                    }
                    else {
                        this.Wzhcq_GridNode.width = 70 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale * this.Wzhcq_Col;
                        this.Wzhcq_GridNode.height = 86 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale * this.Wzhcq_Row;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.width = 70 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
                        this.Wzhcq_GridNode.getComponent(cc.Layout).cellSize.height = 86 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
                    }

                }

                let Wzhcq_GameType = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_GameType);
                if (Wzhcq_GameType > 2 && Utils.getInstance.GameType == 2 && Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_ShowTips)) {
                    this.Wzhcq_tipsNode.active = true;
                }

                this.Wzhcq_mahjongManager = new MahjongManager(Utils.getInstance.GameType);

                let Wzhcq_mahjongPos: MahjongPos[] = [];
                this.Wzhcq_MahjongList = {};
                this.Wzhcq_WaterList = {};
                this.Wzhcq_GridList = {};
                this.Wzhcq_CheckMap = [];
                for (let i = 0; i < this.Wzhcq_Row; i++) {
                    let Wzhcq_tmp = [];
                    for (let j = 0; j < this.Wzhcq_Col; j++) {
                        let Wzhcq_pos: MahjongPos = {
                            x: j,
                            y: i,
                        };
                        Wzhcq_mahjongPos.push(Wzhcq_pos);
                        Wzhcq_tmp.push(Wzhcq_pos.x + '-' + Wzhcq_pos.y);
                    }
                    this.Wzhcq_CheckMap.push(Wzhcq_tmp);
                }
                // minimumPairsToPreserve = 10;
                let Wzhcq_allCout: number = (this.Wzhcq_Row * this.Wzhcq_Col) / 2;
                let Wzhcq_pairs = this.Wzhcq_mahjongManager.GetPairsFromTiles(Wzhcq_allCout, Wzhcq_minimumPairsToPreserve);
                console.log('取出的牌对:', Wzhcq_pairs);

                let object = this.Wzhcq_mahjongManager.initCardAnchor();
                let Tiles = object.Tiles;
                let keyArray = object.keyArray;

                let temp = [];
                let zIdx = 0;
                let zIdx2 = 0;
                for (let n = 0; n < this.Wzhcq_Row * this.Wzhcq_Col; n++) {
                    if (keyArray.includes(n)) {
                        temp.push(Tiles[zIdx]);
                        zIdx++;
                    }
                    else {
                        temp.push(Wzhcq_pairs[zIdx2]);
                        zIdx2++;
                    }
                }
                Wzhcq_pairs = temp;

                Utils.getInstance.segmentCount = Wzhcq_pairs.length;

                // console.log('取出的牌对2:', Wzhcq_pairs);
                for (let i = 0; i < Wzhcq_pairs.length; i++) {
                    const element = Wzhcq_pairs[i];
                    let Wzhcq_mahjong: MahjongTile = this.CreateMahjong(element, Wzhcq_mahjongPos[i]);
                    this.CreateGrid(Wzhcq_mahjong, Wzhcq_mahjongPos[i]);
                }

                this.scheduleOnce(() => {
                    this.Wzhcq_Kuang.width = this.Wzhcq_GridNode.width + 40;
                    this.Wzhcq_Kuang.height = this.Wzhcq_GridNode.height + 40;
                    this.Wzhcq_GridNode.getComponent(cc.Layout).enabled = false;
                    for (let k in this.Wzhcq_MahjongList) {
                        let Wzhcq_mahjongTile: MahjongTile = this.Wzhcq_MahjongList[k];
                        this.Wzhcq_GridNode.addChild(Wzhcq_mahjongTile.node);
                        let Wzhcq_pos: cc.Vec3 = cc.v3(this.Wzhcq_GridList[k].x, this.Wzhcq_GridList[k].y, 0);
                        Wzhcq_mahjongTile.node.position = Wzhcq_pos;

                        Wzhcq_mahjongTile.SetLocalPos(Wzhcq_pos);
                        Wzhcq_mahjongTile.SetLocalKey(Wzhcq_mahjongTile.GetPosKey());
                        Wzhcq_mahjongTile.UpdateView();
                    }
                    this.UpdateCheckMap();

                    this.getResultData();

                    this.initSegmentData();

                    if (Utils.getInstance.GameType == 6) {
                        this.initMap();
                    }
                });
            }
        }
    }

    initSegmentData() {
        for (let j = 0; j < this.segmentDataArray.length; j++) {
            let node = this.segmentDataArray[j];
            node.removeAllChildren();
        }

        
        this.segmentNum.getComponent(cc.Label).string = 0 + "%";
        this.segmentDataArray = [];

        let count = Utils.getInstance.segmentCount / 2 / 5;
        for (let i = 0; i < this.segmentLayout.length; i++) {
            let node = this.segmentLayout[i];
            if (i < count) {
                node.parent.active = true;
                this.segmentDataArray.push(node);
            }
            else {
                node.parent.active = false;
            }
        }

        this.segmentNum.x = 325 -  (12- this.segmentDataArray.length) * 36.5;
    }

    private star = new pathAStar();

    private mSize: any = null;
    private mStart: any = null;
    private mEnd: any = null;
    private mObstacles: any[] = [];
    private mType: 4 | 8 = 4;
    private mEditType: 'start' | 'end' | 'obs' = null;
    private mLastPath: any[] = [];

    @property(cc.Node)
    startWallTower: cc.Node = null;

    @property(cc.Node)
    endWallTower: cc.Node = null;

    // 设置开始节点
    setStart(key: any) {
        // if (this.mStart) {
        //     this.setCell(this.mStart, ECellType.NOMAL);
        // }
        // this.setCell(key, ECellType.START);
        this.mStart = key;
    }

    // 设置目标节点
    setEnd(key: any) {
        // if (this.mEnd) {
        //     this.setCell(this.mEnd, ECellType.NOMAL);
        // }
        // this.setCell(key, ECellType.END);
        this.mEnd = key;
    }

    // 批量添加障碍物
    setObstacles(posArr: any) {
        this.mObstacles = [];

        let self = this;
        posArr.forEach((ele) => {
            self.setObstacle(ele);
        });
    }

    // 设置障碍
    setObstacle(pos: any) {
        // if (pos.x === this.mStart.x && pos.y === this.mStart.y) {
        //     return;
        // }
        // if (pos.x === this.mEnd.x && pos.y === this.mEnd.y) {
        //     return;
        // }
        let idx = -1;
        for (let i = 0; i < this.mObstacles.length; i++) {
            const ele = this.mObstacles[i];
            if (pos.x === ele.x && pos.y === ele.y) {
                idx = i;
                break;
            }
        }
        // if (idx >= 0) {
        //     this.setCell(pos, ECellType.NOMAL);
        //     this.mObstacles.splice(idx, 1);
        // }
        // else 
        {
            this.setCell(pos, ECellType.OBSTACLES);
            this.mObstacles.push(pos);
        }
    }

    // 设置cell类型
    setCell(key: any, type: ECellType) {
        if (this.Wzhcq_MahjongList[JSON.stringify(key)]) {
            this.Wzhcq_MahjongList[JSON.stringify(key)].setType(type);
        }
    }

    setPathCell(key: any, type: ECellType) {
        if (this.Wzhcq_GridList[JSON.stringify(key)]) {
            this.Wzhcq_GridList[JSON.stringify(key)].getComponent(Grid).setType(type);
        }
        else {
            this.Wzhcq_GridList[JSON.stringify(key)].getComponent(Grid).setType(type);
        }
    }

    setPath(pos: any) {
        this.setCell(pos, ECellType.PATH);
    }

    checkPathState() {
        let count = 0;
        let count2 = 0;
        for (let key in this.Wzhcq_GridList) {
            let bool = this.pathType(key);
            if (bool) {
                count++;
                this.Wzhcq_GridList[key].getComponent(Grid).setTypePath();
            }
            else {
                count2++;
                this.Wzhcq_GridList[key].getComponent(Grid).setType(ECellType.NOMAL);
            }
        }
    }

    pathType(key: any) {
        for (let i = 0; i < this.mLastPath.length; i++) {
            let value = this.mLastPath[i];
            if (JSON.parse(key).x == value.x && JSON.parse(key).y == value.y) {
                // this.Wzhcq_GridList[key].getComponent(Grid).setTypePath(ECellType.PATH);
                return true;
            }
        }
        return false;
    }

    runAStar() {
        this.star.init(this.mSize, this.mStart, this.mEnd, this.mObstacles);
        this.star.run(this.mType);
    }

    refreshUI() {
        let self = this;
        this.mObstacles.forEach((ele) => {
            this.setCell(ele, ECellType.OBSTACLES);
        });

        this.mLastPath = this.star.getPath();
        self.checkPathState();

        // this.setCell(this.mStart, ECellType.START);
        // this.setCell(this.mEnd, ECellType.END);

        let count = self.checkMeiRiOver();
        console.log("连通个数：", count);
        if (count == 2) {
            self.scheduleOnce(() => {
                self.endWallTower.getComponent(cc.Animation).play("wallTower");
            }, 0.5);
        }
    }

    wallTowerEnd() {
        let Wzhcq_curRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);
        let Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        Wzhcq_allScore += Wzhcq_curRankScore;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, Wzhcq_allScore);
        AudioManager.instance.playAudioWin();

        let Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_allSession);
        Utils.getInstance.allSession = Wzhcq_allSession + 1;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_allSession, Utils.getInstance.allSession);

        let Wzhcq_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        Utils.getInstance.victory = Wzhcq_victory + 1;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory, Utils.getInstance.victory);

        Utils.getInstance.endTime = Math.round(new Date().getTime() / 1000);
        Utils.getInstance.shortestTime = Utils.getInstance.endTime - Utils.getInstance.startTime;

        Utils.getInstance.highestScore = Wzhcq_curRankScore;

        let Wzhcq_winningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_winningStreak);
        Utils.getInstance.winningStreak = Wzhcq_winningStreak + 1;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_tiaozhan_winningStreak, Wzhcq_winningStreak + 1);

        Utils.getInstance.prop_UserInfo();
    }

    checkMeiRiOver() {
        let count = 0;
        for (let i = 0; i < this.mLastPath.length; i++) {
            let data = this.mLastPath[i];
            if (data.x == this.mStart.x && data.y == this.mStart.y) {
                count += 1;
                console.log("连通开始");
            }
            else if (data.x == this.mEnd.x && data.y == this.mEnd.y) {
                count += 1;
                console.log("连通结束");
            }
        }
        console.log("count:", count)
        return count;
    }

    initMap() {
        let x = this.Wzhcq_Col;
        let y = this.Wzhcq_Row;
        this.mSize = cc.v2(x, y);
        let start: any;
        let end: any;
        let obstacles = [];
        if (Utils.getInstance.GameType == 6) {
            start = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].start[0];
            end = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].end[0];
        }
        else {
            start = Utils.getInstance.levelData[Utils.getInstance.Level].start[0];
            end = Utils.getInstance.levelData[Utils.getInstance.Level].end[0];
        }

        this.startWallTower.active = true;
        this.startWallTower.x = this.Wzhcq_GridList[JSON.stringify(start)].x;
        this.startWallTower.y = this.Wzhcq_GridList[JSON.stringify(start)].y + 198;
        // this.startWallTower.y = 367;
        this.endWallTower.active = true;
        this.endWallTower.x = this.Wzhcq_GridList[JSON.stringify(end)].x;
        this.endWallTower.y = this.Wzhcq_GridList[JSON.stringify(end)].y - 21;
        // this.endWallTower.y = -450;

        for (let key in this.Wzhcq_MahjongList) {
            obstacles.push(JSON.parse(key));
        }

        let temp_obstacles = [];
        // x = 10,y = 8
        for (let i = x; i < x + 1; i++) {
            for (let j = 0; j < y; j++) {
                // console.log("坐标：", { x: i, y: j });
                temp_obstacles.push({ x: i, y: j });
            }
        }

        for (let i = 0; i < x + 1; i++) {
            for (let j = y; j < y + 1; j++) {
                // console.log("坐标：", { x: i, y: j });
                temp_obstacles.push({ x: i, y: j });
            }
        }

        // console.log("temp_obstacles:", temp_obstacles);

        obstacles = obstacles.concat(temp_obstacles);

        this.setStart(start);
        this.setEnd(end);
        this.setObstacles(obstacles);

        this.runAStar();
        this.refreshUI();
    }

    updateMap() {
        let obstacles = [];
        for (let key in this.Wzhcq_MahjongList) {
            obstacles.push(JSON.parse(key));
        }

        let temp_obstacles = [];
        // x = 10,y = 8
        for (let i = this.Wzhcq_Col; i < this.Wzhcq_Col + 1; i++) {
            for (let j = 0; j < this.Wzhcq_Row; j++) {
                // console.log("坐标：", { x: i, y: j });
                temp_obstacles.push({ x: i, y: j });
            }
        }

        for (let i = 0; i < this.Wzhcq_Col + 1; i++) {
            for (let j = this.Wzhcq_Row; j < this.Wzhcq_Row + 1; j++) {
                // console.log("坐标：", { x: i, y: j });
                temp_obstacles.push({ x: i, y: j });
            }
        }

        // console.log("temp_obstacles:", temp_obstacles); 
        obstacles = obstacles.concat(temp_obstacles);

        this.setObstacles(obstacles);

        let self = this;
        this.scheduleOnce(() => {
            self.runAStar();
            self.refreshUI();
        }, 0.3);
    }

    update_Pos(Wzhcq_index: any, Wzhcq_obj: any) {
        if (Wzhcq_obj.hasOwnProperty(JSON.stringify(Wzhcq_index))) {
            return true;
        }
        else {
            return false;
        }
    }

    getMahjongTile(Wzhcq_pos: any, Wzhcq_obj: any) {
        for (let index = 0; index < Wzhcq_obj.length; index++) {
            if (Wzhcq_pos.x == Wzhcq_obj[index].Pos.x && Wzhcq_pos.y == Wzhcq_obj[index].Pos.y && Wzhcq_obj[index]) {
                return Wzhcq_obj[index];
            }
        }
    }

    updateStorey() {
        this.Wzhcq_specialGridNode[Utils.getInstance.StoreyIndex].active = false;
        this.Wzhcq_specialMask[Utils.getInstance.StoreyIndex].active = false;

        Utils.getInstance.StoreyIndex += 1;

        let Wzhcq_StoreyIndex = Utils.getInstance.StoreyIndex;
        this.Wzhcq_Row = cfg[Wzhcq_StoreyIndex].Row;
        this.Wzhcq_Col = cfg[Wzhcq_StoreyIndex].Col;
        this.Wzhcq_MahjongList = this.Wzhcq_MahjongListObj[Utils.getInstance.StoreyIndex];
        this.Wzhcq_GridList = this.Wzhcq_GridListObj[Utils.getInstance.StoreyIndex];
        this.Wzhcq_CheckMap = this.Wzhcq_CheckMapObj[Utils.getInstance.StoreyIndex];

        //数据存本地
        // let Wzhcq_Storage_MahjongList = {};
        // for (let index in this.Wzhcq_MahjongListObj) {
        //     let Wzhcq_MahjongList = this.Wzhcq_MahjongListObj[index];
        //     let Wzhcq_obj = {};
        //     for (let key in Wzhcq_MahjongList) {
        //         const Wzhcq__MahjongData = Wzhcq_MahjongList[key].MahjongData;
        //         Wzhcq_obj[key] = Wzhcq__MahjongData;
        //     }
        //     Wzhcq_Storage_MahjongList[index] = Wzhcq_obj;
        // }
        // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Storage_MahjongList, Wzhcq_Storage_MahjongList);
        // Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_StoreyIndex, Utils.getInstance.StoreyIndex);
    }

    protected start(): void {

        Utils.getInstance.hideUserInfoButton();

        this.Wzhcq_updateMusic();
        this.Wzhcq_RestartGame();
    }

    private CreateStorageGrid(Wzhcq_pos: MahjongPos) {
        let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbGrid);
        let Wzhcq_key = JSON.stringify(Wzhcq_pos);
        this.Wzhcq_GridList[Wzhcq_key] = Wzhcq_pb;
        Wzhcq_pb.opacity = 255;
        this.Wzhcq_GridNode.addChild(Wzhcq_pb);
    }

    private CreateGrid(Wzhcq_mahjong: MahjongTile, Wzhcq_pos: MahjongPos) {
        let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbGrid);
        let Wzhcq_key = JSON.stringify(Wzhcq_pos);
        this.Wzhcq_MahjongList[Wzhcq_key] = Wzhcq_mahjong;
        this.Wzhcq_WaterList[Wzhcq_key] = Wzhcq_mahjong;

        this.Wzhcq_GridList[Wzhcq_key] = Wzhcq_pb;
        Wzhcq_pb.opacity = 255;
        this.Wzhcq_GridNode.addChild(Wzhcq_pb);
    }

    private CreateGrid2(Wzhcq_mahjong: MahjongTile, Wzhcq_pos: MahjongPos, Wzhcq_storey: any) {
        let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbGrid);
        let Wzhcq_key = JSON.stringify(Wzhcq_pos);
        this.Wzhcq_MahjongList[Wzhcq_key] = Wzhcq_mahjong;
        this.Wzhcq_GridList[Wzhcq_key] = Wzhcq_pb;
        Wzhcq_pb.opacity = 255;
        this.Wzhcq_GridNode.addChild(Wzhcq_pb);
    }

    protected CreateMahjong(Wzhcq_data: MahjongTileData, Wzhcq_pos: MahjongPos): MahjongTile {
        let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbMahjong);
        let Wzhcq_node: cc.Node = new cc.Node();

        if (Utils.getInstance.GameType == 4) {
            Wzhcq_node.width = 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
            Wzhcq_node.height = 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
        }
        else if (Utils.getInstance.GameType == 1 ||
            Utils.getInstance.GameType == 2 ||
            Utils.getInstance.GameType == 3 ||
            Utils.getInstance.GameType == 5 ||
            Utils.getInstance.GameType == 7) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                Wzhcq_node.width = 70 * 0.9;
                Wzhcq_node.height = 86 * 0.9;
            }
            else {
                Wzhcq_node.width = Wzhcq_pb.width * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
                Wzhcq_node.height = Wzhcq_pb.height * Utils.getInstance.levelData[Utils.getInstance.Level].scale;
            }
        }
        else if (Utils.getInstance.GameType == 6) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                Wzhcq_node.width = 70 * 0.9;
                Wzhcq_node.height = 86 * 0.9;
            }
            else {
                Wzhcq_node.width = Wzhcq_pb.width * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
                Wzhcq_node.height = Wzhcq_pb.height * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
            }

        }

        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_pb.getComponent('MahjongTile');
        Wzhcq_mahjongTile.InitMahjongData(Wzhcq_data, this);
        Wzhcq_mahjongTile.SetMahjongPos(Wzhcq_pos);
        return Wzhcq_mahjongTile;
    }

    protected CreateMahjong2(Wzhcq_data: MahjongTileData, Wzhcq_pos: MahjongPos, Wzhcq_storey: any): MahjongTile {
        let Wzhcq_pb = cc.instantiate(this.Wzhcq_PbMahjong);
        let Wzhcq_node: cc.Node = new cc.Node();
        Wzhcq_node.width = 70;// storey == 0 ? 70 : (storey == 1 ? 78.75 : 91.875);
        Wzhcq_node.height = 86;//storey == 0 ? 86 : (storey == 1 ? 96.75 : 112.875);
        let Wzhcq_mahjongTile: MahjongTile = Wzhcq_pb.getComponent('MahjongTile');
        Wzhcq_mahjongTile.InitMahjongData(Wzhcq_data, this);
        Wzhcq_mahjongTile.SetMahjongPos(Wzhcq_pos);
        return Wzhcq_mahjongTile;
    }

    private GetNeedRemoveMahjong(Wzhcq_mahjongTile: MahjongTile) {
        return this.Wzhcq_CheckUpHasMathMajong(Wzhcq_mahjongTile) ||
            this.Wzhcq_CheckDownHasMathMajong(Wzhcq_mahjongTile) ||
            this.Wzhcq_CheckLeftHasMathMajong(Wzhcq_mahjongTile) ||
            this.Wzhcq_CheckRightHasMathMajong(Wzhcq_mahjongTile);
    }

    public CheckIsInMoveGroup(Wzhcq_mahjong: any, Wzhcq_moveGroup: any) {
        for (let key in Wzhcq_moveGroup) {
            let Wzhcq_element = Wzhcq_moveGroup[key];
            if (Wzhcq_element.GetPosKey === key) {
                return true;
            }
        }
        return false;
    }

    public Wzhcq_CheckUpHasMathMajong(Wzhcq_mahjong: MahjongTile, Wzhcq_newPos = null, Wzhcq_moveGroup = null): MahjongTile {
        let Wzhcq_currentPos = Wzhcq_newPos ? Wzhcq_newPos : Wzhcq_mahjong.GetMahjongData().GetPos();
        let Wzhcq_start: number = Wzhcq_currentPos.y;
        for (let i = Wzhcq_start - 1; i >= 0; i--) {
            let Wzhcq_pos: MahjongPos = { x: Wzhcq_currentPos.x, y: i };
            let Wzhcq_targetMahjong = this.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
            if (Wzhcq_targetMahjong) {
                if (!this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup)) {
                    return null;
                }
                else {
                    return this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup);
                }
            }
            else {
                continue;
            }
        }
        return null;
    }

    public Wzhcq_CheckDownHasMathMajong(Wzhcq_mahjong: MahjongTile, Wzhcq_newPos = null, Wzhcq_moveGroup = null) {
        let Wzhcq_currentPos = Wzhcq_newPos ? Wzhcq_newPos : Wzhcq_mahjong.GetMahjongData().GetPos();
        let Wzhcq_start: number = Wzhcq_currentPos.y;
        for (let i = Wzhcq_start + 1; i <= this.Wzhcq_Row - 1; i++) {
            let Wzhcq_pos: MahjongPos = { x: Wzhcq_currentPos.x, y: i };
            let Wzhcq_targetMahjong = this.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
            if (Wzhcq_targetMahjong) {
                if (!this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup)) {
                    return null;
                }
                else {
                    return this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup);
                }
            }
            else {
                continue;
            }
        }
        return null;
    }

    public Wzhcq_CheckLeftHasMathMajong(Wzhcq_mahjong: MahjongTile, Wzhcq_newPos = null, Wzhcq_moveGroup = null): MahjongTile {
        let Wzhcq_currentPos = Wzhcq_newPos ? Wzhcq_newPos : Wzhcq_mahjong.GetMahjongData().GetPos();
        let Wzhcq_start: number = Wzhcq_currentPos.x;
        for (let i = Wzhcq_start - 1; i >= 0; i--) {
            let Wzhcq_pos: MahjongPos = { x: i, y: Wzhcq_currentPos.y };
            let Wzhcq_targetMahjong = this.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
            if (Wzhcq_targetMahjong) {
                if (!this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup)) {
                    return null;
                }
                else {
                    return this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup);
                }
            }
            else {
                continue;
            }
        }
        return null;
    }

    public Wzhcq_CheckRightHasMathMajong(Wzhcq_mahjong: MahjongTile, Wzhcq_newPos = null, Wzhcq_moveGroup = null) {
        let Wzhcq_currentPos = Wzhcq_newPos ? Wzhcq_newPos : Wzhcq_mahjong.GetMahjongData().GetPos();
        let Wzhcq_start: number = Wzhcq_currentPos.x;
        for (let i = Wzhcq_start + 1; i <= this.Wzhcq_Col - 1; i++) {
            let Wzhcq_pos: MahjongPos = { x: i, y: Wzhcq_currentPos.y };
            let Wzhcq_targetMahjong = this.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
            if (Wzhcq_targetMahjong) {
                if (!this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup)) {
                    return null;
                }
                else {
                    return this.CheckHasMathMahjong(Wzhcq_mahjong, Wzhcq_targetMahjong, Wzhcq_moveGroup);
                }
            }
            else {
                continue;
            }
        }
        return null;
    }

    public CheckHasMahjong(Wzhcq_key: string) {
        return this.Wzhcq_MahjongList[Wzhcq_key];
    }

    private CheckHasMathMahjong(Wzhcq_mahjong: MahjongTile, Wzhcq_target: MahjongTile, Wzhcq_moveGroup = null) {
        if (!Wzhcq_mahjong) {
            return null;
        }
        else {
            return Wzhcq_mahjong.CheckIsMatch(Wzhcq_target);
        }
    }

    public FindFirstGrid(Wzhcq_pos: any, Wzhcq_dir: any, Wzhcq_keylist: any) {
        if (Wzhcq_dir === DIR.UP) {
            for (let i = Wzhcq_pos.y - 1; i >= 0; i--) {
                let Wzhcq_posJson = { x: Wzhcq_pos.x, y: i };
                for (let j = 0; j < Wzhcq_keylist.length; j++) {
                    const Wzhcq_element = JSON.parse(Wzhcq_keylist[j]);
                    if (Wzhcq_posJson.x === Wzhcq_element.x && Wzhcq_posJson.y === Wzhcq_element.y) {
                        return Wzhcq_keylist[j];
                    }
                }
            }
            return null;
        }
        else if (Wzhcq_dir === DIR.DOWN) {
            for (let i = Wzhcq_pos.y + 1; i <= this.Wzhcq_Row - 1; i++) {
                let Wzhcq_posJson = { x: Wzhcq_pos.x, y: i };
                for (let j = 0; j < Wzhcq_keylist.length; j++) {
                    const Wzhcq_element = JSON.parse(Wzhcq_keylist[j]);
                    if (Wzhcq_posJson.x === Wzhcq_element.x && Wzhcq_posJson.y === Wzhcq_element.y) {
                        return Wzhcq_keylist[j];
                    }
                }
            }
            return null;
        }
        else if (Wzhcq_dir === DIR.LEFT) {
            for (let i = Wzhcq_pos.x - 1; i >= 0; i--) {
                let Wzhcq_posJson = { x: i, y: Wzhcq_pos.y };
                for (let j = 0; j < Wzhcq_keylist.length; j++) {
                    const Wzhcq_element = JSON.parse(Wzhcq_keylist[j]);
                    if (Wzhcq_posJson.x === Wzhcq_element.x && Wzhcq_posJson.y === Wzhcq_element.y) {
                        return Wzhcq_keylist[j];
                    }
                }
            }
            return null;
        }
        else if (Wzhcq_dir === DIR.RIGHT) {
            for (let i = Wzhcq_pos.x + 1; i <= this.Wzhcq_Col - 1; i++) {
                let Wzhcq_posJson = { x: i, y: Wzhcq_pos.y };
                for (let j = 0; j < Wzhcq_keylist.length; j++) {
                    const Wzhcq_element = JSON.parse(Wzhcq_keylist[j]);
                    if (Wzhcq_posJson.x === Wzhcq_element.x && Wzhcq_posJson.y === Wzhcq_element.y) {
                        return Wzhcq_keylist[j];
                    }
                }
            }
            return null;
        }
    }

    public GetGridPos(Wzhcq_pos: any, Wzhcq_list: any) {
        return this.FindFirstGrid(Wzhcq_pos, DIR.UP, Wzhcq_list) ||
            this.FindFirstGrid(Wzhcq_pos, DIR.DOWN, Wzhcq_list) ||
            this.FindFirstGrid(Wzhcq_pos, DIR.LEFT, Wzhcq_list) ||
            this.FindFirstGrid(Wzhcq_pos, DIR.RIGHT, Wzhcq_list);
    }

    public FindMatchMahjongInCurrentLst(Wzhcq_mahjong: any, Wzhcq_currentLst: any) {
        for (let i = 0; i < Wzhcq_currentLst.length; i++) {
            const Wzhcq_element = Wzhcq_currentLst[i];
            if (Wzhcq_mahjong.Suit === Wzhcq_element.Suit && Wzhcq_mahjong.Num === Wzhcq_element.Num) {
                let Wzhcq_tmp = Wzhcq_currentLst[i];
                Wzhcq_currentLst.splice(i, 1);
                return Wzhcq_tmp;
            }
        }
    }

    public Wzhcq_ShuffleTiles() {
        this.hideGuide();
        this.IsGuide();

        let self = this;
        this.createShuffleCards();
    }

    xiaopai_noRepeat(arr: any) {
        let result = [];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[i].MahjongData.Id == arr[j].MahjongData.Id && i != j && this.checkArr(result, arr[j].MahjongData)) {
                    result.push(arr[j]);
                    break;
                }
            }
        }
        return result;
    }

    noRepeat(arr: any) {
        let result = [];
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[i].Id == arr[j].Id && i != j && this.checkArr(result, arr[j])) {
                    result.push(arr[j]);
                    break;
                }
            }
        }
        return result;
    }

    checkArr(arr: any, value: any) {
        let bool = true;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Pos == value.Pos) {
                bool = false;
            }
        }
        return bool;
    }

    compareFunc(array: any, array2: any) {
        var result = [];
        for (var key in array) {
            var stra = array[key];
            var count = 0;
            for (var j = 0; j < array2.length; j++) {
                var strb = array2[j];
                if (JSON.parse(stra).x == strb.Pos.x && JSON.parse(stra).y == strb.Pos.y) {
                    count++;
                }
            }
            if (count === 0) { //表示数组1的这个值没有重复的，放到arr3列表中
                result.push(stra);
            }
        }
        return result;
    }

    shuffleEvent() {
        let self = this;
        if (Utils.getInstance.GameType == 5) {
            self.Wzhcq_game_isDownTime = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            self.Wzhcq_game_isDownTime = true;
        }

        let Wzhcq_currentList = [];
        let Wzhcq_currentKey = [];
        for (let key in self.Wzhcq_MahjongList) {
            let Wzhcq_element = self.Wzhcq_MahjongList[key];
            Wzhcq_currentList.push(Wzhcq_element.GetMahjongData());
            self.Wzhcq_MahjongList[key].Remove();
            Wzhcq_currentKey.push(key);
        }
        self.Wzhcq_MahjongList = {};

        let Wzhcq_count = 3;
        if (Wzhcq_currentList.length > 30) {
            if (Utils.getInstance.GameType == 2) {
                Wzhcq_count = 3;
            }
            else if (Utils.getInstance.GameType == 3) {
                Wzhcq_count = 3;
            }
            else if (Utils.getInstance.GameType == 4) {
                Wzhcq_count = 3;
            }
            else if (Utils.getInstance.GameType == 5) {
                Wzhcq_count = 3;
            }
            else if (Utils.getInstance.GameType == 6) {
                Wzhcq_count = 3;
            }
        }
        else if (Wzhcq_currentList.length > 6) {
            Wzhcq_count = 3;
        }
        else if (Wzhcq_currentList.length > 4) {
            Wzhcq_count = 2;
        }
        else {
            Wzhcq_count = 1;
        }

        // console.log("Wzhcq_currentList:", Wzhcq_currentList);

        if (Wzhcq_currentList.length > 0) {
            if (Wzhcq_currentList.length % 2 != 0) {
                console.log("剩余牌面为奇数！");

                var hash = this.noRepeat(Wzhcq_currentList);
                console.log("hash:", hash);

                Wzhcq_currentList = hash;

                let result = this.compareFunc(Wzhcq_currentKey, Wzhcq_currentList);
                console.log("result:", result);

                for (let i = 0; i < Wzhcq_currentKey.length; i++) {
                    if (Wzhcq_currentKey[i] == result) {
                        Wzhcq_currentKey.splice(i, 1)
                    }
                }
            }

            self.shuffleCount += 1;
            self.scheduleOnce(() => {
                let Wzhcq_newList: any;
                if (Utils.getInstance.GameType == 7) {
                    Wzhcq_newList = self.Wzhcq_mahjongManager2.ShuffleArray(Wzhcq_currentList, Wzhcq_count);
                }
                else {
                    Wzhcq_newList = self.Wzhcq_mahjongManager.Wzhcq_ShuffleArray(Wzhcq_currentList, Wzhcq_count);
                }

                // console.log('gridList = ', self.Wzhcq_GridList);
                for (let i = 0; i < Wzhcq_newList.length; i++) {
                    const Wzhcq_data = Wzhcq_newList[i];
                    let Wzhcq_key = Wzhcq_currentKey[i];
                    let Wzhcq_mahjong = self.CreateMahjong(Wzhcq_data, JSON.parse(Wzhcq_key));
                    self.Wzhcq_MahjongList[Wzhcq_key] = Wzhcq_mahjong;

                    if (Utils.getInstance.GameType == 7) {
                        self.Wzhcq_specialGridNode[Utils.getInstance.StoreyIndex].addChild(Wzhcq_mahjong.node);
                    }
                    else {
                        self.Wzhcq_GridNode.addChild(Wzhcq_mahjong.node);
                    }

                    let Wzhcq_pos: cc.Vec3 = cc.v3(self.Wzhcq_GridList[Wzhcq_key].x, self.Wzhcq_GridList[Wzhcq_key].y, 0);
                    Wzhcq_mahjong.node.scaleX = 0;
                    Wzhcq_mahjong.node.position = Wzhcq_pos;
                    Wzhcq_mahjong.SetLocalPos(Wzhcq_pos);
                    Wzhcq_mahjong.SetLocalKey(Wzhcq_mahjong.GetPosKey());
                    Wzhcq_mahjong.UpdateView();
                    if (Utils.getInstance.GameType == 4) {
                        Wzhcq_mahjong.node.runAction(cc.scaleTo(0.15, Utils.getInstance.levelData[Utils.getInstance.Level].scale, Utils.getInstance.levelData[Utils.getInstance.Level].scale));
                    }
                    else if (Utils.getInstance.GameType == 1 ||
                        Utils.getInstance.GameType == 2 ||
                        Utils.getInstance.GameType == 3 ||
                        Utils.getInstance.GameType == 5 ||
                        Utils.getInstance.GameType == 7) {
                        if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                            Wzhcq_mahjong.node.runAction(cc.scaleTo(0.15, 0.9, 0.9));
                        }
                        else {
                            Wzhcq_mahjong.node.runAction(cc.scaleTo(0.15, Utils.getInstance.levelData[Utils.getInstance.Level].scale, Utils.getInstance.levelData[Utils.getInstance.Level].scale));
                        }

                    }
                    else if (Utils.getInstance.GameType == 6) {
                        if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                            Wzhcq_mahjong.node.runAction(cc.scaleTo(0.15, 0.9, 0.9));
                        }
                        else {
                            Wzhcq_mahjong.node.runAction(cc.scaleTo(0.15, Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale, Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale));
                        }
                    }
                    else if (Utils.getInstance.GameType == 7) {
                        Wzhcq_mahjong.node.runAction(cc.scaleTo(0.15, cfg[Utils.getInstance.StoreyIndex].scale, cfg[Utils.getInstance.StoreyIndex].scale));
                    }
                }
                self.Wzhcq_TipResult = [];
                self.getResultData();
                self.Wzhcq_resetGuideData(1);

                // self.GetCanRemoveCount(true);
                self.saveGameData();
                if (self.shuffleCount < 3) {
                    self.Wzhcq_chenkGameOver(true, self.shuffleEvent);
                }
                else {
                    self.shuffleCount = 0;
                }
            }, 0.3);
        }
    }

    protected OnBtnShuffleTilesClick() {
        AudioManager.instance.playAudioBtn_Click();
        this.hideShuffleTip();

        if (this.mahjongTouchState) {
            if (Object.keys(this.Wzhcq_MahjongList).length > 2) {
                let Wzhcq_GameType = Utils.getInstance.GameType;
                if (Wzhcq_GameType == 1) {
                    this.Wzhcq_ShuffleTiles();
                }
                else {
                    if (this.Wzhcq_shuffleMaskNode) {
                        this.Wzhcq_shuffleMaskNode.active = false;
                    }

                    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                        this.Wzhcq_ShuffleTiles();
                    }
                    else {
                        let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
                        if (Wzhcq_PropShuffleTiles > 0) {
                            Utils.getInstance.usePropShuffleTiles += 1;
                            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles, Wzhcq_PropShuffleTiles - 1);
                            this.Wzhcq_ShuffleTiles();
                            this.changePropNum();
                        }
                        else {
                            if (this.Wzhcq_isclick) {
                                this.Wzhcq_isclick = false;
                            }
                            this.Wzhcq_game_isDownTime = false;
                            this.Wzhcq_isDownTime = false;
                            this.Wzhcq_ShuffleTipState = false;

                            let avtype = 2;
                            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                                if (data == 1) {
                                    //激励视频完整播放 需要做的奖励；
                                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                                    Utils.getInstance.VideoShuffleTiles += 1;

                                    Utils.getInstance.sjd_close_rewardav(avtype, true);

                                    this.Wzhcq_ShuffleTiles();
                                    this.Wzhcq_isclick = true;

                                    if (Utils.getInstance.GameType == 3) {
                                        Utils.getInstance.isEnergyLookVideo = 1;
                                    }
                                }
                                else if (data == 2) {
                                    wx.showToast({
                                        title: '暂时没有广告了,请稍后再试',
                                        icon: 'none',
                                    });
                                    if (Utils.getInstance.GameType == 5) {
                                        this.Wzhcq_game_isDownTime = true;
                                    }
                                    else if (Utils.getInstance.GameType == 6) {
                                        this.Wzhcq_game_isDownTime = true;
                                    }
                                    this.Wzhcq_isclick = true;
                                }
                                else if (data == 0) {
                                    wx.showToast({
                                        title: '播放中途退出',
                                        icon: 'none',
                                    });
                                    if (Utils.getInstance.GameType == 5) {
                                        this.Wzhcq_game_isDownTime = true;
                                    }
                                    else if (Utils.getInstance.GameType == 6) {
                                        this.Wzhcq_game_isDownTime = true;
                                    }
                                    this.Wzhcq_isclick = true;

                                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                                }

                                this.Wzhcq_isDownTime = true;
                                this.Wzhcq_add_time = 30;
                                this.Wzhcq_ShuffleTipState = true;
                                this.resetShuffleTipData();
                            });
                        }
                    }
                }
            }
            else {
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "当前牌局不需要洗牌");
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "炸弹期间不能洗牌");
        }
    }

    public findElementsInDirection(Wzhcq_mahjong: MahjongTile, Wzhcq_dir: DIR): any {
        let Wzhcq_elementList = {};
        let Wzhcq_currentPos: MahjongPos = Wzhcq_mahjong.GetMahjongData().GetPos();

        if (Wzhcq_dir === DIR.UP) {
            while (Wzhcq_currentPos.y > 0) {
                let Wzhcq_nextPos: MahjongPos = {
                    x: Wzhcq_currentPos.x,
                    y: Wzhcq_currentPos.y - 1,
                };
                let Wzhcq_nextMahjong: MahjongTile = this.CheckHasMahjong(JSON.stringify(Wzhcq_nextPos));
                if (!Wzhcq_nextMahjong) {
                    Wzhcq_elementList[Wzhcq_mahjong.LocalKey] = Wzhcq_mahjong;
                    break;
                }
                else {
                    Wzhcq_elementList[Wzhcq_nextMahjong.LocalKey] = Wzhcq_nextMahjong;
                    Wzhcq_currentPos = Wzhcq_nextPos;
                    if (Wzhcq_nextPos.y === 0) {
                        Wzhcq_elementList = [];
                    }
                }
            }
            return Wzhcq_elementList;
        }
        else if (Wzhcq_dir === DIR.DOWN) {
            while (Wzhcq_currentPos.y < this.Wzhcq_Row - 1) {
                let Wzhcq_nextPos: MahjongPos = {
                    x: Wzhcq_currentPos.x,
                    y: Wzhcq_currentPos.y + 1,
                };
                let Wzhcq_nextMahjong: MahjongTile = this.CheckHasMahjong(JSON.stringify(Wzhcq_nextPos));
                if (!Wzhcq_nextMahjong) {
                    Wzhcq_elementList[Wzhcq_mahjong.LocalKey] = Wzhcq_mahjong;

                    break;
                }
                else {
                    Wzhcq_elementList[Wzhcq_nextMahjong.LocalKey] = Wzhcq_nextMahjong;
                    Wzhcq_currentPos = Wzhcq_nextPos;
                    if (Wzhcq_nextPos.y === this.Wzhcq_Row - 1) {
                        Wzhcq_elementList = [];
                    }
                }
            }
            return Wzhcq_elementList;
        }
        else if (Wzhcq_dir === DIR.LEFT) {
            while (Wzhcq_currentPos.x > 0) {
                let Wzhcq_nextPos: MahjongPos = {
                    x: Wzhcq_currentPos.x - 1,
                    y: Wzhcq_currentPos.y,
                };
                let Wzhcq_nextMahjong: MahjongTile = this.CheckHasMahjong(JSON.stringify(Wzhcq_nextPos));
                if (!Wzhcq_nextMahjong) {
                    Wzhcq_elementList[Wzhcq_mahjong.LocalKey] = Wzhcq_mahjong;
                    break;
                }
                else {
                    Wzhcq_elementList[Wzhcq_nextMahjong.LocalKey] = Wzhcq_nextMahjong;
                    Wzhcq_currentPos = Wzhcq_nextPos;
                    if (Wzhcq_nextPos.x === 0) {
                        Wzhcq_elementList = [];
                    }
                }
            }
            return Wzhcq_elementList;
        }
        else if (Wzhcq_dir === DIR.RIGHT) {
            while (Wzhcq_currentPos.x < this.Wzhcq_Col - 1) {
                let Wzhcq_nextPos: MahjongPos = {
                    x: Wzhcq_currentPos.x + 1,
                    y: Wzhcq_currentPos.y,
                };
                let Wzhcq_nextMahjong: MahjongTile = this.CheckHasMahjong(JSON.stringify(Wzhcq_nextPos));
                if (!Wzhcq_nextMahjong) {
                    Wzhcq_elementList[Wzhcq_mahjong.LocalKey] = Wzhcq_mahjong;
                    break;
                }
                else {
                    Wzhcq_elementList[Wzhcq_nextMahjong.LocalKey] = Wzhcq_nextMahjong;
                    Wzhcq_currentPos = Wzhcq_nextPos;
                    if (Wzhcq_nextPos.x === this.Wzhcq_Col - 1) {
                        Wzhcq_elementList = [];
                    }
                }
            }
            return Wzhcq_elementList;
        }
    }

    public UpdateCheckMap() {
        this.Wzhcq_CheckMap = Array(this.Wzhcq_CheckMap.length)
            .fill(0)
            .map(() => Array(this.Wzhcq_CheckMap[0].length).fill(0));

        for (let [Wzhcq_key, value] of Object.entries(this.Wzhcq_MahjongList)) {
            let Wzhcq_pos = JSON.parse(Wzhcq_key);
            this.Wzhcq_CheckMap[Wzhcq_pos.y][Wzhcq_pos.x] = 1;
        }

        // console.log('CheckMap', this.CheckMap);
    }

    private CheckNeighborCanRemove(Wzhcq_mahjong: MahjongTile) {
        return this.Wzhcq_CheckNeighbor(Wzhcq_mahjong, 0, -1) ||
            this.Wzhcq_CheckNeighbor(Wzhcq_mahjong, 0, 1) ||
            this.Wzhcq_CheckNeighbor(Wzhcq_mahjong, -1, 0) ||
            this.Wzhcq_CheckNeighbor(Wzhcq_mahjong, 1, 0);
    }

    public Wzhcq_FindGrid(Wzhcq_mahjong: any, Wzhcq_dir: any) {
        let Wzhcq_grids = [];
        if (Wzhcq_dir === DIR.RIGHT) {
            // let count = (mahjong.moveMaxX - mahjong.moveMinX) / mahjong.node.width + 1;
            let Wzhcq_count = (Wzhcq_mahjong.moveMaxX - Wzhcq_mahjong.moveMinX) / Wzhcq_mahjong.getSize().width + 1;
            Wzhcq_count = Math.round(Wzhcq_count);

            let Wzhcq_value = Wzhcq_mahjong.node.position.x;
            for (let i = 0; i < Wzhcq_count; i++) {
                let Wzhcq_tmp = cc.v3(Wzhcq_value, Wzhcq_mahjong.node.y, 0);
                let Wzhcq_grid = this.GetInPosGrid(Wzhcq_tmp);
                // value += mahjong.node.width;
                Wzhcq_value += Wzhcq_mahjong.getSize().width;

                if (Wzhcq_grid) {
                    Wzhcq_grids.push(Wzhcq_grid);
                }
            }
            return Wzhcq_grids;
        }
        else if (Wzhcq_dir === DIR.LEFT) {
            // let count = (mahjong.moveMaxX - mahjong.moveMinX) / mahjong.node.width + 1;
            let Wzhcq_count = (Wzhcq_mahjong.moveMaxX - Wzhcq_mahjong.moveMinX) / Wzhcq_mahjong.getSize().width + 1;
            Wzhcq_count = Math.round(Wzhcq_count);

            let Wzhcq_value = Wzhcq_mahjong.node.position.x;
            for (let i = 0; i < Wzhcq_count; i++) {
                let Wzhcq_tmp = cc.v3(Wzhcq_value, Wzhcq_mahjong.node.y, 0);
                let Wzhcq_grid = this.GetInPosGrid(Wzhcq_tmp);
                // value -= mahjong.node.width;
                Wzhcq_value -= Wzhcq_mahjong.getSize().width;

                if (Wzhcq_grid) {
                    Wzhcq_grids.push(Wzhcq_grid);
                }
            }
            return Wzhcq_grids;
        }
        else if (Wzhcq_dir === DIR.UP) {
            // let count = (mahjong.moveMaxY - mahjong.moveMinY) / mahjong.node.height + 1;
            let Wzhcq_count = (Wzhcq_mahjong.moveMaxY - Wzhcq_mahjong.moveMinY) / Wzhcq_mahjong.getSize().height + 1;
            Wzhcq_count = Math.round(Wzhcq_count);

            let Wzhcq_value = Wzhcq_mahjong.node.position.y;
            for (let i = 0; i < Wzhcq_count; i++) {
                let Wzhcq_tmp = cc.v3(Wzhcq_mahjong.node.x, Wzhcq_value, 0);
                let Wzhcq_grid = this.GetInPosGrid(Wzhcq_tmp);
                // value += mahjong.node.height;
                Wzhcq_value += Wzhcq_mahjong.getSize().height;

                if (Wzhcq_grid) {
                    Wzhcq_grids.push(Wzhcq_grid);
                }
            }
            return Wzhcq_grids;
        }
        else if (Wzhcq_dir === DIR.DOWN) {
            // let count = (mahjong.moveMaxY - mahjong.moveMinY) / mahjong.node.height + 1;
            let Wzhcq_count = (Wzhcq_mahjong.moveMaxY - Wzhcq_mahjong.moveMinY) / Wzhcq_mahjong.getSize().height + 1;
            Wzhcq_count = Math.round(Wzhcq_count);
            let Wzhcq_value = Wzhcq_mahjong.node.position.y;
            for (let i = 0; i < Wzhcq_count; i++) {
                let Wzhcq_tmp = cc.v3(Wzhcq_mahjong.node.x, Wzhcq_value, 0);
                let Wzhcq_grid = this.GetInPosGrid(Wzhcq_tmp);
                // value -= mahjong.node.height;
                Wzhcq_value -= Wzhcq_mahjong.getSize().height;

                if (Wzhcq_grid) {
                    Wzhcq_grids.push(Wzhcq_grid);
                }
            }
            return Wzhcq_grids;
        }
    }

    public Wzhcq_getUpCanMoveGrids(Wzhcq_mahjong: any, Wzhcq_getGroup = false) {
        Wzhcq_mahjong.MoveUpGroup = this.findElementsInDirection(Wzhcq_mahjong, DIR.UP);
        Wzhcq_mahjong.SetMoveGroup(Wzhcq_mahjong.MoveUpGroup, DIR.UP);
        if (!Wzhcq_getGroup) {
            return Object.keys(Wzhcq_mahjong.MoveUpGroup).length > 0 ? this.Wzhcq_FindGrid(Wzhcq_mahjong, DIR.UP) : [];
        }
        else {
            return Wzhcq_mahjong.MoveUpGroup;
        }
    }

    public Wzhcq_getDownCanMoveGrids(Wzhcq_mahjong: any, Wzhcq_getGroup = false) {
        Wzhcq_mahjong.MoveDownGroup = this.findElementsInDirection(Wzhcq_mahjong, DIR.DOWN);
        Wzhcq_mahjong.SetMoveGroup(Wzhcq_mahjong.MoveDownGroup, DIR.DOWN);
        if (!Wzhcq_getGroup) {
            return Object.keys(Wzhcq_mahjong.MoveDownGroup).length > 0 ? this.Wzhcq_FindGrid(Wzhcq_mahjong, DIR.DOWN) : [];
        }
        else {
            return Wzhcq_mahjong.MoveDownGroup;
        }
    }

    public Wzhcq_getLeftCanMoveGrids(Wzhcq_mahjong: any, Wzhcq_getGroup = false) {
        Wzhcq_mahjong.MoveLefGroup = this.findElementsInDirection(Wzhcq_mahjong, DIR.LEFT);
        Wzhcq_mahjong.SetMoveGroup(Wzhcq_mahjong.MoveLefGroup, DIR.LEFT);
        if (!Wzhcq_getGroup) {
            if (Object.keys(Wzhcq_mahjong.MoveLefGroup).length > 0) {
                return this.Wzhcq_FindGrid(Wzhcq_mahjong, DIR.LEFT);
            }
            else {
                return [];
            }
        }
        else {
            return Wzhcq_mahjong.MoveLefGroup;
        }
    }

    public Wzhcq_getRightCanMoveGrids(Wzhcq_mahjong: any, Wzhcq_getGroup = false) {
        Wzhcq_mahjong.MoveRightGroup = this.findElementsInDirection(Wzhcq_mahjong, DIR.RIGHT);
        Wzhcq_mahjong.SetMoveGroup(Wzhcq_mahjong.MoveRightGroup, DIR.RIGHT);
        if (!Wzhcq_getGroup) {
            if (Object.keys(Wzhcq_mahjong.MoveRightGroup).length > 0) {
                return this.Wzhcq_FindGrid(Wzhcq_mahjong, DIR.RIGHT);
            }
            else {
                return [];
            }
        }
        else {
            return Wzhcq_mahjong.MoveRightGroup;
        }
    }

    public getAllVerticalList(Wzhcq_mahjong: any) {
        let Wzhcq_allGrids = [];
        let Wzhcq_uplist = this.Wzhcq_getUpCanMoveGrids(Wzhcq_mahjong);
        let Wzhcq_downlist = this.Wzhcq_getDownCanMoveGrids(Wzhcq_mahjong);
        for (let i = 0; i < Wzhcq_uplist.length; i++) {
            const Wzhcq_element = Wzhcq_uplist[i];
            Wzhcq_allGrids.push(Wzhcq_element);
        }
        for (let i = 0; i < Wzhcq_downlist.length; i++) {
            const Wzhcq_element = Wzhcq_downlist[i];
            Wzhcq_allGrids.push(Wzhcq_element);
        }
        return Wzhcq_allGrids;
    }

    public getAllHorizontalList(Wzhcq_mahjong: any) {
        let Wzhcq_allGrids = [];

        let Wzhcq_leftlist = this.Wzhcq_getLeftCanMoveGrids(Wzhcq_mahjong);

        let Wzhcq_rightlist = this.Wzhcq_getRightCanMoveGrids(Wzhcq_mahjong);

        for (let i = 0; i < Wzhcq_leftlist.length; i++) {
            const Wzhcq_element = Wzhcq_leftlist[i];
            Wzhcq_allGrids.push(Wzhcq_element);
        }
        for (let i = 0; i < Wzhcq_rightlist.length; i++) {
            const Wzhcq_element = Wzhcq_rightlist[i];
            Wzhcq_allGrids.push(Wzhcq_element);
        }
        return Wzhcq_allGrids;
    }

    getResultData() {
        this.Wzhcq_StartTipResult = [];
        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[Wzhcq_key];
            let Wzhcq_matchleft = this.Wzhcq_CheckLeftHasMathMajong(Wzhcq_element);
            let Wzhcq_matchdown = this.Wzhcq_CheckDownHasMathMajong(Wzhcq_element);
            let Wzhcq_matchright = this.Wzhcq_CheckRightHasMathMajong(Wzhcq_element);
            let Wzhcq_matchup = this.Wzhcq_CheckUpHasMathMajong(Wzhcq_element);
            if (Wzhcq_matchleft) {
                this.saveResuleData(Wzhcq_element, Wzhcq_matchleft);
            }
            if (Wzhcq_matchdown) {
                this.saveResuleData(Wzhcq_element, Wzhcq_matchdown);
            }
            if (Wzhcq_matchright) {
                this.saveResuleData(Wzhcq_element, Wzhcq_matchright);
            }
            if (Wzhcq_matchup) {
                this.saveResuleData(Wzhcq_element, Wzhcq_matchup);
            }
        }
    }

    saveResuleData(Wzhcq_element: any, Wzhcq_data: any) {
        // let Wzhcq_key = Wzhcq_data.GetMahjongData().Suit + '_' + Wzhcq_data.GetMahjongData().Num;
        // if (!this.Wzhcq_StartTipResult.hasOwnProperty(Wzhcq_key)) {
        //     this.Wzhcq_StartTipResult[Wzhcq_key] = [];
        //     this.Wzhcq_StartTipResult[Wzhcq_key].push(Wzhcq_data);
        // }
        // else {
        //     this.Wzhcq_StartTipResult[Wzhcq_key].push(Wzhcq_data);
        // }
        let array = [];
        array.push(Wzhcq_element);
        array.push(Wzhcq_data);
        this.Wzhcq_StartTipResult.push(array);
    }

    public GetCanRemoveCount(Wzhcq_needShow: any) {
        this.Wzhcq_zhadanList = [];
        this.Wzhcq_TipResult = [];
        this.hideGuide();
        this.getResultData();
        if (Utils.getInstance.GameType == 5) {
            this.Wzhcq_game_isDownTime = true;
        }
        else if (Utils.getInstance.GameType == 6) {
            this.Wzhcq_game_isDownTime = true;
        }
        let Wzhcq_canCout = 0;
        let result = [];
        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[Wzhcq_key];
            let Wzhcq_matchleft = this.Wzhcq_CheckLeftHasMathMajong(Wzhcq_element);
            let Wzhcq_matchdown = this.Wzhcq_CheckDownHasMathMajong(Wzhcq_element);
            let Wzhcq_matchright = this.Wzhcq_CheckRightHasMathMajong(Wzhcq_element);
            let Wzhcq_matchup = this.Wzhcq_CheckUpHasMathMajong(Wzhcq_element);
            if (Wzhcq_matchleft) {
                Wzhcq_matchleft.SetTipNodeVisible(Wzhcq_needShow);
                Wzhcq_canCout++;
                this.Wzhcq_zhadanList.push(Wzhcq_matchleft);
            }
            if (Wzhcq_matchdown) {
                Wzhcq_matchdown.SetTipNodeVisible(Wzhcq_needShow);
                Wzhcq_canCout++;
                this.Wzhcq_zhadanList.push(Wzhcq_matchdown);
            }
            if (Wzhcq_matchright) {
                Wzhcq_matchright.SetTipNodeVisible(Wzhcq_needShow);
                Wzhcq_canCout++;
                this.Wzhcq_zhadanList.push(Wzhcq_matchright);
            }
            if (Wzhcq_matchup) {
                Wzhcq_matchup.SetTipNodeVisible(Wzhcq_needShow);
                Wzhcq_canCout++;
                this.Wzhcq_zhadanList.push(Wzhcq_matchup);
            }

            let Wzhcq_data = {};

            // let verticalList = this.getAllVerticalList(element);
            Wzhcq_data['self'] = Wzhcq_element;
            Wzhcq_data['upMoveGroup'] = this.Wzhcq_getUpCanMoveGrids(Wzhcq_element, true);
            Wzhcq_data['downMoveGroup'] = this.Wzhcq_getDownCanMoveGrids(Wzhcq_element, true);
            Wzhcq_data['leftMoveGroup'] = this.Wzhcq_getLeftCanMoveGrids(Wzhcq_element, true);
            Wzhcq_data['rightMoveGroup'] = this.Wzhcq_getRightCanMoveGrids(Wzhcq_element, true);

            let Wzhcq_uplist = this.Wzhcq_getUpCanMoveGrids(Wzhcq_element);
            let Wzhcq_downlist = this.Wzhcq_getDownCanMoveGrids(Wzhcq_element);

            Wzhcq_uplist.forEach(Wzhcq_grid => {
                let Wzhcq_pos = JSON.parse(Wzhcq_grid.key);
                let Wzhcq_matchRight = this.Wzhcq_CheckRightHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchRight) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchRight;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'up';
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_matchRight.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchRight);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
                let Wzhcq_matchLeft = this.Wzhcq_CheckLeftHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchLeft) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchLeft;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'up';
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_matchLeft.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchLeft);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
            });

            Wzhcq_downlist.forEach(Wzhcq_grid => {
                let Wzhcq_pos = JSON.parse(Wzhcq_grid.key);
                let Wzhcq_matchRight = this.Wzhcq_CheckRightHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchRight) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchRight;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'down';
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_matchRight.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchRight);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
                let Wzhcq_matchLeft = this.Wzhcq_CheckLeftHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchLeft) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchLeft;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'down';
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_matchLeft.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchLeft);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
            });

            let Wzhcq_leftlist = this.Wzhcq_getLeftCanMoveGrids(Wzhcq_element);
            let Wzhcq_rightlist = this.Wzhcq_getRightCanMoveGrids(Wzhcq_element);

            Wzhcq_leftlist.forEach(Wzhcq_grid => {
                let Wzhcq_pos = JSON.parse(Wzhcq_grid.key);
                let Wzhcq_matchUp = this.Wzhcq_CheckUpHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchUp) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchUp;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'left';
                    Wzhcq_matchUp.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchUp);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
                let Wzhcq_matchDown = this.Wzhcq_CheckDownHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchDown) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchDown;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'left';
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_matchDown.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchDown);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
            });

            Wzhcq_rightlist.forEach(Wzhcq_grid => {
                let Wzhcq_pos = JSON.parse(Wzhcq_grid.key);
                let Wzhcq_matchUp = this.Wzhcq_CheckUpHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchUp) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchUp;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'right';
                    Wzhcq_matchUp.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchUp);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
                let Wzhcq_matchDown = this.Wzhcq_CheckDownHasMathMajong(Wzhcq_element, Wzhcq_pos);
                if (Wzhcq_matchDown) {
                    Wzhcq_data['matchMahjong'] = Wzhcq_matchDown;
                    Wzhcq_data['endPos'] = Wzhcq_pos;
                    Wzhcq_data['moveDir'] = 'right';
                    this.Wzhcq_TipResult.push(Wzhcq_data);
                    Wzhcq_matchDown.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_element.SetTipNodeVisible(Wzhcq_needShow);
                    Wzhcq_canCout++;
                    this.Wzhcq_zhadanList.push(Wzhcq_matchDown);
                    this.Wzhcq_zhadanList.push(Wzhcq_element);
                }
            });

        }
        for (let Wzhcq_key2 in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[Wzhcq_key2];
            Wzhcq_element.ResetAllMoveGroup();
        }
        return Wzhcq_canCout;
    }

    protected OnBtnZhaDanClick() {
        this.scheduleOnce(() => {
            for (let Wzhcq_key in this.Wzhcq_MahjongList) {
                let Wzhcq_element = this.Wzhcq_MahjongList[Wzhcq_key];
                delete this.Wzhcq_MahjongList[Wzhcq_element.GetPosKey()];
                delete this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_element.MahjongData.GetPos())];
                Wzhcq_element.Remove();
            }

            this.Wzhcq_chenkGameOver(true, () => { });
            for (let Wzhcq_key2 in this.Wzhcq_MahjongList) {
                this.Wzhcq_MahjongList[Wzhcq_key2].ResetAllMoveGroup();
            }
        }, 1);
    }

    updateGridOpa() {
        this.UpdateCheckMap();
        let Wzhcq_index = 0;
        for (let Wzhcq_i = 0; Wzhcq_i < this.Wzhcq_CheckMap.length; Wzhcq_i++) {
            let Wzhcq_tmp = this.Wzhcq_CheckMap[Wzhcq_i];
            for (let Wzhcq_j = 0; Wzhcq_j < Wzhcq_tmp.length; Wzhcq_j++) {
                let Wzhcq_pos: MahjongPos = {
                    x: Wzhcq_j,
                    y: Wzhcq_i,
                };
                this.Wzhcq_GridList[JSON.stringify(Wzhcq_pos)].opacity = this.Wzhcq_CheckMap[Wzhcq_i][Wzhcq_j] == 0 ? 255 : 0;

                if (Wzhcq_tmp[Wzhcq_j]) {
                    Wzhcq_index++;
                }
            }
        }
    }

    Wzhcq_chenkGameOver(bool: any, callBack: any) {

        this.UpdateCheckMap();
        let Wzhcq_index = 0;

        for (let Wzhcq_i = 0; Wzhcq_i < this.Wzhcq_CheckMap.length; Wzhcq_i++) {
            let Wzhcq_tmp = this.Wzhcq_CheckMap[Wzhcq_i];
            for (let Wzhcq_j = 0; Wzhcq_j < Wzhcq_tmp.length; Wzhcq_j++) {
                let Wzhcq_pos: MahjongPos = {
                    x: Wzhcq_j,
                    y: Wzhcq_i,
                };
                this.Wzhcq_GridList[JSON.stringify(Wzhcq_pos)].opacity = this.Wzhcq_CheckMap[Wzhcq_i][Wzhcq_j] == 0 ? 255 : 0;

                if (Wzhcq_tmp[Wzhcq_j]) {
                    Wzhcq_index++;
                }
            }
        }

        let Wzhcq_currentList = [];
        for (let key in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[key];
            Wzhcq_currentList.push(Wzhcq_element.GetMahjongData());
        }

        if (Wzhcq_currentList.length <= 2) {
            let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
            this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
            this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Button).interactable = false;
        }

        this.gameState = 0;
        let Wzhcq_count = this.GetCanRemoveCount(false);

        if (Wzhcq_currentList.length < 2) {
            //处理还剩一张牌的特殊情况
            if (Utils.getInstance.GameType == 7) {
                if (Utils.getInstance.StoreyIndex < 2) {
                    this.updateStorey();
                }
                else {
                    let Wzhcq_curRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);
                    let Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
                    Wzhcq_allScore += Wzhcq_curRankScore;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, Wzhcq_allScore);
                    AudioManager.instance.playAudioWin();

                    Utils.getInstance.prop_UserInfo();
                }
            }
            else if (Utils.getInstance.GameType != 6) {
                let Wzhcq_curRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);
                let Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
                Wzhcq_allScore += Wzhcq_curRankScore;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, Wzhcq_allScore);
                AudioManager.instance.playAudioWin();

                //闯关模式
                let Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession);
                Utils.getInstance.allSession = Wzhcq_allSession + 1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession, Utils.getInstance.allSession);

                let Wzhcq_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
                Utils.getInstance.victory = Wzhcq_victory + 1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory, Utils.getInstance.victory);

                Utils.getInstance.endTime = Math.round(new Date().getTime() / 1000);
                Utils.getInstance.shortestTime = Utils.getInstance.endTime - Utils.getInstance.startTime;

                Utils.getInstance.highestScore = Wzhcq_curRankScore;

                let Wzhcq_winningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_winningStreak);
                Utils.getInstance.winningStreak = Wzhcq_winningStreak + 1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_winningStreak, Wzhcq_winningStreak + 1);

                Utils.getInstance.prop_UserInfo();
            }

            let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
            this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
            this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Button).interactable = true;
        }
        else {
            if (Wzhcq_count === 0 && bool) {
                if (Wzhcq_index > 0) {

                    if (Utils.getInstance.GameType == 6) {

                        this.scheduleOnce(() => {
                            let count = this.checkMeiRiOver();
                            console.log("连通个数：", count);
                            if (count == 2) {

                            }
                            else {
                                //失败
                                let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
                                if (Wzhcq_PropShuffleTiles > 0) {
                                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEMASK);
                                }
                                else {
                                    this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_FAIL);
                                }
                                AudioManager.instance.playAudioLose();

                                let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
                                this.Wzhcq_btn_TipsNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
                                this.Wzhcq_btn_TipsNode.getComponent(cc.Button).interactable = false;

                                if (callBack) {
                                    callBack();
                                }
                            }
                        }, 0.6);
                    }
                    else {
                        //失败
                        let Wzhcq_PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
                        if (Wzhcq_PropShuffleTiles > 0) {
                            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_SHUFFLEMASK);
                        }
                        else {
                            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_FAIL);
                        }
                        AudioManager.instance.playAudioLose();

                        let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-gray-sprite");
                        this.Wzhcq_btn_TipsNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
                        this.Wzhcq_btn_TipsNode.getComponent(cc.Button).interactable = false;

                        if (callBack) {
                            callBack();
                        }
                    }
                }
                else {
                    //成功
                    if (Utils.getInstance.GameType == 7) {
                        if (Utils.getInstance.StoreyIndex < 2) {
                            this.updateStorey();
                        }
                        else {
                            let Wzhcq_curRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);
                            let Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
                            Wzhcq_allScore += Wzhcq_curRankScore;
                            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, Wzhcq_allScore);
                            AudioManager.instance.playAudioWin();

                            Utils.getInstance.prop_UserInfo();
                        }
                    }
                    else if (Utils.getInstance.GameType != 6) {
                        let Wzhcq_curRankScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_CurRankScore);
                        let Wzhcq_allScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
                        Wzhcq_allScore += Wzhcq_curRankScore;
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_AllRankScore, Wzhcq_allScore);
                        AudioManager.instance.playAudioWin();

                        //闯关模式
                        let Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession);
                        Utils.getInstance.allSession = Wzhcq_allSession + 1;
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession, Utils.getInstance.allSession);

                        let Wzhcq_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
                        Utils.getInstance.victory = Wzhcq_victory + 1;
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory, Utils.getInstance.victory);

                        Utils.getInstance.endTime = Math.round(new Date().getTime() / 1000);
                        Utils.getInstance.shortestTime = Utils.getInstance.endTime - Utils.getInstance.startTime;

                        Utils.getInstance.highestScore = Wzhcq_curRankScore;

                        let Wzhcq_winningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_winningStreak);
                        Utils.getInstance.winningStreak = Wzhcq_winningStreak + 1;
                        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_chuangguan_winningStreak, Wzhcq_winningStreak + 1);

                        Utils.getInstance.prop_UserInfo();
                    }

                    let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
                    this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
                    this.Wzhcq_btn_ShuffleTilesNode.getComponent(cc.Button).interactable = true;
                }
            }
            else {
                let Wzhcq_material = cc.Material.getBuiltinMaterial("2d-sprite");
                this.Wzhcq_btn_TipsNode.getComponent(cc.Sprite).setMaterial(0, Wzhcq_material);
                this.Wzhcq_btn_TipsNode.getComponent(cc.Button).interactable = true;
            }
        }
    }

    Cancellation() {
        if (this.Wzhcq_isContinuous) {
            this.Wzhcq_isContinuous = false;
            let Wzhcq_array = [];
            for (let Wzhcq_key in this.Wzhcq_MahjongList) {
                Wzhcq_array.push(this.Wzhcq_MahjongList[Wzhcq_key]);
            };

            if (Wzhcq_array.length % 2 != 0) {
                console.log("剩余牌面为奇数！");

                var hash = this.xiaopai_noRepeat(Wzhcq_array);
                console.log("hash:", hash);

                Wzhcq_array = hash;

                for (let i = 0; i < Wzhcq_array.length; i++) {
                    if (this.Wzhcq_MahjongList.hasOwnProperty(Wzhcq_array[i].MahjongData.GetPos())) {
                        delete this.Wzhcq_MahjongList[Wzhcq_array[i].LocalKey];
                    }
                }
            }

            if (Wzhcq_array.length == 2) {
                let Wzhcq_randomIndex = Math.floor(Math.random() * Wzhcq_array.length);
                AudioManager.instance.playAudioXiaoPai();
                this.checkMahJong(Wzhcq_randomIndex, Wzhcq_randomIndex, Wzhcq_array, true);
                this.saveGameData();
            }
            else {
                let Wzhcq_randomIndex = Math.floor(Math.random() * Wzhcq_array.length);
                let Wzhcq_randomIndex2 = Math.floor(Math.random() * Wzhcq_array.length);
                while (Wzhcq_randomIndex == Wzhcq_randomIndex2 || Wzhcq_array[Wzhcq_randomIndex].MahjongData.Id == Wzhcq_array[Wzhcq_randomIndex2].MahjongData.Id) {
                    Wzhcq_randomIndex2 = Math.floor(Math.random() * Wzhcq_array.length);
                }
                // console.error("Wzhcq_randomIndex:", Wzhcq_randomIndex + "     Wzhcq_randomIndex2:", Wzhcq_randomIndex2);
                AudioManager.instance.playAudioXiaoPai();
                this.checkMahJong(Wzhcq_randomIndex, Wzhcq_randomIndex2, Wzhcq_array, true);
                this.saveGameData();
            }
        }
    }

    protected OnCancellation() {

        AudioManager.instance.playAudioBtn_Click();
        let Wzhcq_TomorrowNewPlayer = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_TomorrowNewPlayer);

        if (this.mahjongTouchState) {
            if (Object.keys(this.Wzhcq_MahjongList).length > 0) {
                let Wzhcq_GameType = Utils.getInstance.GameType;
                if (Wzhcq_GameType == 1) {
                    this.Cancellation();
                }
                else {
                    if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                        this.Cancellation();
                    }
                    else {
                        let PropCancellation = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropCancellation);
                        if (PropCancellation > 0) {
                            Utils.getInstance.usePropCancellation += 1;
                            Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropCancellation, PropCancellation - 1);
                            this.Cancellation();
                            this.changePropNum();
                        }
                        else {
                            if (this.Wzhcq_isclick) {
                                this.Wzhcq_isclick = false;
                            }
                            this.Wzhcq_game_isDownTime = false;
                            this.Wzhcq_isDownTime = false;
                            this.Wzhcq_ShuffleTipState = false;

                            let avtype = 16;
                            WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                                //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                                if (data == 1) {
                                    //激励视频完整播放 需要做的奖励；
                                    let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                                    Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                                    Utils.getInstance.VideoCancellation += 1;

                                    Utils.getInstance.sjd_close_rewardav(avtype, true);

                                    this.Cancellation();
                                    this.Wzhcq_isclick = true;

                                    if (Utils.getInstance.GameType == 3) {
                                        Utils.getInstance.isEnergyLookVideo = 1;
                                    }
                                }
                                else if (data == 2) {
                                    wx.showToast({
                                        title: '暂时没有广告了,请稍后再试',
                                        icon: 'none',
                                    });

                                    this.Wzhcq_isclick = true;
                                }
                                else if (data == 0) {
                                    wx.showToast({
                                        title: '播放中途退出',
                                        icon: 'none',
                                    });

                                    this.Wzhcq_isclick = true;

                                    Utils.getInstance.sjd_close_rewardav(avtype, false);
                                }

                                this.Wzhcq_isDownTime = true;
                                this.Wzhcq_ShuffleTipState = true;
                            });
                        }
                    }
                }
            }
            else {
                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "已消除所有的麻将牌");
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "炸弹期间不能消牌");
        }
    }

    checkMahJong(Wzhcq_randomIndex: any, Wzhcq_randomIndex2: any, Wzhcq_array: any, bool: any) {

        let Wzhcq_data = Wzhcq_array[Wzhcq_randomIndex];
        let Wzhcq_data2 = Wzhcq_array[Wzhcq_randomIndex2];
        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[Wzhcq_key];
            if ((Wzhcq_data.GetPosKey() != Wzhcq_key && Wzhcq_data2.GetPosKey() != Wzhcq_key) && (Wzhcq_data.MahjongData.Suit == Wzhcq_element.MahjongData.Suit && Wzhcq_data.MahjongData.Num == Wzhcq_element.MahjongData.Num)) {
                delete this.Wzhcq_MahjongList[Wzhcq_element.GetPosKey()];
                delete this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_element.MahjongData.GetPos())];
                Wzhcq_element.Remove();

                delete this.Wzhcq_MahjongList[Wzhcq_data.GetPosKey()];
                delete this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_data.MahjongData.GetPos())];
                Wzhcq_data.Remove();

                // console.error("Wzhcq_key:", Wzhcq_data.GetPosKey());
                // console.error("Wzhcq_key:", Wzhcq_key);

                break;
            }
        }

        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[Wzhcq_key];
            if ((Wzhcq_data.GetPosKey() != Wzhcq_key && Wzhcq_data2.GetPosKey() != Wzhcq_key) && (Wzhcq_data2.MahjongData.Suit == Wzhcq_element.MahjongData.Suit && Wzhcq_data2.MahjongData.Num == Wzhcq_element.MahjongData.Num)) {
                delete this.Wzhcq_MahjongList[Wzhcq_element.GetPosKey()];
                delete this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_element.MahjongData.GetPos())];
                Wzhcq_element.Remove();

                delete this.Wzhcq_MahjongList[Wzhcq_data2.GetPosKey()];
                delete this.Wzhcq_MahjongList[JSON.stringify(Wzhcq_data2.MahjongData.GetPos())];
                Wzhcq_data2.Remove();

                // console.error("Wzhcq_key:", Wzhcq_data2.GetPosKey());
                // console.error("Wzhcq_key2:", Wzhcq_key);

                break;
            }
        }

        for (let key in this.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Wzhcq_MahjongList[key];
            Wzhcq_element.SetTipNodeVisible(false);
        }

        this.Wzhcq_chenkGameOver(bool, () => { });
        for (let Wzhcq_key2 in this.Wzhcq_MahjongList) {
            this.Wzhcq_MahjongList[Wzhcq_key2].ResetAllMoveGroup();
        }
        this.scheduleOnce(() => {
            if (Utils.getInstance.GameType == 6) {
                this.updateMap();
            }
            this.Wzhcq_isContinuous = true;
        }, 0.3);
    }

    protected OnBtnTipClick() {
        AudioManager.instance.playAudioBtn_Click();

        let Wzhcq_GameType = Utils.getInstance.GameType;
        if (Wzhcq_GameType == 1) {
            this.GetCanRemoveCount(true);
        }
        else {
            if (cc.sys.platform != cc.sys.WECHAT_GAME) {
                this.GetCanRemoveCount(true);
            }
            else {
                let Wzhcq_PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
                if (Wzhcq_PropTips > 0) {
                    Utils.getInstance.usePropTips += 1;
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_PropTips, Wzhcq_PropTips - 1);
                    this.GetCanRemoveCount(true);
                    this.changePropNum();
                }
                else {
                    if (this.Wzhcq_isclick) {
                        this.Wzhcq_isclick = false;
                    }
                    this.Wzhcq_game_isDownTime = false;
                    this.Wzhcq_isDownTime = false;
                    this.Wzhcq_ShuffleTipState = false;

                    let avtype = 1;
                    WxPlatform.getInstance.showRewardVideo2(avtype, (data) => {
                        //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                        if (data == 1) {
                            //激励视频完整播放 需要做的奖励；
                            let total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
                            Utils.getInstance.Wzhcq_setItem("total_ad_num", total_ad_num + 1);

                            Utils.getInstance.VideoTips += 1;

                            Utils.getInstance.sjd_close_rewardav(avtype, true);

                            this.GetCanRemoveCount(true);
                            this.Wzhcq_isclick = true;

                            if (Utils.getInstance.GameType == 3) {
                                Utils.getInstance.isEnergyLookVideo = 1;
                            }
                        }
                        else if (data == 2) {
                            wx.showToast({
                                title: '暂时没有广告了,请稍后再试',
                                icon: 'none',
                            });
                            if (Utils.getInstance.GameType == 5) {
                                this.Wzhcq_game_isDownTime = true;
                            }
                            else if (Utils.getInstance.GameType == 6) {
                                this.Wzhcq_game_isDownTime = true;
                            }
                            this.Wzhcq_isclick = true;
                        }
                        else if (data == 0) {
                            wx.showToast({
                                title: '播放中途退出',
                                icon: 'none',
                            });
                            if (Utils.getInstance.GameType == 5) {
                                this.Wzhcq_game_isDownTime = true;
                            }
                            else if (Utils.getInstance.GameType == 6) {
                                this.Wzhcq_game_isDownTime = true;
                            }
                            this.Wzhcq_isclick = true;

                            Utils.getInstance.sjd_close_rewardav(avtype, false);
                        }

                        this.Wzhcq_isDownTime = true;
                        this.Wzhcq_ShuffleTipState = true;
                    });
                }
            }
        }
    }

    private Wzhcq_CheckNeighbor(Wzhcq_mahjong: MahjongTile, Wzhcq_offsetX: number, Wzhcq_offsetY: number) {
        const Wzhcq_currentPos = Wzhcq_mahjong.GetMahjongData().GetPos();
        const Wzhcq_neighborPos: MahjongPos = {
            x: Wzhcq_currentPos.x + Wzhcq_offsetX,
            y: Wzhcq_currentPos.y + Wzhcq_offsetY,
        };
        const Wzhcq_neighborKey = JSON.stringify(Wzhcq_neighborPos);
        const Wzhcq_neighbor = this.Wzhcq_MahjongList[Wzhcq_neighborKey];

        if (Wzhcq_neighbor) {
            return Wzhcq_mahjong.CheckIsMatch(Wzhcq_neighbor);
        }
        else {
            return false;
        }
    }

    private FindMatchMahjong(Wzhcq_mahjong: MahjongTile) {
        let Wzhcq_array = [];
        for (let Wzhcq_key in this.Wzhcq_MahjongList) {
            let Wzhcq_obj = this.Wzhcq_MahjongList[Wzhcq_key];
            if (Wzhcq_obj.GetPosKey() != Wzhcq_mahjong.GetPosKey()) {
                Wzhcq_array.push(Wzhcq_obj);
            }
        }
        for (let Wzhcq_idx = 0; Wzhcq_idx < Wzhcq_array.length; Wzhcq_idx++) {
            const Wzhcq_obj = Wzhcq_array[Wzhcq_idx];
            let Wzhcq_match = Wzhcq_mahjong.CheckIsMatch(Wzhcq_obj);
            if (Wzhcq_match) {
                return Wzhcq_match;
            }
        }
    }
}
