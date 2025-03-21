/*
 * @Author: PanYu gordon_pp@163.com
 * @Date: 2023-07-13 18:11:01
 * @LastEditors: PanYu gordon_pp@163.com
 * @LastEditTime: 2023-07-27 11:45:46
 * @FilePath: \Nuoduidui\assets\Script\Mahjong\MahjongManager .ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Utils } from '../Utils';
import MahjongTileData, { MahjongPos, SUIT } from './MahjongTileData';

const { ccclass, property } = cc._decorator;

export default class MahjongManager {
    private Tiles: MahjongTileData[];

    difficulty: any;
    public constructor(difficulty: number) {
        this.Tiles = []; // 存储麻将牌的数组
        this.InitializeTiles(difficulty);
        //console.log('Tiles = ', this.Tiles);
    }

    // 初始化麻将牌
    protected InitializeTiles(Wzhcq_difficulty: number): void {
        this.difficulty = Wzhcq_difficulty;

        let Wzhcq_suitCounts: any;
        if (Wzhcq_difficulty === 1) {
            let array = [];
            let cardData = Utils.getInstance.levelData[Utils.getInstance.Level].cardData;
            for (let key in cardData) {
                let num = cardData[key];
                let group = Utils.getInstance.cardGroup[key].group;
                let type = Utils.getInstance.cardGroup[key].type;
                let cardIdArray = group.split("_");
                for (let i = 0; i < num; i++) {
                    for (let j = 0; j < cardIdArray.length; j++) {
                        let cardId = cardIdArray[j];
                        let obj = {
                            cardId: cardId,
                            type: type
                        };
                        array.push(obj);
                    }
                }
            }

            for (let Wzhcq_index = array.length - 1; Wzhcq_index >= 0; Wzhcq_index--) {
                const Wzhcq_data = array[Wzhcq_index];
                let Wzhcq_mahjongTile = new MahjongTileData(Wzhcq_data.cardId, Wzhcq_data.type);
                this.Tiles.push(Wzhcq_mahjongTile);
            }
        }
        else {
            if (Wzhcq_difficulty === 2 || Wzhcq_difficulty === 3 || Wzhcq_difficulty === 4) {
                if (Wzhcq_difficulty === 2) {

                    let array = [];
                    let cardData = Utils.getInstance.levelData[Utils.getInstance.Level].cardData;
                    for (let key in cardData) {
                        let num = cardData[key];
                        let group = Utils.getInstance.cardGroup[key].group;
                        let type = Utils.getInstance.cardGroup[key].type;
                        let cardIdArray = group.split("_");
                        for (let i = 0; i < num; i++) {
                            for (let j = 0; j < cardIdArray.length; j++) {
                                let cardId = cardIdArray[j];
                                let obj = {
                                    cardId: cardId,
                                    type: type
                                };
                                array.push(obj);
                            }
                        }
                    }
                    Wzhcq_suitCounts = this.ShuffleInitArray(array);

                    // 添加麻将牌到this.tiles数组中
                    Wzhcq_suitCounts.forEach((obj: any) => {
                        let Wzhcq_mahjongTile = new MahjongTileData(obj.cardId, obj.type);
                        this.Tiles.push(Wzhcq_mahjongTile);
                    });
                }
                else if (Wzhcq_difficulty === 3) {
                    let array = [];
                    let cardData = Utils.getInstance.levelData[Utils.getInstance.Level].cardData;
                    for (let key in cardData) {
                        let num = cardData[key];
                        let group = Utils.getInstance.cardGroup[key].group;
                        let type = Utils.getInstance.cardGroup[key].type;
                        let cardIdArray = group.split("_");
                        for (let i = 0; i < num; i++) {
                            for (let j = 0; j < cardIdArray.length; j++) {
                                let cardId = cardIdArray[j];
                                let obj = {
                                    cardId: cardId,
                                    type: type
                                };
                                array.push(obj);
                            }
                        }
                    }
                    Wzhcq_suitCounts = this.ShuffleInitArray(array);

                    // 添加麻将牌到this.tiles数组中
                    Wzhcq_suitCounts.forEach((obj: any) => {
                        let Wzhcq_mahjongTile = new MahjongTileData(obj.cardId, obj.type);
                        this.Tiles.push(Wzhcq_mahjongTile);
                    });
                }
                else if (Wzhcq_difficulty === 4) {
                    let array = [];
                    let cardData = Utils.getInstance.levelData[Utils.getInstance.Level].cardData;
                    for (let key in cardData) {
                        let num = cardData[key];
                        let group = Utils.getInstance.cardGroup[key].group;
                        let type = Utils.getInstance.cardGroup[key].type;
                        let cardIdArray = group.split("_");
                        for (let i = 0; i < num; i++) {
                            for (let j = 0; j < cardIdArray.length; j++) {
                                let cardId = cardIdArray[j];
                                let obj = {
                                    cardId: cardId,
                                    type: type
                                };
                                array.push(obj);
                            }
                        }
                    }
                    Wzhcq_suitCounts = this.ShuffleInitArray(array);

                    // 添加麻将牌到this.tiles数组中
                    Wzhcq_suitCounts.forEach((obj: any) => {
                        let Wzhcq_mahjongTile = new MahjongTileData(obj.cardId, obj.type);
                        this.Tiles.push(Wzhcq_mahjongTile);
                    });
                }
            }
            else if (Wzhcq_difficulty === 5) {
                let array = [];
                let cardData = Utils.getInstance.levelData[Utils.getInstance.Level].cardData;
                for (let key in cardData) {
                    let num = cardData[key];
                    let group = Utils.getInstance.cardGroup[key].group;
                    let type = Utils.getInstance.cardGroup[key].type;
                    let cardIdArray = group.split("_");
                    for (let i = 0; i < num; i++) {
                        for (let j = 0; j < cardIdArray.length; j++) {
                            let cardId = cardIdArray[j];
                            let obj = {
                                cardId: cardId,
                                type: type
                            };
                            array.push(obj);
                        }
                    }
                }

                Wzhcq_suitCounts = this.ShuffleInitArray(array);
                // 添加麻将牌到this.tiles数组中
                Wzhcq_suitCounts.forEach((obj: any) => {
                    let Wzhcq_mahjongTile = new MahjongTileData(obj.cardId, obj.type);
                    this.Tiles.push(Wzhcq_mahjongTile);
                });
            }

            else if (Wzhcq_difficulty === 6) {
                let array = [];
                let cardData = Utils.getInstance.meiritiaozhanData[Wzhcq_difficulty].cardData;
                for (let key in cardData) {
                    let num = cardData[key];
                    let group = Utils.getInstance.cardGroup[key].group;
                    let type = Utils.getInstance.cardGroup[key].type;
                    let cardIdArray = group.split("_");
                    for (let i = 0; i < num; i++) {
                        for (let j = 0; j < cardIdArray.length; j++) {
                            let cardId = cardIdArray[j];
                            let obj = {
                                cardId: cardId,
                                type: type
                            };
                            array.push(obj);
                        }
                    }
                }
                Wzhcq_suitCounts = this.ShuffleInitArray(array);

                // 添加麻将牌到this.tiles数组中
                Wzhcq_suitCounts.forEach((obj: any) => {
                    let Wzhcq_mahjongTile = new MahjongTileData(obj.cardId, obj.type);
                    this.Tiles.push(Wzhcq_mahjongTile);
                });
            }
        }
    }

    public initCardAnchor() {
        let Tiles = [];
        let array = [];
        let keyArray = [];
        let cardAnchor: any;

        if (Utils.getInstance.GameType == 6) {
            cardAnchor = Utils.getInstance.meiritiaozhanData[Utils.getInstance.GameType].cardAnchor;
        }
        else {
            cardAnchor = Utils.getInstance.levelData[Utils.getInstance.Level].cardAnchor;
        }

        // for (let i = cardAnchor.length - 1; i >= 0; i--) {
        //     let data = cardAnchor[i];
        //     let obj = {
        //         cardId: data.value,
        //         type: 1
        //     };
        //     array.push(obj);
        //     keyArray.push(data.Index);
        // }
        // for (let Wzhcq_index = array.length - 1; Wzhcq_index >= 0; Wzhcq_index--) {
        //     const Wzhcq_data = array[Wzhcq_index];
        //     let Wzhcq_mahjongTile = new MahjongTileData(Wzhcq_data.cardId, Wzhcq_data.type);
        //     Tiles.push(Wzhcq_mahjongTile);
        // }

        for (let i = 0; i < cardAnchor.length; i++) {
            let data = cardAnchor[i];
            let obj = {
                cardId: data.value,
                type: data.value == 50 ? 2 : 1
            };
            array.push(obj);
            keyArray.push(data.Index);
        }
        for (let Wzhcq_index = 0; Wzhcq_index < array.length; Wzhcq_index++) {
            const Wzhcq_data = array[Wzhcq_index];
            let Wzhcq_mahjongTile = new MahjongTileData(Wzhcq_data.cardId, Wzhcq_data.type);
            Tiles.push(Wzhcq_mahjongTile);
        }
        return { keyArray: keyArray, Tiles: Tiles };
    }

    public updateTiles(Wzhcq_difficulty: any, Wzhcq_data: any) {
        this.Tiles = []; // 存储麻将牌的数组
        this.difficulty = Wzhcq_difficulty;
        for (let key in Wzhcq_data) {
            const Wzhcq_suitCount = Wzhcq_data[key];
            let Wzhcq_mahjongTile = new MahjongTileData(Wzhcq_suitCount.Suit, Wzhcq_suitCount.Num);
            Wzhcq_mahjongTile.SetPos(Wzhcq_suitCount.Pos);
            this.Tiles.push(Wzhcq_mahjongTile);
        }
    }

    public getTiles() {
        return this.Tiles;
    }

    public GetPairsFromTiles(Wzhcq_numberOfPairsToRetrieve: number, Wzhcq_minimumPairsToPreserve: number): MahjongTileData[] {
        const pairs: MahjongTileData[][] = [];
        const Wzhcq_tilesCopy = [...this.Tiles]; // 创建原始数组的拷贝，以免修改原始数组

        while (pairs.length < Wzhcq_numberOfPairsToRetrieve && Wzhcq_tilesCopy.length >= 2) {
            const Wzhcq_tile1 = Wzhcq_tilesCopy.pop();
            const Wzhcq_tile2 = Wzhcq_tilesCopy.pop();

            if (Wzhcq_tile1 && Wzhcq_tile2) {
                const pair: MahjongTileData[] = [Wzhcq_tile1, Wzhcq_tile2];
                pairs.push(pair); // 将取出的牌对添加到 pairs 数组中
            }
        }

        const Wzhcq_mergedArray: MahjongTileData[] = [].concat(...pairs); // 合并成一维数组

        while (Wzhcq_mergedArray.length < Wzhcq_numberOfPairsToRetrieve * 2 && Wzhcq_tilesCopy.length > 0) {
            Wzhcq_mergedArray.push(Wzhcq_tilesCopy.pop()!); // 添加剩余的牌直到达到所需数量
        }

        if (this.difficulty == 1) {
            return Wzhcq_mergedArray;
        }
        else {
            return this.Wzhcq_ShuffleArray(Wzhcq_mergedArray, Wzhcq_minimumPairsToPreserve);
        }
    }

    public Wzhcq_ShuffleArray(array: any[], minimumPairsToPreserve: number): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        // let indexes = this.Wzhcq_getRandomIndexes(array.length, minimumPairsToPreserve);

        let indexes: any;
        if (Utils.getInstance.GameType == 6) {
            indexes = this.Wzhcq_getRandomIndexes(array.length, minimumPairsToPreserve);
        }
        else {
            indexes = this.Wzhcq_getRandomIndexes(array.length, minimumPairsToPreserve);
        }

        for (let i = 0; i < indexes.length; i++) {
            let res = this.getMahjong(array, indexes[i], array[indexes[i]]);
            let tmp = array[indexes[i] + 1];
            array[indexes[i] + 1] = res.data;
            array[res.index] = tmp;
        }

        // const pairsCount = Math.floor(array.length / 2);
        // let pairsPreserved = 0;

        // for (let i = 0; i < pairsCount; i++) {
        //     if (pairsPreserved >= minimumPairsToPreserve) {
        //         break;
        //     }

        //     if (array[i * 2] !== array[i * 2 + 1]) {
        //         [array[i * 2], array[i * 2 + 1]] = [array[i * 2 + 1], array[i * 2]];
        //         pairsPreserved++;
        //     }
        // }

        return array;
    }

    public getMahjong(array, index, data) {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.Num == data.Num && element.Suit == data.Suit && index != i) {
                return { data: element, index: i };
            }
        }
    }

    public Wzhcq_getRandomIndexes(length, count) {
        const indexes = [];
        const lastIndex = length - 1;

        while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * lastIndex);
            const isUnique = indexes.every(index => Math.abs(index - randomIndex) > 1 && index !== randomIndex);

            if (isUnique) {
                indexes.push(randomIndex);
            }
        }

        return indexes;
    }

    public ShuffleInitArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 洗牌
    public ShuffleTiles(): void {
        // 将this.tiles数组中的麻将牌顺序打乱
        // 具体的逻辑根据实际需求进行实现
    }

    // 发牌
    public DealTiles(): void {
        // 从this.tiles数组中抽取指定数量的麻将牌并返回
        // 具体的逻辑根据实际需求进行实现
    }
}
