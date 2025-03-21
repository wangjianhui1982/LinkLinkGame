
import MahjongTile from './Mahjong/MahjongTile';

const { ccclass, property } = cc._decorator;
export interface RemoveData {
    self: MahjongTile;
    target: MahjongTile;
}
@ccclass
export default class EventMgr extends cc.EventTarget {
    private static instance: EventMgr;
    public Wzhcq_EVENT_NAMES: any;

    private constructor() {
        super();
        this.Wzhcq_EVENT_NAMES = {
            Wzhcq_REMOVE_SUCESS: 'remove_sucess',
            Wzhcq_CAN_NOT_REMOVE: 'can_not_remove',
            Wzhcq_UPDATE_ENERGY: 'update_energy',
            Wzhcq_WARN_POPUP: 'warn_popup',
            Wzhcq_UPDATE_MUSIC: 'update_music',
            Wzhcq_UPDATE_EFFECT: 'update_effect',
            Wzhcq_UPDATE_MUSICSTATE: "update_musicstate",
            Wzhcq_UPDATE_EFFECTSTATE: "update_effectstate",
            Wzhcq_GAME_TIPS: "game_tips",
            Wzhcq_GAME_SUCCESS: "game_success",
            Wzhcq_GAME_FAIL: "game_fail",
            Wzhcq_GAME_REVIVE: "game_revive",
            Wzhcq_RESTARTGAME: "restartGame",
            Wzhcq_GAME_PROP: "game_prop",
            Wzhcq_UPDATE_PROP: "update_prop",
            Wzhcq_SHUFFLEMASK: "shuffleMak",
            Wzhcq_UPDATE_PROPMASK: "update_propmask",
            Wzhcq_RANKINFO: "rankInfo",
            Wzhcq_GAME_OVER: "game_over",
            Wzhcq_GAME_AUTHOR: "game_author",
            Wzhcq_CREATE_ENERGY: "create_energy",
            Wzhcq_GAME_RANK: "game_rank",
            Wzhcq_REPORT_RESULT: "report_result",
            Wzhcq_CREATE_RECOMMEND: "create_Recommend",
            Wzhcq_CREATE_ACHIEVE: "create_achieve",
            Wzhcq_UPDATE_REDDOT: "update_reddot",
            Wzhcq_REWARD_PROP: "reward_prop",
            Wzhcq_CHECK_GAMEOVER: "check_GameOver",
            Wzhcq_CREATE_RANK: "create_rank",
            Wzhcq_SHUFFLEEVENT: "shuffleEvent",
            Wzhcq_UPDATE_CHAOZHIHAOLI: "chaozhihaoli",
            Wzhcq_UPDATE_GAMEPROP: "gameProp",
            Wzhcq_CHANGE_PROPNUM: "changePropNum",
            Wzhcq_WALLTOWEREND: "wallTowerEnd",
            Wzhcq_UPDATE_DOWNTIME: "update_downtime",
            Wzhcq_CLOSEMRTZ: "closeMRTZ",
            Wzhcq_CREATE_MRTZRANK: "create_MRTZrank",
            DRAWCOLOR: "drawWithColor",
            REMOVEALLROPE: "removeAllRope",
            UPDATEBOARDSPRITE: "updateBoardSprite",
            CREATEPAINTBOARD: "createPointBoard",
            UPDATEPROGRESS: "updateProgress",
            REFRESHTUJIAN: "refreshTuJian",
            GOINGAME :"goinGame",
        };
    }
    public static GetInstance(): EventMgr {
        if (!EventMgr.instance) {
            EventMgr.instance = new EventMgr();
        }
        return EventMgr.instance;
    }
}
