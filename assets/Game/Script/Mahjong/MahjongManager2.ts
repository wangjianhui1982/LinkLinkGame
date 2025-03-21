/*
 * @Author: PanYu gordon_pp@163.com
 * @Date: 2023-07-13 18:11:01
 * @LastEditors: PanYu gordon_pp@163.com
 * @LastEditTime: 2023-07-27 11:45:46
 * @FilePath: \Nuoduidui\assets\Script\Mahjong\MahjongManager .ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import MahjongTileData, { MahjongPos, SUIT } from './MahjongTileData';

const { ccclass, property } = cc._decorator;

export default class MahjongManager2 {
    private Tiles: MahjongTileData[];
    TilesObj: any;

    difficulty: any;
    public constructor(difficulty: number) {
        this.TilesObj = {};
        this.Tiles = []; // 存储麻将牌的数组
        this.InitializeTiles(difficulty);
        //console.log('Tiles = ', this.Tiles);
    }

    // 初始化麻将牌
    protected InitializeTiles(difficulty: number): void {
        this.difficulty = difficulty;

        let specialSuitCount = [
            [
                { suit: SUIT.Dong, count: 1 },
                { suit: SUIT.Nan, count: 1 },
                { suit: SUIT.Xi, count: 1 },
                { suit: SUIT.Bei, count: 1 },

                { suit: SUIT.Chun, count: 1 },
                { suit: SUIT.Xia, count: 1 },
                { suit: SUIT.Qiu, count: 1 },
                { suit: SUIT.Dong2, count: 1 },

                { suit: SUIT.Jv, count: 1 },
                { suit: SUIT.Lan, count: 1 },
                { suit: SUIT.Mei, count: 1 },
                { suit: SUIT.Zhu, count: 1 },
            ],
            [
                { suit: SUIT.TONG, count: 9 },
                { suit: SUIT.TIAO, count: 9 },
                { suit: SUIT.ZHONG, count: 1 },
                { suit: SUIT.FA, count: 1 },
            ],
            [
                { suit: SUIT.TONG, count: 9 },
                { suit: SUIT.WAN, count: 9 },
                { suit: SUIT.TIAO, count: 9 },
                { suit: SUIT.ZHONG, count: 1 },
                { suit: SUIT.FA, count: 1 },
                { suit: SUIT.BAI, count: 1 },
                { suit: SUIT.Dong, count: 1 },
                { suit: SUIT.Nan, count: 1 },
                { suit: SUIT.Xi, count: 1 },
                { suit: SUIT.Bei, count: 1 },

                { suit: SUIT.Chun, count: 1 },
                { suit: SUIT.Xia, count: 1 },
                { suit: SUIT.Qiu, count: 1 },
                { suit: SUIT.Dong2, count: 1 },

                { suit: SUIT.Jv, count: 1 },
                { suit: SUIT.Lan, count: 1 },
                { suit: SUIT.Mei, count: 1 },
                { suit: SUIT.Zhu, count: 1 },
            ],


        ];

        let suitCounts;

        if (difficulty === 6) {
            for (let index = 0; index < specialSuitCount.length; index++) {
                let array = [];

                suitCounts = this.ShuffleInitArray(specialSuitCount[index]);
                if (index == 0 || index == 1) {
                    // 添加麻将牌到this.tiles数组中
                    suitCounts.forEach(suitCount => {
                        for (let i = 1; i <= suitCount.count; i++) {
                            for (let j = 0; j < 4; j++) {
                                let mahjongTile = new MahjongTileData(suitCount.suit, i);
                                array.push(mahjongTile);
                            }
                        }
                    });
                }
                else {
                    // 添加麻将牌到this.tiles数组中
                    suitCounts.forEach(suitCount => {
                        for (let i = 1; i <= suitCount.count; i++) {
                            if (suitCount.suit == SUIT.TONG || suitCount.suit == SUIT.TIAO) {
                                for (let j = 0; j < 4; j++) {
                                    let mahjongTile = new MahjongTileData(suitCount.suit, i);
                                    array.push(mahjongTile);
                                }
                            }
                            else {
                                for (let j = 0; j < 2; j++) {
                                    let mahjongTile = new MahjongTileData(suitCount.suit, i);
                                    array.push(mahjongTile);
                                }
                            }
                        }
                    });
                }

                this.TilesObj[index] = array;
            }
        }
    }

    public updateTiles(difficulty, data) {
        this.Tiles = []; // 存储麻将牌的数组
        this.difficulty = difficulty;
        for (let index in data) {
            let temp_array = [];
            let obj = data[index];
            for (let key in obj) {
                const suitCount = obj[key];
                let mahjongTile = new MahjongTileData(suitCount.Suit, suitCount.Num);
                mahjongTile.SetPos(suitCount.Pos);

                temp_array.push(mahjongTile);
            }

            this.TilesObj[index] = temp_array;
        }
    }

    public getTiles() {
        return this.TilesObj;
    }

    public GetPairsFromTiles(numberOfPairsToRetrieve: number, minimumPairsToPreserve: number, index: any): MahjongTileData[] {
        const pairs: MahjongTileData[][] = [];
        this.Tiles = this.TilesObj[index];
        const tilesCopy = [...this.Tiles]; // 创建原始数组的拷贝，以免修改原始数组

        while (pairs.length < numberOfPairsToRetrieve && tilesCopy.length >= 2) {
            const tile1 = tilesCopy.pop();
            const tile2 = tilesCopy.pop();

            if (tile1 && tile2) {
                const pair: MahjongTileData[] = [tile1, tile2];
                pairs.push(pair); // 将取出的牌对添加到 pairs 数组中
            }
        }

        const mergedArray: MahjongTileData[] = [].concat(...pairs); // 合并成一维数组

        while (mergedArray.length < numberOfPairsToRetrieve * 2 && tilesCopy.length > 0) {
            mergedArray.push(tilesCopy.pop()!); // 添加剩余的牌直到达到所需数量
        }

        if (this.difficulty == 1) {
            return mergedArray;
        } else {
            return this.ShuffleArray(mergedArray, minimumPairsToPreserve);
        }
    }

    public ShuffleArray(array: any[], minimumPairsToPreserve: number): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        let indexes = this.getRandomIndexes(array.length, minimumPairsToPreserve);

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

    public getRandomIndexes(length, count) {
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
