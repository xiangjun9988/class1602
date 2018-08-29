/**************************************
 * Roll Books Config
 *
 * @School 爱创课堂
 * @Site www.icketang.com
 *
 * @Author zhangrongming
 * @Tel 18911984708
 * @Email zrm@ickt.com
 *
 * @Date Mon Aug 25 2014 (In China)
 *************************************
 *************************************/

var nameList = [
	'test'
];

var animateSpeed = 6,				//动画速度，控制结束时动画间隔
	animateTime = 2 * 1000,			//动画时间，控制字动画用时
	animateInterval = 33,			//动画帧频，控制动画时间间隔
	singleSelect = false,			//模式选择按钮，筛选重复模式以及唯一模式
	skinLength = 5,					//皮肤长度
	canAnimate = true,				//动画控制开关，能否继续进行动画
	selectNames = [],				//已选中的名字列表
	tween, 							//自定义动画对象
	nameData = nameList[0],			//名字数据文件
	fontSize = nameList[1] ? nameList[1] : '',	//名字字体大小
	backgroundIndex = 5,			//背景图片索引
	span, 							//名字span序列
	shadow, 						//灯效对象
	result, 						//结果对象
	pattern,						//唯一模式参数对象
	fontMap = {
		 '24' : 24
		,'25' : 26
		,'26' : 26
		,'27' : 28
		,'28' : 28
		,'29' : 30
		,'30' : 30
		,'31' : 32
		,'32' : 32
		,'33' : 34
		,'34' : 34
		,'35' : 36
		,'36' : 36
		,'37' : 38
		,'38' : 38
		,'39' : 40
		,'40' : 40
		,'42' : 42
		,'44' : 44
		,'46' : 46
		,'48' : 48
		,'50' : 50
		,'start' : 24 
		,'end' : 40
	};