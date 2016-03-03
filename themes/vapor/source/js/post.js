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
	}
};
app.init();