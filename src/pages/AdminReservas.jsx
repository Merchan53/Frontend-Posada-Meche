import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RiAddLine, RiEditLine, RiRefreshLine } from 'react-icons/ri';

import { reservaService } from '../services/api/reservaService';
import { habitacionService } from '../services/api/habitacionService';
import { ReservaForm } from '../components/layout/ReservaForm';

const estados = ['Todas', 'Pendiente', 'Confirmada', 'Completada', 'Cancelada'];

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todas');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dataReservas, dataRooms] = await Promise.all([
        reservaService.getTabla(),
        habitacionService.getAll(),
      ]);
      setReservas(dataReservas);
      setRooms(dataRooms);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar las reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const filtered =
    filtroEstado === 'Todas'
      ? reservas
      : reservas.filter((r) => r.estado_nombre.toLowerCase() === filtroEstado.toLowerCase());

  const handleStatusChange = async (idReserva, newStatus) => {
    try {
      if (newStatus === 'Cancelada') {
        await reservaService.cancelar(idReserva);
      } else if (newStatus === 'Completada') {
        await reservaService.completar(idReserva);
      }
      fetchDatos();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Ocurrió un error al actualizar el estado');
    }
  };

  // --- INTEGRACIÓN DEL ENDPOINT DE CREACIÓN ---
  const handleCreateSubmit = async (payload) => {
    try {
      setSubmitting(true);
      await reservaService.crear(payload); // Envía los datos al endpoint POST /reservas
      setModalOpen(false);
      await fetchDatos(); // Recarga la tabla con los datos frescos
    } catch (err) {
      console.error('Error al crear reserva:', err);
      alert('Error al crear la reserva. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return '';
    return fechaStr.split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <button
            onClick={fetchDatos}
            className="p-2 border rounded-xl hover:bg-gray-100 text-gray-600"
            title="Recargar datos"
          >
            <RiRefreshLine size={20} />
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90"
          >
            <RiAddLine /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 flex-wrap">
        {estados.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filtroEstado === estado
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border shadow-sm">
          Cargando reservas...
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 rounded-2xl p-6 text-center border border-red-200">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                <th className="px-4 py-3 text-left font-semibold">Cédula</th>
                <th className="px-4 py-3 text-left font-semibold">Habitación(es)</th>
                <th className="px-4 py-3 text-left font-semibold">Check-in</th>
                <th className="px-4 py-3 text-left font-semibold">Check-out</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                    No hay reservas registradas en este estado.
                  </td>
                </tr>
              ) : (
                filtered.map((reserva) => (
                  <tr key={reserva.id_reserva} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{reserva.cliente_nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{reserva.cliente_cedula}</td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {reserva.habitaciones}
                    </td>
                    <td className="px-4 py-3">{formatearFecha(reserva.fecha_entrada)}</td>
                    <td className="px-4 py-3">{formatearFecha(reserva.fecha_salida)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={reserva.estado_nombre}
                        onChange={(e) => handleStatusChange(reserva.id_reserva, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer ${
                          reserva.estado_nombre === 'Completada'
                            ? 'bg-green-100 text-green-700'
                            : reserva.estado_nombre === 'Confirmada'
                            ? 'bg-blue-100 text-blue-700'
                            : reserva.estado_nombre === 'Pendiente'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Formulario */}
      <AnimatePresence>
        {modalOpen && (
          <ReservaForm
            rooms={rooms}
            isSubmitting={submitting}
            onClose={() => setModalOpen(false)}
            onSubmit={handleCreateSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReservas;