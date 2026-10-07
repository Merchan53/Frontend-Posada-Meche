import { create } from 'zustand';
import { adminService } from '../services/api/adminService';

export const useAdminStore = create((set) => ({
  isAuthenticated: false,
  admin: null,
  loading: false,

  // Recibimos el objeto credentials
  login: async (credentials) => {
    set({ loading: true });
    try {
      // Pasamos el objeto directamente al servicio
      const data = await adminService.login(credentials);
      
      set({ isAuthenticated: true, admin: data.user, loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Error de conexión';
      set({ loading: false });
      return { success: false, message: errorMessage };
    }
  },

  logout: () => set({ isAuthenticated: false, admin: null }),
}));