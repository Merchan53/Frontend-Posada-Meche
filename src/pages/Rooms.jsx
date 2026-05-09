import { useState } from "react";
import MyButton from "../components/ui/MyButton";
import { ROOMS } from "../constants/rooms";
import RoomCard from "../components/rooms/RoomCard";
import { motion } from "motion/react";

const Rooms = () => {
  const [selectedRoom, setSelectedRoom] = useState("Todas");

  // Estado derivado: limpio y escalable
  const filteredRooms = ROOMS.filter((room) => {
    if (selectedRoom === "Todas") return true;
    return room.tipo === selectedRoom;
  });

  // Tipos de habitaciones para evitar repetir botones manualmente (DRY)
  const categories = ["Todas", "Matrimonial", "Familiar"];
  //Contantes de animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Los hijos aparecen uno tras otro
        delayChildren: 0.4, // Espera un poco antes de empezar la secuencia
      },
    },
  };

  const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Empiezan un poco más abajo
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }, // Ease-out profesional
  },
};

  return (
    <motion.section variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section: Contenedor de foto y texto */}
      <motion.div variants={itemVariants} className="w-full relative h-75 md:h-112.5 flex flex-col items-center justify-center text-center rounded-3xl overflow-hidden mb-12">
        {/* Imagen de fondo con Overlay para legibilidad */}
        <div
          className="absolute inset-0 bg-[url('/room.jpg')] bg-cover bg-center"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40"></div>{" "}
          {/* Capa oscura */}
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 px-6">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Tu habitación para cada momento
          </h1>
          <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Explora nuestra selección de espacios diseñados para tu descanso y
            confort, desde estancias íntimas hasta espacios para toda la
            familia.
          </p>
        </div>
      </motion.div>

      {/* Filtrador Dinámico */}
      <motion.div variants={itemVariants} className="flex w-full justify-center gap-4 mb-10">
        {categories.map((category) => (
          <MyButton
            key={category}
            onClick={() => setSelectedRoom(category)}
            isActive={selectedRoom === category}
            description={category}
          />
        ))}
      </motion.div>

      {/* Grid de Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((habitacion) => (
            <RoomCard key={habitacion.id} habitacion={habitacion} />
          ))
        ) : (
          <p className="col-span-full text-gray-500 py-20">
            No se encontraron habitaciones en esta categoría.
          </p>
        )}
      </div>
    </motion.section>
  );
};

export default Rooms;
