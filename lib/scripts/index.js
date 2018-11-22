"use strict";require("core-js/modules/es6.string.iterator"),require("core-js/modules/es6.array.from"),require("core-js/modules/es6.regexp.to-string"),require("core-js/modules/es7.symbol.async-iterator"),require("core-js/modules/es6.symbol"),require("core-js/modules/web.dom.iterable"),require("../styles/index.scss");var _InViewport=require("./in-viewport/InViewport"),_InViewport2=_interopRequireDefault(_InViewport),_Lazyload=require("./lazyload/Lazyload.js"),_Lazyload2=_interopRequireDefault(_Lazyload),_tools=require("./base/tools.js");function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}(function(){"use strict";module.hot&&module.hot.accept(),window.addEventListener("load",function(){var a=_toConsumableArray(document.querySelectorAll(".in-viewport"));for(var b in a)new _InViewport2.default({element:a[b],context:document.querySelector(".scroll-snap"),enter:function a(){// console.log(event, viewport);
},leave:function a(){// console.log(event, viewport);
}});new _Lazyload2.default({root:document.querySelector(".scroll-snap"),selector:".js-lazyload",rootMargin:"20%",threshold:.1})})})();