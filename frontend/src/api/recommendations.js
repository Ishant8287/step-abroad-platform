import api from './axios';

export const getMyRecommendations = async () => {
  const response = await api.get('/recommendations/me');
  return response.data;
};

export const getStudentRecommendations = async (studentId) => {
  const response = await api.get(`/recommendations/${studentId}`);
  return response.data;
};
