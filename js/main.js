import './globalUtils.js';
import { canvas, ctx } from './canvas.js';
import { viewport } from './viewport.js';
import { drawMouse, mouse } from './mouse.js';
import { drawBalls, updateBalls } from './balls.js';
import { drawParticles, updateParticles } from './particles.js';
import { keys } from './keys.js';
import { state } from './state.js';

// The main loop
requestAnimationFrame(function tick() {
    const dt = 0.02;
    const substeps = 4;
    for (let i = 0; i < substeps; i++) {
        update(dt / substeps);
    }
    draw();
    requestAnimationFrame(tick);
});

/** @param {number} dt */
function update(dt) {
    updateBalls(dt);
    updateParticles(dt);
}

function draw() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    viewport.transformCtx();

    drawParticles();
    drawBalls();
    drawMouse();
    viewport.draw();
}

// showing/hiding menu
keys.registerKeydown(code => {
    if (code !== 'Escape') return;
    const menu = selector('#menu');
    if (menu.classList.contains('visible')) {
        menu.classList.remove('visible');
    } else {
        menu.classList.add('visible');
    }
});

// make sure that no alt+tab weirdness happens
window.addEventListener('blur', event => {
    mouse.down = false;
    mouse.rightDown = false;
    state.constrained = false;
    state.fixed = false;
    state.pulling = false;
    state.pushing = false;
});

// sync music volume
const music = new Audio('assets/music.mp3');
music.loop = true;

const volumeInput = selector('#volume-input');
function syncVolume() {
    assert(volumeInput instanceof HTMLInputElement);
    const volume = clamp(parseFloat(volumeInput.value));
    music.volume = volume;
}
syncVolume();
volumeInput.addEventListener('input', syncVolume);

// play music on first click
window.addEventListener('click', function startMusic() {
    console.log('playing music');
    music.play();
    window.removeEventListener('click', startMusic);
});
