import { calculatePercentage } from '../../../src/logic/count';

test('calculates 535,864 / 5,685,800', () => {
    expect(calculatePercentage(535864, 5685800)).toBe(9.42);
});

test('calculates 800,800 / 5,685,800', () => {
    expect(calculatePercentage(800800, 5685800)).toBe(14.08);
});

test('calculates 2,555,777 / 5,685,800', () => {
    expect(calculatePercentage(2555777, 5685800)).toBe(44.95);
});