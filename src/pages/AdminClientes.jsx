import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri';
import { clientService } from '../services/api/clienteService';
import { ClienteForm } from '../components/layout/ClienteForm';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');

  const fetchClientes = async () => {
    try {
      const data = await clientService.getAll();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filtered = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.cedula.includes(search)
  );

  // Manejador unificado para Crear o Actualizar de forma limpia
  const handleSaveSubmit = async (formData) => {
    try {
      if (editData) {
        // Actualizar usando el ID del cliente que estamos editando
        await clientService.update(editData.id_cliente, formData);
      } else {
        // Crear nuevo
        await clientService.create(formData);
      }
      fetchClientes();
    } catch (error) {
      alert(editData ? "No se pudo actualizar" : "No se pudo crear el cliente");
      console.error(error);
    }
  };

  const handleDelete = async (cedula) => {
    if (window.confirm("¿Seguro que deseas eliminar?")) {
      try {
        await clientService.delete(cedula);
        fetchClientes();
      } catch (error) {
        alert("Error al eliminar");
        console.error(error);
      }
    }
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
            className="border rounded-lg px-3 py-2 text-sm w-64 outline-none"
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
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Cédula</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Teléfono</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((cliente) => (
              <tr key={cliente.id_cliente} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{cliente.id_cliente}</td>
                <td className="px-4 py-3 font-medium">{cliente.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{cliente.cedula}</td>
                <td className="px-4 py-3">{cliente.email || cliente.correo || '-'}</td>
                <td className="px-4 py-3">{cliente.telefono || '-'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(cliente);
                      setModalOpen(true);
                    }}
                    className="text-gray-400 hover:text-primary transition"
                  >
                    <RiEditLine size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.cedula)}
                    className="text-gray-400 hover:text-red-500 transition"
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
            onSubmit={handleSaveSubmit}
            initialData={editData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminClientes;