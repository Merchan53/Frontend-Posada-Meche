import apiClient from "./apiClient";

export const adminService = {
    // Usamos { email, password } para extraerlos directamente del objeto
    login: async ({ email, password }) => {
        const response = await apiClient.post('/admin/login', {
            email: email,
            password: password,
        });
        return response.data;
    }
}