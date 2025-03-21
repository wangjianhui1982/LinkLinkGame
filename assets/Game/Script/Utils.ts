import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { HttpUtil } from "./HttpUtil";

//因为子域跟主域代码不能互相引用，因此定义一个表，分别复制到两边当成一个来使用。
let Consts = {
    OpenDataKeys: {
        LevelKey: "nuoduidui",
    },
    DomainAction: {
        NuoDuiDui_ShowFriend: "NuoDuiDui_ShowFriend", //展示好友排行榜
    },
}

let weightObjects = [
    { weight: 33, type: 0 }, //1个方块出现的概率
    { weight: 33, type: 1 }, //2个方块出现的概率
    { weight: 34, type: 2 }, //2个方块出现的概率
];

let localStorageValue = {
    Life: 10,
    CurEnergyTime: 0,
    EnergyDownTime: 900,
    LifeState: 1,
    Music: 0,
    Effect: 1,
    MusicValue: 0.5,
    EffectValue: 0.5,
    EnergyDay: 0,
    EnergyCount: 0,
    CurScore: 0,
    CurRankScore: 0,
    AllRankScore: 0,
    PropTips: 0,
    PropAddTime: 0,
    PropShuffleTiles: 0,
    PropCancellation: 0,
    Guide: 1,
    NoEnergy: 0,
    NoEnergyDay: 0,
    GameType: 1,
    JianDanTips: 1,
    MoveCount: 0,
    ShowTips: 1,
    headurl: null,
    username: null,
    openid: null,
    auth: 0,
    eMengState: 1,
    jishiCount: 0,
    curDay: 0,
    PyramidDay: 0,
    PyramidState: 0,
    AddGame: 1,
    DailyLogin: 0,
    DailyLoginDay: 0,
    Storage_MahjongList: {},
    Storage_Row: 0,
    Storage_Col: 0,
    Storage_GameType: 0,
    StoreyIndex: 0,
    Storage_rankIndex: 1,
    Storage___Index: 0,
    JiShi_DownTime: 300,

    StorageDataDay: 0,
    StorageData: 0,

    TomorrowNewPlayerDay: 0,
    TomorrowNewPlayer: 0,
    ClearanceDifficulty: 1,

    addDesk: 1,
    Level: 1,
    challengeNum: 1,
    MeiritiaozhanDay: 0,
    ChaozhihaoliVideoState: 0,
    MeiritiaozhanState: 0,
    czhlDownTime: 0,
    mrtzClearanceNum: 0,
    mrtzMaxClearanceNum: 0,
    tiaozhanSuccessDay: 0,
    tiaozhanSuccess: 0,
    boardIndex: 0,
    selectedIndex: 0,
    segmentCount: 0,
    currentStep: 0,
    fingerState: 1,

    UploadDataDay: 0,
    UploadData: 0,
    UploadState: 1,

    JianDanCount: 0,
    UseEnergy: 0,
    ShuffleFinger: 1,

    user_create_time: 0,
    total_ad_num: 0,

    RecommendDay1: 0,
    RecommendState1: 0,
    RecommendDay2: 0,
    RecommendState2: 0,
    RecommendDay3: 0,
    RecommendState3: 0,
    RecommendDay4: 0,
    RecommendState4: 0,

    chuangguan_allSession: 0, //总场次
    chuangguan_victory: 0, //胜场
    chuangguan_shortestTime: 0, //最短时间
    chuangguan_highestScore: 0,//最高分数
    chuangguan_maximumEliminate: 0,//最大连消
    chuangguan_highestIntegral: 0,//最高积分
    chuangguan_highestwinningStreak: 0,///最高连胜
    chuangguan_winningStreak: 0,//连胜

    tiaozhan_allSession: 0, //总场次
    tiaozhan_victory: 0, //胜场
    tiaozhan_shortestTime: 0, //最短时间
    tiaozhan_highestScore: 0,//最高分数
    tiaozhan_maximumEliminate: 0,//最大连消
    tiaozhan_highestIntegral: 0,//最高积分
    tiaozhan_highestwinningStreak: 0,///最高连胜
    tiaozhan_winningStreak: 0,//连胜
}

export class Utils extends BaseComponent {
    gameName: string = "wozhihuichaoqun_nuoduidui_";
    jsonData = {};
    banner_video: any;
    interstitial = 1;
    banner_video_time: any = 300;
    sceneID: any;
    bannerTime: any;
    energyDownTime = 900;
    GameType = 2;
    Level = 1;
    MaxLevel = 16;
    UnlockLevel = 10;
    StoreyIndex = 0;

    goInLonding = 0;
    goInGame = 0;

    levelData: any;
    meiritiaozhanData: any;
    cardGroup: any;
    cardCfg: any;
    czhl_constDownTime = 900;
    propRewardType = 1; //1：结算奖励，2：超值豪礼
    maxlife = 10;

    XiaoChuCount = 0;
    headurl = null;
    username = null;
    openid = null;
    Lv: any;
    setHouTai = 0;
    lookDownTimeCount = 0;
    fristAddTime = 1;
    gameDownTime = 300;
    game_warn_addTime = 60;
    isRevive = 1;
    MoveCount = 0;
    JianDanTips = 1;
    auth = 0;
    _countdownSecond = 0;
    jishiCount = 0;
    jishi_redDot = 1;
    rank_redDot = 1;

    accountInfo: any;
    is_clickSetting = 0;
    is_clickPause = 0;

    IsGuideTip = false;
    MaxMoveCount = 5;
    GuideTipTime = 5;
    autoState = true;

    pixelRatioWidth = 750;
    pixelRatioHeight = 3000;
    MaxLv = 200;
    segmentCount = 0;
    curFinish = 0;

    click_KunNan = 0; // 0没有点击困难，1点击困难
    continuousJianDan = 0; //简单模式连续次数
    continuousKunNan = 0; //困难模式连续次数
    isEnergyLookVideo = 0; //体力是否看视频
    nlgnState = 1; //挪了个挪模式状态
    jsState = 1; //计时模式状态

    allSession = 0; //总场次
    victory = 0;//胜场
    startTime = 0; //开始时间
    endTime = 0; //结束时间
    shortestTime = 0; //最短时间
    highestScore = 0;//最高分数
    maximumEliminate = 0;//最大连消
    highestIntegral = 0;//最高积分
    highestwinningStreak = 0; //最高连胜
    winningStreak = 0; //连胜

    FeedbackButton: any;
    InterstitialAd_upTime = 0;
    InterstitialAd_downTime = 0;

    uuidGroupIdx: any;
    cfgData: any;
    user_group: any;
    report_user_group: any;
    create_time: number;
    PropTips = 0;
    PropShuffleTiles = 0;
    PropCancellation = 0;
    PropAddTime = 0;
    usePropTips = 0;
    usePropShuffleTiles = 0;
    usePropCancellation = 0;
    usePropAddTime = 0;
    VideoTips = 0;
    VideoShuffleTiles = 0;
    VideoCancellation = 0;
    VideoPropAddTime = 0;
    level_start = 6;
    level_end = 35;

    private static instance: Utils = null;
    public static get getInstance(): Utils {
        if (Utils.instance == null) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    /**储存数据 */
    Wzhcq_setItem(Wzhcq_key: any, Wzhcq_value: any) {
        cc.sys.localStorage.setItem(this.gameName + Wzhcq_key, JSON.stringify(Wzhcq_value));
    }

    /**获取数据*/
    Wzhcq_getItem(Wzhcq_key: any) {

        let Wzhcq_value = cc.sys.localStorage.getItem(this.gameName + Wzhcq_key);
        if (Wzhcq_value == null || Wzhcq_value == undefined || Wzhcq_value == "") {
            return localStorageValue[Wzhcq_key];
        }
        else {
            return JSON.parse(Wzhcq_value);
        }
    }

    removeItem(Wzhcq_key: any) {
        cc.sys.localStorage.removeItem(this.gameName + Wzhcq_key);
    }

    getLevelRange(level: any) {
        let start = Utils.getInstance.level_start;
        let end = Utils.getInstance.level_end;
        let index = (level - start) % (end - start + 1) + start;
        return index;
    }

    sjd_login() {
        //当前时间戳
        const Wzhcq_timestamp = new Date().getTime() / 1000;
        // console.error("当前时间戳:", Math.floor(Wzhcq_timestamp));
        // console.error("时间戳转时间:", new Date(new Date().getTime()));

        //总广告数
        let Wzhcq_total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
        // console.error("总广告数:", Wzhcq_total_ad_num);

        let Wzhcq_stage_clear_num = 0;
        if (Utils.getInstance.GameType == 6) {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        }
        else {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
        }

        // console.error("stage_clear_num:", Wzhcq_stage_clear_num);

        // console.error("用户登录事件:sjd_login");

        // console.error("cfgData:", Utils.getInstance.cfgData);
        // console.error("user_group:", Utils.getInstance.user_group);

        this.uuidGroupIdx = Utils.getInstance.Wzhcq_getItem("uuidGroupIdx");
        // console.error("user_group数组:", Utils.getInstance.user_group.split(","));
        // console.error("分组是第几组:", parseInt(Utils.getInstance.uuidGroupIdx) + 1);
        // console.error("分组后对应的key值:", Utils.getInstance.user_group.split(",")[Utils.getInstance.uuidGroupIdx]);
        // console.error("分组后对应的value值:", Utils.getInstance.cfgData[Utils.getInstance.user_group.split(",")[Utils.getInstance.uuidGroupIdx]]);

        //选择图鉴id
        let pic_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        //收集图片数量
        let pic_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);
        //当前毛线数量
        let coin_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);

        let Wzhcq_value = {
            "puid": "",
            "user_id": Utils.getInstance.Wzhcq_getItem("uuid"),
            "user_group": parseInt(Utils.getInstance.uuidGroupIdx) + 1,
            "user_create_time": Utils.getInstance.Wzhcq_getItem("user_create_time"),
            "stage_clear_num": Wzhcq_stage_clear_num,
            "total_ad_num": Wzhcq_total_ad_num,
            "create_time": Math.floor(Wzhcq_timestamp),
            "coin_num": coin_num,
            "pic_num": pic_num,
            "pic_id": pic_id
        }
        let Wzhcq_data = {
            "gameId": 143,
            "eventId": "sjd_login",
            "data": JSON.stringify(Wzhcq_value)
        }

        if (Utils.getInstance.report_user_group == 0) {
            HttpUtil.reportEvent(Wzhcq_data);
        }
        else {
            let Wzhcq_array = Utils.getInstance.report_user_group.split(",");
            for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_array.length; Wzhcq_index++) {
                const Wzhcq_groupIdx = Wzhcq_array[Wzhcq_index];
                if (Wzhcq_groupIdx == (parseInt(Utils.getInstance.uuidGroupIdx) + 1)) {
                    HttpUtil.reportEvent(Wzhcq_data);
                    // console.error("可以上报!!!");
                    break;
                }
            }
        }
    }

    sjd_enter_stage() {
        //当前时间戳
        const Wzhcq_timestamp = new Date().getTime() / 1000;
        // console.error("当前时间戳:", Math.floor(Wzhcq_timestamp));
        // console.error("时间戳转时间:", new Date(new Date().getTime()));

        //当前关卡数
        // console.error("当前关卡数:", Utils.getInstance.GameType);

        let Wzhcq_stage_clear_num = 0;
        if (Utils.getInstance.GameType == 6) {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        }
        else {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
        }
        // console.error("stage_clear_num:", Wzhcq_stage_clear_num);

        //总广告数
        let Wzhcq_total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
        // console.error("总广告数:", Wzhcq_total_ad_num);

        Utils.getInstance.PropTips = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropTips);
        Utils.getInstance.PropShuffleTiles = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropShuffleTiles);
        Utils.getInstance.PropCancellation = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropCancellation);
        Utils.getInstance.PropAddTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_PropCancellation);

        Utils.getInstance.usePropTips = 0;
        Utils.getInstance.usePropShuffleTiles = 0;
        Utils.getInstance.usePropCancellation = 0;
        Utils.getInstance.usePropAddTime = 0;

        Utils.getInstance.VideoTips = 0;
        Utils.getInstance.VideoShuffleTiles = 0;
        Utils.getInstance.VideoCancellation = 0;
        Utils.getInstance.VideoPropAddTime = 0;

        // console.error("用户进入关卡事件:sjd_enter_stage");

        //选择图鉴id
        let pic_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        //收集图片数量
        let pic_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);
        //当前毛线数量
        let coin_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);

        this.create_time = Math.floor(Wzhcq_timestamp);

        let level_id: any;
        if (Utils.getInstance.GameType == 6) {
            level_id = -1;
        }
        else {
            level_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        }

        let Wzhcq_value = {
            "stage_id": Utils.getInstance.GameType,
            "level_id": level_id,
            "stage_seed": 0,
            "puid": "",
            "user_id": Utils.getInstance.Wzhcq_getItem("uuid"),
            "user_group": parseInt(Utils.getInstance.uuidGroupIdx) + 1,
            "user_create_time": Utils.getInstance.Wzhcq_getItem("user_create_time"),
            "stage_clear_num": Wzhcq_stage_clear_num,
            "total_ad_num": Wzhcq_total_ad_num,
            "create_time": Math.floor(Wzhcq_timestamp),
            "coin_num": coin_num,
            "pic_num": pic_num,
            "pic_id": pic_id
        }
        let Wzhcq_data = {
            "gameId": 143,
            "eventId": "sjd_enter_stage",
            "data": JSON.stringify(Wzhcq_value)
        }

        if (Utils.getInstance.report_user_group == 0) {
            HttpUtil.reportEvent(Wzhcq_data);
        }
        else {
            let Wzhcq_array = Utils.getInstance.report_user_group.split(",");
            for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_array.length; Wzhcq_index++) {
                const Wzhcq_groupIdx = Wzhcq_array[Wzhcq_index];
                if (Wzhcq_groupIdx == (parseInt(Utils.getInstance.uuidGroupIdx) + 1)) {
                    HttpUtil.reportEvent(Wzhcq_data);
                    // console.error("可以上报!!!");
                    break;
                }
            }
        }
    }

    sjd_clear_stage(Wzhcq_bool: any) {
        //当前时间戳
        const Wzhcq_timestamp = new Date().getTime() / 1000;
        // console.error("当前时间戳:", Math.floor(Wzhcq_timestamp));
        // console.error("时间戳转时间:", new Date(new Date().getTime()));

        //当前关卡数
        // console.error("当前关卡数:", Utils.getInstance.GameType);

        let Wzhcq_stage_clear_num = 0;
        if (Utils.getInstance.GameType == 6) {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        }
        else {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
        }
        // console.error("stage_clear_num:", Wzhcq_stage_clear_num);

        //总广告数
        let Wzhcq_total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
        // console.error("总广告数:", Wzhcq_total_ad_num);

        let Wzhcq_used_items =
            Utils.getInstance.usePropTips + "," + Utils.getInstance.usePropShuffleTiles + "," + Utils.getInstance.usePropCancellation + "," + Utils.getInstance.usePropAddTime + "," +
            Utils.getInstance.VideoTips + "," + Utils.getInstance.VideoShuffleTiles + "," + Utils.getInstance.VideoCancellation + "," + Utils.getInstance.VideoPropAddTime + "," +
            Utils.getInstance.PropTips + "," + Utils.getInstance.PropShuffleTiles + "," + Utils.getInstance.PropCancellation + "," + Utils.getInstance.PropAddTime;

        // console.error("used_items:", Wzhcq_used_items);

        //关卡用时
        // console.error("关卡用时:", Math.floor((Wzhcq_timestamp - this.create_time) / 1000));

        // console.error("用户通关事件 :sjd_clear_stage");
        //选择图鉴id
        let pic_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.selectedIndex);
        //收集图片数量
        let pic_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);
        //当前毛线数量
        let coin_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);

        let level_id: any;
        if (Utils.getInstance.GameType == 6) {
            level_id = -1;
        }
        else {
            level_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        }

        let Wzhcq_value = {
            "stage_id": Utils.getInstance.GameType,
            "level_id": level_id,
            "stage_seed": 0,
            "is_clear": Wzhcq_bool,
            "rank_score": 0,
            "tiles_clear": 0,
            "stage_time": Utils.getInstance.shortestTime,
            "used_items": Wzhcq_used_items,
            "puid": "",
            "user_id": Utils.getInstance.Wzhcq_getItem("uuid"),
            "user_group": parseInt(Utils.getInstance.uuidGroupIdx) + 1,
            "user_create_time": Utils.getInstance.Wzhcq_getItem("user_create_time"),
            "stage_clear_num": Wzhcq_stage_clear_num,
            "total_ad_num": Wzhcq_total_ad_num,
            "create_time": this.create_time,
            "coin_num": coin_num,
            "pic_num": pic_num,
            "pic_id": pic_id
        }
        let Wzhcq_data = {
            "gameId": 143,
            "eventId": "sjd_clear_stage",
            "data": JSON.stringify(Wzhcq_value)
        }

        if (Utils.getInstance.report_user_group == 0) {
            HttpUtil.reportEvent(Wzhcq_data);
        }
        else {
            let Wzhcq_array = Utils.getInstance.report_user_group.split(",");
            for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_array.length; Wzhcq_index++) {
                const Wzhcq_groupIdx = Wzhcq_array[Wzhcq_index];
                if (Wzhcq_groupIdx == (parseInt(Utils.getInstance.uuidGroupIdx) + 1)) {
                    HttpUtil.reportEvent(Wzhcq_data);
                    // console.error("可以上报!!!");
                    break;
                }
            }
        }
    }

    sjd_enter_rewardav(Wzhcq_avtype: any) {
        //当前时间戳
        const Wzhcq_timestamp = new Date().getTime() / 1000;
        // console.error("当前时间戳:", Math.floor(Wzhcq_timestamp));
        // console.error("时间戳转时间:", new Date(new Date().getTime()));

        //当前关卡数
        // console.error("当前关卡数:", Utils.getInstance.GameType);

        let Wzhcq_stage_clear_num = 0;
        if (Utils.getInstance.GameType == 6) {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        }
        else {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
        }
        // console.error("stage_clear_num:", Wzhcq_stage_clear_num);

        //总广告数
        let Wzhcq_total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
        // console.error("总广告数:", Wzhcq_total_ad_num);
        console.error("avtype :", Wzhcq_avtype);
        // console.error("用户通关事件 :sjd_enter_rewardav");

        let level_id: any;
        if (Utils.getInstance.GameType == 6) {
            level_id = -1;
        }
        else {
            level_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        }

        let Wzhcq_title = {
            0: "其他",
            1: "提示道具",
            2: "洗牌道具",
            3: "关卡结束赠送道具",
            4: "复活界面",
            5: "增加体力",
            6: "每日挑战增加次数",
            7: "2分钟弹框加时3分钟",
            8: "主动加时3分钟",
            9: "主动加时1分钟（死后第一次点）",
            10: "主动加时30s（死后第二次点）",
            11: "复活加时1分钟",
            12: "复活加时30s",
            13: "双倍积分",
            14: "收藏双倍",
            15: "每日登录领道具",
            16: "消牌道具",
            17: "双倍体力大放送",
            18: "超值豪礼领取",
            19: "超值豪礼缩短领取时间",
        }
        // console.error("广告类型 :", Wzhcq_title[Wzhcq_avtype]);

        let Wzhcq_value = {
            "stage_id": Utils.getInstance.GameType,
            "level_id": level_id,
            "avtype": Wzhcq_avtype,
            "puid": "",
            "user_id": Utils.getInstance.Wzhcq_getItem("uuid"),
            "user_group": parseInt(Utils.getInstance.uuidGroupIdx) + 1,
            "user_create_time": Utils.getInstance.Wzhcq_getItem("user_create_time"),
            "stage_clear_num": Wzhcq_stage_clear_num,
            "total_ad_num": Wzhcq_total_ad_num,
            "create_time": this.create_time
        }
        let Wzhcq_data = {
            "gameId": 143,
            "eventId": "sjd_enter_rewardav",
            "data": JSON.stringify(Wzhcq_value)
        }

        if (Utils.getInstance.report_user_group == 0) {
            HttpUtil.reportEvent(Wzhcq_data);
        }
        else {
            let Wzhcq_array = Utils.getInstance.report_user_group.split(",");
            for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_array.length; Wzhcq_index++) {
                const Wzhcq_groupIdx = Wzhcq_array[Wzhcq_index];
                if (Wzhcq_groupIdx == (parseInt(Utils.getInstance.uuidGroupIdx) + 1)) {
                    HttpUtil.reportEvent(Wzhcq_data);
                    // console.error("可以上报!!!");
                    break;
                }
            }
        }
    }

    sjd_close_rewardav(Wzhcq_avtype: any, Wzhcq_bool: any) {
        //当前时间戳
        const Wzhcq_timestamp = new Date().getTime() / 1000;
        // console.error("当前时间戳:", Math.floor(Wzhcq_timestamp));
        // console.error("时间戳转时间:", new Date(new Date().getTime()));

        //当前关卡数
        // console.error("当前关卡数:", Utils.getInstance.GameType);

        let Wzhcq_stage_clear_num = 0;
        if (Utils.getInstance.GameType == 6) {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        }
        else {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
        }
        // console.error("stage_clear_num:", Wzhcq_stage_clear_num);

        //总广告数
        let Wzhcq_total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
        // console.error("总广告数:", Wzhcq_total_ad_num);

        //是否看完
        // console.error("是否看完isok:", Wzhcq_bool);
        console.error("avtype :", Wzhcq_avtype);
        // console.error("用户通关事件 :sjd_close_rewardav");

        let level_id: any;
        if (Utils.getInstance.GameType == 6) {
            level_id = -1;
        }
        else {
            level_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        }

        let Wzhcq_title = {
            0: "其他",
            1: "提示道具",
            2: "洗牌道具",
            3: "关卡结束赠送道具",
            4: "复活界面",
            5: "增加体力",
            6: "每日挑战增加次数",
            7: "2分钟弹框加时3分钟",
            8: "主动加时3分钟",
            9: "主动加时1分钟（死后第一次点）",
            10: "主动加时30s（死后第二次点）",
            11: "复活加时1分钟",
            12: "复活加时30s",
            13: "双倍积分",
            14: "收藏双倍",
            15: "每日登录领道具",
            16: "消牌道具",
            17: "双倍体力大放送",
            18: "超值豪礼领取",
            19: "超值豪礼缩短领取时间",
        }
        // console.error("广告类型 :", Wzhcq_title[Wzhcq_avtype]);

        let Wzhcq_value = {
            "stage_id": Utils.getInstance.GameType,
            "level_id": level_id,
            "avtype": Wzhcq_avtype,
            "isok": Wzhcq_bool,
            "puid": "",
            "user_id": Utils.getInstance.Wzhcq_getItem("uuid"),
            "user_group": parseInt(Utils.getInstance.uuidGroupIdx) + 1,
            "user_create_time": Utils.getInstance.Wzhcq_getItem("user_create_time"),
            "stage_clear_num": Wzhcq_stage_clear_num,
            "total_ad_num": Wzhcq_total_ad_num,
            "create_time": this.create_time
        }
        let Wzhcq_data = {
            "gameId": 143,
            "eventId": "sjd_close_rewardav",
            "data": JSON.stringify(Wzhcq_value)
        }

        if (Utils.getInstance.report_user_group == 0) {
            HttpUtil.reportEvent(Wzhcq_data);
        }
        else {
            let Wzhcq_array = Utils.getInstance.report_user_group.split(",");
            for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_array.length; Wzhcq_index++) {
                const Wzhcq_groupIdx = Wzhcq_array[Wzhcq_index];
                if (Wzhcq_groupIdx == (parseInt(Utils.getInstance.uuidGroupIdx) + 1)) {
                    HttpUtil.reportEvent(Wzhcq_data);
                    // console.error("可以上报!!!");
                    break;
                }
            }
        }
    }

    sjd_revive_event(revive_type: any) {
        //当前时间戳
        const Wzhcq_timestamp = new Date().getTime() / 1000;
        // console.error("当前时间戳:", Math.floor(Wzhcq_timestamp));
        // console.error("时间戳转时间:", new Date(new Date().getTime()));

        //当前关卡数
        // console.error("当前关卡数:", Utils.getInstance.GameType);

        let Wzhcq_stage_clear_num = 0;
        if (Utils.getInstance.GameType == 6) {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        }
        else {
            Wzhcq_stage_clear_num = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
        }
        // console.error("stage_clear_num:", Wzhcq_stage_clear_num);

        //总广告数
        let Wzhcq_total_ad_num = Utils.getInstance.Wzhcq_getItem("total_ad_num");
        // console.error("总广告数:", Wzhcq_total_ad_num);

        let Wzhcq_used_items =
            Utils.getInstance.usePropTips + "," + Utils.getInstance.usePropShuffleTiles + "," + Utils.getInstance.usePropCancellation + "," + Utils.getInstance.usePropAddTime + "," +
            Utils.getInstance.VideoTips + "," + Utils.getInstance.VideoShuffleTiles + "," + Utils.getInstance.VideoCancellation + "," + Utils.getInstance.VideoPropAddTime + "," +
            Utils.getInstance.PropTips + "," + Utils.getInstance.PropShuffleTiles + "," + Utils.getInstance.PropCancellation + "," + Utils.getInstance.PropAddTime;

        // console.error("used_items:", Wzhcq_used_items);

        // console.error("revive_type :", revive_type);
        // console.error("用户通关事件 :sjd_revive_event");

        let death_type = 1;
        if (Utils.getInstance.GameType == 6 || Utils.getInstance.GameType == 5) {
            if (Utils.getInstance._countdownSecond <= 0) {
                death_type = 2;
            }
            else {
                death_type = 1;
            }
        }
        else {
            death_type = 1;
        }

        // console.error("death_type :", death_type);

        let level_id: any;
        if (Utils.getInstance.GameType == 6) {
            level_id = -1;
        }
        else {
            level_id = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        }

        let Wzhcq_value = {
            "stage_id": Utils.getInstance.GameType,
            "level_id": level_id,
            "stage_seed": 0,
            "rank_score": 0,
            "tiles_clear": 0,
            "stage_time": Utils.getInstance._countdownSecond,
            "used_items": Wzhcq_used_items,
            "puid": "",
            "user_id": Utils.getInstance.Wzhcq_getItem("uuid"),
            "user_group": parseInt(Utils.getInstance.uuidGroupIdx) + 1,
            "user_create_time": Utils.getInstance.Wzhcq_getItem("user_create_time"),
            "stage_clear_num": Wzhcq_stage_clear_num,
            "total_ad_num": Wzhcq_total_ad_num,
            "create_time": this.create_time,
            "revive_type": revive_type,
            "death_type": death_type
        }
        let Wzhcq_data = {
            "gameId": 143,
            "eventId": "sjd_revive_event",
            "data": JSON.stringify(Wzhcq_value)
        }

        if (Utils.getInstance.report_user_group == 0) {
            HttpUtil.reportEvent(Wzhcq_data);
        }
        else {
            let Wzhcq_array = Utils.getInstance.report_user_group.split(",");
            for (let Wzhcq_index = 0; Wzhcq_index < Wzhcq_array.length; Wzhcq_index++) {
                const Wzhcq_groupIdx = Wzhcq_array[Wzhcq_index];
                if (Wzhcq_groupIdx == (parseInt(Utils.getInstance.uuidGroupIdx) + 1)) {
                    HttpUtil.reportEvent(Wzhcq_data);
                    console.error("可以上报!!!");
                    break;
                }
            }
        }
    }

    playWithNode(Wzhcq_node: any, Wzhcq_name: any, Wzhcq__bool: any, Wzhcq_bool: any) {
        if (0 === Wzhcq_bool) {
            Wzhcq_bool = 0;
        }
        return new Promise(function (Wzhcq_callBack) {
            if (!cc.isValid(Wzhcq_node)) {
                return Wzhcq_callBack(null);
            }
            var _node = Wzhcq_node.getComponent(cc.Animation);
            if (!_node) {
                return Wzhcq_callBack(null);
            }
            let Wzhcq_data: any;
            if (Wzhcq__bool) {
                Wzhcq_data = _node.playAdditive(Wzhcq_name, 0);
            }
            else {
                Wzhcq_data = _node.play(Wzhcq_name, 0);
            }

            _node.once(cc.Animation.EventType.FINISHED, function () {
                if (1 == Wzhcq_bool) {
                    Wzhcq_node.active = false;
                }
                else if (2 == Wzhcq_bool && cc.isValid(Wzhcq_node, !0)) {
                    Wzhcq_node.destroy();
                }
                Wzhcq_callBack(Wzhcq_data);
            })
        })
    }


    getCurTime() {
        let Wzhcq_date = new Date();
        let Wzhcq_time = Number(String(Wzhcq_date.getFullYear()) + String((Array(2).join('0') + (Wzhcq_date.getMonth() + 1)).slice(-2)) + String((Array(2).join('0') + (Wzhcq_date.getDate())).slice(-2)));
        return Wzhcq_time;
    }

    secondsFormatMinutes(Wzhcq_s: any) {
        Wzhcq_s = Math.abs(Math.floor(Wzhcq_s));
        let Wzhcq_hour = 0;
        let Wzhcq_minute: any = Math.floor((Wzhcq_s - Wzhcq_hour * 3600) / 60);
        let Wzhcq_second: any = Wzhcq_s - Wzhcq_hour * 3600 - Wzhcq_minute * 60;
        Wzhcq_minute = Wzhcq_minute > 9 ? Wzhcq_minute : "0" + Wzhcq_minute;
        Wzhcq_second = Wzhcq_second > 9 ? Wzhcq_second : "0" + Wzhcq_second;
        if (Wzhcq_s > 0) {
            return Wzhcq_minute + ":" + Wzhcq_second;
        }
        else {
            return "00:00";
        }
    }

    hourFormSecondsFormatMinutes(Wzhcq_s: any) {
        Wzhcq_s = Math.abs(Math.floor(Wzhcq_s));
        let Wzhcq_hour: any = Math.floor(Wzhcq_s / 3600);
        let Wzhcq_minute: any = Math.floor((Wzhcq_s - Wzhcq_hour * 3600) / 60);
        let Wzhcq_second: any = Wzhcq_s - Wzhcq_hour * 3600 - Wzhcq_minute * 60;
        Wzhcq_minute = Wzhcq_minute > 9 ? Wzhcq_minute : "0" + Wzhcq_minute;
        Wzhcq_second = Wzhcq_second > 9 ? Wzhcq_second : "0" + Wzhcq_second;

        if (Wzhcq_hour < 10) {
            if (Wzhcq_s > 0) {
                return "0" + Wzhcq_hour + ":" + Wzhcq_minute + ":" + Wzhcq_second;
            }
            else {
                return "00:00:00";
            }
        }
        else {
            if (Wzhcq_s > 0) {
                return Wzhcq_hour + ":" + Wzhcq_minute + ":" + Wzhcq_second;
            }
            else {
                return "00:00:00";
            }
        }
    }

    pointsRanking(Wzhcq_success_callBack: any, Wzhcq_fail_callBack: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_self = this;
        Wzhcq_self.Lv = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        Wzhcq_self.headurl = Wzhcq_self.headurl ? Wzhcq_self.headurl : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_headurl);
        Wzhcq_self.username = Wzhcq_self.username ? Wzhcq_self.username : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_username);
        Wzhcq_self.openid = Wzhcq_self.openid ? Wzhcq_self.openid : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_openid);

        //关卡数
        let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        //每日挑战胜场数
        let tiaozhan_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        //每日挑战最高连胜数
        let tiaozhan_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);

        // console.log("openid:", Wzhcq_self.openid);
        // console.log("username:", Wzhcq_self.username);
        // console.log("headurl:", Wzhcq_self.headurl);
        // console.log("积分Lv:", Wzhcq_self.Lv);
        // console.log("关卡数 throughLevelNumber:", level);
        // console.log("每日挑战胜场数 victory:", tiaozhan_victory);
        // console.log("每日挑战最高连胜数 highestwinningStreak:", tiaozhan_highestwinningStreak);

        // if (self.openid && self.username && self.headurl) {
        wx.request({
            // url: 'http://192.168.0.5:9090/wxadmin/game/pointsRanking', //仅为示例，并非真实的接口地址 starTopHundredData
            url: 'https://admin.tmoretek.cn/wxadmin/game/pointsRanking', //仅为示例，并非真实的接口地址 starTopHundredData
            data: {
                playerId: Wzhcq_self.openid,
                playerName: Wzhcq_self.username,
                headSculptureUrl: Wzhcq_self.headurl,
                points: Wzhcq_self.Lv,
                throughLevelNumber: level,
                totalThroughLevelNumber: tiaozhan_victory,
                maxThroughLevelNumber: tiaozhan_highestwinningStreak,
                gameId: 143,
            },
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(Wzhcq_res: any) {
                // console.log("成功收到请求数据 getRank");
                let data: any = Wzhcq_res.data;
                // console.log(data);
                if (Wzhcq_success_callBack && data) {
                    Wzhcq_success_callBack(data.data);
                }
            },
            fail(Wzhcq_err: any) {
                // console.log(Wzhcq_err);

                if (cc.sys.platform == cc.sys.WECHAT_GAME) {

                    wx.showModal({
                        title: ' 网络异常',
                        content: '您的网络可能存在问题，请重试',
                        showCancel: false,
                        confirmText: "知道了",
                        success(Wzhcq_res: any) {
                            if (Wzhcq_res.confirm) {
                                // console.log('用户点击确定 游戏配置加载失败');
                                if (Wzhcq_fail_callBack) {
                                    Wzhcq_fail_callBack();
                                }
                            }
                        }
                    })
                }
            }
        })
        // }
    }

    dailyChallengeRanking(Wzhcq_success_callBack: any, Wzhcq_fail_callBack: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_self = this;
        Wzhcq_self.Lv = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        Wzhcq_self.headurl = Wzhcq_self.headurl ? Wzhcq_self.headurl : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_headurl);
        Wzhcq_self.username = Wzhcq_self.username ? Wzhcq_self.username : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_username);
        Wzhcq_self.openid = Wzhcq_self.openid ? Wzhcq_self.openid : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_openid);

        //关卡数
        let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        //每日挑战胜场数
        let tiaozhan_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        //每日挑战最高连胜数
        let tiaozhan_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);

        // console.log("openid:", Wzhcq_self.openid);
        // console.log("username:", Wzhcq_self.username);
        // console.log("headurl:", Wzhcq_self.headurl);
        // console.log("积分Lv:", Wzhcq_self.Lv);
        // console.log("关卡数 throughLevelNumber:", level);
        // console.log("每日挑战胜场数 victory:", tiaozhan_victory);
        // console.log("每日挑战最高连胜数 highestwinningStreak:", tiaozhan_highestwinningStreak);


        // if (self.openid && self.username && self.headurl) {
        wx.request({
            // url: 'http://192.168.0.5:9090/wxadmin/game/dailyChallengeRanking', //仅为示例，并非真实的接口地址 starTopHundredData
            url: 'https://admin.tmoretek.cn/wxadmin/game/dailyChallengeRanking', //仅为示例，并非真实的接口地址 starTopHundredData
            data: {
                playerId: Wzhcq_self.openid,
                playerName: Wzhcq_self.username,
                headSculptureUrl: Wzhcq_self.headurl,
                points: Wzhcq_self.Lv,
                throughLevelNumber: level,
                totalThroughLevelNumber: tiaozhan_victory,
                maxThroughLevelNumber: tiaozhan_highestwinningStreak,
                gameId: 143,
            },
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(Wzhcq_res: any) {
                // console.log("成功收到请求数据 getRank");
                let data: any = Wzhcq_res.data;
                console.log(data);
                if (Wzhcq_success_callBack && data) {
                    Wzhcq_success_callBack(data.data);
                }
            },
            fail(Wzhcq_err: any) {
                // console.log(Wzhcq_err);

                if (cc.sys.platform == cc.sys.WECHAT_GAME) {

                    wx.showModal({
                        title: ' 网络异常',
                        content: '您的网络可能存在问题，请重试',
                        showCancel: false,
                        confirmText: "知道了",
                        success(Wzhcq_res: any) {
                            if (Wzhcq_res.confirm) {
                                // console.log('用户点击确定 游戏配置加载失败');
                                if (Wzhcq_fail_callBack) {
                                    Wzhcq_fail_callBack();
                                }
                            }
                        }
                    })
                }
            }
        })
        // }
    }

    getRank(Wzhcq_success_callBack: any, Wzhcq_fail_callBack: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_self = this;
        Wzhcq_self.Lv = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        Wzhcq_self.headurl = Wzhcq_self.headurl ? Wzhcq_self.headurl : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_headurl);
        Wzhcq_self.username = Wzhcq_self.username ? Wzhcq_self.username : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_username);
        Wzhcq_self.openid = Wzhcq_self.openid ? Wzhcq_self.openid : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_openid);

        // console.log("openid:", Wzhcq_self.openid);
        // console.log("username:", Wzhcq_self.username);
        // console.log("headurl:", Wzhcq_self.headurl);
        // console.log("Lv:", Wzhcq_self.Lv);

        // if (self.openid && self.username && self.headurl) {
        wx.request({
            // url: 'http://192.168.0.5:9090/wxadmin/game/starTopHundredData', //仅为示例，并非真实的接口地址 starTopHundredData
            url: 'https://admin.tmoretek.cn/wxadmin/game/starTopHundredData', //仅为示例，并非真实的接口地址 starTopHundredData
            data: {
                playerId: Wzhcq_self.openid,
                playerName: Wzhcq_self.username,
                headSculptureUrl: Wzhcq_self.headurl,
                passNumber: Wzhcq_self.Lv,
                gameId: 143,
            },
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(Wzhcq_res: any) {
                // console.log("成功收到请求数据 getRank");
                let data: any = Wzhcq_res.data;
                // console.log(data);
                if (Wzhcq_success_callBack && data) {
                    Wzhcq_success_callBack(data.data);
                }
            },
            fail(Wzhcq_err: any) {
                // console.log(Wzhcq_err);

                if (cc.sys.platform == cc.sys.WECHAT_GAME) {

                    wx.showModal({
                        title: ' 网络异常',
                        content: '您的网络可能存在问题，请重试',
                        showCancel: false,
                        confirmText: "知道了",
                        success(Wzhcq_res: any) {
                            if (Wzhcq_res.confirm) {
                                // console.log('用户点击确定 游戏配置加载失败');
                                if (Wzhcq_fail_callBack) {
                                    Wzhcq_fail_callBack();
                                }
                            }
                        }
                    })
                }
            }
        })
        // }
    }

    dailyChallengeSaveData(Wzhcq_callBack: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_self = this;
        Wzhcq_self.Lv = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        Wzhcq_self.headurl = Wzhcq_self.headurl ? Wzhcq_self.headurl : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_headurl);
        Wzhcq_self.username = Wzhcq_self.username ? Wzhcq_self.username : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_username);
        Wzhcq_self.openid = Wzhcq_self.openid ? Wzhcq_self.openid : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_openid);

        //关卡数
        let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Level);
        //每日挑战胜场数
        let tiaozhan_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
        //每日挑战最高连胜数
        let tiaozhan_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);
        // console.log("openid:" + Wzhcq_self.openid);
        // console.log("username：" + Wzhcq_self.username);
        // console.log("headurl：" + Wzhcq_self.headurl);
        // console.log("Lv：" + Wzhcq_self.Lv);

        if (Wzhcq_self.openid && Wzhcq_self.username && Wzhcq_self.headurl) {
            wx.request({
                // url: 'http://192.168.0.5:9090/wxadmin/game/dailyChallengeSaveData', //仅为示例，并非真实的接口地址
                url: 'https://admin.tmoretek.cn/wxadmin/game/dailyChallengeSaveData', //仅为示例，并非真实的接口地址
                data: {
                    playerId: Wzhcq_self.openid,
                    playerName: Wzhcq_self.username,
                    headSculptureUrl: Wzhcq_self.headurl,
                    points: Wzhcq_self.Lv,
                    throughLevelNumber: level,
                    totalThroughLevelNumber: tiaozhan_victory,
                    maxThroughLevelNumber: tiaozhan_highestwinningStreak,
                    gameId: 143,
                },
                method: "POST",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res: any) {
                    // console.log("成功收到请求数据 getRankinfo");
                    let data: any = res.data;
                    // console.log(data.data);
                    if (Wzhcq_callBack) { Wzhcq_callBack(data.data) };
                }
            })
        }
    }

    playerData(Wzhcq_callBack: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_self = this;
        Wzhcq_self.Lv = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_AllRankScore);
        Wzhcq_self.headurl = Wzhcq_self.headurl ? Wzhcq_self.headurl : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_headurl);
        Wzhcq_self.username = Wzhcq_self.username ? Wzhcq_self.username : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_username);
        Wzhcq_self.openid = Wzhcq_self.openid ? Wzhcq_self.openid : Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_openid);

        // console.log("openid:" + Wzhcq_self.openid);
        // console.log("username：" + Wzhcq_self.username);
        // console.log("headurl：" + Wzhcq_self.headurl);
        // console.log("Lv：" + Wzhcq_self.Lv);

        if (Wzhcq_self.openid && Wzhcq_self.username && Wzhcq_self.headurl) {
            wx.request({
                // url: 'http://192.168.0.5:9090/wxadmin/game/playerData', //仅为示例，并非真实的接口地址
                url: 'https://admin.tmoretek.cn/wxadmin/game/playerData', //仅为示例，并非真实的接口地址
                data: {
                    playerId: Wzhcq_self.openid,
                    playerName: Wzhcq_self.username,
                    headSculptureUrl: Wzhcq_self.headurl,
                    passNumber: Wzhcq_self.Lv,
                    gameId: 143,
                },
                method: "POST",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res: any) {
                    // console.log("成功收到请求数据 getRankinfo");
                    let data: any = res.data;
                    // console.log(data.data);
                    if (Wzhcq_callBack) { Wzhcq_callBack(data.data) };
                }
            })
        }
    }

    //#region 获取用户信息
    button: any = null;
    getUserInfo(node: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_winSize = wx.getSystemInfoSync();
        let Wzhcq_top = (cc.view.getVisibleSize().height / 2 - node.y - node.height / 2) * Wzhcq_winSize.windowWidth / cc.view.getVisibleSize().width;
        let Wzhcq_left = (cc.view.getVisibleSize().width / 2 + node.x - node.width / 2) * Wzhcq_winSize.windowHeight / cc.view.getVisibleSize().height;

        let self = this;
        if (self.button) {
            self.button.destroy();
            self.button = null;
        }
        console.log("getUserInfo================");

        self.button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: Wzhcq_left,
                top: Wzhcq_top,
                width: 80,
                height: 80,
                lineHeight: 40,

                backgroundColor: '',
                color: '',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })

        self.button.onTap((Wzhcq_res: any) => {
            // console.log("授权结果");
            // console.log(Wzhcq_res);
            if (Wzhcq_res.errMsg == "getUserInfo:ok") {
                // console.log(Wzhcq_res.userInfo);
                // console.log(Wzhcq_res.userInfo.avatarUrl);
                //console.log(res.userInfo.nickName);
                self.headurl = Wzhcq_res.userInfo.avatarUrl;
                self.username = Wzhcq_res.userInfo.nickName;
                wx.login({
                    success(Wzhcq_res1: any) {
                        if (Wzhcq_res1.code) {
                            //发起网络请求
                            // console.log("code值：");
                            // console.log(Wzhcq_res1.code);
                            wx.request({
                                url: "https://admin.tmoretek.cn/wxadmin/game/getOpenId",
                                //url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx7c1ac12e061b2b79&secret=f8a173b027de9633cc6e524c45c34bea&js_code=${res1.code}&grant_type=authorization_code`,
                                data: {
                                    gameId: 143,
                                    code: Wzhcq_res1.code,
                                },
                                method: "POST",
                                success: (Wzhcq_res2: any) => {
                                    // console.log("res2:", Wzhcq_res2);

                                    let Wzhcq_info: any = Wzhcq_res2.data;
                                    self.openid = Wzhcq_info.openid;
                                    self.setUserInfo();

                                    self.hideUserInfoButton()
                                    self.EventMgr.emit(self.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RANK, undefined);

                                },
                                fail(Wzhcq_err: any) {
                                    // console.log("wx.request:", Wzhcq_err);

                                }
                            })
                        }
                        else {
                            // console.log('登录失败！' + Wzhcq_res);
                        }
                    },
                    fail(Wzhcq_res1: any) {
                        // console.log('授权失败！' + Wzhcq_res1);
                    }
                })

            }
            else if (Wzhcq_res.errMsg == "getUserInfo:fail auth deny") {
                self.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RANK, undefined);

            }
            else if (Wzhcq_res.errMsg == "getUserInfo:fail privacy permission is not authorized") {
                self.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_RANK, undefined);

            }
        })

    }

    getUserInfo2(node: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let Wzhcq_winSize = wx.getSystemInfoSync();
        let Wzhcq_top = (cc.view.getVisibleSize().height / 2 - node.y - node.height / 2) * Wzhcq_winSize.windowWidth / cc.view.getVisibleSize().width;
        let Wzhcq_left = (cc.view.getVisibleSize().width / 2 + node.x - node.width / 2) * Wzhcq_winSize.windowHeight / cc.view.getVisibleSize().height;

        let self = this;
        if (self.button) {
            self.button.destroy();
            self.button = null;
        }

        console.log("getUserInfo2================");
        self.button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: Wzhcq_left,
                top: Wzhcq_top,
                width: 80,
                height: 80,
                lineHeight: 40,

                backgroundColor: '',
                color: '',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        })

        self.button.onTap((Wzhcq_res: any) => {
            // console.log("授权结果");
            // console.log(Wzhcq_res);
            if (Wzhcq_res.errMsg == "getUserInfo:ok") {
                // console.log(Wzhcq_res.userInfo);
                // console.log(Wzhcq_res.userInfo.avatarUrl);
                //console.log(res.userInfo.nickName);
                self.headurl = Wzhcq_res.userInfo.avatarUrl;
                self.username = Wzhcq_res.userInfo.nickName;
                wx.login({
                    success(Wzhcq_res1: any) {
                        if (Wzhcq_res1.code) {
                            //发起网络请求
                            // console.log("code值：");
                            // console.log(Wzhcq_res1.code);
                            wx.request({
                                url: "https://admin.tmoretek.cn/wxadmin/game/getOpenId",
                                //url: `https://api.weixin.qq.com/sns/jscode2session?appid=wx7c1ac12e061b2b79&secret=f8a173b027de9633cc6e524c45c34bea&js_code=${res1.code}&grant_type=authorization_code`,
                                data: {
                                    gameId: 143,
                                    code: Wzhcq_res1.code,
                                },
                                method: "POST",
                                success: (Wzhcq_res2: any) => {
                                    console.log("res2:", Wzhcq_res2);

                                    let Wzhcq_info: any = Wzhcq_res2.data;
                                    self.openid = Wzhcq_info.openid;
                                    self.setUserInfo();

                                    self.hideUserInfoButton()
                                    self.EventMgr.emit(self.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_MRTZRANK, undefined);

                                },
                                fail(Wzhcq_err: any) {
                                    // console.log("wx.request:", Wzhcq_err);

                                }
                            })
                        }
                        else {
                            // console.log('登录失败！' + Wzhcq_res);
                        }
                    },
                    fail(Wzhcq_res1: any) {
                        // console.log('授权失败！' + Wzhcq_res1);
                    }
                })

            }
            else if (Wzhcq_res.errMsg == "getUserInfo:fail auth deny") {
                self.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_MRTZRANK, undefined);

            }
            else if (Wzhcq_res.errMsg == "getUserInfo:fail privacy permission is not authorized") {
                self.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CREATE_MRTZRANK, undefined);

            }
        })

    }

    setUserInfo() {
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_headurl, this.headurl);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_username, this.username);
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_openid, this.openid);
    }

    hideUserInfoButton() {
        if (this.button) {
            // console.log("hideUserInfoButton");
            this.button.hide();
        }
    }

    showUserInfoButton() {
        if (this.button) {
            // console.log("showUserInfoButton");
            this.button.show();
        }
    }

    /**
     * 用户存档异常事件
     * @param userid 
     * @param localversion 
     * @param remoteversion 
     * @param localscore 
     * @param remotescore 
     * @param reason 
     */
    sjd_userdata_error(Wzhcq_userid: any, Wzhcq_localversion: any, Wzhcq_remoteversion: any, Wzhcq_localscore: any, Wzhcq_remotescore: any, Wzhcq_reason: any) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.reportEvent("sjd_userdata_error", {
                "userid": Wzhcq_userid,
                "localversion": Wzhcq_localversion,
                "remoteversion": Wzhcq_remoteversion,
                "localscore": Wzhcq_localscore,
                "remotescore": Wzhcq_remotescore,
                "reason": Wzhcq_reason
            })
        }
    }

    Wzhcq_sjd_friend_auth(Wzhcq_stageid: any, Wzhcq_is_auth: any) {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.reportEvent("sjd_friend_auth", {
                "stageid": Wzhcq_stageid,
                "is_auth": Wzhcq_is_auth
            })
        }
    }

    Wzhcq_setFriend_Auth(Wzhcq_is_auth: any) {
        let Wzhcq_auth = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Auth);
        if (!Wzhcq_auth) {
            if (Wzhcq_is_auth) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Auth, 1);
            }
            Utils.getInstance.Wzhcq_sjd_friend_auth(Utils.getInstance.GameType, Wzhcq_is_auth);
        }
    }

    reportScene() {
        // console.log("reportScene=======================");
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // 接口上报示例代码，当基础库版本>=2.26.2才能使用此能力
            wx.reportScene({
                sceneId: 7,  //「必填」sceneId 为「新建场景」后，由系统生成的场景 Id 值，用于区分当前是哪个启动场景的数据
                success(Wzhcq_res: any) {
                    // 上报接口执行完成后的回调，用于检查上报数据是否符合预期，也可通过启动调试能力进行验证
                    // console.log("success reportScene:", Wzhcq_res);
                },
                fail(Wzhcq_res: any) {
                    // 上报报错时的回调，用于查看上报错误的原因：如参数类型错误等
                    // console.log("fail reportScene:", Wzhcq_res);
                },
            });
        }
    }

    /**
   * 版本号比较
   * @param v1 
   * @param v2 
   * @returns 
   */
    compareGameVersion(Wzhcq_v1: any, Wzhcq_v2: any) {
        Wzhcq_v1 = Wzhcq_v1.split('.')
        Wzhcq_v2 = Wzhcq_v2.split('.')
        const Wzhcq_len = Math.max(Wzhcq_v1.length, Wzhcq_v2.length)

        while (Wzhcq_v1.length < Wzhcq_len) {
            Wzhcq_v1.push('0')
        }
        while (Wzhcq_v2.length < Wzhcq_len) {
            Wzhcq_v2.push('0')
        }

        for (let i = 0; i < Wzhcq_len; i++) {
            const Wzhcq_num1 = parseInt(Wzhcq_v1[i])
            const Wzhcq_num2 = parseInt(Wzhcq_v2[i])

            if (Wzhcq_num1 > Wzhcq_num2) {
                return 1
            }
            else if (Wzhcq_num1 < Wzhcq_num2) {
                return -1
            }
        }

        return 0
    }

    checkRecommendState() {
        //第一
        let Wzhcq__getCurTime1 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendDay1);
        let Wzhcq_getCurTime1 = Utils.getInstance.getCurTime();

        let Wzhcq_RecommendState1 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendState1);
        if (Wzhcq_RecommendState1 > 0) {
            if (Wzhcq__getCurTime1 != Wzhcq_getCurTime1) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState1, 0);
            }
        }
        else {
            if (Wzhcq__getCurTime1 != Wzhcq_getCurTime1) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState1, 0);
            }
        }

        //第二
        let Wzhcq__getCurTime2 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendDay2);
        let Wzhcq_getCurTime2 = Utils.getInstance.getCurTime();

        let Wzhcq_RecommendState2 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendState2);
        if (Wzhcq_RecommendState2 > 0) {
            if (Wzhcq__getCurTime2 != Wzhcq_getCurTime2) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState2, 0);
            }
        }
        else {
            if (Wzhcq__getCurTime2 != Wzhcq_getCurTime2) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState2, 0);
            }
        }

        //第三
        let Wzhcq__getCurTime3 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendDay3);
        let Wzhcq_getCurTime3 = Utils.getInstance.getCurTime();

        let Wzhcq_RecommendState3 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendState3);
        if (Wzhcq_RecommendState3 > 0) {
            if (Wzhcq__getCurTime3 != Wzhcq_getCurTime3) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState3, 0);
            }
        }
        else {
            if (Wzhcq__getCurTime3 != Wzhcq_getCurTime3) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState3, 0);
            }
        }

        //第四
        let Wzhcq__getCurTime4 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendDay4);
        let Wzhcq_getCurTime4 = Utils.getInstance.getCurTime();

        let Wzhcq_RecommendState4 = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_RecommendState4);
        if (Wzhcq_RecommendState4 > 0) {
            if (Wzhcq__getCurTime4 != Wzhcq_getCurTime4) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState4, 0);
            }
        }
        else {
            if (Wzhcq__getCurTime4 != Wzhcq_getCurTime4) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_RecommendState4, 0);
            }
        }
    }

    prop_UserInfo() {
        var Wzhcq_self = this;
        Wzhcq_self.EventMgr.emit(Wzhcq_self.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_PROP);
    }

    createFeedbackButton(Wzhcq_node: any) {
        var self = this;
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            let Wzhcq_winSize = wx.getSystemInfoSync();
            let Wzhcq_top = (cc.view.getVisibleSize().height / 2 - Wzhcq_node.y - Wzhcq_node.height / 2) * Wzhcq_winSize.windowWidth / cc.view.getVisibleSize().width;
            let Wzhcq_left = (cc.view.getVisibleSize().width / 2 + Wzhcq_node.x) * Wzhcq_winSize.windowHeight / cc.view.getVisibleSize().height;

            if (this.FeedbackButton == null) {
                this.FeedbackButton = wx.createFeedbackButton({
                    type: 'text',
                    text: '',
                    style: {
                        left: Wzhcq_left - 25,
                        top: Wzhcq_top,
                        width: 50,
                        height: 50,
                        lineHeight: 40,
                        backgroundColor: '',
                        color: '#ffffff',
                        textAlign: 'center',
                        fontSize: 16,
                        borderRadius: 4
                    }
                })
            }

            // this.FeedbackButton.style.top = Wzhcq_top;
            // this.FeedbackButton.style.left = Wzhcq_left;

            // this.FeedbackButton.onTap(()=>{
            //     console.log("createFeedbackButton");
            //     self.EventMgr.emit(self.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_FEEDBACKBUTTON);
            // });
            this.FeedbackButton.show();
        }
    }

    showFeedbackButton() {
        if (this.FeedbackButton) {
            this.FeedbackButton.show();
        }
    }

    hideFeedbackButton() {
        if (this.FeedbackButton) {
            this.FeedbackButton.hide();
        }
    }

    public openKeFu() {
        let wx = window["wx"];
        if (wx && (Utils.getInstance.is_clickSetting)) {
            wx.openCustomerServiceConversation({});
        }
    }

    shareAppMessage(str) {
        Utils.getInstance.InterstitialAd_upTime = Math.round(new Date().getTime() / 1000);

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            var self = this;
            var image_share_common = "images/common_share_img.png";

            wx.shareAppMessage({
                title: str,
                imageUrl: image_share_common,
                success: function success() {
                    console.log("分享视频成功");
                },
                fail: function fail() {

                }
            });

        }
    }

    pointBoardShare() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {

            let level = Utils.getInstance.curFinish;
            let bundleName = Utils.getInstance.getBundleName(level);
            if (level > Utils.getInstance.MaxLv) {
                level = Utils.getInstance.MaxLv;
            }

            var path = cc.url.raw("resources/" + bundleName + "/icons/" + level + ".png");
            if (cc.loader.md5Pipe) {
                path = cc.loader.md5Pipe.transformURL(path);
            }

            let strArr = ["快来看下我刚完成的十字绣！", "刚完成的十字绣，快来围观一蛤！", "搞快过来看哈，我刚弄完嘞十字绣！"];
            let title = strArr[Math.floor(Math.random() * strArr.length)]

            console.log("path:", path);
            wx.shareAppMessage({
                title: title,
                imageUrl: path,
                success: function success() {
                    console.log("分享视频成功");
                },
                fail: function fail() {

                }
            });

        }
    }

    RandomSum() {
        //总权重
        var Wzhcq_sumWeight = 0;
        for (var i = 0; i < weightObjects.length; i++) {
            Wzhcq_sumWeight += weightObjects[i].weight;
        }

        //随机数 [0, sumWeight)
        var Wzhcq_n = (Math.random() * Wzhcq_sumWeight) | 0;
        //在总权重构成的线段上的各个起始点
        var Wzhcq_m = 0;
        for (var i = 0; i < weightObjects.length; i++) {
            var Wzhcq_weightObj = weightObjects[i];
            //如果在权重范围内
            if (Wzhcq_n >= Wzhcq_m && Wzhcq_n < Wzhcq_m + Wzhcq_weightObj.weight) {
                return i;
            }
            Wzhcq_m += Wzhcq_weightObj.weight;
        }
    }

    Random_Preserve(Wzhcq_weightObjects: any) {
        //总权重
        var Wzhcq_sumWeight = 0;
        for (var i = 0; i < Wzhcq_weightObjects.length; i++) {
            Wzhcq_sumWeight += Wzhcq_weightObjects[i].weight;
        }

        //随机数 [0, sumWeight)
        var Wzhcq_n = (Math.random() * Wzhcq_sumWeight) | 0;
        //在总权重构成的线段上的各个起始点
        var Wzhcq_m = 0;
        for (var i = 0; i < Wzhcq_weightObjects.length; i++) {
            var Wzhcq_weightObj = Wzhcq_weightObjects[i];
            //如果在权重范围内
            if (Wzhcq_n >= Wzhcq_m && Wzhcq_n < Wzhcq_m + Wzhcq_weightObj.weight) {
                return i;
            }
            Wzhcq_m += Wzhcq_weightObj.weight;
        }
    }

    /**获取远程资源，地址需要后缀名
     * 支持图片、声音、文本
     * @param ipath 资源路径
     * @param fn 
     */
    public GetServerResources(url: string, type: any, fn?: Function, errfn?: Function) {
        cc.assetManager.loadRemote(url, (err, data) => {
            // console.log("下载成功");
            // console.log(data);

            if (err == null) {
                if (fn) {
                    fn(data);
                }
            }
            else {
                if (errfn) { errfn(err); }
            }
        });
    }

    loadBundleRes(Ncdls_nameOrUrl: any, Ncdls_type: any) {
        let Ncdls_self = this;
        return new Promise(function (Ncdls_callBack, Ncdls_callBack2) {
            Ncdls_callBack(
                new Promise(function (Ncdls_temp_call, Ncdls_temp_call2) {
                    cc.assetManager.loadBundle(Ncdls_nameOrUrl, function (Ncdls_err, Ncdls_data) {
                        if (Ncdls_err) {
                            Ncdls_temp_call2(null)
                        }
                        else {
                            Ncdls_temp_call(Ncdls_self.loadBundleRes(Ncdls_nameOrUrl, Ncdls_type));
                        }
                    });
                })
            );
        });
    };

    getBundleName(Maoxian_level: any) {
        let Maoxian_Index = this.getLevelIndex(Maoxian_level);
        if (Maoxian_Index <= 30) {
            return "Levels1";
        }
        else if (Maoxian_Index <= 60) {
            return "Levels2";
        }
        else if (Maoxian_Index <= 100) {
            return "Levels3";
        }
        else if (Maoxian_Index <= 200) {
            return "Levels4";
        }
        else if (Maoxian_Index <= 300) {
            return "Levels5";
        }
        else if (Maoxian_Index <= 400) {
            return "Levels6";
        }
        else {
            return "Levels7";
        }
    }

    ROPE_MAX_LEVEL = 500;
    getLevelIndex(Maoxian_level: any) {
        let Maoxian_Index = Maoxian_level;
        if (Maoxian_level > this.ROPE_MAX_LEVEL) {
            Maoxian_Index = ((Maoxian_level - 1) % this.ROPE_MAX_LEVEL) + 1;
        }
        return Maoxian_Index;
    };

    vibrateShort() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.vibrateShort();
        }
    }
}
