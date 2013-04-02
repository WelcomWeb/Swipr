/**
* Swipr Batteries 1.0
*
* Extensions for Swipr, with UI elements and functionality
* for different use cases.
*
* @author Björn Wikström <bjorn@welcom.se>
* @license LGPL v3 <http://www.gnu.org/licenses/lgpl.html>
* @version 1.0
* @copyright Welcom Web i Göteborg AB 2013
*/
;(function(e,t,n,r){if(!e.Swipr){throw{type:"InitializationException",message:"Swipr.Batteries can not be loaded before Swipr."}}var i=function(e,t){var r=e.slideTo;var i=n.extend({"container-class":"swipr-indicators","indicator-class":"swipr-indicator"},t);var s=n('<div class="'+i["container-class"]+'"></div>'),o=[];var u=function(){o.removeClass("active").eq(e.index()).addClass("active")};var a=function(t,n,i){r.call(e,t,n,i);setTimeout(function(){u()},n)};var f=function(){s.appendTo(this.$container);this.$items.each(function(){s.append('<span class="'+i["indicator-class"]+'"></span>')});o=n("span",s);o.first().addClass("active");o.on("click",function(t){e.stop();e.slideTo(n(this).index(),e.options.speed,false)})};f.call(e);e.slideTo=a};var s=function(e,t){var r=n.extend({"base-ctrl-class":"swipr-control-base","prev-ctrl-class":"swipr-control-prev","next-ctrl-class":"swipr-control-next","prev-ctrl-html":"<span></span>","next-ctrl-html":"<span></span>"},t);var i=n("<div></div>"),s=n("<div></div>"),o=n("<div></div>");i.on("click",function(t){e.stop();e.prev()});s.on("click",function(t){e.stop();e.next()});var u=function(){i.addClass(r["prev-ctrl-class"]+" "+r["base-ctrl-class"]).html(r["prev-ctrl-html"]);s.addClass(r["next-ctrl-class"]+" "+r["base-ctrl-class"]).html(r["next-ctrl-html"]);o.css({width:this.$container.width()+"px","overflow-x":"hidden"});o.prependTo(this.$container);this.$movable.appendTo(o);this.$container.css("overflow","visible");this.$container.append(i).append(s)};u.call(e)};e.Swipr.Batteries=function(){return{attachIndicators:i,attachSlideControls:s}}()})(window,window.document,jQuery);