"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),require("core-js/modules/es6.string.iterator"),require("core-js/modules/es6.array.from"),require("core-js/modules/es6.regexp.to-string"),require("core-js/modules/es7.symbol.async-iterator"),require("core-js/modules/es6.symbol"),require("core-js/modules/web.dom.iterable"),require("core-js/modules/es6.object.assign");var _utils=require("./utils.js"),_setSources=require("./setSources.js");function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var DEFAULT_OPTIONS={selector:".js-lazyload",classLoaded:"is-loaded",classLoading:"is-loading",threshold:.5},imagesLoaded={},Lazyload=/*#__PURE__*/function(){function a(b){_classCallCheck(this,a),this.options=Object.assign({},DEFAULT_OPTIONS,b),this.observerCallback=this.observerCallback.bind(this);var c=_toConsumableArray(document.querySelectorAll(this.options.selector));if(_utils.supportsIntersectionObserver&&!_utils.isBot){var d=new IntersectionObserver(this.observerCallback,{root:this.options.root,rootMargin:this.options.rootMargin,threshold:this.options.threshold});c.forEach(function(a){d.observe(a)})}else// For google bot or non support of intersectionObserver
c.forEach(function(a){(0,_setSources.setSources)(a),a.parentNode.classList.add("is-loaded")})}return _createClass(a,[{key:"observerCallback",value:function c(a,b){a.forEach(function(a){a.isIntersecting&&!a.target.src&&((0,_setSources.setSources)(a.target),a.target.parentNode.classList.add("is-loading"),a.target.onload=function(){var b=a.target.currentSrc||a.target.src;a.target.parentNode.classList.remove("is-loading"),a.target.parentNode.classList.add("is-loaded"),a.target.onload=null,imagesLoaded[b]=b},b.unobserve(a.target))})}}]),a}();exports.default=Lazyload;