import '../styles/index.scss';
import {prefix} from './base/tools.js';

import InViewport from './in-viewport/InViewport';

(function () {
    'use strict';

    if (module.hot) {
        module.hot.accept();
    }

    let $items = [...document.querySelectorAll('.in-viewport')];

    for (let i in $items) {
      new InViewport({
        element: $items[i],
        context: document.querySelector('.scroll-snap')
      }).refreshAll();
    }
}());