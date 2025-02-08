import { Ball } from './ball.js';
import { Vec2 } from './vec2.js';

/** Stores collision normal and penetration depth. */
export class Collision {
    /**
     * @param {Vec2} normal
     * @param {number} dist
     */
    constructor(normal, dist) {
        /** @type {Vec2} */
        this.normal = normal;

        /** @type {number} */
        this.dist = dist;
    }
}

/**
 * Test for collision between two balls.
 * @param {Ball} ball1
 * @param {Ball} ball2
 */
export function collideBalls(ball1, ball2) {
    const diff = ball2.pos.sub(ball1.pos);
    const diffLen = diff.len();
    const dist = diffLen - ball1.radius - ball2.radius;
    if (dist > 0) return null;
    const normal = diff.Div(diffLen);
    if (!normal.isFinite()) normal.Set(1, 0);
    return new Collision(normal, -dist);
}
