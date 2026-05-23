import { createApiClient } from './createApiClient.js';
import { API_BASE_URL } from '../utils/apiConfig.js';

const userApi = createApiClient(`${API_BASE_URL}/users`);

export const fetchUserProfile = async (username) => {
  const { data } = await userApi.get(`/${username}`);
  return data.data;
};

export const followUser = async (username) => {
  const { data } = await userApi.post(`/${username}/follow`);
  return data;
};

export const unfollowUser = async (username) => {
  const { data } = await userApi.delete(`/${username}/follow`);
  return data;
};

export default userApi;
