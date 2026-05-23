import { createApiClient } from './createApiClient.js';

const authApi = createApiClient();

export const registerUser = async (userData) => {
  const response = await authApi.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await authApi.post('/auth/login', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await authApi.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await authApi.put('/users/profile', profileData);
  return response.data;
};

export default authApi;
