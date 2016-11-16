require('./core/zepto.min.js');
var IScroll = require('./core/iscroll-probe.js');
var audio = document.getElementById("audio");
var musicSum;
var myMusic = {
	/**
	 * 获取歌曲列表
	 */
	getMusicList : function(){
		$.ajax({
			url : '/src/data/music.json',
			dataType : 'json',
			success : function(data){
				var str = '';
				musicSum = data.data.length;//得到歌曲总数
				$.each(data.data, function(i, value){
					i = i + 1;
					str += '<li data-number="'+ i +'" data-src="'+ value.src +'" data-cover="'+ value.musicCover +'"><div>'+ i +'</div><div><p class="musicName">'+ value.musicName +'</p><p class="musicAuthor">'+ value.musicAuthor +'</p></div></li>'
				});
				$('#musicList').html(str);
				myMusic.activeMusic();
			}
		});
	},
	updateList : function(){
		var scroll = new IScroll("#container",{
			/*需要使用iscroll-probe.js才能生效probeType：1  滚动不繁忙的时候触发
			probeType：2  滚动时每隔一定时间触发
			probeType：3  每滚动一像素触发一次*/
			probeType: 1,
			momentum: true,
			//shrinkScrollbars: 'scale', // 当滚动边界之外的滚动条是由少量的收缩
			useTransform: true, //CSS转化
			useTransition: true, //CSS过渡
			bounce: true, //反弹
			startX: 0,
			startY: 0
		});
	},
	/**
	 * 播放音乐
	 */
	musicPlay : function (index){
		var name = $('li').eq(index).find('.musicName').text();
		var author = $('li').eq(index).find('.musicAuthor').text();
		var cover = $('li').eq(index).attr('data-cover');
		var number = $('li').eq(index).attr('data-number');
		var src = $('li').eq(index).attr('data-src');
		$('li').eq(index).addClass('active').siblings().removeClass('active');//给当前播放歌曲添加样式
		$('#audio').attr('src', src);
		$('#audio').attr('data-number', number);
		$('#musicCover').find('img').attr('src', cover);
		$('#playButton').html('<i class="iconfont">&#xe73c;</i>');
		$('#musicInfo').find('p').eq(0).text(name);
		$('#musicInfo').find('p').eq(1).text(author);
		audio.play();
	},
	/**
	 * 点击歌曲添加样式
	 */
	activeMusic : function (){
		$('li').tap(function (){
			var index = $(this).index();
			//播放音乐
			myMusic.musicPlay(index);
		});
	},
	/**
	 * 暂停/播放状态
	 */
	musicState : function (){
		if (audio.paused){
			$('#playButton').html('<i class="iconfont">&#xe73c;</i>');
			if ($('#audio').attr('src')){
				audio.play();//播放音乐
			} else {
				//默认播放第一首
				myMusic.musicPlay(0);
			};
		} else {
			$('#playButton').html('<i class="iconfont">&#xe659;</i>');
			audio.pause();//暂停播放
		};
	},
	/**
	 * 暂停 /播放
	 */
	playAction : function(){
		$('#playButton').tap(function (){
			myMusic.musicState();//判断歌曲播放状态
		});
	},
	/**
	 * 下一首
	 */
	nextMusic : function(){
		if ($('#audio').attr('src')){
			var index = $('#audio').attr('data-number');
			if (index == musicSum ){
				index = 0;
			};
			//播放音乐
			myMusic.musicPlay(index);
			index ++;
		};
	},
	/**
	 * 点击播放下一首
	 */
	nextSongAction : function(){
		$('#nextButton').tap(function(){
			myMusic.nextMusic();
		});
	},
	/**
	 * 歌曲播放完成后自动播放下一首
	 */
	playNextMusic : function (){
		//监听音乐播放是否结束
		$("#audio")[0].addEventListener('ended',function (){
			myMusic.nextMusic();
		});
	}
};

myMusic.getMusicList();//获取歌曲列表
myMusic.updateList();//iscroll
myMusic.playAction();//暂停播放按钮
myMusic.nextSongAction();//点击按钮播放下一首
myMusic.playNextMusic()//歌曲完成后自动播放下一首
