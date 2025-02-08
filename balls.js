import { keys } from './keys.js';
import { Ball } from './ball.js';
import { canvas, ctx } from './canvas.js';
import { collideBalls } from './collision.js';
import { mouse } from './mouse.js';
import { state } from './state.js';
import { rot2, vec2 } from './vec2.js';
import { viewport } from './viewport.js';

/** @type {Ball[]} */
export let balls = [];

// default balls
balls.push(new Ball(3, vec2(0, -25)));
balls.push(new Ball(3, vec2(-45, 20)));
balls.push(new Ball(3, vec2(30, 50)));

//
//  Simulation
//

/** @param {number} dt */
export function updateBalls(dt) {
    /** @type {number[] | null} */
    let dists = null;
    const constrained = state.constrained;
    if (constrained) {
        dists = balls.map(ball => ball.pos.dist(mouse.pos));
    }

    updateCollision();
    updateCollisionWithViewport();

    // simulate the balls motion
    if (!state.fixed) {
        if (!state.pulling && !state.pushing) {
            for (const [ball1, ball2] of pairs(balls)) {
                const acc = ball2.pos.sub(ball1.pos);
                acc.Div(acc.len() ** 2.5);
                acc.CMul(rot2(ETA));
                const factor = 10;
                ball1.vel.AddScaled(acc, +factor * ball2.mass * dt);
                ball2.vel.AddScaled(acc, -factor * ball1.mass * dt);
            }
        }
        if (state.pulling) {
            for (const ball of balls) {
                const acc = mouse.pos.sub(ball.pos);
                acc.div(acc.len());
                const factor = 0.7;
                ball.vel.AddScaled(acc, factor * dt);
            }
        }
        if (state.pushing) {
            for (const ball of balls) {
                const acc = ball.pos.sub(mouse.pos);
                acc.div(acc.len());
                const factor = 0.8;
                ball.vel.AddScaled(acc, factor * dt);
            }
        }
    }
    // slow speeds to zero
    else {
        for (const ball of balls) {
            ball.vel.Damp(vec2(), 10, dt);
        }
    }

    for (const ball of balls) {
        ball.pos.AddScaled(ball.vel, dt);
    }

    if (constrained) {
        assert(dists != null);
        for (let i = 0; i < dists.length; i++) {
            // constrain position
            const n = balls[i].pos.sub(mouse.pos).Normalize();
            balls[i].pos.Copy(n.mul(dists[i]).Add(mouse.pos));

            // constrain velocity
            balls[i].vel.Project(n);
        }
    }

    if (mouse.rightDown) {
        balls = balls.filter(ball => !ball.containsPoint(mouse.pos));
    }
}

// manage ball-to-ball collisions
function updateCollision() {
    for (const [ball1, ball2] of pairs(balls)) {
        const coll = collideBalls(ball1, ball2);
        if (!coll) continue;
        const [m1, m2] = [ball1.mass, ball2.mass];
        const mtotal = m1 + m2;
        ball1.pos.Sub(coll.normal.mul((coll.dist * m2) / mtotal));
        ball2.pos.Add(coll.normal.mul((coll.dist * m1) / mtotal));
        // change their velocities
        const vrel = ball1.vel.clone().Sub(ball2.vel);
        const vtotal = -2 * vrel.dot(coll.normal);
        const impulse = vtotal / (1 / m1 + 1 / m2);
        const restitution = 0.8;
        ball1.vel.Add(coll.normal.mul((impulse * restitution) / m1));
        ball2.vel.Sub(coll.normal.mul((impulse * restitution) / m2));
    }
}

// keep balls inside the viewport
function updateCollisionWithViewport() {
    const size = viewport.halfSize();
    const min = viewport.center.sub(size);
    const max = viewport.center.add(size);
    for (const { pos, vel, radius } of balls) {
        if (pos.x < min.x + radius) {
            pos.x = min.x + radius;
            vel.x = abs(vel.x);
        }
        if (max.x - radius < pos.x) {
            pos.x = max.x - radius;
            vel.x = -abs(vel.x);
        }
        if (pos.y < min.y + radius) {
            pos.y = min.y + radius;
            vel.y = abs(vel.y);
        }
        if (max.y - radius < pos.y) {
            pos.y = max.y - radius;
            vel.y = -abs(vel.y);
        }
    }
}

//
//  Rendering
//

const maxTrailLength = 10;
export function drawBalls() {
    /** @param {number} t */
    function trailGradient(t) {
        const r = t ** 3;
        const g = 0.4 + 0.3 * t ** 3;
        const b = 0.5 + 0.3 * t;
        return `rgb(${255 * r} ${255 * g} ${255 * b})`;
    }

    // draw constraint lines
    if (state.constrained) {
        ctx.lineWidth = 0.3;
        ctx.strokeStyle = 'rgb(200 200 255 / 0.2)';
        for (const ball of balls) {
            const center = mouse.pos;
            const radius = ball.pos.dist(mouse.pos);
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, TAU);
            ctx.stroke();
        }
    }

    // draw trails
    for (const ball of balls) {
        for (let i = 0; i < ball.trail.length; i++) {
            const pos = ball.trail[i];
            const t = i / maxTrailLength;
            const size = 0.8 + 0.2 * t;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, size * ball.radius, 0, TAU);
            ctx.globalAlpha = t ** 3;
            ctx.fill();
            ctx.fillStyle = trailGradient(t);
            ctx.globalAlpha = 1;
        }
    }

    // draw balls
    for (const ball of balls) {
        const { pos } = ball;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, ball.radius, 0, TAU);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.filter = '';

        ball.trail.push(ball.pos.clone());
        if (ball.trail.length > maxTrailLength) {
            ball.trail.shift();
        }
    }
}

//
//  Hooking up ball-related events
//

canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    balls.push(new Ball(3 + 2 * random(), mouse.pos));
});

// fixing balls in place
keys.registerKeydown(code => {
    if (code !== 'KeyX') return;
    state.fixed = true;
});

keys.registerKeyup(code => {
    if (code !== 'KeyX') return;
    state.fixed = false;
});

// constraining
keys.registerKeydown(code => {
    if (code !== 'KeyC') return;
    state.constrained = true;
});
keys.registerKeyup(code => {
    if (code !== 'KeyC') return;
    state.constrained = false;
});

// pull
keys.registerKeydown(code => {
    if (code !== 'KeyZ') return;
    state.pulling = true;
    state.pushing = false;
});

keys.registerKeyup(code => {
    if (code !== 'KeyZ') return;
    state.pulling = false;
});

// push
keys.registerKeydown(code => {
    if (code !== 'KeyV') return;
    state.pushing = true;
    state.pulling = false;
    if (!state.fixed) {
        for (const ball of balls) {
            const n = ball.pos.sub(mouse.pos).Normalize();
            ball.vel.Lerp(n.Mul(50), 0.5);
        }
    }
});

keys.registerKeyup(code => {
    if (code !== 'KeyV') return;
    state.pushing = false;
});

// ball size control
keys.registerKeydown(code => {
    let sign = 0;
    if (code === 'Equal') sign = 1;
    else if (code === 'Minus') sign = -1;
    else return;
    for (const ball of balls) {
        if (ball.containsPoint(mouse.pos)) {
            ball.radius = ball.radius + sign * 0.8;
            ball.radius = clamp(ball.radius, 1, 40);
            ball.mass = ball.area();
        }
    }
});
