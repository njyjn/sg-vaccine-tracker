import { Count } from '../types/Count';
import axios from 'axios';
import { apiEndpoint } from '../config';

export async function getLatestCount(): Promise<Count> {
    const response = await axios.get(`${apiEndpoint}/counts/latest`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data
};

export async function getAllCounts(token: string): Promise<Count[]> {
    const response = await axios.get(`${apiEndpoint}/counts`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data.counts
}

export async function syncLatestCount(token: string): Promise<Count> {
    const response = await axios.post(`${apiEndpoint}/counts/sync`, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data
}