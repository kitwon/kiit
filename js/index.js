"use strict";
//http://www.ituring.com.cn/article/199294
//https://segmentfault.com/a/1190000000357534#articleHeader18
var requestFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

var app = {
	data: {
		screenHeight: ($('.header-content').outerHeight() > 520) ? 480 : $('.header-content').outerHeight(),
		frames: 60,
		transitionTime: 600,
		scrollDown: false
	},
	init: function() {
		var _this = this;
		_this.initUI();
		_this.bind();

		return _this;
	},
	initUI: function() {
		var _this = this;
		$('.date').html(_this.getDay());

		//根据宽高比定圆弧位置
		var percent = $(window).width() / $(window).height();
		if (percent < 1) {
			$('.circle-cover').css('top', -($(window).height() * 0.06));
		} else {
			$('.circle-cover').css('top', -($(window).height() * 0.22));
		}
		$('.translate-wrap').css(_this.prefixCss('translate3d(0,' + _this.data.screenHeight + 'px, 0)'));
		$('body').css('overflow-y', 'hidden');

		// 初始化动画坐标数据
		_this.data.boxTransX = _this.getElementPos($('.header-content .sun')).x;
		_this.data.boxTtransY = _this.getElementPos($('.header-content .sun')).y;
		_this.data.btnTransX = _this.getElementPos($('.graph-pos')).x - 48;
		_this.data.btnTtransY = _this.getElementPos($('.graph-pos')).y + 12;

		$('.main-sun').show().css(_this.prefixCss('translate3d(' + _this.data.boxTransX + 'px, ' + _this.data.boxTtransY + 'px, 0)'));

		_this.data.wrapWidth = $('.translate-wrap').width()
	},
	bind: function() {
		var _this = app;
		var transitonPos = _this.data.screenHeight;
		var i = 80,
			at;
		var touchY, moveY;

		document.body.onmousewheel = function(e) {
			window.cancelAnimationFrame(_this.loop);



			e = event || window.event;
			if (e.wheelDelta < 0 && e.wheelDelta !== 0 && !_this.data.scrollDown) {
				if (_this.getScrollTop() === 0) {
					_this.animate(0);
					_this.data.scrollDown = true;
				}
			}
			if (e.wheelDelta > 0 && e.wheelDelta !== 0 && _this.data.scrollDown) {
				if (_this.getScrollTop() === 0) {
					_this.animate(transitonPos);
					_this.data.scrollDown = false;
				}
			}
		}

		$('body').on('touchstart', function(e) {
			e.preventDefault();
			touchY = e.originalEvent.changedTouches[0].pageY;
		});
		$('body').on('touchmove', function(e) {
			e.preventDefault();
			moveY = e.originalEvent.changedTouches[0].pageY - touchY
			if (moveY < 0 && moveY !== 0 && !_this.data.scrollDown) {
				if (_this.getScrollTop() === 0) {
					_this.animate(0);
					_this.data.scrollDown = true;
				}
			}
			if (moveY > 0 && moveY !== 0 && _this.data.scrollDown) {
				if (_this.getScrollTop() === 0) {
					_this.animate(transitonPos);
					_this.data.scrollDown = false;
				}
			}
		})

		$('.menu').click(function() {
			// $(this).toggleClass('active');
			$(this).next('.nav-list').toggleClass('active');

			$('.side-bar').show();
			setTimeout('$(".side-bar").addClass("active")', 30);
			
		});

		$('.side-bar .black-cover').bind('click', function(event) {
			$('.side-bar').removeClass('active');
			setTimeout('$(".side-bar").hide()', 600);
		});

	},
	getScrollTop: function() {
		var scrollPos;
		if (window.pageYOffset) {
			scrollPos = window.pageYOffset;
		} else if (document.compatMode && document.compatMode != 'BackCompat') {
			scrollPos = document.documentElement.scrollTop;
		} else if (document.body) {
			scrollPos = document.body.scrollTop;
		}

		return scrollPos;
	},
	getElementPos: function(element) {
		var positionX = 0,
			positionY = 0;

		positionX = element.offsetLeft || element.offset().left;
		positionY = element.offset().top || element.offsetTop;

		return {
			x: positionX,
			y: positionY
		}
	},
	animate: function(translateVal) {
		var _this = this;

		// $('.translate-wrap').css('-webkit-transition', '0.6s cubic-bezier(0.86, 0, 0.07, 1)');
		$('.translate-wrap').css(_this.prefixCss('translate3d(0,' + translateVal + 'px, 0)'));

		if (translateVal === 0) {
			setTimeout("$('body').css('overflow-y', 'auto')", _this.data.transitionTime);
			$('.main-sun').css(_this.prefixCss('translate3d(' + _this.data.btnTransX + 'px, ' + _this.data.btnTtransY + 'px, 0) scale(0.7, 0.7)'));
			$('.nav-button').css('-webkit-transform', 'scaleX(1)');
			requestFrame.call(window, _this.loopPath);
		} else {
			$('body').css('overflow-y', 'hidden')
			$('.main-sun').css(_this.prefixCss('translate3d(' + _this.data.boxTransX + 'px, ' + _this.data.boxTtransY + 'px, 0) scale(1, 1)'));
			$('.nav-button').css('-webkit-transform', 'scaleX(0)');
			requestFrame.call(window, _this.loopPath);
		}

		setTimeout(function() {
			if(_this.data.wrapWidth > $('.translate-wrap').width()) {
				$('.main-sun').css(_this.prefixCss('translate3d(' + (_this.data.btnTransX - 16) + 'px, ' + _this.data.btnTtransY + 'px, 0) scale(0.7, 0.7)'));
			}
		}, _this.data.transitionTime + 100);
		
	},
	loopPath: function(fn) {
		document.getElementById('mainPath').setAttributeNS(null, 'd', 'M0, 0 C 100 ' + app.data.frames + ', 400 ' + app.data.frames + ', 500 0 V 250 L 0, 500 Z');

		if (app.data.frames > 0 && app.data.scrollDown) {
			requestFrame.call(window, app.loopPath);
			app.data.frames -= 3.5;
		}
		if (app.data.frames <= 60 && !app.data.scrollDown) {
			requestFrame.call(window, app.loopPath);
			app.data.frames += 3.5;
		}

	},
	getDay : function() {
		var today,
			day = new Date();

		today = day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + (day.getDate());
		return today;
	},
	prefixCss : function(attr) {
		var css = {
			'-webkit-transform' : attr,
			'-moz-transform' : attr,
			'-o-transform' : attr,
			'transform' : attr
		}

		return css;
	}
};

app.init();
