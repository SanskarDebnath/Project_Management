import { create } from 'zustand';
import { decodeJWT, isTokenExpired } from '../lib/jwt';
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY } from '../lib/constants';
import { EmployeeUser } from '../types';

interface AuthState {
  token: string | null;
  user: EmployeeUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthActions {
  login: (token: string, user: EmployeeUser) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  loading: true,

  login: (token: string, user: EmployeeUser) => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, token);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set({ token, user, isAuthenticated: true, loading: false });
  },

  logout: () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false, loading: false });
  },

  hydrate: () => {
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY);
    const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
    const user: EmployeeUser | null = storedUser ? JSON.parse(storedUser) : null;
    const expired = token ? isTokenExpired(token) : true;

    if (expired && token) {
      sessionStorage.clear();
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    } else if (token && user) {
      set({ token, user, isAuthenticated: true, loading: false });
    } else {
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    }
  },
}));
