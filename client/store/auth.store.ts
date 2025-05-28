// store/auth.store.ts
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";

// Define the state shape
type AuthState = {
  token: string | null;
  userDetails: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Define a persist-compatible storage adapter
const asyncStorageAdapter: PersistStorage<AuthState> = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      userDetails: null,
      login: async (email, password) => {
        const response = await api.post("api/auth/login", { email, password });
        const { token, utilizator } = response.data;

        // Set token in axios and state
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        set({
          token,
          isAuthenticated: true,
          userDetails: {
            id: utilizator.id,
            email: utilizator.email,
            firstName: utilizator.prenume,
            lastName: utilizator.nume,
            role: utilizator.rol,
          },
        });
      },

      logout: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: asyncStorageAdapter,
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${state.token}`;
        }
      },
    }
  )
);
