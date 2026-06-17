import { create } from "zustand";
import api from "./api";

interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem("accessToken", token);
    set({ user, accessToken: token, isLoading: false });
  },

  logout: async () => {
    try {
      await api.delete("/auth/logout");
    } catch {}
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null, isLoading: false });
    window.location.href = "/login";
  },

  refresh: async () => {
    try {
      const { data } = await api.post("/auth/refresh");
      const { accessToken, user } = data.data;
      localStorage.setItem("accessToken", accessToken);
      set({ user, accessToken, isLoading: false });
    } catch {
      localStorage.removeItem("accessToken");
      set({ user: null, accessToken: null, isLoading: false });
    }
  },
}));
