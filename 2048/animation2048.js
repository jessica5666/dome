// 在随机位置显示随机数字动画
function showNumAnimation( i, j, num) {
	var numCell = $('#num-cell-'+i+'-'+j);

	numCell.css('background-color',getNumBg( num ));
	numCell.css('color',getNumColor( num ));
	numCell.text( num );

	numCell.animate( {
		width:cellSildeWidth,
		height:cellSildeWidth,
		top:getPosTop( i, j ),
		left:getPosLeft( i, j )
	},50 );
}

// 移动动画
function showMoveAnimation( fromX, fromY, toX, toY ){
	var numCell = $('#num-cell-' + fromX + '-' + fromY );
	numCell.animate( {
		top:getPosTop( toX, toY ),
		left:getPosLeft( toX, toY )
	},200 );
}

function upDateScore( score ){
	$('#score').text( score );
}