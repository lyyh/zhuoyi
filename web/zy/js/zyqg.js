function luara(){
	var container = document.getElementsByClassName("scroll")[0];
	var list = document.getElementsByClassName("list")[0];
	var parOfBtn = document.getElementsByClassName("buttons")[0];
	var prev = document.getElementById("prev");
	var next = document.getElementById("next");
	var index = 1; //图片的索引
	var num = list.children.length - 2; //图片数量
	var buttons = parOfBtn.getElementsByTagName("span");
	var photoLength = 1265;
	var amountLength = -num*photoLength;
	var animated = false; //判断是否正在动画
	var time; //定时器

	//根据图片数量追加小圆点
	function appendBtns() {
		parOfBtn.innerHTML = "";
		for(var i = 1;i <= num;i++) {
			if(i == 1) {
				$(parOfBtn).append("<span index='" + i + "' class='on'></span>")
			}else{
				$(parOfBtn).append("<span index='" + i + "'></span>")
			}
		}
	}
	appendBtns();

	next.onclick = function(){
		if (!animated) {
			animate(-photoLength);
		}
	}
	prev.onclick = function(){
		if (!animated) {
			animate(photoLength);
		}
	}

	//设置自动切换图片(每隔3秒切换一次)
	function play() {
		time = setInterval(function(){
			next.click();
		},3000)
	}

	//清除定时器
	function stop() {
		clearInterval(time);
	}

	//鼠标移到图片上时触发
	container.onmouseover = stop;
	//鼠标离开图片后触发
	container.onmouseout = play;
	play();
	
	//添加按钮事件
	for(var i = 0;i<buttons.length;i++){
		buttons[i].onclick = function() {
			if (!animated) {
				if (this.className == "on") {
					return;
				}
				var myIndex = parseInt(this.getAttribute("index"));
				var myOffSet = (myIndex - index) * (-photoLength);
				animate(myOffSet);
			}
		}
	}

	//显示选中的原点
	function showButtons() {
		for(var i = 0;i < buttons.length;i++){
			if(buttons[i].className == "on"){
				buttons[i].className = "";
				break;
			}
		}
		index = parseInt(index);
		buttons[index - 1].className = "on";
	}

	//前后偏移
	function animate(offset){
		animated = true;
		var newLeft = parseInt(list.style.left) + offset;
		var interval = 100; //每次的位移时间量
		var speed; //每次位移的距离
		offset > 0?speed = 253:speed = -253;
		//内部函数,只能在该animate函数中调用go函数
		function go() {
			if(speed < 0 && parseInt(list.style.left) > newLeft ||speed > 0 && parseInt(list.style.left) < newLeft){
				list.style.left = speed + parseInt(list.style.left) + "px";
				//每隔interval秒执行一次go函数
				setTimeout(go,interval);
			}else{
				if(newLeft > -photoLength){
					list.style.left = amountLength + "px";
				}
				else if(newLeft < amountLength){
					list.style.left = -photoLength +"px";
				}
				index = -parseInt(list.style.left)/photoLength;
				showButtons();
				animated = false;
			}
		}
		//调用内部函数
		go();
	}
}
 
 
 //加载下载信息
 $(document).ready(function(){
	 luara();
	 $.ajax({
		 url:"/zy/static/json/download.json",
		 type:"post",
		 dataType:"json",
		 success:function(data) {
			 $("#downloadFile").html("");
			 $.each(data.download, function (index, fileNames){
				$("#downloadFile").append("<li><a href=''>"+fileNames+"</a></li>")
			 })
		 }
	 });
 })