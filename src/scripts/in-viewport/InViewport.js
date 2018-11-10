import {
    NAMESPACE,
    SEPARATOR,
    DEFAULT_OPTIONS,
    // USE_CSS_ANIMATIONS,
    CSS_LEAVE_DURATI0N,
    CSS_ENTER_DURATI0N
} from "./constants";

import {
    debounced,
    throttled
} from '../base/helpers';

let keyCounter = 0;
let allInstances = [];
let hasEvents = false;
let hasEventToggler = false;


class InViewport {
    constructor(options) {
        this.key = NAMESPACE + SEPARATOR + keyCounter;
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.context = (this.options.context === 'window') ? document.documentElement : this.options.context;

        if (this.options.element && !allInstances[this.key]) {

            allInstances[this.key] = this;
            // InViewport.allInstances = allInstances;

            this.bindEvents();
            this.refresh();

            keyCounter++;
        }
    }


    bindEvents() {
        if (hasEvents) return;

        this.debouncedResize = debounced(200, this.onResize.bind(this));
        this.throttledScroll = throttled(10, this.onScroll.bind(this));
        this.toggleEvents = this.toggleEvents.bind(this);

        window.addEventListener('resize', this.debouncedResize, false);
        this.context.addEventListener('scroll', this.throttledScroll, false);

        if (!hasEventToggler)
            this.context.addEventListener('click', this.toggleEvents, false);

        hasEvents = true;

        console.log('bindEvents', hasEvents, this.context);
        console.dir(this.context);

        hasEventToggler = true;
    }

    unbindEvents() {
        if (!hasEvents) return;

        window.removeEventListener('resize', this.debouncedResize, false);
        this.context.removeEventListener('scroll', this.throttledScroll, false);

        hasEvents = false;

        console.log('unbindEvents', hasEvents);
    }

    toggleEvents() {
        if (hasEvents) {
            this.unbindEvents();
        } else {
            this.bindEvents();
        }

        
    }

    onChangeViewportCB(key, previous, current, viewport) {
        // on change viewport callback...
        this.options.element.classList[current === 1 ? 'add' : 'remove'](key);

        // console.log(this.key, key, previous, current);


        // viewport[key][0] && console.log('leave to ' + key);
        // viewport[key][1] && console.log('enter from ' + key);

        if (this.options.element && !this.isAnimating) {
            for (let k in viewport) {
                if (viewport[k][1]) {
                    // console.log(this.key, key, k, previous, current);
                    this.addClassAndRemoveOnAnimationEnd(NAMESPACE + '--enter-from-' + k, CSS_ENTER_DURATI0N);
                }

                if (viewport[k][0]) {
                    // console.log(this.key, key, k, previous, current);
                    this.addClassAndRemoveOnAnimationEnd(NAMESPACE + '--leave-to-' + k, CSS_LEAVE_DURATI0N);
                }
            }
        }


    }

    addClassAndRemoveOnAnimationEnd(className, duration) {
        let el = this.options.element;
        this.isAnimating = true;


        el.classList.add(className);

        let timeOut = setTimeout(() => {
            el.classList.remove(className);
            this.isAnimating = false;

            clearTimeout(timeOut);
        }, duration);
    }

    onChange(tp, cb) {
        if (tp && cb && typeof cb === 'function') {
            cb();
        }
    }

    onResize() {
        this.refreshAll();
    }

    onScroll() {
        this.refreshAll();
    }

    refresh() {
        // console.log('refresh', this.options, this.key);

        const context = this.context;
        const element = this.options.element;

        let elRect = element.getBoundingClientRect();
        let ctxRect = context.getBoundingClientRect();

        let obj = {
            [NAMESPACE + '--all-in-viewport']: Number(elRect.top > ctxRect.top && elRect.bottom < ctxRect.bottom && elRect.left > ctxRect.left && elRect.right < ctxRect.right),
            [NAMESPACE + '--part-visible']: Number(elRect.top < ctxRect.bottom && elRect.bottom > ctxRect.top && elRect.left < ctxRect.right && elRect.right > ctxRect.left),
        };

        // Refresh only if something has change
        for (let k in obj) {
            if (typeof this.obj === 'object') {
                if (this.obj[k] !== obj[k]) {
                    const viewport = this.calculate(this.ctxRect, this.elRect, ctxRect, elRect);

                    this.onChange(k, this.onChangeViewportCB.bind(this, k, this.obj[k], obj[k], viewport));
                }
            }
        }

        this.elRect = elRect;
        this.ctxRect = ctxRect;
        this.obj = Object.assign({}, obj);

        return obj;
    }

    calculate(pc, pe, cc, ce) {
        function calculate(a, b, c, d) {
            return [a >= b && c < d, c >= d && a < b];
        }

        let top = calculate(cc.top, ce.bottom, pc.top, pe.bottom);
        let left = calculate(cc.left, ce.right, pc.left, pe.right);
        let right = calculate(pc.right, pe.left, cc.right, ce.left);
        let bottom = calculate(pc.bottom, pe.top, cc.bottom, ce.top);

        return {
            top, right, bottom, left
        };
    }

    refreshAll() {
        InViewport.refreshAll();
    }

    static refreshAll() {
        const _instances = allInstances;

        for (let key in _instances) {
            if (key) {
                _instances[key].refresh();
            }
        }
    }
}

export default InViewport;
