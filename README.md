# Swipr, a responsive, mobile friendly, javascript and CSS3 slider

## About
Swipr is a cross platform library for enabling swipable elements and managing touch events. It's developed to work well responsive sites, supporting all large mobile browsers - from Safari Mobile to IE10 - as well as desktop browsers.

## Dependencies
Currently Swipr is dependent on [jQuery](https://github.com/jquery/jquery), which is used for selecting DOM elements and handling fallback animations where CSS3 transitions is unsupported. For future releases we aim to make it dependency free.

## Browser support
The library is tested in (and on):

* Chrome 25
* Chrome Mobile 18 on Nexus 4 with Android 4.2.2, Galaxy Nexus with Android 4.2.1
* Internet Explorer 10 Mobile on Nokia Lumia 920 with Windows 8

## Demo
Watch a demo of Swipr at [http://github.welcomweb.se/Swipr](http://github.welcomweb.se/Swipr).

## Usage
Swipr needs minimal setup, the minimum amount of CSS, HTML and JavaScript is as follows;

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

A more extensive usage demo is available at [http://github.welcomweb.se/Swipr](http://github.welcomweb.se/Swipr).

## Options
Supported options are (with default values shown):

    auto: 0,
    speed: 500,
    resizable: true,
    startAt: 0,
    selector: '.swipe-item',
    onSwipeStart: function () {},
    onSwipeEnd:   function () {}

* When `auto` is set to `0` no automatic sliding occurs, and it only listens to touch events.
* The `selector` has to be a string selector, which points to the elements in the swipable container.

## Initialization and methods
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

# License
Swipr is released under [LGPL 3](https://www.gnu.org/copyleft/lesser.html).


Happy coding!