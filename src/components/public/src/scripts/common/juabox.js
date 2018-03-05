/*
  * jQuery.JuaBox
  * @example JuaBox.info("hello world",{option});
  * @example JuaBox.frame("/url",{option});
  * @example JuaBox.album("/imgSrc",{option});
  * @example JuaBox.reSetHeight();
  * @example JuaBox.close(JuaId,callback());
  * @example JuaBox.closeAll();
  */
  var JuaIndex = 0 ;
  var JuaArry = [] ;
  var JuaBox = function(JuaId) {
    this.id = JuaId ;
    this.type = 0;// 0-info; 1-frame; 2-album;
    this.title = null;
    //this.title = "<i class='fa fa-exclamation-triangle' style='font-size:36px; color:#2DB1DC;'></i>";
    this.message = "";
    this.width = 450 ;
    this.height = "auto";
    this.frameWidth = "100%";
    this.frameHeight = null;
    this.btnNum = 2;
    this.btnName1 = "确定";
    this.btnName2 = "取消";
    this.btnName3 = "关闭";
    this.btnClass1 = "btn btn-default";
    this.btnClass2 = "btn btn-default";
    this.btnClass3 = "btn btn-default";
    this.tipClass = "";
    this.needLogin = false;
    this.masking = true;
    this.showMini = false;
    this.showZoom = false;
    this.showClose = false;
    this.fullPage = false,
    this.miniPage = false,
    this.onlyOne = false;
    this.outFrame = true;
    this.dragWindow = false;
    this.timeSetFrame = false;
    this.timeOutClose = false;
    this.timeClose = 3000;
    this.zIndex = 10000;
    this.boxId = "JuaBox_" + this.id;
    this.maskId = "JuaMask_" + this.id;
    this.frameId = "JuaFrame_" + this.id;
    this.frameUrl = null ;
    this.isFrame =  function() {
      return JuaBox.isMySelf();
    };
    this.offsets = {x:0,y:0};
    this.option = function(options){
      var options = options || {};//初始化默认值
      this.ops = options;
      this.title = options.title ? options.title : this.title ;//标题信息
      this.width = options.width ? options.width : this.width ;//弹出框宽度
      this.height = options.height ? options.height : this.height ;//弹出框高度
      this.frameWidth = options.frameWidth ? options.frameWidth : this.frameWidth ;//框架宽度
      this.frameHeight = options.frameHeight ? options.frameHeight : this.frameHeight ;//框架高度
      this.btnNum = options.btnNum>=0 ? options.btnNum : this.btnNum ;//按钮数量
      this.btnName1 = options.btnName1 ? options.btnName1 : this.btnName1 ;//按钮1文字
      this.btnName2 = options.btnName2 ? options.btnName2 : this.btnName2 ;//按钮2文字
      this.btnName3 = options.btnName3 ? options.btnName3 : this.btnName3 ;//按钮3文字
      this.btnClass1 = options.btnClass1 ? options.btnClass1 : this.btnClass1 ;//按钮1样式
      this.btnClass2 = options.btnClass2 ? options.btnClass2 : this.btnClass2 ;//按钮2样式
      this.btnClass3 = options.btnClass3 ? options.btnClass3 : this.btnClass3 ;//按钮3样式
      this.tipClass  = options.tipClass ? options.tipClass : this.tipClass ;//showTip提示框的额外样式
      this.needLogin = options.needLogin != null ? options.needLogin : this.needLogin ;//是否需要登陆权限
      this.masking = options.masking != null ? options.masking : this.masking ;//是否显示遮罩层
      this.showMini = options.showMini != null ? options.showMini : JuaBox.isZoom() ? false : this.showMini ;//是否显示最小按钮
      this.showZoom = options.showZoom != null ? options.showZoom : JuaBox.isZoom() ? false : this.showZoom ;//是否显示最大按钮
      this.showClose = options.showClose != null ? options.showClose : this.showClose ;//是否显示关闭按钮
      this.fullPage = options.fullPage != null ? options.fullPage : this.fullPage ;//是否满屏显示
      this.miniPage = options.miniPage != null ? options.miniPage : this.miniPage ;//是否最小化显示
      this.onlyOne = options.onlyOne != null ? options.onlyOne : this.onlyOne ;//是否只显示当前一个窗口
      this.outFrame = options.outFrame != null ? options.outFrame : this.outFrame ;//是否在框架外弹出窗口
      this.dragWindow = options.dragWindow != null ? options.dragWindow : this.dragWindow ;//是否允许拖动窗口
      this.timeSetFrame = options.timeSetFrame != null ? options.timeSetFrame : this.timeSetFrame ;//是否定时执行重置框架任务
      this.timeOutClose = options.timeOutClose != null ? options.timeOutClose : this.timeOutClose ;//是否定时关闭窗口
      this.timeClose = options.timeClose ? options.timeClose : this.timeClose ;//定时关闭窗口时间（毫秒）
      this.offsets = options.offsets ? options.offsets : this.offsets;
      if(this.type == 1) {
        this.width = options.width || 600;
      }
      if(this.type == 2) {
        this.width = options.width || 800;
      }
      if(JuaBox.isZoom()) {
        this.width = "80%" ;
      }
      this.btnFun1 = function(){//按钮1执行函数
        if($.isFunction(options.btnFun1)) {return options.btnFun1(JuaId) ;} else {return JuaBox.close(JuaId) ;};
      };
      this.btnFun2 = function(){//按钮2执行函数
        if($.isFunction(options.btnFun2)) {return options.btnFun2(JuaId) ;} else {return JuaBox.close(JuaId) ;};
      };
      this.btnFun3 = function(){//按钮3执行函数
        if($.isFunction(options.btnFun3)) {return options.btnFun3(JuaId) ;} else {return JuaBox.close(JuaId) ;};
      };
      this.winMiniFun = function(){//最小化按钮执行函数
        if($.isFunction(options.winMiniFun)) {return options.winMiniFun(JuaId) ;} else {return JuaBox.mini(JuaId) ;};
      };
      this.winZoomFun = function(){//最大化按钮执行函数
        if($.isFunction(options.winZoomFun)) {return options.winZoomFun(JuaId) ;} else {return JuaBox.zoom(JuaId) ;};
      };
      this.winCloseFun = function(){//窗口关闭按钮执行函数
        if($.isFunction(options.winCloseFun)) {return options.winCloseFun(JuaId) ;} else {return JuaBox.close(JuaId) ;};
      };
      this.maskFun = function(){//遮罩层点击执行函数
        if($.isFunction(options.maskFun)) {return options.maskFun(JuaId) ;} else {return JuaBox.close(JuaId) ;};
      };
      this.startFun = function(){//弹窗展示开始执行函数
        if($.isFunction(options.startFun)) {return options.startFun(JuaId) ;} else {return false ;};
      };
      this.endFun = function(){//弹窗展示完成执行函数
        if($.isFunction(options.endFun)) {return options.endFun(JuaId) ;} else {return false ;};
      };
      this.closeFun = function(){//弹窗关闭后执行函数
        if($.isFunction(options.closeFun)) {return options.closeFun(JuaId) ;} else {return false ;};
      };
      this.resizeFun = function(){//窗口重置回调函数
        if($.isFunction(options.resizeFun)) {return options.resizeFun(JuaId) ;} else {return false ;};
      };
      this.dragStartFun = function(){//拖动窗口开始执行函数
        if($.isFunction(options.dragStartFun)) {return options.dragStartFun(JuaId) ;} else {return false ;};
      };
      this.dragEndFun = function(){//拖动窗口结束执行函数
        if($.isFunction(options.dragEndFun)) {return options.dragEndFun(JuaId) ;} else {return false ;};
      };
      this.setFrameFun = function(){//初始化框架执行函数
        if($.isFunction(options.setFrameFun)) {return options.setFrameFun(JuaId) ;} else {return false ;};
      };
    };
    this.build = function(content){
      this.btnHtml = "";
      this.winBtnHtml = "";
      if(this.type == 0){//info
        if(JuaBox.isZoom()){
          this.boxHtml = this.theme.mobileInfo();
        }else{
          this.boxHtml = this.theme.info();
        }
        this.contentHtml = content ;
      };
      if(this.type == 1){//frame
        if(JuaBox.isZoom()){
          this.boxHtml = this.theme.mobileFrame();
        }else{
          this.boxHtml = this.theme.frame();
        }
        this.contentHtml = "<iframe src='"+content+"' id='"+this.frameId+"' class='JuaFrame' name='"+this.frameId+"' onload='$(window.frames[\""+this.frameId+"\"].document.body).find(\".bk-animationload\").show()' frameBorder='0' width='100%' hspace='0' scrolling='no'></iframe>";
      };
      if(this.type == 2){//album
        this.boxHtml = this.theme.album();
        this.contentHtml = "<img src='"+content+"' class='img-responsive'>";
      };
      if(this.type == 3){//bubble
        this.boxHtml = this.theme.bubble();
        this.contentHtml = content;
      };
      if(this.type == 4){//showTip
        this.boxHtml = this.theme.showTip();
        this.contentHtml = content;
      };
      if(this.btnNum > 2)
      { this.btnHtml += "<a id='JuaBtn_"+this.id+"_3' role='button' class='"+this.btnClass3+"'>"+this.btnName3+"</a>"; };
      if(this.btnNum > 1)
      { this.btnHtml += "<a id='JuaBtn_"+this.id+"_2' role='button' class='"+this.btnClass2+"'>"+this.btnName2+"</a>"; };
      if(this.btnNum != 0)
      { this.btnHtml += "<a id='JuaBtn_"+this.id+"_1' role='button' class='"+this.btnClass1+"'>"+this.btnName1+"</a>"; };
      if(this.showMini)
      { this.winBtnHtml += "<a id='JuaWinBtn_"+this.id+"_1' role='button' class='win-btn win-btn-mini' title='Mini'><i class='fa fa-minus'></i></a>"; };
      if(this.showZoom)
      { this.winBtnHtml += "<a id='JuaWinBtn_"+this.id+"_2' role='button' class='win-btn win-btn-zoom' title='Resize'><i class='fa fa-expand'></i></a>"; };
      if(this.showClose)
      { this.winBtnHtml += "<a id='JuaWinBtn_"+this.id+"_3' role='button' class='win-btn win-btn-close' title='Close'><i class='fa fa-close'></i></a>"; };
      this.boxHtml = this.boxHtml.replace("${JuaBox.title}",this.title);
      this.boxHtml = this.boxHtml.replace("${JuaBox.maskId}",this.maskId);
      this.boxHtml = this.boxHtml.replace("${JuaBox.boxId}",this.boxId);
      this.boxHtml = this.boxHtml.replace("${JuaBox.body}",this.contentHtml);
      this.boxHtml = this.boxHtml.replace("${JuaBox.foot}",this.btnHtml);
      this.boxHtml = this.boxHtml.replace("${JuaBox.zoom}",this.winBtnHtml);
      if ($("body")){
        $("body").append(this.boxHtml);
      };
    };
    this.dragStart = function(e){
      $("#JuaBox_"+JuaId+" .head").css("cursor","move");
      var mouseX = 0, mouseY = 0;
      var divLeft, divTop;
      var offset = $("#JuaBox_"+JuaId).offset();
      divLeft = parseInt(offset.left,10);
      divTop = parseInt(offset.top,10);
      mouseY = e.pageY;
      mouseX = e.pageX;
      $("#JuaBox_"+JuaId).bind('mousemove',function(event){
        var left = divLeft + (event.pageX - mouseX);
        var top = divTop + (event.pageY - mouseY);
        $(this).css({
          'top' :  top + 'px',
          'left' : left + 'px'
        });
        return false;
      }
    );
  };
  this.dragEnd = function(){
    $("#JuaBox_"+JuaId+" .head").css("cursor","auto");
    $("#JuaBox_"+JuaId).unbind('mousemove');
  };
  this.reZindex = function(e){
    if(e.target.nodeName == "BUTTON") return false ;
    var zArry = [];
    for(var i = 0, j = 1; i < JuaIndex ; i++,j++){
      zArry[i] = parseInt($("#JuaBox_"+j).css("z-index"));
    };
    var zArryMax = Math.max.apply(null, zArry);
    var zJuaId = parseInt($("#JuaBox_"+JuaId).css("z-index"));
    for(var i = 0, j = 1; i < JuaIndex ; i++,j++){
      if(zArry[i] > zJuaId){
        $("#JuaBox_"+j+",#JuaMask_"+j).css('z-index', zArry[i] - 1 );
      };
      if(zArry[i] == zJuaId){
        $("#JuaBox_"+j+",#JuaMask_"+j).css('z-index', zArryMax );
      };
    };
  };

  this.bind = function(){
    //$("#"+this.boxId).bind("click", this.reZindex);
    $("#"+this.maskId).bind("click", this.maskFun);
    if(this.type == 1){
      $("#"+this.frameId).bind("load", this.setFrame);
      $("#"+this.frameId).bind("load", this.setFrameFun);
    };
    if(this.type == 2){
      this.setAlbum($("#"+this.boxId+" .body img")[0]);
    };
    if(this.dragWindow){
      $("#"+this.boxId+" .head").bind("mousedown", this.dragStart);
      $("#"+this.boxId+" .head").bind("mouseup", this.dragEnd);
      $("#"+this.boxId+" .head").bind("mousedown", this.dragStartFun);
      $("#"+this.boxId+" .head").bind("mouseup", this.dragEndFun);
    };
    if(this.ops.btnFun1 && !$.isFunction(this.ops.btnFun1)){
      $("#JuaBtn_"+this.id+"_1").attr("onclick", this.ops.btnFun1);
    }else{
      $("#JuaBtn_"+this.id+"_1").bind("click", this.btnFun1);
    }

    $("#JuaBtn_"+this.id+"_2").bind("click", this.btnFun2);
    $("#JuaBtn_"+this.id+"_3").bind("click", this.btnFun3);
    $("#JuaWinBtn_"+this.id+"_1").bind("click", this.winMiniFun);
    $("#JuaWinBtn_"+this.id+"_2").bind("click", this.winZoomFun);
    $("#JuaWinBtn_"+this.id+"_3").bind("click", this.winCloseFun);

    $(window).resize(function(){JuaBox.position()});

  };
  this.setFrame = function(){
    //解决框架加载延迟的定位问题，3秒定时器
    for(var i = 50; i < 2000 ; i += 50 ){
      setTimeout(function(){
        try{
          //提取框架标题，请到框架页面修改标题
          if(!this.title ){
            $("#JuaBox_"+JuaId+" .head h3").text(window.frames['JuaFrame_'+JuaId+''].document.title);
          }
          JuaBox.position(JuaId);
          JuaBox.reSetHeight(JuaId);
        } catch(e) {
          return ;
        };
      }, i);
    };
  };
  this.setAlbum = function(img){
    //解决图片加载延迟的定位问题，3秒定时器
    var timer = setInterval(function(){
      if(img.complete){
        JuaBox.position();
        clearInterval(timer);
      };
    }, 50);
  };
  this.position = function(JuaId,callBack){
    //获取页面宽高
    this.docW = $(document).width();
    this.docH = $(document).height();
    this.winW = $(window).width();
    this.winH = $(window).height();
    //设置弹出框宽高
    $("#"+this.maskId).css({
      "width" : Math.min(this.docW,this.winW),
      "height" : Math.max(this.docH,this.winH),
      "z-index" : this.zIndex + this.id
    });
    $("#"+this.boxId).css({
      "min-width" : this.fullPage ? "100%" : (JuaBox.isZoom() ? "320px" : "none"),
      "max-width" : JuaBox.isZoom() ? "400px" : "none",
      "width" : this.fullPage ? "100%" : this.width,
      "height" : this.fullPage ? this.winH : this.height,
      "z-index" : this.zIndex + this.id
    });
    //全屏状态下超出部分高度自动
    if(this.fullPage && $("#JuaBox_"+JuaId).outerHeight() < $("#JuaBox_"+JuaId+" .head").outerHeight() + $("#JuaBox_"+JuaId+" .body").outerHeight()){
      $("#"+this.boxId).css({
        "height" : "auto"
      });
    }
    //获取定位信息
    this.offTop = $(document).scrollTop();
    this.offLeft = $(document).scrollLeft();
    this.boxW = $("#"+this.boxId).outerWidth();
    this.boxH = $("#"+this.boxId).outerHeight();
    //弹出层定位
    //this.boxTop = JuaBox.isZoom() ? this.offTop : Math.max(Math.max(this.winH - this.boxH,0)/2 + this.offTop + this.offsets.y, 0) ;
    this.boxTop = Math.max(Math.max(this.winH - this.boxH,0)/2 + this.offTop + this.offsets.y, 0) ;
    this.boxLeft = this.fullPage ? 0 : Math.max(Math.max(this.winW - this.boxW,0)/2 + this.offLeft + this.offsets.x, 0) ;
    $("#"+this.boxId).css({
      "top" : this.boxTop,
      "left" : this.boxLeft
    });
    if($.isFunction(callBack)) { callBack() };
  };


  this.mask = function(){
    if(this.masking){
      $("#"+this.maskId).show();
    }
  };
  this.show = function(type){
    var $JuaId = $("#"+this.boxId);
    var $this = this ;
    if(type == 4){
      //始终显示在菜单下方或者屏幕顶端
      var navOffTop ;
      if($("#user-nav").length > 0){
        navOffTop = $("#user-nav").height() + $("#user-nav").offset().top ;
      }else{
        navOffTop =  0 ;
      }
      if($(document).scrollTop() > navOffTop){
        $JuaId.css({"top":"0px","position":"fixed"});
      }else{
        $JuaId.css({"top":navOffTop,"position":"absolute"});
      };
      $JuaId.slideDown(200);
      setTimeout(function(){
        $JuaId.slideUp(400,function(){
          $JuaId.remove();
          if($.isFunction($this.closeFun)){
            $this.closeFun();
          }
        });
      },3000);
    }else{
      //弹出框的显示
      $JuaId.fadeIn(100,function(){
        if($.isFunction($this.endFun)) { $this.endFun() };
      });
      if(this.timeOutClose){
        if(this.type == 3){
          setTimeout(function(){JuaBox.closeFade(JuaId);}, this.timeClose);
        }else{
          setTimeout(function(){JuaBox.close(JuaId);}, this.timeClose);
        }
      }
    }
  };
  this.mini = function(JuaId,callBack){
    if(this.miniPage){
      this.miniPage = false ;
      JuaBox.position(JuaId,callBack);
    }else{
      this.miniPage = true ;
      JuaBox.position(JuaId,callBack);
    }
  };
  this.zoom = function(JuaId,callBack){
    if(this.fullPage){
      this.fullPage = false ;
      JuaBox.position(JuaId,callBack);
    }else{
      this.fullPage = true ;
      JuaBox.position(JuaId,callBack);
    }
  };
  this.reSize = function(JuaId){
    JuaBox.position(JuaId);
  };
  this.reSetHeight = function(JuaId,callBack){
    var frameDoc , frameDocHeight;
    //仅对框架弹出框执行
    if(this.type != 1) return ;
    //在框架页面之外执行
    if(JuaId != null || JuaId != undefined ){
      frameDoc = $(window.frames['JuaFrame_'+JuaId+''].document.body);
      frameDoc.find(".bk-body").css("height","auto");//重置高度前取消页面内bk-body的固定高度
      frameDocHeight = frameDoc.outerHeight();
      $("#JuaFrame_"+JuaId).height(frameDocHeight);
    }else{
      frameDoc = $(window.frames[$(window.frames).length - 1].document.body);
      frameDoc.find(".bk-body").css("height","auto");//重置高度前取消页面内bk-body的固定高度
      frameDocHeight = frameDoc.outerHeight();
      $(".JuaFrame").eq(-1).height(frameDocHeight);
    }
    //超出框架使用滚动条
    frameDoc.find(".bk-body").css({"height":frameDocHeight,"background-color":"#fff","overflow-y":"auto","overflow-x":"hidden","min-width":"0"});
    //取消自适应后的宽度遗留问题，弹出框内的container必须重设min-width
    frameDoc.find(".container").css("cssText","min-width:0px !important");
    JuaBox.position(JuaId);
    if($.isFunction(callBack)) { callBack() };
  };
  this.close = function(JuaId,callBack){
    $("#JuaBox_"+JuaId).hide();
    $("#JuaMask_"+JuaId).hide();
    if($.isFunction(callBack)) { callBack() };
    this.closeFun();
    $("#JuaBox_"+JuaId).remove();
    $("#JuaMask_"+JuaId).remove();
  };
  this.closeFade = function(JuaId,callBack){
    var $this = this ;
    $("#JuaMask_"+JuaId).remove();
    $("#JuaBox_"+JuaId).animate({top: "-=100px",opacity:0}, 1000, "easeOutSine", function(){
      if($.isFunction(callBack)) { callBack() };
      $this.closeFun();
      $("#JuaBox_"+JuaId).remove();

    });
  };
  this.theme = {
    obj : this,
    info : function(){
      var themeHtml = "" ;
      themeHtml += "<div id='${JuaBox.maskId}' class='Jua-table-mask'></div>";
      themeHtml += "<div id='${JuaBox.boxId}' class='Jua-table-main'>";
      themeHtml += "  <div class='Jua-table-inner'>";
      themeHtml += "    <div class='head "+(this.obj.title == null ? 'hide' : '')+"'><h3>${JuaBox.title}</h3></div>";
      themeHtml += "    <div class='body'>";
      themeHtml += "        <div class='bk-page-table' style='min-height:110px'><div class='bk-page-tableCell'>${JuaBox.body}</div></div>";
      themeHtml += "    </div>";
      themeHtml += "    <div class='foot'>${JuaBox.foot}</div>";
      themeHtml += "    <div class='zoom'>${JuaBox.zoom}</div>";
      themeHtml += "  </div>";
      themeHtml += "</div>";
      return themeHtml ;
    },
    bubble : function(){
      var themeHtml = "" ;
      themeHtml += "<div id='${JuaBox.maskId}' class='Jua-table-mask'></div>";
      themeHtml += "<div id='${JuaBox.boxId}' class='Jua-table-main "+this.obj.tipClass+"'>";
      themeHtml += "  <div class='Jua-table-inner'>";
      themeHtml += "    <div class='body'>";
      themeHtml += "        <div class='bk-page-table' style='min-height:110px'><div class='bk-page-tableCell text-center'>${JuaBox.body}</div></div>";
      themeHtml += "    </div>";
      themeHtml += "  </div>";
      themeHtml += "</div>";
      return themeHtml ;
    },
    frame : function(){
      var themeHtml = "" ;
      themeHtml += "<div id='${JuaBox.maskId}' class='Jua-table-mask'></div>";
      themeHtml += "<div id='${JuaBox.boxId}' class='Jua-table-main'>";
      themeHtml += "  <div class='Jua-table-inner'>";
      themeHtml += "    <div class='head hide'><h3>${JuaBox.title}</h3></div>";
      themeHtml += "    <div class='body'>${JuaBox.body}</div>";
      themeHtml += "    <div class='foot' style='display:none'>${JuaBox.foot}</div>";
      themeHtml += "    <div class='zoom'>${JuaBox.zoom}</div>";
      themeHtml += "  </div>";
      themeHtml += "</div>";
      return themeHtml ;
    },
    mobileInfo : function(){
      var themeHtml = "" ;
      themeHtml += "<div id='${JuaBox.maskId}' class='Jua-mobile-mask'></div>";
      themeHtml += "<div id='${JuaBox.boxId}' class='Jua-mobile-main'>";
      themeHtml += "  <div class='Jua-mobile-inner'>";
      themeHtml += "    <div class='head'><h3>${JuaBox.title}</h3></div>";
      themeHtml += "    <div class='body'>${JuaBox.body}</div>";
      themeHtml += "    <div class='foot'>${JuaBox.foot}</div>";
      themeHtml += "    <div class='zoom'>${JuaBox.zoom}</div>";
      themeHtml += "  </div>";
      themeHtml += "</div>";
      return themeHtml ;
    },
    mobileFrame : function(){
      var themeHtml = "" ;
      themeHtml += "<div id='${JuaBox.maskId}' class='Jua-mobile-mask'></div>";
      themeHtml += "<div id='${JuaBox.boxId}' class='Jua-mobile-main'>";
      themeHtml += "  <div class='Jua-mobile-inner'>";
      themeHtml += "    <div class='head'><h3>${JuaBox.title}</h3></div>";
      themeHtml += "    <div class='body'>${JuaBox.body}</div>";
      themeHtml += "    <div class='foot' style='display:none'>${JuaBox.foot}</div>";
      themeHtml += "    <div class='zoom'>${JuaBox.zoom}</div>";
      themeHtml += "  </div>";
      themeHtml += "</div>";
      return themeHtml ;
    },
    album : function(){
      var themeHtml = "" ;
      themeHtml += "<div id='${JuaBox.maskId}' class='Jua-album-mask'></div>";
      themeHtml += "<div id='${JuaBox.boxId}' class='Jua-album-main'>";
      themeHtml += "  <div class='Jua-album-inner'>";
      themeHtml += "    <div class='body'>${JuaBox.body}</div>";
      themeHtml += "    <div class='zoom'>${JuaBox.zoom}</div>";
      themeHtml += "  </div>";
      themeHtml += "</div>";
      return themeHtml ;
    },
    showTip : function(){
      var themeHtml = "" ;
      themeHtml += "<div class='alert alert-well alert-dismissible Jua-showTip "+this.obj.tipClass+"' role='alert' id='${JuaBox.boxId}'>";
      themeHtml += "  <p>${JuaBox.body}</p>";
      themeHtml += "</div>";
      return themeHtml ;
    }
  };
  this.info = function(message,options){
    this.type = 0 ;
    this.message = message ;
    this.option(options);
    if($.isFunction(this.startFun)) { this.startFun() };
    this.build(this.message);
    this.bind();
    this.position();
    this.mask();
    this.show();

  };
  this.showTip = function(message,options){
    this.type = 4 ;
    this.message = message ;
    this.option(options);
    if($.isFunction(this.startFun)) { this.startFun() };
    this.build(this.message);
    this.show(4);
    if($.isFunction(this.endFun)) { this.endFun() };
  };
  this.bubble = function(message,options){
    this.type = 3 ;
    this.message = message ;
    this.option(options);
    this.timeOutClose = true;
    this.timeClose = 1500;
    //this.masking = false ;
    if($.isFunction(this.startFun)) { this.startFun() };
    this.build(this.message);
    this.bind();
    this.position();
    this.mask();
    this.show();
    if($.isFunction(this.endFun)) { this.endFun() };
  };
  this.frame = function(frameUrl,options){
    this.type = 1 ;
    var targetUrl = frameUrl ? frameUrl : "";//指定页面
    if(targetUrl.indexOf("?") < 0){
      targetUrl += "?a=" + new Date().getTime();
    }
    if(targetUrl.indexOf("iframe=1") < 0){
      targetUrl += "&iframe=1&r="+ new Date().getTime();
    }
    this.frameUrl = targetUrl ;
    this.option(options);
    if(JuaBox.isZoom()){this.fullPage = true ;}//移动端全屏弹出
    if($.isFunction(this.startFun)) { this.startFun() };
    this.build(this.frameUrl);
    this.bind();
    this.position();
    this.mask();
    this.show();
    if($.isFunction(this.endFun)) { this.endFun() };
  };
  this.album = function(src,options){
    this.type = 2 ;
    this.src = src ;
    this.option(options);
    if($.isFunction(this.startFun)) { this.startFun() };
    this.build(this.src);
    this.bind();
    this.position();
    this.mask();
    this.show();
    if($.isFunction(this.endFun)) { this.endFun() };
  };
};

JuaBox.isMySelf = function(){
  var self = true;
  try{
    self = (window.top == window.self);
  }catch(err){self = true;}
  return self;
}

JuaBox.showJuaBoxInfo = function(message,options){
  if(!JuaBox.isMySelf()){
    var hasParent = false;
    try{
      hasParent = parent.JuaBox;
    }catch(err){
      hasParent = false;
    }
    if(hasParent){
      parent.JuaBox.info(message,options);
      return true;
    }
  }
  return false;
}

JuaBox.info = function(message,options){
  if(JuaBox.showJuaBoxInfo(message,options)){
    return;
  }
  var options = options || {} ;
  options.title = "<span class='ft36'><i class='iconfont icon-warning'></i> EXX Alert</span>";
  JuaIndex ++ ;
  JuaArry[JuaIndex] = new JuaBox(JuaIndex) ;
  JuaArry[JuaIndex].info(message,options);
  JuaBox.playAudio();
};
//简化版弹出框，只有1个按钮
JuaBox.sure = function(message,options){
  if(JuaBox.showJuaBoxInfo(message,options)){
    return;
  }
  var options = options || {} ;
  options.title = "<span class='ft36'><i class='fa fa-warning ft36'></i> EXX Alert</span>";
  options.btnNum = 1 ;
  options.showClose = false ;
  JuaIndex ++ ;
  options.endFun = function(){
    //绑定enter事件
    $("body").keypress(function(e) {
      if (e.keyCode == 13) {
        $("#JuaBtn_"+JuaIndex+"_1").click();
      }
    });
  };
  JuaArry[JuaIndex] = new JuaBox(JuaIndex) ;
  JuaArry[JuaIndex].info(message,options);
  //JuaBox.playAudio();
};

JuaBox.bubble = function(message,options){
  var options = options || {} ;
  JuaIndex ++ ;
  JuaArry[JuaIndex] = new JuaBox(JuaIndex) ;
  JuaArry[JuaIndex].bubble(message,options);
};
JuaBox.album = function(src,options){
  if(!JuaBox.isMySelf())
  return parent.JuaBox.album(src,options);

  var options = options || {} ;
  JuaIndex ++ ;
  JuaArry[JuaIndex] = new JuaBox(JuaIndex) ;
  JuaArry[JuaIndex].album(src,options);
};
JuaBox.showTip = function(message,options){
  if(JuaBox.showJuaBoxInfo(message,options)){
    return;
  }
  var options = options || {} ;
  JuaIndex ++ ;
  JuaArry[JuaIndex] = new JuaBox(JuaIndex) ;
  JuaArry[JuaIndex].showTip(message,options);
  //JuaArry[JuaIndex].bubble(message,options);
};
JuaBox.showWrong = function(message,options){
  var options = options || {} ;
  options.tipClass = options.tipClass || "wrong";
  JuaBox.showTip(message,options);
};
JuaBox.showRight = function(message,options){
  var options = options || {} ;
  options.tipClass = options.tipClass || "right";
  JuaBox.showTip(message,options);
};
JuaBox.frame = function(frameUrl,options){
  var options = options || {} ;
  options.showClose = true;
  JuaIndex ++ ;
  JuaArry[JuaIndex] = new JuaBox(JuaIndex) ;
  JuaArry[JuaIndex].frame(frameUrl,options);
};
JuaBox.close = function(JuaId,callBack){
  if(JuaId != null || JuaId != undefined){
    if(JuaArry[JuaId]){
      JuaArry[JuaId].close(JuaId,callBack);
    }
  }else{
    //不带参数关闭最后一个
    JuaBox.close(JuaIndex);
  }
};
JuaBox.closeFade = function(JuaId,callBack){
  if(JuaId != null || JuaId != undefined){
    if(JuaArry[JuaId]){
      JuaArry[JuaId].closeFade(JuaId,callBack);
    }
  };
};
JuaBox.closeAll = function(callBack){
  for(var i = 0, j = 1; i < JuaIndex ; i++,j++){
    JuaArry[j].close(j);
  };
  if($.isFunction(callBack)) { callBack() };
};
JuaBox.mini = function(JuaId,callBack){
  JuaArry[JuaId].mini(JuaId,callBack);
};
JuaBox.zoom = function(JuaId,callBack){
  JuaArry[JuaId].zoom(JuaId,callBack);
};
JuaBox.reZindex = function(JuaId,callBack){
  JuaArry[JuaId].reZindex(JuaId,callBack);
};
JuaBox.position = function(JuaId,callBack){
  if(JuaId == null || JuaId == undefined){
    for(var i = 0, j = 1; i < JuaIndex ; i++,j++){
      JuaArry[j].position(j);
    };
  }else{
    if(JuaArry[JuaId]){
      JuaArry[JuaId].position(JuaId,callBack);
    }
  };
};
JuaBox.resetFrame = function(JuaId,callBack){
  if(JuaId == null || JuaId == undefined){
    for(var i = 0, j = 1; i < JuaIndex ; i++,j++){
      JuaArry[j].setFrame();
    };
  }else{
    if(JuaArry[JuaId]){
      JuaArry[JuaId].setFrame(JuaId,callBack);
    }
  };
};
JuaBox.reSetHeight = function(JuaId,callBack){
  if(JuaBox.isMySelf()){
    if(JuaId == null || JuaId == undefined){
      if(JuaArry[JuaIndex]){
        JuaArry[JuaIndex].reSetHeight(JuaIndex);
      }
    }else{
      if(JuaArry[JuaId]){
        JuaArry[JuaId].reSetHeight(JuaId,callBack);
      }
    }
  }else{
    //在框架页内执行（若有多个框架页仅对最后一个有效）
    $(".bk-body").css("height","auto");
    parent.$(".JuaFrame").eq(-1).height($(document).find("body").outerHeight());
    parent.JuaBox.position();
  }
};
JuaBox.isMobile = function() {
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
};
JuaBox.isZoom = function() {
  //页面是否处于手机端缩放状态 该方法为isMobile的补充，单纯判断手机端不够明确，未考虑到缩放的因素
  return $("meta[name='viewport']").length > 0 && JuaBox.isMobile();
};
JuaBox.log = function(){
  JuaBox.frame(DOMAIN_MAIN + "/login",{width:500});
};
JuaBox.reg = function(){
  JuaBox.frame(DOMAIN_MAIN + "/register",{width:500});
};
/* PLAY SOUND FUNCTION */
JuaBox.playAudio = function(file){
  //if(file === 'alert')
  //document.getElementById('audio-alert').play();

  //if(file === 'fail')
  //    document.getElementById('audio-fail').play();
}

//封装swealAret
if(typeof swal != 'undefined'){
    JuaBox.info = function (message, callback) {
        swal("", message, "info").then(function (willDelete) {
            callback && callback()
        });
    }

    JuaBox.sure = JuaBox.info;

    JuaBox.showWrong = function (message) {
        swal("", message, "error");
        window.setTimeout(function(){
            $(".swal-overlay").trigger('click');
        },4000);
    }

    JuaBox.showRight = function (message) {
        swal("", message, "success");
        window.setTimeout(function(){
            $(".swal-overlay").trigger('click');
        },4000);
    }
}

