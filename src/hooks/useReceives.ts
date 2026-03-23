import { useState, useEffect, useMemo, useCallback } from 'react';
import { Receive } from '../types/receive';
import { receiveService } from '../services/receiveService';

export const useReceives = () => {
  const [receives, setReceives] = useState<Receive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await receiveService.getAll();
      setReceives(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch receives');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceives();
  }, [fetchReceives]);

  const totalReceived = useMemo(() => 
    receives.reduce((sum, rec) => sum + Number(rec.receive), 0), 
  [receives]);

  const addReceive = useCallback(async (receive: Omit<Receive, 'id'>) => {
    try {
      const newReceive = await receiveService.create(receive);
      setReceives(prev => [...prev, newReceive]);
    } catch (err) {
      console.error('Failed to add receive', err);
    }
  }, []);

  const updateReceive = useCallback(async (id: string, receive: Receive) => {
    try {
      const updated = await receiveService.update(id, receive);
      setReceives(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err) {
      console.error('Failed to update receive', err);
    }
  }, []);

  const deleteReceive = useCallback(async (id: string) => {
    try {
      await receiveService.delete(id);
      setReceives(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete receive', err);
    }
  }, []);

  return { receives, totalReceived, addReceive, updateReceive, deleteReceive, loading, error };
};
