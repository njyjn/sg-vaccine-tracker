import { testables } from '../../../src/logic/notification';

test('builds tweet for 535,864 / 5,685,800', () => {
    expect(testables.buildTweet(535864, testables.mahjongBar, 5685800)).toBe(
        `9.42%
🀑🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫`
    );
});

test('builds tweet for 849,764 / 5,685,800', () => {
    expect(testables.buildTweet(849764, testables.mahjongBar, 5685800)).toBe(
        `14.95%
🀑🀒🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫🀫`
    );
});
