import api from './axios';

export const getPrograms = async (params) => {
  const response = await api.get('/programs', { params });
  return response.data;
};
