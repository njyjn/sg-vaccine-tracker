import axios from 'axios';
import { processLatestCount } from '../../../src/logic/sync';
import fs from 'fs';
import path from 'path';
import { Count } from '../../../src/models/Count';

jest.mock('axios');
jest.setTimeout(30000);

const mockHtmlContent = fs.readFileSync(path.resolve(__dirname, '../../../__mocks__/vaccination.html'), 'utf-8');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('latest data 2021-05-10', () => {
    test('returns data 2021-05-17', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHtmlContent });
        await expect(processLatestCount()).resolves.toEqual([
            true,
            [
                {
                    dateAsOf: '2021-05-17T00:00:00.000Z',
                    dateAsOfPrevious: '2021-04-03T00:00:00.000Z',
                    daysElapsedSincePrevious: 44,
                    percentChangeDelta: 0.27,
                    percentage: 25.34,
                    percentageChange: 17.11,
                    percentageChangeAvgPerDay: 0.39,
                    percentagePrevious: 8.23,
                    totalPopulation: 5685800,
                    type: 'fullyVaccinated',
                    value: 1440545,
                    valueChange: 972545,
                    valueChangeAvgPerDay: 22103,
                    valuePrevious: 468000,
                }
            ] as Count[]
        ]);
    });
});