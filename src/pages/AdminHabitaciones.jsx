// src/pages/AdminHabitaciones.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ROOMS } from '../constants/rooms';
import { RiLockLine, RiCheckboxCircleLine, RiCloseCircleLine } from 'react-icons/ri';

const AdminHabitaciones = () => {
  const [rooms, setRooms] = useState(
    ROOMS.map((room) => ({
      ...room,
      bloqueos: [], // fechas bloqueadas { inicio, fin }
      activa: true, // true: disponible, false: en mantenimiento
    }))
  );

  const [bloqueoForm, setBloqueoForm] = useState({ roomId: null, inicio: '', fin: '' });

  const toggleActiva = (id) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, activa: !r.activa } : r)));
  };

  const addBloqueo = () => {
    if (bloqueoForm.inicio && bloqueoForm.fin && bloqueoForm.roomId) {
      setRooms(
        rooms.map((r) =>
          r.id === bloqueoForm.roomId
            ? { ...r, bloqueos: [...r.bloqueos, { inicio: bloqueoForm.inicio, fin: bloqueoForm.fin }] }
            : r
        )
      );
      setBloqueoForm({ roomId: null, inicio: '', fin: '' });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Habitaciones</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            layout
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col"
          >
            <img
              src={room.img.url}
              alt={room.name}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-bold">{room.name}</h3>
            <p className="text-sm text-gray-500">{room.tipo}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  room.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {room.activa ? 'Activa' : 'Mantenimiento'}
              </span>
              <span className="text-xs text-gray-400">${room.price.toLocaleString()} / noche</span>
            </div>

            {/* Bloqueos */}
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-1">Bloqueos temporales:</h4>
              {room.bloqueos.length === 0 ? (
                <p className="text-xs text-gray-400">Sin bloqueos</p>
              ) : (
                <ul className="text-xs space-y-1">
                  {room.bloqueos.map((b, i) => (
                    <li key={i} className="text-red-600">
                      {b.inicio} → {b.fin}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 flex gap-2 text-sm">
              <button
                onClick={() => toggleActiva(room.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                  room.activa ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}
              >
                {room.activa ? <RiCloseCircleLine /> : <RiCheckboxCircleLine />}
                {room.activa ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => setBloqueoForm({ ...bloqueoForm, roomId: room.id })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700"
              >
                <RiLockLine /> Bloquear
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal rápido para agregar bloqueo */}
      {bloqueoForm.roomId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h3 className="font-bold mb-3">Agregar Bloqueo</h3>
            <input
              type="date"
              value={bloqueoForm.inicio}
              onChange={(e) => setBloqueoForm({ ...bloqueoForm, inicio: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mb-2"
              placeholder="Inicio"
            />
            <input
              type="date"
              value={bloqueoForm.fin}
              onChange={(e) => setBloqueoForm({ ...bloqueoForm, fin: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="Fin"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBloqueoForm({ roomId: null, inicio: '', fin: '' })}
                className="px-4 py-2 text-gray-600"
              >
                Cancelar
              </button>
              <button onClick={addBloqueo} className="px-4 py-2 bg-primary text-white rounded-lg">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHabitaciones;