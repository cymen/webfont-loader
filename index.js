var find = require('array-find');
var fontFaceRule = require('font-face-rule');
var FontFaceObserver = require('font-face-observer');
var woffRegExp = new RegExp(/\.woff$/i);

function addRuleToDocument(rule) {
  var css = document.createElement('style');
  css.type = 'text/css';

  if (css.styleSheet) {
    css.styleSheet.cssText = rule;
  } else {
    css.appendChild(document.createTextNode(rule));
  }

  document.getElementsByTagName("head")[0].appendChild(css);
}

function addUsingFontFace(fontFamily, woffSrc) {
  var fontFace = new FontFace(fontFamily, 'url(' + woffSrc + ')');

  // document.fonts has a .has method on Chrome but seems naive
  // so just add for now...
  document.fonts.add(fontFace);

  fontFace.load();

  return fontFace.loaded;
}

function addUsingObserver(fontFamily, woffSrc, options) {
  var fontWeight = options['font-weight'] ? options['font-weight'] : 'normal';

  // clone options object to avoid mutations
  var fontFaceOptions = {};

  for (option in options) {
    if (options.hasOwnProperty(option)) {
      fontFaceOptions[option] = options[option];
    }
  }

  // wrap font src options entries into a "url()" declaration
  fontFaceOptions.src = fontFaceOptions.src.map(function(src){
    return 'url(' + src + ')';
  });

  addRuleToDocument(fontFaceRule(fontFamily, fontFaceOptions));

  return new FontFaceObserver(fontFamily, {weight: fontWeight}).check();
}

module.exports = function addAndLoadFont(fontFamily, options) {
  if (!options || !options.src || options.src.length === 0) {
    throw new Error('Must have at least one font source!');
  }

  var woffSrc = find(options.src, function(src) {
    return woffRegExp.test(src);
  });

  if (!woffSrc) {
    throw new Error('No WOFF format font detected!');
  }

  if (window.FontFace) {
    return addUsingFontFace(fontFamily, woffSrc);
  } else {
    return addUsingObserver(fontFamily, woffSrc, options);
  }
};
