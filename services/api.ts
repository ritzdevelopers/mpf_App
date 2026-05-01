import { API_BASE_URL } from '@/constants/apiBase';
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { refreshRequest } from '@/services/authApi';
import {
  applyLoginResponse,
  applyTokenRefresh,
  clearLocalSession,
  getAccessToken,
  getRefreshToken,
} from '@/utils/authStore';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (__DEV__ && error.config) {
      console.warn('API:', error.response?.status, error.config.method, error.config.url);
    }

    const cfg = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const reqPath = `${cfg?.url ?? ''}`;
    const isAuthPath =
      reqPath.endsWith('/auth/login') ||
      reqPath.endsWith('/auth/signup') ||
      reqPath.endsWith('/auth/refresh') ||
      reqPath.endsWith('/auth/logout') ||
      reqPath.endsWith('/auth/forgot-password') ||
      reqPath.endsWith('/auth/reset-password') ||
      reqPath.includes('/auth/login?') ||
      reqPath.includes('/auth/signup?');

    if (status !== 401 || !cfg || cfg._retry || isAuthPath) {
      return Promise.reject(error);
    }

    const rt = getRefreshToken();
    if (!rt) {
      await clearLocalSession();
      return Promise.reject(error);
    }

    cfg._retry = true;

    try {
      const refreshed = await refreshRequest(rt);

      if (refreshed.user) {
        await applyLoginResponse({
          token: refreshed.token,
          refreshToken: refreshed.refreshToken,
          expiresIn: refreshed.expiresIn ?? 3_600_000,
          user: refreshed.user,
        });
      } else if (refreshed.token || refreshed.refreshToken) {
        await applyTokenRefresh({
          token: refreshed.token,
          refreshToken: refreshed.refreshToken,
        });
      } else {
        await clearLocalSession();
        return Promise.reject(error);
      }

      const newAccess = getAccessToken();
      if (!newAccess) {
        await clearLocalSession();
        return Promise.reject(error);
      }

      const headers =
        cfg.headers instanceof AxiosHeaders
          ? cfg.headers
          : AxiosHeaders.from(cfg.headers ?? {});
      headers.set('Authorization', `Bearer ${newAccess}`);
      cfg.headers = headers;

      return instance(cfg);
    } catch {
      await clearLocalSession();
      return Promise.reject(error);
    }
  },
);

export default instance;
