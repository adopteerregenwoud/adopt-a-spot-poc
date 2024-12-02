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
        // Arrange
        const mousePoint = new Point(400, 300);
        manager.zoom(-100, mousePoint);
        const initialOffset = manager.getOffset();
        const panDelta = new Point(5, 10);

        // Act
        manager.pan(panDelta);

        // Assert
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

    test("panning is constrained to prevent empty pixels on the canvas", () => {
        // Scale down to allow for potential panning
        manager.zoom(100, new Point(400, 300)); // Zoom out

        const scaledWidth = imageWidth * manager.getScale();
        const scaledHeight = imageHeight * manager.getScale();

        // Expected limits
        const minOffsetX = Math.min(0, canvasWidth - scaledWidth);
        const minOffsetY = Math.min(0, canvasHeight - scaledHeight);

        // Attempt to pan beyond the limits
        manager.pan(new Point(-1000, -1000)); // Far beyond the image boundaries
        let offset = manager.getOffset();

        // Assert that offsets are clamped
        expect(offset.x).toBeGreaterThanOrEqual(minOffsetX);
        expect(offset.y).toBeGreaterThanOrEqual(minOffsetY);

        // Attempt to pan within limits
        manager.pan(new Point(500, 500)); // Pan back into the image area
        offset = manager.getOffset();

        const maxOffsetX = 0;
        const maxOffsetY = 0;

        expect(offset.x).toBeLessThanOrEqual(maxOffsetX);
        expect(offset.y).toBeLessThanOrEqual(maxOffsetY);
    });

    test("zooming in and then zooming out prevents empty pixels on the canvas", () => {
        // Arrange
        const topLeft = new Point(0, 0);
        const bottomRight = new Point(canvasWidth, canvasHeight);

        // Zoom in
        manager.zoom(-100, topLeft);

        // Act
        manager.zoom(100, bottomRight);

        // Assert
        const finalScale = manager.getScale();

        const expectedMinScale = Math.max(
            canvasWidth / imageWidth,
            canvasHeight / imageHeight
        );
        expect(finalScale).toBeCloseTo(expectedMinScale);

        const scaledWidth = imageWidth * finalScale;
        const scaledHeight = imageHeight * finalScale;
        const finalOffset = manager.getOffset();
        const expectedMinOffsetX = Math.min(0, canvasWidth - scaledWidth);
        const expectedMinOffsetY = Math.min(0, canvasHeight - scaledHeight);

        const expectedMaxOffsetX = 0;
        const expectedMaxOffsetY = 0;

        expect(finalOffset.x).toBeGreaterThanOrEqual(expectedMinOffsetX);
        expect(finalOffset.y).toBeGreaterThanOrEqual(expectedMinOffsetY);

        expect(finalOffset.x).toBeLessThanOrEqual(expectedMaxOffsetX);
        expect(finalOffset.y).toBeLessThanOrEqual(expectedMaxOffsetY);
    });
});
