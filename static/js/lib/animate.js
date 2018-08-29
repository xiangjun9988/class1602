/**************************************
 * Animation Frame
 * @Version 1.0
 *
 * @Author zhangrongming
 * @Tel 18911984708
 * @Email zrm@ickt.com
 *
 * @Date Fri Aug 08 2014 (In China)
 *
 * @Easy Example : Animate.add({
 *		type : 'easeOutBounce'
 *		,duration : 2000
 *		,args : one
 *		,main : function(num){//do something}
 *	})
 *************************************
 *************************************/
/**
 * @paran w : window全局对象
 * @param n : name框架实例化对象名称
 ***/
;(function(w, n){
		/**
		 * @intro 获取h5动画api，不存在返回setTimeout计时器句柄
		 * @param w : window全局变量
		 * @param r : 方法后缀名
		 * @param callback : 回调函数
		 * @return 循环方法
		 ***/
	var _requestAnimateFrame = (function(w, r){
			var _lastTime = 0;
			return w['r' + r] || w['webkitR' + r] || w['mozR' + r] || w['msR' + r] || w['oR' + r] || function(callback, element) {
	            var _currTime = +new Date(),
	            	_timeToCall = Math.max(0, 16 - (_currTime - _lastTime)),
	                _newTime = _currTime + _timeToCall,
	            	id = w.setTimeout(function() { callback(_newTime); }, _timeToCall);
	            _lastTime = _newTime;
	            return id;
	        };
		})(w, 'equestAnimationFrame'),
		/**
		 * @intro 清除h5动画api计时器，不存在清除setTimeout句柄
		 * @param w : window全局变量
		 * @param r : 方法后缀名
		 ***/
		_cancelAnimateFrame = (function(w, c){
			return w['c' + c] || w['webkitC' + c] || w['mozC' + c] || w['msC' + c] || w['oC' + c] || function(t){ 
				clearTimeout(t); 
			};
		})(w, 'ancelAnimationFrame'),
		/**
		 * @intro 设置setInterval计时器
		 * @param w
		 * @return 循环句柄id 
		 ***/
		_setIntervalFram = function(callback, interval){
			var id = setInterval(callback, interval);
			return id;
		},

		_clearIntervalFram = function(id){
			clearInterval(id);
		};

	var Animate = function(interval){
		this._timer = 0;
		this._queen = [];
		this._interval = interval || false;
	}
	Animate.prototype = {
		easing : {
			def: function (t, b, c, d) {
                return (c - b) * t / d + b
            },
            linear : function(t, b, c, d){
            	return this.def(t, b, c, d);
            }
		}
		,_run : function(){
			if(this._timer) return;
			this._reset();
		}
		,_clear : function(){
			!this._interval ? _cancelAnimateFrame(this._timer) : _clearIntervalFram(this._timer);
			this._timer = 0;
		}
		,_reset : function(){
			this._clear();
			this._go();
		}
		,_go : function(){
			var that = this;
			that._timer = !this._interval ? _requestAnimateFrame(function(){
				that._loop();
			}) : _setIntervalFram(function(){
				that._loop();
			}, that._interval);
		}
		,_loop : function(){
			if(this._queen.length === 0){
				this._clear();
				return;
			}
			var now = +new Date()
				,i = this._queen.length - 1
				,instance = null;
			for(; i >= 0; i--){
				instance = this._queen[i];
				instance.passed = now - instance.time;
				if(instance.passed < 0)
					continue;
				if(instance.passed >= instance.duration){
					instance.passed = instance.duration;
					instance.tween = instance.to;
					this._execute(instance);
					this._destory(instance);
				}else{
					this._bufferExec(instance);
				}
				instance = null;
			}
			!this._interval && this._go();
		}
		,_execute : function(instance){
			try{
				instance.main(instance.args);
			}catch(e){

			}
		}
		,_bufferExec : function(instance){
			instance.tween = typeof instance.step === 'undefined' ? 
				this.easing[instance.type](instance.passed, instance.from, instance.to, instance.duration) : 
				instance.step;
			this._execute(instance);
		}
		,_adaptInstance : function(instance){
			var opinion = this.extend({}, {
					from : 0
					,to : 1
					,type : 'def'
					,duration : 400
					,args : null
					,main : function(){}
					,time : +new Date()
					,end : function(){}
				});
			if(instance.type && !(instance.type in this.easing))
				instance.type = 'def';
			for(var key in opinion){
				if(typeof instance[key] === 'undefined')
					instance[key] = opinion[key];
			}
			
			return instance;
		}
		,_addInstance : function(instance, shouldReset){	
			var obj = this._adaptInstance(instance),
				pos = this._getIndex(obj);
			if(pos < 0){
				this._queen.push(obj);
			}else{
				if(shouldReset){
					this._queen[pos].time = +new Date()
				}
			}				
		}
		,_getIndex : function(instance){
			var i = this._queen.length - 1;
			for(; i >= 0; i--){
				if(this._queen[i] === instance){
						return i
				}
			}
			return -1;
		}
		,_destory : function(instance){
			var that = this;
			that._queen.splice(that._getIndex(instance), 1);	
			instance.end(instance.args);
			for(var key in instance){
				delete instance[key];
			}
			instance = null;
		}
		,add : function(param, shouldReset){
			if(!param)
				return;
			var tostring = Object.prototype.toString;
			if(tostring.call(param) === "[object Array]"){
				for(var i = 0, len = param.length; i < len; i++){
					tostring.call(param[i]) === "[object Object]" && 
					this._addInstance(param[i], shouldReset);
				}
			}else if(tostring.call(param) === "[object Object]"){
				this._addInstance(param, shouldReset);
			}
			this._run();
		}
		,stop : function(){
			this._clear();
		}
		,begin : function(){
			if(typeof arguments[0] === 'boolean' && arguments[0]){
				this._run();
			}else if(typeof arguments[0] === 'object'){
				var pos = this._getIndex(this._adaptInstance(arguments[0]));
				if(pos >= 0){
					this._queen[pos].time += getNewTime(this._queen[pos].time, this._queen[pos].passed);
				}
				this._run();
			}else{
				var i = this._queen.length - 1;
				for(; i >= 0; i--){
					this._queen[i].time += getNewTime(this._queen[i].time, this._queen[i].passed);
				}
				this._run();
			}	
			function getNewTime(queenTime, passTime){
				return +new Date() - queenTime - (!!passTime ? +passTime : 0);
			}		
		}
		,clear : function(){
			this._clear();
			var i = this._queen.length - 1;
			for(; i >= 0; i--){
				this._destory(this._queen[i]);
			}
		}
		,delete : function(instance){
			this._destory(this._adaptInstance(instance));
		}
		,changeInterval : function(interval){
			this._clear();
			if(typeof interval === 'number'){
				this._interval = interval;
			}else if(typeof interval === 'boolean' && !interval){
				this._interval = interval;
			}else if(!interval){
				this._interval = !!interval;
			}
			this._go();
		}
		// number, object, string, boolean 
		,create : function(){
			var len = arguments.length,
				_num = null, 
				cout = 1;
			if(typeof arguments[0] === "number"){
				_num = arguments[0];
			}else{
				cont = 0;
			}
			if(len > cout){
				if(typeof arguments[cout] === "object"){
					arguments[cout][arguments[cout + 1] && typeof arguments[cout + 1] === "string" ? arguments[cout + 1] : 'animate'] = new Animate(_num);
					if((arguments[cout + 1] && typeof arguments[cout + 1] === "boolean") || 
						(arguments[cout + 2] && typeof arguments[cout + 2] === "boolean")){
						delete w.animate;
					}
				}else if(typeof arguments[cout] === "string"){
					if(typeof arguments[cout] === "boolean"){
						return new Animate(_num);
					}else{
						try{
							if(arguments[cout] in w)
								return;
						}catch(e){}
						w[arguments[cout]] = new Animate(_num);
						delete w.animate;
					}					
				}else{
					return new Animate(_num);
				}
			}else{
				if(_num){
					w.animate = new Animate(_num);
				}else{
					return new Animate();
				}			
			}
		}
		,extend : function() {
			var key
				,i = 1
				,len = arguments.length
				,target = null
				,copy;
			if(len === 0){
				return;
			}else if(len === 1){
				target = this.prototype;
			}else{
				target = arguments[0];
			}

			for(; i < len; i++){
				for(key in arguments[i]){
					copy = arguments[i][key];
					target[key] = copy;
				}
			}
			return target;
		}
	}

	w[n ? n : 'animate'] = new Animate();

})(window);

// 算法扩展
animate.extend(animate.easing, {
	swing: function (t, b, c, d) {
		return this.easeOutQuad(t, b, c, d);
	},
	easeInQuad: function (t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (t, b, c, d) {
		return c - this.easeOutBounce (d-t, 0, c, d) + b;
	},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (t, b, c, d) {
		if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
		return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});
