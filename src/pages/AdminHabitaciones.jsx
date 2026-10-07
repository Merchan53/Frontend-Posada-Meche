import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiEditLine, RiRefreshLine, RiUserLine } from 'react-icons/ri';
import { habitacionService } from '../services/api/habitacionService';
import HabitacionForm from '../components/layout/HabitacionForm';

const AdminHabitaciones = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await habitacionService.getAll();
      setRooms(data);
    } catch (err) {
      console.error('Error al obtener habitaciones:', err);
      setError('No se pudieron cargar las habitaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setModalOpen(true);
  };

  const handleSaveSubmit = async (formData) => {
    try {
      await habitacionService.update(selectedRoom.id_habitacion, formData);
      setModalOpen(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (err) {
      console.error('Error al actualizar habitación:', err);
      alert('Error al actualizar los datos de la habitación');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Habitaciones</h1>
          <p className="text-sm text-gray-500">Configura precios, nombres y capacidad de las habitaciones</p>
        </div>
        <button
          onClick={fetchRooms}
          className="p-2 border rounded-xl hover:bg-gray-100 text-gray-600 transition"
          title="Recargar habitaciones"
        >
          <RiRefreshLine size={20} />
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border shadow-sm">
          Cargando habitaciones...
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 rounded-2xl p-6 text-center border border-red-200">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <motion.div
              key={room.id_habitacion}
              layout
              className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col justify-between"
            >
              <div>
                <img
                  src={room.img.url}
                  alt={room.nombre}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">{room.nombre}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-50 text-blue-700">
                    {room.tipo}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{room.descripcion}</p>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg">
                    <RiUserLine size={14} /> Capacidad: {room.capacidad} pers.
                  </span>
                  <span className="font-bold text-primary text-sm">
                    ${room.price.toLocaleString()} / día
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t flex justify-end">
                <button
                  onClick={() => handleEdit(room)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  <RiEditLine size={16} /> Editar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Al pasar la prop key, React destruye y crea el formulario con los nuevos valores de selectedRoom */}
      <AnimatePresence>
        {modalOpen && selectedRoom && (
          <HabitacionForm
            key={selectedRoom.id_habitacion}
            onClose={() => {
              setModalOpen(false);
              setSelectedRoom(null);
            }}
            onSubmit={handleSaveSubmit}
            initialData={selectedRoom}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHabitaciones;