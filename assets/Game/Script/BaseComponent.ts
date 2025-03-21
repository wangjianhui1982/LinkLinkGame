import AStar from './AStar';
import EventMgr from './EventMgr';

/*
 * @Author: PanYu gordon_pp@163.com
 * @Date: 2023-07-15 06:39:11
 * @LastEditors: PanYu gordon_pp@163.com
 * @LastEditTime: 2023-07-17 14:46:33
 * @FilePath: /Nuduidui/assets/Game/Script/BaseComponent.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseComponent extends cc.Component {
    public readonly EventMgr = EventMgr.GetInstance();
    public readonly AStar = AStar.GetInstance();
}
