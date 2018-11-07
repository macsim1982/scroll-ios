'use strict';

if (module.hot) {
    module.hot.accept();
}

import '../styles/index.scss';

import InViewport from './in-viewport/InViewport';

let $items = document.querySelectorAll('.in-viewport');

for (let $i in $items) {
  if ($i < 16)
  new InViewport({
    element: $items[$i],
    context: document.querySelector('.in-viewport--context')
  });
}

