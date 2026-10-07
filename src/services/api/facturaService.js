import apiClient from "./apiClient";

export const facturaService = {
    getAll: async () => {
        const response = await apiClient.get('/reservas/facturas/reporte');
        return response.data;
    },

    pagarFactura: async ({ id_factura, metodo_pago, valor_pagado }) => {
        const response = await apiClient.post(`/recibos/pagar`, {
            id_factura,
            metodo_pago,
            valor_pagado,
        });
        return response.data;
    }
};