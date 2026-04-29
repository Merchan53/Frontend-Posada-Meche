import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  user: { nombre: '', cedula: '', email: '' },
  roomSelected: null,
  
  // Acciones
  setUser: (userData) => set({ user: userData }),
  setRoom: (room) => set({ roomSelected: room }),
  clearBooking: () => set({ roomSelected: null }),
}));