import { Point } from "../Point";

describe("Point.subtract", () => {
    test("calculates the correct difference when both points have positive coordinates", () => {
        const point1 = new Point(10, 30);
        const point2 = new Point(5, 20);

        const result = point1.subtract(point2);

        expect(result).toEqual(new Point(5, 10)); // x: 10 - 5, y: 30 - 20
    });

    test("calculates the correct difference when both points have negative coordinates", () => {
        const point1 = new Point(-10, -30);
        const point2 = new Point(-5, -20);

        const result = point1.subtract(point2);

        expect(result).toEqual(new Point(-5, -10)); // x: -10 - (-5), y: -30 - (-20)
    });

    test("calculates the correct difference when one point is positive and the other is negative", () => {
        const point1 = new Point(10, -30);
        const point2 = new Point(-5, 20);

        const result = point1.subtract(point2);

        expect(result).toEqual(new Point(15, -50)); // x: 10 - (-5), y: -30 - 20
    });

    test("calculates the correct difference when points have non-identical values for x and y", () => {
        const point1 = new Point(15, 45);
        const point2 = new Point(10, 25);

        const result = point1.subtract(point2);

        expect(result).toEqual(new Point(5, 20)); // x: 15 - 10, y: 45 - 25
    });

    test("calculates the correct result when subtracting from the same point", () => {
        const point1 = new Point(7, 14);
        const result = point1.subtract(point1);

        expect(result).toEqual(new Point(0, 0)); // x: 7 - 7, y: 14 - 14
    });
});
