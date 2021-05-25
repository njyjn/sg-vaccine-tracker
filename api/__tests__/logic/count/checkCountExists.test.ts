import { checkCountExists } from '../../../src/logic/count';
import { Count } from '../../../src/models/Count';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

const countSeedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../docker/dynamodb/seeds/counts.json'), 'utf-8'));

describe('check latest from seed', () => {
    test('returns true', async () => {
        await expect(checkCountExists(countSeedData[0] as Count)).resolves.toEqual(
            true
        );
    });
});
