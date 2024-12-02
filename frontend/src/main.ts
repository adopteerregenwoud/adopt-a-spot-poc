import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TransformManager } from "./TransformManager";
import { Point } from "./Point";

@customElement("pan-zoom-canvas")
export class PanZoomCanvas extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            max-width: 800px; /* Adjust canvas container max width */
            margin: 0 auto;
            border: 1px solid #ccc;
        }
        canvas {
            display: block;
            width: 100%; /* Make canvas responsive */
        }
    `;

    @property({ type: String }) imageSrc: string = "/Los_Porros.png";

    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D | null;
    private image: HTMLImageElement = new Image();
    private transformManager!: TransformManager;

    private dragging = false;
    private lastMousePos = new Point(0, 0);

    firstUpdated() {
        this.canvas = this.shadowRoot!.querySelector("canvas")!;
        this.ctx = this.canvas.getContext("2d");

        this.image.src = this.imageSrc;
        this.image.onload = () => {
            this.setupCanvas();
            this.draw();
        };

        this.addEventListeners();
    }

    private setupCanvas() {
        // Set canvas size
        const containerWidth = this.offsetWidth;
        const containerHeight = 600; // Adjust the fixed height
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;

        // Initialize TransformManager with canvas and image dimensions
        this.transformManager = new TransformManager(
            this.canvas.width,
            this.canvas.height,
            this.image.width,
            this.image.height
        );
    }

    private addEventListeners() {
        this.canvas.addEventListener("wheel", (e) => this.zoom(e));
        this.canvas.addEventListener("mousedown", (e) => this.startDrag(e));
        this.canvas.addEventListener("mousemove", (e) => this.drag(e));
        this.canvas.addEventListener("mouseup", () => this.stopDrag());
        this.canvas.addEventListener("mouseleave", () => this.stopDrag());
    }

    private zoom(e: WheelEvent) {
        e.preventDefault();
        const mousePos = new Point(e.offsetX, e.offsetY);
        this.transformManager.zoom(e.deltaY, mousePos);
        this.draw();
    }

    private startDrag(e: MouseEvent) {
        this.dragging = true;
        this.lastMousePos = new Point(e.offsetX, e.offsetY);
    }

    private drag(e: MouseEvent) {
        if (!this.dragging) return;

        const currentMousePos = new Point(e.offsetX, e.offsetY);
        const delta = currentMousePos.subtract(this.lastMousePos);

        this.transformManager.pan(delta);
        this.lastMousePos = currentMousePos;

        this.draw();
    }

    private stopDrag() {
        this.dragging = false;
    }

    private draw() {
        if (!this.ctx) return;

        const offset = this.transformManager.getOffset();
        const scale = this.transformManager.getScale();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        // Apply transformations
        this.ctx.translate(offset.x, offset.y);
        this.ctx.scale(scale, scale);

        // Draw the image
        this.ctx.drawImage(this.image, 0, 0);
        this.ctx.restore();
    }

    render() {
        return html`<canvas></canvas>`;
    }
}
