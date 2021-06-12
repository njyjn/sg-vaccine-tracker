import axios from 'axios';
import { processLatestCount } from '../../../src/logic/sync';
import fs from 'fs';
import path from 'path';
import { Count } from '../../../src/models/Count';

jest.mock('axios');
jest.setTimeout(30000);

const mockHtmlContent = fs.readFileSync(path.resolve(__dirname, '../../../__mocks__/vaccination.html'), 'utf-8');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Here the HTML mockfile is designed to differ from the latest seed data by only a day
// Since the seed data does not change much it is feasible
// Latest seed as of 2021-06-07
describe('latest data 2021-06-07', () => {
    test('returns data 2021-06-08', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHtmlContent });
        await expect(processLatestCount()).resolves.toEqual([
            true,
            [
                {
                    dateAsOf: '2021-06-08T00:00:00.000Z',
                    dateAsOfPrevious: '2021-06-07T00:00:00.000Z',
                    daysElapsedSincePrevious: 1,
                    percentChangeDelta: -0.31,
                    percentage: 33.21,
                    percentageChange: 0,
                    percentageChangeAvgPerDay: 0,
                    percentagePrevious: 33.21,
                    totalPopulation: 5685800,
                    type: 'fullyVaccinated',
                    value: 1888253,
                    valueChange: 0,
                    valueChangeAvgPerDay: 0,
                    valuePrevious: 1888253,
                }
            ] as Count[]
        ]);
    });
});