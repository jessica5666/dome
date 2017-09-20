var canvasWidth = Math.min(800,$(window).width() - 20);
var canvasHeight = canvasWidth;

var strokeColor = 'black';
var isMouseDown = false; // 判断鼠标是否按下
var lastLoc = {x:0,y:0}; // 上一次的坐标点
var lastTime = 0; // 上一次的时间
var lastLineWidth = -1; // 上一次线条宽度

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$('#controller').css('width',canvasWidth + 'px');

drawGrid();

// 清空文字
$('#clear_btn').click(
    function( e ){
        context.clearRect( 0,0,canvasWidth,canvasHeight );
        drawGrid();
    }
)

// 选择文字颜色
$('.color_btn').click(
    function( e ){
        $('.color_btn').removeClass('selected');
        $(this).addClass('selected');
        strokeColor = $(this).css('background-color');
    }
)

// 为 canvas画布添加鼠标/触碰事件
function beginStroke( point ){
    isMouseDown = true;

    lastLoc = windowToCanvas( point.x,point.y );
    lastTime = new Date().getTime();
}

// 结束绘制
function endStroke(){
    isMouseDown = false;
}

// 移动绘制
function moveStroke( point ){
    var curLoc = windowToCanvas( point.x,point.y );
    var curTime = new Date().getTime();
    var s = caLcDistance( curLoc,lastLoc );
    var t = curTime - lastTime;

    var lineWidth = calcLineWidth( t,s );

    // 鼠标移动时绘制线条
    context.beginPath();
    context.moveTo( lastLoc.x,lastLoc.y );
    context.lineTo( curLoc.x,curLoc.y );

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
    context.stroke();

    lastLoc = curLoc;
    lastTime = curTime;
    lastLineWidth = lineWidth;
}

canvas.onmousedown = function( e ){
    // 阻止默认时间响应
    e.preventDefault();
    beginStroke( {x:e.clientX,y:e.clientY} );
}
canvas.onmousemove = function( e ){
    e.preventDefault();

    if( isMouseDown == true ){
        moveStroke( {x:e.clientX,y:e.clientY} );
    }
}
canvas.onmouseup = function( e ){
    e.preventDefault();
    endStroke();
}
canvas.onmouseout = function( e ){
    e.preventDefault();
    endStroke();
}

// 触控事件
canvas.addEventListener('touchstart',function( e ){
    // 阻止默认时间响应
    e.preventDefault();
    touch = e.touches[0];
    beginStroke( {x:touch.pageX,y:touch.pageY} );
});
canvas.addEventListener('touchmove',function( e ){
    e.preventDefault();

    if( isMouseDown == true ){
        touch = e.touches[0];
        moveStroke( {x:touch.pageX,y:touch.pageY} );
    }
});
canvas.addEventListener('touchend',function( e ){
    e.preventDefault();
    endStroke();
});

var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

// 利用速度计算出移动时,速度快->线条细,速度慢->线条粗
function calcLineWidth( t,s ){
    var v = s/t;

    var rstLineWidth;
    if( v<=minStrokeV ){
        rstLineWidth = maxLineWidth;
    }else if( v>=maxStrokeV ){
        rstLineWidth = minLineWidth;
    }else{
        rstLineWidth = maxLineWidth - (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }
    if( lastLineWidth == -1 ){
        return rstLineWidth;
    }
    return lastLineWidth*2/3 + rstLineWidth*1/3;
}

// 两点之间的距离
function caLcDistance( loc1,loc2 ){
    return Math.sqrt( (loc1.x-loc2.x)*(loc1.x-loc2.x) + (loc1.y-loc2.y)*(loc1.y-loc2.y) );    
}

// 获取鼠标点击时具体在canvas中的坐标
function windowToCanvas( x,y ){
    var bbox = canvas.getBoundingClientRect();
    return { x:Math.round(x-bbox.left),y:Math.round(y-bbox.top) };
}

// 绘制田字格
function drawGrid(){
    context.save();
    // 绘制边框
    context.strokeStyle = 'rgb(230,11,9)';

    context.beginPath();
    context.moveTo( 3,3 );
    context.lineTo( canvasWidth - 3,3 );
    context.lineTo( canvasWidth - 3,canvasHeight - 3 );
    context.lineTo( 3,canvasHeight - 3 );
    context.closePath();

    context.lineWidth = 6;
    context.stroke();

    // 绘制米字格
    context.beginPath();
    context.moveTo( 0,0 );
    context.lineTo( canvasWidth,canvasHeight );

    context.moveTo( canvasWidth,0 );
    context.lineTo( 0,canvasHeight );

    context.moveTo( canvasWidth/2,0 );
    context.lineTo( canvasWidth/2,canvasHeight );

    context.moveTo( 0,canvasHeight/2 );
    context.lineTo( canvasWidth,canvasHeight/2 );

    context.lineWidth = 1;
    context.stroke();

    context.restore();
}