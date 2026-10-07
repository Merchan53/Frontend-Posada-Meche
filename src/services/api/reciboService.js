import apiClient from './apiClient';

export const reciboService ={
    getAll: async()=>{
        const response = await apiClient.get('/recibos')
        return response.data
    }

};