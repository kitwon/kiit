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

(function($) {
	function goTop() {
		var topBtn = $('.btn-go-top');

		function setBtnStatus() {
			var scrollTop = document.body.scrollTop;

			if(scrollTop > 500) {
				topBtn.addClass('active');
			}else {
				topBtn.removeClass('active');
			}
		}

		function loopTop() {
			document.body.scrollTop -= 250;
			if(document.body.scrollTop > 0) {
				requestFrame(loopTop);
			}
		}

		function bind() {
			topBtn.on('click', function(e) {
				loopTop();
			})

			var st = null;
			$(window).on('scroll', function() {
				clearTimeout(st);

				st = setTimeout(setBtnStatus, 50);
			})
		}

		function init() {
			bind();
		}

		return {
			init: init
		}
	}

	function sideBar() {
		var sidebar = $('#post-side-bar'),
			panel = sidebar.find('.side-bar-panel'),
			btn = sidebar.find('.tab-btn button');

		function bind() {
			sidebar.on('click', function(e) {
				var target = $(e.target),
					index = target.index() + 1;

				btn.removeClass('active');
				target.addClass('active');

				panel.removeClass('active');
				$('#panel' + index).addClass('active fadeInDown');
			})
		}

		function init() {
			bind();
		}

		return {
			init: init
		}
	}

	var common = (function() {
		var topBtn = $('.btn-go-top');

		function bind() {

		}

		function init() {
			goTop().init();
			sideBar().init();
			
			bind();
		}

		return {
			init: init
		}
	})()

	common.init()
})(jQuery)


;(function($) {
	var offCanvas = {
		init: function(option) {
			var self = this;

			self.bind(option.active);
		},
		bind: function(trigger) {
			var self = this;
			var elm = {
				offCanvas: $('.off-canvas'),
				offCanvasContent: $('.off-canvas-content'),
				offCanvasBtn: $('.show-canvas'),
				sum: $('.off-canvas, .off-canvas-content, .show-canvas')
			}

			elm.offCanvasBtn.on('click', function(e) {
				elm.sum.toggleClass('active');
			})

			if(trigger) {
				elm.offCanvasBtn.trigger('click')
			}
		}
	}

	window.offCanvas = offCanvas;
	// offCanvas.init()
})(jQuery)
;(function($, ofc, hljs) {
	var postApp = {
		init: function() {
			var self = this;

			hljs.initHighlightingOnLoad();

			ofc.init({
				active: true
			})

			$('body').scrollspy({ 
				target: '#panel1' 
			})

			self.bind();
		},
		bind: function() {

		}
	}

	postApp.init();
})(jQuery, offCanvas, hljs);