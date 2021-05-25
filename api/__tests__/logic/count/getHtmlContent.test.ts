import axios from 'axios';
import { getHtmlContent } from '../../../src/logic/count';
import { Count } from '../../../src/models/Count';
import fs from 'fs';
import path from 'path';

jest.mock('axios');

const mockHtmlContent = fs.readFileSync(path.resolve(__dirname, '../../../__mocks__/vaccination.html'), 'utf-8');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fully vaccinated count', () => {
    test('gets value of 1440545 on ts of 5/27/21', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHtmlContent });
        await expect(
            getHtmlContent()
        ).resolves.toEqual([{
            dateAsOf: '2021-05-17T00:00:00.000Z',
            type: 'fullyVaccinated',
            value: 1440545
        }] as Count[])
    })
})
