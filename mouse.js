// Keeping track of mouse data

import { canvas, ctx } from './canvas.js';
import { state } from './state.js';
import { vec2 } from './vec2.js';
import { viewport } from './viewport.js';

export const mouse = {
    pos: vec2(),
    down: false,
    rightDown: false,
};

window.addEventListener('pointermove', event => {
    mouse.pos.Set(event.clientX, event.clientY);
    mouse.pos.Sub(vec2(canvas.width / 2, canvas.height / 2));
    mouse.pos.Div(canvas.height / viewport.height);
});

canvas.addEventListener('pointerdown', event => {
    mouse.down = event.button === 0;
    mouse.rightDown = event.button !== 0;
});

window.addEventListener('pointerup', () => {
    mouse.down = false;
    mouse.rightDown = false;
});

export function drawMouse() {
    ctx.beginPath();
    ctx.arc(mouse.pos.x, mouse.pos.y, 5, 0, TAU);
    if (mouse.down || mouse.rightDown) ctx.fillStyle = 'rgb(255 240 240)';
    else if (state.fixed) ctx.fillStyle = 'rgb(20 20 20)';
    else if (state.constrained) ctx.fillStyle = 'rgb(20 50 255)';
    else if (state.pushing) ctx.fillStyle = 'rgb(200 50 20)';
    else if (state.pulling) ctx.fillStyle = 'rgb(20 0 250)';
    else ctx.fillStyle = 'rgb(50 80 80)';
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
}
