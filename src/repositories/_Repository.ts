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
  const isJwtExpired = !LoginRepository.canUseLoginInfo();
  if (isJwtExpired) return;
  const login = LoginRepository.loginData();
  if (login && config.headers) config.headers.Authorization = `Bearer ${login.access_token}`;
  return config;
});

Repository.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    if (WinkleScripts.isLoading.value) WinkleScripts.setLoading(false);
    router.push({ name: 'logout' });
  }
  return Promise.reject(error);
});

export { PublicRepository, Repository };
