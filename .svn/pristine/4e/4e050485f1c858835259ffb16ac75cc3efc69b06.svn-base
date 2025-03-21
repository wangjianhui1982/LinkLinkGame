
const { ccclass, property } = cc._decorator;

@ccclass
export default class ResourceLoader {

    private static instance: ResourceLoader = null;
    public static get getInstance(): ResourceLoader {
        if (ResourceLoader.instance == null) {
            ResourceLoader.instance = new ResourceLoader();
        }
        return ResourceLoader.instance;
    }

    loadBundle(Maoxian_nameOrUrl: any) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function () {
                return [
                    2,
                    new Promise(function (Maoxian_callback, Maoxian_callback2) {
                        var Maoxian_bundle = cc.assetManager.getBundle(Maoxian_nameOrUrl);
                        if (Maoxian_bundle) {
                            Maoxian_callback(Maoxian_bundle);
                        }
                        else {
                            cc.assetManager.loadBundle(Maoxian_nameOrUrl, function (Maoxian_err, Maoxian_data) {
                                if (Maoxian_err) {
                                    cc.error("加载 " + Maoxian_nameOrUrl + " bundle失败:", Maoxian_err);
                                    return void Maoxian_callback2(Maoxian_err);
                                }
                                Maoxian_callback(Maoxian_data);
                            });
                        }
                    })
                ];
            });
        });
    };

    loadBundleAsset(Maoxian_bundle: any, Maoxian_paths: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function () {
                return [
                    2,
                    new Promise(function (Maoxian_callback, Maoxian_callback2) {
                        Maoxian_bundle.load(Maoxian_paths, Maoxian_type, function (Maoxian_err: any, Maoxian_data: any) {
                            if (Maoxian_err) {
                                cc.error("加载资源失败: " + Maoxian_paths, Maoxian_err);
                                return void Maoxian_callback2(Maoxian_err);
                            }
                            Maoxian_callback(Maoxian_data);
                        });
                    })
                ];
            });
        });
    };

    loadBundleAssets(Maoxian_bundle: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            var Maoxian_values: any;
            var Maoxian_self = this;
            return __generator(this, function () {
                Maoxian_values = Maoxian_dir.map(function (Maoxian_data: any) {
                    return Maoxian_self.loadBundleAsset(Maoxian_bundle, Maoxian_data, Maoxian_type);
                });
                return [2, Promise.all(Maoxian_values)];
            });
        });
    };

    load(Maoxian_nameOrUrl: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            var Maoxian_bundle: any;
            return __generator(this, function (i: any) {
                switch (i.label) {
                    case 0:
                        return [4, this.loadBundle(Maoxian_nameOrUrl)];
                    case 1:
                        Maoxian_bundle = i.sent();
                        return [2, this.loadBundleAsset(Maoxian_bundle, Maoxian_dir, Maoxian_type)];
                }
            });
        });
    };

    releaseAsset(Maoxian_asset: any) {
        if (Maoxian_asset) {
            Maoxian_asset.decRef();
            cc.assetManager.releaseAsset(Maoxian_asset);
        }
    };

    releaseBundle(Maoxian_bundleName: any) {
        if ("string" == typeof Maoxian_bundleName) {
            var Maoxian_bundle = cc.assetManager.getBundle(Maoxian_bundleName);
            if (Maoxian_bundle) {
                Maoxian_bundle.releaseAll();
                cc.assetManager.removeBundle(Maoxian_bundle);
            }
        }
        else {
            Maoxian_bundleName.releaseAll();
            cc.assetManager.removeBundle(Maoxian_bundleName);
        }
    };

    loadBundleDir(Maoxian_bundle: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function () {
                return [
                    2,
                    new Promise(function (Maoxian_callback, Maoxian_callback2) {
                        Maoxian_bundle.loadDir(Maoxian_dir, Maoxian_type, function (Maoxian_err: any, Maoxian_data: any) {
                            if (Maoxian_err) {
                                cc.error("加载目录失败: " + Maoxian_dir, Maoxian_err);
                                return void Maoxian_callback2(Maoxian_err);
                            }
                            Maoxian_callback(Maoxian_data);
                        });
                    })
                ];
            });
        });
    };

    loadDir(Maoxian_nameOrUrl: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            var Maoxian_bundle: any;
            return __generator(this, function (i: any) {
                switch (i.label) {
                    case 0:
                        return [4, this.loadBundle(Maoxian_nameOrUrl)];
                    case 1:
                        Maoxian_bundle = i.sent();
                        return [2, this.loadBundleDir(Maoxian_bundle, Maoxian_dir, Maoxian_type)];
                }
            });
        });
    };

    preloadBundleAsset(Maoxian_bundle: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function () {
                return [
                    2,
                    new Promise(function (Maoxian_callback, Maoxian_callback2) {
                        Maoxian_bundle.preload(Maoxian_dir, Maoxian_type, function (Maoxian_err: any) {
                            if (Maoxian_err) {
                                cc.error("预加载资源失败: " + Maoxian_dir, Maoxian_err);
                                return void Maoxian_callback2(Maoxian_err);
                            }
                            Maoxian_callback(undefined);
                        });
                    })
                ];
            });
        });
    };

    preloadBundleAssets(Maoxian_bundle: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            var n: any;
            var Maoxian_self = this;
            return __generator(this, function () {
                n = Maoxian_dir.map(function (t) {
                    return Maoxian_self.preloadBundleAsset(Maoxian_bundle, t, Maoxian_type);
                });
                return [2, Promise.all(n).then(function () { })];
            });
        });
    };

    preloadBundleDir(Maoxian_bundle: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function () {
                return [
                    2,
                    new Promise(function (Maoxian_callback, Maoxian_callback2) {
                        Maoxian_bundle.preloadDir(Maoxian_dir, Maoxian_type, function (Maoxian_err: any) {
                            if (Maoxian_err) {
                                cc.error("预加载目录失败: " + Maoxian_dir, Maoxian_err);
                                return void Maoxian_callback2(Maoxian_err);
                            }
                            Maoxian_callback(undefined);
                        });
                    })
                ];
            });
        });
    };

    preload(Maoxian_nameOrUrl: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            var Maoxian_bundle: any;
            return __generator(this, function (i: any) {
                switch (i.label) {
                    case 0:
                        return [4, this.loadBundle(Maoxian_nameOrUrl)];
                    case 1:
                        Maoxian_bundle = i.sent();
                        return [2, this.preloadBundleAsset(Maoxian_bundle, Maoxian_dir, Maoxian_type)];
                }
            });
        });
    };

    preloadDir(Maoxian_nameOrUrl: any, Maoxian_dir: any, Maoxian_type: any) {
        return __awaiter(this, void 0, Promise, function () {
            var Maoxian_bundle: any;
            return __generator(this, function (i: any) {
                switch (i.label) {
                    case 0:
                        return [4, this.loadBundle(Maoxian_nameOrUrl)];
                    case 1:
                        Maoxian_bundle = i.sent();
                        return [2, this.preloadBundleDir(Maoxian_bundle, Maoxian_dir, Maoxian_type)];
                }
            });
        });
    };


}
