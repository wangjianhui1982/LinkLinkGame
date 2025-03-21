
const { ccclass, property } = cc._decorator;

export interface Point {
    x: number;
    y: number;
}

export default class AStar {
    private static instance: AStar;

    public static GetInstance(): AStar {
        if (!AStar.instance) {
            AStar.instance = new AStar();
        }
        return AStar.instance;
    }

    public isReachable(Wzhcq_start: any, Wzhcq_end: any, Wzhcq_map: any): boolean {
        let Wzhcq_mapCopy = JSON.parse(JSON.stringify(Wzhcq_map));
        Wzhcq_mapCopy[Wzhcq_end.x][Wzhcq_end.y] = 0;
        const Wzhcq_numRows = Wzhcq_mapCopy.length;
        const Wzhcq_numCols = Wzhcq_mapCopy[0].length;

        const Wzhcq_queue: Point[] = [];
        const Wzhcq_visited: Set<string> = new Set();
        const Wzhcq_directions: Point[] = [
            { x: -1, y: 0 }, // 上
            { x: 1, y: 0 }, // 下
            { x: 0, y: -1 }, // 左
            { x: 0, y: 1 }, // 右
        ];

        Wzhcq_queue.push(Wzhcq_start);
        Wzhcq_visited.add(`${Wzhcq_start.x},${Wzhcq_start.y}`);

        while (Wzhcq_queue.length > 0) {
            const Wzhcq_currentPoint = Wzhcq_queue.shift()!;

            if (Wzhcq_currentPoint.x === Wzhcq_end.x && Wzhcq_currentPoint.y === Wzhcq_end.y) {
                return true;
            }

            for (const Wzhcq_direction of Wzhcq_directions) {
                const Wzhcq_newRow = Wzhcq_currentPoint.x + Wzhcq_direction.x;
                const Wzhcq_newCol = Wzhcq_currentPoint.y + Wzhcq_direction.y;

                if (Wzhcq_newRow >= 0 && Wzhcq_newRow < Wzhcq_numRows && Wzhcq_newCol >= 0 && Wzhcq_newCol < Wzhcq_numCols && !Wzhcq_visited.has(`${Wzhcq_newRow},${Wzhcq_newCol}`) && Wzhcq_mapCopy[Wzhcq_newRow][Wzhcq_newCol] === 0) {
                    Wzhcq_queue.push({ x: Wzhcq_newRow, y: Wzhcq_newCol });
                    Wzhcq_visited.add(`${Wzhcq_newRow},${Wzhcq_newCol}`);
                }
            }
        }

        return false;
    }
}
