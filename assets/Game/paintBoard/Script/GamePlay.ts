import AudioManager from "../../Script/AudioManager";
import BaseComponent from "../../Script/BaseComponent";
import { Wzhcq_StorageName } from "../../Script/Enum";
import ResourceLoader from "../../Script/ResourceLoader";
import { Utils } from "../../Script/Utils";
import RopeTexture from "./RopeTexture";
import PaintBoard from "./paintBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePlay extends BaseComponent {

    @property(PaintBoard)
    paintBoard: PaintBoard = null;

    @property(cc.EditBox)
    levelEditBox: cc.EditBox = null;

    @property(cc.Label)
    boardLevel: cc.Label = null;

    @property(cc.Node)
    levelRoot: cc.Node = null;

    @property(cc.Prefab)
    ropePrefab: cc.Prefab = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.Label)
    segmentLabel: cc.Label = null;

    @property(cc.Node)
    startNode: cc.Node = null;

    @property(cc.Node)
    fristNode: cc.Node = null;

    @property(cc.Node)
    secondNode: cc.Node = null;

    @property(cc.Node)
    mainBtn: cc.Node = null;

    targets = [];
    totalTargetCount = 0;

    level: any = 0;

    onLoad() {
        this.levelEditBox.node.on('editing-did-began', this.onEditBegin, this);
        this.levelEditBox.node.on('text-changed', this.onTextChanged, this);

        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.DRAWCOLOR, this.checkTargetFinish, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.REMOVEALLROPE, this.removeAll, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.UPDATEPROGRESS, this.updateProgress, this);

    }

    protected start(): void {

    }

    protected onEnable(): void {
        this.level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);//this.levelEditBox.string;
        this.boardLevel.string = "No." + this.level;

        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        this.segmentLabel.string = segmentCount;

        this.loadLevel();
        this.paintBoard.initData();

        if (Utils.getInstance.GameType == 0) {
            this.mainBtn.active = false;
        }

        this.fristNode.active = true;
        this.secondNode.active = false;
    }

    updateSegmentCount() {
        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        if (segmentCount > 0) {
            segmentCount -= 5;
        }
        this.segmentLabel.string = segmentCount;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.segmentCount, segmentCount);
    }

    resumeGameBtn() {
        if (Utils.getInstance.GameType == 0) {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.REFRESHTUJIAN, undefined);
        }

        this.level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);//this.levelEditBox.string;
        if (this.level <= Utils.getInstance.MaxLv) {
            let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
            if (segmentCount > 0) {
                this.paintBoard.resetData();
                this.fristNode.active = true;
                this.secondNode.active = false;

                this.boardLevel.string = "No." + this.level;

                this.loadLevel();
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

                this.node.active = false;
            }
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

            this.node.active = false;
        }
    }

    nextBtn() {
        AudioManager.instance.playAudioBtn_Click();

        this.paintBoard.clearAllCells();

        if (Utils.getInstance.GameType == 0) {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.GOINGAME, undefined);
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

        this.node.active = false;
    }

    sureBtn() {
        AudioManager.instance.playAudioBtn_Click();

        this.paintBoard.clearAllCells();

        if (Utils.getInstance.GameType == 0) {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.REFRESHTUJIAN, undefined);
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

        this.node.active = false;
    }

    BackMainBtn() {
        AudioManager.instance.playAudioBtn_Click();

        cc.director.loadScene('Start');
        this.node.active = false;
    }


    previousBtn() {
        AudioManager.instance.playAudioBtn_Click();
        this.node.active = false;
    }

    shareBtn() {
        AudioManager.instance.playAudioBtn_Click();
        Utils.getInstance.pointBoardShare();
    }

    onEditBegin(event: any) {
        console.log('Editing began');
    }

    onTextChanged(event: any) {
        console.log('Text changed:', event.string);
        this.level = event.string;

        this.loadLevel();
    }

    loadLevel() {

        let self = this;
        let bundleName = Utils.getInstance.getBundleName(this.level);

        if (this.level == "") {
            this.level = 0;
        }
        else if (this.level > Utils.getInstance.MaxLv) {
            this.level = Utils.getInstance.MaxLv;
        }
        let res = ResourceLoader.getInstance.load(bundleName, "json/lv_" + this.level, cc.JsonAsset);
        res.then((res2) => {
            self.initGame(res2.json);
        })
    };

    initGame(res: any) {
        this.progressBar.progress = 0;
        this.progressLabel.string = 0 + "%";

        this.initPaintBoard(res)
    };

    updateProgress() {
        this.progressBar.progress = this.getProgress();
        this.progressLabel.string = (100 * this.getProgress()).toFixed(0) + "%";
    }

    initPaintBoard(data: any) {
        this.paintBoard.loadGridData(data);
    };

    createRopeNode(temp_node: any, type: any, amplitude: any) {
        if (void 0 === amplitude) {
            amplitude = 20;
        }
        var node = cc.instantiate(this.ropePrefab);
        this.levelRoot.addChild(node, cc.macro.MAX_ZINDEX);
        var script = node.getComponent(RopeTexture);
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

    getProgress() {
        return (this.paintBoard.history.length - this.paintBoard.drawHistory.length) / this.paintBoard.history.length;
    };

    removeAll() {
        if (this.levelRoot.children.length > 0) {
            this.levelRoot.removeAllChildren();
        }
    }

    checkTargetFinish(colorIndex: any) {
        var self = this;
        cc.log("finish");

        var RopeNode = this.createRopeNode(this.startNode, colorIndex, undefined);

        var data = this.paintBoard.drawWithColor(colorIndex, function (node: any, bool: any) {
            var pos = self.paintBoard.getCellPosition(node.x, node.y);
            var pos2 = self.paintBoard.gridContainer.convertToWorldSpaceAR(pos);
            var position = RopeNode.node.convertToNodeSpaceAR(pos2);
            RopeNode.moveToTarget(position.x, position.y, 0.05);

            AudioManager.instance.playAudiomerge_4();
            Utils.getInstance.vibrateShort();

            if (bool) {
                RopeNode.destroyByReset();

                if (isFinished) {
                    self.fristNode.active = false;
                    self.secondNode.active = true;

                    Utils.getInstance.curFinish = self.level;
                    self.levelRoot.removeAllChildren();
                    AudioManager.instance.playAudiofinished();

                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.currentStep, 0);
                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.boardIndex, self.level + 1);
                }
                else {
                    self.paintBoard.changeAutoPlaying();
                    self.updateSegmentCount();
                }
            }
        });
        var duration = data.duration;
        var isFinished = data.isFinished;
        cc.log("isFinish", isFinished);

        this.progressBar.progress = this.getProgress();
        this.progressLabel.string = (100 * this.getProgress()).toFixed(0) + "%";
    };


}
