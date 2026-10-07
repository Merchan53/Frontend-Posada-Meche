import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';
import { useRef } from 'react';

export const ClienteForm = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    telefono: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Rellenar datos si estamos editando (Mapeando email a correo por si acaso)
  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || '',
        cedula: initialData.cedula || '',
        correo: initialData.email || initialData.correo || '',
        telefono: initialData.telefono || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onSubmit(form);
      onClose();
      
    } catch (error) {
      console.error("Error al guardar:", error);
      
    }
    finally{
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
   
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">
            <RiCloseLine size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
          <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Cédula" required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
          <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="Correo electrónico" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded-xl font-medium transition hover:opacity-90">
            {initialData ? 'Guardar Cambios' : 'Agregar Cliente'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};