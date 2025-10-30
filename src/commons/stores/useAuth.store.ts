import { create } from 'zustand';

export interface LoggedInUser {
  _id: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  user: LoggedInUser | null;
  setAccessToken: (token: string) => void;
  setUser: (user: LoggedInUser | null) => void;
  setAuth: (token: string | null, user: LoggedInUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token: string) => set({ accessToken: token }),
  setUser: (user: LoggedInUser | null) => set({ user }),
  setAuth: (token: string | null, user: LoggedInUser | null) => set({ accessToken: token, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));

export default useAuthStore;


