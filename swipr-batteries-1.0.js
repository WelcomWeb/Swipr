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
;(function (window, document, $, undef) {
    
    /*
    * If Swipr is not available, throw
    * an exception
    */
    if (!window.Swipr) {
        throw {
            'type': 'InitializationException',
            'message': 'Swipr.Batteries can not be loaded before Swipr.'
        };
    }

    /*
    * Batteries for gallery indicators,
    * shown under the slidable element
    *
    * @param swipr   {Object} The Swipr instance to modify
    * @param options {Object} CSS classes for the new elements
    * @returns {Void}
    */
    var attachIndicators = function (swipr, options) {

        /*
        * Keep the original function, so we still can use it
        */
        var original_slideTo = swipr.slideTo;

        /*
        * Default options
        */
        var opts = $.extend({
            'container-class': 'swipr-indicators',
            'indicator-class': 'swipr-indicator'
        }, options);

        /*
        * Create the indicator element and queue
        */
        var $container  = $('<div class="' + opts['container-class'] + '"></div>'),
            $indicators = [];

        /*
        * Update the indicators to the active one
        */
        var _indicatorUpdate = function () {

            $indicators.removeClass('active').eq(swipr.index()).addClass('active');

        };

        /*
        * New method for the sliding, just call the original method
        * and attach the function to update the indicators
        */
        var _slideTo = function (index, speed, force) {

            original_slideTo.call(swipr, index, speed, force);

            setTimeout(function () {
                _indicatorUpdate();
            }, speed);

        };

        /*
        * Populate the indicator container and attach it to the DOM
        */
        var _setup = function () {

            $container.appendTo(this.$container);

            this.$items.each(function () {

                $container.append('<span class="' + opts['indicator-class'] + '"></span>');

            });

            $indicators = $('span', $container);
            $indicators.first().addClass('active');

            $indicators.on('click', function (e) {
                swipr.stop();
                swipr.slideTo($(this).index(), swipr.options.speed, false);
            });

        };

        /*
        * Initialize the indicators and overwrite Swipr methods
        */
        _setup.call(swipr);
        swipr.slideTo = _slideTo;

    };

    /*
    * Batteries for sliding controls,
    * shown to the left and right of the slidable element
    *
    * @param swipr   {Object} The Swipr instance to modify
    * @param options {Object} CSS classes for the new elements
    * @returns {Void}
    */
    var attachSlideControls = function (swipr, options) {

        /*
        * Default options
        */
        var opts = $.extend({
            'base-ctrl-class': 'swipr-control-base',
            'prev-ctrl-class': 'swipr-control-prev',
            'next-ctrl-class': 'swipr-control-next',
            'prev-ctrl-html': '<span></span>',
            'next-ctrl-html': '<span></span>'
        }, options);

        var $ctrlPrev  = $('<div></div>'),
            $ctrlNext  = $('<div></div>'),
            $container = $('<div></div>');

        /*
        * Attach DOM events for the new elements
        */
        $ctrlPrev.on('click', function (e) {

            swipr.stop();
            swipr.prev();

        });
        $ctrlNext.on('click', function (e) {

            swipr.stop();
            swipr.next();

        });

        /*
        * Rearrange container and attach controls to the DOM
        */
        var _setup = function () {

            $ctrlPrev
                .addClass(opts['prev-ctrl-class'] + ' ' + opts['base-ctrl-class'])
                .html(opts['prev-ctrl-html']);
            $ctrlNext
                .addClass(opts['next-ctrl-class'] + ' ' + opts['base-ctrl-class'])
                .html(opts['next-ctrl-html']);

            $container.css({
                'width': this.$container.width() + 'px',
                'overflow-x': 'hidden'
            });

            $container.prependTo(this.$container);
            this.$movable.appendTo($container);

            this.$container.css('overflow', 'visible');

            this.$container
                    .append($ctrlPrev)
                    .append($ctrlNext);

        };

        /*
        * Initialize
        */
        _setup.call(swipr);

    };

    /*
    * Attach Swipr Batteries to Swipr
    */
    window.Swipr.Batteries = function () {

        return {
            'attachIndicators': attachIndicators,
            'attachSlideControls': attachSlideControls
        };

    }();

})(window, window.document, jQuery);
