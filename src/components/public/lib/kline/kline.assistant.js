function Kline(){}
Kline.prototype={
	browerState:0,
	klineWebsocket:null,//k线websocket对象
	klineTradeInit:false,//交易数据是否初始化
	tradeDate:new Date(),//交易时间
	tradesLimit:100,//交易数据最大长度
	lastDepth:null,//上次深度数据
	depthShowSize:30,//深度展示数量
	priceDecimalDigits:2,//深度价格保留小数位数(作废属性)
	amountDecimalDigits:4,//深度数量保留小数位数(作废属性)
	symbol:null,//交易所标识
	depthChannel:null,//盘口数据频道名称
	tradeChannel:null,//交易记录频道名称
	curPrice:null,//当前交易价格
	title:"",//页面title
	ajaxRe:false,
	last_trade_tid:0,
	initWebSocket:function(){
		var $this = this;
		//初始化websocket 并发送信息
		var timeout =0;
		var readyFun = setInterval(function(){
			timeout+=50;
			if(timeout>=10000){
				clearInterval(readyFun);
			}
			if(parent.webSocket){
				parent.webSocket.init(function(){
					parent.webSocket.sendMessage('{"event":"addChannel","channel":"'+$this.depthChannel+'","isZip":"'+parent.isZipData()+'"}');
					parent.webSocket.sendMessage('{"event":"addChannel","channel":"'+$this.tradeChannel+'","isZip":"'+parent.isZipData()+'"}');
				});
				clearInterval(readyFun);
			}
		},50);
		
		
	},
	reset:function(symbol){
		var $this = this;
		//this.refreshUrl(symbol);
		$("#markettop li a").removeClass("selected");
		$("#markettop li."+symbol+" a").addClass("selected");
		this.symbol=symbol;
		this.lastDepth=null;
		this.curPrice=null;
		this.klineTradeInit=false;
		$("#trades .trades_list").empty();
		$("#gasks .table").empty();
		$("#gbids .table").empty();
		$("#asks .table").empty();
		$("#bids .table").empty();
		
		this.setFirstRecord(function(){
			$this.initWebSocket();
			$this.klineTradeInit=true;
			$this.setAssistantData();
			
		})
	},
	setAssistantData:function(){
		var $this=this;
			$this.websocketRedister();
    	
	},
	setTitle:function(){
		//document.title=(this.curPrice==null?"":this.curPrice+" ")+this.title;
		//setMate(this.title);
	},
	dateFormatTf:function(i){
		return (i < 10 ? '0' : '') + i;
	},
	dateFormat:function(currentDate){
		return currentDate.getFullYear()
			+"-"+this.dateFormatTf(currentDate.getMonth() + 1)
			+"-"+this.dateFormatTf(currentDate.getDate())
			+" "+this.dateFormatTf(currentDate.getHours())
			+":"+this.dateFormatTf(currentDate.getMinutes())
			+":"+this.dateFormatTf(currentDate.getSeconds());
	},
	dateInit:function(currentTimeMillis){
		var currentDate=new Date();
		if(currentTimeMillis){
			currentDate.setTime(currentTimeMillis);
		}
		$(".m_rightbot").text(this.dateFormat(currentDate));
		var $this=this;
		setInterval(function(){
			currentDate.setTime(currentDate.getTime()+1000);
			$(".m_rightbot").text($this.dateFormat(currentDate));
		}, 1000);
	},
	setFirstRecord:function(callback){
		//if(self.location.href.indexOf('lite') != -1){
		//K线页面不再需要行情盘口
			return false;
		//}
		var $this = this ;
		var currency = this.symbol || "chbtcbtccny";
		/*if(marketData[0].market=="btcdefault"){
			currency = "chbtcbtccny";
		}else if(marketData[0].market=="ltcdefault"){
			currency = "chbtcltccny";
		}else if(marketData[0].market=="ethdefault"){
			currency = "chbtcethcny";
		}else if(marketData[0].market=="ethbtcdefault"){
			currency = "chbtcethbtc";
		}else if(marketData[0].market=="daodefault"){
			currency = "chbtcdaocny";
		}else if(marketData[0].market=="etcdefault"){
			currency = "chbtcetccny";
		}else if(marketData[0].market=="btsdefault"){
			currency = "chbtcbtscny";
		}else if(marketData[0].market=="eosdefault"){
            currency = "chbtceoscny";
        }*/
		
		//1.http 初始化深度
		var depthUrl =  DOMAIN_TRADE + API_PREFIX  + "getKlineDish?market="+currency+"&length=10&depth=0&jsoncallback=?" ;
		$.getJSON(depthUrl, function(result){
    		$this.updateDepth(result["return"]);
    	});
		//2.http 初始化成交记录
		//var jsonUrl =  DOMAIN_TRADE + "/Line/GetTrans-"+marketData[0].market+"?lastTime=0&length=10&depth=0&jsoncallback=?" ;
		var jsonUrl =  DOMAIN_TRADE + API_PREFIX + "getDealRecord?market="+currency+"&last_trade_tid="+$this.last_trade_tid+"&jsoncallback=?";
		$.getJSON(jsonUrl,  function(result) {
    		var item = result.data;
    		if(item!=null && item.length > 0){
    			//初始化50条交易记录 
    			var totalUls = "";
    			for(var i = item.length-1; i >=0; i--){
    				$this.tradeDate.setTime(item[i].date*1000);
    				var dateStr=$this.dateFormatTf($this.tradeDate.getHours())
    				+":"+$this.dateFormatTf($this.tradeDate.getMinutes())
    				+":"+$this.dateFormatTf($this.tradeDate.getSeconds());
    				
    				var formatPrice = $this.fixNumber(item[i].price,$this.moneyDecimal[$this.symbol]);
    				var formatAmount = $this.fixNumber(item[i].amount,$this.coinDecimal[$this.symbol]);
    				var arr = formatAmount.split(".");
    				totalUls += "<ul><li class='tm'>"+dateStr+"</li><li class='pr-"+(item[i].type=='buy' ? 'green':'red')+"'>"+formatPrice+"</li><li class='vl'>"+arr[0]+"<g>."+arr[1]+"</g></li></ul>";
    			};
    			$("#trades .trades_list").html(totalUls);
    			$this.curPrice= $this.fixNumber(item[item.length-1].price, $this.moneyDecimal[$this.symbol]);
				$("div#price").attr("class",item[item.length-1].type=='buy' ? 'green':'red').text($this.curPrice);
				$this.last_trade_tid = item[item.length-1].tid;
    		}
    		if($.isFunction(callback)){
				callback();
			}
    	});
	},
	ajaxRedister:function(){
		
		var $this=this;
		//var jsonUrl =  DOMAIN_TRADE + "/depth-"+marketData[0].market+"?lastTime=0&length=10&depth=0&jsoncallback=?" ;
		var currency = this.symbol || "chbtcbtccny";
		/*if(marketData[0].market=="btcdefault"){
			currency = "chbtcbtccny";
		}else if(marketData[0].market=="ltcdefault"){
			currency = "chbtcltccny";
		}else if(marketData[0].market=="ethdefault"){
			currency = "chbtcethcny";
		}else if(marketData[0].market=="ethbtcdefault"){
			currency = "chbtcethbtc";
		}else if(marketData[0].market=="daodefault"){
			currency = "chbtcdaocny";
		}else if(marketData[0].market=="etcdefault"){
			currency = "chbtcetccny";
		}else if(marketData[0].market=="btsdefault"){
			currency = "chbtcbtscny";
		}*/
		var jsonUrl =  DOMAIN_TRADE + API_PREFIX + "getKlineDish?jsoncallback=?&market="+currency+"&lastTime=0&length=10&depth=0&random="+(Math.random()*10000) ;
		
		//console.log("jsonUrl:"+jsonUrl)
		$.getJSON(jsonUrl, function(result){
    	//	console.log("1:"+result["return"])
    		$this.updateDepth(result["return"]);
    	});
    	
    	var tradeUrl =  DOMAIN_TRADE + API_PREFIX + "getDealRecord?jsoncallback=?&market="+currency+"&last_trade_tid="+$this.last_trade_tid+"&random="+(Math.random()*10000) ;
    	$.getJSON(tradeUrl,  function(result) {
    		$this.pushTrades(result.datas);
    		$this.klineTradeInit=true;
    	});
    	setTimeout(function(){
			$this.setAssistantData();
			},1000)
    	clear_refresh_counter();
    	
	},
	websocketRedister:function(){
		var $this=this;
		
		if(parent.ajaxRun!=false){
			if (!parent.webSocket || !parent.webSocket.socket || (parent.webSocket && parent.webSocket.socket && parent.webSocket.socket.readyState != WebSocket.OPEN)) {
				 $this.ajaxRedister();
			 }
		}
	},
	//不进行四舍五入的取值方法(数值，小数位数)
	fixNumber : function(value,unit){
		//此处不能使用toString方法转换字符串，超出7位小数将返回科学计数法的字符串
    	var value = parseFloat(value).toFixed(8);
    	var unit = unit || 0 ; 
    	var isInt = value.indexOf(".") == -1 ? true : false ;
    	var intNum = value.split(".")[0];
    	var floatNum = !isInt ? value.split(".")[1] : "0";
    	var floatArry = floatNum.split("");
    	var newFloatNum = ".";
		for(var i = 0; i < unit ; i++){
			if(!floatArry[i]){
				newFloatNum += "0" ;
			}else{
				newFloatNum += floatArry[i] ;
			}
		}
		if(unit > 0){
			return parseFloat(intNum +  newFloatNum).toFixed(unit);
		}else{
			return parseInt(intNum);
		}
    },
	pushTrades:function(array){
		var $this = this;
		var $trades=$("#trades .trades_list");
		var totalUls="";
		
		for(var i=0;i<array.length;i++){
			var item=array[i];
			if(i>=array.length-this.tradesLimit){
				if(item.tid<=$this.last_trade_tid) continue;
				this.tradeDate.setTime(item.date*1000);
				var dateStr=this.dateFormatTf(this.tradeDate.getHours())
				+":"+this.dateFormatTf(this.tradeDate.getMinutes())
				+":"+this.dateFormatTf(this.tradeDate.getSeconds());
				
				var formatPrice = this.fixNumber(item.price,this.moneyDecimal[this.symbol]);
				var formatAmount = this.fixNumber(item.amount,this.coinDecimal[this.symbol]);
				var arr = formatAmount.split(".");
				
				if(this.klineTradeInit){
					totalUls="<ul class='newul'><li class='tm'>"+dateStr+"</li><li class='pr-"+(item.type=='buy'?'green':'red')+"'>"+formatPrice+"</li><li class='vl'>"+arr[0]+"<g>."+arr[1]+"</g></li></ul>"+totalUls;
				}else{
					totalUls="<ul><li class='tm'>"+dateStr+"</li><li class='pr-"+(item.type=='buy'?'green':'red')+"'>"+formatPrice+"</li><li class='vl'>"+arr[0]+"<g>."+arr[1]+"</g></li></ul>"+totalUls;
				}
			}			
		}
		
		var j=0;//计数开始初始化
		if(array && array.length>10){
			j = array.length - 10;//确保只循环10次减少数据变动太频繁
		}
		var that = this;
		if(this.klineTradeInit){
			clearInterval(myTime);
			var myTime = setInterval( function(){ 
				var item=array[j];
				//排除错误数据
				if(typeof item != 'object') return false;
				that.curPrice=that.fixNumber(item.price, that.moneyDecimal[that.symbol]);
				//that.setTitle();
				$("div#price").attr("class",item.type=='buy'?'green':'red').text(that.curPrice);
				j++;
				if( j >= array.length) { clearInterval(myTime);}
			},100)
		}else{
			if(array.length>0){
				that.curPrice= that.fixNumber(array[array.length-1].price, that.moneyDecimal[that.symbol]);
				//this.setTitle();
				$("div#price").attr("class",array[array.length-1].type=='buy'?'green':'red').text(that.curPrice);
			}
		}
		if(array && array.length>0){
			$this.last_trade_tid = array[array.length-1].tid;
		}
		
		if(this.klineTradeInit){
			$trades.prepend(totalUls);
		}else{
			$trades.append(totalUls);
		}
		totalUls=null;
		$trades.find("ul.newul").slideDown(1000,function(){
			$(this).removeClass("newul");
		});
		$trades.find("ul:gt("+(this.tradesLimit-1)+")").remove();
	},
	updateDepth:function(data){
		window._set_current_depth(data);
		if(!data)return;
		$("#gasks .table").html(this.getgview(this.getgasks(data.asks)));
		$("#gbids .table").html(this.getgview(this.getgbids(data.bids)));
		if(this.lastDepth==null){
			this.lastDepth={};
			this.lastDepth.asks=this.getAsks(data.asks,this.depthShowSize);
			this.depthInit(this.lastDepth.asks,$("#asks .table"));
			this.lastDepth.bids=this.getBids(data.bids,this.depthShowSize);
			this.depthInit(this.lastDepth.bids,$("#bids .table"));
		}else{
			var parentAsks=$("#asks .table");
			parentAsks.find("div.remove").remove();
			parentAsks.find("div.add").removeClass("add");
			var newasks=this.getAsks(data.asks,this.depthShowSize);
			var oldasks=this.lastDepth.asks;
			this.lastDepth.asks=newasks;
			this.asksAndBids(newasks.slice(0),oldasks,parentAsks);
			
			var parentBids=$("#bids .table");
			parentBids.find("div.remove").remove();
			parentBids.find("div.add").removeClass("add");
			var newbids=this.getBids(data.bids,this.depthShowSize);
			var oldbids=this.lastDepth.bids;
			this.lastDepth.bids=newbids;
			this.asksAndBids(newbids.slice(0),oldbids,parentBids);
			
			//更新表单价格
			var $sellForm = $(window.top.document.body).find("#sellUnitPrice"),
				$buyForm = $(window.top.document.body).find("#buyUnitPrice");
			
			if($buyForm.val() == ""){
				$buyForm.val(data.asks[data.asks.length-1][0]);
			};
			if($sellForm.val() == ""){
				$sellForm.val(data.bids[0][0]);
			};
		}
	},
	depthInit:function(data,$obj){
		$obj.empty();
		//console.log(data);
		if(data && data.length>0){
			var lastInt,view="";
			for(var i=0;i<data.length;i++){
				var arr=(data[i][0]+"").split(".");
				var prices=this.getPrice(arr,lastInt);
				lastInt=arr[0];
				arr=(data[i][1]+"").split(".");
				var amounts=this.getAmount(arr);
				view+="<div class='row'><span class='price'>"+prices[0]+"<g>."+prices[1]+"</g></span> <span class='amount'>"+amounts[0]+"<g>."+amounts[1]+"</g></span></div>";
			}
			$obj.append(view);
			view=null;
		}
	},
	asksAndBids:function(addasks,oldasks,tbDiv){
		for(var i=0;i<oldasks.length;i++){
			var isExist=false;
			for(var j=0;j<addasks.length;j++){
				if(oldasks[i][0]==addasks[j][0]){
					isExist=true;
					if(oldasks[i][1] != addasks[j][1]){
						var $amount=tbDiv.find("div:eq("+i+") .amount");
						$amount.addClass(oldasks[i][1]>addasks[j][1]?"red":"green");
						var amounts=this.getAmount((addasks[j][1]+"").split("."));
						setTimeout((function($amount,amounts){
							return function(){
								$amount.html(amounts[0]+"<g>."+amounts[1]+"</g>");
								$amount.removeClass("red").removeClass("green");
								$amount=null;
								amounts=null;
							};
						})($amount,amounts), 500);
					}
					addasks.splice(j,1);
					break;
				}
			}
			if(!isExist){
				tbDiv.find("div:eq("+i+")").addClass("remove");
				oldasks[i][2]=-1;//标识该数据对应div被移除
			}
		}
		for(var j=0;j<oldasks.length;j++){
			for(var i=0;i<addasks.length;i++){
				if(addasks[i][0]>oldasks[j][0]){
					var arr=(addasks[i][1]+"").split(".");
					var amounts=this.getAmount(arr);
					tbDiv.find("div:eq("+j+")").before("<div class='row add'><span class='price'></span> <span class='amount'>"+amounts[0]+"<g>."+amounts[1]+"</g></span></div>");
					oldasks.splice(j,0,addasks[i]);
					addasks.splice(i,1);
					break;
				}
			}
		}
		var totalDiv="";
		for(var i=0;i<addasks.length;i++){
			oldasks.push(addasks[i]);
			var arr=(addasks[i][1]+"").split(".");
			var amounts=this.getAmount(arr);
			totalDiv+="<div class='row add'><span class='price'></span> <span class='amount'>"+amounts[0]+"<g>."+amounts[1]+"</g></span></div>";
		}
		if(totalDiv.length>0){
			tbDiv.append(totalDiv);
		}
		totalDiv=null;
		
		var lastInt;
		for(var i=0;i<oldasks.length;i++){
			var $div=tbDiv.find("div:eq("+i+")");
			if(!(oldasks[i].length>=3 && oldasks[i][2]==-1)){
				var arr=(oldasks[i][0]+"").split(".");
				var prices=this.getPrice(arr,lastInt);
				lastInt=arr[0];
				$div.find(".price").html(prices[0]+"<g>."+prices[1]+"</g>");
			}
		}
		addasks=null;
		oldasks=null;
		tbDiv.find("div.add").slideDown(800);
		setTimeout((function($remove,$add){
						return function(){
							$remove.slideUp(500,function(){
								$(this).remove();
							});
							$add.removeClass("add");
						};
					})(tbDiv.find("div.remove"),tbDiv.find("div.add")), 1000);
		
	},
	getAsks:function(array,len){
		if(array && array.length>len){
			array.splice(0,array.length-len);
		}
		return array;
	},
	getBids:function(array,len){
		if(array && array.length>len){
			array.splice(len,array.length-1);
		}
		return array;
	},
	getgview:function(g){
		var gstr="";
		var lastInt;
		for(var i=0;i<g.length;i++){
			var arr=g[i][0].split(".");
			if(arr.length==1 || arr[0]!=lastInt){
				gstr+="<div class='row'><span class='price'>"+g[i][0]+"</span> <span class='amount'>"+g[i][1]+"</span></div>";
				lastInt=arr[0];
			}else{
				gstr+="<div class='row'><span class='price'><h>"+arr[0]+".</h>"+arr[1]+"</span> <span class='amount'>"+g[i][1]+"</span></div>";
			}
		}
		return gstr;
	},
	getgasks:function(array){
		if(!array){
			return [];
		}
		
		var low=array[array.length-1][0];//最低价
		var high=array[0][0];//最高价
		var r=high-low;
		var block=this.getBlock(r,100);
		var n=Math.abs(Number(Math.log(block)/Math.log(10))).toFixed(0);//精确小数位数
		if(r/block<2){
			block=block/2;
			n++;
		}
		if(block>=1)(n=0);
		low=parseInt(low/block)*block;
		high=parseInt(high/block)*block;
		var gasks=[];
		var amount=0;
		for(var i=array.length-1;i>=0;i--){
			if(array[i][0]>low){
				var amountInt=parseInt(amount,10);
				if(amountInt>0){
					gasks.unshift([Number(low).toFixed(n),amountInt]);
				}
				if(low>=high){
					break;
				}
				low+=block;
			}
			amount+=array[i][1];
		}
		return gasks;
	},
	getgbids:function(array){
		if(!array){
			return [];
		}
		
		var low=array[array.length-1][0];
		var high=array[0][0];
		var r=high-low;
		var block=this.getBlock(r,100);
		var n=Math.abs(Number(Math.log(block)/Math.log(10))).toFixed(0);//精确小数位数
		if(r/block<2){
			block=block/2;
			n++;
		}
		if(block>=1)(n=0);
		low=parseInt(low/block)*block;
		high=parseInt(high/block)*block;
		
		var gbids=[];
		var amount=0;
		for(var i=0;i<array.length;i++){
			if(array[i][0]<high){
				var amountInt=parseInt(amount,10);
				if(amountInt>0){
					gbids.push([Number(high).toFixed(n),amountInt]);
				}
				if(high<=low){
					break;
				}
				high-=block;
			}
			amount+=array[i][1];
		}
		return gbids;
	},
	getBlock:function(b,scale){
		if(b==0||b>scale){
			return scale;
		}else{
			scale=scale/10;
			return this.getBlock(b,scale);
		}
	},
	getZeros:function(i){
		var zeros="";
		while(i>0){
		 i--;
		 zeros+="0";
		}
		return zeros;
	},
	getPrice:function(arr,lastInt){
		if(arr[1] == undefined){
			arr[1] = 0;
		}
		var arrStr = arr[0] + "." + arr[1];
			arrStr = this.fixNumber(parseFloat(arrStr),this.moneyDecimal[this.symbol]);
			arrStr = arrStr.split(".");
		
		return [arrStr[0],arrStr[1]];
	},
	getAmount:function(arr){
		if(arr[1] == undefined){
			arr[1] = 0;
		}
		var arrStr = arr[0] + "." + arr[1];
			arrStr = this.fixNumber(parseFloat(arrStr),this.coinDecimal[this.symbol]);
		var	arrStr = arrStr.split(".");

			return [arrStr[0],arrStr[1]];
	},
	setTopTickers:function(array){
		if(!array)return;
		for(var i=0;i<array.length;i++){
			var data=array[i];
			if(data.moneyType==0 && data.exeByRate==1){
				$("#markettop li."+data.symbol).find("span").text(data.ticker.dollar);
			}else{
				$("#markettop li."+data.symbol).find("span").text(data.ticker.last);
			}
		}
	},
	setMarketShow:function(market_from_name,_contract_unit,_money_type,url){
		var market_show=market_from_name+"  "+(_contract_unit+"/"+_money_type).toUpperCase();;
        //$("#market a:eq(0)").attr("href",url).attr("title",market_show).text(market_show);
        
        if(this.isBtc123()){
        	$("#markettop li.order_info a").hide();
        	$("#markettop li.depth_info a").hide();
        }else{
        	 $("#markettop li.order_info a").show().attr("href","http://www.btc123.com/order?symbol="+this.symbol);
             $("#markettop li.depth_info a").show().attr("href","http://www.btc123.com/order/order?symbol="+this.symbol);
        }
//        if(this.isBtc123()){
//        	$("#market a:eq(1)").hide();
//        }else{
//        	$("#market a:eq(1)").show().attr("href",this.basePath+"/order?symbol="+this.symbol);
//        }
	},
	refreshPage:function(symbol){
		if(symbol){
			window.location.href=this.basePath+"/market?symbol="+symbol;
		}else{
			window.location.href=this.basePath+"/market";
		}
	},
    refreshUrl:function (symbol){
		try {
			this.browerState++;
			$("#countView").find("iframe").attr("src","https://www.btc123.com/kline/marketCount/"+symbol+"?symbol="+symbol);
			History.pushState({state:this.browerState}, this.title, "?symbol="+symbol);
		} catch (e) {
		}
	},
	isBtc123:function(){
		if(this.symbol.indexOf("btc123")>=0)
			return true;
		else
			return false;
	}
};

function keepalive(ws){
	 var time = new Date().getTime();
	 if (ws.bufferedAmount == 0) {
	 	ws.send("{time:"+time+"}");
    }
}

//扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

