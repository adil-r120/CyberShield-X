import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanUrl = async (url: string) => {
  const response = await api.post('/scan-url', { url });
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard-stats');
  return response.data;
};

export const getRecentScans = async () => {
  const response = await api.get('/recent-scans');
  return response.data;
};

export const getAttackDistribution = async () => {
  const response = await api.get('/attack-distribution');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};
