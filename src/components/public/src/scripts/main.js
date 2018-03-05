require.config({
  waitSeconds : 20,
  baseUrl: '/lib',
  paths: {
    //'vue': ENV == 'w' ? 'vue/dist/vue' : 'vue/dist/vue.min',
    'vue': 'vue/dist/vue',
    //'jquery': 'jquery/dist/jquery.min',
    'text': 'requirejs/text',
    'css': 'requirejs/css',
    'clipboadrd': 'others/clipboard.min',
    'md5': 'others/md5.min',
    'common': '../src/scripts/common',
    'components': '../src/scripts/components'
  },
  shim: {
    'others/cryptico.min': {
    },
    'others/encrypt': {
    },
    'others/wow': {
    },
    'others/exporting': {
      deps : ['others/highstock']
    },
    'others/highcharts': {
      exports: "Highcharts"
    },
    'others/highstock': {
      exports: "Highstock"
    }
  }
});
//require(['pace'], function(pace){
  // pace.start({
  //   ajax: false
  // })
//});
/*
* 检测IE浏览器版本
* */
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if(fIEVersion == 7) {
            return 7;
        } else if(fIEVersion == 8) {
            return 8;
        } else if(fIEVersion == 9) {
            return 9;
        } else if(fIEVersion == 10) {
            return 10;
        } else {
            return 6;//IE版本<=7
        }
    } else if(isEdge) {
        return 98;//edge
    } else if(isIE11) {
        return 11; //IE11
    }else{
        return 99;//不是ie浏览器
    }
}
/*IE11以下不支持*/
if(IEVersion() < 11){
    top.location.href = '/sorry'
}

/*
* 合并盘口排序使用hashMap类
* 将数组转换为对象进行合并排序
* */
function hashMap() {
    this.keys = new Array();
    this.data = new Array();
    //添加键值对
    this.put = function(key, value) {
        if (this.data[key] == null ) {
            //如键不存在则身【键】数组添加键名
            this.keys.push(key);
        }
        this.data[key] = value;
        //给键赋值
        this.keys.sort(this.sortNumber);

    };
    this.sortNumber = function(a, b){
        return a - b
    };
    this.removeByValue = function(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
        this.keys.sort(this.sortNumber);
    };
    //获取键对应的值
    this.get = function(key) {
        return this.data[key];
    };
    //去除键值，(去除键数据中的键名及对应的值)
    this.remove = function(key) {
        this.removeByValue(this.keys, key);
        this.data[key] = null ;
    };
    //判断键值元素是否为空
    this.isEmpty = function() {
        return this.keys.length == 0;
    };
    //获取键值元素大小
    this.size = function() {
        return this.keys.length;
    };
    //遍历Map,执行处理函数. 回调函数 function(key,value,index){..}
    this.each = function(fn) {
        if (typeof fn != 'function') {
            return;
        }
        var len = this.keys.length;
        for (var i = 0; i < len; i++) {
            var k = this.keys[i];
            fn(k, this.data[k], i);
        }
    };
    //获取键值数组,返回键值对象{key,value}的数组
    this.entrys = function() {
        var len = this.keys.length;
        var entrys = new Array(len);
        for (var i = 0; i < len; i++) {
            entrys[i] = {
                key: this.keys[i],
                value: this.data[i]
            };
        }
        return entrys;
    };
}

/*EXX推送实例*/
//var ExxWebSocket = new webSocketClass(DOMAIN_WSS);
var ExxWebSocket = {
    //推送接口
    wsUrl: DOMAIN_SOCKET + '/websocket',
    //推送状态变量
    openWebSocket : false,
    //是否开启盘口增量更新（仅推送方式支持）
    openDishUpdata : true,
    //是否开启压缩
    isZip : false,
    //是否开启二进制
    isBinary : false,
    //消息定时器
    sendMsgInterval : null,
    //频道管理器
    channelManage : null
};
    //初始化WebSocket
    ExxWebSocket.init = function () {
        if(top.location.pathname.indexOf('/trade') == -1 && top.location.pathname.indexOf('/trading') == -1){
            //屏蔽不需要的WS请求
            return false;
        }
        var _this = this;
        //清空频道管理器
        _this.channelManage = {};
        //清除消息定时器
        window.clearInterval(_this.sendMsgInterval);
        //建立握手
        if ('WebSocket' in window) {
            _this.websocket = new WebSocket(_this.wsUrl);
        } else if ('MozWebSocket' in window) {
            _this.websocket = new MozWebSocket(_this.wsUrl);
        } else {
            _this.openWebSocket = false;
            console.log('Your browser does not support websocket.')
            return false;
        }
        _this.websocket.onopen = function(event) {
            _this.openWebSocket = true;
            _this.onOpen && _this.onOpen(event);
            window.onbeforeunload =function(){
                _this.websocket && _this.websocket.close();
            }
        };
        _this.websocket.onmessage = function(event) {
            _this.onMessage && _this.onMessage(event);
        };
        _this.websocket.onerror = function(event) {
            _this.openWebSocket = false;
            _this.onError && _this.onError(event);
        };
        _this.websocket.onclose = function(event) {
            _this.openWebSocket = false;
            _this.onClose && _this.onClose(event);
        };
    }
    //处理二进制数据
    ExxWebSocket.unBinary = function (datas, callback) {
        var doCallback = function (result) {
            //直接处理为json对象
            if(result.indexOf("(") != 0){
                result = eval("("+result+")");
            }else{
                result = eval(result);
            }
            if(typeof callback == 'function'){
                return callback(result);
            }else{
                return result;
            }
        }
        if (datas instanceof Blob) {
            var reader = new FileReader();
            reader.readAsText(datas);
            reader.onloadend  = function(evt){
                if(evt.target.readyState == FileReader.DONE){
                    doCallback(evt.target.result);
                }else{
                    doCallback(datas);
                }
            }
        }else{
            doCallback(datas);
        }
    }
    //发送消息队列
    ExxWebSocket.sendMessage = function () {
        var _this = this;
        //console.log(_this.websocket.readyState, _this.websocket.OPEN, _this.openWebSocket)

            for(var key in _this.channelManage){
                var channel = _this.channelManage[key];
                //如果消息不为空且未发送过的频道才推送
                if(channel.message != "" && !channel.sended){
                    //加入自定义参数
                    channel.message.isZip = _this.isZip;
                    channel.message.binary = _this.isBinary;
                    //发送消息
                    _this.websocket.send(JSON.stringify(channel.message));
                    //console.log('send message succses ' + JSON.stringify(channel.message));
                    //标识为已处理
                    channel.sended = true;
                }
            }
        if(!_this.openWebSocket){
            console.log('reconnect websocke.', _this.openWebSocket)
            _this.init();
        }
    }
    //处理返回数据的方法
    ExxWebSocket.dealMessage = function (json) {
        var _this = this.channelManage;
        var result = json;
        var channel = result.channel;//推送返回频道处理
        if(!channel){
            channel = result[0].channel;
        }
        /**
         * 反向处理回调方法  回调方法写在调用接口的地方
         * 交易记录键值：dealRecord
         * 盘口数据键值：dishData
         * 委托记录键值：entrustRecord
         * K线数据键值：klineData
         */
        if(channel.indexOf("_cny_lasttrades") != -1){
            //console.log(channel);
            _this['dealRecord'].method && _this['dealRecord'].method(result);
        }
        if(channel.indexOf("_cny_depth") != -1){
            //console.log(channel);
            _this['dishData'].method && _this['dishData'].method(result);
        }
        if(channel.indexOf("_kline_") != -1){
            var ifr = document.getElementById('marketFrame');
            var win = ifr.window || ifr.contentWindow;
            win.updateKlineData(result); // 调用iframe中的a函数
            //console.log(channel);
            //_this['klineData'].method && _this['klineData'].method(result);
        }
    }
    ExxWebSocket.onOpen = function (event) {
        var _this = this ;
        console.log('websocket init success.')
        //处理消息队列的定时器
        _this.sendMsgInterval = setInterval(function () {
            _this.sendMessage();
        },1000);
    };

    ExxWebSocket.onMessage = function (event) {
        //处理收到的数据
        //console.log(event.data);
        var datas = event.data;
        var _this = this;
        _this.unBinary(datas, function (json) {
            //console.log(json);
            _this.dealMessage(json);
        })

    }
    //初始化
    ExxWebSocket.init();


