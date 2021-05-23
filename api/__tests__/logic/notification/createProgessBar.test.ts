import { testables } from '../../../src/logic/notification';

describe('progress bars', () => {
    test('0/10', () => {
        expect(testables.createProgessBar(0)).toBe('__________');
        expect(testables.createProgessBar(0, testables.mahjongBar)).toBe('🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('9.42/100', () => {
        expect(testables.createProgessBar(9.42)).toBe('-_________');
        expect(testables.createProgessBar(9.42, testables.mahjongBar)).toBe('🀑🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('14/100', () => {
        expect(testables.createProgessBar(14)).toBe('-_________');
        expect(testables.createProgessBar(14, testables.mahjongBar)).toBe('🀑🀒🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('20/100', () => {
        expect(testables.createProgessBar(20)).toBe('--________');
        expect(testables.createProgessBar(20, testables.mahjongBar)).toBe('🀑🀒🀓🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('29.7/100', () => {
        expect(testables.createProgessBar(29.7)).toBe('---_______');
        expect(testables.createProgessBar(29.7, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('34/100', () => {
        expect(testables.createProgessBar(34)).toBe('---_______');
        expect(testables.createProgessBar(34, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀫🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('44.9/100', () => {
        expect(testables.createProgessBar(44.9)).toBe('----______');
        expect(testables.createProgessBar(44.9, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀫🀫🀫🀫🀫🀫🀫🀫');
    })
    test('52/100', () => {
        expect(testables.createProgessBar(52)).toBe('-----_____');
        expect(testables.createProgessBar(52, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀫🀫🀫🀫🀫🀫🀫');
    })
    test('60/100', () => {
        expect(testables.createProgessBar(60)).toBe('------____');
        expect(testables.createProgessBar(60, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀫🀫🀫🀫🀫🀫');
    })
    test('64/100', () => {
        expect(testables.createProgessBar(64)).toBe('------____');
        expect(testables.createProgessBar(64, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀗🀫🀫🀫🀫🀫');
    })
    test('70/100', () => {
        expect(testables.createProgessBar(70)).toBe('-------___');
        expect(testables.createProgessBar(70, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀗🀅🀫🀫🀫🀫');
    })
    test('77/100', () => {
        expect(testables.createProgessBar(77)).toBe('--------__');
        expect(testables.createProgessBar(77, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀗🀅🀅🀫🀫🀫');
    })
    test('82.34/100', () => {
        expect(testables.createProgessBar(82.34)).toBe('--------__');
        expect(testables.createProgessBar(82.34, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀗🀅🀅🀅🀫🀫');
    })
    test('90.01/100', () => {
        expect(testables.createProgessBar(90.01)).toBe('---------_');
        expect(testables.createProgessBar(90.01, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀗🀅🀅🀅🀑🀫');
    })
    test('100/100', () => {
        expect(testables.createProgessBar(100)).toBe('----------');
        expect(testables.createProgessBar(100, testables.mahjongBar)).toBe('🀑🀒🀓🀕🀕🀕🀗🀗🀗🀅🀅🀅🀑🀑');
    })
})
