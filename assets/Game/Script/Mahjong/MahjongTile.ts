/*
 * @Author: PanYu gordon_pp@163.com
 * @Date: 2023-07-13 20:59:39
 * @LastEditors: PanYu gordon_pp@163.com
 * @LastEditTime: 2023-07-28 18:39:08
 * @FilePath: \Nuoduidui\assets\Game\Script\Mahjong\MahjongTile.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEvoid
 */

import AudioManager from '../AudioManager';
import BaseComponent from '../BaseComponent';
import { Wzhcq_StorageName } from '../Enum';
import { RemoveData } from '../EventMgr';
import Game, { DIR, ECellType, GridInfo } from '../Game';
import { Utils } from '../Utils';
import MahjongTileData, { MahjongPos, SUIT } from './MahjongTileData';

const { ccclass, property } = cc._decorator;

let cfg = [
    { Row: 8, Col: 6, minimumPairsToPreserve: 2, scale: 1.3125 },
    { Row: 10, Col: 8, minimumPairsToPreserve: 5, scale: 1.125 },
    { Row: 12, Col: 10, minimumPairsToPreserve: 10, scale: 1 },
];

@ccclass
export default class MahjongTile extends BaseComponent {
    private MahjongData: MahjongTileData;

    private FRAMME_NAMES: {};

    private LocalPos: cc.Vec3;

    public LastGrid;

    private Owner: Game;

    public MoveGroup: {};

    public MoveUpGroup: {};

    public MoveDownGroup: {};

    public MoveLefGroup: {};

    public MoveRightGroup: {};

    private StartMove: boolean;

    private MoveDir: DIR;

    public LocalKey: string;

    public MahjongListCache;

    @property(cc.Node)
    protected TipNode: cc.Node = null;

    @property(cc.Node)
    protected TipsTs: cc.Node = null;

    public moveMinX;
    public moveMaxX;
    public moveMinY;
    public moveMaxY;

    touchStart_delta: any;
    touchMove_delta: any;
    touchEnd_delta: any;

    @property(cc.SpriteAtlas)
    protected mahjongAtlas: cc.SpriteAtlas = null;

    @property(cc.Sprite)
    protected MahjongSprite: cc.Sprite = null;

    @property(cc.Node)
    protected front: cc.Node = null;

    @property(cc.Node)
    protected water: cc.Node = null;

    @property()
    private _type = 0;

    @property()
    get eType() {
        return this._type;
    }
    set eType(type) {
        this._type = type;
        this.setType(type);
    }

    public SetTipNodeVisible(visible): void {
        this.TipNode.active = visible;
    }

    public SetTsVisible(Wzhcq_visible: any): void {
        this.TipsTs.active = Wzhcq_visible;
    }

    public SetWaterVisible(Wzhcq_visible: any): void {
        this.water.active = Wzhcq_visible;
    }

    public SetLocalKey(key: string): void {
        this.LocalKey = key;
    }

    public GetMahjongData(): MahjongTileData {
        return this.MahjongData;
    }

    public GetMahjongPos(): MahjongPos {
        return this.MahjongData.GetPos();
    }

    public SetMahjongPos(pos: MahjongPos): void {
        this.MahjongData.SetPos(pos);
    }

    public SetLocalPos(pos: cc.Vec3) {
        this.LocalPos = pos;
    }

    public InitMahjongData(data: MahjongTileData, owner: Game) {
        this.MahjongData = data;
        this.Owner = owner;
    }

    private ResetAllMoveGroup(): void {
        this.MoveGroup = {};
        this.MoveUpGroup = {};
        this.MoveDownGroup = {};
        this.MoveLefGroup = {};
        this.MoveRightGroup = {};
        this.StartMove = false;
    }

    protected onLoad(): void {
        this.FRAMME_NAMES = {
            0: 'tong',
            1: 'wan',
            2: 'tiao',
            3: 'zhong',
            4: 'fa',
            5: 'bai',
            6: 'dong',
            7: 'nan',
            8: 'xi',
            9: 'bei',
            10: 'chun',
            11: 'xia',
            12: 'qiu',
            13: 'dong2',
            14: 'jv',
            15: 'lan',
            16: 'mei',
            17: 'zhu',
        };
        this.ResetAllMoveGroup();
        this.InitClickEvent();

        if (Utils.getInstance.GameType == 4) {
            this.node.scale = Utils.getInstance.levelData[Utils.getInstance.Level].scale;
        }
        else if (Utils.getInstance.GameType == 1 ||
            Utils.getInstance.GameType == 2 ||
            Utils.getInstance.GameType == 3 ||
            Utils.getInstance.GameType == 5) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                this.node.scale = 0.9;
            }
            else {
                this.node.scale = Utils.getInstance.levelData[Utils.getInstance.Level].scale;
            }

        }
        else if (Utils.getInstance.GameType == 6) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                this.node.scale = 0.9;
            }
            else {
                this.node.scale = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale;
            }
        }
    }

    setScale(scale) {
        this.node.scale = scale;
    }

    setType(type: number) {
        let color: cc.Color = cc.color(113, 190, 113);
        switch (type) {
            case ECellType.START: {
                color = cc.color(125, 125, 226);
                break;
            }
            case ECellType.END: {
                color = cc.color(226, 125, 125);
                break;
            }
            case ECellType.PATH: {
                color = cc.color(125, 226, 125);
                this.SetWaterVisible(true);
                break;
            }
            case ECellType.OBSTACLES: {
                // color = cc.color(125, 125, 125);
                color = cc.color(255, 255, 255);
                break;
            }
            case ECellType.NOMAL: {
                color = cc.color(255, 255, 255);
                break;
            }
        }
        this.front.color = color;

    }

    private InitClickEvent(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
    }

    Close() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.OnTouchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
    }

    protected OnTouchStart(event) {

        let touch: cc.Touch = event.touch;
        this.touchStart_delta = touch.getDelta();

        this.Owner.Wzhcq_IsShowMovetip = true;

        this.MoveUpGroup = this.Owner.findElementsInDirection(this, DIR.UP);
        // console.log('能向上移动的麻将 = ', this.MoveUpGroup);

        this.MoveDownGroup = this.Owner.findElementsInDirection(this, DIR.DOWN);
        // console.log('能向下移动的麻将 = ', this.MoveDownGroup);

        this.MoveLefGroup = this.Owner.findElementsInDirection(this, DIR.LEFT);
        // console.log('能向左移动的麻将 = ', this.MoveLefGroup);

        this.MoveRightGroup = this.Owner.findElementsInDirection(this, DIR.RIGHT);
        // console.log('能向右移动的麻将 = ', this.MoveRightGroup);
        this.Owner.hideGuide();
        this.Owner.IsGuide();
    }

    protected OnTouchCancel(event): void {
        if (this.Owner.mahjongTouchState) {
            // console.log("OnTouchCancel=================");
            this.TouchEnd(false);
        }
    }

    protected OnTouchEnd(event): void {
        let touch: cc.Touch = event.touch;
        this.touchEnd_delta = touch.getDelta();
        if (this.Owner.mahjongTouchState) {
            // console.log("OnTouchEnd=================");
            this.TouchEnd(false);
        }
    }

    public ResetMove() {
        let Wzhcq_mahjongCache2 = [];
        let Wzhcq_needDeleteCache2 = [];
        for (let key in this.MoveGroup) {
            let Wzhcq_element = this.MoveGroup[key];
            let Wzhcq_gridinfo: GridInfo = this.Owner.GetInPosGrid(Wzhcq_element.node.position);
            Wzhcq_needDeleteCache2.push(key);
            Wzhcq_element.node.position = Wzhcq_gridinfo.grid.position;
            Wzhcq_element.MahjongData.SetPos(JSON.parse(Wzhcq_gridinfo.key));
            Wzhcq_element.SetLocalKey(Wzhcq_element.GetPosKey());
            Wzhcq_element.SetLocalPos(Wzhcq_element.node.position);
            Wzhcq_mahjongCache2.push(Wzhcq_element);
        }
        Wzhcq_needDeleteCache2.forEach((Wzhcq_element) => {
            delete this.Owner.Wzhcq_MahjongList[Wzhcq_element];
        });
        Wzhcq_mahjongCache2.forEach((Wzhcq_element) => {
            this.Owner.Wzhcq_MahjongList[Wzhcq_element.GetPosKey()] = Wzhcq_element;
        });
    }

    private TouchEnd(bool: any): void {
        for (let key in this.Owner.Wzhcq_MahjongList) {
            let Wzhcq_element = this.Owner.Wzhcq_MahjongList[key];
            Wzhcq_element.SetTipNodeVisible(false);
        }

        let Wzhcq_mahjongCache1 = [];
        let Wzhcq_needDeleteCache1 = [];
        for (let k in this.MoveGroup) {
            let Wzhcq_moveMahjong = this.MoveGroup[k];
            let Wzhcq_gridinfo: GridInfo = this.Owner.GetInPosGrid(Wzhcq_moveMahjong.node.position);
            Wzhcq_needDeleteCache1.push(k);
            Wzhcq_moveMahjong.node.position = Wzhcq_gridinfo.grid.position;
            Wzhcq_moveMahjong.MahjongData.SetPos(JSON.parse(Wzhcq_gridinfo.key));
            Wzhcq_mahjongCache1.push(Wzhcq_moveMahjong);
        }

        Wzhcq_needDeleteCache1.forEach((Wzhcq_element) => {
            delete this.Owner.Wzhcq_MahjongList[Wzhcq_element];
        });

        Wzhcq_mahjongCache1.forEach((Wzhcq_element) => {
            this.Owner.Wzhcq_MahjongList[Wzhcq_element.GetPosKey()] = Wzhcq_element;
        });
        if (!this.StartMove) {
            let Wzhcq_success = this.Owner.OnMahjongTouchEnd2(this);
            if (!Wzhcq_success) {
                AudioManager.instance.playAudioTouchMove();
                if (this.Owner.Wzhcq_stepIndex > 2) {
                    this.Owner.cancelGuideData();
                }

                if (bool) {
                    if (Math.abs(this.touchEnd_delta.x - this.touchStart_delta.x) < 1 && Math.abs(this.touchEnd_delta.y - this.touchStart_delta.y) < 1) {
                        for (let key in this.Owner.Wzhcq_MahjongList) {
                            let Wzhcq_element = this.Owner.Wzhcq_MahjongList[key];
                            if (this.MahjongData.Suit == Wzhcq_element.MahjongData.Suit && this.MahjongData.Num == Wzhcq_element.MahjongData.Num) {
                                // Wzhcq_element.SetTipNodeVisible(true);
                                this.shakeAction(Wzhcq_element.node);
                            }
                        }
                    }
                }
            }
        }
        else {
            let Wzhcq_canRemove = false;
            let Wzhcq_moveLength = Object.keys(this.MoveGroup).length;

            if (Wzhcq_moveLength > 1) {
                if (this.MoveDir == DIR.LEFT || this.MoveDir == DIR.RIGHT) {
                    let Wzhcq_downmahjong = this.Owner.Wzhcq_CheckDownHasMathMajong(this);
                    if (Wzhcq_downmahjong) {
                        let data: RemoveData = {
                            self: this,
                            target: Wzhcq_downmahjong,
                        };

                        if (Utils.getInstance.GameType != 6 && Utils.getInstance.autoState && Utils.getInstance.MoveCount <= Utils.getInstance.MaxMoveCount) {
                            Utils.getInstance.MoveCount++;
                        }

                        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, data);

                        delete this.MoveGroup[this.LocalKey];
                        delete this.Owner.Wzhcq_MahjongList[Wzhcq_downmahjong.GetPosKey()];
                        delete this.Owner.Wzhcq_MahjongList[JSON.stringify(this.MahjongData.GetPos())];
                        Wzhcq_downmahjong.Remove();
                        // this.Owner.AudioSucess.play();
                        AudioManager.instance.playAudioXiaoChu();

                        this.ResetMove();
                        this.scheduleOnce(() => {
                            this.Remove();
                        });
                        Wzhcq_canRemove = true;
                    }
                    else {
                        let Wzhcq_upmahjong = this.Owner.Wzhcq_CheckUpHasMathMajong(this);
                        if (Wzhcq_upmahjong) {
                            let data: RemoveData = {
                                self: this,
                                target: Wzhcq_upmahjong,
                            };

                            if (Utils.getInstance.GameType != 6 && Utils.getInstance.autoState && Utils.getInstance.MoveCount <= Utils.getInstance.MaxMoveCount) {
                                Utils.getInstance.MoveCount++;
                            }

                            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, data);

                            delete this.MoveGroup[this.LocalKey];
                            delete this.Owner.Wzhcq_MahjongList[Wzhcq_upmahjong.GetPosKey()];
                            delete this.Owner.Wzhcq_MahjongList[JSON.stringify(this.MahjongData.GetPos())];
                            Wzhcq_upmahjong.Remove();
                            AudioManager.instance.playAudioXiaoChu();

                            this.ResetMove();
                            this.scheduleOnce(() => {
                                this.Remove();
                            });
                            Wzhcq_canRemove = true;
                        }
                    }
                }

                if (this.MoveDir == DIR.UP || this.MoveDir == DIR.DOWN) {
                    let Wzhcq_left = this.Owner.Wzhcq_CheckLeftHasMathMajong(this);
                    if (Wzhcq_left) {
                        let data: RemoveData = {
                            self: this,
                            target: Wzhcq_left,
                        };

                        if (Utils.getInstance.GameType != 6 && Utils.getInstance.autoState && Utils.getInstance.MoveCount <= Utils.getInstance.MaxMoveCount) {
                            Utils.getInstance.MoveCount++;
                        }

                        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, data);

                        delete this.MoveGroup[this.LocalKey];
                        delete this.Owner.Wzhcq_MahjongList[Wzhcq_left.GetPosKey()];
                        delete this.Owner.Wzhcq_MahjongList[JSON.stringify(this.MahjongData.GetPos())];
                        Wzhcq_left.Remove();
                        AudioManager.instance.playAudioXiaoChu();

                        this.ResetMove();
                        this.scheduleOnce(() => {
                            this.Remove();
                        });
                        Wzhcq_canRemove = true;
                    }
                    else {
                        let Wzhcq_right = this.Owner.Wzhcq_CheckRightHasMathMajong(this);
                        if (Wzhcq_right) {
                            let data: RemoveData = {
                                self: this,
                                target: Wzhcq_right,
                            };

                            if (Utils.getInstance.GameType != 6 && Utils.getInstance.autoState && Utils.getInstance.MoveCount <= Utils.getInstance.MaxMoveCount) {
                                Utils.getInstance.MoveCount++;
                            }

                            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_REMOVE_SUCESS, data);

                            delete this.MoveGroup[this.LocalKey];
                            delete this.Owner.Wzhcq_MahjongList[Wzhcq_right.GetPosKey()];
                            delete this.Owner.Wzhcq_MahjongList[JSON.stringify(this.MahjongData.GetPos())];
                            Wzhcq_right.Remove();
                            this.ResetMove();
                            AudioManager.instance.playAudioXiaoChu();

                            this.scheduleOnce(() => {
                                this.Remove();
                            });
                            Wzhcq_canRemove = true;
                        }
                    }
                }
            }
            else {
                Wzhcq_canRemove = this.Owner.OnMahjongTouchEnd(this);
            }

            if (Wzhcq_canRemove) {

            }
            else {
                let Wzhcq_mahjongCache3 = [];
                let Wzhcq_needDeleteCache3 = [];
                for (let k in this.MoveGroup) {
                    let Wzhcq_element = this.MoveGroup[k];
                    Wzhcq_needDeleteCache3.push(JSON.stringify(Wzhcq_element.MahjongData.GetPos()));
                    Wzhcq_element.node.position = Wzhcq_element.LocalPos;
                    Wzhcq_element.MahjongData.SetPos(JSON.parse(Wzhcq_element.LocalKey));
                    Wzhcq_mahjongCache3.push(Wzhcq_element);
                }
                Wzhcq_needDeleteCache3.forEach(element => {
                    delete this.Owner.Wzhcq_MahjongList[element];
                });
                Wzhcq_mahjongCache3.forEach(element => {
                    this.Owner.Wzhcq_MahjongList[element.GetPosKey()] = element;
                });
                AudioManager.instance.playAudioTouchMove();

                this.Owner.cancelGuideData();
            }
            this.StartMove = false;
        }

        let self = this;
        this.scheduleOnce(() => {
            self.Owner.clearColor();
        }, 0.3);

        // self.Owner.updateGridOpa();
        if (self.MahjongData.Id != 50) {
            self.EventMgr.emit(self.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CHECK_GAMEOVER, true);
        }
        else {
            self.Owner.updateGridOpa();
        }
        this.ResetAllMoveGroup();
    }

    // 在你的脚本中，假设你已经有了一个名为'nodeToShake'的节点需要抖动

    shakeAction(node: any) {
        // 抖动的持续时间和强度
        let duration = 0.5; // 抖动的持续时间（秒）
        let shakeStrength = 0.1; // 抖动的强度

        let offset = 5;
        // cc.tween(node)
        //     .by(0.1, { position: cc.v2(offset, 0), rotation: 30 })
        //     .by(0.1, { position: cc.v2(-offset, 0), rotation: -30 })
        //     .by(0.1, { position: cc.v2(offset, 0), rotation: 30 })
        //     .by(0.1, { position: cc.v2(-offset, 0), rotation: -30 })
        //     .start();

        cc.tween(node)
            .to(0.08, { angle: 15 })
            .to(0.08, { angle: 0 })
            .to(0.08, { angle: -15 })
            .to(0.08, { angle: 0 })
            .start();
    };

    // 当你不再需要抖动效果时，可以停止动作
    stopShake(node) {
        node.stopAllActions();
    }

    private GetFirstBlock(Wzhcq_mahjong: MahjongTile, Wzhcq_dir: DIR): MahjongTile {
        if (Wzhcq_dir == DIR.LEFT) {
            let Wzhcq_currentPos = Wzhcq_mahjong.GetMahjongData().GetPos();
            let Wzhcq_start: number = Wzhcq_currentPos.x;
            for (let i = Wzhcq_start - 1; i >= 0; i--) {
                let Wzhcq_pos: MahjongPos = { x: i, y: Wzhcq_currentPos.y };
                let Wzhcq_targetMahjong = this.Owner.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
                if (Wzhcq_targetMahjong) {
                    return Wzhcq_targetMahjong;
                }
                else {
                    continue;
                }
            }
            return null;
        }
        else if (Wzhcq_dir == DIR.RIGHT) {
            let Wzhcq_currentPos = Wzhcq_mahjong.GetMahjongData().GetPos();
            let Wzhcq_start: number = Wzhcq_currentPos.x;
            for (let i = Wzhcq_start + 1; i <= this.Owner.Wzhcq_Col - 1; i++) {
                let Wzhcq_pos: MahjongPos = { x: i, y: Wzhcq_currentPos.y };
                let Wzhcq_targetMahjong = this.Owner.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
                if (Wzhcq_targetMahjong) {
                    return Wzhcq_targetMahjong;
                }
                else {
                    continue;
                }
            }
            return null;
        }
        else if (Wzhcq_dir == DIR.UP) {
            let Wzhcq_currentPos = Wzhcq_mahjong.GetMahjongData().GetPos();
            let Wzhcq_start: number = Wzhcq_currentPos.y;
            for (let i = Wzhcq_start - 1; i >= 0; i--) {
                let Wzhcq_pos: MahjongPos = { x: Wzhcq_currentPos.x, y: i };
                let Wzhcq_targetMahjong = this.Owner.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
                if (Wzhcq_targetMahjong) {
                    return Wzhcq_targetMahjong;
                }
                else {
                    continue;
                }
            }
            return null;
        }
        else if (Wzhcq_dir == DIR.DOWN) {
            let Wzhcq_currentPos = Wzhcq_mahjong.GetMahjongData().GetPos();
            let Wzhcq_start: number = Wzhcq_currentPos.y;
            for (let i = Wzhcq_start + 1; i <= this.Owner.Wzhcq_Row - 1; i++) {
                let Wzhcq_pos: MahjongPos = { x: Wzhcq_currentPos.x, y: i };
                let Wzhcq_targetMahjong = this.Owner.CheckHasMahjong(JSON.stringify(Wzhcq_pos));
                if (Wzhcq_targetMahjong) {
                    return Wzhcq_targetMahjong;
                }
                else {
                    continue;
                }
            }
            return null;
        }
    }

    private SortMoveGroup(Wzhcq_group: any, Wzhcq_dir: any) {
        let Wzhcq_lst: MahjongTile[] = [];
        for (let k in Wzhcq_group) {
            let element = Wzhcq_group[k];
            Wzhcq_lst.push(element);
        }
        if (Wzhcq_dir == DIR.LEFT) {
            Wzhcq_lst.sort((a, b) => {
                return a.GetMahjongData().GetPos().x - b.GetMahjongData().GetPos().x;
            });
        }
        else if (Wzhcq_dir == DIR.RIGHT) {
            Wzhcq_lst.sort((a, b) => {
                return b.GetMahjongData().GetPos().x - a.GetMahjongData().GetPos().x;
            });
        }
        else if (Wzhcq_dir == DIR.UP) {
            Wzhcq_lst.sort((a, b) => {
                return a.GetMahjongData().GetPos().y - b.GetMahjongData().GetPos().y;
            });
        }
        else if (Wzhcq_dir == DIR.DOWN) {
            Wzhcq_lst.sort((a, b) => {
                return b.GetMahjongData().GetPos().y - a.GetMahjongData().GetPos().y;
            });
        }

        return Wzhcq_lst;
    }

    public SetMoveGroup(Wzhcq_moveGroup: any, Wzhcq_dir: DIR): void {
        if (Object.keys(Wzhcq_moveGroup).length > 0) {
            this.MoveGroup = Wzhcq_moveGroup;
            let Wzhcq_first = this.FindFirstElementInMoveGroup(Wzhcq_dir);
            let Wzhcq_block = this.GetFirstBlock(Wzhcq_first, Wzhcq_dir);
            let Wzhcq_lst = this.SortMoveGroup(this.MoveGroup, Wzhcq_dir);
            for (let i = 0; i < Wzhcq_lst.length; i++) {
                let Wzhcq_element = Wzhcq_lst[i];
                if (Wzhcq_dir == DIR.LEFT) {
                    let Wzhcq_start = Wzhcq_block ? Wzhcq_block.GetMahjongData().GetPos().x : 0;
                    let Wzhcq_dis = Wzhcq_element.GetMahjongData().GetPos().x - Wzhcq_start;
                    if (!Wzhcq_block) {
                        Wzhcq_dis += 1;
                    }
                    // element.moveMinX = element.node.x - dis * first.node.width + first.node.width + first.node.width * i;
                    Wzhcq_element.moveMinX = Wzhcq_element.node.x - Wzhcq_dis * this.getSize().width + this.getSize().width + this.getSize().width * i;

                    Wzhcq_element.moveMaxX = Wzhcq_element.node.x;
                }
                else if (Wzhcq_dir == DIR.RIGHT) {
                    let Wzhcq_start = Wzhcq_block ? Wzhcq_block.GetMahjongData().GetPos().x : this.Owner.Wzhcq_Col + 1;
                    let Wzhcq_dis = Wzhcq_start - Wzhcq_element.GetMahjongData().GetPos().x;
                    if (!Wzhcq_block) {
                        Wzhcq_dis -= 1;
                    }
                    // element.moveMaxX = element.node.x + dis * first.node.width - first.node.width - first.node.width * i;
                    Wzhcq_element.moveMaxX = Wzhcq_element.node.x + Wzhcq_dis * this.getSize().width - this.getSize().width - this.getSize().width * i;

                    Wzhcq_element.moveMinX = Wzhcq_element.node.x;
                }
                else if (Wzhcq_dir == DIR.UP) {
                    let Wzhcq_start = Wzhcq_block ? Wzhcq_block.GetMahjongData().GetPos().y : 0;
                    let Wzhcq_dis = Wzhcq_element.GetMahjongData().GetPos().y - Wzhcq_start;
                    if (!Wzhcq_block) {
                        Wzhcq_dis += 1;
                    }
                    // element.moveMaxY = element.node.y + dis * first.node.height - first.node.height - first.node.height * i;
                    Wzhcq_element.moveMaxY = Wzhcq_element.node.y + Wzhcq_dis * this.getSize().height - this.getSize().height - this.getSize().height * i;

                    Wzhcq_element.moveMinY = Wzhcq_element.node.y;
                }
                else if (Wzhcq_dir == DIR.DOWN) {
                    let Wzhcq_start = Wzhcq_block ? Wzhcq_block.GetMahjongData().GetPos().y : this.Owner.Wzhcq_Row - 1;
                    let Wzhcq_dis = Wzhcq_start - Wzhcq_element.GetMahjongData().GetPos().y;
                    if (!Wzhcq_block) {
                        Wzhcq_dis += 1;
                    }
                    // element.moveMinY = element.node.y - dis * first.node.height + first.node.height + first.node.height * i;
                    Wzhcq_element.moveMinY = Wzhcq_element.node.y - Wzhcq_dis * this.getSize().height + this.getSize().height + this.getSize().height * i;

                    Wzhcq_element.moveMaxY = Wzhcq_element.node.y;
                }
            }
            this.StartMove = true;
        }
        this.MoveDir = Wzhcq_dir;
    }

    private FindFirstElementInMoveGroup(Wzhcq_dir: DIR) {
        let Wzhcq_value = Infinity;
        let Wzhcq_element: any;
        let Wzhcq_group: any;
        if (Wzhcq_dir == DIR.LEFT) {
            Wzhcq_group = this.MoveLefGroup;
            for (let k in Wzhcq_group) {
                let Wzhcq_mahjong = Wzhcq_group[k];
                let Wzhcq_pos = JSON.parse(Wzhcq_mahjong.GetPosKey());
                if (Wzhcq_pos.x < Wzhcq_value) {
                    Wzhcq_value = Wzhcq_pos.x;
                    Wzhcq_element = Wzhcq_mahjong;
                }
            }
            return Wzhcq_element;
        }
        else if (Wzhcq_dir == DIR.RIGHT) {
            Wzhcq_value = -Infinity;
            Wzhcq_group = this.MoveRightGroup;
            for (let k in Wzhcq_group) {
                let Wzhcq_mahjong = Wzhcq_group[k];
                let Wzhcq_pos = JSON.parse(Wzhcq_mahjong.GetPosKey());
                if (Wzhcq_pos.x > Wzhcq_value) {
                    Wzhcq_value = Wzhcq_pos.x;
                    Wzhcq_element = Wzhcq_mahjong;
                }
            }
            return Wzhcq_element;
        }
        else if (Wzhcq_dir == DIR.UP) {
            Wzhcq_group = this.MoveUpGroup;
            for (let k in Wzhcq_group) {
                let Wzhcq_mahjong = Wzhcq_group[k];
                let Wzhcq_pos = JSON.parse(Wzhcq_mahjong.GetPosKey());
                if (Wzhcq_pos.y < Wzhcq_value) {
                    Wzhcq_value = Wzhcq_pos.y;
                    Wzhcq_element = Wzhcq_mahjong;
                }
            }
            return Wzhcq_element;
        }
        else if (Wzhcq_dir == DIR.DOWN) {
            Wzhcq_group = this.MoveDownGroup;
            Wzhcq_value = -Infinity;
            for (let k in Wzhcq_group) {
                let Wzhcq_mahjong = Wzhcq_group[k];
                let Wzhcq_pos = JSON.parse(Wzhcq_mahjong.GetPosKey());
                if (Wzhcq_pos.y > Wzhcq_value) {
                    Wzhcq_value = Wzhcq_pos.y;
                    Wzhcq_element = Wzhcq_mahjong;
                }
            }
            return Wzhcq_element;
        }
    }

    private speed = 1.0;
    protected OnTouchMove(Wzhcq_event: any) {
        if (this.Owner.mahjongTouchState) {
            let Wzhcq_touch: cc.Touch = Wzhcq_event.touch;
            let Wzhcq_delta = Wzhcq_touch.getDelta();
            this.touchMove_delta = Wzhcq_delta;

            let Wzhcq_count = 0;
            if (this.StartMove) {
                for (let k in this.MoveGroup) {
                    let Wzhcq_element = this.MoveGroup[k];
                    let Wzhcq_gridinfo = this.Owner.GetInPosGrid(Wzhcq_element.node.position);
                    Wzhcq_gridinfo.grid.opacity = 0;
                    let Wzhcq_arrive = false;

                    if (this.MoveDir === DIR.UP) {
                        // count = (element.moveMaxY - element.moveMinY) / element.node.height + 1;
                        Wzhcq_count = (Wzhcq_element.moveMaxY - Wzhcq_element.moveMinY) / this.getSize().height + 1;

                        Wzhcq_element.node.y += Wzhcq_delta.y * this.speed;
                        if (Wzhcq_element.node.y < Wzhcq_element.moveMinY) {
                            Wzhcq_element.node.y = Wzhcq_element.moveMinY;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                        if (Wzhcq_element.node.y > Wzhcq_element.moveMaxY) {
                            Wzhcq_element.node.y = Wzhcq_element.moveMaxY;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                    }
                    else if (this.MoveDir == DIR.DOWN) {
                        // count = (element.moveMaxY - element.moveMinY) / element.node.height + 1;
                        Wzhcq_count = (Wzhcq_element.moveMaxY - Wzhcq_element.moveMinY) / this.getSize().height + 1;

                        Wzhcq_element.node.y += Wzhcq_delta.y * this.speed;
                        if (Wzhcq_element.node.y < Wzhcq_element.moveMinY) {
                            Wzhcq_element.node.y = Wzhcq_element.moveMinY;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                        if (Wzhcq_element.node.y > Wzhcq_element.moveMaxY) {
                            Wzhcq_element.node.y = Wzhcq_element.moveMaxY;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                    }
                    else if (this.MoveDir === DIR.LEFT) {
                        // count = (element.moveMaxX - element.moveMinX) / element.node.width + 1;
                        Wzhcq_count = (Wzhcq_element.moveMaxX - Wzhcq_element.moveMinX) / this.getSize().width + 1;

                        Wzhcq_element.node.x += Wzhcq_delta.x * this.speed;
                        if (Wzhcq_element.node.x < Wzhcq_element.moveMinX) {
                            Wzhcq_element.node.x = Wzhcq_element.moveMinX;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                        if (Wzhcq_element.node.x > Wzhcq_element.moveMaxX) {
                            Wzhcq_element.node.x = Wzhcq_element.moveMaxX;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                    }
                    else if (this.MoveDir === DIR.RIGHT) {
                        // count = (element.moveMaxX - element.moveMinX) / element.node.width + 1;
                        Wzhcq_count = (Wzhcq_element.moveMaxX - Wzhcq_element.moveMinX) / this.getSize().width + 1;

                        Wzhcq_element.node.x += Wzhcq_delta.x * this.speed;
                        if (Wzhcq_element.node.x < Wzhcq_element.moveMinX) {
                            Wzhcq_element.node.x = Wzhcq_element.moveMinX;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                        if (Wzhcq_element.node.x > Wzhcq_element.moveMaxX) {
                            Wzhcq_element.node.x = Wzhcq_element.moveMaxX;
                            Wzhcq_arrive = true;
                        }
                        else {
                            Wzhcq_arrive = false;
                        }
                    }
                    if (Wzhcq_element.LastGrid.key != Wzhcq_gridinfo.key) {

                        let Wzhcq_last = JSON.parse(Wzhcq_element.LastGrid.key);
                        let Wzhcq_now = JSON.parse(Wzhcq_gridinfo.key);
                        let Wzhcq_disx = Math.abs(Wzhcq_last.x - Wzhcq_now.x);
                        let Wzhcq_disy = Math.abs(Wzhcq_last.y - Wzhcq_now.y);
                        let Wzhcq_hasMatch: any;
                        if (Wzhcq_element == this && Wzhcq_arrive == false) {
                            if ((Wzhcq_disx == 1 || Wzhcq_disy == 1) && !(Wzhcq_now.x == JSON.parse(this.LocalKey).x && Wzhcq_now.y == JSON.parse(this.LocalKey).y)) {
                                AudioManager.instance.playAudioTouchMove();
                            }
                            if (this.MoveDir == DIR.UP) {
                                Wzhcq_hasMatch = this.CheckVecHasCanRemoveMahjong(Wzhcq_element, Wzhcq_now);
                            }
                            else if (this.MoveDir == DIR.DOWN) {
                                Wzhcq_hasMatch = this.CheckVecHasCanRemoveMahjong(Wzhcq_element, Wzhcq_now);
                            }
                            else if (this.MoveDir == DIR.LEFT) {
                                Wzhcq_hasMatch = this.CheckHorHasCanRemoveMahjong(Wzhcq_element, Wzhcq_now);
                            }
                            else if (this.MoveDir == DIR.RIGHT) {
                                Wzhcq_hasMatch = this.CheckHorHasCanRemoveMahjong(Wzhcq_element, Wzhcq_now);
                            }
                            if (Wzhcq_hasMatch) {
                                this.Owner.SetMoveMahjongHasTarget(Wzhcq_element, Wzhcq_hasMatch);
                            }
                            else {
                                this.Owner.updateMove(Wzhcq_gridinfo);
                                this.Owner.ClearMoveMahjongAndTarget();
                            }
                        }
                        Wzhcq_element.LastGrid.grid.opacity = 255;
                        Wzhcq_element.LastGrid = Wzhcq_gridinfo;
                        this.Owner.updateMove(Wzhcq_gridinfo);
                    }
                    Wzhcq_element.node.zIndex = 100;
                }
            }
            else {

                let Wzhcq_offY = Math.abs(this.touchMove_delta.y - this.touchStart_delta.y);
                let Wzhcq_offX = Math.abs(this.touchMove_delta.x - this.touchStart_delta.x);
                if (Wzhcq_offX >= Wzhcq_offY) {
                    if (this.touchMove_delta.x > this.touchStart_delta.x) {
                        // console.log("向右滑动: " + this.touchMove_delta + "   " + this.touchStart_delta);
                        this.SetMoveGroup(this.MoveRightGroup, DIR.RIGHT);
                    }
                    else if (this.touchMove_delta.x < this.touchStart_delta.x) {
                        // console.log("向左滑动: " + this.touchMove_delta + "   " + this.touchStart_delta);
                        this.SetMoveGroup(this.MoveLefGroup, DIR.LEFT);
                    }
                }
                else {
                    if (this.touchMove_delta.y > this.touchStart_delta.y) {
                        // console.log("向上滑动: " + this.touchMove_delta + "   " + this.touchStart_delta);
                        this.SetMoveGroup(this.MoveUpGroup, DIR.UP);
                    }
                    else if (this.touchMove_delta.y < this.touchStart_delta.y) {
                        // console.log("向下滑动: " + this.touchMove_delta + "   " + this.touchStart_delta);
                        this.SetMoveGroup(this.MoveDownGroup, DIR.DOWN);
                    }
                }
            }
        }
    }

    public ShowTipCanRemove(element, target) {
        // console.log('element', element);
        // console.log('target', target);
    }

    public CheckHorHasCanRemoveMahjong(Wzhcq_mahjong: any, Wzhcq_pos: any) {
        let Wzhcq_matchUp = this.Owner.Wzhcq_CheckUpHasMathMajong(Wzhcq_mahjong, Wzhcq_pos);
        let Wzhcq_matchDown = this.Owner.Wzhcq_CheckDownHasMathMajong(Wzhcq_mahjong, Wzhcq_pos);
        return Wzhcq_matchUp || Wzhcq_matchDown;
    }

    public CheckVecHasCanRemoveMahjong(mahjong, pos) {
        let matchRight = this.Owner.Wzhcq_CheckRightHasMathMajong(mahjong, pos);
        let matchLeft = this.Owner.Wzhcq_CheckLeftHasMathMajong(mahjong, pos);
        return matchLeft || matchRight;
    }

    public UpdateView(): void {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.2));
        let isFeng: boolean = this.MahjongData.GetIsFeng();
        let isFeng2: boolean = this.MahjongData.GetIsFeng2();

        let frame: any;
        // if (isFeng2) {
        //     let path = isFeng ? this.MahjongData.Num + this.FRAMME_NAMES[this.MahjongData.Suit] : this.FRAMME_NAMES[this.MahjongData.Suit];
        //     frame = this.mahjongAtlas.getSpriteFrame(path);
        // }
        // else {
        //     let path = this.FRAMME_NAMES[this.MahjongData.Suit];
        //     frame = this.mahjongAtlas.getSpriteFrame(path);
        // }

        let path = this.MahjongData.Id + "";
        frame = this.mahjongAtlas.getSpriteFrame(path);

        this.MahjongSprite.spriteFrame = frame;
        this.LastGrid = this.Owner.GetInPosGrid(this.node.position);
    }

    public CheckIsMatch(target): MahjongTile {
        if (this.MahjongData.Suit === target.MahjongData.Suit && this.MahjongData.Num === target.MahjongData.Num) {
            return target;
        } else {
            return null;
        }
    }

    public GetPosKey(): string {
        return JSON.stringify(this.MahjongData.GetPos());
    }

    public Remove() {
        let self = this;
        // this.TipNode.active = true;
        // cc.tween(this.TipNode)
        //     .blink(0.3, 2)
        //     .delay(0.5)
        //     .call(() => {

        //     })
        //     .start();
        let scaleFront: any;
        let scaleBack: any;

        if (Utils.getInstance.GameType == 4) {
            scaleFront = cc.scaleTo(0.1, 0, Utils.getInstance.levelData[Utils.getInstance.Level].scale);
        }
        else if (Utils.getInstance.GameType == 1 ||
            Utils.getInstance.GameType == 2 ||
            Utils.getInstance.GameType == 3 ||
            Utils.getInstance.GameType == 5) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                scaleFront = cc.scaleTo(0.1, 0, 0.9);
            }
            else {
                scaleFront = cc.scaleTo(0.1, 0, Utils.getInstance.levelData[Utils.getInstance.Level].scale);
            }

        }
        else if (Utils.getInstance.GameType == 6) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                scaleFront = cc.scaleTo(0.1, 0, 0.9);
            }
            else {
                scaleFront = cc.scaleTo(0.1, 0, Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale);
            }
        }
        else if (Utils.getInstance.GameType == 7) {
            scaleFront = cc.scaleTo(0.1, 0, cfg[Utils.getInstance.StoreyIndex].scale);
        }

        this.Owner.Wzhcq_GridList[this.GetPosKey()].scaleX = 0;
        if (Utils.getInstance.GameType == 4) {
            scaleBack = cc.scaleTo(0.1, Utils.getInstance.levelData[Utils.getInstance.Level].scale, Utils.getInstance.levelData[Utils.getInstance.Level].scale);
        }
        else if (Utils.getInstance.GameType == 1 ||
            Utils.getInstance.GameType == 2 ||
            Utils.getInstance.GameType == 3 ||
            Utils.getInstance.GameType == 5 ) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                scaleBack = cc.scaleTo(0.1, 0.9, 0.9);
            }
            else {
                scaleBack = cc.scaleTo(0.1, Utils.getInstance.levelData[Utils.getInstance.Level].scale, Utils.getInstance.levelData[Utils.getInstance.Level].scale);
            }

        }
        else if (Utils.getInstance.GameType == 6) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                scaleBack = cc.scaleTo(0.1, 0.9, 0.9);
            }
            else {
                scaleBack = cc.scaleTo(0.1, Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale, Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale);
            }
        }
        else if (Utils.getInstance.GameType == 7) {
            scaleBack = cc.scaleTo(0.1, cfg[Utils.getInstance.StoreyIndex].scale, cfg[Utils.getInstance.StoreyIndex].scale);
        }

        let seq = cc.sequence(
            scaleFront,
            cc.callFunc(() => {
                self.Owner.Wzhcq_GridList[self.GetPosKey()].runAction(scaleBack);
                self.Owner.clearColor();
            }),
            cc.removeSelf()
        );
        this.node.runAction(seq);
    }

    public blink() {
        this.TipNode.active = true;
        this.TipNode.opacity = 97;
        cc.tween(this.TipNode).blink(0.3, 2).delay(0.5).start();
    }

    getSize() {
        if (Utils.getInstance.GameType == 4) {
            return { width: 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale, height: 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale };
        }
        else if (Utils.getInstance.GameType == 1 ||
            Utils.getInstance.GameType == 2 ||
            Utils.getInstance.GameType == 3 ||
            Utils.getInstance.GameType == 5) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.levelData[Utils.getInstance.Level].row > 10) {
                return { width: 70 * 0.9, height: 86 * 0.9 };
            }
            else {
                return { width: 70 * Utils.getInstance.levelData[Utils.getInstance.Level].scale, height: 86 * Utils.getInstance.levelData[Utils.getInstance.Level].scale };
            }

        }
        else if (Utils.getInstance.GameType == 6) {
            if (Utils.getInstance.pixelRatioHeight <= 800 && Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].row > 10) {
                return { width: 70 * 0.9, height: 86 * 0.9 };
            }
            else {
                return { width: 70 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale, height: 86 * Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].scale };
            }
        }
        else if (Utils.getInstance.GameType == 7) {
            if (Utils.getInstance.StoreyIndex == 0) {
                return { width: 91.875, height: 112.875 };
            }
            else if (Utils.getInstance.StoreyIndex == 1) {
                return { width: 78.75, height: 96.75 };
            }
            else if (Utils.getInstance.StoreyIndex == 2) {
                return { width: 70, height: 86 };
            }
        }
    }
}
