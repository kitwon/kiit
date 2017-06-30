//=require plugins/scrollspy.js

(function($, hljs) {
  var postApp = {
    init: function() {
      var self = this;

      // ofc.init({
      // 	active: $('.directory').find('.nav-link').length > 1
      // })


      $('body').scrollspy({
        target: '.directory',
        offset: 150
      });

      self.pinCard();

      self.bind();
    },
    scrollToPos: function(elm) {
      setTimeout(function() {
        if (typeof elm === 'object') {
          elm.each(function(k, v) {
            var target = $(this).attr('href');
            var pos = $(target)[0].offsetTop;

            $(this).on('click', function(e) {
              $('html,body').animate({
                scrollTop: pos
              }, 500);
              return false;
            });
          });
        }
      }, 0);
    },
    pinCard: function() {
      var card = $('.directory-card');

      if (card.length > 0 && card.is(':visible') === true && window.screen.availHeight > 960) {
        var elmWidth = card.innerWidth(),
          offsetLeft = card.offset().left,
          offsetTop = card.offset().top;

        var currentOffset = 0,
          marginTop = 30;

        var style = {
          position: 'fixed',
          left: offsetLeft,
          top: marginTop + 'px'
        };

        card.css('width', elmWidth);

        $(window).on('scroll', function(e) {
          currentOffset = document.body.scrollTop;

          if (currentOffset > (offsetTop - marginTop)) {
            card.css(style);
          } else {
            card.attr('style', 'width: ' + elmWidth + 'px');
          }
        });
      }
    },
    bind: function() {
      var self = this;
      var link = $('.nav').find('a');
			var contentLink = $('.content').find('a').filter(function() {
					// if(~$(this).attr('href').indexof('#')) {
						// return this;
					// }
          console.log($(this).attr('href'))
			});
			console.log(contentLink)
      self.scrollToPos(link);
			self.scrollToPos($('.content'))
      // $(window).on('scroll', function(e) {
      // 	console.log(document.body.scrollTop)
      // })
    }
  };

  postApp.init();
})(jQuery, hljs);
