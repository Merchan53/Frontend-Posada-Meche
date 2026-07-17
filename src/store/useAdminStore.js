// src/store/useAdminStore.js
import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  isAuthenticated: false,
  admin: null,
  login: (credentials) => {
    // Simulación de autenticación
    if (credentials.email === 'admin@posadameche.com' && credentials.password === '123456') {
      set({ isAuthenticated: true, admin: { name: 'Administrador' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, admin: null }),
}));