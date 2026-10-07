import { motion } from 'framer-motion';
import { RiHotelLine, RiMoneyDollarCircleLine, RiCheckLine, RiAlertLine } from 'react-icons/ri';
import { useEffect, useMemo, useState } from 'react';

import { reservaService } from '../services/api/reservaService';
import { habitacionService } from '../services/api/habitacionService';
import { facturaService } from '../services/api/facturaService';
import { reciboService } from '../services/api/reciboService';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateRange = (fechaEntrada, fechaSalida) => {
  if (!fechaEntrada && !fechaSalida) return 'Sin fechas';

  const start = fechaEntrada ? new Date(fechaEntrada).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '--';
  const end = fechaSalida ? new Date(fechaSalida).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '--';

  return `${start} - ${end}`;
};

const getEstadoBadgeClass = (estado = '') => {
  const estadoNormalizado = String(estado).toLowerCase();

  if (estadoNormalizado.includes('cancel')) return 'bg-red-100 text-red-700';
  if (estadoNormalizado.includes('complet')) return 'bg-green-100 text-green-700';
  if (estadoNormalizado.includes('confirm')) return 'bg-blue-100 text-blue-700';
  return 'bg-yellow-100 text-yellow-700';
};

const OccupancyCard = ({ ocupadas, total }) => {
  const porcentaje = total ? Math.round((ocupadas / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Ocupación</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{porcentaje}%</h3>
          <p className="text-sm text-gray-400 mt-1">{ocupadas} de {total} habitaciones ocupadas</p>
        </div>
        <div className="w-14 h-14 rounded-full bg-primary-soft/30 flex items-center justify-center">
          <RiHotelLine className="w-7 h-7 text-primary" />
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </motion.div>
  );
};

const FinancialCard = ({ title, amount, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800 mt-1">{amount}</p>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
        {icon}
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [search, setSearch] = useState('');
  const [reservas, setReservas] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [reservasData, habitacionesData, facturasData, recibosData] = await Promise.all([
          reservaService.getTabla(),
          habitacionService.getAll(),
          facturaService.getAll(),
          reciboService.getAll(),
        ]);

        setReservas(reservasData || []);
        setHabitaciones(habitacionesData || []);
        setFacturas(facturasData || []);
        setRecibos(recibosData || []);
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const reservasRecientes = useMemo(
    () =>
      [...reservas]
        .sort((a, b) => new Date(b.fecha_entrada || 0) - new Date(a.fecha_entrada || 0))
        .slice(0, 6),
    [reservas]
  );

  const totalHabitaciones = habitaciones.length;
  const ocupadas = useMemo(
    () =>
      reservas.filter((reserva) => !['Cancelada', 'cancelada'].includes(reserva.estado_nombre || '')).length,
    [reservas]
  );

  const ingresosDelMes = useMemo(
    () =>
      facturas
        .filter((factura) => String(factura.estado_pago || '').toLowerCase() === 'pagado')
        .reduce((total, factura) => total + Number(factura.monto_factura || 0), 0),
    [facturas]
  );

  const pagosRecibidos = useMemo(
    () => recibos.reduce((total, recibo) => total + Number(recibo.valor_pagado || 0), 0),
    [recibos]
  );

  const saldoPendiente = useMemo(
    () =>
      facturas
        .filter((factura) => String(factura.estado_pago || '').toLowerCase() !== 'pagado')
        .reduce((total, factura) => total + Number(factura.monto_factura || 0), 0),
    [facturas]
  );

  const tareasPendientes = useMemo(
    () =>
      reservas
        .filter((reserva) => ['Pendiente', 'Confirmada'].includes(reserva.estado_nombre))
        .slice(0, 2)
        .map((reserva) => `${reserva.cliente_nombre} - ${reserva.habitaciones}`),
    [reservas]
  );

  const reservasFiltradas = useMemo(
    () =>
      reservasRecientes.filter((reserva) =>
        [reserva.cliente_nombre, reserva.cliente_cedula, reserva.habitaciones, reserva.estado_nombre]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [reservasRecientes, search]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
          Cargando dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="mt-3 sm:mt-0 relative">
          <input
            type="text"
            placeholder="Buscar reservas, habitaciones, clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-72 text-sm"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OccupancyCard ocupadas={ocupadas} total={totalHabitaciones || reservas.length || 1} />
        <FinancialCard
          title="Ingresos del mes"
          amount={formatCurrency(ingresosDelMes)}
          icon={<RiMoneyDollarCircleLine className="w-5 h-5 text-green-600" />}
        />
        <FinancialCard
          title="Pagos recibidos"
          amount={formatCurrency(pagosRecibidos)}
          icon={<RiCheckLine className="w-5 h-5 text-green-600" />}
        />
        <FinancialCard
          title="Saldo pendiente"
          amount={formatCurrency(saldoPendiente)}
          icon={<RiAlertLine className="w-5 h-5 text-red-600" />}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Reservas recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Cliente', 'Cédula', 'Habitación', 'Fechas', 'Estado'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-sm text-gray-500">
                    No hay reservas que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((reserva) => (
                  <tr key={reserva.id_reserva} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {reserva.cliente_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {reserva.cliente_cedula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {reserva.habitaciones}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDateRange(reserva.fecha_entrada, reserva.fecha_salida)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEstadoBadgeClass(reserva.estado_nombre)}`}>
                        {reserva.estado_nombre}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tareas pendientes</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">{tareasPendientes.length}</span>
            <span className="text-sm text-gray-500">Revisión de reservas</span>
          </div>
          <div className="mt-3 space-y-2">
            {tareasPendientes.length === 0 ? (
              <p className="text-sm text-gray-500">No hay tareas pendientes por revisar.</p>
            ) : (
              tareasPendientes.map((tarea, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  {tarea}
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
        >
          <RiHotelLine className="w-10 h-10 text-primary mb-2" />
          <p className="text-sm text-gray-500">Habitaciones registradas: {totalHabitaciones}</p>
          <p className="text-sm text-gray-500 mt-1">Reservas activas: {ocupadas}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;