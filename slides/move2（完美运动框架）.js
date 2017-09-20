// JavaScript Document

// 获取元素样式
function getStyle( obj, attr ){
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle( obj )[attr];
}

// 设置或改变元素样式
function setStyle( obj,json ){
	var attr = '';
	for( attr in json ){
		obj.style[attr] = json[attr];
	}
}

// 单个物体或者多个物体的任意值（attr：width、height、opacity等值都可以设置）变化
function doMove( obj,json,fn ){
	
	clearInterval( obj.timer );
	
	obj.timer = setInterval( function(){
		var bStop = true;  // 这一次运动结束了 --- 所有的值都到达了
		for( attr in json ){
			// 获取当前的
			var iCur = 0;
			if( attr == 'opacity' ){
				iCur = parseInt( parseFloat( getStyle( obj,attr ) )*100 );
			}else{
				iCur = parseInt( getStyle( obj,attr ) );
			}
			
			// 算速度
			var iSpeed = ( json[attr] - iCur )/8;
			iSpeed = iSpeed > 0 ? Math.ceil( iSpeed ) : Math.floor( iSpeed );
			
			// 检测停止
			if( iCur != json[attr] ){ bStop = false; } // 判断所有的值是否 v都到达了
			
			if( attr == 'opacity' ){
				obj.style.filter = 'alpha( opacity:' + ( iCur + iSpeed ) + ' )';
				obj.style.opacity = ( iCur + iSpeed )/100;
			}else{
				obj.style[attr] = iCur + iSpeed + 'px';
			}
			
		}
		if( bStop ){
			clearInterval( obj.timer );
			if( fn ){fn();}
		}
	},30 );
	
}

// 利用 className 获取元素
function getByClass( oParent,aClass ){
	var aEle = oParent.getElementsByTagName('*');
	var arr = [];
	
	for( var i=0;i<aEle.length;i++ ){
		if( aEle[i].className == aClass ){
			arr.push( aEle[i] );
		}
	}
	return arr;
	
}













