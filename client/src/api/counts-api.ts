import { CountCollection } from '../types/Count';
import get from 'axios';
import { apiEndpoint } from '../config';

export async function getLatestCount(): Promise<CountCollection> {
    const response = await get(`${apiEndpoint}/counts/latest`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data
};