// 手机屏幕的相对尺寸
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSildeWidth = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;

// 初始化棋盘格
function getPosTop( i, j ){
	return cellSpace + i*(cellSildeWidth + cellSpace);
}
function getPosLeft( i, j ){
	return cellSpace + j*(cellSildeWidth + cellSpace);
}

// 背景色
function getNumBg( num ){
	switch( num ){
		case 2:return '#eee4da';break;
		case 4:return '#ede0c8';break;
		case 8:return '#f2b179';break;
		case 16:return '#f59563';break;
		case 32:return '#f67e5f';break;
		case 64:return '#f65e3b';break;
		case 128:return '#edcf72';break;
		case 256:return '#edcc61';break;
		case 512:return '#9c0';break;
		case 1024:return '#33b5e5';break;
		case 2048:return '#09c';break;
		case 4096:return '#a6c';break;
		case 8192:return '#93c';break;
	}
	return 'black';
}
// 字体颜色
function getNumColor( num ){
	if ( num <= 4 )
		return '#776e65';
	
	return 'white';
}

// 判断是否有空格子
function nospace( board ){
	for (var i = 0; i < 4; i ++)
		for (var j = 0; j < 4; j ++)
			if ( board[i][j] == 0 )
				return false; // 有空格子

	return true; // 没有空格子
}

// 是否可以向左移动
function canMoveL( board ){
	for (var i = 0; i < 4; i ++)
		for (var j = 1; j < 4; j ++)
			if (board[i][j-1] == 0 || board[i][j-1] == board[i][j])
				return true;

	return false;
}

// 是否可以向右移动
function canMoveR( board ){
	for (var i = 0; i < 4; i ++)
		for (var j = 3 ; j >= 0 ; j --)
			if (board[i][j+1] == 0 || board[i][j+1] == board[i][j])
				return true;

	return false;
}

// 是否可以向上移动
function canMoveU( board ){
	for (var j = 0; j < 4; j ++)
		for (var i = 1; i < 4; i ++)
			if (board[i-1][j] == 0 || board[i-1][j] == board[i][j])
				return true;

	return false;
}

// 是否可以向下移动
function canMoveD( board ){
	for (var j = 0; j < 4; j ++)
		for (var i = 2 ; i >= 0 ; i --)
			if (board[i+1][j] == 0 || board[i+1][j] == board[i][j])
				return true;

	return false;
}

// 判断移动之间是否有障碍物
function noHorizontal( row, col1, col2, board ){
	for (var i = col1+1; i < col2; i ++)
		if ( board[row][i] != 0 )
			return false;

	return true;
}
function noVertical( col , row1 , row2 , board ){
    for( var i = row1 + 1 ; i < row2 ; i ++ )
        if( board[i][col] != 0 )
            return false;
    return true;
}

// 游戏结束
function nomove( board ){
	if( canMoveL( board ) || canMoveR( board ) || canMoveU( board ) || canMoveD( board ) )
		return false;

	return true;
}