// src/pages/AdminDashboard.jsx
import { motion } from 'framer-motion';
import { RiHotelLine, RiMoneyDollarCircleLine, RiCheckLine, RiAlertLine } from 'react-icons/ri';
import { useState } from 'react';

const MOCK_RESERVATIONS = [
  {
    cliente: 'Maria García',
    cedula: '1234567890',
    habitacion: 'Habitación Doble 101',
    fechas: '15 Abr - 18 Abr',
    total: '$360,000',
    estado: 'PAGADA',
  },
  {
    cliente: 'Carlos Rodríguez',
    cedula: '0987654321',
    habitacion: 'Habitación Ejecutiva 103',
    fechas: '18 Abr - 20 Abr',
    total: '$300,000',
    estado: 'CONFIRMADA',
  },
  {
    cliente: 'Ana López',
    cedula: '1122334455',
    habitacion: 'Habitación Familiar 203',
    fechas: '14 Abr - 17 Abr',
    total: '$540,000',
    estado: 'PAGADA',
  },
  {
    cliente: 'Pedro Martínez',
    cedula: '5544332211',
    habitacion: 'Habitación Doble 102',
    fechas: '20 Abr - 23 Abr',
    total: '$360,000',
    estado: 'PENDIENTE',
  },
];

const OccupancyCard = () => {
  const ocupadas = 3;
  const total = 6;
  const porcentaje = Math.round((ocupadas / total) * 100);

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
      {/* Barra de progreso */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </motion.div>
  );
};

const FinancialCard = ({ title, amount, percentage, increased, icon }) => (
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
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${increased ? 'bg-green-100' : 'bg-red-100'}`}>
        {icon}
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1">
      <span className={`text-xs font-medium ${increased ? 'text-green-600' : 'text-red-600'}`}>
        {increased ? '+' : '-'}{percentage}
      </span>
      <span className="text-xs text-gray-400">vs mes pasado</span>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [search, setSearch] = useState('');

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

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OccupancyCard />
        <FinancialCard
          title="Ingresos del mes"
          amount="$3.8M"
          percentage="12%"
          increased={true}
          icon={<RiMoneyDollarCircleLine className="w-5 h-5 text-green-600" />}
        />
        <FinancialCard
          title="Pagos recibidos"
          amount="$2.9M"
          percentage="15%"
          increased={true}
          icon={<RiCheckLine className="w-5 h-5 text-green-600" />}
        />
        <FinancialCard
          title="Saldo pendiente"
          amount="$0.9M"
          percentage="5%"
          increased={false}
          icon={<RiAlertLine className="w-5 h-5 text-red-600" />}
        />
      </div>

      {/* Tabla de reservas recientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Reservas Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Cliente', 'Cédula', 'Habitación', 'Fechas', 'Total', 'Estado'].map((header) => (
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
              {MOCK_RESERVATIONS.filter((r) =>
                Object.values(r).some((val) =>
                  val.toLowerCase().includes(search.toLowerCase())
                )
              ).map((reserva, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{reserva.cliente}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reserva.cedula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reserva.habitacion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reserva.fechas}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{reserva.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        reserva.estado === 'PAGADA'
                          ? 'bg-green-100 text-green-700'
                          : reserva.estado === 'CONFIRMADA'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tareas pendientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tareas Pendientes</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">4</span>
            <span className="text-sm text-gray-500">2 de alta prioridad</span>
          </div>
          <div className="mt-3 space-y-2">
            {['Confirmar reserva de Pedro Martínez', 'Actualizar disponibilidad habitación 103'].map((tarea, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                {tarea}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center"
        >
          <RiHotelLine className="w-10 h-10 text-primary mb-2" />
          <p className="text-sm text-gray-500">Próximamente: reportes avanzados</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;