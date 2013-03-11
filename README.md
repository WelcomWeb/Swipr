# Swipr, a responsive, mobile friendly, javascript and CSS3 slider

## About
Swipr is a cross platform library for enabling swipable elements and managing touch events. It's developed to work well responsive sites, supporting all large mobile browsers - from Safari Mobile to IE10 - as well as desktop browsers.

## Dependencies
Currently Swipr is dependent on [jQuery](https://github.com/jquery/jquery), which is used for selecting DOM elements and handling fallback animations where CSS3 transitions is unsupported. For future releases we aim to make it dependency free.

## Browser support
The library is tested in (and on):

* Firefox 19 (desktop)
* Safari 6 (desktop)
* Chrome 25 (desktop)
* Internet Explorer 7, 8, 9, 10 (desktop)
* Opera 12.14 (desktop)
* Chrome Mobile 24, 25 (Nexus 4 with Android 4.2.2, Galaxy Nexus with Android 4.2.1)
* Chrome Mobile 24, 25 (Nexus 7 with Android 4.2.2)
* Chrome Mobile 23, 24, 25 (iPhone with iOS6)
* Safari Mobile (iPhone with iOS6)
* Android Browser (Nexus One with Android 2.3.6)
* Firefox Mobile 19 (Nexus 4 with Android 4.2.2)
* Internet Explorer 10 Mobile (Nokia Lumia 920 with Windows 8)
* Opera Mobile (Nexus 4 with Android 4.2.2)

## Usage
Swipr needs minimal setup - the minimum amount of CSS, HTML and JavaScript is as follows;

### HTML

    <div id="mySwiprContainer">
        <div class="swipe-item">
            <img src="..." />
        </div>
        <div class="swipe-item">
            <img src="..." />
        </div>
    </div>

### CSS

    #mySwiprContainer {
        position: relative;
        overflow: hidden;
    }
        #mySwiprContainer .swipe-item {
            float: left;
        }

#### JavaScript

    $(document).ready(function () {
        new Swipr(document.getElementById('mySwiprContainer'));
    })

## Demo
A more extensive demo is available at [http://welcomweb.se/Swipr](http://welcomweb.se/Swipr).

## Options
Supported options are (with default values shown):

    {
        auto: 0,        // in ms
        speed: 500,     // in ms
        resizable: true,
        startAt: 0,     // start at index
        selector: '.swipe-item',
        onSwipeStart: function (index) {},
        onSwipeEnd:   function (index) {}
    }

* When `auto` is set to `0` no automatic sliding occurs, and it only listens to touch events.
* The `selector` has to be a string selector, which points to the elements in the swipable container.

## Initialization
There are two ways to initialize Swipr, either by creating an instance manually or by using jQuery. Swipr has an API which you can access if you manually create the instances, instead of letting jQuery handle it. This gives you access to the following Swipr methods: `.stop()`, `.restart()`, `.next()`, `.prev()`, `.slideTo()` and `.index()`.

Instance initialization:

    var swipe = new Swipr(document.getElementById('mySwiprContainer'), options);

jQuery initialization:

    $('#mySwiprContainer').Swipr(options);
    // or initialize on multiple DOM elements;
    $('.mySwiprContainers').Swipr(options);

## The API methods

### Swipr.stop()
Stops the automatic sliding interval.

### Swipr.restart()
Restart the automatic sliding interval, after a `.stop()`.

### Swipr.next()
Manually slide to the next item in the sliding queue.

### Swipr.prev()
Manually slide to the previous item in the sliding queue.

### Swipr.slideTo(index [, speed [, force]])
Manually slide to a specified index in the queue, with optional speed and optional forced usage of `jQuery.animate()`.

### Swipr.index()
Returns the current index of the sliding queue.

## License
Swipr is released under [LGPL 3](https://www.gnu.org/copyleft/lesser.html).


Happy coding!