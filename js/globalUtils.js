//
//  A bunch of useful global definitions. Imported by `main.js`.
//

/** @param {string} s */
globalThis.selectorAll = s => Array.from(document.querySelectorAll(s));

/** @param {string} s */
globalThis.selector = s => unwrap(document.querySelector(s));

//
//  Debugging-related utilities
//

/**
 * If this function is invoked, there is a bug.
 */
globalThis.unreachable = () => {
    throw new Error('Unreachable');
};

/**
 * @param {boolean} condition
 * @param {...any} message
 * @returns {asserts condition}
 */
globalThis.assert = (condition, ...message) => {
    if (!condition) {
        console.error(...message);
        unreachable();
    }
};

/**
 * Asserts that the input is non-null and returns it.
 * @template T
 * @param {T} x
 * @returns {NonNullable<T>}
 */
globalThis.unwrap = x => {
    assert(x != null, 'Cannot unwrap undefined or null');
    return x;
};

let counter = 0;
/** Generates an entity id. */
globalThis.generateNextEntityId = () => counter++;

/**
 * @template T
 * @param {T[]} arr
 */
globalThis.pairs = function* (arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            yield [arr[i], arr[j]];
        }
    }
};

//
//  Custom math functions and constants
//

/**
 * @param {number} value
 * @param {number} lower
 * @param {number} upper
 */
globalThis.clamp = (value, lower = 0, upper = 1) => Math.max(lower, Math.min(upper, value));

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
globalThis.lerp = (a, b, t) => a * (1 - t) + b * t;

/**
 * Same as `Math.sign`, except for `sgn(0) = 1`.
 * @param {number} x
 * @returns {number}
 */
globalThis.sgn = x => (x < 0 ? -1 : 1);

globalThis.ETA = Math.PI / 2;
globalThis.TAU = Math.PI * 2;

/**
 * @param {number} x
 * @param {number} y
 */
globalThis.mod = (x, y) => x - floor(x / y) * y;

/**
 * Framerate independent lerp smoothing
 * @param {number} a
 * @param {number} b
 * @param {number} lambda
 * @param {number} dt
 */
globalThis.damp = (a, b, lambda, dt) => lerp(a, b, 1 - exp(-lambda * dt));

//
//  Make useful `Math` properties global
//

globalThis.E = Math.E;
globalThis.PI = Math.PI;
globalThis.abs = Math.abs;
globalThis.acos = Math.acos;
globalThis.acosh = Math.acosh;
globalThis.asin = Math.asin;
globalThis.asinh = Math.asinh;
globalThis.atan = Math.atan;
globalThis.atan2 = Math.atan2;
globalThis.atanh = Math.atanh;
globalThis.cbrt = Math.cbrt;
globalThis.ceil = Math.ceil;
globalThis.cos = Math.cos;
globalThis.cosh = Math.cosh;
globalThis.exp = Math.exp;
globalThis.floor = Math.floor;
globalThis.log = Math.log;
globalThis.log10 = Math.log10;
globalThis.log2 = Math.log2;
globalThis.max = Math.max;
globalThis.min = Math.min;
globalThis.pow = Math.pow;
globalThis.random = Math.random;
globalThis.round = Math.round;
globalThis.sign = Math.sign;
globalThis.sin = Math.sin;
globalThis.sinh = Math.sinh;
globalThis.sqrt = Math.sqrt;
globalThis.tan = Math.tan;
globalThis.tanh = Math.tanh;
globalThis.trunc = Math.trunc;
