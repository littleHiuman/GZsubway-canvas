window.onload = function () {
	
	var prog = document.getElementsByClassName('prog')[0];
	var hiden = document.getElementsByClassName('hiden')[0];
	var progWidth = prog.style.width;
	var timer = setInterval(function(){
		progWidth ==''?progWidth = 0:progWidth = progWidth;
		progWidth = parseInt(progWidth) +10;
		prog.style.width = progWidth + '%';
		prog.innerText = progWidth+'%';
		if(progWidth == 100){
			clearInterval(timer)
			hiden.style.transform = 'rotate(360deg)'
			hiden.style.width = 0;
			hiden.style.height = 0;
			setInterval(function(){
				hiden.style.display = 'none';
			},1000)
		}
	},500);

}