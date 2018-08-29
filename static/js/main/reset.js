(function(){
	if(nameData){
		var h = document.getElementsByTagName('head').item(0),
			s = document.createElement('script');
		s.type = "text/javascript";
		s.src = 'data/names/' + nameData + '.js';
		h.appendChild(s);
	}
})();
//设置字体大小
if(fontSize){
	document.body.className = 'fs-' + fontSize;
}	

//设置背景
if(backgroundIndex){
	document.body.style.backgroundImage = 'url(./static/img/bg/' + backgroundIndex + '.jpg)';
}