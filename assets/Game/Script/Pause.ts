import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Pause extends BaseComponent {

    @property(cc.Toggle)
    Wzhcq_singleMusic: cc.Toggle = null;

    @property(cc.Toggle)
    Wzhcq_singleEffect: cc.Toggle = null;

    @property(cc.Node)
    Wzhcq_feedbackNode: cc.Node = null;

    @property(cc.ProgressBar)
    Wzhcq_music_progressbar: cc.ProgressBar = null;

    @property(cc.ProgressBar)
    Wzhcq_effect_progressbar: cc.ProgressBar = null;

    Wzhcq_isMusic: any;
    Wzhcq_isEffect: any;
    Wzhcq_MusicValue: any;
    Wzhcq_EffectValue: any;

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        // this.EventMgr.on(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_FEEDBACKBUTTON, this.closeUI,this);

    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        this.initData();
    }

    initData() {
        WxPlatform.getInstance.showBanner();

        // Utils.getInstance.is_clickPause = 1;
        // Utils.getInstance.createFeedbackButton(this.feedbackNode);

        this.Wzhcq_isMusic = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Music);
        this.Wzhcq_isEffect = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_Effect);

        this.Wzhcq_singleMusic.isChecked = this.Wzhcq_isMusic;
        this.Wzhcq_singleEffect.isChecked = this.Wzhcq_isEffect;

        this.Wzhcq_MusicValue = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_MusicValue);
        this.Wzhcq_EffectValue = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EffectValue);

        this.Wzhcq_music_progressbar.progress = this.Wzhcq_MusicValue;
        this.Wzhcq_effect_progressbar.progress = this.Wzhcq_EffectValue;

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSIC, this.Wzhcq_MusicValue);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_EFFECT, this.Wzhcq_EffectValue);
    }

    Wzhcq_checkSingleMusic() {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_isMusic = this.Wzhcq_singleMusic.isChecked;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Music, this.Wzhcq_isMusic);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSICSTATE, this.Wzhcq_isMusic);
    }

    Wzhcq_checkSingleEffect() {
        AudioManager.instance.playAudioBtn_Click();

        this.Wzhcq_isEffect = this.Wzhcq_singleEffect.isChecked;
        Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_Effect, this.Wzhcq_isEffect);
        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_EFFECTSTATE, this.Wzhcq_isEffect);
    }

    Wzhcq_addMusic() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isMusic) {
            this.Wzhcq_MusicValue = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_MusicValue);
            if (this.Wzhcq_MusicValue < 1) {
                this.Wzhcq_MusicValue += 0.1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_MusicValue, this.Wzhcq_MusicValue);

                this.Wzhcq_music_progressbar.progress = this.Wzhcq_MusicValue;

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSIC, this.Wzhcq_MusicValue);
            }
        }

    }

    Wzhcq_reduceMusic() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isMusic) {
            this.Wzhcq_MusicValue = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_MusicValue);
            if (this.Wzhcq_MusicValue > 0) {
                this.Wzhcq_MusicValue -= 0.1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_MusicValue, this.Wzhcq_MusicValue);

                this.Wzhcq_music_progressbar.progress = this.Wzhcq_MusicValue;

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_MUSIC, this.Wzhcq_MusicValue);
            }
        }
    }

    Wzhcq_addEffect() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isEffect) {
            this.Wzhcq_EffectValue = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EffectValue);
            if (this.Wzhcq_EffectValue < 1) {
                this.Wzhcq_EffectValue += 0.1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EffectValue, this.Wzhcq_EffectValue);

                this.Wzhcq_effect_progressbar.progress = this.Wzhcq_EffectValue;

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_EFFECT, this.Wzhcq_EffectValue);
            }
        }
    }

    Wzhcq_reduceEffect() {
        AudioManager.instance.playAudioBtn_Click();

        if (this.Wzhcq_isEffect) {
            this.Wzhcq_EffectValue = Utils.getInstance.Wzhcq_getItem(Wzhcq_StorageName.Wzhcq_EffectValue);
            if (this.Wzhcq_EffectValue > 0) {
                this.Wzhcq_EffectValue -= 0.1;
                Utils.getInstance.Wzhcq_setItem(Wzhcq_StorageName.Wzhcq_EffectValue, this.Wzhcq_EffectValue);

                this.Wzhcq_effect_progressbar.progress = this.Wzhcq_EffectValue;

                this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_UPDATE_EFFECT, this.Wzhcq_EffectValue);
            }
        }
    }

    Wzhcq_onweChat() {
        AudioManager.instance.playAudioBtn_Click();

        Utils.getInstance.openKeFu();

        this.Wzhcq_closeUI();
    }

    Wzhcq_clickBack_Btn() {
        AudioManager.instance.playAudioBtn_Click();
        if (Utils.getInstance.GameType > 1) {
            this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_WARN_POPUP, undefined);
        }
        else {
            cc.director.loadScene("Start")
        }
    }

    Wzhcq_clickClose_Btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.EventMgr.emit(this.EventMgr.Wzhcq_EVENT_NAMES.Wzhcq_CLOSE_PAUSE, undefined);
        this.Wzhcq_closeUI();
    }

    Wzhcq_closeUI() {
        // Utils.getInstance.is_clickPause = 0;
        // Utils.getInstance.hideFeedbackButton();

        this.node.active = false;
        this.node.scale = 0;
        WxPlatform.getInstance.hideBanner();
    }
}
