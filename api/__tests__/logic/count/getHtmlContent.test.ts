import axios from 'axios';
import { getHtmlContent } from '../../../src/logic/count';
import { Count } from '../../../src/models/Count';
import fs from 'fs';
import path from 'path';

jest.mock('axios');

const mockHtmlContent = fs.readFileSync(path.resolve(__dirname, '../../../__mocks__/vaccination.html'), 'utf-8');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Here the HTML mockfile is designed to differ from the latest seed data by only a day
// Since the seed data does not change much it is feasible
// Latest seed as of 2021-06-07
describe('fully vaccinated count', () => {
    test('gets value of 1888253 on ts of 6/08/21', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHtmlContent });
        await expect(
            getHtmlContent()
        ).resolves.toEqual([
            {
                dateAsOf: '2021-06-08T00:00:00.000Z',
                type: 'partiallyVaccinated',
                value: 2503814
            },
            {
                dateAsOf: '2021-06-08T00:00:00.000Z',
                type: 'fullyVaccinated',
                value: 1888253
            },
            {
                dateAsOf: '2021-06-08T00:00:00.000Z',
                type: 'totalVaccinated',
                value: 4392067
            }
        ] as Count[])
    })
})
