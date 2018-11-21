import {
  getData,
  isBot,
  supportsIntersectionObserver
} from './utils.js';

import { setSources } from './setSources.js';

const DEFAULT_OPTIONS = {
  selector: '.js-lazyload',
  classLoaded: 'is-loaded',
  classLoading: 'is-loading',
  threshold: 0.5,
};

let imagesLoaded = {};

class Lazyload {
  constructor(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.observerCallback = this.observerCallback.bind(this);

    const elements = [...document.querySelectorAll(this.options.selector)];

    if (supportsIntersectionObserver && !isBot) {
      const observer = new IntersectionObserver(this.observerCallback, {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      });

      elements.forEach(element => {
        observer.observe(element);
      });

    } else {
      // For google bot or non support of intersectionObserver
      elements.forEach(element => {
        setSources(element);
        element.parentNode.classList.add('is-loaded');
      });
    }
  }

  observerCallback(entries, observer) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting && !entry.target.src) {
        setSources(entry.target);

        // console.log(entry, index, entry.intersectionRatio);

        entry.target.parentNode.classList.add('is-loading');

        entry.target.onload = () => {
          let currentSrc = entry.target.currentSrc || entry.target.src;

          entry.target.parentNode.classList.remove('is-loading');
          entry.target.parentNode.classList.add('is-loaded');
          entry.target.onload = null;

          imagesLoaded[currentSrc] = currentSrc;
        };

        observer.unobserve(entry.target);
      }
    });
  }
}

export default Lazyload;
