import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';

const HabitacionForm = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    capacidad: initialData?.capacidad || '',
    precio_por_dia: initialData?.precio_por_dia || initialData?.price || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">
            Editar Habitación #{initialData?.id_habitacion}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <RiCloseLine size={24} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Modifica solo los campos que deseas actualizar. Puedes dejar el resto en blanco.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Habitación
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder={`Actual: ${initialData?.nombre || ''}`}
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
              placeholder={`Actual: ${initialData?.descripcion || ''}`}
              className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad (personas)
              </label>
              <input
                type="number"
                name="capacidad"
                min="1"
                max="20"
                value={form.capacidad}
                onChange={handleChange}
                placeholder={`Actual: ${initialData?.capacidad || 2}`}
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio por día ($)
              </label>
              <input
                type="number"
                name="precio_por_dia"
                min="0"
                step="1000"
                value={form.precio_por_dia}
                onChange={handleChange}
                placeholder={`Actual: ${initialData?.precio_por_dia || ''}`}
                className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-sm"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HabitacionForm;
export { HabitacionForm };