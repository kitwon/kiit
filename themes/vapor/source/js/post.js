/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-01-28 16:59:35
 * @version $Id$
 */

var app = {
	init : function() {
		var _this = this;
		_this.bind();
	},
	bind : function() {
		$('.menu').bind('click', function() {
			// $(this).toggleClass('active');
			$(this).next('.nav-list').toggleClass('active');

			$('.side-bar').show();
			setTimeout('$(".side-bar").addClass("active")', 30);
			
		});

		$('.side-bar .black-cover').bind('click', function() {
			$('.side-bar').removeClass('active');
			setTimeout('$(".side-bar").hide()', 600);
		});

		$('.tab-btn').find('button').on('click', function() {
			app.btn_i = $(this).index() + 1;
			$('.tab-btn').find('button').removeClass('active');
			$(this).addClass('active');
			
			console.log(app.btn_i);
			$('#panel' + app.btn_i).siblings().addClass('fadeInUp').removeClass('fadeInDown');
			setTimeout('$("#panel" + app.btn_i).siblings().removeClass("active fadeInUp");$("#panel" + app.btn_i).addClass("active");$("#panel" + app.btn_i).addClass("fadeInDown")', 600);
		})
	}
};
app.init();