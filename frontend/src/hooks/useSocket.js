import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDataStore } from '../stores/dataStore.js';

let socket;

export function useSocket() {
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const base = API.replace(/\/api\/?$/, '');
    socket = io(base, { transports: ['websocket'], withCredentials: true });

    socket.on('connect', () => {
      console.log('Socket connected', socket.id);
    });

    socket.on('indices_update', (data) => {
      useDataStore.getState().setIndices(data);
    });

    socket.on('quotes_update', (data) => {
      useDataStore.getState().setQuotes(data);
    });

    socket.on('gmp_update', (data) => {
      // store gmp results in dataStore.news for now
      useDataStore.getState().setNews((prev) => {
        const merged = Array.isArray(prev) ? [...prev] : [];
        merged.unshift({ type: 'gmp', data, ts: Date.now() });
        return merged.slice(0, 200);
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
}
