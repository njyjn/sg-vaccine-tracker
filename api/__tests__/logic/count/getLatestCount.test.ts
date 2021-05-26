import { getLatestCounts } from '../../../src/logic/count';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

const countSeedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../docker/dynamodb/seeds/counts.json'), 'utf-8'));

describe('fullyVaccinated', () => {
    test('returns latest fullyVaccinated', async () => {
        await expect(getLatestCounts('fullyVaccinated')).resolves.toEqual([
            countSeedData[0],
            undefined
        ]);
    });
});
