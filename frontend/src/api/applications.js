import api from './axios';

export const getApplications = async (params) => {
  const response = await api.get('/applications', { params });
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const updateApplicationStatus = async (id, status, comments) => {
  const response = await api.patch(`/applications/${id}/status`, { status, comments });
  return response.data;
};
