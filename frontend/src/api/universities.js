import api from './axios';

export const getUniversities = async (params) => {
  const response = await api.get('/universities', { params });
  return response.data;
};

export const getPopularUniversities = async () => {
  const response = await api.get('/universities/popular');
  return response.data;
};
