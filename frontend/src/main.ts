import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('pan-zoom-canvas')
export class PanZoomCanvas extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    canvas {
      display: block;
      cursor: grab;
    }
    canvas:active {
      cursor: grabbing;
    }
  `;

  @property({ type: String }) imageSrc: string = 'Los_Porros.png';

  @state() private scale: number = 1;
  @state() private offsetX: number = 0;
  @state() private offsetY: number = 0;
  @state() private dragging: boolean = false;
  @state() private lastMouseX: number = 0;
  @state() private lastMouseY: number = 0;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private image: HTMLImageElement = new Image();

  firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.offsetWidth;
    this.canvas.height = this.offsetHeight;

    this.image.src = this.imageSrc;
    this.image.onload = () => this.draw();

    this.addEventListeners();
  }

  private addEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
    this.canvas.addEventListener('mousemove', (e) => this.drag(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrag());
    this.canvas.addEventListener('mouseleave', () => this.stopDrag());
    this.canvas.addEventListener('wheel', (e) => this.zoom(e));
  }

  private startDrag(e: MouseEvent) {
    this.dragging = true;
    this.lastMouseX = e.offsetX;
    this.lastMouseY = e.offsetY;
  }

  private drag(e: MouseEvent) {
    if (!this.dragging) return;

    const deltaX = e.offsetX - this.lastMouseX;
    const deltaY = e.offsetY - this.lastMouseY;

    this.offsetX += deltaX;
    this.offsetY += deltaY;

    this.lastMouseX = e.offsetX;
    this.lastMouseY = e.offsetY;

    this.draw();
  }

  private stopDrag() {
    this.dragging = false;
  }

  private zoom(e: WheelEvent) {
    e.preventDefault();
    const zoomFactor = 1.1;
    const scaleChange = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

    const mouseX = e.offsetX - this.offsetX;
    const mouseY = e.offsetY - this.offsetY;

    // Adjust offset to zoom relative to the mouse position
    this.offsetX -= mouseX * (scaleChange - 1);
    this.offsetY -= mouseY * (scaleChange - 1);

    this.scale *= scaleChange;
    this.draw();
  }

  private draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.image, 0, 0);
    this.ctx.restore();
  }

  render() {
    return html`<canvas></canvas>`;
  }
}
