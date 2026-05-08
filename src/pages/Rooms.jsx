import { useState } from "react";
import MyButton from "../components/ui/MyButton";
import { ROOMS } from "../constants/rooms";
import RoomCard from "../components/rooms/RoomCard";

const Rooms = () => {
  const [selectedRoom, setSelectedRoom] = useState("Todas");

  // Estado derivado: limpio y escalable
  const filteredRooms = ROOMS.filter((room) => {
    if (selectedRoom === "Todas") return true;
    return room.tipo === selectedRoom;
  });

  // Tipos de habitaciones para evitar repetir botones manualmente (DRY)
  const categories = ["Todas", "Matrimonial", "Familiar"];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Hero Section: Contenedor de foto y texto */}
      <div className="w-full relative h-[300px] md:h-[450px] flex flex-col items-center justify-center text-center rounded-3xl overflow-hidden mb-12">
        {/* Imagen de fondo con Overlay para legibilidad */}
        <div 
          className="absolute inset-0 bg-[url('/room.jpg')] bg-cover bg-center" 
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40"></div> {/* Capa oscura */}
        </div>
        
        {/* Contenido del Hero */}
        <div className="relative z-10 px-6">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Tu habitación para cada momento
          </h1>
          <p className="text-gray-100 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Explora nuestra selección de espacios diseñados para tu descanso y confort, 
            desde estancias íntimas hasta espacios para toda la familia.
          </p>
        </div>
      </div>

      {/* Filtrador Dinámico */}
      <div className="flex w-full justify-center gap-4 mb-10">
        {categories.map((category) => (
          <MyButton
            key={category}
            onClick={() => setSelectedRoom(category)}
            isActive={selectedRoom === category}
            description={category}
          />
        ))}
      </div>

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
    </section>
  );
};

export default Rooms;