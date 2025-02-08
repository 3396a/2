// Canvas and rendering context wrapper

export const canvas = unwrap(document.querySelector('canvas'));
export const ctx = unwrap(canvas.getContext('2d'));

function resize() {
    const dpr = window.devicePixelRatio;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
}
resize();
window.addEventListener('resize', resize);
