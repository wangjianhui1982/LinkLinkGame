import BaseComponent from "../../Script/BaseComponent";
import { Wzhcq_StorageName } from "../../Script/Enum";
import { Utils } from "../../Script/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class paintBoard extends BaseComponent {

    @property(cc.Node)
    gridContainer: cc.Node = null;

    @property(cc.Button)
    previewButton: cc.Button = null;

    @property(cc.SpriteFrame)
    filledSprite: cc.SpriteFrame[] = [];

    @property(cc.Button)
    nextStepButton: cc.Button = null;

    @property(cc.Button)
    lastStepButton: cc.Button = null;

    @property(cc.Button)
    importButton: cc.Button = null;

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property(cc.Node)
    parentNode: cc.Node = null;

    @property(cc.Button)
    prevStepButton: cc.Button = null;

    @property(cc.Node)
    sendBtn: cc.Node = null;

    @property(cc.Node)
    sureBtn: cc.Node = null;

    @property(cc.Node)
    previousBtn: cc.Node = null;

    @property(cc.Node)
    nextBtn: cc.Node = null;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.Node)
    finger: cc.Node = null;

    history = [];
    drawHistory = [];
    currentStep = 0;
    saveStep = 0;
    cellSize = 14;
    rows = 35;
    cols = 35;
    isAutoPlaying = !1;
    playInterval = 0.01;
    COLORS_COUNT = 20;
    cellNodes = new Map();

    touchFlag: boolean = false;
    touchLongAn: boolean = false;
    touchStartTime: any;
    TouchHoldTime: any;
    isAutoTouchHold = false;

    initData() {
        let tiledMap = this.gridContainer.getComponent(cc.TiledMap);
        console.log("tiledMap:", tiledMap);

        this.sendBtn.active = true;
        this.sureBtn.active = false;
        this.isAutoPlaying = true;
        this.isAutoTouchHold = false;

        this.saveStep = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.currentStep);

        if (Utils.getInstance.GameType == 0) {
            this.previousBtn.active = true;
            this.nextBtn.active = false;
        }
        else {
            this.previousBtn.active = false;
            this.nextBtn.active = true;
        }

        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        if (segmentCount > 0) {
            this.sendBtn.active = true;
            this.sureBtn.active = false;
            this.tipLabel.string = "长按连续编织";
        }
        else {
            this.sendBtn.active = false;
            this.sureBtn.active = true;
            this.tipLabel.string = "毛线不足";
        }

        let fingerState = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.fingerState);
        if (fingerState) {
            this.finger.active = true;
            this.finger.position = cc.v3(70, -350);
            cc.tween(this.finger)
                .repeatForever(
                    cc.tween()
                        .delay(0.3)
                        .to(0.2, { angle: 15, position: cc.v3(65, -350) })
                        .to(0.2, { angle: 0, position: cc.v3(70, -350) })
                )
                .start();
        }

        var self = this;
        this.sendBtn.on(cc.Node.EventType.TOUCH_START, function () {

            //触摸开始 
            self.touchFlag = true;
            //记录下触摸开始时间
            self.touchStartTime = new Date();

            // if (self.TouchHoldTime) {
            //     if (self.touchStartTime.getTime() - self.TouchHoldTime.getTime() < 300) {
            //         return;
            //     }
            //     else {
            //         self.playSendStep();
            //         self.TouchHoldTime = null;
            //     }
            // }
            // else {
            //     let milliseconds = new Date().getTime() - self.touchStartTime.getTime();
            //     if (milliseconds > 0) {
            //         console.log("playSendStep2==");
            //         self.touchStartTime = new Date();
            //         return;
            //     }
            //     else {
            //         console.log("playSendStep1==");
            //         self.playSendStep();
            //     }
            // }

        }, this.sendBtn);

        this.sendBtn.on(cc.Node.EventType.TOUCH_MOVE, function (event: any) {

        }, this.sendBtn);

        this.sendBtn.on(cc.Node.EventType.TOUCH_CANCEL, function (event: any) {

            if (!self.touchLongAn) {
                console.log("touchCancel==", self.touchLongAn);
            }
            else {
                console.log("touchCancel==", self.touchLongAn);
                self.isAutoTouchHold = false;
                self.TouchHoldTime = new Date();
            }

            self.touchFlag = false;
            self.touchStartTime = null;
            self.touchLongAn = false;

        }, this.sendBtn);

        this.sendBtn.on(cc.Node.EventType.TOUCH_END, function (event) {

            if (!self.touchLongAn) {
                console.log("touchEnd==", self.touchLongAn);
            }
            else {
                console.log("touchEnd==", self.touchLongAn);
                self.isAutoTouchHold = false;
                self.TouchHoldTime = new Date();
            }

            self.touchFlag = false;
            self.touchStartTime = null;
            self.touchLongAn = false;

        }, this.sendBtn);

        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function () {
                this.adjustNodeHeight();
                this.setupPreviewButton();
                this.setupNextStepButton();
                this.setupPrevStepButton();
                this.setupLastStepButton();
                this.setupImportButton();

                return [2];
            });
        });

    };

    playSaveStep() {
        let Maoxian_self = this;
        if (this.isAutoPlaying) {
            let Maoxian_data = __spreadArrays(this.history).sort(function (Maoxian_temp_data: any, Maoxian_temp_data2: any) {
                return Maoxian_temp_data.step - Maoxian_temp_data2.step;
            })[this.currentStep];

            if (Maoxian_data) {
                let Maoxian_callback = function Maoxian_callback(Maoxian_idx: any) {
                    // Maoxian_self.scheduleOnce(function () {
                    Maoxian_self.drawStepPosition(cc.v2(Maoxian_data.positions[Maoxian_idx].x, Maoxian_data.positions[Maoxian_idx].y), Maoxian_data.colorIndex);
                    // }, 0.01 * Maoxian_idx);
                };
                for (let i = 0; i < Maoxian_data.positions.length; i++) {
                    Maoxian_callback(i);
                }
                let Maoxian_delay = 0.01 * Maoxian_data.positions.length;
                // this.scheduleOnce(function () {
                Maoxian_self.currentStep++;
                this.drawHistory.splice(this.drawHistory.indexOf(Maoxian_data), 1);

                Maoxian_self.EventMgr.emit(Maoxian_self.EventMgr.Wzhcq_EVENT_NAMES.UPDATEPROGRESS, undefined);

                if (Maoxian_self.currentStep < Maoxian_self.saveStep) {
                    Maoxian_self.playSaveStep();
                    // Maoxian_self.currentStep = Maoxian_self.saveStep;
                }
                // }, Maoxian_delay + this.playInterval);
            }
            else {
                this.stopPlay();
            }
        }
    };

    playSendStep() {
        let Maoxian_self = this;
        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        if (segmentCount > 0) {
            if (this.isAutoPlaying) {
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.fingerState, 0);
                this.finger.active = false;

                // console.log("isAutoPlaying1==================");
                let Maoxian_data = __spreadArrays(this.history).sort(function (Maoxian_temp_data: any, Maoxian_temp_data2: any) {
                    return Maoxian_temp_data.step - Maoxian_temp_data2.step;
                })[this.currentStep];

                if (Maoxian_data) {
                    this.isAutoPlaying = false;

                    console.log("Maoxian_data:", Maoxian_data.step);
                    console.log("currentStep:", this.currentStep);

                    if (Maoxian_data) {
                        let Maoxian_callback = function Maoxian_callback(Maoxian_idx: any) {
                            Maoxian_self.scheduleOnce(function () {

                                // Maoxian_self.drawStepPosition(cc.v2(Maoxian_data.positions[Maoxian_idx].x, Maoxian_data.positions[Maoxian_idx].y), Maoxian_data.colorIndex);
                            }, 0.05 * Maoxian_idx);
                        };
                        for (let i = 0; i < Maoxian_data.positions.length; i++) {
                            Maoxian_callback(i);
                        }
                        let Maoxian_delay = 0.05 * Maoxian_data.positions.length;
                        // this.scheduleOnce(function () {
                        Maoxian_self.EventMgr.emit(Maoxian_self.EventMgr.Wzhcq_EVENT_NAMES.DRAWCOLOR, Maoxian_data.colorIndex);

                        Maoxian_self.currentStep++;
                        // Maoxian_self.playNextStep();
                        // }, Maoxian_delay + this.playInterval);
                    }
                    else {
                        this.stopPlay();
                    }
                }

            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "毛线不足");
            this.sendBtn.active = false;

            let self = this;
            this.scheduleOnce(() => {
                self.sureBtn.active = true;
            }, 1);
        }

    };

    playAutoSendStep() {
        let Maoxian_self = this;
        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        if (segmentCount > 0) {
            if (this.isAutoTouchHold) {

                let Maoxian_data = __spreadArrays(this.history).sort(function (Maoxian_temp_data: any, Maoxian_temp_data2: any) {
                    return Maoxian_temp_data.step - Maoxian_temp_data2.step;
                })[this.currentStep];

                if (Maoxian_data) {
                    let Maoxian_callback = function Maoxian_callback(Maoxian_idx: any) {
                        Maoxian_self.scheduleOnce(function () {

                            // Maoxian_self.drawStepPosition(cc.v2(Maoxian_data.positions[Maoxian_idx].x, Maoxian_data.positions[Maoxian_idx].y), Maoxian_data.colorIndex);
                        }, 0.01 * Maoxian_idx);
                    };
                    for (let i = 0; i < Maoxian_data.positions.length; i++) {
                        Maoxian_callback(i);
                    }
                    let Maoxian_delay = 0.01 * Maoxian_data.positions.length;
                    // this.scheduleOnce(function () {
                    Maoxian_self.EventMgr.emit(Maoxian_self.EventMgr.Wzhcq_EVENT_NAMES.DRAWCOLOR, Maoxian_data.colorIndex);

                    Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.currentStep, Maoxian_self.currentStep);
                    Maoxian_self.currentStep++;
                    // }, Maoxian_delay + this.playInterval);
                }
                else {
                    this.stopPlay();
                }
            }
        }
        else {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_GAME_TIPS, "毛线不足");
            this.sendBtn.active = false;

            let self = this;
            this.scheduleOnce(() => {
                self.sureBtn.active = true;
            }, 1);
        }

    };

    resetData() {
        this.drawHistory = [];
        this.currentStep = 0;
        this.cellSize = 14;
        this.rows = 35;
        this.cols = 35;
        this.isAutoPlaying = true;
        this.isAutoTouchHold = false;
        this.playInterval = 0.01;
        this.COLORS_COUNT = 20;
        this.saveStep = 0;

        this.clearAllCells();
    }

    isFinished() {
        this.sendBtn.active = false;
        this.sureBtn.active = true;
    }

    changeAutoPlaying() {
        this.isAutoPlaying = true;
        // console.log("isAutoPlaying2==================");

        if (this.isAutoTouchHold) {
            this.playAutoSendStep();
        }

        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.currentStep, this.currentStep);
        let segmentCount = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.segmentCount);
        if (segmentCount > 0) {
            this.tipLabel.string = "长按连续编织";
            this.sendBtn.active = true;
            this.sureBtn.active = false;
        }
        else {
            this.tipLabel.string = "毛线不足";
            this.sendBtn.active = false;

            let self = this;
            this.scheduleOnce(() => {
                self.sureBtn.active = true;
            }, 0.3);
        }
    }

    //长按检测函数
    touchHold() {
        if (this.touchFlag && this.touchStartTime != null) {
            //判断按钮的按压时长
            let touchHoldTime = new Date();
            let milliseconds = touchHoldTime.getTime() - this.touchStartTime.getTime();

            if (this.isAutoPlaying) {
                if (milliseconds > 300) {
                    this.touchLongAn = true;
                    this.touchFlag = false;
                    //触发托管事务逻辑 
                    //todo...
                    console.log("touchHold=================");
                    this.isAutoTouchHold = true;

                    this.playAutoSendStep();
                }
            }

        }
    }

    update(dt: any) {
        //判断是否检测按钮长按状态
        if (this.touchFlag) {
            this.touchHold();
        }
    }

    adjustNodeHeight() {
        if (this.gridContainer) {
            let Maoxian_cols = this.cols * this.cellSize;
            let Maoxian_rows = this.rows * this.cellSize;
            let Maoxian_offX = -Maoxian_cols / 2;
            let Maoxian_offY = -Maoxian_rows / 2;
            this.gridContainer.setPosition(Maoxian_offX, Maoxian_offY);
            if (this.parentNode) {
                this.parentNode.getComponent(cc.Widget).updateAlignment();
                let Maoxian_height = cc.winSize.height / 2 - this.parentNode.y - 50;
                let Maoxian_SafeAreaRect = cc.sys.getSafeAreaRect();
                if ((Maoxian_height -= cc.winSize.height - Maoxian_SafeAreaRect.height - Maoxian_SafeAreaRect.y) > Maoxian_rows) {
                    Maoxian_height = Maoxian_rows;
                }
                cc.log("nodeHeight", Maoxian_height);
                this.parentNode.height = Maoxian_height;
                console.log("cc.sys.getSafeAreaRect()", cc.sys.getSafeAreaRect());
            }
        }
    };

    redrawToStep(Maoxian_step: any, Maoxian_BuiltinName: any) {
        let Maoxian_self = this;
        if (void 0 === Maoxian_BuiltinName) {
            Maoxian_BuiltinName = "2d-sprite";
        }
        this.clearAllCells();

        __spreadArrays(this.history)
            .sort(function (Maoxian_data: any, Maoxian_data2: any) {
                return Maoxian_data.step - Maoxian_data2.step;
            })
            .forEach(function (Maoxian_data: any) {
                if (Maoxian_data.step <= Maoxian_step) {
                    Maoxian_data.positions.forEach(function (Maoxian_position: any) {
                        let Maoxian_node = Maoxian_self.drawCell(Maoxian_position.x, Maoxian_position.y, Maoxian_data.colorIndex);
                        if (Maoxian_node &&
                            (
                                Maoxian_self.isAutoPlaying &&
                                Maoxian_data.step === Maoxian_step &&
                                (
                                    (Maoxian_node.scale = 0),
                                    cc.tween(Maoxian_node)
                                        .to(0.2, { scale: 1.2 })
                                        .to(0.1, { scale: 1 })
                                        .start()
                                ),
                                (Maoxian_node.opacity = 255),
                                Maoxian_self.isAbTest()
                            )
                        ) {
                            if ("2d-gray-sprite" == Maoxian_BuiltinName) {
                                Maoxian_node.opacity = 80;
                            }
                            let Material = cc.Material.getBuiltinMaterial(Maoxian_BuiltinName);
                            Maoxian_node.getComponent(cc.Sprite).setMaterial(0, Material);
                        }
                    });
                }
            });
    };

    drawCell(Maoxian_offX: any, Maoxian_offY: any, Maoxian_colorIndex: any) {
        if (Maoxian_offX < 0 || Maoxian_offX >= this.cols || Maoxian_offY < 0 || Maoxian_offY >= this.rows) {
            return null;
        }
        let Maoxian_key = Maoxian_offX + "," + Maoxian_offY;
        let Maoxian_node = this.cellNodes.get(Maoxian_key);
        if (!Maoxian_node) {
            Maoxian_node = new cc.Node("Cell");
            let Maoxian_sprite = Maoxian_node.addComponent(cc.Sprite);
            Maoxian_sprite.spriteFrame = this.filledSprite[Maoxian_colorIndex];
            Maoxian_sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            Maoxian_node.parent = this.gridContainer;
            Maoxian_node.width = this.cellSize - 0;
            Maoxian_node.height = this.cellSize - 0;
            Maoxian_node.anchorX = 0.5;
            Maoxian_node.anchorY = 0.5;
            Maoxian_node.setPosition(this.getCellPosition(Maoxian_offX, Maoxian_offY));
            this.cellNodes.set(Maoxian_key, Maoxian_node);
        }
        return Maoxian_node;
    };

    getCellPosition(Maoxian_offX: any, Maoxian_offY: any) {
        return cc.v3(Maoxian_offX * this.cellSize + this.cellSize / 2, Maoxian_offY * this.cellSize + this.cellSize / 2, 0);
    };

    setupPreviewButton() {
        let Maoxian_self = this;
        if (this.previewButton) {
            this.previewButton.node.on("click", function () {
                Maoxian_self.autoPlayClick();
            });
        }
    };

    autoPlayClick() {
        if (this.isAutoPlaying) {
            this.stopPlay();
        }
        else {
            this.startPlay();
        }

    };

    startPlay() {
        this.isAutoPlaying = !0;
        console.log("isAutoPlaying3==================");
        if (this.currentStep >= this.history.length) {
            // this.clearAllCells();
            // this.currentStep = 0;

            this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.REMOVEALLROPE, undefined);
            this.isFinished();
            return;
        }
        if (this.previewButton) {
            this.previewButton.node.color = cc.Color.GREEN;
        }
        this.playNextStep();
    };

    drawStepPosition(Maoxian_position: any, Maoxian_colorIndex: any) {
        let Maoxian_node = this.drawCell(Maoxian_position.x, Maoxian_position.y, Maoxian_colorIndex);

        if (Maoxian_node &&
            (
                (Maoxian_node.scale = 0),
                cc.tween(Maoxian_node)
                    .to(0.2, { scale: 1.2 })
                    .to(0.1, { scale: 1 })
                    .start(),
                (Maoxian_node.opacity = 255),
                this.isAbTest()
            )
        ) {
            let Material = cc.Material.getBuiltinMaterial("2d-sprite");
            Maoxian_node.getComponent(cc.Sprite).setMaterial(0, Material);
        }
        if (this.isInViewport(Maoxian_position.x, Maoxian_position.y)) {

        }
        else {
            this.scrollToCell(Maoxian_position.x, Maoxian_position.y);
        }
    };

    playNextStep() {
        let Maoxian_self = this;
        if (this.isAutoPlaying) {
            let Maoxian_data = __spreadArrays(this.history).sort(function (Maoxian_temp_data: any, Maoxian_temp_data2: any) {
                return Maoxian_temp_data.step - Maoxian_temp_data2.step;
            })[this.currentStep];

            if (Maoxian_data) {
                let Maoxian_callback = function Maoxian_callback(Maoxian_idx: any) {
                    Maoxian_self.scheduleOnce(function () {

                        // Maoxian_self.drawStepPosition(cc.v2(Maoxian_data.positions[Maoxian_idx].x, Maoxian_data.positions[Maoxian_idx].y), Maoxian_data.colorIndex);
                    }, 0.01 * Maoxian_idx);
                };
                for (let i = 0; i < Maoxian_data.positions.length; i++) {
                    Maoxian_callback(i);
                }
                let Maoxian_delay = 0.01 * Maoxian_data.positions.length;
                this.scheduleOnce(function () {
                    Maoxian_self.EventMgr.emit(Maoxian_self.EventMgr.Wzhcq_EVENT_NAMES.DRAWCOLOR, Maoxian_data.colorIndex);

                    Maoxian_self.currentStep++;
                    Maoxian_self.playNextStep();
                }, Maoxian_delay + this.playInterval);
            }
            else {
                this.stopPlay();
            }
        }
    };

    drawWithColor(Maoxian_colorIndex: any, Maoxian_callback: any) {
        let Maoxian_self = this;
        let Maoxian_array = __spreadArrays(this.drawHistory).sort(function (Maoxian_temp_data: any, Maoxian_temp_data2: any) {
            return Maoxian_temp_data.step - Maoxian_temp_data2.step;
        });
        let Maoxian_Index = Maoxian_array.findIndex(function (Maoxian_temp_data: any) {
            return Maoxian_temp_data.colorIndex === Maoxian_colorIndex;
        });
        if (-1 === Maoxian_Index) {
            this.isAutoPlaying = true;
            cc.warn("未找到颜色索引 " + Maoxian_colorIndex + " 对应的步骤");
            return {
                duration: 0,
                isFinished: !1
            };
        }
        let Maoxian_data = Maoxian_array[Maoxian_Index];
        Maoxian_data.positions.forEach(function (Maoxian_position: any, Maoxian_delay: any) {
            Maoxian_self.scheduleOnce(function () {
                Maoxian_self.drawStepPosition(cc.v2(Maoxian_position.x, Maoxian_position.y), Maoxian_colorIndex);
                if (Maoxian_callback) {
                    Maoxian_callback(Maoxian_position, Maoxian_delay == Maoxian_data.positions.length - 1);
                }
            }, 0.02 * Maoxian_delay);
        });
        this.drawHistory.splice(this.drawHistory.indexOf(Maoxian_data), 1);
        cc.log("targetStep", Maoxian_data.positions.length);

        return {
            duration: 0.02 * Maoxian_data.positions.length,
            isFinished: 0 === this.drawHistory.length
        };
    };

    stopPlay() {
        this.isAutoPlaying = !1;
        console.log("isAutoPlaying4===================");
        if (this.previewButton) {
            this.previewButton.node.color = cc.Color.WHITE;
        }
    };

    setupNextStepButton() {
        let Maoxian_self = this;
        if (this.nextStepButton) {
            this.nextStepButton.node.on("click", function () {
                Maoxian_self.playNextStepManually();
            });
        }
    };

    playNextStepManually() {
        cc.log("playNextStepManually", this.currentStep);
        this.stopPlay();
        this.currentStep++;
        if (this.currentStep > this.history.length) {
            this.currentStep = 1;
        }
        this.redrawToStep(this.currentStep, undefined);
    };

    setupPrevStepButton() {
        let Maoxian_self = this;
        if (this.prevStepButton) {
            this.prevStepButton.node.on("click", function () {
                Maoxian_self.playPrevStepManually();
            });
        }
    };

    playPrevStepManually() {
        this.stopPlay();
        this.currentStep--;
        if (this.currentStep < 1) {
            this.currentStep = this.history.length;
        }
        this.redrawToStep(this.currentStep, undefined);
    };

    setupLastStepButton() {
        let Maoxian_self = this;
        if (this.lastStepButton) {
            this.lastStepButton.node.on("click", function () {
                Maoxian_self.jumpToLastStep();
            });
        }
    };

    jumpToLastStep() {
        if (this.isAutoPlaying) {

        }
        else {
            this.currentStep = this.history.length;
            this.redrawToStep(this.currentStep, undefined);
        }
    };

    setupImportButton() {
        let Maoxian_self = this;
        if (this.importButton) {
            this.importButton.node.on("click", function () {
                Maoxian_self.importJson();
            });
        }
    };

    clearAllCells() {
        this.cellNodes.forEach(function (Maoxian_node) {
            Maoxian_node.destroy();
        });
        this.cellNodes.clear();
    };

    loadGridData(Maoxian_data: any) {
        let Maoxian_self = this;
        if (this.validateJsonData(Maoxian_data)) {
            this.history = [];
            Maoxian_data.s.forEach(function (Maoxian_obj: any) {
                Maoxian_self.history.push({
                    positions: Maoxian_obj.p.map(function (Maoxian_array: any) {
                        return {
                            x: Maoxian_array[0],
                            y: Maoxian_array[1]
                        };
                    }),
                    colorIndex: Maoxian_obj.c,
                    step: Maoxian_obj.s
                });
            });
            this.drawHistory = __spreadArrays(this.history);
            this.currentStep = 0;
            if (this.isAbTest()) {
                this.redrawToStep(this.history.length, "2d-gray-sprite");
            }
            else {
                this.redrawToStep(this.currentStep, undefined);
            }
            this.resetPaintBoardPosition();
            cc.log("this.history", this.history.length);

            if (this.saveStep > this.history.length) {
                let level = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.boardIndex);
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.boardIndex, level + 1);
            }

            if (this.currentStep < this.saveStep) {
                this.playSaveStep();
            }
        }
        else {
            cc.warn("无效的JSON格式");
        }
    };

    resetPaintBoardPosition() {
        let Maoxian_data: any;
        if ((null === (Maoxian_data = this.gridContainer) || void 0 === Maoxian_data ? void 0 : Maoxian_data.parent) && this.maskNode) {
            let Maoxian_height = this.maskNode.height;
            let Maoxian_rows = this.rows * this.cellSize;
            let Maoxian_minY = Maoxian_height - Maoxian_rows / 2;
            let Maoxian_maxY = Maoxian_rows / 2;
            Maoxian_minY = Math.min(Maoxian_minY, Maoxian_maxY);
            this.gridContainer.parent.y = Maoxian_minY;
            cc.log("minY", Maoxian_minY);
            cc.log("maxY", Maoxian_maxY);
        }
    };

    validateJsonData(e) {
        let self = this;
        if (e) {
            if (e.s && Array.isArray(e.s)) {
                return e.s.every(function (e, o) {
                    if ((null == e ? void 0 : e.p) && Array.isArray(e.p)) {
                        if ("number" != typeof e.c || e.c < 0 || e.c >= self.COLORS_COUNT) {
                            return cc.warn("步骤 " + o + " 的颜色索引无效:", e.c), !1;
                        }
                        else {
                            if ("number" != typeof e.s) {
                                return cc.warn("步骤 " + o + " 的步骤号无效:", e.s), !1;
                            }
                            else {
                                return e.p.every(function (e, n) {
                                    if (!Array.isArray(e) || 2 !== e.length) {
                                        cc.warn("步骤 " + o + " 的位置 " + n + " 格式无效:", e);
                                        return !1;
                                    }
                                    var i = e[0];
                                    var r = e[1];
                                    return (
                                        !!self.isPointInGrid(i, r) ||
                                        (cc.warn("步骤 " + o + " 的位置 " + n + " 超出网格范围: x=" + i + ", y=" + r),
                                            !1)
                                    );
                                });
                            }
                        }
                    }
                    else {
                        return cc.warn("步骤 " + o + " 的位置数据效:", e), !1;
                    }
                });
            }
            else {
                return cc.warn("数据缺少steps数组或格错:", e), !1;
            }
        }
        else {
            return cc.warn("数据为空"), !1;
        }
    };

    isPointInGrid(offX: any, offY: any) {
        return offX >= 0 && offX < this.cols && offY >= 0 && offY < this.rows;
    };

    importJson() {
        let e = this;
        let t = document.createElement("input");
        t.type = "file";
        t.accept = ".json";
        t.style.display = "none";
        t.onchange = function (t) {
            var o;
            var n = null;
            if (null === (o = t.target.files) || void 0 === o) {
                n = void 0;
            }
            else {
                n = o[0];
            }
            if (n) {
                var i = new FileReader();
                i.onload = function (t) {
                    var o;
                    try {
                        var n = JSON.parse(null === (o = t.target) || void 0 === o ? void 0 : o.result);
                        e.loadGridData(n);
                    }
                    catch (i) {
                        cc.warn("JSON解析错误:", i);
                    }
                };
                i.readAsText(n);
            }
        };
        t.click();
    };

    scrollToCell(event: any, Maoxian_idx: any) {
        let Maoxian_data: any;
        if ((null === (Maoxian_data = this.gridContainer) || void 0 === Maoxian_data ? void 0 : Maoxian_data.parent) && this.maskNode) {
            let Maoxian_height = this.maskNode.height;
            let Maoxian_rows = this.rows * this.cellSize;
            let Maoxian_node = this.gridContainer.parent;
            let a = Maoxian_height - Maoxian_rows / 2;
            let s = Maoxian_rows / 2;
            let targetY = a - (Maoxian_idx * this.cellSize - Maoxian_rows / 2 - -a) + Maoxian_height / 2;
            cc.log("targetY", targetY);

            let l = Math.max(a, Math.min(s, targetY));
            cc.log("clampedTargetY", l);
            cc.Tween.stopAllByTarget(Maoxian_node);
            cc.tween(Maoxian_node)
                .to(0.2, { position: cc.v3(0, l, 0) }, { easing: "quartOut" })
                .start();
        }
    };

    isInViewport(event: any, Maoxian_idx: any) {
        let Maoxian_data: any;
        if (!(null === (Maoxian_data = this.gridContainer) || void 0 === Maoxian_data ? void 0 : Maoxian_data.parent) || !this.maskNode) {
            return !0;
        }
        let Maoxian_height = this.maskNode.height;
        let Maoxian_rows = this.rows * this.cellSize;
        let Maoxian_node = this.gridContainer.parent;
        let Maoxian_offY = Maoxian_idx * this.cellSize - Maoxian_rows / 2 + Maoxian_node.y;
        return Maoxian_offY >= 0 && Maoxian_offY <= Maoxian_height;
    };

    getSteps() {
        return this.history;
    };

    onSaveAsPNG() {
        this.jumpToLastStep();
        this.saveAsPNG();
    };

    saveAsPNG() {
        let Maoxian_render = new cc.RenderTexture();
        Maoxian_render.initWithSize(490, 490);
        let Maoxian_node = new cc.Node();
        Maoxian_node.parent = cc.director.getScene();
        Maoxian_node.setContentSize(490, 490);
        let Maoxian_pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let Maoxian_position = Maoxian_node.convertToNodeSpaceAR(Maoxian_pos);
        Maoxian_node.setPosition(Maoxian_position);

        let Maoxian_node2 = new cc.Node();
        let Maoxian_camera = Maoxian_node2.addComponent(cc.Camera);
        Maoxian_camera.clearFlags = cc.Camera.ClearFlags.COLOR;
        Maoxian_camera.backgroundColor = cc.color(0, 0, 0, 0);
        Maoxian_camera.targetTexture = Maoxian_render;
        Maoxian_node.addChild(Maoxian_node2);

        Maoxian_node2.setPosition(0, 0, 1e3);
        Maoxian_camera.orthoSize = 245;
        Maoxian_camera.zoomRatio = 3;
        Maoxian_camera.render(this.node);
        let Maoxian_canvas = document.createElement("canvas");
        Maoxian_canvas.width = 490;
        Maoxian_canvas.height = 490;

        let Maoxian_context = Maoxian_canvas.getContext("2d");
        if (Maoxian_context) {
            let c = Maoxian_render.readPixels();
            let imageData = Maoxian_context.createImageData(490, 490);
            for (let p = 0; p < 490; p++) {
                for (let d = 0; d < 490; d++) {
                    let h = 4 * (490 * p + d);
                    let f = 4 * (490 * (489 - p) + d);
                    imageData.data[f] = c[h];
                    imageData.data[f + 1] = c[h + 1];
                    imageData.data[f + 2] = c[h + 2];
                    imageData.data[f + 3] = c[h + 3];
                }
            }
            Maoxian_context.putImageData(imageData, 0, 0);
            let Maoxian_canvas2 = document.createElement("canvas");
            Maoxian_canvas2.width = 196;
            Maoxian_canvas2.height = 196;
            var Maoxian_context2 = Maoxian_canvas2.getContext("2d");
            if (Maoxian_context2) {
                Maoxian_context2.drawImage(Maoxian_canvas, 0, 0, 196, 196);
                var Maoxian_element = document.createElement("a");
                // v.download = $overallSystem.sers().userSrv.getFeibiaoData().level + ".png";

                let level = 1;
                Maoxian_element.download = level + ".png";
                Maoxian_element.href = Maoxian_canvas2.toDataURL("image/png");
                Maoxian_element.click();
            }
        }
        Maoxian_node.destroy();
        Maoxian_render.destroy();
    };

    isAbTest() {
        return !1;
    };


}
