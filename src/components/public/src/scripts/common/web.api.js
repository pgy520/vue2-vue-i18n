(function () {
    var API = {
        //API的AJAX方法，基于JQUERY。
        AJAX : function (option) {
            var options = option || {};
            options.url = options.url || '';
            options.type = options.type || 'POST';
            options.data = options.data || {};
            options.dataType = options.dataType || 'jsonp';
            options.jsonp = options.jsonp || 'jsoncallback';
            options.success = options.success || function () {};
            options.error = options.error || function () {};
            options.complete = options.complete || function () {};

            $.ajaxSetup({
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                xhrFields: {
                    withCredentials: true
                }
            });

            $.ajax({
                type: options.type,
                url: options.url,
                data: options.data,
                dataType: options.dataType,
                jsonp: options.jsonp,
                success: function (res) {
                    switch(res.resMsg.code){
                        case 1000:
                            options.success(res);
                            break;
                        default:
                            options.error(res);
                            console.log(res.resMsg.message);
                    }
                },
                error: function (res) {
                    console.log(res.resMsg.message);
                },
                complete: function (res) {
                    options.complete(res);
                }
            });
        },
        // 获取用户资金
        getTargetUserAsset: function (option) {
            var options = option || {};
            options.url = DOMAIN_MAIN + API_PREFIX + 'getTargetUserAsset';
            this.AJAX(options);
        }
    }
    window.EXX_API = API;

})(window, $)