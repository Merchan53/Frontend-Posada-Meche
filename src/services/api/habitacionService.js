import apiClient from './apiClient';

const DEFAULT_IMG = { url: '/habitacion.jpeg', alt: 'Habitación' };
const DEFAULT_SERVICES = [{ name: 'Wifi' }, { name: 'Agua Caliente' }];

export const habitacionService = {
  // GET /habitaciones/
  getAll: async () => {
    const response = await apiClient.get('/habitaciones/');
    return response.data.map((hab) => {
      const esFamiliar = hab.capacidad > 2;
      return {
        id_habitacion: hab.id_habitacion,
        id: hab.id_habitacion,
        nombre: hab.nombre,
        descripcion: hab.descripcion,
        capacidad: hab.capacidad,
        precio_por_dia: Number(hab.precio_por_dia),
        price: Number(hab.precio_por_dia),
        tipo: esFamiliar ? 'Familiar' : 'Matrimonial',
        img: DEFAULT_IMG,
        services: DEFAULT_SERVICES,
        id_estado_habitacion: hab.id_estado_habitacion,
      };
    });
  },

  // PATCH /habitaciones/{id}
  update: async (idHabitacion, data) => {
    const payload = {};

    // Solo adjuntamos las propiedades que tengan valor
    if (data.nombre && data.nombre.trim() !== '') {
      payload.nombre = data.nombre.trim();
    }
    if (data.descripcion && data.descripcion.trim() !== '') {
      payload.descripcion = data.descripcion.trim();
    }
    if (data.capacidad !== '' && data.capacidad !== null && data.capacidad !== undefined) {
      payload.capacidad = Number(data.capacidad);
    }
    if (data.precio_por_dia !== '' && data.precio_por_dia !== null && data.precio_por_dia !== undefined) {
      payload.precio_por_dia = Number(data.precio_por_dia);
    }

    // Ejemplo de lo que se enviaría si solo cambias precio: { "precio_por_dia": 85000 }
    const response = await apiClient.patch(`/habitaciones/${idHabitacion}`, payload);
    return response.data;
  },
};