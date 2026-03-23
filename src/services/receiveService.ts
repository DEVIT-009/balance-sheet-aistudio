import { Receive } from '../types/receive';

const API_URL = '/api/receives';

export const receiveService = {
  getAll: async (): Promise<Receive[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch receives');
    return response.json();
  },
  
  create: async (receive: Omit<Receive, 'id'>): Promise<Receive> => {
    const newReceive = { ...receive, id: Date.now().toString() };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReceive),
    });
    if (!response.ok) throw new Error('Failed to create receive');
    return response.json();
  },
  
  update: async (id: string, updatedReceive: Receive): Promise<Receive> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedReceive),
    });
    if (!response.ok) throw new Error('Failed to update receive');
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete receive');
  }
};
