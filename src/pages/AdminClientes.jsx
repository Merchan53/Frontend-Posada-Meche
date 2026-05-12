// src/pages/AdminClientes.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiEditLine, RiDeleteBinLine, RiCloseLine } from 'react-icons/ri';

const MOCK_CLIENTS = [
  { id: 1, nombre: 'María García', cedula: '1234567890', email: 'maria@email.com', telefono: '0412-1234567' },
  { id: 2, nombre: 'Carlos Rodríguez', cedula: '0987654321', email: 'carlos@email.com', telefono: '0414-7654321' },
  { id: 3, nombre: 'Ana López', cedula: '1122334455', email: 'ana@email.com', telefono: '0424-1122334' },
  { id: 4, nombre: 'Pedro Martínez', cedula: '5544332211', email: 'pedro@email.com', telefono: '0416-9988776' },
];

const ClienteForm = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(
    initialData || { nombre: '', cedula: '', email: '', telefono: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
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
        className="bg-white rounded-2xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{initialData ? 'Editar' : 'Nuevo'} Cliente</h3>
          <button onClick={onClose}><RiCloseLine size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" required className="w-full border rounded-lg px-3 py-2" />
          <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Cédula" required className="w-full border rounded-lg px-3 py-2" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Correo" className="w-full border rounded-lg px-3 py-2" />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full border rounded-lg px-3 py-2" />
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-xl font-medium">
            {initialData ? 'Guardar Cambios' : 'Agregar Cliente'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AdminClientes = () => {
  const [clientes, setClientes] = useState(MOCK_CLIENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.cedula.includes(search)
  );

  const handleAdd = (nuevo) => {
    const id = Math.max(...clientes.map((c) => c.id), 0) + 1;
    setClientes([...clientes, { id, ...nuevo }]);
  };

  const handleUpdate = (actualizado) => {
    setClientes(clientes.map((c) => (c.id === actualizado.id ? actualizado : c)));
    setEditData(null);
  };

  const handleDelete = (id) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-64"
          />
          <button
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-xl"
          >
            <RiAddLine /> Nuevo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Cédula</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cliente.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{cliente.cedula}</td>
                <td className="px-4 py-3">{cliente.email || '-'}</td>
                <td className="px-4 py-3">{cliente.telefono || '-'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(cliente);
                      setModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-primary"
                  >
                    <RiEditLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <ClienteForm
            onClose={() => {
              setModalOpen(false);
              setEditData(null);
            }}
            onSubmit={editData ? handleUpdate : handleAdd}
            initialData={editData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminClientes;