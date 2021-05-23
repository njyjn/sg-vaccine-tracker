import { calculateHistoricals } from '../../../src/logic/count';
import { Count } from '../../../src/models/Count';

describe('no initial data', () => {
    test('calculates percentage of 8.23 and no historicals', () => {
        expect(calculateHistoricals(
            {
                dateAsOf: '2021-04-03T00:00:00.000Z',
                type: 'fullyVaccinated',
                value: 468000
            } as Count,
            null,
        )).toEqual({
            dateAsOf: '2021-04-03T00:00:00.000Z',
            type: 'fullyVaccinated',
            value: 468000,
            totalPopulation: 5685800,
            percentage: 8.23,
            dateAsOfPrevious: '2021-01-27T00:00:00.000Z',
            daysElapsedSincePrevious: 66,
            valuePrevious: 50,
            percentagePrevious: 0,
            percentageChange: 8.23,
            percentageChangeAvgPerDay: 0.12,
            valueChange: 467950,
            valueChangeAvgPerDay: 7090,
            percentChangeDelta: 0.12,
        });
    });    
});

describe('previous data 4/3/2021 on 4/6/2021', () => {
    test('calculates percentage of 9.42 and delta ', () => {
        expect(calculateHistoricals(
            {
                dateAsOf: '2021-04-06T00:00:00.000Z',
                type: 'fullyVaccinated',
                value: 535864
            } as Count,
            {
                dateAsOf: '2021-04-03T00:00:00.000Z',
                type: 'fullyVaccinated',
                value: 468000,
                totalPopulation: 5685800,
                percentage: 8.23,
                dateAsOfPrevious: '2021-01-27T00:00:00.000Z',
                daysElapsedSincePrevious: 66,
                valuePrevious: 0,
                percentagePrevious: 0,
                percentageChange: 8.23,
                percentageChangeAvgPerDay: 0.12,
                valueChange: 468000,
                valueChangeAvgPerDay: 7090,
                percentChangeDelta: 0.12,
            } as Count,
        )).toEqual({
            dateAsOf: '2021-04-06T00:00:00.000Z',
            type: 'fullyVaccinated',
            value: 535864,
            totalPopulation: 5685800,
            percentage: 9.42,
            dateAsOfPrevious: '2021-04-03T00:00:00.000Z',
            daysElapsedSincePrevious: 3,
            valuePrevious: 468000,
            percentagePrevious: 8.23,
            percentageChange: 1.19,
            percentageChangeAvgPerDay: 0.4,
            valueChange: 67864,
            valueChangeAvgPerDay: 22621,
            percentChangeDelta: 0.28,
        });
    });    
});

describe('previous data 4/6/2021 on 4/18/2021', () => {
    test('calculates percentage of 14.95 and delta ', () => {
        expect(calculateHistoricals(
            {
                dateAsOf: '2021-04-18T00:00:00.000Z',
                type: 'fullyVaccinated',
                value: 849764
            } as Count,
            {
                dateAsOf: '2021-04-06T00:00:00.000Z',
                type: 'fullyVaccinated',
                value: 535864,
                totalPopulation: 5685800,
                percentage: 9.42,
                dateAsOfPrevious: '2021-04-03T00:00:00.000Z',
                daysElapsedSincePrevious: 3,
                valuePrevious: 468000,
                percentagePrevious: 8.23,
                percentageChange: 1.19,
                percentageChangeAvgPerDay: 0.4,
                valueChange: 67864,
                valueChangeAvgPerDay: 22621,
                percentChangeDelta: 0.28,
            } as Count,
        )).toEqual({
            dateAsOf: '2021-04-18T00:00:00.000Z',
            type: 'fullyVaccinated',
            value: 849764,
            totalPopulation: 5685800,
            percentage: 14.95,
            dateAsOfPrevious: '2021-04-06T00:00:00.000Z',
            daysElapsedSincePrevious: 12,
            valuePrevious: 535864,
            percentagePrevious: 9.42,
            percentageChange: 5.53,
            percentageChangeAvgPerDay: 0.46,
            valueChange: 313900,
            valueChangeAvgPerDay: 26158,
            percentChangeDelta: 0.06,
        });
    });    
});