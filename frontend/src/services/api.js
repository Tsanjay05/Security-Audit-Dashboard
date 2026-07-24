import axios from 'axios';

// Axios instance configured for relative paths which will resolve via the Vite local dev server proxy
const api = axios.create({
  baseURL: 'https://security-audit-dashboard-2t93.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Uploads a parsed JSON array containing logs to the backend.
 * @param {Array<Object>} logsArray - Logs to insert.
 */
export const uploadLogsBulk = async (logsArray) => {
  const response = await api.post('/logs/bulk', logsArray);
  return response.data;
};

/**
 * Fetches logs from backend using search, filter, sorting and page query options.
 * @param {Object} params - Query filters.
 */
export const getLogs = async (params) => {
  const response = await api.get('/logs', { params });
  return response.data;
};

export default api;
