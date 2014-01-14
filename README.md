# Fixed-sticky: a CSS `position:sticky` polyfill (and a bit more)

- (c)2013 @zachleat, Filament Group
- MIT license

## The original

CSS position:sticky is really in its infancy in terms of browser support. In stock browsers, it is currently only available in iOS 6.

In Chrome you can enable it by navigating to `chrome://flags` and enabling experimental “WebKit features” or “Web Platform features” (Canary).

In Firefox you you can go to `about:config` and set `layout.css.sticky.enabled` to "true".

## This fork

- 2014 @tomp, FT Interactive
- MIT Licence

The main difference in this fork is that stuck elements trigger events to let the world know about their state. These events are 'stuck' when something gets stuck, 'unstuck' when the opposite happens, 'overlap' or 'overlap-clear' to say when a stuck element is clear of its original position or not.

These states all have corresponding CSS classes defined thus:
```
classes: {
	plugin: 'fixedsticky',
	active: 'fixedsticky-on',
	inactive: 'fixedsticky-off',
	clone: 'fixedsticky-dummy',
	overlap: 'fixedsticky-dummy-over',
	clear: 'fixedsticky-dummy-clear',
	withoutFixedFixed: 'fixedsticky-withoutfixedfixed'
},

```


## Usage

Just qualify element you’d like to be `position:sticky` with a `fixedsticky` class.

    <div id="my-element" class="fixedsticky">

Add your own CSS to position the element. Supports any value for `top` or `bottom`.

    .fixedsticky { top: 0; }

Next, add the events and initialize your sticky nodes:

    $( '#my-element' ).fixedsticky();

*Note: if you’re going to use non-zero values for `top` or `bottom`, fixed-sticky is victim to a cross-browser incompatibility with jQuery’s `css` method (namely, IE8- doesn’t normalize non-pixel values to pixels). Use pixels (or `0`) for best cross-browser compatibility.*

## Demos
* For a fixed-sticky demo, open [`demo.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo.html).
* For a pure native position: sticky test, open [`demo-control.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo-control.html).

## Native `position: sticky` Caveats

* iOS (and Chrome) do not support `position: sticky;` with `display: inline-block;`.
* `sticky` elements are constrained to the dimensions of their parents.
* This plugin (and Chrome’s implementation) does not (yet) support use with `thead` and `tfoot`.

### Using the polyfill instead of native

If you’re having weird issues with native `position: sticky`, you can tell fixed-sticky to use the polyfill instead of native. Just override the sticky feature test to always return false.

    // After fixed-sticky.js
    FixedSticky.tests.sticky = false;

* [`demo-opt-out-native.html`](http://filamentgroup.github.com/fixed-sticky/demos/demo-opt-out-native.html) shows this behavior.


## Installation

Use the provided `fixedsticky.js` and `fixedsticky.css` files.

### Also available in [Bower](http://bower.io/)

    bower install filament-sticky

## Browser Support

These tests were performed using fixed-sticky with fixed-fixed. It’s safest to use them together (`position:fixed` is a minefield on older devices), but they can be used independently.

### Native Sticky

* iOS 6.1, iOS 7

### Polyfilled

* Internet Explorer 7, 8, 9, 10
* Firefox 24, Firefox 17 ESR
* Chrome 29
* Safari 6.0.5
* Opera 12.16
* Android 4.X

### Fallback (static positioning)

* Android 2.X
* Opera Mini
* Blackberry OS 5, 6, 7
* Windows Phone 7.5

## TODO

* Add support for table headers.
* Vanilla JS version.
* Make sticky smoother on transition between sticky/static for container based

## [Tests](http://filamentgroup.github.io/fixed-sticky/test/fixed-sticky.html)

## Release History

* `v0.1.0`: Initial release.
* `v0.1.3`: Bug fixes, rudimentary tests, destroy method.
