import axios from 'axios';
import { Count } from 'src/models/Count'
import { CountAccess } from 'src/dataLayer/countAccess';
import { parse } from 'node-html-parser';

const statUrl = process.env.STAT_URL;

const countAccess = new CountAccess();

export async function getAllCounts(limit?: number, nextKey?: string): Promise<[Count[], any]> {
    try {
        return await countAccess.getAllCounts(limit, nextKey);
    } catch (e) {
        console.log('Failed to get all counts:', e);
    }
}

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

function parseDateFromHeader(header:string): string {
    const match = header.match(/Vaccination Data \(as of (\d{1,2}\s\D{3}\s\d{4})\)/)[1]
    console.log('Date read as', match);
    return match;
};