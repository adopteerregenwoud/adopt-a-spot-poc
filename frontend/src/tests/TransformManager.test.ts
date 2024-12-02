import { Point } from "../Point";
import { TransformManager } from "../TransformManager";

describe("TransformManager", () => {
    const canvasWidth: number = 800;
    const canvasHeight: number = 600;
    const imageWidth: number = 1000;
    const imageHeight: number = 500;
    let manager: TransformManager;

    beforeEach(() => {
        manager = new TransformManager(
            canvasWidth,
            canvasHeight,
            imageWidth,
            imageHeight
        );
    });

    test("initializes with correct scale and offset", () => {
        const scale = manager.getScale();
        const offset = manager.getOffset();

        // We expect the image to cover the canvas:
        const expectedScale = Math.max(
            canvasWidth / imageWidth,
            canvasHeight / imageHeight
        );

        expect(scale).toBeCloseTo(expectedScale);
        expect(offset.x).toBeCloseTo(0);
        expect(offset.y).toBeCloseTo(0);
    });

    test("zooms in and updates scale and offset correctly", () => {
        const initialScale = manager.getScale();
        const initialOffset = manager.getOffset();
        const mousePoint = new Point(400, 300); // Mouse in the center of the canvas

        manager.zoom(-100, mousePoint); // Zoom in
        const newScale = manager.getScale();
        const newOffset = manager.getOffset();

        expect(newScale).toBeGreaterThan(initialScale);
        expect(newOffset).not.toEqual(initialOffset); // Offset should adjust for zoom
    });

    test("zooms out and stops at minimum scale", () => {
        const minScale = manager.getScale(); // Initial scale is the minimum
        const mousePoint = new Point(400, 300);

        manager.zoom(100, mousePoint); // Attempt to zoom out
        const newScale = manager.getScale();
        const newOffset = manager.getOffset();

        expect(newScale).toBeCloseTo(minScale); // Scale shouldn't go below minimum
        expect(newOffset).toEqual(manager.getOffset()); // Offset remains unchanged
    });

    test("pans correctly", () => {
        const initialOffset = manager.getOffset();
        const panDelta = new Point(50, -25);

        manager.pan(panDelta);
        const newOffset = manager.getOffset();

        expect(newOffset.x).toBeCloseTo(initialOffset.x + panDelta.x);
        expect(newOffset.y).toBeCloseTo(initialOffset.y + panDelta.y);
    });

    test("zoom and pan combined behavior", () => {
        const mousePoint = new Point(400, 300);
        manager.zoom(-100, mousePoint); // Zoom in
        const afterZoomOffset = manager.getOffset();

        manager.pan(new Point(30, 20)); // Pan
        const finalOffset = manager.getOffset();

        expect(finalOffset.x).toBeGreaterThan(afterZoomOffset.x);
        expect(finalOffset.y).toBeGreaterThan(afterZoomOffset.y);
    });

    test("zooming in on an image centered on the canvas keeps the mouse point stationary", () => {
        // Initial setup
        const mousePoint = new Point(400, 300); // Mouse at canvas center
        const initialOffset = manager.getOffset(); // Initial offset (image centered)
        const initialScale = manager.getScale();

        // Perform zoom in
        manager.zoom(-100, mousePoint); // Zoom in (negative deltaY)

        const newOffset = manager.getOffset();
        const newScale = manager.getScale();

        // Mouse point on the image in scaled coordinates before and after zoom
        const mousePointBeforeZoom = mousePoint
            .subtract(initialOffset)
            .scale(1 / initialScale);
        const mousePointAfterZoom = mousePoint
            .subtract(newOffset)
            .scale(1 / newScale);

        // Assert the mouse point remains stationary on the image
        expect(mousePointAfterZoom.x).toBeCloseTo(mousePointBeforeZoom.x);
        expect(mousePointAfterZoom.y).toBeCloseTo(mousePointBeforeZoom.y);

        // Assert the scale increases
        expect(newScale).toBeGreaterThan(initialScale);
    });

    test("zooming out does not allow the image to uncover canvas pixels", () => {
        const mousePoint = new Point(400, 300); // Mouse at canvas center

        // Perform zoom out beyond limits
        for (let i = 0; i < 10; i++) {
            manager.zoom(100, mousePoint); // Zoom out
        }

        const finalScale = manager.getScale();

        // Minimum scale ensures every canvas pixel is covered by the image
        const minScale = Math.max(
            canvasWidth / imageWidth,
            canvasHeight / imageHeight
        );

        expect(finalScale).toBeCloseTo(minScale);
    });
});
