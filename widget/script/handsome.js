(function(){
	var u = {};

	var appSignNum =35;


//    var host = 'http://test.ujuec.com/';
//    var standbyhost = 'http://test.ujuec.com/';

      var host = 'https://app.ujuec.com/';//主域名(网络请求用)
	  var standbyhost = 'https://tae.ujuec.com/';

	  var shareHost = 'https://app.ujuec.com/'; //分享用的域名(现由服务返回 未用)
	var defaultRequest = {
	    	url:host+'api/index.php',
	    	// time:parseInt(new Date().getTime()/1000),
	    	time:parseInt(new Date().getTime()),
	    	version:11,
		    sign:'2.1',
		    apiver:4//ApiVer默认为1
		// api.setPrefs({key:'cookie',value:cookie});
		// cookie:
    	};
	// u.app_name = '省钱有道';
	    u.getver = function(){return defaultRequest.version;};
    	u.gethost =function(){ return host;};
    	u.getShareHost =function(){ return shareHost;};
    	u.outwin = function(title,action){
    	//action：获取的说明(1：帮助中心，2：积分规则，3：红包规则)

    		u.request('0x0036',{returnAll:true,data:{values:{action : action}}},function(ret,err){
                if(ret.body&&!ret.body.isError){
                  if((ret.body.result.setting == 1||ret.body.result.setting == 2)&&ret.body.result.content ){
                  //返回数据说明ret.body.result.content 为1：url  2：html文本内容
                      api.openWin({
                        name: 'outwin',
                        url: 'widget://html/win_out.html',/*file:///android_asset/widget/html/win_out.html*/
                        pageParam: {
                            title: ''+title,
                            content:''+ret.body.result.content,
                            type:ret.body.result.setting
                        }
                      });
                  }else{ u.toast('暂时还没有该内容哦');}
                }else{
                    u.toast('访问服务器失败，请稍后重试');
                }
            },'get');

    	};
	u.toast = function(msg){
		function toast(msgs){
		        api.toast({
		            msg: ''+msg,
		            duration: 2000,
		            location: 'bottom'
		        });
		}
	};
	u.progress = function(str1,str2){
		var title = str1 == undefined ? '加载中...' : str1;
		var text = str2 == undefined ? '' : str2;
                	api.showProgress({
	                    style: 'default',
	                    animationType: 'fade',
	                    title: title,
	                    text: text,
	                    modal: true
                	});
                	hasProgress = true;//hasProgress具体页面需要定义的var
            };

            u.hideProgress = function(){
                 	api.hideProgress();
                 	hasProgress = false;//hasProgress具体页面需要定义的var
            };
	u.sendLog = function(msg){
		api.sendEvent({
		    name: 'log',
		    extra: {
		        msg: msg,
		    }
		});
	};
	    function response(json,callback){
	       api.ajax(json,function(ret,err){

                         var backall = json&&json.returnAll ? json.returnAll==true : false;
//                       if ((ret&&backall&&ret.body)||(ret&&!backall)) {
                         if(ret){
                            if (backall) {

                                if( ret.headers['ustatus'] =='0'&&json.headers['Func'] != '0x0034' &&json.headers['Func'] != '0x0029'
                                &&json.headers['Func'] != '0x0004' &&json.headers['Func'] != '0x0001' && json.headers['Func'] != '0x0002'
                                &&json.headers['Func'] != '0x0019'&&json.headers['Func'] != '0x0005'&&json.headers['Func'] != '0x0003'&&json.headers['Func'] != '0x0036'){
//                                              api.setPrefs({key:'isLogin',value:'false'});//是否登录
                                                u.exit();
                                       }else if (ret.body.isError && ret.body.errorCode == '11012') {
                                                u.exit();
                                       }
                                        callback(ret,err);
                            }else{
                                if (ret.isError &&ret.errorCode == '11012') {
                                       u.exit();
                                }
                                callback(ret,err);
                            }
                        }else if(err){
                            console.log('网络错误err---------'+JSON.stringify(err));
                //请求服务器失败err不为空  更换域名重新请求一次
                            if(json.url != standbyhost+'api/index.php'){
                                json.url = standbyhost+'api/index.php';
                                api.setPrefs({
                                    key: 'current_hosturl',
                                    value: json.url
                                });
                                console.log('启用standbyhost');
                                response(json,callback);
                            }else{
                                callback(ret,err);
                            }
                       }else{
                            callback(ret,err);
                       }
            });
	    }
    	u.request =function(){
		var systemType = api.systemType;
    		var argsToJson = parseArguments.apply(null, arguments);
    		var json = argsToJson.data;
    		var fnSuc = argsToJson.callback;
//  		if (api.appVersion) {
//  			json['headers']['Ver'] = api.appVersion;
//  		}
    		if (systemType == 'ios') {
    			json['headers']['Sign'] = '1.'+appSignNum;
    			json.url= host+'api/index.php';
    		}else{
    			json['headers']['Sign'] = '2.'+appSignNum;
    			json.url = host+'api/index.php';
    		}
    		if(u.judgeNetwork()){
    			//11012 :cookie过期，11001:非法指令
    			api.getPrefs({
                    key: 'current_hosturl'
                }, function(ret, err) {
                    if(ret.value){
                        json.url = ret.value;
                    }
                    response(json,fnSuc);
                });
//	        		response(json,fnSuc);
//	        		api.ajax(json,function(ret,err){
//                      if(ret.headers){console.log(JSON.stringify(ret.headers));}
//	        			// if (!ret) {
//	        			// 	// u.toast('链接服务器失败，请检查网络状况！');
//	        			// }else
//	        			 if (ret) {
//	        				if (json&&json.returnAll && json.returnAll ==true) {
//
//                              if( ret.headers['ustatus'] =='0'&&json.headers['Func'] != '0x0034' &&json.headers['Func'] != '0x0029'
//                              &&json.headers['Func'] != '0x0004' &&json.headers['Func'] != '0x0001' && json.headers['Func'] != '0x0002'
//                              &&json.headers['Func'] != '0x0019'&&json.headers['Func'] != '0x0005'&&json.headers['Func'] != '0x0003'&&json.headers['Func'] != '0x0036'){
////		                                    	api.setPrefs({key:'isLogin',value:'false'});//是否登录
//		                                    	u.exit();
//		                               }else if (ret.body.isError && ret.body.errorCode == '11012') {
//                                              u.exit();
//			        				   }
//			        					fnSuc(ret,err);
//	        				}else{
//	        					if (ret.isError &&ret.errorCode == '11012') {
//	        					       u.exit();
//	        					}
//	        					fnSuc(ret,err);
//	        				}
//	        			}else{
//	        	//请求服务器失败 更换域名重新
//	        			    fnSuc(ret,err);
//	        		    }
//	        		});
	        	}else{
	        	api.hideProgress();
	        	}
    	};

    	function parseArguments(order,json,fnSuc,method){
    		//  注意：默认方法为post
    		// var tag ='';
    		// var cache = false;
    		// var timeout = 30;
    		// var report = false;
    		// var returnAll = false;
    		// var certificate = {};//安全证书{path:'',    //p12证书路径，支持fs://、widget://、cache://等文件路径协议，字符串类型password:''    //证书密码，字符串类型}
    		// var values = {};

    		var data = null;
    		var cookie = null;
    		api.getPrefs({key: 'cookie'}, function(ret, err) {if (ret) {cookie = ret.value; } else {}});

	    	if (typeof(json) == 'function') {
	    		method = fnSuc;
		             fnSuc = json;
		             json = undefined;
	        	}
	        	if(method==undefined){
	        		method = 'post';
	        	}
//方法版本的管理--注意：云修复的时候可能需要改！！！
		      var funcver = 1;
		      switch (order){
		          case '0x002B':
		              funcver = 2;
		          break;
		          case '0x003A':
                      funcver = 3;
                  break;
                  case '0x0028':
                      funcver = 2;
                  break;
                  default:
                    funcver = 1;
                  break;
		      }
// typeof 返回值有六种可能： "number," "string," "boolean," "object," "function," 和 "undefined."
	        	if ((json !=undefined )&& (typeof(json) != 'function')) {
		        	data = json;
		        	if (json.url == undefined ) {data.url = defaultRequest.url;}
		        	if (json.headers == undefined) {
		        		data.headers = {
				           Func:order,
					Timestamp: defaultRequest.time,
					Ver:defaultRequest.version,
					Apiver:defaultRequest.apiver,
					Sign:defaultRequest.sign,
					Funcver:funcver
		            	};
		           }
		        	if (json.method == undefined ) {data.method = method;}
		        	if (json.dataType == undefined ) {data.dataType = 'json';}


	        	}else if (cookie){
	        		data = {
		            	url: defaultRequest.url,
		            	dataType: 'json',
			           method:method,
			           headers:{
				           Func:order,
					Timestamp: defaultRequest.time,
					Ver:defaultRequest.version,
					Sign:defaultRequest.sign,
					Apiver:defaultRequest.apiver,
					Funcver:funcver,
					cookie:cookie
		            	}
	        		};
	        	}else{
	        		data = {
		            	url: defaultRequest.url,
		            	dataType: 'json',
			           method:method,
			           headers:{
				           Func:order,
					Timestamp: defaultRequest.time,
					Ver:defaultRequest.version,
					Sign:defaultRequest.sign,
					Apiver:defaultRequest.apiver,
					Funcver:funcver
					// cookie:''
		            	}
	        		};
	        	}

	        	return {data:data,callback:fnSuc};
	}
	/*获取index加载时保存到本地的初始化数据中的 淘客参数：pid*/
	u.getPid = function(){
		var index =$api.getStorage('index');
		var pid = null;
		if (index.setting) {

			if (api.systemType == 'ios' && index.setting['ai_tbiospid']) {
				pid =index.setting['ai_tbiospid'];
			}else if (index.setting['ai_tbandroidpid']) {
				pid =index.setting['ai_tbandroidpid'];
			}
		}
		return pid;
	};
	/*
		分享成功后更新服务器 并 设置本地数据
		type:分享的类型
		ret:分享成功的回调
	*/
	u.shareCallback = function(type,ret){//是否要判断登录状态？？？
		if (!ret) {}
		else if (ret.status == true) {//分享成功
			u.request('0x0030',{returnAll:true,data:{values:{type : type}}},function(ok,err){
				if(! ok){}
				else if (ok.headers['ustatus']  == '0') {// 未登录 没有奖励
					u.toast('登录后分享有惊喜哦！');
					return;
				}else if (!ok.body.isError && ok.body.result) {
					var index =$api.getStorage('index');
					switch(ok.body.result.ai_rebatemodel){
						case index.result.setting['ai_rebatemodel'] :
						index.result.setting['ai_rebaterate'] = index.result.setting['ai_rebaterate']+ok.body.result['ai_rebaterate'];
						break;
					}
					$api.setStorage('index', index);
				}else{
					u.toast('抱歉！此次分享未能获取到奖励');
				}
			});
		}
	};

	/*说明：打开阿里百川各个页面
	参数：
		name：字符串，需要打开的页面名称（请参照方法内名称）
		param：JSONobject，根据打开页面所需传递参数，如：{ isvcode：'test'}
		callback: 回调函数，一般格式callback(ret,err){}
	回调参数返回参数说明：
		ret: {
			status : true,    返回的请求状态，成功为true
			code : 1,         请求页面返回的结果类型区分，1为参数判定，2为调用的函数返回（int）
			data : {...},	根据页面返回的数据（根据各个页面不同，有的有，有的没有）
			message : '' 	请求结果简单描述
		}
		err{
			code : 100,         请求页面返回的错误代号 1为参数判定，其他为函数返回code（int）
			message : ''        请求结果简单描述
		}*/

	u.aliPage = function(moduletaobao,name,param,callback){

		// var moduletaobao = api.require("taobao");
		switch(name){
			/*
			说明：初始化阿里百川SDK,Android本地已经初始化，一般情况下不用再次调用
			参数： {
				isvcode：自定义ISVCode,用于服务器订单跟踪。(如果服务器不做处理，可以随便传)
			}
			*/
			case 'initTaeSDK':
			// api.accessNative({name: 'initTaeSDK',extra: param},callback);
			moduletaobao.initALSDK(param,callback);
			break;

			/*
			说明：打开手淘授权登陆
			参数： 无
			返回数据（data） ：
				data：{                                   参数类型
					userNick : '',
					avatarUrl :'',
					authCode : '',
					loginTime :,      	Long
					otherInfo : ,   		Map<String, Object>
					userId : '',
					isLogin : ,		Boolean
				}
			*/
			case 'openFeedBackPage':
			moduletaobao.feedback(param,callback);
			// api.sendEvent({
			//     name: 'feedBack'
			// });
			break;

			case 'login':
			moduletaobao.showLogin(param,callback);
			// api.accessNative({name: 'showLogin',extra: param},callback);
			break;

			/*退出授权登录
			参数：无*/
			case 'logout':
			moduletaobao.logout(param,callback);
			// api.accessNative({name: 'logout',extra: param},callback);
			break;
			/*
			说明：唤起淘客商品详情(真实id/混淆id)
			参数： {
				isvcode：‘’     自定义ISVCode,用于服务器订单跟踪。(如果服务器不做处理，可以随便传)
				itemId : ''     	真实id/混淆id
				pid : ''		淘客的pid
			}
			*/
			case 'taokeItemById':
			if (u.getPid()) {param.pid = u.getPid();}
			moduletaobao.showItem(param,callback);

			break;

			case 'getUserInfo':
			moduletaobao.getUserInfo(param,callback);
			// api.accessNative({name: 'getUserInfo',extra: param},callback);
			break;

			case 'myCart':
			if (u.getPid()) {param.pid = u.getPid();}
			moduletaobao.showItemFull(param,callback);
			// api.accessNative({name: 'openMyCart',extra: param},callback);
			break;

			/*
			说明：添加淘客商品到购物车
			参数： {
				isvcode：‘’      (可选项)自定义ISVCode,用于服务器订单跟踪。(如果服务器不做处理，可以随便传)
				openId : ''     	商品的openId
				unionId : ''	淘客的unionId
				pid : ''		淘客的mmpid
			}
			*/
			case 'addTaoKeItem2Cart':
			if (u.getPid()) {param.pid = u.getPid();}
			moduletaobao.addTaoKeItem2Cart(param,callback);
			// api.accessNative({name: 'addTaoKeItem2Cart',extra: param},callback);
			break;
			/*
			说明： 打开订单页面
			参数： {
				isvcode：‘’      (可选项)自定义ISVCode,用于服务器订单跟踪。(如果服务器不做处理，可以随便传)
				status : 0 , 	(int)  默认跳转页面；填写：0：全部；1：待付款；2：待发货；3：待收货；4：待评价。若传入的不是这几个数字，则跳转到“全部”页面且“allOrder”失效
				allOrder : true/false,	 (boolean) 是否显示全部订单。

			}
			*/
			case 'myOrdersPage':
			if (u.getPid()) {param.pid = u.getPid();}
			moduletaobao.showItemFull(param,callback);

			break;
			//通过加载 webview 的方式打开Alipage
			case 'showAliWebPage':
			if (u.getPid()) {param.pid = u.getPid();}
			moduletaobao.showItem(param,callback);

			break;
			default:
			var err = {msg:'传入的page页面没找到'};
			// var ret;
			callback(null,err);
			break;
		}
	};

	u.isPush = function(isPush){
		if (typeof(isPush) != 'boolean') { return;}
		var ajpush = api.require('ajpush');
		ajpush.isPushStopped(function(ret) {

			if(ret && ret.isStopped ==1){
				if (isPush) {
					ajpush.resumePush(function(ret2) {

					    if(ret2 && ret2.status==1){
					        //success
					    	u.toast('开启了推送');
					    }
					});
				}else{ return;}
			}else if (ret && !isPush) {
					ajpush.stopPush(function(ret3) {

					    if(ret3 && ret3.status==1){
					    	u.toast('关闭了推送');
					    }
					});

			}else{ u.toast('推送服务错误，请稍后重试');}
		});
	};

	u.shareToQq = function(type,params,callback){
		var qq = api.require("qq");
		switch(type){
			case 'text'://params   text:要分享的文本,android中不支持回调！
			qq.shareText(params);
			break;
			//分享图片（本地）到好友
			case 'image'://params   title:图片的标题  description: 描述 imgPath:本地路径（widget://、fs:://）
			qq.shareImage(params,callback);
			break;
			//分享新闻到空间/好友
			case 'news'://params   url：新闻链接  title:新闻的标题  description: 描述 imgUrl:要分享的新闻缩略图的url（网络/本地资源图片），
			//若 type 为 QZone 则本参数在 Android 上仅支持网络图片   type：分享内容到好友或空间，取值范围：QZone(默认)、QFriend
			qq.shareNews(params,callback);
			break;

			case 'music':
			qq.shareMusic(params,callback);
			break;

			case 'video':
			qq.shareVideo(params,callback);
			break;

			default:
			var err = { msg: '分享类型type未找到'};
			callback(null,err);
			break;
		}
	};


	u.shareToWx = function(type,params,callback){
		var wx = api.require("wx");
		switch(type){
			case 'text':
			wx.shareText(params,callback);
			break;

			case 'image':
			wx.shareImage(params,callback);
			break;

			case 'webpage':
			wx.shareWebpage(params,callback);
			break;

			case 'music':
			wx.shareMusic(params,callback);
			break;

			case 'video':
			wx.shareVideo(params,callback);
			break;

			case 'mutableImg'://分享多张图片到朋友圈，暂仅支持 Android 平台。注意：由于不是使用的官方sdk进行的分享，而是直接调用的微信客户端的分享界面，分享后无法回到原应用，且微信端不会给出是否分享成功的反馈，所以本接口暂无回调
			wx.shareMutableImg(params);
			break;

			default:
			var err = { msg: '分享类型type未找到'};
			callback(null,err);
			break;
		}
	};


	/*handsome点击效果渲染*/
	u.vrayClick = function(el,startColor,endColor){
	        if(!$api.isElement(el)){
	            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
	            return;
	        }
	        el.style.background=endColor;
	         var t=null;
	         t = setTimeout(time,50);
	         function time(){
	                 window.clearTimeout(t);//去掉定时器
	                 el.style.background=startColor;
	          }
	return el;
	};

	/*handsome点击效果渲染*/
	u.vrayTextClick = function(el,startColor,endColor){
	        if(!$api.isElement(el)){
	            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
	            return;
	        }
	        el.style.color=endColor;
	         var t=null;
	         t = setTimeout(time,50);
	         function time(){
	                 window.clearTimeout(t);//去掉定时器
	                 el.style.color=startColor;
	          }
	return el;
	};


	u.reverse = function(str){
		return str.split('').reverse().join('');
	};



	u.saveUserInfor = function(name,body){

		switch(name){
			case 'mine' :
			// var content = $api.strToJson(body);
			var result =  body['result']['uinfo'];//$api.strToJson(content.result);
			$api.rmStorage('localUserInfor');
			$api.setStorage('localUserInfor',result);
			$api.setPrefs('localUserInfor',result);
			// var moneywithdrawing = result.tb_moneywithdrawing;
			// var alipay = result.tb_ualipay;//支付宝账号
			// var signday = result.tb_signday;
			// var avatar = result.tb_uavatar;//头像
			// var lastshareordertime = result.tb_lastshareordertime;
			// var lastsigntime = result.tb_lastsigntime;
			// var withdrawdeposit = result.tb_withdrawdeposit;
			// var money = result.tb_money;
			// var inviteid = result.tb_inviteid;
			// var alipayname = result.tb_ualipayname;//支付宝昵称
			// var totalmoney = result.tb_totalmoney;
			// var ordermoney = result.tb_ordermoney;
			// var jifen = result.tb_jifen;//积分
			// var uname = result.tb_uname;//昵称
			// var itemnum = result.tb_itemnum;
			// var jifenbaounsettled = result.tb_jifenbaounsettled;
			// var level = result.tb_level;
			// var msgnum = result.tb_umsgnum;
			// var jifenbao = result.tb_jifenbao;
			// var ordertotal = result.tb_ordertotal;
			// var moneyunsettled = result.tb_moneyunsettled;
			// var code = result.tb_code;
			// var jifenbaowithdrawing = result.tb_jifenbaowithdrawing;
			// var paid = result.tb_paid;
			// var npaid = result.tb_unpaid;
			// var id = result.tb_uid;
			// var phone = result.tb_uphone;//电话
			// var lastcommenttime = result.tb_lastcommenttime;

			break;
			case 'get':
			var result =  body['result'];//$api.strToJson(content.result);
			$api.rmStorage('localUserInfor');
			$api.setStorage('localUserInfor',result);
			$api.setPrefs('localUserInfor',result);
			break;
		}
	};

	//授权淘宝   没有用了！！！！
    	u.auth_taobao=function(ali,callback){
    		if (u.judgeNetwork()) {
    			// var ali = api.require("taobao");
	        		var back = ali.showLogin(function(ret,err){
		                if(ret.status&&ret){
		                    api.setPrefs({
				 key: 'tbUserId',
				 value: ret.data.userId
				});
		                    callback(ret.data);
		                }else{
		                	callback(null,err);
			             u.toast('淘宝授权失败');
			             // alert({msg:JSON.stringify(err)});
		           		}
	         		});
    		}

	};

	//使用淘宝登录
    	u.login_taobao=function(callback){
    		if (u.judgeNetwork()) {
    			var moduletaobao = api.require("taobao");
	        		moduletaobao.showLogin(
	            	function(ret,err){
		                if(ret.status){
		                    var code = 'tb';
		                    var nick = ret.data.userNick;
		                    var icon = ret.data.avatarUrl;
		                    var openid = ret.data.userId;
		                    // u.saveUserInfor(’tb‘,ret.data);//保存用户信息
		                    u.upInfor(code,openid,nick,icon,callback);
		                }else{
		                     u.toast('淘宝登录失败');
		                }
	         		});
    		}
	};

	// 第三方登录成功后调用接口上传数据到后台  code：tb wx qq

    	u.upInfor = function(code,openid,nick,icon,callback){
	        // u.toast('用户信息:'+code+'  '+nick+'  '+openid+'  '+icon);
	        var timestamp = new Date().getTime();
	        api.ajax({
	           url: 'http://app.51tuila.com/api/index.php',
	           method: 'post',

	           headers:{
	              Func: '0x0019',
	              TimeStamp: ''+timestamp,
	              Ver: '1.0',
	              Sign: '2.1'
	           },
	           data: {
	               values: {
	                code: code ,
	                openid: openid,
	                uname: nick,
	                uavatar: icon
	                }
	            }
	      },function(ret,err){
	      	if (!ret.isError) {
	      		//获取当前用户的最新信息 并且保存到  api.setPrefs({key:'cookie',value:cookie});和$api.setStorage('localUserInfor',result);
	      		u.toast('登录成功');
	      		api.ajax({
		                   url: 'http://app.51tuila.com/api/index.php',
		                   method: 'get',
		                    returnAll : true,
		                   headers:{
		                      Func: '0x0006',
		                      TimeStamp: ''+timestamp,
		                      Ver: '1.0',
		                      Sign: '2.1'
		                   },
		              },function(ret,err){
		                     if (!ret.isError) {
		                        var cookie = ret.headers['Set-Cookie'];
		                        api.setPrefs({key:'cookie',value:cookie});
		                        u.saveUserInfor('mine',ret.body);//保存用户信息
		                        //回调函数
		                        callback(ret);
		                     }else{
		                     	u.toast('用户信息获取失败');
		                     }
		            });
	      	}else{
	      		u.toast('登录失败');
	      	}
	      });
	} ;
//手机toast
	u.toast = function(msg){

		api.toast({
		      	msg: msg,
		      	duration: 2000,
		      	location: 'bottom'
		});
	};
//重新登录某个页面，或者刷新页面
	u.reload = function(pageName,pageUrl,pageParam){
		api.openWin({
	                    name: pageName,
	                    url: pageUrl,
	                    reload: true,
	                    pageParam: pagetParam
	             });
	};

	u.judgeNetwork = function(){
		var connectionType = api.connectionType;  //比如： wifi
		if ('none' == connectionType) {
			u.toast('请检查网络连接!');
			return false;
		}else {
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

	u.getSubNum = function(num){
		if (typeof(num) == 'string') {
			var l = num.length;
			var a= num.substring(0,3);
			var b =num.substring((l-2));
			return (a+'****'+b);
		}else{
			return undefined;
		}
	};

	u.getSubName = function(name){
		if (typeof(name) == 'string') {
			var l = name.length;
			if (l>6) {
				var a= name.substring(0,2);
				var b =name.substring((l-2));
				return (a+'**'+b);
			}else{
				return name;
			}
		}else{
			return undefined;
		}
	};

	u.mdPassword = function(hex_md5,pw,phone,timestamp){
	        	var time =u.reverse(timestamp+'');
	        	var password = hex_md5((hex_md5(hex_md5(pw)+'_'+phone))+'_'+time);
	        	// console.log('js里面time:'+time+',password：'+hex_md5(pw)+',phone：'+hex_md5(hex_md5(pw)+'_'+phone)+',pw：'+password);
	        	return password;
	};


	u.getSmsCode = function(scode,phone,tag){

		u.request('0x0003',{data:{values:{ scode: scode,phone: ''+phone}}},function(ret,err){
	                        if (ret.isError) {
	                        	$api.removeCls(tag, 'active');
	                            	if ((ret.errorMessage).indexOf('isv.BUSINESS_LIMIT_CONTROL') > -1) {
	                            		u.toast('你操作太频繁了，请1分钟后再试');
	                            	}else{
	                            		u.toast(ret.errorMessage);
	                            	}
	                        } else if (ret){

	                            	u.toast('验证码已经发送，请注意查收');
	                            	for(i=1;i<=60;i++) {
            				window.setTimeout('update_p('+i+')', i * 1000);
        				}
	                        }
	            },'post');
	};


	u.processCallback = function(ali,bsign,ret,err,addcarPa){
		if((ret.status || ret.result)&& ret.orderid ){
			//获取当前授权淘宝的用户信息
	                	u.aliPage(ali,'getUserInfo',{},function(ok,ng){

		                	if (ok && ok.status &&ok.data.userId) {
				//支付成功的调用接口
				// bsign:bsign,  购物车没有
							if(api.systemType =='android'){ ret.orderid = ret.orderid.split(',');}
		                		u.request('0x002A',{data:{values:{orderid:ret.orderid, buyerid:ok.data.userId,bsign:bsign}}},function(ok1,ng1){});
		                	}else{
		                	}
		            });

		}else if (ret&&!ret.status &&!ret.result){
			//获取当前授权淘宝的用户信息
//			u.aliPage(ali,'getUserInfo',{},function(ok,ng){
//
//		                	if (ok && ok.status &&ok.data.userId) {
//				//支付失败的调用接口
//				// bsign:bsign,购物车没有
//		                	u.request('0x002B',{data:{values:{code:ret.code,msg:ret.message,buyerid:ok.data.userId,bsign:bsign}}},function(ok1,ng1){});
//		                	}else{
//		                	}
//		    });
		}else if((ret.status || ret.result)&& !ret.orderid&&ret.message =='加购成功'){
                           //成功加入购物车后上传加购的浏览记录
                  addcarPa&&(addcarPa.iscart = 1);
                  u.isLogin(function(back){
                        if(back.value){
                                if(addcarPa){u.request('0x0028',{data:{values:addcarPa}},function(ret,err){});}
                        }
                   });
        }
	};

	u.carAgr = function(ali,pid,buyerid){
//	       ali.showItemFull({name:'cart',pid:pid},function(ret,err){
//               u.processCallback(ali,'',ret,err);
//        });
//      解析获取购物车内加购信息 并且上传记录到服务器
	           if(api.systemType == 'ios'){
                          api.openWin({
                              name: 'cart',
                              url:  'widget://html/showItem/cartwin.html',
                              pageParam: {
                                  pid:pid,
                                  buyerid:buyerid
                              },
                                  reload:true
                              });
                }else{

//				ali.addEventListener(
//							{
//									name:'backDetails',
//									once:false,
//									javaScript:'javascript:{'+
//									'var title = [];var id=[];'+
//									'var a= document.querySelectorAll(\'div.item-info > a\');'+
//									'if(a){for(var i = 0; i< a.length;i++){id[i]=a[i].getAttribute(\'href\');title[i]=a[i].getElementsByClassName(\'title\')[0].textContent;}window.content.backGoodsDetails(id,title);}}'
//							},function(ret,err){
//
//							             if(ret.added){
//
//							                     ali.showItemPage({name:'cart',pid:pid,onBackPress:true},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
//							             }else if(ret.status&&ret.itemId&&ret.goodsTitle){
//					//				 "//a.m.taobao.com/i44944082913.htm"----普通的加够商品
//					//				"//page.m.tmall.com/chaoshi/detail?id=520001260865"----天猫超市的加够商品
//											ret.itemId = ret.itemId.replace(/((\/\/a\.m\.taobao\.com\/[a-z]|\.htm)|(\/\/page\.m\.tmall\.com\/chaoshi\/detail)|(\?|id=))/g,'');
//											ret.itemId = ret.itemId.split('\,');
//											ret.goodsTitle = ret.goodsTitle.split('__');
//											 console.log(JSON.stringify(ret));
//											u.request('0x0035',{data:{values:{iids:ret.itemId,titles:ret.goodsTitle}}},function(ok,ng){
//  											if(ok&&!ok.isError){}
//  											else{
//											       ali.closeItemPage({removeAllLis:true},function(ret){if(ret.status){u.toast('购物车更新失败，请稍后重试');}});
//  											}
//											});
//										}else{
//										      u.toast('更新信息失败，请重新打开购物车！');
//										}
//				});


//				var orderjscode = 'javascript:{'+
//                                  'function go(){'+
//                     'var title = [];var id=[];'+
//                     'var a= document.querySelectorAll(\'ul.order-list > li\');'+
//                     'if(a){for(var i = 0; i< a.length;i++){id[i]=a[i].getElementsByClassName(\'module\')[0].className.replace(\/\\D\/g,\'\').substring(0,16);'
//                     +'title[i]=a[i].getElementsByClassName(\'item-info\')[0].getElementsByClassName(\'title\')[0].textContent;}'
//                     +'window.content.backGoodsDetails(id,title);}}go();}';
//var cartjs = 'javascript:{'+
//                'var title = [];var id=[];'+
//                'var a= document.querySelectorAll(\'div.item-info > a\');'+
//                'if(a){for(var i = 0; i< a.length;i++){id[i]=a[i].getAttribute(\'href\');title[i]=a[i].getElementsByClassName(\'title\')[0].textContent;}window.content.backGoodsDetails(id,title);}}';
                 var orderjscode ='javascript:{'+
                                    'function go(){'+
                       'var title = [];var id=[];'+
                       'var a= document.querySelectorAll(\'ul.order-list > li\');'+
                       'if(a){for(var i = 0,j=0; i< a.length;i++){id[j]=a[i].getElementsByClassName(\'module\')[0].className.replace(\/\\D\/g,\'\');id[j] = id[j].substring(0,id[j].length-((i+1)+\'\').length);'
                       +'var alltitle = a[i].querySelectorAll(\'.item-info > .title\');var idj = id[j];'
                       +'for(var n =0 ;n<alltitle.length;n++){if(n>0 && alltitle[n].textContent.substring(0,4) ==\'保险服务\'){}else{title[j]=alltitle[n].textContent;id[j] = idj;j++;}}}'
                       +'window.content.backGoodsDetails(id,title);}}go();}';
				ali.addEventListener(
                            {
                                    name:'backDetails',
                                    once:false,
                                    justHome:false,
                                    judgeUrl:'https://h5.m.taobao.com/mlapp/olist.html?tabCode=waitPay',
                                    judgeTitle:'订单管理',
                                    delayEvaluating:1,
                                    javaScript:orderjscode
                            },function(ret,err){
//            ali.addEventListener(
//                          {
//                                  name:'backDetails',
//                                  once:false,
//                                  justHome:false,
//                                  judgeUrl:'https://h5.m.taobao.com/mlapp/olist.html?tabCode=waitPay',
//                                  judgeTitle:'订单管理',
//                                  delayEvaluating:1,
//                                  javaScript:orderjscode,
//                                  homeJs:cartjs
//                          },function(ret,err){
                                        if(ret.added){
   ali.showItemPage({name:'cart',pid:pid,onBackPress:true},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
                                         }else if(ret.status&&ret.goodsTitle&&ret.goodsTitle.length){
                                                  u.parseOderRet(ret,'');
                                         }
                });
//              ali.showItemPage({name:'cart',pid:pid,onBackPress:true},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
		}
	};
    u.orderAgr = function(ali,pid,buyerid){
    if(api.systemType =='ios'){
        api.openWin({
                              name: 'order',
                              url:  'widget://html/showItem/cartwin.html',
                              pageParam: {
                                  pid:pid,
                                  buyerid:buyerid,
                                  title:'订单管理',
                                  pagename:'order'
                              },
                                  reload:true
         });
      }else{
      //Android 模块可以在js中执行延时 但是ios会卡死 setTimeout(\'go()\',\'1000\');
        var ver = parseFloat(api.systemVersion);
//      if(api.systemType == 'android'&&ver<4.2){
//         ali.showItemPage({name:'order',pid:pid,onBackPress:true},function(ret,err){u.buyCallback(buyerid,'',ret,err); });
//       } else{
            //注意javascript 要小写 否则在android4.4以下的机型上 会识别不了！！
                var jstext ='javascript:{'+
                                    'function go(){'+
                       'var title = [];var id=[];'+
                       'var a= document.querySelectorAll(\'ul.order-list > li\');'+
                       'if(a){for(var i = 0,j=0; i< a.length;i++){id[j]=a[i].getElementsByClassName(\'module\')[0].className.replace(\/\\D\/g,\'\');id[j] = id[j].substring(0,id[j].length-((i+1)+\'\').length);'
                       +'var alltitle = a[i].querySelectorAll(\'.item-info > .title\');var idj = id[j];'
                       +'for(var n =0 ;n<alltitle.length;n++){if(n>0 && alltitle[n].textContent.substring(0,4) ==\'保险服务\'){}else{title[j]=alltitle[n].textContent;id[j] = idj;j++;}}}'
                       +'window.content.backGoodsDetails(id,title);}}go();}';
                ali.addEventListener(
                            {
                                    name:'backDetails',
                                    once:false,
                                    delayEvaluating:1,
                                    javaScript:jstext
//                                  javaScript:'javascript:{'+
//                                  'function go(){'+
//                     'var title = [];var id=[];'+
//                     'var a= document.querySelectorAll(\'ul.order-list > li\');'+
//                     'if(a){for(var i = 0; i< a.length;i++){id[i]=a[i].getElementsByClassName(\'module\')[0].className.replace(\/\\D\/g,\'\').substring(0,16);'
//                     +'title[i]=a[i].getElementsByClassName(\'item-info\')[0].getElementsByClassName(\'title\')[0].textContent;}'
//                     +'window.content.backGoodsDetails(id,title);}}go();}'
                            },function(ret,err){
                                         if(ret.added){

                                                 ali.showItemPage({name:'order',pid:pid,onBackPress:true},function(ret,err){

                                                      u.buyCallback(buyerid,'',ret,err);
                                                });
                                         }else if(ret.status&&ret.goodsTitle&&ret.goodsTitle.length){
                                         console.log(JSON.stringify(ret));
                                                  ret.itemId = ret.itemId.split('\,');
                                                  ret.goodsTitle = ret.goodsTitle.split('__');
                                                  var trade = [];
                                                  for(var i =0;i<ret.itemId.length;i++){
                                                        var item ={};
                                                        item.orderid = ret.itemId[i];
                                                        item.title = ret.goodsTitle[i];
                                                        trade.push(item);
                                                  }
                                                  console.log(JSON.stringify(trade));
                                                  u.request('0x002F',{data:{values:{trade:trade}}},function(ok,ng){
                                                           console.log(JSON.stringify(ok));
                                                           if(ok&&ok.isError==false){
                                                            u.toast('找回订单完成，请返回确认');
                                                           }else{
                                                             u.toast('找回订单失败，请稍后重试！');
                                                           }
                                                  });
                                         }else if(!ret.added){
                                                u.toast('找回订单失败，请稍后重试！');
                                         }
                });
//           }
      }
    };
	//打开购物车 or 打开订单管理并解析获取订单信息
	u.openShopCar = function(page){
		u.isLogin(function(back){
					if(back.value){
									var ali = api.require("taobao");
									var pid =u.getPid() ? u.getPid() : '';
											u.aliPage(ali,'getUserInfo',{},function(ok,ng){

								                        if (ok && ok.status &&ok.data.isLogin){
								                                    (page &&page == 'order' )? u.orderAgr(ali,pid,ok.data.userId):u.carAgr(ali,pid,ok.data.userId);
								                        }else{
								                                    ali.showLogin(function(ret,err){
											                                    if(ret && ret.status &&ret.data.isLogin){
											                                    		       (page &&page == 'order' )? u.orderAgr(ali,pid,ok.data.userId):u.carAgr(ali,pid,ok.data.userId);
											                                    }else{
											                                    			u.toast('淘宝授权失败');
											                                    }
								                                    });
								                        }
							            		});
					}else{
										u.goLogin(1,true);
					}
		});
	};
	//通过js解析获取订单返回的ret处理函数 跟单使用
	u.parseOderRet = function(ret,bsign){
//	var judgeBeCar =  false;
	   ret.itemId = ret.itemId.split('\,');
       ret.goodsTitle = ret.goodsTitle.split('__');
       var trade = [];
       for(var i =0;i<ret.itemId.length;i++){
             var item ={};
//           (ret.itemId[i]+'').length<15 && (judgeBeCar = true);
             item.orderid = ret.itemId[i];
             item.title = ret.goodsTitle[i];
             trade.push(item);
       }
       u.request('0x002B',{data:{values:{bsign:bsign||'',trade:trade}}},function(ok,ng){
             if(ok&&!ok.isError){
//               u.toast('找回完成，请返回确认');
             }else{
                u.toast('未跟踪到订单，请尝试找回');
             }
        });
//      if(judgeBeCar){
//          for(var i =0;i<ret.itemId.length;i++){
//               trade[i].iid = ret.itemId[i];
//         }
//          judgeBeCar&&$handsome.request('0x0035',{data:{values:{items:trade}}},function(ok,ng){
//                if(ok&&!ok.isError){
//                                          console.log(JSON.stringify(ok));
//                }else{
//  //                              $handsome.toast('购物车更新失败，请稍后重试');
//  //                               api.closeWin();
//                 }
//            });
//       }
	};
	//打开商品/优惠券页面
	u.openItemWin = function(winName,bsign,param,pa,ali){

		if(api.systemType== 'ios' ){
					var url = '';
					if (winName == 'couponwin') {
						url = 'widget://html/showItem/couponwin.html';
					}else{
						url = 'widget://html/showItem/itemwin.html';
					}
					api.openWin({
						name: winName+'',
						url: url,
						pageParam: {
							bsign: bsign,
							param:param,
							pa:pa
						},
						reload:true
					});
		}else{
                         var twoandone = $api.getStorage('index').setting.ai_qactivity||'0';
                         var pid = '';
						 var pagename = 'item';
						if (param.pid && param.pid != '') {
								pid = param.pid;
						}else if (u.getPid()) {
								pid =u.getPid();
						}else{
								alert('请在后台设置淘客参数，否则将拿不到佣金哦');
						}
						if(param.name&& param.name != '' ){
								pagename= param.name;
						}

//  var orderjscode = 'javascript:{'+
//                                  'function go(){'+
//                     'var title = [];var id=[];'+
//                     'var a= document.querySelectorAll(\'ul.order-list > li\');'+
//                     'if(a){for(var i = 0; i< a.length;i++){id[i]=a[i].getElementsByClassName(\'module\')[0].className.replace(\/\\D\/g,\'\').substring(0,16);'
//                     +'title[i]=a[i].getElementsByClassName(\'item-info\')[0].getElementsByClassName(\'title\')[0].textContent;}'
//                     +'window.content.backGoodsDetails(id,title);}}go();}';
 var isShowRightShare = false;
 param.itemId&&param.itemId.substring(0,4)=='http'&& !pa.uland &&pa.itemtype !=5 &&(isShowRightShare = true);//uland为站外 优惠券 支持分享赚
 var orderjscode ='javascript:{'+
                                    'function go(){'+
                       'var title = [];var id=[];'+
                       'var a= document.querySelectorAll(\'ul.order-list > li\');'+
                       'if(a){for(var i = 0,j=0; i< a.length;i++){id[j]=a[i].getElementsByClassName(\'module\')[0].className.replace(\/\\D\/g,\'\');id[j] = id[j].substring(0,id[j].length-((i+1)+\'\').length);'
                       +'var alltitle = a[i].querySelectorAll(\'.item-info > .title\');var idj = id[j];'
                       +'for(var n =0 ;n<alltitle.length;n++){if(n>0 && alltitle[n].textContent.substring(0,4) ==\'保险服务\'){}else{title[j]=alltitle[n].textContent;id[j] = idj;j++;}}}'
                       +'window.content.backGoodsDetails(id,title);}}go();}';
   u.showShareDialog(function(sharestatus){
    if(twoandone =='1'){
    var removeAsClick = "javascript:{var share = window.document.getElementsByClassName('share-con')[0];if(share&&share.hasAttribute('mx-click')){share.removeAttribute('mx-click');share.addEventListener('click', function(){"
        +"var title = [];var id=[];id[0]='share';title[0]='share';window.content.backGoodsDetails(id,title);});}}";
    var removeAs = "javascript:window.document.getElementsByClassName('share-con')[0].remove();";

                           ali.addEventListener(
                            {
                                    name:'backDetails',
                                    once:false,
                                    justHome:false,
                                    judgeUrl:'https://h5.m.taobao.com/mlapp/olist.html?tabCode=waitPay',
                                    judgeTitle:'订单管理',
                                    delayEvaluating:1,
                                    javaScript:orderjscode,
                                    isShowRightShare:isShowRightShare,
                                    homeJs:removeAsClick
                            },function(ret,err){
                             console.log('backDetails:'+JSON.stringify(ret));
                                        if(ret.added){
ali.showItemPage({name:pagename,pid:pid,itemId:param.itemId,onBackPress:true},function(ret,err){u.processCallback(ali,bsign,ret,err,pa);});
                                         }else if(ret&&ret.itemId == 'share'){
                        //                      api.openWin({
                        //                          name: 'sharewin',
                        //                          url: 'widget://html/showItem/sharewin.html'
                        //                      });
                                                ali.showSharePage(function(ret,err){
                                                    console.log(JSON.stringify(ret));
                                                    u.share(ret.type,param.sharetitle,param.sharecontent,param.shareimg,pa.itemid,0);
                                                });

                                         }else if(ret.status&&ret.goodsTitle&&ret.goodsTitle.length&&ret.itemId != 'share'){
                                                  u.parseOderRet(ret,bsign);
                                         }
                            });
//                      }
//              });

    }else{
                    ali.addEventListener(
                            {
                                    name:'backDetails',
                                    once:false,
                                    justHome:false,
                                    judgeUrl:'https://h5.m.taobao.com/mlapp/olist.html?tabCode=waitPay',
                                    judgeTitle:'订单管理',
                                    delayEvaluating:1,
                                    javaScript:orderjscode
                            },function(ret,err){
                             console.log('backDetails:'+JSON.stringify(ret));
                                        if(ret.added){
 ali.showItemPage({name:pagename,pid:pid,itemId:param.itemId,onBackPress:true},function(ret,err){u.processCallback(ali,bsign,ret,err,pa);});
                                         }else if(ret.status&&ret.goodsTitle&&ret.goodsTitle.length){
                                                  u.parseOderRet(ret,bsign);
                                         }
                        });
    }
//  pa.itemid&&!pa.itemid.match(/\D/g)&&
//bsign:bsign||'' 为站外 优惠券 支持分享赚 所新增的
    param.itemId&&param.itemId.substring(0,4)=='http'&&sharestatus&&u.request('0x0040',{data:{values:{itemid: pa.itemid||'',bsign:bsign||''}}},function(ret,err){
                    console.log('shareDialog'+pa.itemid+'---'+JSON.stringify(ret));
                    if(ret && ret.isError == false &&ret.result.taokouling_info){
                         var tkl = ret.result.taokouling_info;
                         var price_type = ret.result.coupon_info.amount == 0 ? '抢购价':'券后价';
                         var buy_type = ret.result.coupon_info.amount == 0 ? '购买':'领券';
                         var downorderurl =ret.result.coupon_info.orderUrl ? '\n【下单链接】{选择分享渠道后自动生成链接}':'';

                         ali.addEventListener(
                                {
                                    name:'shareDialog',
//                                  goods_description:ret.result.desc||'',
//                                  good_details:ret.result.coupon_info.title+'\n'
//                                      +'[在售价] '+ret.result.coupon_info.price+'元\n'
//                                      +'[券后价] '+ret.result.coupon_info.discount_price+'元\n'
//                                      +'复制这条消息,'+ret.result.taokouling_info+',打开【手机淘宝】即可领券下单',
//                                  top_good_details:ret.result.coupon_info.title+'\n[在售价] '+ret.result.coupon_info.price+'元',
//                                  img_url:ret.result.coupon_info.img
                                    fanli:ret.result.coupon_info.fanli,
                                    goods_description:ret.result.desc||'当小伙伴复制你分享的淘口令进入手机淘宝，购买了该商品，你可以获得推广收益奖励！',
                                    good_details:ret.result.coupon_info.title
                                        +'\n【在售价】'+ret.result.coupon_info.price+'元'
                                        +'\n【'+price_type+'】'+ret.result.coupon_info.discount_price+'元'
                                        +downorderurl
                                        +'\n-----------------'
                                        +'\n复制这条信息,{¥选择分享渠道后自动生成淘口令¥},打开【手机淘宝】即可'+buy_type+'下单',
                                    img_url:ret.result.coupon_info.images.join(","),
                                    orderUrl:ret.result.coupon_info.orderUrl,
                                    tkl:tkl,
//                                  showActivityDialog:false,//默认为true
//                                  replaceTkl:"{¥选择分享渠道后自动生成淘口令¥}",
//                                  replaceUrl:"{选择分享渠道后自动生成链接}"
//                                  sharedCloseDialog:false,//默认为true
//                                  needClip:false//默认为true
                                },function(ret,err){
//                              console.log(JSON.stringify(ret));
                                u.shareGetM(ret);
//                                  u.shareImg(ret.type,ret.img_url);//原弹窗式分享赚
                                });
                    }else{
                        u.toast('获取分享数据失败！');
                    }
    },'get');
 });
 //不能放在这里 因为性能不同有的手机执行（addEventListener）顺序也会不同，比如vivo Y37就会
//	ali.showItemPage({name:pagename,pid:pid,itemId:param.itemId,onBackPress:true},function(ret,err){u.processCallback(ali,bsign,ret,err,pa);});
}

	};
	u.showShareDialog = function(callback){
	    u.isLogin(function(ret){
              if(ret.value&&$api.getStorage('localUserInfor').tb_spread_pid){
                    callback(true);
              }else{
                    callback(false);
              }
        });
	};
	u.strEndWith = function(str,endStr){
	  if( typeof(str) != 'string'||typeof(endStr) != 'string' )return false;
	   var d=str.length-endStr.length;
       return (d>=0&&str.lastIndexOf(endStr)==d)
	};
	u.downMutImg = function(imgUrls,isWxf,callback){//imgUrls为字符串数组
//	imgUrls[1] = 'http://img.alicdn.com/imgextra/i1/671147422/TB2oBAPcdhvOuFjSZFBXXcZgFXa_!!671147422.gif';
	   var downstatus = 0;
	   var imgpaths = '';
        for(var index=0;index<imgUrls.length; index++){
            if(api.systemType == 'ios'){
              //imageCache 返回的地址不是图片格式的 导致微信分享不了
                api.imageCache({
                    url: imgUrls[index],
    //              encode:false
                }, function(ret, err) {
                     //下载成功
                        if(imgpaths.length>0){
                            imgpaths = ret.url +','+imgpaths;
                         }else{
                            imgpaths = ret.url;
                         }
                         downstatus++;
                         if(downstatus>=imgUrls.length){callback(imgpaths);}
                });
              }else{
//            var hasJpg = false;
                api.download({
                    url:  imgUrls[index],
//                  savePath: 'fs://download/share'+downstatus+'.jpeg',
                    encode:false,
//                  report: true,
                    cache: true,
                    allowResume: true
                }, function(ret, err) {
                    if (ret.state == 1) {
                     if(isWxf&&!(u.strEndWith(ret.savePath,'.jpg') || u.strEndWith(ret.savePath,'.png')|| u.strEndWith(ret.savePath,'.jpeg'))){
                            var imageFilter = api.require('imageFilter');
                               imageFilter.compress({
                                    img: ret.savePath,
                                    save:{
                                           album:false,              //(可选项)布尔值，是否保存到系统相册，默认 false
//                                         imgPath:'widget://cache/image',    //(可选项)保存的文件路径,字符串类型，无默认值,不传或传空则不保存，若路径不存在文件夹则创建此目录
                                           imgPath:'fs://cache',
                                           imgName:'shareget' +downstatus +'.png'           //(可选项)保存的图片名字，支持 png 和 jpg 格式，若不指定格式，则默认 png，字符串类型，无默认值,不传或传空则不保存
                                    },
//                                  quality: 1,
                                }, function(imgfret, imgferr) {
                                    if (imgfret.status) {
                                        //下载成功
                                        if(imgpaths.length>0){
                                            imgpaths = imgpaths+','+'fs://cache/shareget'+downstatus+'.png';
                                         }else{
                                            imgpaths = 'fs://cache/shareget'+downstatus+'.png';
                                         }
                                         downstatus++;
                                         if(downstatus>=imgUrls.length){callback(imgpaths);}
                                    }else{
                                        u.toast('分享失败，请稍后重试');
                                    }
                                });
                        }else{
                            //下载成功
//                          hasJpg = true;
                            if(imgpaths.length>0){
                                imgpaths =  imgpaths+','+ret.savePath;
                             }else{
                                imgpaths = ret.savePath;
                             }
                             downstatus++;
                             if(downstatus>=imgUrls.length){callback(imgpaths);}
                        }
                    }
                });
              }
        }
	};
	u.shareGetM = function(ret){
	   if(ret && ret.imgUrls){
//	       u.downMutImg(ret.imgUrls.split(','),ret.type=='wxFriend',function(path,hasJpg){
	       u.downMutImg(ret.imgUrls.split(','),ret.type=='wxFriend',function(path){
//	           if(!hasJpg){//改了imgpaths的拼接顺序 一般fs://cache/shareget会在最后 就不用延时执行了
//                  setTimeout(function(){
//                      var inShare = api.require('InShare');
//                      inShare.shareImgsTo(
//                          {
//                               imgPaths:path,
//                               sendPattern:ret.type == 'others' ? 'ALL': 'ONLY',
//                               app:ret.type,
//                          },function(ret,err){
//                       });
//                  },ret.imgUrls.split(',').length*200);//compress
//              }else{
    	           var inShare = api.require('InShare');
                    inShare.shareImgsTo(
                        {
                             imgPaths:path,
                             sendPattern:ret.type == 'others' ? 'ALL': 'ONLY',
    //                       description:ret.clipText,
    //                      packageName:'com.sina.weibo',
    //                      activityName:'com.sina.weibo.composerinde.ComposerDispatchActivity',
                             app:ret.type,
    //                       isComp:false
                        },function(ret,err){
    //                       if(ret.status == false && ret.errorMessage){}
                     });
//              }
	       });
	   }else if(ret && ret.clipText){
	       var inShare = api.require('InShare');
	       if(ret.type == 'others'){
	           inShare.shareTextTo(
                   {
                        content:ret.clipText,
                        sendPattern: 'ALL' ,
                        app:'others',
                        dialogTitle:'请选择平台',
                    },function(ret,err){}
               );
	       }else{
	           inShare.openApp({
                app:ret.type,
               },function(ret,err){});
	       }

//	       if(ret.type == 'wxFriend'){
//	           window.location.href = "weixin://";
//	       }else{
//	         var inShare = api.require('InShare');
//             inShare.shareTextTo(
//                 {
//                      content:ret.clipText,
//                      sendPattern:ret.type=='others' ? 'ALL' :'ONLY',
//                      app:ret.type,
//                      dialogTitle:'请选择平台',
//                  },function(ret,err){}
//              );
//	       }
	   }
	};
	u.shareImg = function(type,imgurl,clipText){
	   var qq = api.require('qq');
       var wx = api.require('wx');
          switch (type){
            case 'qq':
                //     QQ分享
            api.imageCache({
                url: imgurl,
                thumbnail:false
            }, function(ret, err) {
                qq.shareImage({
                    type:'QFriend',
                    imgPath: ret.status ? ret.url:'widget://image/log.png',
                },function(ret,err){
                      if (ret.status){
                        u.toast('分享成功');
                      } else {
    //                  u.toast(err. msg);
                      }
                });
            });
            if(clipText){
                var clipBoard = api.require('clipBoard');
                setTimeout(function(){
                    clipBoard.set({
                        value: clipText
                    }, function(ret, err) {});
                },2000);
            }
            break;
            case 'qzone':
                //     QQ分享
            api.imageCache({
                thumbnail:false,
                url: imgurl
            }, function(ret, err) {
                qq.shareImage({
                    type:'QFriend',
                    imgPath: ret.status ? ret.url:'widget://image/log.png',
                },function(ret,err){
                      if (ret.status){
                        u.toast('分享成功');
                      } else {
    //                  u.toast(err. msg);
                      }
                });
            });
            if(clipText){
                var clipBoard = api.require('clipBoard');
                setTimeout(function(){
                    clipBoard.set({
                        value: clipText
                    }, function(ret, err) {});
                },2000);
            }
            break;
            case 'wechat':
             //    微信好友
             api.imageCache({
                    thumbnail:false,
                    url: imgurl
                }, function(ret, err) {
               api.imageCache({
                    url: imgurl,
                    policy:'no_cache'
                }, function(ok, ng) {
                    wx.shareImage({
                        scene: 'session',
                        thumb: ok.status ? ok.url:'widget://image/log.png',
                        contentUrl:ret.status ? ret.url:'widget://image/log.png',
                    }, function(ret, err) {
                        if (ret.status) {
                            u.toast('分享成功');
                        } else {

                        }
                    });
                });
                });
            break;
            case 'friend':
            api.imageCache({
            thumbnail:false,
                    url: imgurl
            }, function(ret, err) {
                    wx.shareImage({
                        scene: 'timeline',
                        contentUrl:ret.status ? ret.url:'widget://image/log.png',
                    }, function(ret, err) {
                        if (ret.status) {
                            u.toast('分享成功');
                        } else {

                        }
                    });
            });
            break;
          }
	};

	u.openCouponPage = function(link){
	       var ali = api.require('alibaichuan');
	       var open = function(){
	           api.openFrame({
                        name: 'couponpage',
                        url: '../showItem/couponpage.html',
                        bounces:false,
                        rect: {
                            x:0,
                            y:0,
                            w:'auto',
                            h:'auto'
                        },
                        pageParam:{itemId:link}
                });
	       };
	       u.aliPage(ali,'getUserInfo',{},function(ok,ng){
                 if (ok.status &&ok.data.isLogin){
                                          open();
                 }else{
                        ali.showLogin(function(ret,err){
                          if(ret && ret.status &&ret.data.isLogin){
                                       open();
                          }else{
                                        u.toast('淘宝授权失败');
                         }
                      });
                }
           });
	};
	//打开优惠券页面(最早的win)
	u.openCouponWin = function(param,pa,val){
		var url =  'widget://html/showItem/couponwin.html';
		api.openWin({
			name: 'couponwin',
			url: url,
			pageParam: {
				param:param,
				pa:pa,
				val:val
			},
			reload:true
		});
	};
	u.openAliPage = function(ali,param,pa,pagename){
	//清除掉可能存在的通过商品详情跳转登录的浏览记录
		api.removePrefs({key:'loginBsign'});
		if(!param.itemId){
			u.toast('获取商品参数失败，请稍后重试');
			return;
		}
		// if(!param.itemId ||(!pa.itemid&&!pa.numiid)){
		// 	u.toast('获取商品参数失败，请稍后重试');
		// 	return;
		// }
		// var ali = api.require('alibaichuan');
		var commissionrate ='';//搜索商品返利比例（可选，搜索商品所需）
		if (pa.commissionrate !=null && pa.commissionrate) {
			commissionrate = pa.commissionrate;
		}else{
			pa.commissionrate = '';
		}

		if(!pa.keyword ){pa.keyword = '';}//搜索商品需求
		if(!pa.itemtitle ){pa.itemtitle = '';}//搜索商品需求
		var price ='';//商品原价
		var rebate = '';//商品返利
		if (param.price !=null && param.price) {
			price = param.price;
		}
		if (param.rebate !=null && param.rebate) {
			rebate = param.rebate;
		}
		var isLogin = false;
		var tbUserId = $api.getStorage('buyerId') ? $api.getStorage('buyerId') :'';
		api.getPrefs({
			key: 'tbUserId'
		},function(ret, err){
			if (ret) {
			tbUserId = ret.value;
			}
		});
		//getPrefs返回的是字符串
		api.getPrefs({
			key: 'isLogin'
		}, function(ret, err) {
			if (ret) {
				isLogin = ret.value;
				if (isLogin == 'true') {isLogin = true;}
				else{isLogin = false;}
			} else { isLogin = false;}

			if (isLogin) {
				u.progress();
				//上传浏览记录到后台
//              			u.request('0x0028',{returnAll : true,data:{values:{
//			                			itemid:pa.itemid,
//			                			itemtype:pa.itemtype,
//			                			parameter:pa.parameter,
//			                			commissionrate:commissionrate,
//			                			keyword:pa.keyword ? pa.keyword : ''
//              			}}},function(ret2,err2){
                			u.request('0x0028',{returnAll : true,data:{values:pa}},function(ret2,err2){
														alert(JSON.stringify(ret2))
                				//待处理：bsign没有获取到的情况！！出现过的情况：搜索的商品 上传浏览记录时就没有返回bsign
                				// var bsign = ret2.body.result;
                				var coupon_url = null;
												ret2.body.isError = false;
                		  if (!ret2.body.isError&& ret2 &&tbUserId) {//若当前应用没有被淘宝授权，则会在获取淘宝用户信息处卡死，所以tbUserId要在取消授权时清空
                					var bsign = ret2.body.result.bsign||ret2.body.result;
                					coupon_url = ret2.body.result.coupon_url ? ret2.body.result.coupon_url : null;
                					coupon_url&&(param.itemId=coupon_url);

                					//获取当前授权淘宝的用户信息(注意：当没有授权时这里会卡死)
                					u.aliPage(ali,'getUserInfo',{},function(ret3,err3){
														alert(JSON.stringify(ret3+"///"+err3))
				 			if (ret3 && ret3.status) {
				 				//登录了 但是可能没有授权！！！！
				 				if (ret3.data.isLogin &&ret3.data.userId&&ret3.data.userId !=tbUserId) {
				 				//用户已经授权淘宝 且与上次授权淘宝账号不同。。。。
				 				api.setPrefs({
				 				    key: 'tbUserId',
				 				    value: ret3.data.userId
				 				});
				 				var nick = ret3.data.userNick;
						                    	var icon = ret3.data.avatarUrl;
						                    	var openid = ret3.data.userId;
						                    	//上传当前淘宝账号 用户信息到后台

//				 				u.request('0x0019',{returnAll: true,data:{values:{code:'tb',openid:openid, uname:nick,uavatar:icon}}},function(ret4,err4){
				 				u.request('0x0026',{returnAll: true,data:{values:{tbbuyerid:openid}}},function(ret4,err4){

				 					if(!ret4.body.isError && ret4){
					 					api.hideProgress();
					 					u.openItemWin('itemwin',bsign,param,pa,ali);

				 					}else if(ret4){
					 					api.hideProgress();
					 					//openid 为空则 为授权10004
					 					u.toast(ret4.body.errorMessage);
				 					}else{
					 					api.hideProgress();
	                								u.toast('连接服务器异常，请稍后重试');
				 					}
				 				});
				 				}else{
				 					api.hideProgress();
				 					//用户没有授权淘宝 或者 淘宝账号与上次一致。。。
				 					//打开页面
					 				u.openItemWin('itemwin',bsign,param,pa,ali);

				 				}
				 			}else if(ret3){
				 				api.hideProgress();
				 				//用户没有授权淘宝
				 				//打开页面
					 			u.openItemWin('itemwin',bsign,param,pa,ali);

				 			}
				 			else{
                						api.hideProgress();
                						u.toast('网络连接异常，请稍后重试');
				 			}
				 		});
                				//没有授权淘宝
                				}else if(ret2 &&ret2.body && ret2.body.isError==false){
                					api.hideProgress();
                					var bsign = ret2.body.result.bsign||ret2.body.result;
                					coupon_url = ret2.body.result.coupon_url ? ret2.body.result.coupon_url : null;
                					coupon_url&&(param.itemId=coupon_url);
				 		//用户没有授权淘宝
				 		//打开页面
				 		u.openItemWin('itemwin',bsign,param,pa,ali);
                				}else{


													alert(JSON.stringify(ali))
                					api.hideProgress();
                					u.toast('商品信息获取失败，请稍后重试');
                				}
                			});
			}else{
				api.hideProgress();
//是否强制登录
                api.getPrefs({
                        key: 'index'
                   }, function(ret, err) {
                       if(ret){
                            var inddata = ret.value;
                            var data = {};
                            if(inddata.indexOf('obj-') === 0){
                                 inddata = inddata.slice(4);
                                 data = JSON.parse(inddata);
                            }else if(inddata.indexOf('str-') === 0){
                                 data = inddata.slice(4);
                            }
                            var login_required = data.setting.ai_login_required||1;//打开商品详情是否需强制登录，1：强制，2：不强制（提高用户浏览商品体验，但未登录购买易丢单）
                            var ios_review = data.setting.ai_ios_review;//1开启  0 关闭
                            var ios_check_version = data.setting.ai_ios_check_version;//ios审核版本号
                            var ios_version = api.appVersion;//当前版本号

                         if(login_required ==1){
                           if(api.systemType == 'ios'){
                                if(ios_review==1&&ios_check_version==ios_version){
                                    u.openItemWin('itemwin','',param,pa,ali);
                                }else{
                                    u.goLogin(1,true);
                                }
                            }else{
                                   u.goLogin(1,true);
                            }
                         }else{
                            u.openItemWin('itemwin','',param,pa,ali);
                         }
                        }else{
                            u.goLogin(1,true);
                        }
                });
			}
		});
	};
	u.updateLoginInfor = function(ret,fromWhere,name){
		//保存cookie及用户信息
                                                     var cookie = ret.headers['Set-Cookie'];
                                                     api.setPrefs({key:'cookie',value:cookie});
                                                     api.setPrefs({key:'isLogin',value:'true'});//true保存/获取的是字符串类型
                                                     u.saveUserInfor('mine',ret.body);//保存用户信息
                                              if (fromWhere == 'activity') {
                                              		if (ret.body.result.bsign && cookie) {
                                              			u.sendLoginSuccess(ret.body.result.bsign,cookie);
                                              		}else{
                                                		u.toast('亲！该商品没有返利哦');
                                              			u.closeAllWin();
                                              		}
                                               }else{
                                                    api.openWin({
                                                           	name: 'root',
                                                            url: '../index.html',
                                                            // reload: true,
                                                            pageParam: {
                                                                        name: name
                                                            }
                                                     });
                                                }
	};

	u.isLogin = function(callback){
		var back = {};
		api.getPrefs({
			key: 'isLogin'
		}, function(ret, err) {
			if (ret && ret.value == 'true') {
				back.value = true;callback(back);
				// else{back.value = false;callback(back);}
			} else {back.value = false;callback(back);}
		});
	};

	u.addWin = function(name){
		var allname = [];
		if ($api.getStorage('allWin')) {
			allname=$api.getStorage('allWin');
			allname.push(name);
		}else{
			allname.push(name);
			$api.setStorage('allWin',allname);
		}
	};

	u.closeAllWin = function(){
		var names = $api.getStorage('allWin');
		for (var i = 0; i < names.length; i++) {
			api.closeWin({
			    name:names[i],
			    animation:{
				type:'none'             //动画类型（详见动画类型常量）
			    }
			});

		}
	};
	u.sendLoginSuccess = function(bsign,cookie){
		api.setPrefs({
		    key: 'loginBsign',
		    value: bsign
		});
		u.closeAllWin();//不知道起到作用没有
		// if (!bsign) {
		// 	api.sendEvent({
		// 	    name: 'loginSuccess',
		// 	    extra: {
		// 	        type: 'login',
		// 	        bsign:'',
		// 	        cookie:cookie
		// 	    }
		// 	});
		// }else{
		// 	api.sendEvent({
		// 	    name: 'loginSuccess',
		// 	    extra: {
		// 	        type: 'login',
		// 	        bsign:bsign,
		// 	        cookie:cookie
		// 	    }
		// 	});
		// }
	};

	u.goLogin = function(code,restart){
		if (typeof(code) == 'Boolean') {
			restart = code;
			code = undefined;
		}
		if (code == undefined) {
			code = 1;
		}
		var reload = restart == null?false:restart;//默认为不刷新
		var type = code == null? 1:code;//默认为superweb页面打开方式，即登录成功后返回并且刷新
		api.openWin({
		    name: 'login_index',
		    url: 'widget://html/login_index.html',
		    reload:true,
		    pageParam: {
		        type: type,
		        reload:reload,
		        winName:api.winName
		    }
		});
	};
	u.closeLoginWin = function(){
		var type = 1;
		if (api.winName == 'root') {type = 0; }
		else if (api.pageParam == undefined) {type = 1; }
		else if (api.pageParam.type == undefined) {type = 1; }
		else{ type = api.pageParam.type;}

		switch(type){
			case 0://通过原生activity打开的登录页面（root是登录页面）
				api.closeWin();
				// u.closeAllWin();
			break;
			case 1://通过superWeb打开的登录页面
				api.closeWin();
			break;
			case 2: //例如：退出登录
				api.closeToWin({name: 'root'});
			break;
			default:
				api.closeWin();
			break;
		}
	};
	//没有登录就只做保存，登录了就更新buyerId（便于跟踪订单）
	u.setBuyerId= function(ret){
	    if(!ret.buyerId) return;
	    var buyerId = ret.buyerId;
	    var nick = ret.nick||'';
		var oldId = $api.getStorage('buyerId');
		u.isLogin(function(back){
		console.log('设置淘宝buyerId：'+ret.buyerId);
			if(back.value){
			            u.request('0x0026',{data:{values:{tbbuyerid:buyerId,nick:ret.nick}}},function(ret,err){console.log('设置buyerid返回:'+JSON.stringify(ret));});
						if (!oldId) {
							//第一次登陆
//							u.request('0x0026',{data:{values:{tbbuyerid: buyerId}}},function(ret,err){console.log('设置buyerid返回:'+JSON.stringify(ret));});
							$api.setStorage('buyerId', buyerId);
						}else if (oldId && oldId!=buyerId) {
//							u.request('0x0026',{data:{values:{tbbuyerid: buyerId}}},function(ret,err){console.log('设置buyerid返回:'+JSON.stringify(ret));});
							$api.setStorage('buyerId', buyerId);
						}
			}else{
						if (oldId!=buyerId) {
							$api.setStorage('buyerId', buyerId);
						}
			}
		});
	};
	/*ios上先关闭再打开 ！！！
             android中先打开在关闭！！！*/
	u.openJudgeSys = function(systemType,fun){

		if (systemType == 'ios') {
			api.closeWin({
				name: 'login_index',
				animation:{
					type:'none'             //动画类型（详见动画类型常量）
				}
			});
		}
		fun();
		if (systemType =='android') {
			api.closeWin({
				name: 'login_index',
				animation:{
					type:'none'             //动画类型（详见动画类型常量）
				}
			});
		}

	};
	u.loginOpen = function(ret,fromWhere){
		//针对用户先授权了淘宝 然后才登录账号进行购买等操作的逻辑处理
//		var oldId = $api.getStorage('buyerId');
//		if(oldId){
//				u.request('0x0026',{data:{values:{tbbuyerid: oldId}}},function(ret,err){});
//		}

		var systemType = api.systemType;

		//保存cookie及用户信息
                        var cookie = ret.headers['Set-Cookie'];
                        api.setPrefs({key:'cookie',value:cookie});
                        api.setPrefs({key:'isLogin',value:'true'});//true保存/获取的是字符串类型
                        u.saveUserInfor('mine',ret.body);//保存用户信息
                        // u.sendLog(JSON.stringify(ret.body.result));

                        var type = 1;
                        var winName = 'root';
                        var reload = false;
                        if (api.winName == 'root') {type = 0; }
		else if (api.pageParam == undefined) {type = 1; winName = 'root'; reload = false;}
		else{
			if (!api.pageParam.type) { type =1; }else{type = api.pageParam.type;}
			if (!api.pageParam.winName) { winName ='root'; }else{winName = api.pageParam.winName;}
			if (!api.pageParam.reload) { reload = false;}else{ reload = api.pageParam.reload;}
		}

                        if (fromWhere == 'activity') {
                                    if (!ret.body.result.bsign || !cookie) {
                                    	u.toast('亲！该商品没有返利哦');
                                    	u.sendLoginSuccess('',cookie);
                                    }else{
                                              	u.sendLoginSuccess(ret.body.result.bsign,cookie);
                                    }
                        }else{
                        	/*ios上先关闭再打开 ！！！
                        	android中先打开在关闭！！！*/

         switch(type){
			case 0://通过原生activity打开的登录页面（root是登录页面）

				u.closeAllWin();
			break;
			case 1://通过superWeb打开的登录页面

				u.openJudgeSys(systemType,function(){
					api.openWin({
		                                                name: winName,
		                                                reload: reload
		                                    });
				});
			break;
			case 2: //例如：退出登录

				u.openJudgeSys(systemType,function(){
//					api.openWin({
                   api.closeToWin({
    		            name: 'root',
    	                reload: false//这里为true的时候 my页面的顶部会跑到 index的其他页面上，因为my是一个win
    		       });
				});

			break;
			case 3:

				api.closeWin({
					name: 'login_index',
					animation:{
						type:'none'             //动画类型（详见动画类型常量）
					}
				});
			break;
			default:
				u.openJudgeSys(systemType,function(){
					api.openWin({
		                                                name: 'root',
	                                                	url: '../index.html',
		                                    });
				});

			break;
			}

                        }
	};

	u.exitApp = function() {
                        api.addEventListener({
                                name : 'keyback'
                        }, function(ret, err) {
                                api.toast({
                                        msg : '再按一次返回键退出',
                                        duration : 2000,
                                        location : 'bottom'
                                });
                                api.addEventListener({
                                        name : 'keyback'
                                }, function(ret, err) {
                                        api.closeWidget({
                                                // id : 'A6912232040376',
                                                retData : {
                                                        name : 'closeWidget'
                                                },
                                                silent : true
                                        });
                                });
                                setTimeout(function() {
                                        exitApp();
                                }, 3000)
             	});
            };

	//设置顶部颜色
            u.setTopColor = function(tag){
            	if (api.systemType =='ios') {
            		tag.style.background = '#fdfdfd';
            	}else {
			tag.style.background = '#333333';
            	}
            };

           function setItemId(itemurl,openiid,iid){
            	var itemId = '';
            	var pid = u.getPid();
            	if (itemurl) {
                                  itemId = itemurl.replace('@[param]',pid);//高佣金or二合一（优惠券和详情）
                 }else if (iid) {
                                  itemId = iid;
                 }else if (openiid) {
                                  itemId = openiid;
                 }
                       return itemId;
            }

            u.getItemId = function(val,type){
            	var itemId = null;
            	switch(type){
            		case 'normol':
            			itemId = setItemId(val.tg_url,val.open_iid,val.iid);
            		break;
            		case 'onebuy':
            			itemId = setItemId(val.op_clickurl,val.op_openiid,val.op_iid);
            		break;
            		case 'buygroup':
            			itemId = setItemId(val.gp_clickurl,val.gp_openiid,val.gp_iid);
            		break;
            		case 'showorder':
            			itemId = setItemId(val.url,val.open_iid,val.iid);
            		break;
            	}
                       return itemId;
            };

            u.openOrderDetail = function(orderid,ali,callback){
            		var pid =''+u.getPid();
            		var itemId = 'https://h5.m.taobao.com/mlapp/odetail.html?bizOrderId='+orderid+'&archive=false';

            		u.aliPage(ali,'getUserInfo',{},function(ok,ng){

	                        if (ok && ok.status &&ok.data.isLogin){
	                                    ali.showItemFull({name:'item',pid:pid,itemId:itemId},callback);
	                        }else{
	                                    ali.showLogin(function(ret,err){
				                                    if(ret && ret.status &&ret.data.isLogin){
				                                    		  ali.showItemFull({name:'item',pid:pid,itemId:itemId},callback);
				                                    }else{
				                                    			u.toast('淘宝授权失败');
				                                    }
	                                    });
	                        }
            		});

//          		ali.showItemFull({name:'item',pid:pid,itemId:itemId},callback);
            };

            u.buyCallback = function(buyerid,bsign,ret,err){
					if((ret.status || ret.result)&& ret.orderid){
						//支付成功的调用接口
						// bsign:bsign,  购物车没有
							if(api.systemType =='android'){ ret.orderid = ret.orderid.split(',');}
				            u.request('0x002A',{data:{values:{orderid:ret.orderid, buyerid:buyerid,bsign:bsign}}},function(ok,ng){console.log('支付成功回调'+JSON.stringify(ok));});
					}else if (ret&&!ret.status &&!ret.result){
						//支付失败的调用接口
						// bsign:bsign,购物车没有
//				            u.request('0x002B',{data:{values:{code:ret.code,msg:ret.message,buyerid:buyerid,bsign:bsign}}},function(ok,ng){console.log('支付失败回调'+JSON.stringify(ok));});
					}else if((ret.status || ret.result)&& !ret.orderid){
					       //成功加入购物车
					}
			};
            //使用条件 已经登录并且授权了淘宝
            u.upScan = function(ali,buyerid,itemId,questPa,url){
            		var pid =''+u.getPid();
            		if(!questPa.itemtype){//参团单人买的情况
            		          if(questPa.iscart == 1){
                                       ali.showItemFull({name:'addCart',pid:pid,itemId:itemId},function(ret){});
                               }else if(url){
                                      ali.showItemFull({name:'item',pid:pid,itemId:url},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
                               }else{
                                      u.toast('下单失败，请稍后重试');
                               }
            		}else{
            		  u.request('0x0028',{returnAll : true,data:{values:questPa}},function(ret,err){
//                              console.log(JSON.stringify(questPa));
                                api.hideProgress();
                               if (!ret||!ret.body||ret.body.isError) {
                                            u.toast('请求服务器失败，请稍后重试');
                                 }else if(ret.body.result){
                                            var bsign = ret.body.result;
                                            if(questPa.iscart == 1){
//                                                  if(api.systemType == 'android'){
//                                                      ali.showHalfPage({name:'addCart',pid:pid,itemId:itemId},function(ret){});
//                                                  }else{
                                                        ali.showItemFull({name:'addCart',pid:pid,itemId:itemId},function(ret){});
//                                                  }
                                            }else if(itemId.substring(0,4)=='http'){
                                                ali.showItemFull({name:'item',pid:pid,itemId:itemId},function(ret,err){u.buyCallback(buyerid,bsign,ret,err);});
                                            }else if(url){
                                                ali.showItemFull({name:'item',pid:pid,itemId:url},function(ret,err){u.buyCallback(buyerid,bsign,ret,err);});
                                            }else{
                                                    u.toast('下单失败，请稍后重试');
                                            }
                                 }
                        });
            		}

            };

           //加购or去购买<!-- TODO:注意参团里面的单人买-->
           //通过拼接url的方式去购买（已经弃用！！）
		u.goCartBuy = function(itemId,questPa,urlPa){
				var url = '';

				if(questPa){//有一种情况没有questPa  ----拼团中的单人买
				    questPa.iscart = questPa.iscart ? questPa.iscart : 0;//0：普通浏览记录，1：添加购物车记录
				}
	            if(!itemId||(questPa&&questPa.iscart == 0 && !urlPa.iid)){
	            		u.toast('获取商品参数失败，请稍后重试');
						return;
	            }
	            if(urlPa){
	            		urlPa.quantity = urlPa.quantity ? urlPa.quantity :1;
//	       url ='http://buy.m.tmall.com/order/confirmOrderWap.htm?enc=%E2%84%A2&buyNow=true'
//	       +'&_input_charset=utf-8&umpChannel=1-23326911&channelKey=1-23326911&umpkey=1-23326911'
//	       +'&divisionCode=510100&ttid=2014_0_23326911@baichuan_android_3.1.1.9'
//	       +'&x-uid=2449561618&u_channel=1-23326911'
//	       +'&itemId='+urlPa.iid+'&quantity='+urlPa.quantity+'&x-itemid='+urlPa.iid;
//

//	       url = 'https://h5.m.taobao.com/cart/order.html?itemId='+urlPa.iid+'&item_num_id='+urlPa.iid+'&_input_charset=utf-8&buyNow=true&quantity='+urlPa.quantity
//	       +'&ttid=2014_0_23326911@baichuan_android_3.1.1.9&channelKey=1-23326911&exParams={\"id\":\"'+urlPa.iid+'\",\"ttid\":\"2014_0_23326911@baichuan_android_3.1.1.9\",\"umpChannel\":\"1-23326911\",\"u_channel\":\"1-23326911\"}&umpChannel=1-23326911&u_channel=1-23326911';


	            		url = 'https://buy.m.tmall.com/order/confirmOrderWap.htm?enc=%E2%84%A2&buyNow=true&itemId='+urlPa.iid+'&quantity='+urlPa.quantity;//+'&ali_trackid=2:mm_31911617_13614779_54508701'
						if(urlPa.skuId){url = ''+url+'&skuId='+urlPa.skuId;}
	            }
				u.isLogin(function(back){
						u.progress();
						if(back.value){

										var ali = api.require("taobao");
										var pid =u.getPid() ? u.getPid() : '';
				                        if(!pid){u.toast('关联淘宝联盟失败');return};
										u.aliPage(ali,'getUserInfo',{},function(ok,ng){
									                  if (ok.status &&ok.data.isLogin){
									                       var buyerid = ok.data.userId;
									                             if(questPa){
									                                   u.upScan(ali,buyerid,itemId,questPa,url);
									                              }else{//单人买 拼团情况
                                                                         api.hideProgress();
									                                    if(itemId.substring(0,4)=='http'){
                                                                            ali.showItemFull({name:'item',pid:pid,itemId:itemId},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
                                                                        }else if(url){
                                                                            ali.showItemFull({name:'item',pid:pid,itemId:url},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
                                                                        }else{
                                                                                u.toast('下单失败，请稍后重试');
                                                                        }
									                              }
									                   }else{
									                                    ali.showLogin(function(ret,err){
												                                    if(ret && ret.status &&ret.data.isLogin){
												                                        var buyerid = ret.data.userId;
												                                         if(questPa){
												                                    		    u.upScan(ali,buyerid,itemId,questPa,url);
												                                    	  }else{//单人买 拼团情况
                                                                                                api.hideProgress();
                                                                                                if(itemId.substring(0,4)=='http'){
                                                                                                    ali.showItemFull({name:'item',pid:pid,itemId:itemId},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
                                                                                                }else if(url){
                                                                                                    ali.showItemFull({name:'item',pid:pid,itemId:url},function(ret,err){u.buyCallback(buyerid,'',ret,err);});
                                                                                                }else{
                                                                                                        u.toast('下单失败，请稍后重试');
                                                                                                }
                                                                                          }
												                                    }else{
												                                    			api.hideProgress();
												                                    			u.toast('淘宝授权失败');
												                                    }
									                                    });
									                   }
								          });
						}else{
											api.hideProgress();
											u.goLogin(1,true);
						}
				});
		};
		u.outopen = function(param){
//		    var id = ret.id;
//            var title = ret.title;
//            var content = ret.content;
//            var extra = ret.extra;
               if(param.page){
                           switch(param.page){
                                case 'onebuy'://秒杀券页面里面打开时
                                    api.openWin({
                                        name: 'oneBuy',
                                        url: 'widget://html/plate/onebuy.html'
                                    });
                                break;
                                case 'detail'://商品详情
                                    api.openWin({
                                        reload:true,//win里面的frame不会重新加载！！！！
                                        name:'goodsDetails',
                                        url:'widget://html/win/goodsdetail.html',
                                        pageParam:{
                                            sign:param.sign||'',
                                            reload:true//用于使win里面的frame重新加载！
                                        }
                                    });
                                break;
                                case 'buygroup'://邀请拼团
                                    api.openWin({
                                        name:'buyGroup',
                                        url:'widget://html/plate/buygroup.html',
                                        reload:true
                                    });
                                break;
                                case 'showorder'://晒单详情（暂时未用）
                                    api.openWin({
                                        name:'showorder',
                                        url:'widget://html/win/showorder.html',
                                        reload:true
                                    });
                                break;
                                case 'goodsplate'://晒单详情（暂时未用）
                                    api.openWin({
                                        name:'goodsplate',
                                        url:'widget://html/plate/goodsplate.html',
                                        reload:true
                                    });
                                break;
                                default:
                                break;
                            }
               }
		};

		u.outopenlistener = function(){
		    var ajpush = api.require('ajpush');

            ajpush.setListener(
                function(ret) {
                var extra = eval('(' + ret.extra + ')');
                   u.outopen(extra);
                }
            );
            //android平台  调用这个方法中的监听在应用没有打开的情况下，会监听不到appintent
//          api.addEventListener({
//              name: 'appintent'
//          }, function(ret, err) {
//              if (ret && ret.appParam.ajpush) {
//                  console.log(JSON.stringify(ret));
//                  var ajpush = ret.appParam.ajpush;
//                  //"extra":"{\"page\":\"onebuy\"}"转换为json对象
//                  var extra = eval('(' + ajpush.extra + ')');
//                  u.outopen(extra);
//              }else if(ret&&ret.appParam.lkme){
//                  var linkedME = api.require('LinkedMe');
//                  var uri = 'sqydaoapp://linkedme?click_id='+ret.appParam.click_id+'&lkme='+ret.appParam.lkme;
//                  linkedME.onAppIntent({uri:uri},function(ret){
//                      console.log('appintent'+JSON.stringify(ret));
//                      u.outopen(ret.lkme_controlParam);
//                  });
//              }
//          });

           //ios平台
           api.addEventListener({
                name: 'noticeclicked'
           }, function(ret, err) {
                if (ret && ret.value) {
                    var ajpush = ret.value;
                    var extra = eval('(' + ajpush.extra + ')');
                    u.outopen(extra);
                }
           });
		};
	   u.share = function(name,title,description,img,itemid,type){
//         var linkedme = api.require('LinkedMe');
           var infor = $api.getStorage('localUserInfor');
           var index =$api.getStorage('index');
           var shareUrl = index.result.goodsdata.result.shareurl||'';

           if(shareUrl&&infor&&infor.tb_code){
                 shareUrl=shareUrl.replace("@[param]",infor.tb_code).replace("@[param]",itemid);
//               linkedme.getLinkedMeKey(function(ret){
//                     if(ret&&ret.status&&ret.appkey){
//                             shareUrl=shareUrl+'&linkedme='+ret.appkey;
//                      }
                               u.doshare(name,shareUrl,title,description,img,type);
//               });
           }else{u.toast('分享失败，没有获取到当前用户信息');}
        };
	   u.doshare = function(name,url,title,description,img,type){
	       var qq = api.require('qq');
           var wx = api.require('wx');
	       switch(name){
    	       case 'qq':
    	           qq.shareNews({
                        url: url,
                        title: title,
                        type:'QFriend',
                        description: description,
                        imgUrl: img
                    },function(ret){
                        if(ret.status==true){
                            u.toast('分享成功');
                            u.shareCallback(type,ret);
                        }
                    });
    	       break;
    	       case 'wechat':
    	           api.imageCache({
                        url: img
                    }, function(ret, err) {
                        wx.shareWebpage({
                            scene: 'session',
                            title: title,
                            description: description,
                             thumb: ret.status ? ret.url:'widget://image/log.png',
                            contentUrl: url
                        }, function(ret, err) {
                            if (ret.status) {
                                u.toast('分享成功');
                                u.shareCallback(type,ret);
                            }
                        });
                    });
               break;
               case 'friend':
                api.imageCache({
                    url: img
                }, function(ret, err) {
                    wx.shareWebpage({
                        scene: 'timeline',
                        title: title,
                        description: description,
                        thumb:ret.status ? ret.url:'widget://image/log.png',
                        contentUrl: url
                    }, function(ret, err) {
                        if (ret.status) {
                            u.toast('分享成功');
                            u.shareCallback(type,ret);
                        }
                    });
                });
               break;
               case 'qzone':
                qq.shareNews({
                    url: url,
                    title: title,
                    type:'QZone',
                    description: description,
                    imgUrl: img
                },function(ret){
                    if(ret.status==true){
                        u.toast('分享成功');
                        u.shareCallback(type,ret);
                    }
                });
               break;
	       }
	   };
		u.exit = function(){
		    var ali = api.require('alibaichuan');
            api.removePrefs({key: 'tbAuthNick'});
            api.removePrefs({key: 'tbUserId'});
            api.removePrefs({key: 'cookie'});
            api.removePrefs({key: 'loginBsign'});
            api.setPrefs({
                key: 'isLogin',
                value: 'false'
            });
            $api.rmStorage('sign_time');
            $api.rmStorage('localUserInfor');
            $api.rmStorage('buyerId');
            // $api.clearStorage ();//清楚本地存储的所有数据（慎用！）
            api.setPrefs({
                key: 'isLogin',
                value: false
            });
            ali.logout(function(ret,err){});
            // api.accessNative({name: 'logout'}, function(ret,err) {});

            //关闭root页面的frameGroup（因为没法关闭root）
            api.closeFrameGroup({name: 'frame'});
            //注销接口
//          u.request('0x002C',{},function(ret,err){});
            api.openWin({
                  name: 'login_index',
                  url: 'widget://html/login_index.html'/*file:///android_asset/widget/html/login_index.html*/
            });

    };
	window.$handsome = u;
})(window)
