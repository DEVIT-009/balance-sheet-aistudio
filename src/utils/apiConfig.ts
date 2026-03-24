export const API_BASE_URL = import.meta.env.VITE_B_NIN_API_BASE_URL;

export const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const getHeadersWithoutContentType = () => ({});
