import { Count } from '../types/Count';
import get from 'axios';
import { apiEndpoint, apiToken } from '../config';

export async function getLatestCount(): Promise<Count> {
    console.log('Fetching latest count');

    const response = await get(`${apiEndpoint}/counts/latest`, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiToken,
        },
    });

    console.log('Latest count:', response.data);
    return response.data
};