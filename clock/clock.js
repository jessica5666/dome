var canvas = document.getElementById( 'clock' );
var ctx = canvas.getContext( '2d' );

var cwidth = ctx.canvas.width;
var cheight = ctx.canvas.height;
var r = cwidth/2;

// 宽度变化时其他数值的比例
var rem = cwidth / 200;

// 画圆
function drawBackground(){
	ctx.save();
	ctx.translate( r,r );
	ctx.beginPath();
	ctx.lineWidth = 10 * rem;
	ctx.arc( 0,0,r-ctx.lineWidth/2,0,2*Math.PI );
	ctx.stroke();

	// 绘制时钟上的时间数字
	var hourNum = [ 3,4,5,6,7,8,9,10,11,12,1,2 ];
	ctx.font = 18 * rem + 'px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	// 遍历 hourNum 
	hourNum.forEach( function( num,i ){
		// 获得每个时间的角度
		var rad = 2 * Math.PI / 12 * i;
		// 根据每个时间的角度获得相应的 x和y 坐标值
		var x = Math.cos( rad ) * ( r-30 * rem );
		var y = Math.sin( rad ) * ( r-30 * rem );
		ctx.fillText( num,x,y );
	} );

	// 绘制秒针的格子
	for( var i=0;i<60;i++ ){
		// 获得每个时间的角度
		var rad = 2 * Math.PI / 60 * i;
		// 根据每个时间的角度获得相应的 x和y 坐标值
		var x = Math.cos( rad ) * ( r-18 * rem );
		var y = Math.sin( rad ) * ( r-18 * rem );
		ctx.beginPath();
		if( i%5 == 0 ){
			ctx.fillStyle = '#000';
			ctx.arc( x,y,2 * rem,0,2*Math.PI );
		}else{
			ctx.fillStyle = '#ccc';
			ctx.arc( x,y,2 * rem,0,2*Math.PI );
		}
		ctx.fill();
	}
}

// 画时针
function drawHour( hour,minute ){
	ctx.save();
	ctx.beginPath();
	var rad = 2 * Math.PI / 12 * hour;
	var mrad = 2 * Math.PI /12 / 60 * minute;
	ctx.rotate( rad+mrad );
	ctx.lineWidth = 6 * rem;
	ctx.lineCap = 'round';
	ctx.moveTo( 0,10 * rem );
	ctx.lineTo( 0,-r/2.5 );
	ctx.stroke();
	ctx.restore();
}

// 画分针
function drawMinute( minute ){
	ctx.save();
	ctx.beginPath();
	var rad = 2 * Math.PI / 60 * minute;
	ctx.rotate(rad);
	ctx.lineWidth = 3 * rem;
	ctx.lineCap = 'round';
	ctx.moveTo( 0,10 * rem );
	ctx.lineTo( 0,-r+50 * rem );
	ctx.stroke();
	ctx.restore();
}

// 画秒针
function drawSecond( second ){
	ctx.save();
	ctx.beginPath();
	var rad = 2 * Math.PI / 60 * second;
	ctx.rotate(rad);
	ctx.fillStyle = 'red';
	ctx.moveTo( -2 * rem,20 * rem );
	ctx.lineTo( 2 * rem,20 * rem );
	ctx.lineTo( 1,-r+30 * rem );
	ctx.lineTo( -1,-r+30 * rem );
	ctx.fill();
	ctx.restore();
}

drawDot();
// 中心圆点
function drawDot(){
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.arc( 0,0,4 * rem,0,2*Math.PI );
	ctx.fill();
}

// 指针
function draw(){
	ctx.clearRect( 0,0,cwidth,cheight );
	var now = new Date();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();

	drawBackground();
	drawHour( hour,minute );
	drawMinute( minute );
	drawSecond( second );
	drawDot();
	ctx.restore();
}

draw();
setInterval( draw,1000 );