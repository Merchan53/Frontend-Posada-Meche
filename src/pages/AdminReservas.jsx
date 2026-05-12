// src/pages/AdminReservas.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiAddLine, RiEditLine, RiCloseLine } from 'react-icons/ri';
import { ROOMS } from '../constants/rooms';

// Datos mock iniciales
const MOCK_RESERVATIONS = [
  {
    id: 1,
    cliente: 'María García',
    cedula: '1234567890',
    habitacion: 'Melania - Matrimonial',
    checkin: '2026-04-15',
    checkout: '2026-04-18',
    total: 150000,
    estado: 'PAGADA',
  },
  {
    id: 2,
    cliente: 'Carlos Rodríguez',
    cedula: '0987654321',
    habitacion: 'Johann - Matrimonial',
    checkin: '2026-04-18',
    checkout: '2026-04-20',
    total: 100000,
    estado: 'CONFIRMADA',
  },
  {
    id: 3,
    cliente: 'Ana López',
    cedula: '1122334455',
    habitacion: 'Antonio - Familiar (5 personas)',
    checkin: '2026-04-14',
    checkout: '2026-04-17',
    total: 450000,
    estado: 'PAGADA',
  },
  {
    id: 4,
    cliente: 'Pedro Martínez',
    cedula: '5544332211',
    habitacion: 'Liseth - Matrimonial',
    checkin: '2026-04-20',
    checkout: '2026-04-23',
    total: 360000,
    estado: 'PENDIENTE',
  },
];

const estados = ['Todas', 'PENDIENTE', 'CONFIRMADA', 'PAGADA', 'CANCELADA'];

const ReservaForm = ({ onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      cliente: '',
      cedula: '',
      habitacion: ROOMS[0]?.name || '',
      checkin: '',
      checkout: '',
      total: 0,
      estado: 'PENDIENTE',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    if (form.checkin && form.checkout && form.habitacion) {
      const room = ROOMS.find((r) => r.name === form.habitacion);
      if (room) {
        const nights = Math.ceil(
          (new Date(form.checkout) - new Date(form.checkin)) / (1000 * 60 * 60 * 24)
        );
        return room.price * (nights > 0 ? nights : 1);
      }
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    onSubmit({ ...form, total });
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{initialData ? 'Editar' : 'Nueva'} Reserva</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <RiCloseLine size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <input name="cliente" value={form.cliente} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cédula</label>
            <input name="cedula" value={form.cedula} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="Número de cédula" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Habitación</label>
            <select name="habitacion" value={form.habitacion} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2">
              {ROOMS.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name} - ${room.price} / noche
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Check-in</label>
              <input type="date" name="checkin" value={form.checkin} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check-out</label>
              <input type="date" name="checkout" value={form.checkout} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total estimado: <span className="font-bold text-primary">${calculateTotal().toLocaleString()}</span></p>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-xl font-medium hover:bg-primary/90">
            {initialData ? 'Guardar Cambios' : 'Crear Reserva'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AdminReservas = () => {
  const [reservas, setReservas] = useState(MOCK_RESERVATIONS);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const filtered = filtroEstado === 'Todas' ? reservas : reservas.filter((r) => r.estado === filtroEstado);

  const handleAdd = (newReserva) => {
    const newId = Math.max(...reservas.map((r) => r.id), 0) + 1;
    setReservas([...reservas, { id: newId, ...newReserva }]);
  };

  const handleEdit = (reserva) => {
    setEditData(reserva);
    setModalOpen(true);
  };

  const handleUpdate = (updated) => {
    setReservas(reservas.map((r) => (r.id === updated.id ? updated : r)));
    setEditData(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setReservas(reservas.map((r) => (r.id === id ? { ...r, estado: newStatus } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90"
        >
          <RiAddLine /> Nueva Reserva
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {estados.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              filtroEstado === estado ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Cédula</th>
              <th className="px-4 py-3 text-left">Habitación</th>
              <th className="px-4 py-3 text-left">Check-in</th>
              <th className="px-4 py-3 text-left">Check-out</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{reserva.cliente}</td>
                <td className="px-4 py-3 text-gray-600">{reserva.cedula}</td>
                <td className="px-4 py-3">{reserva.habitacion}</td>
                <td className="px-4 py-3">{reserva.checkin}</td>
                <td className="px-4 py-3">{reserva.checkout}</td>
                <td className="px-4 py-3 font-semibold">${reserva.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <select
                    value={reserva.estado}
                    onChange={(e) => handleStatusChange(reserva.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                      reserva.estado === 'PAGADA'
                        ? 'bg-green-100 text-green-700'
                        : reserva.estado === 'CONFIRMADA'
                        ? 'bg-blue-100 text-blue-700'
                        : reserva.estado === 'PENDIENTE'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="CONFIRMADA">CONFIRMADA</option>
                    <option value="PAGADA">PAGADA</option>
                    <option value="CANCELADA">CANCELADA</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEdit(reserva)}
                    className="text-gray-400 hover:text-primary p-1"
                  >
                    <RiEditLine size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <ReservaForm
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

export default AdminReservas;