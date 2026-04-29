/** Shapes aligned with POST /auth/login and POST /auth/signup responses */

export type ApiUser = {
  id: number;
  fullName?: string;
  email: string;
  phone?: string;
  verified?: boolean;
};

export type LoginResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: ApiUser;
};

/** POST /auth/refresh may omit `user`; prefer full LoginResponse when present */
export type RefreshResponse = {
  token: string;
  refreshToken: string;
  expiresIn?: number;
  user?: ApiUser;
};
