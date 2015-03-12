var fontFaceRule = require('font-face-rule');
var fontObserver = require('font-face-observer');
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


module.exports = function(fontFamily, options) {
  if (!options.src || options.src.length === 0) {
    throw new Error('Must have at least one font source!');
  }

  var woffSrc = _.find(options.src, function(src) {
    return woffRegExp.test(src);
  });

  if (!woffSrc) {
    throw new Error('No WOFF format font detected!');
  }

  if (window.FontFace) {
    var fontFace = new FontFace(fontFamily, 'url(' + woffSrc + ')');

    // document.fonts has a .has method on Chrome but seems niave
    // so just add for now...
    document.fonts.add(fontFace);

    fontFace.load();

    return fontFace.loaded;
  } else {
    var rule = fontFaceRule(fontFamily, options);
    addRuleToDocument(rule);

    var fontWeight = options['font-weight'] || 'normal';

    return new FontFaceObserver(fontFamily, {weight: fontWeight}).check();
  }
};
