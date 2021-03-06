import { Count } from '../types/Count';
import { CountCollection } from '../types/Count';
import axios from 'axios';
import { apiEndpoint } from '../config';

export async function getLatestCount(): Promise<CountCollection> {
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

export async function upsertCounts(token: string, payload: string): Promise<Count> {
    const response = await axios.put(`${apiEndpoint}/counts`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data
}

export async function recalculateAllHistoricals(token: string): Promise<any> {
    const response = await axios.patch(`${apiEndpoint}/counts/historicals`, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data
}
