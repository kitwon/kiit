"use strict";var requestFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)},app={data:{screenHeight:$(".header-content").outerHeight()>520?480:$(".header-content").outerHeight(),frames:60,transitionTime:600,scrollDown:!1},init:function(){var t=this;return t.initUI(),t.bind(),t},initUI:function(){var t=this;$(".date").html(t.getDay());var a=$(window).width()/$(window).height();1>a?$(".circle-cover").css("top",-(.06*$(window).height())):$(".circle-cover").css("top",-(.22*$(window).height())),$(".translate-wrap").css("-webkit-transform","translate3d(0,"+t.data.screenHeight+"px, 0)"),$("body").css("overflow-y","hidden"),t.data.boxTransX=t.getElementPos($(".header-content .sun")).x,t.data.boxTtransY=t.getElementPos($(".header-content .sun")).y,t.data.btnTransX=t.getElementPos($(".graph-pos")).x-48,t.data.btnTtransY=t.getElementPos($(".graph-pos")).y+12,$(".main-sun").show().css("-webkit-transform","translate3d("+t.data.boxTransX+"px, "+t.data.boxTtransY+"px, 0)"),t.data.wrapWidth=$(".translate-wrap").width()},bind:function(){var t,a,e=app,n=e.data.screenHeight;document.body.onmousewheel=function(t){window.cancelAnimationFrame(e.loop),t=event||window.event,t.wheelDelta<0&&0!==t.wheelDelta&&!e.data.scrollDown&&0===e.getScrollTop()&&(e.animate(0),e.data.scrollDown=!0),t.wheelDelta>0&&0!==t.wheelDelta&&e.data.scrollDown&&0===e.getScrollTop()&&(e.animate(n),e.data.scrollDown=!1)},$("body").on("touchstart",function(a){a.preventDefault(),t=a.originalEvent.changedTouches[0].pageY}),$("body").on("touchmove",function(o){o.preventDefault();var s=o.originalEvent.changedTouches[0].pageY;a=s-t,0>a&&0!=a&&!e.data.scrollDown&&0===e.getScrollTop()&&(e.animate(0),e.data.scrollDown=!0),a>0&&0!==a&&e.data.scrollDown&&0===e.getScrollTop()&&(e.animate(n),e.data.scrollDown=!1)}),$(".menu").click(function(){$(this).toggleClass("active"),$(this).next(".nav-list").toggleClass("active"),$(".side-bar").show(),setTimeout('$(".side-bar").addClass("active")',30)}),$(".side-bar .black-cover").bind("click",function(t){$(".menu").toggleClass("active"),$(".side-bar").removeClass("active"),setTimeout('$(".side-bar").hide()',600)})},getScrollTop:function(){var t;return window.pageYOffset?t=window.pageYOffset:document.compatMode&&"BackCompat"!=document.compatMode?t=document.documentElement.scrollTop:document.body&&(t=document.body.scrollTop),t},getElementPos:function(t){var a=0,e=0;return t&&(a=t.offsetLeft||t.offset().left,e=t.offset().top||t.offsetTop),{x:a,y:e}},animate:function(t){var a=this;$(".translate-wrap").css("-webkit-transform","translate3d(0,"+t+"px, 0)"),0===t?(setTimeout("$('body').css('overflow-y', 'auto')",a.data.transitionTime),$(".main-sun").css("-webkit-transform","translate3d("+a.data.btnTransX+"px, "+a.data.btnTtransY+"px, 0) scale(0.7, 0.7)"),$(".nav-button").css("-webkit-transform","scaleX(1)"),requestFrame.call(window,a.loopPath)):($("body").css("overflow-y","hidden"),$(".main-sun").css("-webkit-transform","translate3d("+a.data.boxTransX+"px, "+a.data.boxTtransY+"px, 0) scale(1, 1)"),$(".nav-button").css("-webkit-transform","scaleX(0)"),requestFrame.call(window,a.loopPath)),setTimeout(function(){a.data.wrapWidth>$(".translate-wrap").width()&&$(".main-sun").css("-webkit-transform","translate3d("+(a.data.btnTransX-16)+"px, "+a.data.btnTtransY+"px, 0) scale(0.7, 0.7)")},a.data.transitionTime+100)},loopPath:function(t){document.getElementById("mainPath").setAttributeNS(null,"d","M0, 0 C 100 "+app.data.frames+", 400 "+app.data.frames+", 500 0 V 250 L 0, 500 Z"),app.data.frames>0&&app.data.scrollDown&&(requestFrame.call(window,app.loopPath),app.data.frames-=3.5),app.data.frames<=60&&!app.data.scrollDown&&(requestFrame.call(window,app.loopPath),app.data.frames+=3.5)},getDay:function(){var t,a=new Date;return console.log(a.getMonth()),t=a.getFullYear()+" / "+(a.getMonth()+1)+" / "+a.getDate()}};app.init();