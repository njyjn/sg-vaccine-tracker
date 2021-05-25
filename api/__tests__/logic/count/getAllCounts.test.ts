import { getAllCounts } from '../../../src/logic/count';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

const countSeedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../docker/dynamodb/seeds/counts.json'), 'utf-8'));

describe('with type, no limit, key', () => {
    test('returns all fullyVaccinated', async () => {
        await expect(getAllCounts('fullyVaccinated')).resolves.toEqual([
            countSeedData,
            undefined
        ]);
    });
});

describe('no limit, key, or type', () => {
    test('returns all records', async () => {
        await expect(getAllCounts()).resolves.toEqual([
            countSeedData,
            undefined
        ]);
    });
});

describe('with limit, no key, no type', () => {
    test('limit 1 key to ownself', async () => {
        await expect(getAllCounts(undefined, 1)).resolves.toEqual([
            [countSeedData[0]],
            {
                dateAsOf: countSeedData[0]['dateAsOf'],
                type: countSeedData[0]['type']
            }
        ]);
    });
    test('limit 2 key to last element', async () => {
        await expect(getAllCounts(undefined, 2)).resolves.toEqual([
            [
                countSeedData[0],
                countSeedData[1]
            ],
            {
                dateAsOf: countSeedData[1]['dateAsOf'],
                type: countSeedData[1]['type']
            }
        ]);
    });
});

describe('with limit, key, no type', () => {
    test('limit 1 key to ownself with offset 0', async () => {
        await expect(
            getAllCounts(undefined, 1, `${countSeedData[0]['dateAsOf']},${countSeedData[0]['type']}`)
        ).resolves.toEqual([
            [countSeedData[1]],
            {
                dateAsOf: countSeedData[1]['dateAsOf'],
                type: countSeedData[1]['type']
            }
        ]);
    });
    test('limit 2 key to last element with offset 1', async () => {
        await expect(
            getAllCounts(undefined, 2, `${countSeedData[0]['dateAsOf']},${countSeedData[0]['type']}`)
        ).resolves.toEqual([
            [
                countSeedData[1],
                countSeedData[2]
            ],
            {
                dateAsOf: countSeedData[2]['dateAsOf'],
                type: countSeedData[2]['type']
            }
        ]);
    });
});
