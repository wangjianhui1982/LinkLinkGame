import AudioManager from "./AudioManager";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Achieve extends cc.Component {

    @property(cc.Node)
    Wzhcq_buttonList: cc.Node[] = [];

    @property(cc.SpriteFrame)
    Wzhcq_frameList: cc.SpriteFrame[] = [];

    @property(cc.Label)
    Wzhcq_score1: cc.Label = null;

    @property(cc.Label)
    Wzhcq_score2: cc.Label = null;

    @property(cc.Label)
    Wzhcq_score3: cc.Label = null;

    @property(cc.Label)
    Wzhcq_score4: cc.Label = null;

    @property(cc.Label)
    Wzhcq_score5: cc.Label = null;

    @property(cc.Label)
    Wzhcq_score6: cc.Label = null;

    @property(cc.Label)
    Wzhcq_score7: cc.Label = null;

    Wzhcq_highestIntegral: any;
    Wzhcq_shortestTime: any;
    Wzhcq_maximumEliminate: any;
    Wzhcq_highestScore: any;
    Wzhcq_victory: any;
    Wzhcq_allSession: any;
    Wzhcq_highestwinningStreak: any;

    protected onEnable(): void {
        this.updateButtonState(0);
        this.updateData(0);

        WxPlatform.getInstance.showBanner();

    }

    updateButtonState(Wzhcq_type: any) {
        for (let Wzhcq_index = 0; Wzhcq_index < this.Wzhcq_buttonList.length; Wzhcq_index++) {
            let Wzhcq_node = this.Wzhcq_buttonList[Wzhcq_index];
            if (Wzhcq_index == Wzhcq_type) {
                Wzhcq_node.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_frameList[0];
            }
            else {
                Wzhcq_node.getComponent(cc.Sprite).spriteFrame = this.Wzhcq_frameList[1];
            }
        }
    }

    updateData(Wzhcq_index: any) {
        //每日挑战
        if (6 == Wzhcq_index) {
            this.Wzhcq_highestIntegral = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestIntegral);
            this.Wzhcq_shortestTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_shortestTime);
            this.Wzhcq_maximumEliminate = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_maximumEliminate);
            this.Wzhcq_highestScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestScore);
            this.Wzhcq_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_victory);
            this.Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_allSession);
            this.Wzhcq_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_tiaozhan_highestwinningStreak);
        }
        else {
            //闯关模式 
            this.Wzhcq_highestIntegral = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestIntegral);
            this.Wzhcq_shortestTime = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_shortestTime);
            this.Wzhcq_maximumEliminate = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_maximumEliminate);
            this.Wzhcq_highestScore = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestScore);
            this.Wzhcq_victory = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_victory);
            this.Wzhcq_allSession = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_allSession);
            this.Wzhcq_highestwinningStreak = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_chuangguan_highestwinningStreak);
        }

        this.Wzhcq_score1.string = this.Wzhcq_allSession + "场";
        if (this.Wzhcq_allSession == 0) {
            this.Wzhcq_score2.string = 0 + "%";
        }
        else {
            this.Wzhcq_score2.string = Math.round((this.Wzhcq_victory / this.Wzhcq_allSession) * 100) + "%";
        }
        this.Wzhcq_score3.string = this.Wzhcq_highestScore;
        this.Wzhcq_score4.string = this.Wzhcq_maximumEliminate + "次";
        this.Wzhcq_score5.string = this.Wzhcq_highestIntegral;
        this.Wzhcq_score6.string = this.Wzhcq_shortestTime + "秒";
        this.Wzhcq_score7.string = this.Wzhcq_highestwinningStreak;
    }

    shareBtn() {
        AudioManager.instance.playAudioBtn_Click();

        let Wzhcq_str = "不成不就，这麻将怎么挪？快来帮我！";
        let Wzhcq_array = [Wzhcq_str];
        if (this.Wzhcq_allSession > 10) {
            Wzhcq_str = "我都玩了" + this.Wzhcq_allSession + "场，你们还不来？";
            Wzhcq_array.push(Wzhcq_str);
        }
        if (Math.round((this.Wzhcq_victory / this.Wzhcq_allSession) * 100) > 50) {
            Wzhcq_str = "打了" + this.Wzhcq_allSession + "场，胜率" + Math.round((this.Wzhcq_victory / this.Wzhcq_allSession) * 100) + "%，你们肯定比不过~~~";
            Wzhcq_array.push(Wzhcq_str);
        }
        if (this.Wzhcq_highestScore > 300) {
            Wzhcq_str = "今天又拿了" + this.Wzhcq_highestScore + "积分，你们有没有？";
            Wzhcq_array.push(Wzhcq_str);
        }
        if (this.Wzhcq_shortestTime < 150 && this.Wzhcq_shortestTime > 0) {
            Wzhcq_str = this.Wzhcq_shortestTime + "秒通关，谁能比我快~~~";
            Wzhcq_array.push(Wzhcq_str);
        }
        if (this.Wzhcq_maximumEliminate > 10) {
            Wzhcq_str = "连消" + this.Wzhcq_maximumEliminate + "次，爽到爆，一起来试试！！！";
            Wzhcq_array.push(Wzhcq_str);
        }
        if (this.Wzhcq_highestIntegral > 300000) {
            Wzhcq_str = "爆了" + this.Wzhcq_highestIntegral + "分，我自己都不敢相信！！！";
            Wzhcq_array.push(Wzhcq_str);
        }

        let Wzhcq_title = Wzhcq_array[Math.floor(Math.random() * Wzhcq_array.length)]
        Utils.getInstance.shareAppMessage(Wzhcq_title);
    }

    Wzhcq_tiaozhan_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        this.updateButtonState(1);
        this.updateData(6);
    }

    Wzhcq_chuanguan_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        this.updateButtonState(0);
        this.updateData(0);
    }

    Wzhcq_clickclose_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        WxPlatform.getInstance.hideBanner();

        this.node.active = false;
    }
}
