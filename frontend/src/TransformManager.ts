import { Point } from "./Point";

export class TransformManager {
    private scale: number = 1;
    private offset: Point = new Point(0, 0);
    private readonly minScale: number;

    constructor(
        canvasWidth: number,
        canvasHeight: number,
        imageWidth: number,
        imageHeight: number
    ) {
        const scaleX = canvasWidth / imageWidth;
        const scaleY = canvasHeight / imageHeight;
        this.minScale = Math.min(scaleX, scaleY);

        this.scale = this.minScale;
        this.offset = new Point(
            (canvasWidth - imageWidth * this.scale) / 2,
            (canvasHeight - imageHeight * this.scale) / 2
        );
    }

    public getScale(): number {
        return this.scale;
    }

    public getOffset(): Point {
        return this.offset;
    }

    public zoom(zoomDelta: number, mouse: Point) {
        const zoomFactor = 1.1;
        const scaleChange = zoomDelta < 0 ? zoomFactor : 1 / zoomFactor;
        const newScale = this.scale * scaleChange;

        if (newScale < this.minScale && zoomDelta > 0) {
            return;
        }

        const effectiveScale = Math.max(newScale, this.minScale);

        // Adjust offsets to zoom relative to the mouse position
        const relativeMouse = mouse.translate(this.offset);
        this.offset = this.offset.translate(
            relativeMouse.scale(effectiveScale / this.scale - 1)
        );

        this.scale = effectiveScale;
    }

    public pan(delta: Point) {
        this.offset = this.offset.translate(delta);
    }
}
