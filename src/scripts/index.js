import '../styles/index.scss';

import InViewport from './in-viewport/InViewport';
import Lazyload from './lazyload/Lazyload.js';
import {prefix} from './base/tools.js';

(function () {
    'use strict';

    if (module.hot) {
        module.hot.accept();
    }

    window.addEventListener('load', function () {

      let $items = [...document.querySelectorAll('.in-viewport')];

      for (let i in $items) {
        new InViewport({
          element: $items[i],
          context: document.querySelector('.scroll-snap'),
          enter(viewport, event) {
            // console.log(event, viewport);
          },
          leave(viewport, event) {
            // console.log(event, viewport);
          }
        });
      }

      new Lazyload({
        root: document.querySelector('.scroll-snap'),
        selector: '.js-lazyload',
        rootMargin: '20%',
        threshold: 0.1
      });
    });
}());
