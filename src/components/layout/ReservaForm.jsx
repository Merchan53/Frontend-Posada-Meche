import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiCloseLine, RiUserAddLine, RiUserSearchLine } from "react-icons/ri";
import { clientService } from "../../services/api/clienteService";

export const ReservaForm = ({
  onClose,
  onSubmit,
  isSubmitting,
  rooms = [],
}) => {
  // Función aux para formatear fechas a "YYYY-MM-DDTHH:mm" (formato que exige <input type="datetime-local" />)
  const getTodayWithTime = (hours) => {
    const now = new Date();
    now.setHours(hours, 0, 0, 0);
    // Ajuste offset local para que el input muestre la hora correcta local
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  // Estado del formulario
  const [form, setForm] = useState({
    id_cliente: "",
    id_habitacion: "",
    cantidad_huespedes: 1,
    checkin: getTodayWithTime(14), // Por defecto hoy a las 14:00 (2:00 PM)
    checkout: getTodayWithTime(11), // Por defecto hoy a las 11:00 AM
  });
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  // Modo para seleccionar cliente existente o crear uno nuevo en el acto
  const [modoCliente, setModoCliente] = useState("existente"); // 'existente' | 'nuevo'
  const [loadingNuevoCliente, setLoadingNuevoCliente] = useState(false);
  const [errorCliente, setErrorCliente] = useState(null);

  // Datos para registrar un cliente sobre la marcha
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
  });

  // 1. Cargar clientes existentes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoadingClientes(true);
        const data = await clientService.getAll();
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoadingClientes(false);
      }
    };
    fetchClientes();
  }, []);

  // 2. Seleccionar la primera habitación por defecto
  useEffect(() => {
    if (rooms.length > 0 && !form.id_habitacion) {
      setForm((prev) => ({ ...prev, id_habitacion: rooms[0].id }));
    }
  }, [rooms]);

  // 3. Valores derivados
  const selectedCliente = clientes.find(
    (c) => String(c.id_cliente) === String(form.id_cliente),
  );
  const selectedRoom = rooms.find(
    (r) => String(r.id) === String(form.id_habitacion),
  );

  const calcularNoches = () => {
    if (!form.checkin || !form.checkout) return 0;
    const diff = new Date(form.checkout) - new Date(form.checkin);
    const noches = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return noches > 0 ? noches : 0;
  };

  const noches = calcularNoches();
  const totalEstimado = selectedRoom ? selectedRoom.price * (noches || 1) : 0;

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNuevoClienteChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Submit unificado
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCliente(null);

    if (!selectedRoom) {
      alert("Por favor selecciona una habitación válida.");
      return;
    }

    let clientId = form.id_cliente;

    // --- PASO 1: Si es un nuevo cliente, lo creamos primero ---
    if (modoCliente === "nuevo") {
      try {
        setLoadingNuevoCliente(true);
        const createdClient = await clientService.create(nuevoCliente);

        // Obtenemos el ID retornado por la API
        clientId = createdClient?.id_cliente || createdClient?.id;

        if (!clientId) {
          throw new Error("La API de clientes no retornó un ID válido.");
        }
      } catch (err) {
        console.error("Error al crear el cliente:", err);
        setErrorCliente(
          "No se pudo registrar el cliente. Revisa si la cédula ya existe.",
        );
        setLoadingNuevoCliente(false);
        return;
      } finally {
        setLoadingNuevoCliente(false);
      }
    } else if (!clientId) {
      alert("Por favor selecciona un cliente registrado.");
      return;
    }

    // --- PASO 2: Construimos el payload de la reserva ---
    const payload = {
      id_cliente: Number(clientId),
      cantidad_huespedes: Number(form.cantidad_huespedes),
      fecha_entrada: new Date(form.checkin).toISOString(),
      fecha_salida: new Date(form.checkout).toISOString(),
      habitaciones: [
        {
          id_habitacion: Number(selectedRoom.id),
          precio_unitario: Number(selectedRoom.price),
        },
      ],
    };

    // --- PASO 3: Enviamos la reserva al padre ---
    onSubmit(payload);
  };

  const isProcessing = isSubmitting || loadingNuevoCliente;

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
          <h3 className="text-xl font-bold">Nueva Reserva</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Modo: Cliente Existente / Nuevo Cliente */}
          <div className="flex border rounded-xl p-1 bg-gray-50">
            <button
              type="button"
              onClick={() => {
                setModoCliente("existente");
                setErrorCliente(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                modoCliente === "existente"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <RiUserSearchLine size={16} /> Cliente Registrado
            </button>
            <button
              type="button"
              onClick={() => {
                setModoCliente("nuevo");
                setErrorCliente(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                modoCliente === "nuevo"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <RiUserAddLine size={16} /> + Registrar Nuevo
            </button>
          </div>

          {/* MENSAJE DE ERROR SI FALLA EL REGISTRO DEL CLIENTE */}
          {errorCliente && (
            <div className="text-xs bg-red-50 text-red-600 p-2.5 rounded-lg border border-red-200">
              {errorCliente}
            </div>
          )}

          {/* OPCIÓN A: Cliente Existente */}
          {modoCliente === "existente" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Seleccionar Cliente
              </label>
              <select
                name="id_cliente"
                value={form.id_cliente}
                onChange={handleChange}
                disabled={loadingClientes}
                required={modoCliente === "existente"}
                className="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">-- Selecciona un cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre} (V-{c.cedula})
                  </option>
                ))}
              </select>

              {selectedCliente && (
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg text-gray-600 mt-2">
                  <p>
                    <span className="font-semibold">Nombre:</span>{" "}
                    {selectedCliente.nombre}
                  </p>
                  <p>
                    <span className="font-semibold">Cédula:</span>{" "}
                    {selectedCliente.cedula}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* OPCIÓN B: Formulario In-line para Nuevo Cliente */}
          {modoCliente === "nuevo" && (
            <div className="space-y-3 bg-gray-50 p-3 rounded-xl border">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Datos del nuevo cliente
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoCliente.nombre}
                    onChange={handleNuevoClienteChange}
                    required={modoCliente === "nuevo"}
                    placeholder="Ej. Juan Pérez"
                    className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Cédula
                  </label>
                  <input
                    type="text"
                    name="cedula"
                    value={nuevoCliente.cedula}
                    onChange={handleNuevoClienteChange}
                    required={modoCliente === "nuevo"}
                    placeholder="Ej. 12345678"
                    className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={nuevoCliente.email}
                    onChange={handleNuevoClienteChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={nuevoCliente.telefono}
                    onChange={handleNuevoClienteChange}
                    placeholder="0414-1234567"
                    className="w-full border rounded-lg px-2.5 py-1.5 text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Habitación y Huéspedes */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Habitación
              </label>
              <select
                name="id_habitacion"
                value={form.id_habitacion}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nombre || room.name} - ${room.price} / noche
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Huéspedes
              </label>
              <input
                type="number"
                name="cantidad_huespedes"
                min="1"
                value={form.cantidad_huespedes}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Fechas */}
          {/* Fechas y Horas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Check-in (Fecha y Hora)
              </label>
              <input
                type="datetime-local"
                name="checkin"
                value={form.checkin}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Check-out (Fecha y Hora)
              </label>
              <input
                type="datetime-local"
                name="checkout"
                value={form.checkout}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Total Estimado */}
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Total ({noches} noches):
            </span>
            <span className="font-bold text-lg text-primary">
              ${totalEstimado.toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loadingNuevoCliente
              ? "Registrando cliente..."
              : isSubmitting
                ? "Guardando reserva..."
                : "Crear Reserva"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
