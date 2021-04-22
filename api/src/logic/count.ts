import axios from 'axios';
import { Count } from 'src/models/Count'
import { CountAccess } from 'src/dataLayer/countAccess';
import { parse } from 'node-html-parser';

const statUrl = process.env.STAT_URL;
const populationTotal = process.env.POPULATION_TOTAL || '5685800';

const countAccess = new CountAccess();

export async function getAllCounts(limit?: number, nextKey?: string): Promise<[Count[], any]> {
    try {
        return await countAccess.getAllCounts(limit, nextKey);
    } catch (e) {
        console.log('Failed to get all counts:', e);
    }
}

export async function getLatestCount(type?: string): Promise<Count> {
    // TODO: Implement type filtered in countAccess layer
    //@ts-ignore
    let countType = type || 'fullyVaccinated';
    try {
        const counts = await countAccess.getAllCounts();
        const sorted = counts[0].sort((a,b) => {
            const dateA = new Date(a.dateAsOf);
            const dateB = new Date(b.dateAsOf);
            if (dateA < dateB) {
                return 1;
            } else {
                return -1;
            }
        });
        return sorted[0];
    } catch (e) {
        console.log('Error getting latest count:', e);
    }
};

export async function getHtmlContent(sourceUrl?: string): Promise<Count> {
    try {
        const url = sourceUrl || statUrl;
        const dom = await axios.get(url);
        const document = parse(dom.data);
        const header = document.querySelectorAll('h3').find(node => {
            return node.innerText.startsWith('Vaccination Data (as of ');
        }).innerText;
        console.log('Found header to be', header);
        const td = document.querySelectorAll('td')
        const data = td[
            td.findIndex(node => {
                return node.innerText.includes('Completed Full Vaccination Regimen');
            }) + 1
        ].innerText.trim().replace(/,/g, '');
        console.log('Found data to be', data);
        const dateAsOf = new Date(Date.parse(parseDateFromHeader(header))).toISOString();
        const fullyVaccinatedCount = parseInt(data);
        const count = {
            dateAsOf: dateAsOf,
            type: 'fullyVaccinated',
            value: fullyVaccinatedCount,
        } as Count;
        console.log('Count object', count, 'will be synced');
        return count;
    } catch (e) {
        console.log('Error getting HTML content: ', e);
        throw new Error('Error getting HTML content from URL');
    }
};

export async function createOrUpdateCount(count: Count): Promise<Count> {
    return await countAccess.createOrUpdateCount(count);
};

export async function checkCountExists(count: Count): Promise<boolean> {
    return await countAccess.checkCountExists(count);
};

export function calculateHistoricals(countPartial: Count, lastCount: Count): Count {
    const percentage = calculatePercentage(countPartial.value, parseInt(populationTotal));
    if (!lastCount) {
        lastCount = {
            dateAsOf: '2021-01-27T00:00:00.000Z',
            type: 'fullyVaccinated',
            value: 50,
            percentage: 0,
            percentageChange: 0,
        }
    }
    const percentageChange = Math.round((percentage - lastCount.percentage) * 100) / 100.0;
    const percentChangeDelta = Math.round((percentageChange - lastCount.percentageChange) * 100) / 100.0;
    const daysElapsedSincePrevious = (Date.parse(countPartial.dateAsOf) - Date.parse(lastCount.dateAsOf)) / (1000 * 3600 * 24)
    const countWithHistoricals = {
        ...countPartial,
        totalPopulation: parseInt(populationTotal),
        percentage: percentage,
        dateAsOfPrevious: lastCount.dateAsOf,
        daysElapsedSincePrevious: daysElapsedSincePrevious,
        valuePrevious: lastCount.value,
        percentagePrevious: lastCount.percentage,
        percentageChange: percentageChange,
        valueChange: countPartial.value - lastCount.value,
        percentChangeDelta: percentChangeDelta,
    } as Count;
    console.log(`Calculated historicals:`, countWithHistoricals);
    return countWithHistoricals;
}

function parseDateFromHeader(header:string): string {
    const match = header.match(/Vaccination Data \(as of (\d{1,2}\s\D{3}\s\d{4})\)/)[1]
    console.log('Date read as', match);
    return match;
};

export function calculatePercentage(value: number, total?: number): number {
    const realTotal = total || parseInt(populationTotal);
    return Math.round((value / realTotal) * 10000.0) / 100;
}