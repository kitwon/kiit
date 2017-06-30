//=require ../plugins/highlight.js

var requestFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

;(function($) {
	function goTop() {
		var topBtn = $('.btn-go-top'),
			percentageElm = $('.scroll-percentage'),
			documentHeight = document.body.scrollHeight - window.screen.availHeight - 180;


		var scrollTop = 0,
			percentage = 0;

		function setBtnStatus() {
			scrollTop = document.body.scrollTop;
			percentage = Math.floor((scrollTop / documentHeight).toFixed(3) * 100)

			percentageElm.html((percentage > 100 ? 100 : percentage) + '%');

			if(scrollTop > 200) {
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
				if(e.target.className.indexOf('tab-item') !== -1) {
					var target = $(e.target),
						index = target.index() + 1;

					btn.removeClass('active');
					target.addClass('active');

					panel.removeClass('active');
					$('#panel' + index).addClass('active fadeInDown');
				}

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
			$('.unopen').on('click', function() {
				alert('功能暂未开放～');
				return false;
			})
		}

		function init() {
            hljs.initHighlightingOnLoad();
			goTop().init();
			sideBar().init();

			bind();
		}

		return {
			init: init
		}
	})()

	common.init()
})(jQuery);
