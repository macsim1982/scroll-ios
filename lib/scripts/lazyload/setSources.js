"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.setSources=exports.setSourcesBgImage=void 0;var _utils=require("./utils.js"),setPictureSources=function(a,b,c){for(var d,e=0;d=a.children[e];e++)if("SOURCE"===d.tagName){var f=(0,_utils.getData)(d,c);setAtrribute(d,b,f)}},setAtrribute=function(a,b,c){c&&a.setAttribute(b,c)},setSourcesImg=function(a){var b=a.parentNode,c=(0,_utils.getData)(a,"sizes"),d=(0,_utils.getData)(a,"srcset"),e=(0,_utils.getData)(a,"src");b&&"PICTURE"===b.tagName&&setPictureSources(b,"srcset","srcset"),setAtrribute(a,"sizes",c),setAtrribute(a,"srcset",d),setAtrribute(a,"src",e)},setSourcesBgImage=exports.setSourcesBgImage=function(a){var b=(0,_utils.getData)(a,"src"),c=(0,_utils.getData)(a,"bg");if(b){a.style.backgroundImage="url(\"".concat(b,"\")")}if(c){a.style.backgroundImage=c}},setSourcesFunctions={IMG:setSourcesImg// 	IFRAME: setSourcesIframe,
// 	VIDEO: setSourcesVideo
},setSources=exports.setSources=function(a){var b=a.tagName,c=setSourcesFunctions[b];return c?void c(a):void setSourcesBgImage(a)};