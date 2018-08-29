window.onload = function(){
	//生成界面
	!function(){
		if(!names)
			return;
		var i = 0,
			len = names.length,
			container = document.getElementById('container'),
			html = '';
		for(; i < len; i++){
			html += '<span id="name_' + i + '">' + names[i] + '</span>';
		}
		if(container)
			container.innerHTML = html;
		document.getElementById('members').value = '成员:' + len;
	}();
	//处理交互
	tween = animate.create(animateInterval, true),
	span = document.getElementsByTagName('span'),
	shadow = document.getElementById('shadow');
	result = document.getElementById('result');
	pattern = document.getElementById('pattern');

	setPattern();
}
function setSingle(dom){
	if(singleSelect){
		singleSelect = false;
		dom.innerHTML = '设为唯一模式';
	}else{
		singleSelect = true;
		dom.innerHTML = '设为重复模式';
	}
	setPattern();
}
function setPattern(){
	if(singleSelect){
		pattern.value = '已选中:' + selectNames.length;
	}else{
		pattern.value = '重复模式';
	}
}
function changeTime(time){
	if(!time || isNaN(time))
		return;
	animateTime = parseInt(time) * 1000 > 0 ? parseInt(time) * 1000 : 2 * 1000;
}
function changeSpeed(speed){
	if(!speed || isNaN(speed))
		return;
	animateSpeed = parseInt(speed) > 0 ? parseInt(speed) : 6;
}
function changeFonts(fontSize){
	if(!fontSize || isNaN(fontSize)){
		return;
	}
	fontSize = parseInt(fontSize)
	document.body.className = 'fs-' + (fontMap[fontSize] ? fontMap[fontSize] : (fontSize < fontMap['start'] ? fontMap['start'] : (fontMap['start'] > fontMap['end'] ? fontMap['end'] : 36)));
}
function changeIntervals(intervals){
	if(!intervals || isNaN(intervals) || !canAnimate)
		return;
	animateInterval = parseInt(intervals) > 0 ? parseInt(intervals) : 33;
	tween = animate.create(animateInterval, true);
}
function changeSkin(num){
	if(!num || isNaN(num))
		return;
	var num = parseInt(num);
	if(num <= skinLength){
		document.body.style.backgroundImage = 'url(./static/img/bg/' + num + '.jpg)';
	}
}
function animateSelect(){
	if(!canAnimate)
		return;
	canAnimate = false;
	clearResult();
	tween.add({
		duration: animateTime,
		main : function(){
			changeSpan();
		},
		end : function(){
			//第一步
			changeSpan();
			tween.add({
				duration : animateInterval * animateSpeed * 1,
				end : function(){
					//第二步
					changeSpan();
					tween.add({
						duration : animateInterval * animateSpeed * 2,
						end : function(){
							//第三步
							changeSpan();
							tween.add({
								duration : animateInterval * animateSpeed * 3,
								end : function(){
									//第四步
									changeSpan();
									tween.add({
										duration : animateInterval * animateSpeed * 4,
										end : function(){
											//第五步
											changeSpan();
											tween.add({
												duration : animateInterval * animateSpeed * 5,
												end : function(){
													gameFinal();
													canAnimate = true;
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}
function immediateSelect(){
	if(!canAnimate)
		return;
	clearResult();
	gameFinal();
}
function gameFinal(){	
	changeSpan();
	gameEnd();
}
function clearResult(){
	result.innerHTML = '';
}
function setSelectName(){
	var num = parseInt(Math.random() * span.length);
	if(!singleSelect)
		return num;
	if(span.length <= selectNames.length){
		selectNames = [];
	}
	for(var i = selectNames.length - 1; i >= 0; i--){
		if(num === selectNames[i]){
			num = arguments.callee();
			break;
		}
	}
	return num;
}
function changeSpan(){
	var num = setSelectName();
	singleSelect && selectNames.push(num);
	var i = span.length - 1;
	for(; i >= 0; i--){
		span[i].className = '';
	}
	span[num].className = 'choose';
	shadow.style.backgroundPositionY = -1516 + span[num].offsetTop + span[num].offsetHeight / 2 + 'px';
	shadow.style.backgroundPositionX = -1495 + span[num].offsetLeft + span[num].offsetWidth / 2 + 'px	';
}
function gameEnd(){
	var i = span.length - 1;
	for(; i >= 0; i--){
		if(span[i].className.indexOf('choose') >= 0){
			result.innerHTML = span[i].innerHTML;
			setPattern();
			return;
		}
	}
}