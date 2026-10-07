import apiClient from "./apiClient";

export const clientService = {
    // Obtener todos
    getAll: async ()=>{
        const response = await apiClient.get('/clientes/')
        return response.data
    },

    create: async (data) => {
        const response =await apiClient.post('/clientes/create',data)
        return response.data;
    },

    // DELETE: Eliminar cliente
    delete: async (cedula) => {
        const response = await apiClient.delete(`/clientes/${cedula}`);
        return response.data;
    },

    update: async(id,data)=>{
        const response = await apiClient.patch(`/clientes/${id}/actualizar`,data)
        return response.data
    }

}