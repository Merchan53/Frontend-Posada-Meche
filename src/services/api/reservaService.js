import apiClient from "./apiClient";

export const reservaService = {
  // Obtener la lista agrupada para la tabla
  getTabla: async () => {
    const response = await apiClient.get('/reservas/tabla');
    return response.data;
  },

  // Cambiar estado a cancelada
  cancelar: async (idReserva, idAdmin = 1) => {
    const response = await apiClient.patch(
      `/reservas/${idReserva}/cancelar`, 
      null, 
      { params: { id_admin: idAdmin } }
    );
    return response.data;
  },

  // Cambiar estado a completada
  completar: async (idReserva, idAdmin = 1) => {
    const response = await apiClient.patch(
      `/reservas/${idReserva}/completar`, 
      null, 
      { params: { id_admin: idAdmin } }
    );
    return response.data;
  },
  crear : async (data,idAdmin = 1) => {
    const response = await apiClient.post('/reservas',data,{
      params:{ id_admin:idAdmin}
    })
    return response.data 
  }
};