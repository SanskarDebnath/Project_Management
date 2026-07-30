import { create } from 'zustand';
import { decodeJWT, isTokenExpired } from '../lib/jwt';
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY, ACTIVE_ROLE_KEY, ManagementRole } from '../lib/constants';
import { ManagementUser } from '../types';

interface AuthState {
  token: string | null;
  user: ManagementUser | null;
  activeRole: ManagementRole;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthActions {
  login: (token: string, user: ManagementUser) => void;
  logout: () => void;
  setActiveRole: (role: ManagementRole) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  token: null,
  user: null,
  activeRole: ManagementRole.APPROVER,
  isAuthenticated: false,
  loading: true,

  login: (token: string, user: ManagementUser) => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, token);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    sessionStorage.setItem(ACTIVE_ROLE_KEY, user.role);
    set({ token, user, activeRole: user.role, isAuthenticated: true, loading: false });
  },

  logout: () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(ACTIVE_ROLE_KEY);
    set({ token: null, user: null, isAuthenticated: false, loading: false });
  },

  setActiveRole: (role: ManagementRole) => {
    sessionStorage.setItem(ACTIVE_ROLE_KEY, role);
    set({ activeRole: role });
  },

  hydrate: () => {
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY);
    const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
    const storedRole = sessionStorage.getItem(ACTIVE_ROLE_KEY) as ManagementRole;
    const user: ManagementUser | null = storedUser ? JSON.parse(storedUser) : null;
    const expired = token ? isTokenExpired(token) : true;

    if (expired && token) {
      sessionStorage.clear();
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    } else if (token && user) {
      set({ token, user, activeRole: storedRole || user.role, isAuthenticated: true, loading: false });
    } else {
      set({ token: null, user: null, isAuthenticated: false, loading: false });
    }
  },
}));
