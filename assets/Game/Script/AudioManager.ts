import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName, AudioName } from "./Enum";
import { Utils } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends BaseComponent {

    public static instance: AudioManager = null;

    //背景音乐
    @property(cc.AudioSource)
    public Wzhcq_AudioBG: cc.AudioSource = null;

    //点击
    @property(cc.AudioSource)
    public Wzhcq_AudioBtn_Click: cc.AudioSource = null;

    //移动
    @property(cc.AudioSource)
    public Wzhcq_AudioTouchMove: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioXiaoChu: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioWin: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioLose: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioXiaoPai: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioBaoZha: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioShanDian: cc.AudioSource = null;

    @property(cc.AudioSource)
    public Wzhcq_AudioReward: cc.AudioSource = null;

    @property(cc.AudioSource)
    public clear_bubbles1: cc.AudioSource = null;

    @property(cc.AudioSource)
    public clear_bubbles2: cc.AudioSource = null;

    @property(cc.AudioSource)
    public clear_bubbles3: cc.AudioSource = null;

    @property(cc.AudioSource)
    public clear_bubbles4: cc.AudioSource = null;

    @property(cc.AudioSource)
    public clear_bubbles5: cc.AudioSource = null;

    @property(cc.AudioSource)
    public clear_bubbles6: cc.AudioSource = null;

    @property(cc.AudioSource)
    public merge_1: cc.AudioSource = null;

    @property(cc.AudioSource)
    public merge_4: cc.AudioSource = null;

    @property(cc.AudioSource)
    public finished: cc.AudioSource = null;

    Wzhcq_bgCurrent_audio: any;

    protected onLoad(): void {
        AudioManager.instance = this;

        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSIC, this.Wzhcq_updateMusic, this);
        this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_EFFECT, this.Wzhcq_updateEffect, this);
    }

    playBgMusic() {
        this.Wzhcq_AudioBG.loop = true; // 循环播放,注意一下位置
        this.Wzhcq_AudioBG.mute = false; // 设置静音
        // this.audio.play();
        this.Wzhcq_AudioBG.play();
    }

    stopBgMusic() {
        this.Wzhcq_AudioBG.stop();
    }

    playAudioBtn_Click() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioBtn_Click.play();
        }
    }

    playAudioTouchMove() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioTouchMove.play();
        }
    }

    playAudioXiaoChu() {
        let isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (isEffect) {
            this.Wzhcq_AudioXiaoChu.play();
        }
    }

    playAudioWin() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioWin.play();
        }
    }

    playAudioLose() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioLose.play();
        }
    }

    playAudioXiaoPai() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioXiaoPai.play();
        }
    }

    playAudioBaoZha() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioBaoZha.play();
        }
    }

    playAudioShanDian() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioShanDian.play();
        }
    }

    playAudioReward() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.Wzhcq_AudioReward.play();
        }
    }

    playAudiomerge_1() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.merge_1.play();
        }
    }

    playAudiomerge_4() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.merge_4.play();
        }
    }

    playAudiofinished() {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            this.finished.play();
        }
    }
    
    playAudioClear_bubbles(double_hit_count: any, num: any) {
        let Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);
        if (Wzhcq_isEffect) {
            if (double_hit_count == 1) {

            }
            else {
                switch (double_hit_count % 6) {
                    case 1:
                        this.clear_bubbles1.play();
                        break;
                    case 2:
                        this.clear_bubbles2.play();
                        break;
                    case 3:
                        this.clear_bubbles3.play();
                        break;
                    case 4:
                        this.clear_bubbles4.play();
                        break;
                    case 5:
                        this.clear_bubbles5.play();
                        break;
                    case 0:
                        this.clear_bubbles6.play();
                        break;
                }

            }
        }
    }

    Wzhcq_updateMusic(Wzhcq_volume: any) {
        this.Wzhcq_AudioBG.volume = Wzhcq_volume;
    }

    Wzhcq_updateEffect(Wzhcq_volume: any) {
        this.Wzhcq_AudioBtn_Click.volume = Wzhcq_volume;
        this.Wzhcq_AudioTouchMove.volume = Wzhcq_volume;
        this.Wzhcq_AudioXiaoChu.volume = Wzhcq_volume;
    }
}
