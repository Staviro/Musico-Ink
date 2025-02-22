'use strict'
/*!
    *Malo
    *(c) 2024 Joseph Morukhuladi
    *Licensed under MIT (https://malo-library.com/license)
*/
/**
 * Base object for malo
 */
const malo = {};

/**
 * Malo config object
 */
const maloConfig = {
    methods: {
        fadeIn: "fade-in",
        fadeOut: "fade-out",
        popIn: "pop-in",
        popOut: "pop-out",
        bounceIn: "bounce-in",
        bounceOut: "bounce-out",
        slideIn: "slide-in",
        slideOut: "slide-out",
        floatIn: "float-in",
        floatOut: "float-out"
    },
    effects: {
        blink: "blink",
        jump: "jump",
        bounce: "bounce"
    }
};

/**
 * Malo error handler object
 */
const maloErrors = {
    log: function(err) {
        console.error("Malo Error: ", err);
    },
    logError: function(msg) {
        console.error(msg);
    },
    notFound: "Malo: No element was found",
    invalidAxis: "Malo: The provided value for property 'axis' is not allowed",
    missingAxis: "Malo: The property 'axis' is missing from config",
    invalidConfig: "Malo: The provided config is not valid",
    invalidAnmType: "Malo: The provided value for property 'animation' is not allowed",
    invalidEffType: "Malo: The provided value for property 'effect' is not allowed",
    invalidDirection: "Malo: The provided value for property 'direction' is not allowed",
}

/**
 * Malo defaults object
 */
malo.defaults = {
    duration: 500,
    useAnimations: true,
    iteration: 1,
    delay: 0,
    timingFunction: "ease"
};

/**
 * Malo helpers object
 */
const maloHelpers = {};

maloHelpers.isValidElement = function(el) {
    let _el = document.querySelector(el);
    return _el != null && _el != undefined && _el != '';
};

maloHelpers.startFrame = function(el, cls, cf, display) {
    el.style.animationDuration = `${cf.duration}ms`;
    el.style.animationTimingFunction = cf.timingFunction;

    if (display != 'none') { el.style.display = display; }
    el.classList.add(cls);
    el.setAttribute("is-malo-animating", 'true');

    el.onanimationend = function() {
        if (display == 'none') el.style.display = 'none';
        if (typeof(cf.onComplete) !== 'undefined') cf.onComplete(); 
        maloHelpers.checkCallback(cf.hasCallback, cf.callback);
        maloHelpers.endFrame(el, cls);
        el.style.height = null;
    }
};

maloHelpers.startEffect = function(el, cls, cf, display) {
    el.style.animationDuration = `${cf.duration}ms`;
    el.style.animationIterationCount = cf.iteration;
    el.style.animationDelay = `${cf.delay}ms`;
    el.style.animationTimingFunction = cf.timingFunction;

    if (display != 'none') { el.style.display = display; }
    el.classList.add(cls);
    el.setAttribute("is-using-malo-effect", 'true');

    el.onanimationend = function() {
        maloHelpers.checkCallback(cf.hasCallback, cf.callback);
        maloHelpers.endEffect(el, cls);
    }
};

maloHelpers.endFrame = function(el, cls) {
    el.classList.remove(cls);
    el.style.animationDuration = null;
    el.style.animationTimingFunction = null;
    el.style.animationDelay = null;
    el.removeAttribute("is-malo-animating");
    el.onanimationend = null;
};

maloHelpers.endEffect = function(el, cls) {
    el.classList.remove(cls);
    el.style.animationDuration = null;
    el.style.animationTimingFunction = null;
    el.style.animationDelay = null;
    el.style.animationIterationCount = null;
    el.removeAttribute("is-using-malo-effect");
    el.onanimationend = null;

};

maloHelpers.isAnimating = function(el) {
    let val = el.getAttribute('is-malo-animating');
    if (val == null) { return false; }
    else if (val == 'true') { return true; }
    else { return false; }
};

maloHelpers.isUsingEffect = function(el) {
    let val = el.getAttribute('is-using-malo-effect');
    if (val == null) { return false; }
    else if (val == 'true') { return true; }
    else { return false; }
};

maloHelpers.hasProperty = function(obj, name) { return typeof(obj[name]) != 'undefined'; };

maloHelpers.getElement = function(el) {
    return document.querySelector(el);
};

maloHelpers.checkCallback = function(has, callback) {
    if (has) { callback(); }
};

maloHelpers.isValidConfig = function(cf) {
    let isValid = true;
    if (typeof(cf) == 'undefined') {
        maloErrors.logError(maloErrors.invalidConfig);
        return false;
    }
    let el = maloHelpers.hasProperty(cf, 'element') ? maloHelpers.getElement(cf.element) : null;
    if (el == null || typeof(el) == 'undefined' || !maloHelpers.isValidElement(cf.element)) {
        isValid = false;
        maloErrors.logError(maloErrors.notFound);
    }
    return isValid;
};

maloHelpers.assignDisplay = function(cf) {
    return !maloHelpers.hasProperty(cf, "display") ? "block" : cf.display;
};

maloHelpers.applyDefaults = function(cf) {
    let duration = !maloHelpers.hasProperty(cf, "duration") ? malo.defaults.duration : cf.duration;
    cf.duration = duration;
    let iteration = !maloHelpers.hasProperty(cf, "duration") ? malo.defaults.iteration : cf.iteration;
    cf.iteration = iteration;
    let delay = !maloHelpers.hasProperty(cf, "delay") ? 0 : cf.delay;
    cf.delay = delay;
    let timingFunction = !maloHelpers.hasProperty(cf, "timingFunction") ?  malo.defaults.timingFunction : cf.timingFunction;
    cf.timingFunction = timingFunction;
    let hasCallback = maloHelpers.hasProperty(cf, "callback") ?  true : false;
    cf.hasCallback = hasCallback;
    return cf;
};

/**
 * Malo methods objects
 */
const maloMethods = {};

maloMethods.sharedIn = function(options, cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            cf = maloHelpers.applyDefaults(cf);
            let el = maloHelpers.getElement(cf.element);
            if (maloHelpers.isAnimating(el)) { return; }
            let display = maloHelpers.assignDisplay(cf);
            maloHelpers.startFrame(el, options.animation, cf, display);
        } else {
            return maloErrors.logError(maloErrors.notFound);
        }
    } catch(err) {
        maloErrors.log(err);
    }
};

maloMethods.sharedOut = function(options, cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            cf = maloHelpers.applyDefaults(cf);
            let el = maloHelpers.getElement(cf.element);
            if (maloHelpers.isAnimating(el)) { return; }
            let display = 'none';
            maloHelpers.startFrame(el, options.animation, cf, display);
        } else {
            return maloErrors.logError(maloErrors.notFound);
        }
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.sharedEffect = function(options, cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            cf = maloHelpers.applyDefaults(cf);
            let el = maloHelpers.getElement(cf.element);
            if (maloHelpers.isUsingEffect(el)) { return; }
        }
        let el = maloHelpers.getElement(cf.element);
        let display = maloHelpers.assignDisplay(cf);
        maloHelpers.startEffect(el, options.effect, cf, display);
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.noAnimation = function(cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            let el = maloHelpers.getElement(cf.element);
            let display = !maloHelpers.hasProperty(cf, "display") ? "block" : cf.display;
            let hasCallback = maloHelpers.hasProperty(cf, "callback");
            el.style.display = display;
            maloHelpers.checkCallback(hasCallback, cf.callback);
        }
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.noEffect = function(cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            let el = maloHelpers.getElement(cf.element);
            let display = !maloHelpers.hasProperty(cf, "display") ? "block" : T.display;
            let hasCallback = maloHelpers.hasProperty(cf, "callback");
            el.style.display = display;
            maloHelpers.checkCallback(hasCallback, cf.callback);
        }
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.fadeIn = function(cf) {
    maloMethods.sharedIn({ animation: "malo-fade-in"}, cf);
};

maloMethods.fadeOut = function(cf) {
    maloMethods.sharedOut({ animation: "malo-fade-out" }, cf);
};

maloMethods.popIn = function(cf) {
    let direction = typeof(cf.direction) == "undefined" ? "" : "-" + cf.direction;
    maloMethods.sharedIn({ animation: "malo-pop-in" + direction }, cf);
};

maloMethods.popOut = function(cf) {
    let direction = typeof(cf.direction) == "undefined" ? "" : "-" + cf.direction;
    maloMethods.sharedOut({ animation: "malo-pop-out" + direction }, cf);
};

maloMethods.bounceIn = function(cf) {
    maloMethods.sharedIn({ animation: "malo-bounce-in"}, cf);
};

maloMethods.bounceOut = function(cf) {
    maloMethods.sharedOut({ animation: "malo-bounce-out" }, cf);
};

maloMethods.floatIn = function(cf) {
    try {
        let cls = "";
        let style = typeof(cf.style) == "undefined" ? "" : "-" + concffig.style;
        switch (cf.direction) {
            case "up": cls = "malo-float-up-in" + style; break;
            case "down": cls = "malo-float-down-in" + style; break;
            case "left": cls = "malo-float-left-in" + style; break;
            case "right": cls = "malo-float-right-in" + style; break;
            default: return maloErrors.logError(maloErrors.invalidDirection);
        }
        maloMethods.sharedIn({ animation: cls }, cf);
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.floatOut = function(cf) {
    try {
        let cls = "";
        switch (cf.direction) {
            case "up": cls = "malo-float-up-out"; break;
            case "down": cls = "malo-float-down-out"; break;
            case "left": cls = "malo-float-left-out"; break;
            case "right": cls = "malo-float-right-out"; break;
            default: return maloErrors.logError(maloErrors.invalidDirection);
        }
        maloMethods.sharedOut({ animation: cls }, cf);
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.slideIn = function(cf) {
    try {
        if (maloHelpers.isValidConfig(cf) && maloHelpers.hasProperty(cf, "axis")) {
            cf = maloHelpers.applyDefaults(cf);
            let el = maloHelpers.getElement(cf.element);
            if (maloHelpers.isAnimating(el)) { return; }
            let display = maloHelpers.assignDisplay(cf);
            let selectedClass = '';
            let clone = document.querySelector('body').cloneNode(true);
            clone.classList.add('malo-hidden');
            document.querySelector('body').appendChild(clone);
            let cloneEl = clone.querySelector(cf.element);
            cloneEl.style.display = display;
            cloneEl.style.animationDuration = "0s !important";
                       
            if (cf.axis == "y") {
                el.style.height = getComputedStyle(cloneEl).height;
                selectedClass = "malo-slide-y-in";
            } else if (cf.axis == "x") {
                el.style.width = getComputedStyle(cloneEl).width;
                selectedClass = "malo-slide-x-in";
            }
            clone.remove();
            maloHelpers.startFrame(el, selectedClass, cf, display);
        } else {
            if (!maloHelpers.hasProperty(cf, "axis")) {
                return maloErrors.logError(maloErrors.missingAxis);
            } else {
                return maloErrors.logError(maloErrors.notFound);
            }
        }
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.slideOut = function(cf) {
    try {
        if (maloHelpers.isValidConfig(cf) && maloHelpers.hasProperty(cf, "axis")) {
            cf = maloHelpers.applyDefaults(cf);
            let el = maloHelpers.getElement(cf.element);
            if (maloHelpers.isAnimating(el)) { return; }
            let selectedClass = "";
            if (cf.axis == 'y') {
                el.style.height = getComputedStyle(el).height;
                selectedClass = "malo-slide-y-out";
            } else if (cf.axis == 'x') {
                el.style.width = getComputedStyle(el).width;
                selectedClass = "malo-slide-x-out";
            } else {
                return maloErrors.logError(maloErrors.invalidAxis);
            }
            function onComplete() {
                if (cf.axis == 'y') { el.style.height = null }
                else if (cf.axis == 'x') { el.style.width = null }
            }
            maloMethods.sharedOut({ animation: selectedClass, onComplete }, cf);
            
        } else {
            return maloErrors.logError(maloErrors.notFound);
        }
    } catch (err) {
        maloErrors.log(err);
    }
};

maloMethods.blink = function(cf) {
    maloMethods.sharedEffect({ effect: "malo-blink"}, cf);
};

maloMethods.jump = function(cf) {
    maloMethods.sharedEffect({ effect: "malo-jump"}, cf);
};

maloMethods.bounce = function(cf) {
    maloMethods.sharedEffect({ effect: "malo-bounce"}, cf);
};

/**
 * Malo method for animations
 * @param {object} cf
 */
malo.animate = function(cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            cf = maloHelpers.applyDefaults(cf);
            if (malo.defaults.useAnimations == false) {
                return maloMethods.noAnimation(cf);
            }
            switch (cf.animation) {
                case "fade-in": maloMethods.fadeIn(cf); break;
                case "fade-out": maloMethods.fadeOut(cf); break;
                case "pop-in": maloMethods.popIn(cf); break;
                case "pop-out": maloMethods.popOut(cf); break;
                case "bounce-in": maloMethods.bounceIn(cf); break;
                case "bounce-out": maloMethods.bounceOut(cf); break;
                case "float-in": maloMethods.floatIn(cf); break;
                case "float-out": maloMethods.floatOut(cf); break;
                case "slide-in": maloMethods.slideIn(cf); break;
                case "slide-out": maloMethods.slideOut(cf); break;
                default: return maloErrors.logError(maloErrors.invalidAnmType);
            }
        } else {
            maloErrors.logError(maloErrors.invalidConfig);
        }
    } catch(err) {
        maloErrors.log(err);
    }
};


/**
 * Malo method for effects
 * @param {Object} cf
 */
malo.effect = function(cf) {
    try {
        if (maloHelpers.isValidConfig(cf)) {
            cf = maloHelpers.applyDefaults(cf);
            if (malo.defaults.useAnimations == false) {
                return maloMethods.noEffect(cf);
            }
            switch (cf.effect) {
                case "blink": maloMethods.blink(cf); break;
                case "jump": maloMethods.jump(cf); break;
                case "bounce": maloMethods.bounce(cf); break;
                default: return maloErrors.logError(maloErrors.invalidEffType);
            }
        } else {
            maloErrors.logError(maloErrors.invalidConfig);
        }
    } catch(err) {
        maloErrors.log(err);
    }
};