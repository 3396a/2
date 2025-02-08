import { vec2, Vec2 } from './vec2.js';

export class Ball {
    /**
     * @param {number} radius
     * @param {Vec2} pos
     */
    constructor(radius, pos) {
        /** @type {Vec2} */
        this.pos = pos.clone();

        /** @type {Vec2} */
        this.vel = vec2();

        /** @type {number} */
        this.radius = radius;

        /** @type {number} */
        this.mass = this.area();

        /** @type {Vec2[]} */
        this.trail = [];
    }

    area() {
        return PI * this.radius * this.radius;
    }

    /** @param {Vec2} p */
    containsPoint(p) {
        return p.sub(this.pos).len2() < this.radius ** 2;
    }
}
