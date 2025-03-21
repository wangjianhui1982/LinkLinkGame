import AudioManager from "./AudioManager";
import BaseComponent from "./BaseComponent";
import { Wzhcq_StorageName } from "./Enum";
import { Utils } from "./Utils";
import { WxPlatform } from "./WxPlatform";

const { ccclass, property } = cc._decorator;

//因为子域跟主域代码不能互相引用，因此定义一个表，分别复制到两边当成一个来使用。
let Consts = {
    OpenDataKeys: {
        LevelKey: "nuoduidui",
    },
    DomainAction: {
        NuoDuiDui_ShowFriend: "NuoDuiDui_ShowFriendRank", //展示好友排行榜
    },
}

@ccclass
export default class Author extends BaseComponent {

    protected onLoad(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

    }

    protected onEnable(): void {
        cc.tween(this.node)
            .to(0.3, { scale: 1 }, { easing: cc.easing.circOut })
            .start();

        WxPlatform.getInstance.showBanner();
    }

    reward_btn() {
        AudioManager.instance.playAudioBtn_Click();
        let self = this;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {

            wx.openSetting({
                success(res) {
                    console.log("openSetting:", res)
                    if (res.authSetting['scope.WxFriendInteraction']) {
                        console.log("发送消息给子欲22222");

                        window.wx.postMessage({
                            messageType: 4,
                            MAIN_MENU_NUM: "nuoduidui",
                        });

                        Utils.getInstance.Wzhcq_setFriend_Auth(1);
                    }
                    else if (res.authSetting['scope.WxFriendInteraction'] == undefined) {
                        console.log("发送消息给子欲3333333");

                        window.wx.postMessage({
                            messageType: 4,
                            MAIN_MENU_NUM: "nuoduidui",
                        });

                    }
                    else if (res.authSetting['scope.WxFriendInteraction'] == false) {
                        console.log('success', res.data);
                        console.log("发送消息给子欲3333333");

                        window.wx.postMessage({
                            messageType: 4,
                            MAIN_MENU_NUM: "nuoduidui",
                        });

                    }
                }
            });
        }

        this.close();
    }

    close() {
        this.node.active = false;
        this.node.scale = 0;

        WxPlatform.getInstance.hideBanner();

    }

    cancel_btn() {
        AudioManager.instance.playAudioBtn_Click();

        this.close();
    }
}


