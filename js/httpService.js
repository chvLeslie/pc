/*
 *接口编码：TP00102 第一位：T：会与第三方交互2：001接口编号3:错误位置编号
 * 
 * */

angular.module("httpService", [])
	.service("httpService", function($http,$rootScope) {
		window.springBootApi =  location.href.split("/")[0] + "//" + location.href.split("/")[2] + "/"+"tkpmallrc/";
		
		
		//获取session数据
		this.getSession = function(returnFun){
			if(getCookie('tkpMall_SSO_result')){
				var result=JSON.parse(window.base64.decode(getCookie('tkpMall_SSO_result')).replace(/\0/g, ''));
				ajax({ //获取老工程session数据，同步请求
					method: 'get',
					url : window.cBasePath + "DataServlet?BusiName=LoginBL&Data=%7B%22errorMsg%22:%22%22,%22isSuccess%22:false,%22map%22:%7B%7D,%22validation%22:true,%22valuetype%22:%7B%7D,%22vflag%22:true%7D&Operate=logout&v="+Math.random(),
					isasync: false,
					data: {},
					success: function(data) {
						if(result.success){
							var tkLoginToken = result.returnMsgs.loginToken;
							window.ctrlLocalStorage.setLocalStorage('tkLoginToken',tkLoginToken);
							$http({ //获取session数据
								method: 'GET',
								url: window.cBasePath + 'OtherSystemLoginSy?loginToken='+tkLoginToken+"&v="+Math.random()
							}).then(function success(data) {
								getUserSession();
								document.cookie="tkpMall_SSO_result=;path=/";
							});
						}else{
							document.cookie="tkpMall_SSO_result=;path=/";
							window.location.href=window.cBasePath+"pc/pages/personregister/personregister.html#/maininfo";
						}	
					}
				});
				
			}else{
				getUserSession();
			}
			function getUserSession(){
				$http({ //获取session数据
						method: 'GET',
						url: window.cBasePath + 'LoginServlet?' + Math.random()
				}).then(function success(data) {
					window.userSession = data.data;
					returnFun(data.data);
				});
			}
			
		};
		
		
		//调用常见问题接口
		this.commonquestion=function(returnFun){
			$http({
				method : 'POST',
				url : window.springBootApi + 'articlecenter/getallmenus?menuid='+0
				 }).then(function success(response){
				 	returnFun(response);
				 })
				}
		//提交建议接口
		this.commitsuggest=function(sendData,returnFun){
			$http({
					method : 'POST',
					url : window.springBootApi + 'guestbook/saveguestmessage',
					data : sendData
									
			}).then(function success(response) {
					returnFun(response);
				})
		}
		
		/*--------------------mobile  引用过来  gogogo-----------------------------*/
		var tkLoginToken = window.ctrlLocalStorage.getLocalStorage('tkLoginToken') || '';
		var tkGroupLoginToken = window.ctrlLocalStorage.getLocalStorage('tkGroupLoginToken') || '';
		//校验token是否失效
		function _checkToken(response,flag){
			if(response.data.errorCode=='401'){
				/*window.ctrlLocalStorage.setLocalStorage('tkLoginToken','');
				window.location.href = window.cBasePath + "touch/pages/login/login.html";*/
				var config = {
					title: "登录提示",
					content: "登录信息已失效，请重新登录",
					btn: [{
						btn: "确认",
						fun: function(){
							if(flag == 2){//如果是团体就去掉团体的token
								window.ctrlLocalStorage.setLocalStorage('tkGroupLoginToken','');
								window.location.href = window.cBasePath + "pc/g-pages/login/login.html";
							}else{
								window.ctrlLocalStorage.setLocalStorage('tkLoginToken','');
								window.location.href = window.cBasePath + "pc/pages/p-login/p-login.html";
							}
							
						}
					}]
				}
				$rootScope.msgWindowFun(config);
				return false;
				//window.promptBox.alert(config.content,config.btn[0].btn,config.btn[0].fun);
			}else{
				return true;
			}
		};
		this.isHaveBuyMerchandise = function(merchandiseCode,perNo,insuredPersonid,returnFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + 'goods/ishavebuymerchandise?merchandisecode=' + merchandiseCode + '&perno=' + perNo + '&personid=' + insuredPersonid+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			})
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				if(response.data.success) {
					returnFun(response);
		}
			});
		};
		//获取首页数据
		this.getFirstPageData = function(returnFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + 'pageModel/p004?' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: {}
			})
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			});
		};
		//调用公告的接口
		this.getNotice = function(returnFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + 'api/v1/system/notice?' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			})
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//获取地址
		this.getAddress = function(getAdd){
			if(window._address == ""){
				$http({ //获取商品所有信息
					method: 'GET',
					url: window.apiBacePath + 'metadata/getaddress?' + Math.random(),
					headers:{
						Authorization:tkLoginToken
					},
					params: ''
				}).then(function success(response) {
					if(!_checkToken(response)){return false};
					if(response.data != ""){
						window._address = response.data.data;
						getAdd(window._address);
					}else{
						window._address = "";
					}
				});
			}else{
				getAdd(window._address);
			}
		};
		//检查是否可以购买 接口编码：1001001  编码：1001002
		this.checkIfCanBuy = function(pageInfo,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v1/temporder/checkifcanbuy',
				headers:{
					Authorization:tkLoginToken
				},
				data: pageInfo
			}) // 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
					returnFun(response);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//发送页面数据
		this.sendPageInfo = function(data,returnFun){
			var stringData = JSON.stringify(data);
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v1/order/save',
				headers:{
					Authorization:tkLoginToken
				},
				data: stringData
			}) // 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			}, function error(response) {
				// 请求失败执行代码
			});
		};
		//增加受益人
		this.sendAddBnf = function(data,returnFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'person/beneficiaryrelatives/add',
				headers:{
					Authorization:tkLoginToken
				},
				params: data
			}) // 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
				//保存成功跳转页面
				
			}, function error(response) {
				// 请求失败执行代码
			});
		};
		//获取商品列表
		this.getgoodslist = function(merchandiseCode,returnFun,errFun){
			$http({ //获取商品所有信息
					method: 'POST',
				url: window.apiBacePath + 'goods/getgoodslist',
				headers:{
					Authorization:tkLoginToken
				},
				data: { "queryGoodsNo": merchandiseCode }
				}).then(function success(response) {
				//if(!_checkToken(response)){return false};
					returnFun(response.data[0]);					
			},function error(res){
				//if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
				})
		};
		//获取商品类别列表
		this.getgoodsTypeList = function(queryGoodsType,returnFun,errFun){
			$http({ //获取商品所有信息
				method: 'POST',
				url: window.apiBacePath + 'goods/getgoodslist',
				headers:{
					Authorization:tkLoginToken
				},
				data: { "queryGoodsType": queryGoodsType, "labelTypeList": [] }
			}).then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);					
			},function error(res){
				//if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//获取所有商品
		this.getAllGoodsList = function(returnFun){
			$http({ //获取商品所有信息
				method: 'POST',
				url: window.apiBacePath + 'goods/getgoodslist',
				headers:{
					Authorization:tkLoginToken
				},
				data: {}
			}).then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);					
			})
		}
		//获取商品列表（新）
		this.getgoodslabelnamelist = function(oData, returnFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'goods/getgoodslabelnamelist',
				headers:{
					Authorization:tkLoginToken
				},
				data: oData
			})
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			}, function error(response) {
				// 请求失败执行代码
			});
		}
		//加载下拉列表数据 （ 国籍  、证件类型、与投保人关系）
		this.getrelationsandcountrysandidtypes = function(returnFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + 'metadata/getrelationsandcountrysandidtypes?' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
				})
				.then(function success(res) {
				//if(!_checkToken(res)){return false};
					if(res.data.success){
						returnFun(res.data.data);
					}else{
						alert('获取下拉列表数据失败')
					}
				
			})
		};
		//获取所有被保人信息
		this.getallinsurednames = function(perNo,returnFun,errFun,isOrigin){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'person/getallinsurednames?perno=' + perNo,
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				if(isOrigin === true){
					returnFun(res);
				}else if(res.data.success){
					returnFun(res.data.data);
				}else{
					alert('获取所有被保人信息失败！');
				}
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//保额计算保费
		this.getPrem = function(data,goods,returnFun){
			var data = JSON.stringify(data);
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v1/temporder/premiumcalculate',
				headers:{
					Authorization:tkLoginToken
				},
				data: data
			}).then(function success(response) {
				if(!_checkToken(response)){return false};
				if(response.data.success){
					var arr = response.data.data.classTypes;
					for(var i = 0; i < goods.length; i++){
						for(var j = 0; j < arr.length;j++){
							if(goods[i].riskCode == arr[j].classCode){
								goods[i].prem = arr[j].classPremium;
							}
						}
					}
					
				}else{
					$rootScope.pointWindowFun([response.data.errorMsg]);
				}
				returnFun(response);
			})
		};
		//获取社保类型
		this.getSocialSecurityType = function(data,returnFun){
			//person/getidentityinfo
			$http({
					method: 'POST',
				url: window.apiBacePath + 'person/getidentityinfo',
				headers:{
					Authorization:tkLoginToken
				},
				data: data
			}).then(function success(response){
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		}
		//初始化订单信息
		this.getOrder = function(orderNo,returnFun){
			$http({
					method: 'POST',
				url: window.apiBacePath + 'api/v1/temporder/query/singleinsuredorder',
				headers:{
					Authorization:tkLoginToken
				},
				data: { "orderNo": orderNo}
			}).then(function success(response){
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//获得职业类别列表
		this.getoccupations = function(returnFun){
			$http.get(window.apiBacePath + 'metadata/getoccupations').then(function success(response) {
				//if(!_checkToken(response)){return false};
				if(response.data.success){
					returnFun(response)
				}
			})
		};
		//获取团体名称
		this.getgrpname = function(grpno,returnFun) {
			$http.get(window.apiBacePath + 'person/getgrpname?grpno='+grpno+'&v='+Math.random()).then(function success(response) {
				if(!_checkToken(response)){return false};
				if(response.data.success){
					returnFun(response)
				}
			})
		};
		//新增被保险人
		this.addPerson = function(insuredInfo,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'person/relative/add',
				headers:{
					Authorization:tkLoginToken
				},
				data: insuredInfo
			}).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//修改被保人信息
		this.updaterelative = function(insuredInfo,returnFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'person/updaterelative',
				headers:{
					Authorization:tkLoginToken
				},
				data: insuredInfo
			}).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//单独获取投保人信息
		this.getApplicantInfo = function(perNo,returnFun,errFun,isOrigin){
			$http({
				method: 'GET',
				url: window.apiBacePath + 'person/getapplicantinfo?perno=' +perNo+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			}) // 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				if(isOrigin === true){
					returnFun(response);
				}else if(response.data.success) {
					returnFun(response.data.data);
				}else{
					returnFun(false);
				}
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//获得缴费年期和缴费方式
		this.getpayendyear = function(returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath + 'metadata/getpayendyear?' + Math.random()  ,
				headers:{
					Authorization:tkLoginToken
				},
				params : ''
			})//尾部
			.then(function success(response){
				//if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//方案调整页面的显示数据
		this.getaddfeeinfo = function(orderNo,returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath + 'api/v1/order/getaddfeeinfo?orderNo='+orderNo+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				data : ''
			})//尾部
			.then(function success(response){
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//方案调整的点击按钮的接口
		this.pushorderunderwriteresult = function(orderNo,state,returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath + 'api/v1/temporder/pushorderunderwriteresult?orderNo='+orderNo+'&confirmState='+state+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params : ''
			})//尾部
			.then(function success(response){
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//投保确认页面调用订单查询接口
		this.singleinsuredorder = function(orderNo,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath + 'api/v1/temporder/query/singleinsuredorder',
				headers:{
					Authorization:tkLoginToken
				},
				data : {"orderNo":orderNo}
			})//尾部
			.then(function success(response){
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//获取产品名称和险种名称
		this.getgoods = function(merchandiseCode,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'goods/getgoods',
				headers:{
					Authorization:tkLoginToken
				},
				data: { "queryGoodsNo": merchandiseCode }
			})//尾部
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			},function error(res){
				//if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//检查是否参加活动(开门红，双录,南通医保卡指定生效日，客户知情权，授权声明)
		this.getcheckresult = function(str,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v1/check/getcheckresult?v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				data: str
			}) // 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//根据投保人的团体编号获得团体名称
		this.getgrpnamebyperno = function(perNo,returnFun,errFun){
			$http({
				method:'GET',
				url: window.apiBacePath + 'person/getgrpnamebyperno?perno='+perNo+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params:''
			})// 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//判断是否支持社保卡
		this.checkissupportmedical = function(orderNo,isFlyingStartOrder,returnFun){
			$http({
				method:'GET',
				url: window.apiBacePath + 'product/checkissupportmedical?orderno='+orderNo+'&isFlyingStartOrder='+isFlyingStartOrder+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params:''
			})// 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//调用订单受理接口保存数据 
		this.saveorder = function(sendData,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath + 'api/v1/order/save',
				headers:{
					Authorization:tkLoginToken
				},
				data : sendData
			})// 尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//查询所有码表metadata/getallmetadata
		this.getAllMetaData = function(returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath + 'metadata/getallmetadata?' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				data : ''
			})// 尾部
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//查询银行列表
		this.getbankslist = function(manageCom,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath + 'banks/getbankslist' ,
				headers:{
					Authorization:tkLoginToken
				},
				data : {
						systemId : "tkpmall",
						agencyId : manageCom
					}
			})//尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//获取银行的6位bin码，匹配银行的名称
		this.getbankbinandname = function(returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath + 'banks/getbankbinandname?' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params : ''
			})//尾部
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//获取支付页面的转账授权声明
		this.getauthorization = function(perNo,returnFun){
			$http({
				method: 'GET',
				url: window.apiBacePath+ 'product/getpolicystatementinfo?perno='+perNo+'&type=02'+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			})//尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//支付页面获取订单信息（保险名称、保额/保险计划、首期保费和交费年限）
		this.payoutgetorder = function(orderNo,returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath + 'payout/temporderdatagrid/appoint?orders='+orderNo+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params : ''
			})//尾部
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			})
		};
		//支付功能，发送支付数据
		this.payoutsubmit = function(sendData,returnFun){
			$http({
				method: 'POST',
				url: commonUrl.oldDataServletURL,
				params: {
					'BusiName': 'ConfirmAndSubmitUI',
					'Operate': 'confirmandsubmit',
					'Data': sendData
				}
			})//尾部
			.then(function success(response) {
				returnFun(response);
			})
		};
		//获取订单接口
		this.getOrderList=function(custNum,returnFun){
			$http({
				method: 'GET',
				url: window.apiBacePath+ 'myorder/getuserorders/'+custNum+'?personId='+custNum+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				data: {}
				}).then(
					function success(res){
						if(!_checkToken(res)){return false};
						returnFun(res);
				})
                       
		}
		//账户保存接口（银行卡和社保卡）
		this.addAcctInfo = function(sendData, returnFun){
			$http({
				method : 'POST',
                url: window.apiBacePath + 'acctinfo/addacctinfo',
                headers:{
					Authorization:tkLoginToken
				},
                data:JSON.stringify(sendData)
            }).then(function success(res){
            	if(!_checkToken(res)){return false};
            	returnFun(res);
            });
		}
		//账户删除接口（银行卡和社保卡）
		this.delAcctInfo = function(deleteData, returnFun){
			$http({
				method:'POST',
                url: window.apiBacePath + 'acctinfo/deteleacctinfo',
                headers:{
					Authorization:tkLoginToken
				},
                data:JSON.stringify(deleteData)
			}).then(function success(res){
				if(!_checkToken(res)){return false};
            	returnFun(res);
            });
		}
		//账户修改接口（银行卡和医保卡）
		this.updateAcctInfo = function(updateData, returnFun){
			$http({
				method:'POST',
                url: window.apiBacePath + 'acctinfo/updateacctinfo',
                headers:{
					Authorization:tkLoginToken
				},
                data:JSON.stringify(updateData)
			}).then(function success(res){
				if(!_checkToken(res)){return false};
            	returnFun(res);
            });
		}
		//校验图形验证码，并发送手机验证码（老接口）  舍弃掉，待修改
		this.sendVerifyCode = function(oData, returnFun){
			var sendData = {
                    errorMsg: "",
                    isSuccess: false,
                    map: oData,
                    validation: true,
                    valuetype: {
                        vaild: "String", //验证码类型
                        mobilePhone: "String" //手机号类型
                    },
                    vflag: true
                };
			 $http({
                    method: 'POST',
                    url: commonUrl.oldDataServletURL,
                    headers:{
                        'Content-Type':'multipart/form-data'
                    },
                    params:{
                        'BusiName': 'SendCodeBL',
                        'Operate': 'sendVerifyCode',
                        'Data':sendData
                    }
                }).then(function success(data){
                	_checkToken(data);
                	returnFun(data);
                });
		}
		this.loginCheck = function(data, returnFun){			
			$http({
				method:'POST',
				headers:{
					Authorization:tkLoginToken
				},
                url: window.apiBacePath + 'user/login',
                data:data
			}).then(function success(res){
				//if(!_checkToken(res)){return false};
            	returnFun(res);
            });
		}
		//---------------cq增加页面接口-----------------------
		this.deleteRelations=function(data,returnFun){
			var sendData={
				  	errorMsg: "",
                    isSuccess: false,
                    map: data,
                    validation: true,
                    valuetype: {
                        personID: "String", //亲属ID
                    },
                    vflag: true
								
						}
			 $http({
                    method: 'POST',
                    url: commonUrl.oldDataServletURL,
                    headers:{
                        'Content-Type':'multipart/form-data'
                    },
                    params:{
                        'BusiName': 'InfoMaintainBL',
                        'Operate': 'deletefamily',
                        'Data':sendData
                    }
                }).then(function success(res){
                	if(!_checkToken(res)){return false};
                	returnFun(res);
                });
			
		}
		//被保人信息
		this.saveApplicant=function(data,returnFun,errFun){
			$http({
                method:'POST',
                url:window.apiBacePath + 'person/applicant/update',
                headers:{
					Authorization:tkLoginToken
				},
                data:data
	        }).then(function success(res){
	        	if(!_checkToken(res)){return false};
	          	returnFun(res);
	        },function error(res){
	        	if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
	        })

		}
		//移动端查询团体信息
		this.groupinfos = function(grpno,returnFun,errFun){
			 $http({
                method: 'GET',
                url: window.apiBacePath + "common/query/groupinfos?grpno="+grpno+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(res){
            	if(!_checkToken(res)){return false};
				returnFun(res);
            },function error(res){
            	if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//移动端更换团体
		this.grpChange = function(sendData,returnFun,errFun){
			$http({
                method: 'POST',
                url:window.apiBacePath + 'group/joingroup',
                headers:{
					Authorization:tkLoginToken
				},
                data:sendData
            }).then(function success(res) {
            	if(!_checkToken(res)){return false};
            	returnFun(res);
            },function error(res){
            	if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//移动端根据城市编码获取默认业务员信息
		this.getdefaultagentinfo = function(city,returnFun){
			$http({
				method: 'get',
				url: window.apiBacePath + 'api/v1/agent/getdefaultagentinfo?city='+city+'&v='+Math.random(),
				 headers:{
					Authorization:tkLoginToken
				},
				params: {}
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				returnFun(res);
			})
		}
		//更换业务员信息
		this.updateSalesMan = function(sendData,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v2/agent/updatesalesman',
				headers:{
					Authorization:tkLoginToken
				},
				data: sendData
			}).then(function success(res) {
				if(!_checkToken(res)){return false};
				returnFun(res);
			},function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//获取团购码信息
		this.queryagentinfo = function(data,returnFun){
			$http({
				method: 'post',
				url: window.apiBacePath + 'api/v2/agent/queryagentinfo',
				headers:{
					Authorization:tkLoginToken
				},
				data: data
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				returnFun(res);
			})
		}
		//移动端支付页面，判断是否支持医保卡
		this.checkIsSupportMedical = function(orderno,returnFun){
			$http({
				method:'GET',
				url: window.apiBacePath + 'product/checkissupportmedical?orderno='+orderno+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params:{}
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				returnFun(res);
			})
		}
		//获取已经维护的卡片（银行卡，医保卡）信息
		this.getacctinfolist = function(perData,returnFun){
			$http({
                method:'POST',
                url: window.apiBacePath + 'acctinfo/getacctinfolist',
                headers:{
					Authorization:tkLoginToken
				},
                data:perData
            }).then(function success(res){
            	if(!_checkToken(res)){return false};
            	returnFun(res);
            })
		}
		//根据编号获取业务员的姓名和电话
		this.getAgentInfoByAgentcode = function(saleAgentNo,returnFun,errFun){
			$http({
				method:'GET',
				url: window.apiBacePath + 'api/v1/agent/getagentinfo?agentcode='+saleAgentNo+'&v='+Math.random(),
				//种子投保调用，未登录状态，不携带token
				/*headers:{
					Authorization:tkLoginToken
				},*/
				params:{}
			}).then(function success(res){
				//if(!_checkToken(res)){return false};
            	returnFun(res);
            },function error(res){
            	//if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//校验用户是否可以购买
		this.checkisbuygoods = function(perno,merchandisecode,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath+ 'goods/checkisbuygoods?perno='+perno+"&merchandisecode="+merchandisecode+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
				 }).then(function success(response){
            	if(!_checkToken(response)){return false};
				 	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
				 })
		}
		//根据个人客户号获取绑定的业务员信息
		this.getcustomeragentinfo = function(perno,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath+ 'api/v1/agent/getcustomeragentinfo?perno='+perno+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//根据产品编号获取默认业务员
		this.getDefaultAgentInfoByProduct = function(productcode,returnFun,errFun){
			$http({
                method:'GET',
                url: window.apiBacePath + 'api/v1/agent/getdefaultagentinfo?productcode='+productcode+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params:{}
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
            })
		}
		//保存家人集合
		this.updaterelatives = function(relatives,returnFun,errFun){
			$http({
					method : 'POST',
                url: window.apiBacePath + 'person/updaterelatives',
                headers:{
					Authorization:tkLoginToken
				},
                data: relatives
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//获取商品的销量
		this.getsalecount = function(productCode,returnFun,errFun){
			$http({
                method: 'GET',
                url:window.apiBacePath+ 'product/getsalecount?productsn='+productCode.substring(0,6)+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(response){
            	//if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	//if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//判断产品是否支持医保卡支付（e保有约返回医保卡号）
		this.checkIsSupportMedicalByPernoAndProductcode = function(productCode,perNo,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath+ 'product/isshowmedicalpolicy?productcode='+productCode+"&perno="+perNo+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            }, function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//获取政策声明信息,2为移动端
		this.getpolicystatementinfo = function(perNo,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath+ 'product/getpolicystatementinfo?perno='+perNo+"&type=01&equipmentsource=2"+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//订单转换接口(nbpf订单转换成商城订单)
		this.nbpfOrderCover = function(objOrder,returnFun,errFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + 'api/v1/order/nbpf/cover',
                headers:{
					Authorization:tkLoginToken
				},
                data: objOrder
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//获取用户ip地址
		this.getIp = function(returnFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkLoginToken
				},
                url: window.apiBacePath + 'user/getip',
                data:{}
			}).then(function success(res){
				//if(!_checkToken(res)){return false};
            	returnFun(res);
            });
			
		}
		//修改密码
		this.changePwd = function(sendData,returnFun,errFun){
			$http({
	            method: 'POST',
	            url: window.apiBacePath + 'personcenter/resetpwd',
	            headers:{
	                Authorization:tkLoginToken
	            },
					data : sendData
	        }).then(function success(response) {
	        	if(!_checkToken(response)){return false};
	        	returnFun(response);
	        },function error(res){
	        	if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
	        })
		}
		//获取图形验证码
		this.getImgVaild = function(returnFun,errFun){
			$http({
				method: 'GET',
	            url: window.apiBacePath + 'imagecode/getimgcode?'+Math.random(),
	            headers:{
	                Authorization:tkLoginToken
	            },
	            params: ''
	        }).then(function success(response) {
	        	//if(!_checkToken(response)){return false};
	        	returnFun(response);
	        },function error(res){
	        	//if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
			})
		}
		//校验图形验证码
		this.checkImgCode = function(data,returnFun,errFun){
			$http({
				method: 'POST',
	            url: window.apiBacePath + 'imagecode/validateimgcode?&'+Math.random(),
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: data
	        }).then(function success(response) {
	        	//if(!_checkToken(response)){return false};
	        	returnFun(response);
	        },function error(res){
	        	//if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
			})
		}
		//校验图形验证码并发送短信(郑)
		this.checkImgCodeAndSendMsg = function(data,returnFun,errFun){
			$http({
				method: 'POST',
	            url: window.apiBacePath + 'imagecode/validateimgsend?&'+Math.random(),
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: data
	        }).then(function success(response) {
	        	//if(!_checkToken(response)){return false};
	        	returnFun(response);
	        },function error(res){
	        	//if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
			})
		}
		//忘记密码
		this.forgetPwd = function(data,returnFun,errFun){
			$http({
				method: 'POST',
	            url: window.apiBacePath + 'personcenter/forgetpwd?'+Math.random(),
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: data
	        }).then(function success(response) {
	        	//if(!_checkToken(response)){return false};
	        	returnFun(response);
	        },function error(res){
	        	//if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
			})
		}
		//注册
		this.phoneRegist = function(data,returnFun,errFun){
			$http({
				method: 'POST',
	            url: window.apiBacePath + 'api/v1/regist/personal',
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: data
	        }).then(function success(response) {
	        	//if(!_checkToken(response)){return false};
	        	returnFun(response);
	        },function error(res){
	        	//if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
			})
		}
		//获取购物车的数量
		this.getShopCartCount = function(perNo,returnFun,errFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + 'shopcart/getshopcartordercount?perno='+perNo+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params:""
			}).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		}
		//发送手机短信验证码
		this.getMobileVerifyCode = function(codeData,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v1/message/verifycode/send',
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: codeData
			}).then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				//if(!_checkToken(response)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		}
		//退出登录（token）
		this.logOut = function(returnFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkLoginToken
				},
                url: window.apiBacePath + 'user/logout',
                data:{}
			}).then(function success(res){
				window.ctrlLocalStorage.setLocalStorage('tkLoginToken', '');
            	returnFun(res);
            });
		};
		//单独发送手机短信验证码(移动端登录页面)
		this.messageSend = function(sendData,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'api/v1/message/sms/send',
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: sendData
			}).then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				//if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//删除亲友(调springboot接口)
		this.deleteFamily = function(sendData,returnFun,errFun){
			$http({
				method: 'POST',
				url: window.apiBacePath + 'person/applicant/delete',
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: sendData
			}).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//撤销订单接口
		this.cancelOrder = function(perNo,orderNo,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + 'api/v1/order/cancelorder?orderno=' + orderNo + '&perno=' + perNo + '&v='+Math.random(),
                headers:{
                    Authorization:tkLoginToken
                },
                params: ''
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//判断用户是否为团体用户首次登录
		this.getIsResetpwdFlag = function(userNo,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + '/user/getisresetpwdflag?userNo=' + userNo + '&v='+Math.random(),
                headers:{
                    Authorization:tkLoginToken
                },
                params: ''
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//根据perno和产品号去获取业务员信息
		this.getAgentByPernoAndProcode = function(perno,goodsno,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + '/api/v1/agent/getpersonalagentinfo?perno='+perno+'&goodsno='+goodsno+'&v='+Math.random(),
                headers:{
                    Authorization:tkLoginToken
                },
                params: ''
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		}
		//获取保单列表接口
		this.getInsuranceList=function(sendData,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath+'policy/getpolicylistinfo',
				data:JSON.stringify(sendData)
			})//尾部
			.then(function success(response) {
				returnFun(response);
			})
		}
		//下载电子保单，老接口
		this.downLoadPolicy=function(sendData,returnFun){
			 $http({
                        method: 'POST',
                        url:  commonUrl.oldDataServletURL,
                        headers:{
                                 'Content-Type':'multipart/form-data'
                                },
                        params:{
                                'BusiName': 'DealPolicyUI',
                                'Operate': 'ElectroPolicy',
                                'Data':sendData
                                }
                    }).then(function success(res){
                    		returnFun(res);
                    	}
                   )
		}
		//撤销保单,老接口
		this.deleteInsurance=function(sendData,returnFun){
			 $http({
                        method: 'POST',
                        url:  commonUrl.oldDataServletURL,
                        headers:{
                                 'Content-Type':'multipart/form-data'
                                },
                        params:{
                                'BusiName': 'DealPolicyUI',
                                'Operate': 'cancelPolicy',
                                'Data':sendData
                                }
                    }).then(function success(res){
                    	returnFun(res);
                    })
		}
		//保单详情接口新
		this.insurancedetail=function(sendData,returnFun){
			$http({
				method : 'GET',
				url :window.apiBacePath+'policy/getpolicydetailinfo?contno='+sendData+'&v='+Math.random(),
				data:''
			})//尾部
			.then(function success(response) {
				returnFun(response);
			})
		}
		//获取投联账户信息
		this.getAccountInfo=function(sendData,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath+"account/getaccountlistinfo",
				data :sendData
									
			})
			.then(function success(response) {
				returnFun(response);
			})
		}
		//是否需要测评问卷
		this.isNeedRiskassess = function(perno, merchandiseCode, returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath+"goods/checkisriskassess?perno="+perno+"&merchandisecode="+merchandiseCode+"&v="+Math.random(),
				headers:{
	                Authorization:tkLoginToken
	            }
			})
			.then(function success(response) {
				returnFun(response);
			})
		}
//移动端通过输入密码的方式加入团体
		this.joinGroup = function(sendData,returnFun,errFun){
			$http({
                method:'POST',
                url:window.apiBacePath + 'api/v2/group/joingroup',
                headers:{
	                Authorization:tkLoginToken
	            },
	            data: sendData
				}).then(function success(response){
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(response)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		};
		//移动端获取团体的加入密码
		this.getGrpInfo = function(grpno,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + "api/v2/group/getgroupinfo?grpno="+grpno+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: ''
            }).then(function success(res){
            	if(!_checkToken(res)){return false};
				returnFun(res);
            },function error(res){
            	if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
            })
		};
		//校验用户的团体密码是否正确
		this.checkInviteCode = function(grpNo,grpInviteCode,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + '/group/checkinvitecode?grpno=' + grpNo +'&grpinvitecode='+ grpInviteCode + '&v='+Math.random(),
                headers:{
                    Authorization:tkLoginToken
                },
                params: ''
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//种子投保注册+登录+绑定团体
		this.seedLogin = function(perObj,returnFun,errFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + '/user/seedlogin',
                data: perObj
            }).then(function success(response) {
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//支付成功后，获取推荐产品
		this.getRecommendGoodlist  = function(sendData,returnFun,errFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + '/goods/getrecommendgoodlist',
                headers:{
                    Authorization:tkLoginToken
                },
                data: sendData
            }).then(function success(response) {
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//验证图形验证码并发送手机激活码（顾）
		this.checkImgAndGetMsg = function(sendData,returnFun,errFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + 'api/v1/message/sms/send',
                headers:{
                    Authorization:tkLoginToken
                },
                data: sendData
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//忘记密码获取新的密码
		this.forgetPwdAndGetNewPwd = function(sendData,returnFun,errFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + 'api/v1/message/sms/send',
                headers:{
                    Authorization:tkLoginToken
                },
                data: sendData
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//导入用户重置密码及维护手机号
		this.resetPwdAndMobilephone = function(sendData,returnFun,errFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + 'api/v1/message/sms/validate',
                headers:{
                    Authorization:tkLoginToken
                },
                data: sendData
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		};
		//获取投联账户利益信息
		this.getAccountdetail=function(sendData,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath +"account/getaccountdetail",
				headers:{
					Authorization:tkLoginToken
				},
				data :sendData
				
			})
			.then(function success(response) {
					returnFun(response);
				})
		}
		//获取token令牌
		this.getTokenInfo=function(preNo,customtype,returnFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + 'jwt/getjwt?perNo='+ preNo +'&customtype='+customtype+'&v='+Math.random(),
                params:''
            }).then(function success(res){
                if(res.data.success){
                    var tkLoginToken = res.data.data.returnMsgs.loginToken || '';
                    window.ctrlLocalStorage.setLocalStorage('tkLoginToken',tkLoginToken);
                    returnFun(res);
                }else{
                    returnFun(res.data.data);
                }
            },function error(res){
                 returnFun(res.data);
            })
		}
		//发送风险评估结果
		this.sendRiskData=function(sendData,returnFun){
			$http({
				method : 'POST',
				url : window.apiBacePath+"api/v1/risklevel/add",
				data :JSON.stringify(sendData)
			}).then(function success(response){
				returnFun(response);
			})
		}
		////保全接口(目前应用于保单邮箱修改)
		this.insurance=function(sendData,returnFun){
			$http({
				method : 'POST',
				url :window.apiBacePath+ 'preservation/modifypolicy',
				data:JSON.stringify(sendData)
				
			})//尾部
			.then(function success(response) {
				returnFun(response);
			})
		}
		//保单发送电子邮箱接口
		this.sendEmail=function(sendData,returnFun){
			 $http({
                    method: 'POST',
                    url:  commonUrl.oldDataServletURL,
                    headers:{
                             'Content-Type':'multipart/form-data'
                            },
                     params:{
                            'BusiName': 'DealPolicyUI',
                            'Operate': 'toEmail',
                             'Data':sendData
                             }
                    }).then(function success(res){
                    	returnFun(res)
                    });
		};
		//ngpf订单保存，保存格式为nbpf订单模型
		this.nbpfSaveOrder = function(data,status,returnFun){
			$http({
					method: 'POST',
					url: window.apiBasePath + 'api/v1/order/nbpf/save?status='+status,
					data: data
				})
				.then(function success(response) {
					returnFun(response);
				})
		}
		//核保结论
		this.underWrite = function(data,returnFun){
			$http({
					method: 'POST',
					url: window.apiBasePath + 'api/v1/order/underwrite/get',
					data: data
				})
				.then(function success(response) {
					returnFun(response);
				})
		}
		this.getQuestion = function(obj, returnFun){
			$http({
				method: 'GET',
				url:  window.apiBasePath + 'api/v1/questionnaire/get?' + Math.random(),
				params:obj
			}).then(function success(resp) {
				returnFun(resp);
			})
		}
		//获取政策声明信息,1为PC端
		this.getPolicyStatementInfoPC = function(perNo,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath+ 'product/getpolicystatementinfo?perno='+perNo+"&type=01&equipmentsource=1"+'&v='+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(response){
            	if(!_checkToken(response)){return false};
            	returnFun(response);
            },function error(res){
            	if(!_checkToken(res)){return false};
            	typeof(errFun)!=='function' || errFun(res);
            })
		}
		//根据用户编号查询客户购物车中的所有有效订单详情
		this.getTempOrderDataGridValid = function(perno, returnFun){
			$http({
                method: 'get',
                url: window.apiBacePath + 'shopcart/temporderdatagrid/valid?perno='+perno+"&v="+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(res) {
            	returnFun(res);
            })
		}
		//订单修改
		this.orderTomodify = function(orderNo, perno, returnFun){
			 $http({
                method: 'get',
                url: window.apiBacePath + 'shopcart/temporder/tomodify?orderno='+orderNo+"&perno="+perno+"&v="+Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
            }).then(function success(res){
            	returnFun(res);
            })
		}
		//删除订单
		this.delOrder = function(orderNo, perno, returnFun){
			$http({
                method: 'get',
                url: window.apiBacePath + 'shopcart/temporder/todelete?orderno='+orderNo+"&perno="+perno + "&v="+ Math.random(),
                headers:{
					Authorization:tkLoginToken
				},
                params: {}
                }).then(function success(res){
                	returnFun(res);
                })
		}
		//购物车查看订单能否正常支付
		this.gotopayOrder = function(orderNo,perNo,returnFun,errFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + 'shopcart/gotopay?orders='+orderNo+"&perno="+perNo+'&v='+Math.random(),
                headers:{
                    Authorization:tkLoginToken
                },
                params: ''
            }).then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response)
			},function(res){
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			});
		}
		//在支付页面，校验投保人的纳税身份信息
		this.checkFetca = function(orderno,returnFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + 'api/v1/temporder/checkfetca?orderno='+ orderno+'&v='+Math.random()+'&v='+Math.random(),
                params: ''
            }).then(function success(response) {
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				returnFun(res)
			});
		}
		//获取税延产品收益率（915、916、917）
		this.getAccountInfoOther=function(sendData,returnFun){
			$http({
				method : 'GET',
				url : window.apiBacePath+"account/getrate?riskcode="+sendData+'&v='+Math.random(),
				data :''
				
			})
			.then(function success(response) {
				returnFun(response);
			})
		}
		//获取商城消息盒子内容
		this.getmessagebox=function(data,returnFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + 'messagebox/msg/list',
                data:data
            }).then(function success(response) {
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				returnFun(res)
			});
		}
		//获取消息详情并标记已读
		this.getmessageMain=function(messageno,returnFun){
			$http({
                method: 'GET',
                url: window.apiBacePath + 'messagebox/msg/read?messageno='+messageno,
                params: ''
            }).then(function success(response) {
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				returnFun(res)
			});
		}
		//方案调整的消息，发送页面路径
		this.sendAddfeeURL = function(data,returnFun){
			$http({
                method: 'POST',
                url: window.apiBacePath + 'messagebox/msg/handle',
                data:data
            }).then(function success(response) {
				returnFun(response)
			}, function error(res) {
				// 请求失败执行代码
				returnFun(res)
			});
		}
		//单点登录功能，通过token登录
		this.loginByToken=function(sendData,returnFun){
			$http({
					method : 'GET',
					url : window.springBootApi + 'OtherSystemLoginSy?loginToken='+sendData+'&v='+Math.random(),
					data : sendData
									
				}).then(function success(response){
					returnFun(response);
				})
		}
		//获取用户指定的业务员
		this.getPointAgent = function(agentCode,goodsNo,returnFun,errFun){
			$http({
				method : 'GET',
				url : window.apiBacePath+"api/v1/agent/getpointagentinfo?agentCode="+agentCode+"&goodsNo="+goodsNo+'&v='+Math.random(),
				data : ''
			})
			.then(function success(response){
				returnFun(response);
			},function error(res){
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//简易注册后，完善个人信息
		this.improveInfo = function (data,resFun,errFun){
			$http({
				method: 'POST',
	            url: window.apiBacePath + 'api/v1/regist/personal/filluserinfo',
	            headers:{
	                Authorization:tkLoginToken
	            },
	            data: data
	        }).then(function success(response) {
	        	//if(!_checkToken(response)){return false};
	        	resFun(response);
	        },function error(res){
	        	//if(!_checkToken(res)){return false};
	        	typeof(errFun)!=='function' || errFun(res);
			})
		}
		//更新session
		this.updataSession = function(data,resFun){
			$http({
				method:"POST",
				url:window.apiBacePath+"session/toupdate",
				data:JSON.stringify(data)
			}).then(function success(res){
				resFun(res);
			})
		}
		//退出登录老接口
		this.oldLoginOut = function(data,sucFun,errFun){
			var myOldProjectdata = {
					errorMsg: "",
					isSuccess: false,
					map: {},
					validation: true,
					valuetype: {},
					vflag: true
				}
			$http({
				method: 'POST',
				url: commonUrl.oldDataServletURL,
				params: {
					'BusiName': 'LoginBL',
					'Operate': 'logout',
					'Data': myOldProjectdata
				}
			}).then(function success(res){
				window.location.href = window.cBasePath+"pc/pages/login/login.html";
				sucFun(res);
			},function(res){
				errFun(res);
			})

		}
		//根据tkLoginToken重新登录
		this.tkRelogin = function(sucFun){
			window.ctrlLocalStorage.setLocalStorage('tkLoginToken',tkLoginToken);
			$http({ 
				method: 'GET',
				url: window.cBasePath + 'OtherSystemLoginSy?loginToken='+tkLoginToken+"&v="+Math.random()
			}).then(function success(res){
				sucFun(res);
			})
		}
		//获取投保人的医保卡的余额（福州医保卡）	
		this.queryBalance = function(sendData,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'medicalCard/queryBalance',
				data:sendData
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//个人用户注销账户
		this.persondelaccount = function(data,sucFun,errFun){
			$http({
				url:window.apiBacePath + 'groupinfo/persondelaccount',
				method : 'POST',
				headers:{
					Authorization:tkLoginToken
			   },
			   data:data
			}).then(function success(res){
				sucFun(res);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//根据不同的场景，获取业务员
		this.getAgentByScene = function(sendData,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'goods/getagent',
				data:sendData
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//根据业务员和产品，判断用户是否可以购买
		this.isUserCanBuy = function(sendData,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'goods/v2/checkifcanbuygoods',
				data:sendData
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//初始化场景信息
		this.initScene = function(sessionScene){
			window.ctrlSessionStorage.setSessionStorage("sessionScene",sessionScene);
		}
		//获取销售业务员的渠道信息
		this.getAgentChannel = function(agentcode,returnFun,errFun){
			$http({
				url:window.apiBacePath + 'query/agent?agentCode='+agentcode+'&v='+Math.random(),
				method : 'GET',
			    data:''
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				returnFun(res);
			},function error(res){
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//中介业务员更换默认的tk业务员
		this.updateserviceagentno = function(serviceagentno,perno,resFun,errFun){
			$http({
				method : 'GET',
				url : window.apiBacePath+"/api/v2/agent/updateserviceagentno?serviceagentno="+serviceagentno+'&perno='+perno+'&v='+Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			})
			.then(function success(response){
				resFun(response);
			},function error(res){
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//修改团体的团购码
		this.modifyGBuyCode = function(data,resFun,errFun){
			$http({
				url:window.apiBacePath + 'api/v2/agent/updategrpsalesman',
				method:'POST',
				data:data
			}).then(function success(res){
				if(!_checkToken(res,2)){return false};
				resFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//修改团体认证码
		this.editgroupCode = function(data,sucFun,errFun){
			$http({
				url:window.apiBacePath + 'api/v2/group/editgroupinfo',
				method:'POST',
				data:data
			}).then(function success(res){
				if(!_checkToken(res,2)){return false};
				sucFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//发送业务员的手机号到用户的手机
		this.sendAgentPhone = function(data,sucFun,errFun){
			$http({
				url:window.apiBacePath + 'api/v1/message/sms/sendAgentPhone',
				method:'POST',
				data:data
			}).then(function success(res){
				sucFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//团体用户修改密码
		this.revisePassword = function(data,sucFun,errFun){
			$http({
				url:window.apiBacePath + 'personcenter/resetpwd',
				method:'POST',
				data:data
			}).then(function success(res){
				if(!_checkToken(res,2)){return false};
				sucFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//团体用户绑定和修改手机号
		this.registerphone = function(customno,validateCode,newPhone,sucFun,errFun){
			$http({
				url:window.apiBacePath + 'api/v1/group/updategroupphone?customno='+customno+"&validateCode="+validateCode+'&newPhone='+newPhone+'&v='+Math.random(),
				method:'GET',
				headers:{
                    Authorization:tkGroupLoginToken
                },
				params: ''
			}).then(function success(res){
				if(!_checkToken(res,2)){return false};
				sucFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//团体用户绑定和修改邮箱号
		this.setmailbox = function(customno,newEmail,sucFun,errFun){
			$http({
				url:window.apiBacePath + 'api/v1/group/updategroupemail?customno='+customno+'&newEmail='+newEmail+'&v='+Math.random(),
				method:'GET',
				headers:{
                    Authorization:tkGroupLoginToken
                },
				params: ''
			}).then(function success(res){
				if(!_checkToken(res,2)){return false};
				sucFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//团体用户注销账户
		this.accountlogout = function(data,sucFun,errFun){
			$http({
				url:window.apiBacePath +'groupinfo/delaccount ',
				method:'POST',
				headers:{
                    Authorization:tkGroupLoginToken
                },
				data:data
			}).then(function success(res){
				if(!_checkToken(res,2)){return false};
				sucFun(res);
			},function error(err){
				errFun(err);
			})
		}
		//获取团体信息
		this.getGroupInfo = function(data,sucFun,errFun){
			$http({
				method : 'GET',
				headers:{
                    Authorization:tkGroupLoginToken
                },
				url  :window.apiBacePath + "users/querygroupcustomerinfo?groupno="+data+"&v="+Math.random(),
				params: ''
								
			}).then(function success(response){
				if(!_checkToken(response,2)){return false};
				sucFun(response);
			},function error(res){
				errFun(res);
			});
		}
		
		//员工报表查询下载
		//http://localhost:8004/tkpmallrc/groupinfo/taxquery?grpNo=00000000000000031034&year=2017&month=8
		this.getTaxList = function(data,sucFun,errFun){
			$http({
				method : 'GET',
				url  :window.apiBacePath + "groupinfo/taxquery",
				headers:{
                    Authorization:tkGroupLoginToken
                },
				params: {
					"grpNo":data.grpNo,
					"year":data.year,
					"month": data.month,
					"v":Math.random()
				}
								
			}).then(function success(response){
				sucFun(response);
			},function error(res){
				errFun(res);
			});
		}
		//团体报税--导出清单
		this.downloadTaxExcel = function(data,sucFun,errFun){
			$http({
				method : 'GET',
				url  :window.resourcePath + "taxdeclaration/download/excel",
				headers:{
                    Authorization:tkGroupLoginToken
                },
				params: {
					"year":data.year,
					"month":data.month,
					"grpno": data.grpno,
					"v":Math.random()
				}
								
			}).then(function success(response){
				if(!_checkToken(response,2)){return false};
				sucFun(response);
			},function error(res){
				errFun(res);
			});
		}
		//下载单个报税凭证
		this.fnDownTax = function(data){
			window.open(window.resourcePath + "taxdeclaration/download?docid="+data + "&v="+ Math.random());
		}
		//下载多个个税凭证
		this.fnDownMoreTax = function(aData,sucFun,errFun){
			var sData = "";
			for(var i = 0; i < aData.length;i++){
				sData += aData[i] + "-";
			}
			sData = sData.substr(0,sData.length-1);
			window.open(window.resourcePath + "taxdeclaration/download/batch?docids="+sData + "&v="+ Math.random());
		}
		 //查询报税下载
		 this.getEmpTaxApply = function(data,sucFun,errFun){
		 	$http({
				method : 'POST',
				url  :window.apiBacePath + "groupinfo/emptaxapply",
				headers:{
                    Authorization:tkGroupLoginToken
                },
				data: data
								
			}).then(function success(response){
				if(!_checkToken(response,2)){return false};
				sucFun(response);
			},function error(res){
				errFun(res);
			});
		 }
		 //审批报税通过or退回
		 this.fnUpDateTaxApplyBatchProceed = function(data,sucFun,errFun){
		 	$http({
				method : 'POST',
				url  :window.apiBacePath + "groupinfo/taxapplybatchproceed",
				headers:{
                    Authorization:tkGroupLoginToken
                },
				data: data
								
			}).then(function success(response){
				if(!_checkToken(response,2)){return false};
				sucFun(response);
			},function error(res){
				errFun(res);
			});
		 }
		 //修改团体的信息/users/updategroupcustomerinfo
		 this.updateGroupCustomerInfo = function(sendData,returnFun,errFun){
			$http({
				method : 'POST',
				url  :window.apiBacePath + "users/updategroupcustomerinfo",
				headers:{
                    Authorization:tkGroupLoginToken
                },
				data: sendData
								
			}).then(function success(response){
				if(!_checkToken(response,2)){return false};
				returnFun(response);
			},function error(res){
				errFun(res);
			});
		 }
		 //获取8004团体sesssion
		 this.getRcSession=function(tokenType,returnFun){
		 	var sTkLoginToken = window.ctrlLocalStorage.getLocalStorage(tokenType);
			if(sTkLoginToken){
				var aTkLoginToken = sTkLoginToken.split(".");
				if(aTkLoginToken.length > 2){
					//var jwt = window.base64.decode(aTkLoginToken[1]).replace(/\0/g, '');
					var jwt = window.base64.decode(urlsafe_b64decode(aTkLoginToken[1])).replace(/\0/g, '');
					var returnData = JSON.parse(jwt);
					returnData.customNo = returnData.personId;
					returnData.mHasLogin = 'Y';
					window.userSession = returnData;
					returnFun(returnData);
				}else{
					var data = {
						mHasLogin : 'N'
					}
					returnFun(data);
				}
				
			}else{
				var data = {
					mHasLogin : 'N'
				}
				returnFun(data);
			}
			function ensurePadding(arr){
				var result = arr;
				var paddingCount = 0;
				var remainder = arr.length%4;
				if (remainder == 2 || remainder == 3) {
			        paddingCount = 4 - remainder;
			    }



			    if (paddingCount > 0) {
			        //result = new char[chars.length + paddingCount];
			        //System.arraycopy(chars, 0, result, 0, chars.length);
			        for (var i = 0; i < paddingCount; i++) {
			            result[arr.length + i] = '=';
			        }
			    }
			    return result;
			}
			function urlsafe_b64decode(str){
				var chars = str.split('');
				chars = ensurePadding(chars);
				 for (var i = 0; i < chars.length; i++) {
			        if (chars[i] == '-') {
			           chars[i] = '+';
			        } else if (chars[i] == '_') {
			            chars[i] = '/';
			        }
			    }
				//String base64Text = new String(chars);
				var base64Text = chars.join('');
			    return base64Text;
			}
		 }
		 // 团体信息，团体导入员工列表查询
		 this.getImportstaffinfo = function (grpno, name, mobilephone, idno, returnFun) {

            $http({
                method: 'GET',
                url: window.apiBacePath + 'api/v1/group/getImportstaffinfo',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                params: {
                    grpno: grpno,
                    v:Math.random()
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，团体导入员工信息修改
        this.updategrpimportstaffinfo = function (updateInfo, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/updategrpimportstaffinfo',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: updateInfo
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，团体导入员工信息删除
        this.deleteimportstaffinfo = function (grpno, list, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/deleteimportstaffinfo',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: {
                    'grpNo': grpno,
                    'ids': list
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(res)
            });
        }
        // 团体信息，团体导入员工信息提交
        this.saveimportstaffinfo = function (grpno, list, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/saveimportstaffinfo',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: {
                    'grpNo': grpno,
                    'ids': list
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }

        // 团体信息，在职员工查询  http://localhost:8004/tkpmallrc/api/v1/group/queryInserviceStaff
        this.queryInserviceStaff = function (grpno, name, mobilephone, idno, returnFun) {
            $http({
                method: 'get',
                url: window.apiBacePath + 'api/v1/group/queryInserviceStaff',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                params: {
                    grpno: grpno,
                    name: name,
                    mobilephone: mobilephone,
                    idno: idno,
                    v:Math.random()
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，在职员工删除 http://localhost:8004/tkpmallrc/api/v1/group/deleteStaff
        this.deleteStaff = function (grpno, pernos, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/deleteStaff',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: {
                    grpNo: grpno,
                    ids: pernos
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，员工离职  http://localhost:8004/tkpmallrc/api/v1/group/dismissStaff
        this.dismissStaff = function (grpno, pernos, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/dismissStaff',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: {
                    grpNo: grpno,
                    ids: pernos
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }


        // 团体信息，离职员工查询  http://localhost:8004/tkpmallrc/api/v1/group/queryDismissionStaff
        this.queryDismissionStaff = function (grpno, name, mobilephone, idno, returnFun) {
            $http({
                method: 'get',
                url: window.apiBacePath + 'api/v1/group/queryDismissionStaff',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                params: {
                    grpno: grpno,
                    name: name,
                    mobilephone: mobilephone,
                    idno: idno
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，员工复职  http://localhost:8004/tkpmallrc/api/v1/group/restorationStaff
        this.restorationStaff = function (grpno, pernos, returnFun) {
            var test = JSON.stringify({
                grpNo: grpno,
                ids: pernos
            });
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/restorationStaff',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: test
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }

        // 团体信息，新员工审核列表
        this.getnewstaffinfo = function (grpno, name, mobilephone, idno, returnFun) {
            var searchObj = {
                grpno: grpno
            };
            if (name) {
                searchObj.name = name;
            }
            if (mobilephone) {
                searchObj.phone = mobilephone;
            }
            if (idno) {
                searchObj.idno = idno;
            }
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/getnewstaffinfo',
                data: searchObj
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，新员工审核-通过
        this.savenewstaffinfo = function (grpno, pernos, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/savenewstaffinfo',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: {
                    grpno: grpno,
                    pernos: pernos
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        // 团体信息，新员工审核-退回
        this.sendbacknewstaffinfo = function (grpno, pernos, returnFun) {
            $http({
                method: 'post',
                url: window.apiBacePath + 'api/v1/group/sendbacknewstaffinfo',
                headers:{
                    Authorization:tkGroupLoginToken
                },
                data: {
                    grpno: grpno,
                    pernos: pernos
                }
            }).then(function success(response) {
            	if(!_checkToken(response,2)){return false};
                returnFun(response)
            }, function error(res) {
                // 请求失败执行代码
                returnFun(response)
            });
        }
        //退出团体登陆
        //退出登录（token）
		this.logGroupOut = function(returnFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkGroupLoginToken
				},
                url: window.apiBacePath + 'user/logout',
                data:{}
			}).then(function success(res){
				window.ctrlLocalStorage.setLocalStorage('tkGroupLoginToken', '');
            	returnFun(res);
            });
		};
		//团体注册接口
		this.gropRegister=function(data,validcode,returnFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkGroupLoginToken
				},
                url: window.apiBacePath + 'users/groupregister?dynamicCode=validcode',
                data:data
			}).then(function success(res){
				window.ctrlLocalStorage.setLocalStorage('tkGroupLoginToken', '');
            	returnFun(res);
            });
		};
		//团体弹性用户通过识别码获取信息
		this.gropInsurance=function(recogcode,returnFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkGroupLoginToken
				},
                url: window.apiBacePath + 'users/querytxuserinfo?recogcode='+recogcode,
                data:{}
			}).then(function success(res){
				window.ctrlLocalStorage.setLocalStorage('tkGroupLoginToken', '');
            	returnFun(res);
            });
		};
		//个人注册（繁琐版）
		this.pcpersonal=function(data,verificationCode,returnFun,errFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkGroupLoginToken
				},
                url: window.apiBacePath + 'api/v1/regist/pcpersonal?verificationCode='+verificationCode+'&v='+Math.random(),
                data:data
			}).then(function success(res){
            	returnFun(res);
            },function error(res){
            	errFun(res);
            });
		};
		//用户满意度评价结果提交
		this.userevaluateResult = function(data,sucFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'person/evaluation/save',
				data:data
			}).then(function success(response){
				sucFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		// 税延代扣代缴导入员工名单
		this.taxExtensionEmployee = function(batchNo,sucFun,errFun){
			$http({
				method: "get",
				url: window.apiBacePath + 'api/v1/batchorder/batch/query/batchno/'+batchNo,
				params:{
					"v":Math.random()
				}
			}).then(function success(response){
				sucFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		// 删除税延代扣代缴导入员工
		this.deleteTaxExtensionEmployee = function(data,sucFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/order/delete',
				data:data
			}).then(function success(response){
				sucFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
			
		}
		//获取批单列表
		this.getGroupOrderlist=function(sucFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/batch/query/ownerorders/',
				data:{}
			}).then(function success(response){
				sucFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//团体注册校验证件号码手机号码接口
		this.regNum=function(data,returnFun,errFun){
			$http({
				method:'POST',
				headers:{
					Authorization:tkGroupLoginToken
				},
                url: window.apiBacePath + 'api/v2/group/check',
                data:data
			}).then(function success(res){
            	returnFun(res);
            },function error(res){
            	errFun(res);
            });
		};
		//校验手机号是否被注册
		this.checkPhone = function(phone,returnFun,errFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + '/api/v1/regist/checkphone?phone='+phone+'&v=' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			})
			.then(function success(response) {
				//if(!_checkToken(response)){return false};
				returnFun(response);
			},function error(res){
				errFun(res);
			})
		}
		//校验证件号号是否被注册
		this.checkIdNo = function(idtype,idno,returnFun,errFun){
			$http({
				method: 'GET',
				url: window.apiBacePath + '/api/v1/regist/checkidtypeandidno?idtype='+idtype+'&idno='+idno+'&v=' + Math.random(),
				headers:{
					Authorization:tkLoginToken
				},
				params: ''
			})
			.then(function success(response) {
				if(!_checkToken(response)){return false};
				returnFun(response);
			},function error(res){
				errFun(res);
			})
		}
		//全部服务退出功能
		//退出登录老接口
		this.loginOutAllService = function(data,sucFun,errFun){
			var myOldProjectdata = {
					errorMsg: "",
					isSuccess: false,
					map: {},
					validation: true,
					valuetype: {},
					vflag: true
				}
			$http({
				method: 'POST',
				url: commonUrl.oldDataServletURL,
				params: {
					'BusiName': 'LoginBL',
					'Operate': 'logout',
					'Data': myOldProjectdata
				}
			}).then(function success(res){
				$http({
					method:'POST',
					headers:{
						Authorization:tkGroupLoginToken
					},
	                url: window.apiBacePath + 'user/logout',
	                data:{}
				}).then(function success(res){
					window.ctrlLocalStorage.setLocalStorage('tkLoginToken', '');
					window.ctrlLocalStorage.setLocalStorage('tkGroupLoginToken', '');
	            	sucFun(res);
	            },function(res){
					errFun(res);
				});
				
			},function(res){
				errFun(res);
			})
		}

		//获取订单详情接口
		this.getGroupOrderDetail=function(batchNo,sucFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/batch/query/batchno/'+batchNo,
				data:{}
			}).then(function success(response){
				sucFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//判断点单是否可以修改银行卡
		this.checkIsReverseBankcard = function(orderNo,returnFun,errFun){
			$http({
				method: "GET",
				url: window.apiBacePath + 'acctinfo/checkisreverse?orderNo='+orderNo+"&v="+Math.random(),
				data:''
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//修改银行卡的接口/acctinfo/updatebankinfo
		this.updateBankcard = function(sendData,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'acctinfo/updatebankinfo',
				data:sendData
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		// 代扣代缴查询产品名称
		this.getProductName = function(code,sucFun,errFun){
			$http({
				method: "get",
				url: window.apiBacePath + 'product/getproductname',
				params:{
					productcode:code,
					v:Math.random()
				}
			}).then(function success(response){
				sucFun(response)
			})
		}
		//取消订单
		this.cancleorder=function(orderno,returnFun){
			$http({
				url:window.apiBacePath + "api/v1/order/v2/cancelorder?orderNo="+orderno,
				method : 'GET',
			    data:''
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				returnFun(res);
			},function error(res){
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//修改手机号
		this.changePhone = function(data,resFun,errFun){
			$http({
				url:window.apiBacePath + 'person/applicantPhone/update',
				method:'POST',
				data:data
			}).then(function success(res){
				resFun(res);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//修改电子邮箱
		this.changeEmail = function(data,resFun,errFun){
			$http({
				url:window.apiBacePath + 'person/applicantEmail/update',
				method:'POST',
				data:data
			}).then(function success(res){
				resFun(res);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}

		//企业logo展示
		this.gropLogoShow=function(groupNo,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'picture/getpictureurl?picturetype=2&customno='+groupNo+"&customtype=2&v="+Math.random(),
				data:{}
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//修改团体中经办人信息
		this.changeAgentInfo = function(data,resFun,errFun){
			$http({
				url:window.apiBacePath + 'api/v2/group/update/agent',
				method:'POST',
				data:data
			}).then(function success(res){
				resFun(res);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})			
		}
		//获取团体首页配置内容
		this.getindexData = function(dataNo,resFun,errFun){
			$http({
				url:window.apiBacePath + "/pageModel/"+dataNo+"?v="+ Math.random(),
				method : 'GET',
			    data:''
			}).then(function success(res){
				resFun(res);
			},function error(res){
				if(!_checkToken(res)){return false};
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//根据产品编码获取产品名称
		
		this.getproductname=function(productcode,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'product/getproductname?productcode='+productcode,
				data:{}
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//批单提交接口
		this.ordersubmit=function(data,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/batch/submit',
				data:data
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//批单中个单列表查询
		this.querybyowner=function(data,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/order/querybyowner',
				data:data
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
			
		}
		// 代扣代缴查询经理人信息
		this.getManagerInfo = function(codeInfo,sucFun,errFun){
			var params = codeInfo || {};
			params.v = Math.random();
			$http({
				method: "get",
				url: window.apiBacePath + 'api/v1/agent/getagentinfo',
				params:params
			}).then(function success(response){
				sucFun(response)
			})
		}

		//代扣代缴订单详情查询接口
		this.groupOrderDetail=function(orderNo,returnFun,errFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/order/query/'+orderNo,
				data:{}
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		// 代扣代缴批次信息确认
		this.confirmBatchInfo = function(data,returnFun){
			$http({
				method: "POST",
				url: window.apiBacePath + 'api/v1/batchorder/batch/confirm',
				data:data
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		
		//校验token是否有效
		this.checkToken = function(token,returnFun,errFun){
			$http({
				method: "GET",
				url: window.apiBasePath + '/jwt/checkJwt',
				headers:{
					Authorization:token
				},
				params: {
					'token' : token,
					'v' : Math.random()
				}
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		// 代扣代缴，新建批次号
		this.getNewBatchno = function(returnFun,errFun){
			$http({
				method: "get",
				url: window.apiBasePath + 'api/v1/batchorder/batch/new/batchno',
				params: {
					'v' : Math.random()
				}
			}).then(function success(response){
				returnFun(response)
			},function error(res){
				// 请求失败执行代码
				typeof(errFun)!=='function' || errFun(res);
			})
		}
		//代扣代缴订单确认提交失败——变更订单状态
		this.saveCheckResult = function(data, returnFun){
			var orderNo = data.orderNo || '';
			var checkedReason = data.checkedReason || '';
			$http({
				url:window.apiBacePath + "api/v1/batchorder/order/savecheckresult?orderno="+orderNo+ "&checkedReason="+checkedReason + "&v=" + Math.random(),
				method : 'GET',
			    data:''
			}).then(function success(res){
				if(!_checkToken(res)){return false};
				returnFun(res);
			},function error(res){
				returnFun(res);
			})
		}
		this.checkGroupIfCanBuy = function(data, returnFun){
			$http({
				url:window.apiBacePath + "groupinfo/checkifcanbuy?v=" + Math.random(),
				method : 'GET',
			    data:''
			}).then(function success(res){
				//if(!_checkToken(res)){return false};
				returnFun(res);
			},function error(res){
				returnFun(res);
			})
		}
	})