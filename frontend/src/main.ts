import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pan-zoom-canvas')
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

  @property({ type: String }) imageSrc: string = '/Los_Porros.png'; // Replace with your image path

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private image: HTMLImageElement = new Image();
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  firstUpdated() {
    this.canvas = this.shadowRoot!.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d');

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

    // Calculate initial scale to fit the image
    const scaleX = this.canvas.width / this.image.width;
    const scaleY = this.canvas.height / this.image.height;
    this.scale = Math.min(scaleX, scaleY);

    // Center the image
    this.offsetX = (this.canvas.width - this.image.width * this.scale) / 2;
    this.offsetY = (this.canvas.height - this.image.height * this.scale) / 2;
  }

  private addEventListeners() {
    this.canvas.addEventListener('wheel', (e) => this.zoom(e));
    this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
    this.canvas.addEventListener('mousemove', (e) => this.drag(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrag());
    this.canvas.addEventListener('mouseleave', () => this.stopDrag());
  }

  private zoom(e: WheelEvent) {
    e.preventDefault();
    const zoomFactor = 1.1;
    const scaleChange = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

    // Calculate the new scale
    const newScale = this.scale * scaleChange;

    // Prevent zooming out beyond the initial scale and exit early
    const minScale = Math.min(this.canvas.width / this.image.width, this.canvas.height / this.image.height);
    if (newScale < minScale) {
      return;
    }

    // Adjust scale
    this.scale = newScale;

    const mouseX = e.offsetX - this.offsetX;
    const mouseY = e.offsetY - this.offsetY;

    // Adjust offset to zoom relative to the mouse position
    this.offsetX -= mouseX * (scaleChange - 1);
    this.offsetY -= mouseY * (scaleChange - 1);

    this.draw();
  }

  private dragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  
  private startDrag(e: MouseEvent) {
    this.dragging = true;
    this.lastMouseX = e.offsetX;
    this.lastMouseY = e.offsetY;
  }
  
  private drag(e: MouseEvent) {
    if (!this.dragging) return;
  
    const deltaX = e.offsetX - this.lastMouseX;
    const deltaY = e.offsetY - this.lastMouseY;
  
    // Update offsets to allow panning
    this.offsetX += deltaX;
    this.offsetY += deltaY;
  
    this.lastMouseX = e.offsetX;
    this.lastMouseY = e.offsetY;
  
    this.draw();
  }
  
  private stopDrag() {
    this.dragging = false;
  }
  
  private draw() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();

    // Translate and scale for zoom/pan
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);

    // Draw the image
    this.ctx.drawImage(this.image, 0, 0);
    this.ctx.restore();
  }

  render() {
    return html`<canvas></canvas>`;
  }
}
