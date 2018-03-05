Array.prototype.getObject = function (key, value) {
    var obj = this.filter(function (obj) {
        return obj[key] == value
    })[0];
    return obj ? obj : {};
};
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
Array.prototype.movePos = function (n, m) {
    n = n < 0 ? 0 : (n > this.length - 1 ? this.length - 1 : n);
    m = m < 0 ? 0 : (m > this.length - 1 ? this.length - 1 : m);

    if (n === m) {
        return this;
    } else {
        if (n > m)
        {
            var temp = [this[m], this[m] = this[n]][0];
            for (var i = m + 1; i <= n; i++) {
                temp = [this[i], this[i] = temp][0];
            }
        } else {
            var temp = [this[m], this[m] = this[n]][0];
            for (var i = m - 1; i >= n; i--) {
                temp = [this[i], this[i] = temp][0];
            }
        }
        return this;
    }
};

Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}


String.prototype.isDecimal = function () {
    return /^\d+(\.\d+)?$/.test(this);
};
String.prototype.decimalFormat = function (decimal) {
    var val = this.trim();
    if (!val.isDecimal()) {
        return val;
    }
    var m = decimal + 1;
    if (val.indexOf(".") > 0 && val.substring(val.indexOf(".")).length > m) {
        val = val.substring(0, val.indexOf(".") + m);
    }
    return val;
};
// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// to avoid the entire page breaking, without having to do a check at each usage of Storage.
if (typeof localStorage === 'object') {
    try {
        localStorage.setItem('localStorage', 1);
        localStorage.removeItem('localStorage');
    } catch (e) {
        Storage.prototype._setItem = Storage.prototype.setItem;
        Storage.prototype._getItem = Storage.prototype.getItem;
        Storage.prototype.setItem = function () {
            alert('localStorage disabled');
        };
        Storage.prototype.getItem = function () {
            alert('localStorage disabled');
        };
    }
}
var Methods = {
    isEmail: function (str) {
        var emailReg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/;
        return emailReg.test(str);
    },
    isPhone: function (str) {
        var regExp = new RegExp("((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)");
        return regExp.test(str);
    },
    isAllNumber: function (str) {
        var regExp = new RegExp("^[0-9]*$");
        return regExp.test(str);
    },
    isNumber: function (value) {
        var patrn = /^(-)?\d+(\.\d+)?$/;
        if (patrn.exec(value) == null || value == "") {
            return false
        } else {
            return true
        }
    },
    checkUserType: function (userName) {
        var userType;
        if (this.isEmail(userName)) {
            userType = 2
        } else if (this.isAllNumber(userName)) {
            userType = 1
        } else {
            userType = 3
        }
        return userType
    },
    checkPwd: function (pwd) {
        var pwdReg = /^((?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$)|((?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$)|((?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$)|((?=.*[A-Z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$)$/
        return pwdReg.test(pwd);
    },
    checkPwdStrength: function (pwd) {
        var level = 0, index = 1;
        if (pwd.length >= 6 && pwd.length <= 20) {
            if (/\d/.test(pwd)) level++;
            if (/[a-z]/.test(pwd)) level++;
            if (/[A-Z]/.test(pwd)) level++;
            if (/\W/.test(pwd)) level++;
            if (level > 1 && pwd.length > 12) level++;
        }
        return level
    },
    coverPhone: function (phone) {
        var phoneAry = phone.split(' ');
        if (phoneAry.lenght > 1) {
            phoneAry[1] = phoneAry.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            return phoneAry.join(' ');
        }
        return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    },
    IEVersion : function() {
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
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
                return 6;
            }
        } else if(isEdge) {
            return 98;//edge
        } else if(isIE11) {
            return 11; //IE11
        }else{
            return 99;
        }
    },
    logout: function (data) {
        this.ajax({
            type: "GET",
            url: DOMAIN_MAIN + API_PREFIX + 'logOut',
            data: data,
            success: function (res) {
                this.deleCookie(ENV + 'currentAccountId');
                this.setCookie(ENV + 'ExchangeMode', 1);
                this.setCookie(ENV + 'TradeTheme', 'dark');
                this.setCookie(ENV + 'inputPriceMode', 0);
                this.setCookie(ENV + 'mname', 'none');
                window.localStorage.clear();
                window.location.href = '/';
            }.bind(this)
        });
    },
    checkPageActive: function () {
        var hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null;
        return document[hiddenProperty];
    },
    ajax: function (ops) {
        if (this.checkPageActive()) {
            //console.log('current page hidden.')
            return false;
        }
        var options = ops || {};
        options.url = options.url || '';
        options.type = options.type || 'POST';
        options.data = options.data || {};
        options.dataType = options.dataType || 'json';
        options.success = options.success || function (json) {
            console.log('Requirest Success');
        };
        options.error = options.error || function (json) {
            console.log(json.errorText);
        }.bind(this);

        /*$.ajaxSetup({
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            xhrFields: {
                withCredentials: true
            }
        });*/
        if (options.url != '') {
            $.ajax({
                url: options.url,
                type: options.type,
                data: JSON.stringify(options.data),
                //data: options.data,
                dataType: options.dataType,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                //processData : false,
                timeout : 20000,
                success: function (json) {
                    if(json.success){
                        return options.success(json)
                    }else{
                        return options.error(json);
                    }
                },
                error: function (json,textStatus) {
                    if(textStatus=='timeout'){
                        JuaBox.info(UB.L("请求超时"));
                    }
                    return options.error(json);
                }
            });
        } else {
            console.log('url error');
        }
    },
    //获取日期（去除时分秒）
    getDateNoTime : function(timestamp){
        var date = new Date(timestamp);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },
    ubAjax: function (ops) {
        var options = ops || {};
        options.url = options.url || '';
        options.type = options.type || 'POST';
        options.data = options.data || {};
        options.dataType = options.dataType || 'json';
        options.success = options.success || function (json) {
            console.log('Requirest Success');
        };
        options.error = options.error || function (json) {
            console.log(json.rd);
        }.bind(this);

        /*$.ajaxSetup({
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            xhrFields: {
                withCredentials: true
            }
        });*/
        if (options.url != '') {
            $.ajax({
                url: options.url,
                type: options.type,
                data: options.data,
                //data: options.data,
                dataType: options.dataType,
                //crossDomain: true,
                //processData : false,
                success: function (json) {
                    if(json.suc){
                        return options.success(json)
                    }else{
                        return options.error(json);
                    }
                },
                error: function (json) {
                    return options.error(json);
                }
            });
        } else {
            console.log('url error');
        }
    },
    getJSONP: function (ops) {
        if (this.checkPageActive()) {
            //console.log('current page hidden.')
            return false;
        }
        var options = typeof ops == 'object' ? ops : {};
        options.url = options.url || '';
        options.data = options.data || {};
        options.success = options.success || function (res) {
            console.log('Requirest Success');
        };
        options.error = options.error || function (res) {
            var resMsg = res.resMsg;
            switch (resMsg.code) {
                // case 5002:
                //   //JuaBox.showTip(resMsg.message);
                //     console.log(resMsg.message)
                //    /* swal({
                //         text: resMsg.message,
                //         icon: "error"
                //     });*/
                //   window.setTimeout(function(){
                //     //window.location.replace('/u');
                //   }, 1000);
                //   break;
                default:
                    console.log(resMsg.message)
                //JuaBox.sure(resMsg.message);
                /*swal({
                    text: resMsg.message,
                    icon: "error"
                });*/
            }
        };
        var url = options.url + '?' + $.param(options.data) + '&jsoncallback=?';
        if (options.url != '') {
            $.getJSON(url, function (res) {
                var resMsg = res.resMsg;
                if (resMsg.code == 1000) {
                    options.success(res);
                } else {
                    return options.error(res);
                }
            });
        } else {
            console.log('url error');
        }
    },
    callWebSocket: function () {
        var socket;
        var options = typeof ops == 'object' ? ops : {};
        var apiDomain = "wss://api.chbtc.com:9999/websocket";
        options.onmessage = options.onmessage || function (event) {
            console.log(event)
        };
        options.onopen = options.onopen || function (event) {
            console.log(event)
        };
        if (!window.WebSocket) {
            window.WebSocket = window.MozWebSocket;
        }
        if (window.WebSocket) {
            socket = new WebSocket(apiDomain);
            socket.onmessage = options.onmessage(event);
            socket.onopen = options.onopen(event);
        } else {
            alert("Your browser does not support Web Socket.");
        }
    },
    getUserInfo: function (callback) {
        if (!ISLOGIN) {
            return false;
        }
        Methods.getJSONP({
            url: DOMAIN_MAIN + API_PREFIX + 'getUserInfo',
            success: function (res) {
                this.setLocalUserInfo(res.datas.userInfo);
                callback && callback(res.datas.userInfo);
            }.bind(this)
        });
    },
    getUserListAll: function (callback) {
        Methods.getJSONP({
            url: DOMAIN_MAIN + API_PREFIX + 'getMainUserAssetNew',
            success: function (res) {
                this.setLocalStorage(ENV + 'userList', res.datas.userFunds);
                callback && callback(res.datas.userFunds);
            }.bind(this)
        });
    },
    getUserListOne: function (callback) {
        var data = {
            targetUserId: (Methods.getCookie(ENV + 'currentAccountId') || Methods.getCookie(ENV + 'uid')),
            lastTime: 0
        };
        Methods.ajax({
            url: DOMAIN_MAIN + API_PREFIX + 'getTargetUserAssetNew',
            data: data,
            success: function (res) {
                var userList = [];
                userList[0] = res.datas.userFund;
                this.setLocalStorage(ENV + "userList", userList);
                callback && callback(userList);
            }.bind(this)
        });
    },
    getUserList: function (callback) {
        var loginUser = this.getLocalUserInfo();
        if (loginUser.userType == 1) {
            this.getUserListAll(function (userList) {
                callback && callback(userList)
            })
        } else {
            this.getUserListOne(function (userList) {
                callback && callback(userList);
            })
        }
    },
    getLocalUserList: function () {
        if (!ISLOGIN) {
            return
        }
        var userList = this.getLocalStorage(ENV + 'userList');
        if (userList == null || typeof userList != 'object') {
            this.getUserList(function () {
                top.location.reload();
            });
        } else {
            return userList;
        }
    },
    getLocalUserInfo: function () {
        if (!ISLOGIN) {
            return
        }
        var userInfo = this.getLocalStorage(ENV + 'userInfo');
        if (userInfo == null || typeof userInfo != 'object') {
            this.getUserInfo(function (data) {
                top.location.reload();
            })
        } else {
            return userInfo;
        }
    },
    getNoLoginUserInfo: function () {
        return this.getLocalStorage(ENV + 'userInfo');
    },
    setLocalUserInfo: function (userInfo) {
        this.setLocalStorage(ENV + 'userInfo', userInfo);
    },
    getLocalStorage: function (name) {
        var local = window.localStorage.getItem(name);
        try {
            var result = JSON.parse(decodeURIComponent(local));
            return result;
        } catch (e) {
            return local;
        }
    },
    setLocalStorage: function (name, value) {
        try {
            window.localStorage.setItem(name, decodeURIComponent(JSON.stringify(value)));
        } catch (e) {
            window.localStorage.setItem(name, decodeURIComponent(value));
        }
    },
    deleLocalStorage: function (name) {
        window.localStorage.removeItem(name);
    },
    encryptPwd: function (password, pubKey) {
        var encrypt = new JSEncrypt.JSEncrypt;
        encrypt.setPublicKey(pubKey);
        return encrypt.encrypt(password);
    },
    md5DynamicCode: function (userName, dynamicCode) {
        var text = MD5(userName).toUpperCase() + MD5(dynamicCode).toUpperCase();
        return MD5(text).toUpperCase();
    },
    parseQueryString: function () {
        var str = window.location.search;
        var objURL = {};
        str.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) {
                objURL[$1] = $3;
            }
        );
        return objURL;
    },
    getCookie: function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    setCookie: function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + ";domain=."+DOMAIN_BASE+"; path=/";
    },
    deleCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    getTimeHM: function (timestamp) {
        var date = new Date(parseInt(timestamp) * 1000);
        return date.getHours() + ':' + date.getMinutes();
    },
    getDateTime: function (timestamp, format) {
        var pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };
        if((timestamp + '').length < 13){
            timestamp = parseInt(timestamp) * 1000;
        }else{
            timestamp = parseInt(timestamp);
        }
        var date = new Date(parseFloat(timestamp));
        var year = date.getFullYear();
        var month = pad(date.getMonth() + 1);
        var day = pad(date.getDate());
        var hour = pad(date.getHours());
        var minutes = pad(date.getMinutes());
        var second = pad(date.getSeconds());
        switch (format) {
            case 'MM-DD HH:MM:SS':
                return [month, day].join('-') + ' ' + [hour, minutes, second].join(':');
                break;
            case 'YYYY-MM-DD HH:MM:SS':
                return [year, month, day].join('-') + ' ' + [hour, minutes, second].join(':');
                break;
            case 'YYYY-MM-DD':
                return [year, month, day].join('-');
                break;
            case 'HH:MM:SS':
                return [hour, minutes, second].join(':');
                break;
            case 'HH:MM':
                return [hour, minutes].join(':');
                break;
            case 'array':
                return [year, month, day, hour, minutes, second];
                break;
            default:
                return [year, month, day].join('') + ' ' + [hour, minutes, second].join(':');
                break;
        }
    },
    numDivider: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {
        }
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {
        }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))

            var tradeAmount = (r1 / r2) * pow(10, t2 - t1);
            return tradeAmount;
        }
    },
    numMultiply: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length
        } catch (e) {
        }

        var tradeAmount = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
        return tradeAmount;
    },
    numSqxsw: function (amount, sqWs) {
        var str = isNaN(amount) ? "0" : parseFloat(amount).toFixed(9);
        if (this.isFloat(amount)) {
            var ss = str.split(".");
            if (ss.length == 2) {
                if (ss[1].length > sqWs) {
                    var dianHou = str.indexOf(".") + sqWs + 1;
                    str = str.substring(0, dianHou)
                }
            }
        }
        return str;
    },
    preHandle: function (n1, n2) { //#noadd
        if (!(( typeof n1 === 'number' || ( typeof n1 === 'string' && /^[\d]+(\.[\d]+)?$/g.test(n1))) &&
                ( typeof n2 === 'number' || ( typeof n2 === 'string' && /^[\d]+(\.[\d]+)?$/g.test(n2)))
            )) {
            return NaN;
        }
        var s1 = n1.toString(), s2 = n2.toString(), a1 = s1.split("."), a2 = s2.split(".");
        s1 = s1.replace(".", "");
        s2 = s2.replace(".", "");
        return {
            s1: s1,
            s2: s2,
            n1: parseInt(s1, 10),
            n2: parseInt(s2, 10),
            d1: a1.length > 1 ? a1[1].length : 0,
            d2: a2.length > 1 ? a2[1].length : 0
        };
    },
    numDivide: function (n1, n2) {
        var oT = this.preHandle(n1, n2),
            out = !(oT === oT) ? oT : (oT.n1 / oT.n2 / Math.pow(10, oT.d1 - oT.d2));
        return parseFloat(out);
    },
    fixNumber: function (value, unit) {
        var value = parseFloat(value).toFixed(9);
        var unit = unit || 0;
        var isInt = value.indexOf(".") == -1 ? true : false;
        var intNum = value.split(".")[0];
        var floatNum = !isInt ? value.split(".")[1] : "0";
        var floatArry = floatNum.split("");
        var newFloatNum = ".";
        for (var i = 0; i < unit; i++) {
            if (!floatArry[i]) {
                newFloatNum += "0";
            } else {
                newFloatNum += floatArry[i];
            }
        }
        if (unit > 0) {
            return parseFloat(intNum + newFloatNum).toFixed(unit);
        } else {
            return parseInt(intNum);
        }
    },
    fixDecimal: function (value, unit) {
        var $this = this;
        var result = $this.fixNumber(value, unit);
        if (unit > 0) {
            result = parseFloat(result);
        } else {
            result = parseInt(result);
        }
        if (result > 0 && result < 0.000001) {
            result = $this.fixNumber(value, unit);
        }
        return result;
    },
    fixFloat: function (value, unit) {
        var $this = this;
        var result = $this.fixNumber(value, unit);
        if (unit > 0) {
            result = parseFloat(result);
        } else {
            result = parseInt(result);
        }
        return result;
    },
    isFloat: function (num) {
        if (num) {
            var reg = /^[0-9]*\.?[0-9]*$/;
            if (!reg.test(num)) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    },
    isMobile: function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsLetv = sUserAgent.match(/letv/i) == "letv";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsLetv || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    },
    isZoom: function () {
        return $("meta[name='viewport']").length > 0 && this.isMobile();
    },
    getUrlparm: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    showLineError: function (obj, msg) {
        var $line = $(obj).parents(".form-group");
        var $content = $(obj).parents(".form-control");
        $line.find('.exx-alert, .input-alert').remove();
        if (msg == '' || $(obj).val() == '') {
            $line.removeClass('error');
            //$line.find('.input-alert').remove();
        } else {
            $line.addClass('error');
            $line.append("<div class='input-alert'>" + msg + "</div>");
        }
    },
    checkMobileStyle: function () {
        if (Methods.isMobile() || $('widow').width() < 769) {
            $('head').append("<meta name='viewport' content='width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'>");
            $('body').addClass('mobile');
        }
    },
    bindResizeDiv: function (div) {
        var $div = $(div),
            $resize = $div.find('.resize');
        var divHeight = $div.height();

        var dragStart = function (e) {
            $resize.css("cursor", "ns-resize");
            var mouseY = e.pageY;
            var mouseX = e.pageX;
            $div.bind('mousemove', function (event) {
                var height;
                if (event.pageX > mouseX) {
                    height = divHeight - (event.pageY - mouseY);
                } else {
                    height = divHeight + mouseY - event.pageY;
                }
                if (height > $resize.height()) {
                    $(this).css({'height': height + 'px'});
                }
            });
            $div.bind('mouseleave', function (event) {
                dragEnd();
            });
        };
        var dragEnd = function () {
            $resize.css("cursor", "auto");
            $div.unbind('mousemove');
        };
        /*$resize.on('dblclick',function(event){
            $div.css({'height' :  divHeight + 'px'});
        });*/
        $resize.bind("mousedown", dragStart);
        $resize.bind("mouseup", dragEnd);
    },
    checkDecimal: function (value, unit) {
        if ($.isNumeric(value) && value >= 0) {
            var valueStr = value + "";
            if (valueStr.indexOf(".") != -1) {
                var newStr,
                    intStr = valueStr.split(".")[0] + "",
                    floatStr = valueStr.split(".")[1] + "";
                if (unit == 0) {
                    return intStr;
                } else {
                    if (floatStr.split("").length > unit) {
                        newStr = intStr + "." + floatStr.substr(0, unit);
                        return newStr;
                    }
                }
            }
        } else {
            return '';
        }
    },
    setLan: function (lan) {
        var name = ENV + 'lan';
        this.setCookie(name, lan, 30);
        top.location.reload();
    }
};

