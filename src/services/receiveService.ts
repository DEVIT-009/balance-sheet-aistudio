import { Receive } from '../types/receive';
import { API_BASE_URL, getHeaders, getHeadersWithoutContentType } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/receives`;

const convertToReceive = (data: any): Receive => ({
  ...data,
  receive: Number(data.receive) || 0,
});

const convertToReceivePayload = (receive: Omit<Receive, 'id'> | Receive) => {
  const { id, ...data } = receive as any;
  return {
    ...data,
    receive: String(receive.receive),
  };
};

export const receiveService = {
  getAll: async (): Promise<Receive[]> => {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getHeadersWithoutContentType(),
    });
    if (!response.ok) throw new Error('Failed to fetch receives');
    const result = await response.json();
    const dataArray = Array.isArray(result) ? result : (result.data && Array.isArray(result.data) ? result.data : []);
    return dataArray.map(convertToReceive);
  },
  
  create: async (receive: Omit<Receive, 'id'>): Promise<Receive> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(convertToReceivePayload(receive)),
    });
    if (!response.ok) throw new Error('Failed to create receive');
    const result = await response.json();
    const data = result.data ? result.data : result;
    return convertToReceive(data);
  },
  
  update: async (id: string, updatedReceive: Receive): Promise<Receive> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(convertToReceivePayload(updatedReceive)),
    });
    if (!response.ok) throw new Error('Failed to update receive');
    const result = await response.json();
    const data = result.data ? result.data : result;
    return convertToReceive(data);
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeadersWithoutContentType(),
    });
    if (!response.ok) throw new Error('Failed to delete receive');
  }
};
