(function() {
    var u = {};
    var appSignNum = 35;
    var host = 'http://tkqmanage.weixinchai.com/'; //主域名(网络请求用)
    var standbyhost = 'https://tae.ujuec.com/';
    var shareHost = 'https://app.ujuec.com/'; //分享用的域名(现由服务返回 未用)
    var NewHost = 'http://tkqapi2.weixinchai.com/'; //新街口域名
    var helpList = 'http://help.t-ke.cn/web/#/1?page_id=2'; //帮助文档链接
    var Registhost = "http://ai.tkooo.cn/"
    var defaultRequest = {
        url: host + 'manageApi.ashx',
        time: parseInt(new Date().getTime()),
        version: 1,
        sign: '0.1',
        apiver: 1
    };
    u.host = host;
    u.AppName = "淘客圈云发单";
    u.AppLogo = "widget://image/applogo.png";
    u.RegisterUrl = Registhost + "RegisterApp?uid=";
    u.TaoBaoToken = 'https://login.taobao.com/member/login.jhtml?sub=true&full_redirect=true&style=mini_top&from=mini_top&from_encoding=utf-8&TPL_redirect_url=https%3a%2f%2foauth.taobao.com%2fauthorize%3fresponse_type%3dcode%26view%3dweb%26redirect_uri%3dhttp%253A%252F%252Fai.vertq.com%252FoatuthTb_App.ashx%26state%3d5454%26client_id%3d24659577';
    u.QQcaijiUrl = "http://tkupload.oss-cn-hangzhou.aliyuncs.com/千相魔方云发单助手采集群发管理系统安装（6.4）.rar";
    u.YunFaDanTuiGuangJS = "http://help.t-ke.cn/web/#/1?page_id=48";
    u.HeHuoRenAdvert = "http://tkupload.oss-cn-hangzhou.aliyuncs.com/千相魔方云发单助手采集群发管理系统安装（6.4）.rar";
    u.HeHuoRenWeiXin = "http://tkupload.oss-cn-hangzhou.aliyuncs.com/千相魔方云发单助手采集群发管理系统安装（6.4）.rar";
    u.FenYongDownLoadLink = "";
    u.AppGongGao = "";
    u.GetRobotInfo = "";
    u.WeiXinTiShi = "";
    u.RobotProblem = "";

    function response(json, callback) {
        api.ajax(json, function(ret, err) {
            if (ret != undefined) {
                if (json.url.indexOf(NewHost) == -1) {
                    if (ret.error == 2) {
                        api.openWin({
                            name: 'login_index',
                            url: 'widget://html/login_index.html',
                        });
                    }
                } else {
                    if (ret.StateCode == 3) {
                        api.openWin({
                            name: 'login_index',
                            url: 'widget://html/login_index.html',
                        });
                    }
                }

            }
            callback(ret, err);
            // var backall = json && json.returnAll ? json.returnAll == true : false;
            //                       if ((ret&&backall&&ret.body)||(ret&&!backall)) {
            // if (ret) {
            //     if (backall) {
            //
            //         if (ret.headers['ustatus'] == '0' && json.headers['Func'] != '0x0034' && json.headers['Func'] != '0x0029' &&
            //             json.headers['Func'] != '0x0004' && json.headers['Func'] != '0x0001' && json.headers['Func'] != '0x0002' &&
            //             json.headers['Func'] != '0x0019' && json.headers['Func'] != '0x0005' && json.headers['Func'] != '0x0003' && json.headers['Func'] != '0x0036') {
            //             //                                              api.setPrefs({key:'isLogin',value:'false'});//是否登录
            //             u.exit();
            //         } else if (ret.body.isError && ret.body.errorCode == '11012') {
            //             u.exit();
            //         }
            //         callback(ret, err);
            //     } else {
            //         if (ret.isError && ret.errorCode == '11012') {
            //             u.exit();
            //         }
            //         callback(ret, err);
            //     }
            // } else if (err) {
            //     console.log('网络错误err---------' + JSON.stringify(err));
            //     //请求服务器失败err不为空  更换域名重新请求一次
            //     if (json.url != standbyhost + 'api/index.php') {
            //         json.url = standbyhost + 'api/index.php';
            //         api.setPrefs({
            //             key: 'current_hosturl',
            //             value: json.url
            //         });
            //         console.log('启用standbyhost');
            //         response(json, callback);
            //     } else {
            //         callback(ret, err);
            //     }
            // } else {
            //     callback(ret, err);
            // }
        });
    }

    function parseArguments(order, json, fnSuc, method) {
        if (method == undefined) {
            method = 'post';
        }
        if (order == "login") {
            json.url = host + 'Login.ashx';
        }
        if (order == "CommitGoods") {
            json.url = host + 'CommitGoods.ashx';
        }
        if (order != "0x0001" && order != "login" && order != "CommitGoods") {
            json.url = NewHost + 'Manager/' + order;
        }
        // if(order == "NewHost"){
        // json.url = GoodsHost + 'Manager/GetQyGoodsInfo';
        // }
        // if(order == "123456"){
        // json.url = "http://testserverapi.tkooo.cn/Manager/GetUserGroupRobotInfo";
        // method= "get";
        // }
        // typeof 返回值有六种可能： "number," "string," "boolean," "object," "function," 和 "undefined."
        if ((json != undefined) && (typeof(json) != 'function')) {
            data = json;
            if (json.url == undefined) {
                data.url = defaultRequest.url;
            }
            if (json.method == undefined) {
                data.method = method;
            }
            if (json.dataType == undefined) {
                data.dataType = 'json';
            }
        }
        // alert(json.url)
        return {
            data: data,
            callback: fnSuc
        };
    }
    u.TaoBaoAuthorize = function() {
        var Usersconfig = $api.getStorage('Usersconfig');

        if (Usersconfig != undefined) {
            var userId = Usersconfig.userId;
        }
        var newTaoBaoToken = u.TaoBaoToken.replace("5454", userId);
        return newTaoBaoToken;
    }
    u.request = function() {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = argsToJson.data;
        var fnSuc = argsToJson.callback;
        // alert(JSON.stringify(json))
        // alert(JSON.stringify(fnSuc))
        if (u.judgeNetwork()) {
            response(json, fnSuc);

        } else {
            api.hideProgress()
        }
    };
    u.isLogin = function(callback) {
        var back = {};
        api.getPrefs({
            key: 'isLogin'
        }, function(ret, err) {
            if (ret && ret.value == 'true') {
                back.value = true;
                callback(back);
                // else{back.value = false;callback(back);}
            } else {
                back.value = false;
                callback(back);
            }
        });
    };
    u.clipText = function(key, msg) {
        clipBoard = api.require('clipBoard');
        clipBoard.set({
            value: key
        }, function(ret, err) {
            if (ret) {
                $common.toast(msg);
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    u.FormatJsonData = function(date) {
        date = date.replace("T", " ").split(".")[0]
        return date;
    }
    u.timeout = function(key) {
        var now = parseInt(new Date().getTime() / 1000);
        var requestTime = $api.getStorage(key);
        //缓存设置
        if (requestTime == undefined || (now - requestTime) > 600) {
            return false; //过期
        } else {
            return true; //未过期
        }
    }
    u.time = function(key) {
            var now = parseInt(new Date().getTime() / 1000);
            $api.setStorage(key, now);
        }
        //	板块类型，板块id
    u.plateInfo = function(type, id) {
        var storage = $api.getStorage('index');
        var data;
        if (type == 1) {
            data = storage['result']['goodssection'];
        } else {
            data = storage['result']['appssection'];
        }
        var i = 0;
        for (i; i < data.length; i++) {
            var obj = data[i];
            if (obj.gs_id == id) {
                return obj;
            }
        }

    }

    //	返回分类 首页  优惠券和商品板块
    u.homeClass = function(type, id) {
        var storage = $api.getStorage('index');
        var data;
        if (type == 2) {
            data = storage['result']['goodssection'];
        } else {
            data = storage['result']['goodsdata']['result']['category'];
        }
        var i = 0;
        if (type == 2) {
            for (i; i < data.length; i++) {
                var obj = data[i];
                if (obj.gs_id == id) {
                    return obj;
                }
            }
        } else {
            return data;
        }
    }
    u.closeLoginWin = function() {
        var type = 1;
        if (api.winName == 'root') {
            type = 0;
        } else if (api.pageParam == undefined) {
            type = 1;
        } else if (api.pageParam.type == undefined) {
            type = 1;
        } else {
            type = api.pageParam.type;
        }

        switch (type) {
            case 0: //通过原生activity打开的登录页面（root是登录页面）
                api.closeWin();
                // u.closeAllWin();
                break;
            case 1: //通过superWeb打开的登录页面
                api.closeWin();
                break;
            case 2: //例如：退出登录
                api.closeToWin({
                    name: 'root'
                });
                break;
            default:
                api.closeWin();
                break;
        }
    };
    u.openWin = function(name, Param) {
        api.openWin({
            name: name,
            url: 'widget://html/' + name + '.html',
            pageParam: Param
        });
    }
    u.openUrlWin = function(name, url) {
        api.openWin({
            name: name,
            url: url
        });
    }
    u.openNewWin = function(name, Param) {
        api.openFrame({
            name: name,
            url: Param.url,
            pageParam: Param,
            reload: true,
            rect: {
                x: 0,
                y: 60,
                w: 'auto',
                h: 'auto'
            }
        });

    }
    u.openFrame = function(name, url) {
        api.openFrame({
            name: name,
            url: url,
            rect: {
                x: 0,
                y: 0,
                w: api.winWidth,
                h: api.winHeight
            },
            pageParam: {
                name: 'test'
            },
            bounces: false,
            bgColor: 'rgba(0,0,0,0)',
            vScrollBarEnabled: true,
            hScrollBarEnabled: true
        });

    }
    u.closeWin = function(name) {
        api.closeWin({
            name: name
        });
    }
    u.closeSelfWin = function() {
        api.closeWin();
    }
    u.closeFrame = function(name) {
        api.closeFrame({
            name: name
        });
    }
    u.toast = function(msg) {
        api.toast({
            msg: msg,
            duration: 3000,
            location: 'bottom'
        });
    }
    u.progress = function(msg) {
        msg = msg == undefined ? "加载中..." : msg;
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: msg,
            text: '请稍后...',
            modal: true
        });
    }
    u.alert = function(data) {
            api.alert({
                title: '提示',
                msg: data,
            }, function(ret, err) {});
        }
        //	下拉刷新
    u.setrefresh = function(func) {
            //		api.setRefreshHeaderInfo({
            //		    visible: true,
            //		    loadingImg: 'widget://image/refresh1.png',
            //		    bgColor: '#ccc',
            //		    textColor: '#fff',
            //		    textDown: '下拉刷新...',
            //		    textUp: '松开刷新...',
            //		    showTime: true
            //		}, function(ret, err) {
            //			func(ret,err);
            //		});
            api.setCustomRefreshHeaderInfo({
                bgColor: '#ffffff',
                images: ['widget://image/refresh1.png', 'widget://image/refresh2.png', 'widget://image/refresh1.png'],
                tips: { //（可选项）JSON 对象；整个下拉及加载过程的文字提示；不传则不显示文字区域
                    pull: '下拉刷新', //（可选项）字符串类型；下拉过程（下拉高度未达到阈值前）的文字提示；不传则不显示该时段的文字提示
                    threshold: '松开立即刷新', //（可选项）字符串类型；下拉过程（下拉高度达到或超过阈值）的文字提示；不传则不显示该时段的文字提示
                    load: '正在刷新' //（可选项）字符串类型；加载状态的文字提示；不传则不显示该时段的文字提示
                }
            }, function(ret, err) {
                func(ret, err);
            });

        }
        // 转换app板块名
    u.convertAppPlateName = function(id) {
        var tmp = $api.getStorage('index');
        // alert(JSON.stringify(tmp.appssection))
        var appssection = tmp.appssection;
        for (var i = 0; i < appssection.length; i++) {
            if (id == appssection[i].as_id) {
                return appssection[i];
            }
        }
    }
    u.getGoodsPlate = function(id) {
            var tmp = $api.getStorage('index');
            var section = tmp.goodssection;
            for (var i = 0; i < section.length; i++) {
                if (id == section[i].gs_id) {
                    return section[i];
                }
            }
        }
        // 跳转板块
    u.jumpPlate = function(name, edit) {
        if (name == 'cart') {
            $handsome.openShopCar();
        } else {
            api.openWin({
                name: name,
                delay: 300,
                allowEdit: edit == undefined ? false : true,
                url: 'widget://html/plate/' + name + '.html'
            });
        }
    }

    u.openGoodsPlate = function(data) {
            api.openWin({
                name: 'goodsplate',
                pageParam: {
                    data: data
                },
                url: '../plate/goodsplate.html'
            })
        }
        // 计算头部和内容区域高度
    u.fixHeader = function() {
            // var header = $api.dom('header');
            // // $api.css(header,'background:#333333');
            // $api.fixStatusBar(header);
            // var headerH = $api.offset(header).h;
            // var systemType = api.systemType;
            // return headerH;
            var header = $api.dom('header');
            // $api.css(header,'background:#333333');
            var headerH = 0;

            var systemType = api.systemType;
            $api.fixStatusBar(header);
            headerH = $api.offset(header).h;
            // if (systemType == 'ios') {
            //     $api.fixStatusBar(header);
            //     headerH = $api.offset(header).h;
            // }
            // else {
            //     headerH = $api.offset(header).h;
            // }
            return headerH;
        }
        // 打开外部链接
    u.openOutLink = function(url, name) {
        if (name == undefined) {
            name = '外部链接';
        }
        api.openWin({
            name: 'outlink',
            url: '../win/outlink.html',
            pageParam: {
                name: name,
                url: url
            }
        });
    }
    u.tag = function(status) {
        var html = '';
        html += '<div class="tag">';
        if (status == 1) {
            html += '<div class="car"></div>';
        }
        html += '<div class="scrolltop"></div>';
        html += '</div>';
        $('.tag').remove();
        $("body").append(html);
        $(".car").on('click', function() {
            $handsome.openShopCar();
        })
        $(".scrolltop").on('click', function() {
            $(window).scrollTop(0);
        })
        $(window).scroll(function() {
            if ($(window).scrollTop() != 0) {
                $(".tag").addClass('active');
            } else {
                $(".tag").removeClass('active');
            }
        })
    }
    u.swipe = {
        default_x: 0, //偏移起点
        default_y: 0,
        move_x: 0, //单次偏移量
        end_x: 0, //默认实际偏移
        status: true, //临界状态
        last_x: 0,
        step: 200, //动画滑动步长
        start_val: 100, //动画滑动开始值
        width: 0,
        winW: 0,
        allowLen: 0,
        move: function(el) {
            var self = this;
            el.on('touchmove', function(event) {
                event.preventDefault();
                if (self.default_y - event.targetTouches[0].pageY > 30 || self.default_y - event.targetTouches[0].pageY < -30) {
                    $(this).off('touchmove');
                    $(this).off('touchend');
                    // 向上滑动超过50则移除此事件,以便页面能继续滚动
                }

                self.move_x = -(self.default_x - event.targetTouches[0].pageX); //单次偏移量（相对）
                self.last_x = self.move_x + self.end_x; //实际x偏移量
                if (self.move_x > 0) {
                    /*向右移动*/
                    self.status = true;
                    if (self.last_x >= 0) {
                        self.last_x = 0;
                        self.end_x = 0;
                        self.status = false;
                    }
                } else if (self.move_x < 0) {
                    /*向左移动*/
                    self.status = true;
                    if (self.last_x <= self.allowLen) {
                        self.last_x = self.allowLen;
                        self.end_x = self.allowLen;
                        self.status = false;
                    }
                }

                el.removeAttr('style');
                el.css("margin-left", self.last_x + 'px');
                //					console.log('当前偏移'+self.move_x);


            })
        },
        start: function(el) {
            var self = this;
            el.on('touchstart', function(event) {
                // alert(JSON.stringify(event.targetTouches[0].pageX));

                self.default_x = event.targetTouches[0].pageX;
                self.default_y = event.targetTouches[0].pageY;
                self.move(el);
                self.end(el);
            })
        },
        end: function(el) {
            var self = this;
            el.on('touchend', function(event) {
                if (self.status && self.move_x != 0) {
                    self.end_x = self.end_x + self.move_x;
                    if (parseInt(self.move_x) <= self.start_val) {
                        if (self.move_x > 0) {
                            self.end_x = self.end_x + self.step;
                        } else {
                            self.end_x = self.end_x - self.step;
                        }

                        if (self.end_x <= self.allowLen) {
                            self.end_x = self.allowLen;
                        }
                        if (self.end_x >= 0) {
                            self.end_x = 0;
                        }
                        el.css({
                            "transition": ".4s linear",
                            "margin-left": self.end_x + "px"
                        });
                    }
                    //						console.log('实际偏移'+self.end_x);
                } else {
                    //						console.log('临界值'+self.end_x);
                }

            })
        },
        ev: function(el, width) {
            this.width = width,
                this.winW = window.screen.width,
                this.allowLen = this.winW - this.width,
                this.start(el);
        }
    }
    u.checkUrl = function(str_url) {
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
                "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                +
                "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                +
                "|" // 允许IP和DOMAIN（域名）
                +
                "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                +
                "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                +
                "[a-z]{2,6})" // first level domain- .com or .museum
                +
                "(:[0-9]{1,4})?" // 端口- :80
                +
                "((/?)|" // a slash isn't required if there is no file name
                +
                "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);
            //re.test()
            if (re.test(str_url)) {
                return (true);
            } else {
                return (false);
            }
        }
        // 搜索记录
    u.searchHistory = function(str) {
            var history = $api.getStorage('history');
            if (history == undefined) {
                history = [];
            }
            for (var i = 0; i < history.length; i++) {
                if (history[i].name == str) {
                    history.splice(i, 1);
                }
            }
            history.unshift({
                name: str
            });
            $api.setStorage('history', history);
            return history;
        }
        //设置顶部颜色
    u.setTopColor = function(tag) {
        if (api.systemType == 'ios') {
            tag.style.background = '#fdfdfd';
        } else {
            tag.style.background = '#333333';
        }
    }
    u.closeSharePopup = function() {
        popup.hide($api.dom("#bottom"))
    }
    u.openSharePopup = function() {
        popup.show($api.dom("#bottom"))
    }
    u.shareWx = function(url, title, type, description, img, callback) {
        popup.hide($api.dom("#bottom"))
        var wx = api.require('wx');
        wx.shareWebpage({
            scene: 'session',
            title: title,
            description: description,
            thumb: img,
            contentUrl: url
        }, function(ret, err) {
            callback(ret)
        });
    }
    u.shareQQ = function(url, title, type, description, img, callback) {
        popup.hide($api.dom("#bottom"))
        var qq = api.require('qq');
        qq.shareNews({
            url: url,
            title: title,
            type: type,
            description: description,
            imgUrl: img
        }, function(ret, err) {
            callback(ret, err)
        });
    }
    u.ClipText = function(val, tostText, callback) {
        popup.hide($api.dom("#bottom"));
        clipBoard = api.require('clipBoard');
        clipBoard.set({
            value: val
        }, function(ret, err) {
            if (ret) {
                $common.toast(tostText);
            } else {
                alert(JSON.stringify(err));
            }
        });
    }
    u.GetClipText = function(callback) {
            clipBoard = api.require('clipBoard');
            clipBoard.get(function(ret, err) {
                callback(ret, err)
            });
        }
        //分享
        //内容url 标题  描述  图片

    u.share = function(url, title, description, img, type) {
        var s = '<div id="share">\
				<div class="share-out">\
					<div class="share-content">\
						<div class="s_row" id="qq">\
							<div class="sicon s-qq"></div>发送到QQ\
						</div>\
						<div class="s_row" id="wechat">\
							<div class="sicon s-wechat"></div>发送到微信\
						</div>\
						<div class="s_row" id="friend">\
							<div class="sicon s-friend"></div>发送到微信朋友圈\
						</div>\
						<div class="s_row" id="qzone">\
							<div class="sicon s-qzone"></div>发送到QQ空间\
						</div>\
					</div>\
				</div>\
				<div id="s_close">\
				</div>\
			</div>';
        $("body").append(s);
        $("#s_close,#share").click(function() {
            $("#share").remove();
        })
        var qq = api.require('qq');
        var wx = api.require('wx');

        //	   QQ分享
        $("#qq").click(function(e) {
                e.stopPropagation();
                qq.shareNews({
                    url: url,
                    title: title,
                    type: 'QFriend',
                    description: description,
                    imgUrl: img
                }, function(ret) {
                    if (ret.status == true) {
                        u.toast('分享成功');
                        u.shareType(type);
                    }

                });
            })
            //	   空间分享
        $("#qzone").click(function(e) {
                e.stopPropagation();
                qq.shareNews({
                    url: url,
                    title: title,
                    type: 'QZone',
                    description: description,
                    imgUrl: img
                }, function(ret) {
                    if (ret.status == true) {
                        u.toast('分享成功');
                        u.shareType(type);
                    }

                });
            })
            //	   微信分享
        $("#wechat").click(function(e) {
                e.stopPropagation();
                api.imageCache({
                    url: img
                }, function(ret, err) {
                    wx.shareWebpage({
                        scene: 'session',
                        title: title,
                        description: description,
                        thumb: ret.status ? ret.url : 'widget://image/log.png',
                        contentUrl: url
                    }, function(ret, err) {
                        if (ret.status) {
                            u.toast('分享成功');
                            u.shareType(type);
                        }
                    });
                });
            })
            //	   朋友圈分享
        $("#friend").click(function(e) {
            e.stopPropagation();

            api.imageCache({
                url: img
            }, function(ret, err) {
                wx.shareWebpage({
                    scene: 'timeline',
                    title: title,
                    description: description,
                    thumb: ret.status ? ret.url : 'widget://image/log.png',
                    contentUrl: url
                }, function(ret, err) {
                    if (ret.status) {
                        u.toast('分享成功');
                        u.shareType(type);
                    }
                });
            });
        })

    }

    //type: 0:一元购  1:优惠券 2:晒单 3:邀请 4::邀请拼团 5分享应用
    u.shareType = function(type) {
        if (type != undefined) {
            $api.request('0x0030', {
                stype: type
            }, function(ret) {

            })
        }
    }

    u.parseXML = function(data) {
        var xml, tmp;
        try {
            if (window.DOMParser) { // Sandard
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else { //IE
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + data);
        }
        return xml;
    }
    u.review = function() {
        var ios_review = $api.getPrefs('index').setting.ai_ios_review; //1开启  0 关闭
        var ios_check_version = $api.getPrefs('index').setting.ai_ios_check_version; //ios审核版本号
        var ios_version = api.appVersion; //当前版本号
        var os = api.systemType;
        if (os == 'ios' && ios_review == 1 && ios_check_version == ios_version) {
            return false; //不显示
        } else {
            return true; //显示
        }
    }
    u.home_review = function(fn) {
        $api.getPrefsSync('index', function(val) {
            var ios_review = val.setting.ai_ios_review; //1开启  0 关闭
            var ios_check_version = val.setting.ai_ios_check_version; //ios审核版本号
            var ios_version = api.appVersion; //当前版本号
            var os = api.systemType;
            var result;
            if (os == 'ios' && ios_review == 1 && ios_check_version == ios_version) {
                result = false; //不显示
            } else {
                result = true; //显示
            }
            fn(result);
        })

    }
    u.screenShot = function(fn) {
        var screenClip = api.require('screenClip');
        screenClip.open({
            cutFrame: {
                x: 0,
                y: 50,
                w: api.winWidth,
                h: api.winHeight
            }
        })
        screenClip.save({
                album: false,
                imgPath: 'widget://image/',
                imgName: 'clip.png'
            }, function(ret, err) {
                fn(ret.status)
            })
            // screenClip.screenShot({
            // album:false,imgPath:'widget://image/',imgName:'clip.png'
            // },function(ret, err) {
            //  fn(ret.status);
            // });
    }
    u.loginOpen = function(ret, fromWhere) {
        var systemType = api.systemType;
        $api.setStorage('iii', ret.iii);
        api.sendEvent({
            name: 'myEvent',
            extra: {
                iii: ret.iii
            }
        });
        var type = 1;
        var winName = 'root';
        var reload = true;
        u.openJudgeSys(systemType, function() {
          api.closeToWin({
    name: 'root'
});
            api.execScript({
                name: 'root',
                script: 'randomSwitchBtn2(0);'
            });
            api.execScript({
                name: 'root',
                script: 'GetAppBaseConfig();'
            });

            // api.openWin({
            //     name: "index",
            //     reload: false
            // });

            // api.execScript({
            //   name: 'root',
            //   frameName:'frame0',
            //   script: 'apiready();'
            // });
        });
        return;
        // if (api.winName == 'root') {
        //     type = 0;
        // } else if (api.pageParam == undefined) {
        //     type = 1;
        //     winName = 'root';
        //     reload = true;
        // } else {
        //     if (!api.pageParam.type) {
        //         type = 1;
        //     } else {
        //         type = api.pageParam.type;
        //     }
        //     if (!api.pageParam.winName) {
        //         winName = 'root';
        //     } else {
        //         winName = api.pageParam.winName;
        //     }
        //     if (!api.pageParam.reload) {
        //         reload = false;
        //     } else {
        //         reload = api.pageParam.reload;
        //     }
        // }
        type = 1;
        /*ios上先关闭再打开 ！！！
        android中先打开在关闭！！！*/
        switch (type) {
            case 0: //通过原生activity打开的登录页面（root是登录页面）

                u.closeAllWin();
                break;
            case 1: //通过superWeb打开的登录页面

                u.openJudgeSys(systemType, function() {
                    api.execScript({
                        name: 'index',
                        script: 'funIniGroup();'
                    });
                    api.execScript({
                        name: 'root',
                        script: 'funIniGroup();'
                    });
                });
                break;
            case 2: //例如：退出登录

                u.openJudgeSys(systemType, function() {
                    //					api.openWin({
                    api.closeToWin({
                        name: 'root',
                        reload: false //这里为true的时候 my页面的顶部会跑到 index的其他页面上，因为my是一个win
                    });
                });

                break;
            case 3:

                api.closeWin({
                    name: 'login_index',
                    animation: {
                        type: 'none' //动画类型（详见动画类型常量）
                    }
                });
                break;
            default:
                u.openJudgeSys(systemType, function() {
                    api.openWin({
                        name: 'root',
                        url: '../index.html',
                    });
                });
                break;
        }

    }

    /*ios上先关闭再打开 ！！！
               android中先打开在关闭！！！*/
    u.openJudgeSys = function(systemType, fun) {
        if (systemType == 'ios') {
            api.closeWin({
                name: 'login_index',
                animation: {
                    type: 'none' //动画类型（详见动画类型常量）
                }
            });
        }
        fun();
        if (systemType == 'android') {
            api.closeWin({
                name: 'login_index',
                animation: {
                    type: 'none' //动画类型（详见动画类型常量）
                }
            });
        }

    };
    u.judgeNetwork = function() {
        var connectionType = api.connectionType; //比如： wifi
        if ('none' == connectionType) {
            u.toast('请检查网络连接!');
            return false;
        } else {
            return true;
        }
        // unknown            //未知
        // ethernet        //以太网
        // wifi            //wifi
        // 2g                //2G网络
        // 3g                //3G网络
        // 4g                //4G网络
        // none            //无网络
    };
    u.showLoading = function() {
        document.getElementById("load5").style.display = "block";
    }
    u.hideLoading = function() {
        document.getElementById("load5").style.display = "none";
    }
    u.keyfilter = function(keywords, fn) {
        api.ajax({
            url: 'https://suggest.taobao.com/sug?callback=jQuery112407101364103693755_1493091381962&code=utf-8&q=' + keywords + '&_=1493091382026&isg=AhIS9EuknlO9x-IItIQuYl8EY9jAegP4j7MAQNxviEWw77Tp87EozUzJKfyp&isg2=ApycFeNQSNeAz0PnLCyAid%2Fh7LBKo0A%2F&qq-pf-to=pcqq.group',
            method: 'get',
            data: {
                values: {}
            },
            dataType: 'text'
        }, function(ret, err) {
            var result = ret.replace('\r\n', '');
            var r = result.match(/[(]{1}(.*?)[)]{1}/);
            fn(JSON.parse(r[1]).result);
        });
    }
    u.outopen = function(param) {
        //		    var id = ret.id;
        //            var title = ret.title;
        //            var content = ret.content;
        //            var extra = ret.extra;
        if (param.page) {
          if(param.page.indexOf("http")!=-1){
            u.openWin('thirdHead', {
                title: '',
                key: "OutUrl",
                FrameName: param.page
            });
            return;
          }
            switch (param.page) {
                case 'msg': //打开消息页面
                    u.openWin('fourthHead', {
                        title: '消息中心',
                        key: 3,
                        FrameName: 'GroupMessageList'
                    });
                    break;
                case 'OutUrl': //打开通知页面
                u.openWin('fourthHead', {
                    title: '',
                    key: OutUrl,
                    FrameName: 'GroupMessageList'
                });
                    break;
                case 'bright': //打开秒券详情
                    api.openWin({
                        name: 'my_bright',
                        url: '../my_bright.html',
                        pageParam: {
                            name: 'my_page',
                            status: 0
                        }
                    });
                    break;
                case 'detail': //商品详情
                    api.openWin({
                        reload: true, //win里面的frame不会重新加载！！！！
                        name: 'goodsDetails',
                        url: 'widget://html/win/goodsdetail.html',
                        pageParam: {
                            sign: param.sign || '',
                            reload: true //用于使win里面的frame重新加载！
                        }
                    });
                    break;
                case 'buygroup': //邀请拼团
                    api.openWin({
                        name: 'buyGroup',
                        url: 'widget://html/plate/buygroup.html',
                        reload: true
                    });
                    break;
                case 'showorder': //晒单详情（暂时未用）
                    api.openWin({
                        name: 'showorder',
                        url: 'widget://html/win/showorder.html',
                        reload: true
                    });
                    break;
                case 'goodsplate': //晒单详情（暂时未用）
                    api.openWin({
                        name: 'goodsplate',
                        url: 'widget://html/plate/goodsplate.html',
                        reload: true
                    });
                    break;
                default:
                    break;
            }
        }
    };
    window.$common = u;
})(window)
