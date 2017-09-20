// 游戏数据
var board = new Array();
var score = 0;
// 一次只能进行一次碰撞运算
var hasConflicted = new Array(); 

// 手机触控操作
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function(){
	// 初始化手机
	prepareForMobile();

	newgame();
});

function prepareForMobile(){
	if( documentWidth > 500 ){
		gridContainerWidth = 500;
		cellSildeWidth = 100;
		cellSpace = 20;
	}

	$('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);
	
	$('.grid-cell').css('width',cellSildeWidth);
	$('.grid-cell').css('height',cellSildeWidth);
	$('.grid-cell').css('border-radius',0.02*cellSildeWidth);
}

function newgame(){
	// 初始化棋盘格
	init();
	// 在随机的两个格子生成数字
	generateOneNum();
	generateOneNum();
}

function init(){
	for (var i = 0; i < 4; i ++) {
		for (var j = 0; j < 4; j ++) {
			var gridCell = $('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop( i, j ));
			gridCell.css('left',getPosLeft( i, j ));
		}
	}

	// 初始化每个小格子显示的数字为0
	for (var i = 0; i < 4; i ++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j ++) {
			board[i][j] = 0;
			// 初始化碰撞运算
			hasConflicted[i][j] = false;
		}
	}

	// 数字的显示样式
	upDateBoardView();

	score = 0;
}

// 数字的显示样式
function upDateBoardView(){
	$('.num-cell').remove();

	for (var i = 0; i < 4; i ++) {
		for (var j = 0; j < 4; j ++) {
			$('#grid-container').append('<div class="num-cell" id="num-cell-'+i+'-'+j+'"></div>')
			var numCell = $('#num-cell-' + i + '-' + j);

			if(board[i][j] == 0){
				numCell.css('width','0');
				numCell.css('height','0');
				numCell.css('top',getPosTop( i, j ) + cellSildeWidth/2);
				numCell.css('left',getPosLeft( i, j ) + cellSildeWidth/2);
			}else{
				numCell.css('width',cellSildeWidth);
				numCell.css('height',cellSildeWidth);
				numCell.css('top',getPosTop( i, j ));
				numCell.css('left',getPosLeft( i, j ));
				numCell.css('background-color',getNumBg( board[i][j]) );
				numCell.css('color',getNumColor( board[i][j]) );
				numCell.text( board[i][j] );
			}

			// 初始化碰撞运算
			hasConflicted[i][j] = false;
		}

		$('.num-cell').css('line-height',cellSildeWidth+'px');
		$('.num-cell').css('font-size',0.6*cellSildeWidth+'px');

	}
}

function generateOneNum(){
	if ( nospace( board ) ) 
		return false; // 有空格子
	// 随机一个位置 0~4之间
	var randx = parseInt(Math.floor( Math.random()*4 ));
	var randy = parseInt(Math.floor( Math.random()*4 ));
	
	// 判断坐标格子是否可用
	// 优化游戏运行中随机生成数字的速度
	var times = 0; 
	// 只随机生成位置50次
	while( times < 50 ){
		if( board[randx][randy] == 0 )
			break;

		var randx = parseInt(Math.floor( Math.random()*4 ));
		var randy = parseInt(Math.floor( Math.random()*4 ));
	
		times++;
	}
	// 没有生成的话就手动设置新增数字的位置
	if( times == 50 ){
		for (var i = 0; i < 4; i ++)
			for (var j = 0; j < 4; j ++){
				if(board[i][j] == 0){
					randx = i;
					randy = j;
				}
			}
	}

	// 随机一个数字
	var randNum = Math.random() < 0.5 ? 2 : 4;
	// 在随机位置显示随机数字
	board[randx][randy] = randNum;
	showNumAnimation( randx, randy, randNum );

	// 没有空格子
	return true; 
}

// 键盘操作
$(document).keydown(function(event){
	switch( event.keyCode ){
		case 37: // left
			event.preventDefault();
			// 判断是否可以向左移动
			if( moveLeft() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
			break;
		case 38: // up
			event.preventDefault();
			if( moveUp() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
			break;
		case 39: // right
			event.preventDefault();
			if( moveRight() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
			break;
		case 40: // down
			event.preventDefault();
			if( moveDown() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
			break;
		default: // default
			break;
	}
});

// 手机触控操作
document.addEventListener('touchstart',function(event){
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});
// 解决e.preventDefault()使用不正确android手机触控操作无反应
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});
document.addEventListener('touchend',function(event){
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	// 判断触控的方向
	var deltaX = endX - startX;
	var deltaY = endY - startY;

	// 只有滑动一定范围才能认为是移动
	if( Math.abs( deltaX ) < 0.3*documentWidth && Math.abs( deltaY ) < 0.3*documentWidth )
		return;

	// X
	if( Math.abs( deltaX ) >= Math.abs( deltaY ) ){
		if( deltaX > 0 ){
			// move right
			if( moveRight() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
		}else{
			// move left
			if( moveLeft() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
		}
	}else{ // Y
		if( deltaY > 0 ){
			// move down
			if( moveDown() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
		}else{
			// move up
			if( moveUp() ){
				setTimeout( 'generateOneNum()',210 );
				setTimeout( 'isgameover()',300 );
			}
		}
	}
});


// 游戏是否结束
function isgameover(){
	if( nospace( board ) && nomove( board ) ){
		gameover();
	}
}

function gameover(){
	alert('gameover!');
}

function moveLeft(){
	if ( !canMoveL( board ) )
		return false;
	// moveLeft
	for (var i = 0; i < 4; i ++)
		for (var j = 1; j < 4; j ++){
			if( board[i][j] != 0 ) {
				for (var k = 0; k < j; k ++){
					if( board[i][k] == 0 && noHorizontal( i, k, j, board ) ){
						// move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if( board[i][k] == board[i][j] && noHorizontal(i, k, j, board) && !hasConflicted[i][k] ){
						// move
						showMoveAnimation( i, j, i, k );
						// add
						board[i][k] += board[i][j];
						board[i][j] = 0;

						//add score
						score += board[i][k];
						upDateScore( score );

						// 发生碰撞运算
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	setTimeout( 'upDateBoardView()',200 );
	return true;
}

function moveRight(){
	if ( !canMoveR( board ) )
		return false;

	// moveRight
	for (var i = 0; i < 4; i ++)
		for (var j = 2; j >= 0; j --){
			if( board[i][j] != 0 ) {
				for (var k = 3; k > j; k --){
					if( board[i][k] == 0 && noHorizontal( i, j, k, board ) ){
						// move
						showMoveAnimation( i, j, i, k );
						board[i][k] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if( board[i][k] == board[i][j] && noHorizontal( i, j, k, board ) && !hasConflicted[i][k] ){
						// move
						showMoveAnimation( i, j, i, k );
						// add
						board[i][k] *= 2;
						board[i][j] = 0;

						//add score
						score += board[i][k];
						upDateScore( score );

						// 发生碰撞运算
						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	setTimeout( 'upDateBoardView()',200 );
	return true;
}

function moveUp(){
	if ( !canMoveU( board ) )
		return false;

	//moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
			if( board[i][j] != 0 ) {
				for (var k = 0 ; k < i ; k ++ ){
					if( board[k][j] == 0 && noVertical( j, k, i, board ) ){
						// move
						showMoveAnimation( i, j, k, j );
						board[k][j] = board[i][j];
						board[i][j] = 0;

						continue;
					}else if( board[k][j] == board[i][j] && noVertical( j, k, i, board ) && !hasConflicted[k][j] ){
						// move
						showMoveAnimation( i, j, k, j );
						// add
						board[k][j] *= 2;
						board[i][j] = 0;

						//add score
						score += board[k][j];
						upDateScore( score );

						// 发生碰撞运算
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	setTimeout( 'upDateBoardView()',200 );
	return true;
}

function moveDown(){
	if ( !canMoveD( board ) )
		return false;

	// moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){
                    if( board[k][j] == 0 && noVertical( j, i, k, board ) ){
                        showMoveAnimation( i, j, k, j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noVertical( j, i, k, board ) && !hasConflicted[k][j] ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;

                        //add score
						score += board[k][j];
						upDateScore( score );

						// 发生碰撞运算
						hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
	setTimeout( 'upDateBoardView()',200 );
	return true;
}