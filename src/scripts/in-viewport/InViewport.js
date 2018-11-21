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

let offsetTop = 2;
let offsetBottom = 2;
let offsetLeft = 0;
let offsetRight = 0;

let timer = -1;

class InViewport {
    constructor(options) {
        this.key = NAMESPACE + SEPARATOR + keyCounter;
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.context = (this.options.context === 'window') ? document.body : this.options.context;

        if (this.options.element && !allInstances[this.key]) {

            allInstances[this.key] = this;

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
        hasEventToggler = true;
    }

    unbindEvents() {
        if (!hasEvents) return;

        window.removeEventListener('resize', this.debouncedResize, false);
        this.context.removeEventListener('scroll', this.throttledScroll, false);

        hasEvents = false;
    }

    toggleEvents() {
        if (hasEvents) {
            this.unbindEvents();
        } else {
            this.bindEvents();
        }
    }

    // EVENTS
    onChange(key, current, viewport) {
        this.options.element.classList[current === 1 ? 'add' : 'remove'](NAMESPACE + '--' + key);

        if (this.options.element && !this.isAnimating) {
            for (let k in viewport) {

                if (viewport[k][1]) {
                    this.addClassAndRemoveOnAnimationEnd(NAMESPACE + '--enter-from-' + k, CSS_ENTER_DURATI0N);
                    
                    if (this.options.enter && typeof this.options.enter === 'function')
                        this.options.enter('enter-from-' + k, this);
                }

                if (viewport[k][0]) {
                    this.addClassAndRemoveOnAnimationEnd(NAMESPACE + '--leave-to-' + k, CSS_LEAVE_DURATI0N);

                    if (this.options.leave && typeof this.options.leave === 'function')
                        this.options.leave('leave-to-' + k, this);
                }
            }
        }
    }

    onResize() {
        this.refreshAll();
    }

    onScroll() {
        window.requestAnimationFrame(this.refreshAll);
        // this.refreshAll();
    }

    // Methods
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

    getRect(el, useOffset) {
        let rect = el.getBoundingClientRect();

        let _obj = {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
            width: rect.width,
            height: rect.height
        };

        if (useOffset) {
            _obj = {
                top: rect.top + offsetTop,
                left: rect.left + offsetLeft,
                bottom: rect.bottom - offsetBottom,
                right: rect.right - offsetRight,
                width: _obj.width,
                height: _obj.height,
            };
        }

        return _obj;
    }

    insideViewport(a, b) {
        return Number(
            a.top >= b.top &&
            a.bottom <= b.bottom &&
            a.left >= b.left &&
            a.right <= b.right
        );
    }

    acrossViewport(a, b) {
        return Number(
            a.top < b.bottom &&
            a.bottom > b.top &&
            a.left < b.right &&
            a.right > b.left
        );
    }

    refresh() {
        // console.log('refresh', this.options, this.key);

        const context = this.context;
        const element = this.options.element;

        let elRect = this.getRect(element);
        let ctxRect = this.getRect(context, true);

        let obj = {
            all: this.insideViewport(elRect, ctxRect),
            any: this.acrossViewport(elRect, ctxRect),
        };

        if (typeof this.obj === 'object' && this.obj.any !== obj.any) {
            const enter_from_top = this.ctxRect.top > this.elRect.top + this.elRect.height;
            const enter_from_left = this.ctxRect.left > this.elRect.left + this.elRect.width;
            const enter_from_bottom = this.elRect.top > this.ctxRect.top + this.ctxRect.height;
            const enter_from_right = this.elRect.left > this.ctxRect.left + this.ctxRect.width;

            // const leave_to_top = this.ctxRect.top < this.elRect.top + this.elRect.height;
            // const leave_to_left = this.ctxRect.left < this.elRect.left + this.elRect.width;
            // const leave_to_bottom = this.elRect.top < this.ctxRect.top + this.ctxRect.height;
            // const leave_to_right = this.elRect.left < this.ctxRect.left + this.ctxRect.width;

            let viewport = {
                top: [0, enter_from_top],
                left: [0, enter_from_left],
                bottom: [0, enter_from_bottom],
                right: [0, enter_from_right],
            };

            this.onChange('any', obj.any, viewport);
        }

        this.elRect = elRect;
        this.ctxRect = ctxRect;
        this.obj = Object.assign({}, obj);

        return obj;
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
