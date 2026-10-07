// src/pages/AdminContabilidad.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiFileListLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { facturaService } from '../services/api/facturaService';
import { reciboService } from '../services/api/reciboService';

const AdminContabilidad = () => {
  const [activeTab, setActiveTab] = useState('facturas');
  const [facturas, setFacturas] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [pagoForm, setPagoForm] = useState({
    metodo_pago: 'Efectivo',
    valor_pagado: '',
  });
  const [errorPago, setErrorPago] = useState('');
  const [enviandoPago, setEnviandoPago] = useState(false);

  const fetchReportes = async () => {
    try {
      const reportes = await facturaService.getAll();
      setFacturas([...reportes].sort((a, b) => a.id_factura - b.id_factura));
    } catch (error) {
      console.error('Error al cargar facturas', error);
    }
  };

  const fetchRecibos = async () => {
    try {
      const recibosData = await reciboService.getAll();
      setRecibos([...recibosData].sort((a, b) => a.id_recibo - b.id_recibo));
    } catch (error) {
      console.log('Error al cargar recibos', error);
    }
  };

  useEffect(() => {
    fetchReportes();
    fetchRecibos();
  }, []);

  const abrirFormularioPago = (factura) => {
    setFacturaSeleccionada(factura);
    setPagoForm({
      metodo_pago: 'Efectivo',
      valor_pagado: factura.monto_factura || '',
    });
    setErrorPago('');
  };

  const cerrarFormularioPago = () => {
    setFacturaSeleccionada(null);
    setPagoForm({ metodo_pago: 'Efectivo', valor_pagado: '' });
    setErrorPago('');
  };

  const handlePagoSubmit = async (event) => {
    event.preventDefault();

    if (!facturaSeleccionada) return;

    const valorPagado = Number(pagoForm.valor_pagado);

    if (!pagoForm.metodo_pago || !pagoForm.valor_pagado || Number.isNaN(valorPagado) || valorPagado <= 0) {
      setErrorPago('Ingresa un monto válido para el pago.');
      return;
    }

    if (valorPagado > Number(facturaSeleccionada.monto_factura)) {
      setErrorPago('El valor pagado no puede superar el total de la factura.');
      return;
    }

    try {
      setEnviandoPago(true);
      setErrorPago('');

      await facturaService.pagarFactura({
        id_factura: facturaSeleccionada.id_factura,
        metodo_pago: pagoForm.metodo_pago,
        valor_pagado: valorPagado,
      });

      cerrarFormularioPago();
      await fetchReportes();
      await fetchRecibos();
    } catch (error) {
      console.error('Error al registrar pago', error);
      setErrorPago('No se pudo registrar el pago. Revisa los datos o intenta nuevamente.');
    } finally {
      setEnviandoPago(false);
    }
  };

  const totalRecaudado = recibos.reduce((total, recibo) => total + Number(recibo.valor_pagado || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contabilidad</h1>

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
                <th className="px-4 py-3 text-left">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {facturas.map((factura) => {
                const estadoPago = String(factura.estado_pago || '').toLowerCase();

                return (
                  <>
                    <tr key={factura.id_factura} className="hover:bg-gray-50 align-top">
                      <td className="px-4 py-3 font-mono">#{factura.id_factura}</td>
                      <td className="px-4 py-3">#{factura.id_reserva}</td>
                      <td className="px-4 py-3">{factura.cliente_nombre}</td>
                      <td className="px-4 py-3 font-semibold">${Number(factura.monto_factura || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          estadoPago === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {factura.estado_pago}
                        </span>
                      </td>
                      <td className="px-4 py-3">{factura.fecha_entrada}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => abrirFormularioPago(factura)}
                          disabled={estadoPago === 'pagado'}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                            estadoPago === 'pagado'
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-primary text-white hover:bg-opacity-90'
                          }`}
                        >
                          {estadoPago === 'pagado' ? 'Pagada' : 'Pagar factura'}
                        </button>
                      </td>
                    </tr>

                    {facturaSeleccionada && facturaSeleccionada.id_factura === factura.id_factura && (
                      <tr key={`${factura.id_factura}-form`}>
                        <td colSpan="7" className="px-4 py-4 bg-gray-50">
                          <form onSubmit={handlePagoSubmit} className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Factura</label>
                                <input
                                  type="text"
                                  value={`#${facturaSeleccionada.id_factura}`}
                                  disabled
                                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
                                />
                              </div>

                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Método de pago</label>
                                <select
                                  value={pagoForm.metodo_pago}
                                  onChange={(event) => setPagoForm({ ...pagoForm, metodo_pago: event.target.value })}
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                >
                                  <option value="Efectivo">Efectivo</option>
                                  <option value="Transferencia">Transferencia</option>
                                  <option value="Tarjeta">Tarjeta</option>
                                  <option value="Nequi">Nequi</option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Valor pagado</label>
                                <input
                                  type="number"
                                  value={pagoForm.valor_pagado}
                                  onChange={(event) => setPagoForm({ ...pagoForm, valor_pagado: event.target.value })}
                                  placeholder="0"
                                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                                />
                              </div>
                            </div>

                            {errorPago && (
                              <p className="mt-3 text-sm text-red-600">{errorPago}</p>
                            )}

                            <div className="mt-4 flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={cerrarFormularioPago}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                disabled={enviandoPago}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {enviandoPago ? 'Guardando...' : 'Registrar pago'}
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
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
              {recibos.map((recibo) => (
                <tr key={recibo.id_recibo} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">#{recibo.id_recibo}</td>
                  <td className="px-4 py-3">#{recibo.id_factura}</td>
                  <td className="px-4 py-3 font-semibold">${Number(recibo.valor_pagado || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{recibo.metodo_pago}</td>
                  <td className="px-4 py-3">{recibo.fecha_pago}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 rounded-b-2xl">
            <p className="text-sm font-medium">
              Total recaudado: <span className="text-primary">${totalRecaudado.toLocaleString()}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminContabilidad;