import {
    CSS_ENTER_DURATI0N,
    CSS_LEAVE_DURATI0N,
    DEFAULT_OPTIONS,
    NAMESPACE,
    SEPARATOR
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

        // if (!hasEventToggler)
        //     this.context.addEventListener('click', this.toggleEvents, false);

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
                this.entering(viewport, k);
                this.leaving(viewport, k);
            }
        }
    }

    onResize() {
        window.requestAnimationFrame(this.refreshAll);
    }

    onScroll() {
        window.requestAnimationFrame(this.refreshAll);
    }

    // Methods
    addClassAndRemoveOnAnimationEnd(className, duration) {
        let el = this.options.element;
        this.isAnimating = true;

        el.classList.add(className);

        // TODO: can be done in a better way !!
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

    getViewport(obj) {
        const cl = this.ctxRect.left;
        const cw = this.ctxRect.width;
        const ct = this.ctxRect.top;
        const ch = this.ctxRect.height;
        const el = this.elRect.left;
        const ew = this.elRect.width;
        const et = this.elRect.top;
        const eh = this.elRect.height;

        const enter_from_top    = ct > et + eh && obj.any === 1;
        const enter_from_left   = cl > el + ew && obj.any === 1;
        const enter_from_bottom = et > ct + ch && obj.any === 1;
        const enter_from_right  = el > cl + cw && obj.any === 1;

        const leave_to_top      = ct <= et + eh && obj.any === 0;
        const leave_to_left     = cl <= el + ew && obj.any === 0;
        const leave_to_bottom   = et <= ct + ch && obj.any === 0;
        const leave_to_right    = el <= cl + cw && obj.any === 0;

        return {
            top: [leave_to_top, enter_from_top],
            left: [leave_to_left, enter_from_left],
            bottom: [leave_to_bottom, enter_from_bottom],
            right: [leave_to_right, enter_from_right],
        };
    }

    enterinOrLeaving(viewport, k, dir) {
        const name = ['enter-from', 'leave-to'];
        const func = ['enter', 'leave'];
        const reverse_dir = dir === 1 ? 0 : 1;

        if (viewport[k][reverse_dir]) {
            this.addClassAndRemoveOnAnimationEnd(NAMESPACE + '--' + name[dir] + '-' + k, CSS_ENTER_DURATI0N);

            if (this.options[func[dir]] && typeof this.options[func[dir]] === 'function')
                this.options[func[dir]](name[dir] + '-' + k, this);
        }
    }

    entering(viewport, k) {
        this.enterinOrLeaving(viewport, k, 1);
    }

    leaving(viewport, k) {
        this.enterinOrLeaving(viewport, k, 0);
    }

    refresh() {
        const context = this.context;
        const element = this.options.element;

        let elRect = this.getRect(element);
        let ctxRect = this.getRect(context, true);

        let obj = {
            all: this.insideViewport(elRect, ctxRect),
            any: this.acrossViewport(elRect, ctxRect),
        };

        if (typeof this.obj === 'object' && this.obj.any !== obj.any) {

            const viewport = this.getViewport(obj);

            this.onChange('any', obj.any, viewport);

        } else if (obj.any === 1) {

            this.options.element.classList.add(NAMESPACE + '--any');

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
