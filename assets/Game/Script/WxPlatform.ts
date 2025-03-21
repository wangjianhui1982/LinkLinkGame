import { Utils } from "./Utils";

export class WxPlatform {

    //banner广告
    banner: any = null;
    rewardVideo2: any = null;
    custom5: any = null;
    custom: any = null;

    rewardVideoState = false;

    private static instance: WxPlatform = null;
    public static get getInstance(): WxPlatform {
        if (WxPlatform.instance == null) {
            WxPlatform.instance = new WxPlatform();
        }
        return WxPlatform.instance;
    }

    loadBanner(node) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }

        let winSize = wx.getSystemInfoSync();
        if (winSize.screenHeight < winSize.screenWidth * 2) {
            return;
        }

        if (this.banner != null) {
            this.banner.destroy();
        }
        let id = "adunit-fed0e9532fb03ffd";
        let targetBannerAdWidth = Math.min(winSize.windowWidth, 300);
        let bannerWidth = 300
        let bannerHeight = 80

        let bannerAd = wx.createBannerAd({
            adUnitId: id,
            adIntervals: 120,
            style: {
                left: (winSize.windowWidth - bannerWidth) / 2,
                top: winSize.windowHeight - bannerHeight,
                width: winSize.windowWidth,
                height: winSize.windowHeight - bannerHeight,
            }
        })
        // (cc.view.getVisibleSize().height/2) + (node.y + node.height/2) * winSize.windowWidth/cc.view.getVisibleSize().width
        // 广告的的位置 = (场景的高/2 +(方块的y+方块的height/2)) * (屏幕的宽/场景的宽)  
        // let top = (cc.view.getVisibleSize().height/2) + (node.y + node.height/2) * winSize.windowWidth/cc.view.getVisibleSize().width;

        // let top = (cc.view.getVisibleSize().height / 2 - node.y - node.height / 2) * winSize.windowWidth / cc.view.getVisibleSize().width;

        bannerAd.onResize(size => {
            bannerAd.style.left = winSize.windowWidth / 2 - bannerAd.style.realWidth / 2;
            bannerAd.style.top = winSize.windowHeight - bannerAd.style.realHeight - 1;
        })

        bannerAd.onLoad(() => {
            // console.log('banner 广告加载成功');
            this.banner = bannerAd;
        })

        bannerAd.onError(err => {
            // console.log('banner 广告加载错误', err);
        })
        bannerAd.hide();
    }

    showBanner() {
        if (this.banner) {
            this.banner.show();
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.hide();
        }
    }

    /**
     * 插屏广告
     * @returns 
     */
    showInterstitialAd(callback) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let interstitialAd = wx.createInterstitialAd({
            adUnitId: "adunit-806a17c96b831039",
        });
        interstitialAd.load().then(() => {
            // console.log('插屏 广告加载成功');
        });
        interstitialAd.show().catch((err) => {
            // console.log('插屏广告展示失败', err);
            if (callback) {
                callback();
            }
        });
        interstitialAd.onClose(res => {
            // console.log('关闭插屏广告', res);
        });
        interstitialAd.onError(err => {
            // console.log('err:插屏广告加载失败', err);
        });

    }

    /**多格子广告 */
    CreateCustomAd5(type, callback: Function) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }

        let id = "adunit-494c55e8d1b89c9d";
        let winSize = wx.getSystemInfoSync();

        // let top = (cc.view.getVisibleSize().height / 2 - node.y - node.height / 2) * winSize.windowWidth / cc.view.getVisibleSize().width;

        let style = {
            left: 0,
            top: 200,
            fixed: false,
        }
        if (type && type == 5) {
            id = "adunit-494c55e8d1b89c9d";
            style = {
                left: 0,
                top: 200,
                fixed: false,
            }
        }
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        if (this.custom) {
            this.custom.show();
            return;
        }

        let CustomAd = wx.createCustomAd({
            adUnitId: id,
            adIntervals: 120,
            style: style
        });
        CustomAd.onLoad(() => {
            // console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd.show().then().catch((err) => {
                // console.log("原生模板 广告显示失败", err)
                callback(0);
            })
            this.custom = CustomAd;
        })
        CustomAd.onClose(res => {
            // console.log('关闭原生模板广告', res);
        });
        CustomAd.onError(err => {
            // console.log('原生模板CustomAd 广告加载失败：', err);
            callback(0);
        });
    }

    /**
     * 格子广告
     * @param type 
     * @param callback 
     * @returns 
     */
    showCustomAd5(type, node, callback: Function) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return;
        }
        let id = "";
        let winSize = wx.getSystemInfoSync();
        let style = {}

        let top = (cc.view.getVisibleSize().height / 2 - node.y - node.height / 2) * winSize.windowWidth / cc.view.getVisibleSize().width;

        if (type && type == 5) {
            id = "adunit-bf9084c4b0ffa396";
            style = {
                width: winSize.screenWidth / 1.2,
                left: node.x,
                top: top,
                fixed: 0,
            }
        }

        if (this.custom5) {
            this.custom5.show();
            return;
        }

        let CustomAd5 = wx.createCustomAd({
            adUnitId: id,  //'adunit-abf9c63427c3a38a',
            style: style
        });
        CustomAd5.onLoad(() => {
            // console.log('原生模板 广告加载成功');
            callback(1);
            CustomAd5.show().then().catch((err) => {
                // console.log("原生模板 广告显示失败", err)
                callback(0);
            })
            this.custom5 = CustomAd5;
        })
        CustomAd5.onClose(res => {
            // console.log('关闭原生模板广告', res);
        });
        CustomAd5.onError(err => {
            // console.log('原生模板CustomAd 广告加载失败：', err);
            callback(0);
        });
    }

    /**
     * 激励视频
     * @param callback 
     * @returns 
     */
    mjhongCPG__videoIsBind = !1;
    loadingEnd = false;
    callback: any;

    showRewardVideo2(avtype: any, callback: Function) {
        let self = this;
        Utils.getInstance.sjd_enter_rewardav(avtype);

        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            callback(1);
            return;
        }

        this.callback = callback;

        if (this.rewardVideo2 != null) {
            this.rewardVideo2.offClose(fun);
        }
        else {
            // console.log("rewardVideo2====================");
            let rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: "adunit-bf42560002112acb",
            });
            self.rewardVideo2 = rewardedVideoAd;

            self.rewardVideo2.onError(err => {
                // console.log('激励视频 广告显示失败', err);
                self.callback(2);
            })
        }

        this.rewardVideo2.load().then(() => {
            let mjhongCPG_func = this.rewardVideo2.show();
            mjhongCPG_func.then(function () {
                // console.log("激励视频 广告显示成功");
            });
            mjhongCPG_func.catch(function () {
                this.rewardVideo2.load().then(function () {
                    this.rewardVideo2.show();
                }).catch(function () { });
            });
        });

        var fun = function (res: any) {
            if (res && res.isEnded) {
                // console.log('res:  ', res);
                self.callback(1);
                self.rewardVideo2.offClose(fun);
            }
            else {
                // console.log('播放中途退出');
                self.callback(0);
            }
        }

        this.rewardVideo2.onClose(fun);
    }

    createRewardVideo() {
        let self = this;

        if (this.rewardVideo2 != null) {
            this.rewardVideo2.offClose(fun);
        }
        else {
            // console.log("rewardVideo2====================");
            let rewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: "adunit-bf42560002112acb",
            });
            self.rewardVideo2 = rewardedVideoAd;

            self.rewardVideo2.onError(err => {
                // console.log('激励视频 广告显示失败', err);
                self.callback(2);
            })
        }

        if (this.loadingEnd) {
            console.log("loadRewardVideo====================")
            if (!this.rewardVideo2) {
                this.createRewardVideo();
            }

            this.rewardVideo2.onClose(fun);

            this.rewardVideo2.load().then(() => {
                let mjhongCPG_func = this.rewardVideo2.show();
                mjhongCPG_func.then(function () {
                    console.log("激励视频 广告显示成功");
                });
                mjhongCPG_func.catch(function () {
                    this.rewardVideo2.load().then(function () {
                        this.rewardVideo2.show();
                    }).catch(function () { });
                });
            });
        }
        else {
            this.loadingEnd = true;
        }

        var fun = function (res: any) {
            if (res && res.isEnded) {
                // console.log('res:  ', res);
                self.callback(1);
                self.rewardVideo2.offClose(fun);
            }
            else {
                // console.log('播放中途退出');
                self.callback(0);
            }
        }

    }


}
