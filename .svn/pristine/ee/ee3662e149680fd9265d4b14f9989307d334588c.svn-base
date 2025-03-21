export class HttpUtil {
    /**
     * 延迟多久没回复就返回False
     *
     * @type {number}
     * @memberof DriveManager
     */
    private static TimeOut: number = 3000;


    getXMLHttpRequest() {
        return new XMLHttpRequest();
    }

    /**
     * GET请求
     *
     * @static
     * @param {*} url
     * @param {object} [params={}]
     * @param {*} callback
     * @memberof HttpUtil
     */
    public static GET(url, params: object = {}) {

        return new Promise((resolve, reject) => {
            let dataStr = '';
            Object.keys(params).forEach(key => {
                dataStr += key + '=' + encodeURIComponent(params[key]) + '&';
            })
            if (dataStr !== '') {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
            // url = HttpUtil.baseUrl + url;

            let xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", url, true);
            console.log(" 打印3333");

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {

                    let response = xhr.responseText;
                    if (xhr.status == 200) {
                        let httpStatus = xhr.statusText;
                        // callback(true, JSON.parse(response));
                        console.log("GET 打印1111");
                        resolve(response);
                        // callback(true, response);
                    } else {
                        console.log("GET 打印2222");
                        resolve(response);
                        // callback(false, response);
                    }
                }
                console.log(" 打印44444");

            };
            xhr.onerror = (evt) => {
                console.log("xmlHttp.onerror", evt);
            }
            xhr.timeout = this.TimeOut;
            xhr.send();
        })
    }

    /**
     * POST请求
     *
     * @static
     * @param {*} url
     * @param {object} [param={}]
     * @param {*} callback
     * @memberof HttpUtil
     */
    public static POST(url, param: object = {}, callback) {
        // url = HttpUtil.baseUrl + url;
        // var xhr = cc.loader.getXMLHttpRequest();
        var xhr = new XMLHttpRequest();
        let dataStr = '';
        Object.keys(param).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(param[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    console.log(" 打印1111");

                    // callback(true, JSON.parse(response));
                    callback(true, response);

                } else {
                    console.log(" 打印2222");

                    callback(false, response);
                }
            }
        };
        xhr.send(dataStr);
    }

    public static saveGameInfo_Post(_url, params, callback) {
        wx.request({
            url: _url,
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            data: {
                gamePlayerInfo: params.gamePlayerInfo,
                openId: params.openId
            },
            success: function (res) {
                console.log("saveGameInfo_Post:", res);
                callback(res);
            }
        });
    }

    public static GET_Json(url, cbSucc, cbFail) {
        var flag = false;

        let xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url, true);
        console.log(" 打印3333");

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(" 打印1111");
                    cbSucc(xhr.responseText);
                }
                else {
                    console.log(" 打印2222:", flag);
                    if (!flag) {
                        flag = true;
                        cbFail(xhr.status);
                    }
                }
            }
        };
        xhr.onerror = (evt) => {
            console.log("xmlHttp.onerror", evt);
            if (!flag) {
                flag = true;
                cbFail(xhr.status, null);
            }
        }
        xhr.timeout = this.TimeOut;
        xhr.send();
    }

    public static httpGet(url, cbSucc, cbFail, params) {
        var flag = false;

        let dataStr = '';
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(params[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
        // url = HttpUtil.baseUrl + url;

        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        var timedOut = false;
        // var timer = setTimeout(function () {
        //     timedOut = true;
        //     xhr.abort();
        // }, 3000);

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // var isRaw = false;
        // if (options && options.responseType) {
        //     isRaw = true;
        //     xhr.responseType = options.responseType;
        //     delete options.responseType;
        // }

        // for (var k in options)
        //     if (options.hasOwnProperty(k))
        //         xhr.setRequestHeader(k, options[k]);

        xhr.onreadystatechange = function () {
            if (timedOut) {
                return;
            }
            // clearTimeout(timer);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(" 打印1111");
                    cbSucc(xhr.responseText);
                }
                else {
                    console.log(" 打印2222:", flag);
                    if (!flag) {
                        flag = true;
                        cbFail(xhr.statusText, xhr.responseText);
                    }
                }
            }
        };
        xhr.onerror = function () {
            console.log(" 打印3333:", flag);
            if (!flag) {
                flag = true;
                cbFail(xhr.status, null);
            }
        };
        xhr.timeout = this.TimeOut;
        xhr.send();
    };

    public static reportEvent(data: any) {
        // console.error("data:", JSON.stringify(data));
        let reportEvent_http = "https://stat.tmoretek.cn/wxadmin/game/reportEvent";
        // let reportEvent_http = "http://192.168.0.5:9090/wxadmin/game/reportEvent";

        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.request({
                url: reportEvent_http, //仅为示例，并非真实的接口地址

                data: data,
                method: "POST",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success(res:any) {
                    let data: any = res.data;
                    console.log("reportEvent 上报数据成功：", data);
                }
            })
        }
    }
}
