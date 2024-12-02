export class Point {
    constructor(public x: number, public y: number) {}

    translate(delta: Point): Point {
        return new Point(this.x + delta.x, this.y + delta.y);
    }

    scale(factor: number): Point {
        return new Point(this.x * factor, this.y * factor);
    }

    subtract(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y);
    }
}
