ace.define("ace/theme/idea", ["require", "exports", "module", "ace/lib/dom"], function (acequire, exports, module) {

    exports.isDark = false;
    exports.cssClass = "ace-idea";
    exports.cssText = require('./idea.css');
    exports.$id = "ace/theme/idea";

    let dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
