import { vec2, Vec2 } from './vec2.js';
import { ctx, canvas } from './canvas.js';

export class Viewport {
    /**
     * @param {Vec2} center
     * @param {number} height
     */
    constructor(center, height) {
        this.center = center.clone();
        this.height = height;
    }

    halfSize() {
        return vec2(canvas.width / canvas.height, 1).Mul(0.5 * viewport.height);
    }

    transformCtx() {
        const s = canvas.height / this.height;
        ctx.scale(s, s);
        ctx.translate(canvas.width / 2 / s, canvas.height / 2 / s);
    }

    draw() {
        const size = this.halfSize();
        const min = this.center.sub(size);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.2;
        ctx.strokeRect(min.x, min.y, 2 * size.x, 2 * size.y);
    }
}

export const viewport = new Viewport(vec2(0, 0), 150);
