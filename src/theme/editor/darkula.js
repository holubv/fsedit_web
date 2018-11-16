ace.define("ace/theme/darkula", ["require", "exports", "module", "ace/lib/dom"], function (acequire, exports, module) {

    exports.isDark = true;
    exports.cssClass = "ace-darkula";
    exports.cssText = require('./darkula.css');
    exports.$id = "ace/theme/darkula";

    let dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
