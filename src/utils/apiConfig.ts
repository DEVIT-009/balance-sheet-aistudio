export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const getHeadersWithoutContentType = () => ({});
