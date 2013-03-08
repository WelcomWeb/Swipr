/**
* Swipr 0.1
*
* A responsive, mobile friendly, javascript and CSS3 slider
*
* @author Björn Wikström <bjorn@welcom.se>
* @license LGPL v3 <http://www.gnu.org/licenses/lgpl.html>
* @version 1.0
* @copyright Welcom Web i Göteborg AB 2012
*/
;(function (window, document, $, undef) {
	
	/*
	* If Swipr is already loaded, don't load it again
	*/
	if (typeof window.Swipr !== typeof undef) {
		return;
	}

	var Swipr = function (el, options) {
		
		this.options = $.extend({
			auto: 0,
			speed: 500,
			resizable: true,
			selector: 'swipe-item',
			onSwipeStart: function () {},
			onSwipeEnd:   function () {}
		}, options);

		this.$container  = $(el);
		this.$items      = $('.' + this.options.selector.replace(/\./g, ''), el);
		this._index      = 0;
		this._intervalId = 0;
		
		var self        = this;
		
		var LEFT  = -1,
			RIGHT = 1;
		
		this.has = function () {
			return {
				'touch': !!(function () {
					
					return window.navigator.msPointerEnabled ?
							"MSPointerDown" :
								(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
					
				}()),
				'transitions': !!(function () {
					
					var style = document.createElement('div').style;
					return	'transition' in style ||
                    		'WebkitTransition' in style ||
                    		'MozTransition' in style ||
                    		'msTransition' in style ||
                    		'OTransition' in style;
					
				}())
			};
		}();
		
		var _touchStartEvent = function () {
			return window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart"; 
		}();
		var _touchMoveEvent = function () {
			return window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
		}();
		var _touchEndEvent = function () {
			return window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";
		}();
		
		this.next = function () {
			
			if (this._index === this.$items.length - 1) {
				this._index = 0;
			} else {
				this._index++;
			}
			
			if (this.has.transitions) {
				this.slideTo(this._index);
			} else {
				this.animateTo(this._index);
			}
			
		};
		
		this.prev = function () {
			
			if (this._index === 0) {
				this._index = this.$items.length - 1;
			} else {
				this._index--;
			}
			
			if (this.has.transitions) {
				this.slideTo(this._index);
			} else {
				this.animateTo(this._index);
			}
			
		};
		
		this.stop = function () {
			clearInterval(self._intervalId);
		};
		
		this.restart = function () {

			if (self.options.auto) {
				self._intervalId = setInterval(function () {
					self.next();
				}, self.options.auto);
			}

		}

		this._animate = function (fromPosX, toPosX) {
			
			var left   = self.$movable.position().left;
			var style  = self.$movable.get(0).style;
			
			style.webkitTransitionDuration = 
				style.MozTransitionDuration = 
					style.msTransitionDuration = 
						style.OTransitionDuration =
							style.transitionDuration = '0ms';
			
			style.webkitTransform = 'translate3d(' + (left + (toPosX - fromPosX)) + 'px,0,0)';
			style.msTransform = 
				style.MozTransform = 
					style.OTransform = 'translateX(' + (left + (toPosX - fromPosX)) + 'px)';
			
		};
		this.slideTo = function (index, speed, force) {
			
			index = index >= 0 ? index : 0;
			index = index < self.$items.length ? index : self.$items.length - 1;

			self.options.onSwipeStart.call(self, index);
			
			var style = self.$movable.get(0).style,
				posX  = -1 * (this.$container.width() * index);
			
			speed = speed || self.options.speed;
			
			if (!this.has.transitions || force) {
				return this._animatedSlide(posX, speed, index);
			}
			
			style.webkitTransitionDuration = 
				style.MozTransitionDuration = 
					style.msTransitionDuration = 
						style.OTransitionDuration =
							style.transitionDuration = speed + 'ms';
			
			style.webkitTransform = 'translate3d(' + posX + 'px,0,0)';
			style.msTransform = 
				style.MozTransform = 
					style.OTransform = 'translateX(' + posX + 'px)';

			setTimeout(function () {
				self.options.onSwipeEnd.call(self, index);
			}, speed);
			
		};
		this._animatedSlide = function (posX, speed, index) {
			
			self.$movable.animate({'left': posX + 'px'}, speed, function () {
				self.options.onSwipeEnd.call(self, index);
			});
			
		};
		
		var _ontouch = function (e) {
			
			this._x         = e.touches ? e.touches[0].pageX : e.pageX;
			this._y         = e.touches ? e.touches[0].pageY : e.pageY;
			this._scroll    = false;
			this._direction = undef;
			this._reset     = false;
			this._offset    = self.$movable.offset().left;
			this._timeId    = 0;
			
		};
		var _onmove = function (e) {
			
			if (e.touches && e.touches.length > 1) {
				return;
			}
			
			var pageX = e.touches ? e.touches[0].pageX : e.pageX,
				pageY = e.touches ? e.touches[0].pageY : e.pageY;
			
			if (!this._scroll && Math.abs(Math.abs(this._y) - Math.abs(pageY)) > Math.abs(Math.abs(this._x) - Math.abs(pageX))) {
				return;
			}
			
			e.preventDefault();
			
			self.stop();
			
			this._scroll = true;
			this._direction = this._x < pageX ? RIGHT : LEFT;
			
			if (window.navigator.msPointerEnabled && (pageX < self.$container.offset().left || pageX > (self.$container.offset().left + self.$container.width()))) {
				_onend.call(this, null, true);
			}
			
			self._animate(this._x, pageX);
			this._x = pageX;
			
		};
		var _onend = function (e, forceAnimation) {
			
			if (this._scroll) {
				self._index -= this._direction;
				
				if (self._index > self.$items.length - 1) {
					self._index = self.$items.length - 1;
				}
				
				if (self._index < 1) {
					self._index = 0;
				}
				
				self.slideTo(self._index, 100, !!forceAnimation);
			}
			
		};
		
		var _init = function () {

			if (self.$items.length < 2) {
				return;
			}
			
			self.$items.appendTo($('<div style="overflow: hidden; position: relative;"></div>').appendTo(self.$container));
			$(window).load(_startTouchSwipe);
			
			self.$items.css({
				'width': self.$container.width() + 'px'
			});
			self.$container.children().css({
				'width': (self.$items.length * self.$container.width()) + 'px'
			});
			
			if (self.options.auto) {
				self._intervalId = setInterval(function () {
					self.next();
				}, self.options.auto);
			}
			
		};
		
		var _startTouchSwipe = function () {
			
			if (self.has.touch) {
				if (window.navigator.msPointerEnabled) {
					self.$container.css('-ms-touch-action', 'pan-y');
				}
				
				self.$container.get(0).addEventListener(_touchStartEvent, _ontouch, false);
				self.$container.get(0).addEventListener(_touchMoveEvent,  _onmove,  false);
				self.$container.get(0).addEventListener(_touchEndEvent,   _onend,   false);
			}
			
			self.$movable = self.$container.children().eq(0);
			self._offset  = self.$movable.offset().left;
			
		};
		
		_init();
		
	};
	
	window.Swipr = Swipr;
	
	$.fn.Swipr = function (options) {
		
		$.each(this, function () {
			
			new Swipr(this, options);
			
		});
		
	};
	
})(window, window.document, jQuery);