// Keeping track of keyboard inputs

export const keys = {
    /** @type {((code: string) => void)[]} */
    keydown: [],
    /** @param {((code: string) => void)} callback */
    registerKeydown(callback) {
        this.keydown.push(callback);
    },

    /** @type {((code: string) => void)[]} */
    keyup: [],
    /** @param {((code: string) => void)} callback */
    registerKeyup(callback) {
        this.keyup.push(callback);
    },
};

window.addEventListener('keydown', event => {
    if (event.repeat) return;
    for (const callback of keys.keydown) {
        callback(event.code);
    }
});

window.addEventListener('keyup', event => {
    for (const callback of keys.keyup) {
        callback(event.code);
    }
});
