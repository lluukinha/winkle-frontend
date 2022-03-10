import axios, { AxiosRequestConfig } from 'axios';
import router from '../router';
import WinkleScripts from '../scripts/WinkleScripts';
import LoginRepository from './login/LoginRepository';

// Used for Public API calls
const PublicRepository = axios.create();

const Repository = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/`,
  headers: {
    Accept: 'application/json', 'Content-Type': 'application/json',
  },
});

// Interceptors for Non Public Repository
Repository.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (LoginRepository.checkLoginTimeout()) return;
  if (LoginRepository.loginData.value && config.headers) {
    config.headers.Authorization = `Bearer ${LoginRepository.loginData.value.access_token}`;
  }
  return config;
});

Repository.interceptors.response.use(undefined, async (error) => {
  if (WinkleScripts.isLoading.value) WinkleScripts.setLoading(false);
  if (LoginRepository.checkLoginTimeout() || error.response.status === 401) router.push({ name: 'logout' });
  return Promise.reject(error);
});

export { PublicRepository, Repository };
