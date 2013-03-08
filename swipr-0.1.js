/**
* Swipr 0.1
*
* A responsive, mobile friendly, javascript and CSS3 slider
*
* @author Björn Wikström <bjorn@welcom.se>
* @license LGPL v3 <http://www.gnu.org/licenses/lgpl.html>
* @version 0.1
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
        
        /*
        * Default options, extend with instance options
        */
        this.options = $.extend({
            auto: 0,
            speed: 500,
            resizable: true,
            selector: '.swipe-item',
            onSwipeStart: function () {},
            onSwipeEnd:   function () {}
        }, options);

        /*
        * Cache objects so we don't need to search for them all the time
        */
        this.$container  = $(el);
        this.$items      = $(this.options.selector, el);
        /*
        * Setup
        */
        this._index      = 0;
        this._intervalId = 0;
        
        /*
        * Constants for swipe directions
        */
        var LEFT  = -1,
            RIGHT = 1;
        
        /*
        * Create touch start event depending on browser
        */
        var _touchStartEvent = function () {
                return window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart"; 
            }(),
        /*
        * Create touch move event depending on browser
        */
            _touchMoveEvent = function () {
                return window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
            }(),
        /*
        * Create touch end event depending on browser
        */
            _touchEndEvent = function () {
                return window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";
            }();

        /*
        * Helper to determine if visitor is using a touch device,
        * and if the visitor has a modern browser that support
        * CSS3 transitions
        *
        * @returns {Object} An object with 'touch' and 'transitions' booleans
        */
        this.has = function () {
            return {
                'touch': !!(function () {
                    
                    return window.navigator.msPointerEnabled ?
                            "MSPointerDown" :
                                (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
                    
                }()),
                'transitions': !!(function () {
                    
                    var style = document.createElement('div').style;
                    return    'transition' in style ||
                            'WebkitTransition' in style ||
                            'MozTransition' in style ||
                            'msTransition' in style ||
                            'OTransition' in style;
                    
                }())
            };
        }();
        
        /*
        * Slide to index + 1 item
        *
        * @returns {Void}
        */
        this.next = function () {
            
            if (this._index === this.$items.length - 1) {
                this._index = 0;
            } else {
                this._index++;
            }
            
            this.slideTo(this._index);
            
        };
        
        /*
        * Slide to index - 1 item
        *
        * @returns {Void}
        */
        this.prev = function () {
            
            if (this._index === 0) {
                this._index = this.$items.length - 1;
            } else {
                this._index--;
            }
            
            this.slideTo(this._index);
            
        };
        
        /*
        * Stop the automatic slide (if any)
        *
        * @returns {Void}
        */
        this.stop = function () {
            clearInterval(this._intervalId);
        };
        
        /*
        * Restart the automatic slide (if any)
        *
        * @returns {Void}
        */
        this.restart = function () {

            if (this.options.auto) {
                var self = this;
                this._intervalId = setInterval(function () {
                    self.next();
                }, this.options.auto);
            }

        }

        /*
        * Animate a transition slide, used only when a touchmove is active and
        * does not 'snap' to an item index -- only 'follows' touch point.
        *
        * @param fromPosX {Integer} From a geometric X point
        * @param toPosX   {Integer} To a geometric X point
        * @returns {Void}
        */
        var _animate = function (fromPosX, toPosX) {
            
            var left   = this.$movable.position().left;
            var style  = this.$movable.get(0).style;
            
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

        /*
        * Animate a transition slide, to an item index -- a 'snap-to' transition
        *
        * @param index {Integer} The item index to be shown
        * @param speed {Integer} The speed of the animation
        * @param force {Boolean} Should the animation be forced to use $.animate()?
        * @returns {Void}
        */
        this.slideTo = function (index, speed, force) {
            
            index = index >= 0 ? index : 0;
            index = index < this.$items.length ? index : this.$items.length - 1;

            this.options.onSwipeStart.call(this, index);
            
            var style = this.$movable.get(0).style,
                posX  = -1 * (this.$container.width() * index);
            
            speed = speed || this.options.speed;
            
            /*
            * Check to see if transitions is enabled or if the animation
            * should be forced to use JavaScript animation
            */
            if (!this.has.transitions || force) {
                return _animatedSlide.call(this, posX, speed, index);
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

            var self = this;
            setTimeout(function () {
                self.options.onSwipeEnd.call(self, index);
            }, speed);
            
        };

        /*
        * A fallback for when CSS3 transitions is not available, or
        * when an animation should be forced to use $.animate()
        *
        * @param posX  {Integer} Geometric X point to animate to
        * @param speed {Integer} The duration of the animation
        * @param index {Integer} The items index
        * @returns {Void}
        */
        var _animatedSlide = function (posX, speed, index) {
            
            var self = this;
            this.$movable.animate({'left': posX + 'px'}, speed, function () {
                self.options.onSwipeEnd.call(self, index);
            });
            
        };
        
        /*
        * Helper object for self reference, used
        * in touch event helpers
        */
        var self = this;

        /*
        * Helper function for handling touchstart, resetting
        * variables for the touchmove event
        *
        * @param e {Object} The touch event
        * @returns {Void}
        */
        var _ontouch = function (e) {
            
            this._x         = e.touches ? e.touches[0].pageX : e.pageX;
            this._y         = e.touches ? e.touches[0].pageY : e.pageY;
            this._scroll    = false;
            this._direction = undef;
            this._reset     = false;
            this._offset    = self.$movable.offset().left;
            this._timeId    = 0;
            
        };
        /*
        * Helper function for handling touchmove
        *
        * @param e {Object} The touch event
        * @returns {Void}
        */
        var _onmove = function (e) {
            
            /*
            * If it's a pinch, don't slide
            */
            if (e.touches && e.touches.length > 1) {
                return;
            }
            
            var pageX = e.touches ? e.touches[0].pageX : e.pageX,
                pageY = e.touches ? e.touches[0].pageY : e.pageY;
            
            /*
            * If the scroll direction is vertical, don't slide
            */
            if (!this._scroll && Math.abs(Math.abs(this._y) - Math.abs(pageY)) > Math.abs(Math.abs(this._x) - Math.abs(pageX))) {
                return;
            }
            
            e.preventDefault();
            
            self.stop();
            
            this._scroll = true;
            this._direction = this._x < pageX ? RIGHT : LEFT;
            
            /*
            * If it's a mobile IE browser and the touchmove is outside the container,
            * force an OnTouchEnd event with forced animation using $.animate()
            */
            if (window.navigator.msPointerEnabled && (pageX < self.$container.offset().left || pageX > (self.$container.offset().left + self.$container.width()))) {
                _onend.call(this, null, true);
            }
            
            self._animate(this._x, pageX);
            this._x = pageX;
            
        };
        /*
        * Helper function for handling touchend
        *
        * @param e                 {Object}  The touch event
        * @param forceAnimation {Boolean} Should the animation be forced to use $.animate()?
        * @returns {Void}
        */
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

        /*
        * Helper function to handle sizes and offsets,
        * called on initialize and on window resize
        *
        * @returns {Void}
        */
        var _resetSizes = function () {

            this.$items.css({
                'width': this.$container.width() + 'px'
            });
            this.$container.children().css({
                'width': (this.$items.length * this.$container.width()) + 'px'
            });
        
            this._offset  = this.$movable.offset().left;
        };
        
        /*
        * Setup slider and start the automatic slide (if any)
        *
        * @returns {Void}
        */
        var _init = function () {

            if (this.$items.length < 2) {
                return;
            }

            var self = this;
            
            /*
            * Create a container element, which we can use
            * to slide the content to the right and left
            */
            this.$movable = $('<div style="overflow: hidden; position: relative;"></div>');
            this.$items.appendTo(this.$movable.appendTo(self.$container));
            $(window).load(function () {
                _startTouchSwipe.call(self);
            });

            _resetSizes.call(this);
            
            if (this.options.auto) {
                this._intervalId = setInterval(function () {
                    self.next();
                }, this.options.auto);
            }

            if (this.options.resizable) {
                $(window).on('resize', function () {
                    _resetSizes.call(self);
                });
            }
            
        };
        
        /*
        * Activate touch events if available
        *
        * @returns {Void}
        */
        var _startTouchSwipe = function () {
            
            if (this.has.touch) {
                if (window.navigator.msPointerEnabled) {
                    this.$container.css('-ms-touch-action', 'pan-y');
                }
                
                this.$container.get(0).addEventListener(_touchStartEvent, _ontouch, false);
                this.$container.get(0).addEventListener(_touchMoveEvent,  _onmove,  false);
                this.$container.get(0).addEventListener(_touchEndEvent,   _onend,   false);
            }
            
        };
        
        /*
        * Initialize Swipr
        */
        _init.call(this);
        
    };
    
    /*
    * Add Swipr to the global namespace
    */
    window.Swipr = Swipr;
    
    /*
    * Create a jQuery helper function
    */
    $.fn.Swipr = function (options) {
        
        $.each(this, function () {
            
            new Swipr(this, options);
            
        });
        
    };
    
})(window, window.document, jQuery);