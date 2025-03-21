import { Utils } from "../Utils";

/*
 * @Author: PanYu gordon_pp@163.com
 * @Date: 2023-07-13 18:04:19
 * @LastEditors: PanYu gordon_pp@163.com
 * @LastEditTime: 2023-07-15 07:09:39
 * @FilePath: \Nuoduidui\assets\Game\Script\Mahjong\MahjongTile.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { ccclass, property } = cc._decorator;

export enum SUIT {
    TONG = 0,
    WAN = 1,
    TIAO = 2,
    ZHONG = 3,
    FA = 4,
    BAI = 5,
    Dong = 6,
    Nan = 7,
    Xi = 8,
    Bei = 9,
    Chun = 10,
    Xia = 11,
    Qiu = 12,
    Dong2 = 13,
    Jv = 14,
    Lan = 15,
    Mei = 16,
    Zhu = 17,
}

export interface MahjongPos {
    x: number;
    y: number;
}

export default class MahjongTileData {
    public Suit: number;

    public Num: number;

    public Id: number;

    public Type: number;

    public Desc: string;

    private Pos: MahjongPos;

    private MatchMahjong;

    public constructor(Id: number, Type: number) {

        let suit: any;
        let number: any;
        if (Id >= 1 && Id <= 9) {
            suit = 2;
            number = Number(Id);
        }
        else if (Id >= 11 && Id <= 19) {
            suit = 1;
            number = Number(Id % 10);
        }
        else if (Id >= 21 && Id <= 29) {
            suit = 0;
            number = Number(Id % 10);
        }
        else if (Id == 0) {
            suit = 3;
            number = 1;
        }
        else if (Id == 10) {
            suit = 4;
            number = 1;
        }
        else if (Id == 20) {
            suit = 5;
            number = 1;
        }
        else if (Id == 30) {
            suit = 6;
            number = 1;
        }
        else if (Id == 31) {
            suit = 7;
            number = 1;
        }
        else if (Id == 32) {
            suit = 8;
            number = 1;
        }
        else if (Id == 33) {
            suit = 9;
            number = 1;
        }
        else if (Id == 34) {
            suit = 10;
            number = 1;
        }
        else if (Id == 35) {
            suit = 11;
            number = 1;
        }
        else if (Id == 36) {
            suit = 12;
            number = 1;
        }
        else if (Id == 37) {
            suit = 13;
            number = 1;
        }
        else if (Id == 38) {
            suit = 16;
            number = 1;
        }
        else if (Id == 39) {
            suit = 15;
            number = 1;
        }
        else if (Id == 40) {
            suit = 17;
            number = 1;
        }
        else if (Id == 41) {
            suit = 14;
            number = 1;
        }

        this.Id = Id;
        this.Type = Type;
        this.Suit = suit; // 筒子、万子、条子和中发白等属性
        this.Num = number; // 几筒、几万、几条等属性
        this.Desc = Utils.getInstance.cardCfg[Id].nick;
        this.MatchMahjong = {};
    }

    public SetPos(pos: MahjongPos): void {
        this.Pos = pos;
    }

    public GetPos(): MahjongPos {
        return this.Pos;
    }

    public SetMatchMahjong(data): void {
        this.MatchMahjong = data;
    }

    public GetIsFeng(): boolean {
        return this.Suit != SUIT.BAI && this.Suit != SUIT.ZHONG && this.Suit != SUIT.FA;
    }

    public GetIsFeng2(): boolean {
        return this.Suit != SUIT.Dong && this.Suit != SUIT.Nan && this.Suit != SUIT.Xi && this.Suit != SUIT.Bei
            && this.Suit != SUIT.Chun && this.Suit != SUIT.Xia && this.Suit != SUIT.Qiu && this.Suit != SUIT.Dong2
            && this.Suit != SUIT.Jv && this.Suit != SUIT.Lan && this.Suit != SUIT.Mei && this.Suit != SUIT.Zhu;
    }
}
