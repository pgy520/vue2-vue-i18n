/**
 * Created by andyk on 2015/9/15.
 * Range v1.2.15091601
 * events focus > __rangeSlide
 */
;(function(window) {
    BitRange = function (option) {
        var _op    = option || {},
            _wrap  = $(_op.range),
            _value = _op.value   || {min:0,max:100}, /*设置值*/
            _step  = _op.step *1 || 0,     /*步进*/
            _point = _op.point*1 || 0,     /*点设置*/
            _path  = _op.path    || '',    /*轨道设置*/
            _slide = _op.slide,
            _delay = _op.delay || 10,
            _ratio,


            _this  = $(this),
            _leg   = typeof _value['max'] == 'object' ? _value['max'].length : 1,
            _range = $('<div class="range_wrap" data-ratio="0" tabindex="0"><div class="range_paths_wrap"></div><div class="range_track_wrap"><div class="range_track"></div><div class="range_handle"></div></div><div class="range_points_wrap"></div></div>'),
            _rPath = '<div class="range_path"></div>',
            _rPoint= '<div class="range_point"></div>',
            _width,
            $dom = $(document);
            _range['trackWrap']  = _range.find('.range_track_wrap');
            _range['track']  = _range.find('.range_track');
            _range['handle'] = _range.find('.range_handle');
            _range['paths']  = _range.find('.range_paths_wrap');
            _range['points'] = _range.find('.range_points_wrap');
            _range['ratio']  = 0;

        if(_wrap.length <= 0) return;

        /*初始化*/
        Init ();
        function Init (){
            _wrap.append(_range);
            //_wrap['_width'] = _wrap.width() || _wrap.parent().width() || _wrap.parent().parent().width();
            //直接设置为100%宽度，解决隐藏元素初始化取不到宽度的问题（2016年10月17日 by Siven）
            _wrap['_width'] = "100%";
            _wrap['_left']  = _wrap.offset().left;
            _width = _wrap['_width'] - _range['handle'].width()/2;

            _range['trackWrap'].width(_width);
            _range['points'].width(_width);

            if(_point){
                Points();
            }
            Paths();
        }

        /*创建元素*/
        function Create(e,n){
            var _e = e;
            for(var _i = 0; _i<n-1; _i++){
                _e += e
            }
            return $(_e)
        }

        /*轨道*/
        function Paths(){
            _rPath = Create(_rPath,_leg);
            _range['paths'].append(_rPath);
        }

        /*点*/
        function Points(){
            var _gap = 100/_point,
                _g   = 0;

            _rPoint  = Create(_rPoint,_point+1);
            _rPoint.each(function(i,c){
                $(c).css('left', _g+'%').attr('data-point-ratio',_g);
                _g += _gap;
            });
            _range['points'].append(_rPoint);
        }

        /*滑动*/
        function Slide(e,call){
            _range['ratio'] = e.pageX ? Ratio(e.pageX) : e;
            if((_range.is(':focus')||_range.hasClass('click')) && _this.rangeMouseup){
                _range.trigger('__rangeSlide',[call])
            }
        }

        /*比例*/
        function Ratio(x){
        	//步进时候再取正确的宽度值（2016年10月17日 by Siven）
        	_wrap['_width'] = _wrap.width() || _wrap.parent().width() || _wrap.parent().parent().width();
            var _R = Step((x - _wrap['_left']) / _wrap['_width'] * 100);
          return Format(_R);
        }

        /*格式化*/
        function Format(x){
            if(x<=0){
                x = 0
            }else if(x>=100){
                x = 100
            }
            return x
        }

        /*步进*/
        function Step(val) {
            var _ModStep = (val - 0) % _step ,
                _alignValue = val - _ModStep;
            return parseFloat(_step ? _alignValue.toFixed(5) : val.toFixed(5));
        }

        /*延时器*/
        function Delay(fn){
            if(!_this._delayMet){
                fn&&fn();
                _this._Delay = setTimeout(function(){
                    _this._delayMet = false;
                },_delay);
                _this._delayMet = true;
            }
        }

        /*DOM*/
        function Dom(){
            _range['handle'].css({'left':_range['ratio']+'%'});
            _range['track'].css({'width':_range['ratio']+'%'});
            _range.attr('data-ratio',_range['ratio']);
            _rPoint.each(function(i,c){
                var _t = $(c),_r = $(c).data('point-ratio');
                _range['ratio'] >= _r ? _t.addClass('active') : _t.removeClass('active');
            })
        }

        /*Update*/
        function Update(x,e){
            if(x!==undefined){
                _range['ratio'] = Format(Step(x));
            }
            if(e){
                _range.trigger('__rangeSlide');
            }
            Dom();
        }

        /*reset*/
        function Reset(){
            _range['ratio'] = 0;
            Dom();
        }

        /*event*/
        $dom.mousemove(function(e){
            Delay(function(){
                //_this.pointDown ||
                if(!_this.rangeMouseup) return;
                Slide(e);
            });
        });

        _range.mousedown(function(e){
            _range.trigger('focus');
            _this.rangeMouseup = true;
            var _r = e.target.getAttribute('data-point-ratio'),
                _h = e.target == _range['handle'][0];

            if(_r){
                _this.pointDown = true;
                _h ? Slide(_r*1, 0) : Slide(_r*1)
            }else{
                _this.pointDown = false;
                _h ? Slide(e, 0) : Slide(e)
            }
            _range.addClass('click');

            if (typeof(document.onselectstart) != "undefined") {
                document.onselectstart = new Function("return false");
            }
        });

        _range.hover(function(){
            _range.addClass('hover')
            _wrap['_left']  = _wrap.offset().left;
        },function(){
            _range.removeClass('hover')
        });

        $dom.mouseup(function(){
            _this.rangeMouseup = false;
            _range.removeClass('click');
            if (typeof(document.onselectstart) != "undefined") {
                document.onselectstart = new Function("return true");
            }
        });

        _range.on('__rangeSlide',function(call){
            var _call = call!==undefined ? call : true;
            Dom();
            _ratio = _range['ratio'];
            call && _slide && _slide(_ratio,_wrap);

        }).on('focus',function(){
            _range.addClass('focus')
        }).on('blur',function(){
            _range.removeClass('focus')
        }).on('keydown',function(e){
            switch (e.which){
                case 37:
                    e.shiftKey ? _range['ratio'] -= 10 : _range['ratio'] -- ;
                    break;
                case 39:
                    e.shiftKey ? _range['ratio'] += 10 : _range['ratio'] ++ ;
                    break;
                default:
                    return
            }
            Slide(Format(_range['ratio']));
            Dom();
            _ratio = _range['ratio'];
            _slide && _slide(_ratio,_wrap);
        });

        $(window).on('resize',function(){
            //_wrap['_width'] = _wrap.width();
        	//直接设置为100%宽度，解决隐藏元素初始化取不到宽度的问题（2016年10月17日 by Siven）
            _wrap['_width'] = "100%";
            _wrap['_left']  = _wrap.offset().left;
            _width = _wrap['_width'] - _range['handle'].width()/2;
            _range['trackWrap'].width(_width);
            _range['points'].width(_width);
        });

        this.Range  = _range;
        this.Update = Update;
        this.Reset  = Reset;
    };

})(window);