// src/pages/AdminContabilidad.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiFileListLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

const MOCK_FACTURAS = [
  { id: 1, reservaId: 1, cliente: 'María García', total: 150000, estado: 'PAGADA', fecha: '2026-04-15' },
  { id: 2, reservaId: 2, cliente: 'Carlos Rodríguez', total: 100000, estado: 'PENDIENTE', fecha: '2026-04-18' },
  { id: 3, reservaId: 3, cliente: 'Ana López', total: 450000, estado: 'PAGADA', fecha: '2026-04-14' },
  { id: 4, reservaId: 4, cliente: 'Pedro Martínez', total: 360000, estado: 'PENDIENTE', fecha: '2026-04-20' },
];

const MOCK_RECIBOS = [
  { id: 1, facturaId: 1, monto: 150000, metodo: 'Efectivo', fecha: '2026-04-15' },
  { id: 2, facturaId: 3, monto: 200000, metodo: 'Transferencia', fecha: '2026-04-14' },
  { id: 3, facturaId: 3, monto: 250000, metodo: 'Efectivo', fecha: '2026-04-16' },
];

const AdminContabilidad = () => {
  const [activeTab, setActiveTab] = useState('facturas');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contabilidad</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('facturas')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'facturas' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'
          }`}
        >
          <RiFileListLine className="inline mr-1" /> Facturas
        </button>
        <button
          onClick={() => setActiveTab('recibos')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'recibos' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'
          }`}
        >
          <RiMoneyDollarCircleLine className="inline mr-1" /> Recibos / Pagos
        </button>
      </div>

      {activeTab === 'facturas' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">ID Factura</th>
                <th className="px-4 py-3 text-left">Reserva</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_FACTURAS.map((factura) => (
                <tr key={factura.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">#{factura.id}</td>
                  <td className="px-4 py-3">#{factura.reservaId}</td>
                  <td className="px-4 py-3">{factura.cliente}</td>
                  <td className="px-4 py-3 font-semibold">${factura.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      factura.estado === 'PAGADA' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {factura.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">{factura.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === 'recibos' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">ID Recibo</th>
                <th className="px-4 py-3 text-left">Factura</th>
                <th className="px-4 py-3 text-left">Monto</th>
                <th className="px-4 py-3 text-left">Método</th>
                <th className="px-4 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_RECIBOS.map((recibo) => (
                <tr key={recibo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">#{recibo.id}</td>
                  <td className="px-4 py-3">#{recibo.facturaId}</td>
                  <td className="px-4 py-3 font-semibold">${recibo.monto.toLocaleString()}</td>
                  <td className="px-4 py-3">{recibo.metodo}</td>
                  <td className="px-4 py-3">{recibo.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 rounded-b-2xl">
            <p className="text-sm font-medium">
              Total recaudado: <span className="text-primary">$600,000</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminContabilidad;