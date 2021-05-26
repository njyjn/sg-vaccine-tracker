import { getAllCounts } from '../../../src/logic/count';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

const countSeedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../docker/dynamodb/seeds/counts.json'), 'utf-8'));
const countSeedDataRelevant = countSeedData.filter(entry => entry.type === 'fullyVaccinated');

describe('with type, no limit, key', () => {
    test('returns all fullyVaccinated', async () => {
        await expect(getAllCounts('fullyVaccinated')).resolves.toEqual([
            countSeedDataRelevant,
            undefined
        ]);
    });
});

describe('no limit, key, or type', () => {
    test('returns same length', async () => {
        const result = await getAllCounts();
        expect(result[0].length).toEqual(countSeedData.length);
    });
});

describe('with limit, type, no key', () => {
    test('limit 1 key to ownself for fullyVaccinated', async () => {
        await expect(getAllCounts('fullyVaccinated', 1)).resolves.toEqual([
            [countSeedDataRelevant[0]],
            {
                dateAsOf: countSeedDataRelevant[0]['dateAsOf'],
                type: countSeedDataRelevant[0]['type']
            }
        ]);
    });
    test('limit 2 key to last element', async () => {
        await expect(getAllCounts(undefined, 2)).resolves.toEqual([
            [
                countSeedDataRelevant[0],
                countSeedDataRelevant[1]
            ],
            {
                dateAsOf: countSeedDataRelevant[1]['dateAsOf'],
                type: countSeedDataRelevant[1]['type']
            }
        ]);
    });
});

describe('with limit, key, type', () => {
    test('limit 1 key to ownself with offset 0 for fullyVaccinated', async () => {
        await expect(
            getAllCounts(undefined, 1, `${countSeedDataRelevant[0]['dateAsOf']},${countSeedDataRelevant[0]['type']}`)
        ).resolves.toEqual([
            [countSeedDataRelevant[1]],
            {
                dateAsOf: countSeedDataRelevant[1]['dateAsOf'],
                type: countSeedDataRelevant[1]['type']
            }
        ]);
    });
    test('limit 2 key to last element with offset 1', async () => {
        await expect(
            getAllCounts(undefined, 2, `${countSeedDataRelevant[0]['dateAsOf']},${countSeedDataRelevant[0]['type']}`)
        ).resolves.toEqual([
            [
                countSeedDataRelevant[1],
                countSeedDataRelevant[2]
            ],
            {
                dateAsOf: countSeedDataRelevant[2]['dateAsOf'],
                type: countSeedDataRelevant[2]['type']
            }
        ]);
    });
});
