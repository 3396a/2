// Particles that are falling in the background

import { balls } from './balls.js';
import { ctx } from './canvas.js';
import { rot2, vec2, Vec2 } from './vec2.js';
import { viewport } from './viewport.js';

class Particle {
    /** @param {Vec2} pos */
    constructor(pos) {
        this.pos = pos.clone();
        this.depth = 0;
    }
}

const maxDepth = 5;
/** @type {Particle[]} */
let particles = [];

/** @param {number} dt */
export function updateParticles(dt) {
    addNewParticle();

    for (const particle of particles) {
        particle.depth += dt;
    }

    particles = particles.filter(particle => particle.depth < maxDepth);
}

export function drawParticles() {
    /** @param {number} t */
    function particleGradient(t) {
        const r = 0.5 * clamp(0.1 - t) ** 0.5;
        const g = 0.5 * clamp(0.15 - t) ** 0.5;
        const b = 0.7 * clamp(0.2 - 0.7 * t) ** 0.25;
        return `rgb(${255 * r} ${255 * g} ${255 * b})`;
    }
    for (const particle of particles) {
        const pos = particle.pos.div(1 + particle.depth);
        const t = clamp(particle.depth / maxDepth);
        ctx.fillStyle = particleGradient(t);
        // ctx.fillStyle = 'rgb(10 10 30)';
        // ctx.fillStyle = 'rgb(0 200 255)';
        ctx.globalAlpha = 1 - t ** 1.5;
        const size = 2.5 * (1 / (1 + particle.depth));
        ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
        ctx.globalAlpha = 1;
    }
}

function addNewParticle() {
    // throw in some random particles
    if (random() < 0.3 + 0.7 * exp(-0.4 * balls.length) || balls.length === 0) {
        const size = viewport.halfSize();
        const min = viewport.center.sub(size);
        const pos = vec2(random(), random()).Mul(2).Mul(size).Add(min);
        particles.push(new Particle(pos));
        return;
    }

    function boxMuller() {
        return rot2(TAU * random()).Mul(sqrt(-2 * log(1 - random())));
    }

    // pick a ball with probability proportional to its mass, and distribute particles around it
    const totalMass = balls.reduce((total, ball) => total + ball.mass, 0);
    const probabilities = balls.map(ball => ball.mass / totalMass);
    const rand = random();
    let p = probabilities[0];
    let i = 0;
    while (p < rand) {
        i++;
        p += probabilities[i];
    }
    i = min(i, balls.length - 1);
    const pos = balls[i].pos.add(boxMuller().Mul(balls[i].radius));
    particles.push(new Particle(pos));
}
