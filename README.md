# webfont-loader [![npm version](https://badge.fury.io/js/webfont-loader.svg)](http://badge.fury.io/js/webfont-loader)

Load webfont using native [FontFace](http://dev.w3.org/csswg/css-font-loading/) with fall back to [font-face-observer](https://www.npmjs.com/package/font-face-observer) (see [web font loading detection, without timers](http://smnh.me/web-font-loading-detection-without-timers/) for details on how the fallback works).

Assumptions:
* have font in WOFF format
* font src is a HTTP or HTTPS URL

## Example

```javascript
var webFontLoader = require('webfont-loader');

webFontLoader('My Font Family', {src: ['http://some.cdn.example.com/my_font.woff']}).then(
  function fontLoaded() {
    // ...
  },
  function fontFailedToLoad() {
    // ...
  }
);
