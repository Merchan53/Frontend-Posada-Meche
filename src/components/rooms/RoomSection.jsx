import { useEffect, useState } from "react";
import RoomCard from "./RoomCard";

const habitaciones = [
  {
    name: "Melania - Matrimonial",
    description: "Habitación matrimonial acogedora con vista al jardín",
    img: { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services: [{ name: "Wifi" }, { name: "Agua Caliente" }],
    price: 50000,
  },
  {
    name: "Freddy - Matrimonial",
    description: "Espacio íntimo para parejas en un ambiente relajado",
    img: { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services: [{ name: "Wifi" }, { name: "Agua Caliente" }],
    price: 50000,
  },
  {
    name: "Johann - Matrimonial",
    description: "Descanso cómodo con ambiente tranquilo y privado",
    img: { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services: [{ name: "Wifi" }, { name: "Agua Caliente" }],
    price: 50000,
  },
  {
    name: "Liseth - Matrimonial",
    description: "Diseño clásico y confort para una estancia relajante",
    img: { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services: [{ name: "Wifi" }, { name: "Agua Caliente" }],
    price: 50000,
  },
  {
    name: "Antonio - Familiar (5 personas)",
    description: "Amplia habitación familiar ideal para grupos o familias",
    img: { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services: [{ name: "Wifi" }, { name: "Agua Caliente" }],
    price: 150000,
  },
  {
    name: "Maita - Familiar (3 Personas)",
    description: "Espacio familiar acogedor con todas las comodidades básicas",
    img: { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services: [{ name: "Wifi" }, { name: "Agua Caliente" }],
    price: 70000,
  },
];

const RoomSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(3);
  //Logica para determinar cuantas mostrar segun el end point
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(3);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleHabitaciones = showAll
    ? habitaciones
    : habitaciones.slice(0, itemsToShow);
  return (
    <section className="relative min-h-screen">
      {/**Gradiente */}
      <div className="absolute inset-0 bg-linear-to-b from-white from-5%  via-white/30 via-10% to-primary-soft/80 "></div>
      {/**Contenedor */}
      <div className="relative z-15 flex flex-col items-start max-w-7xl mx-auto px-6  gap-6 py-7  ">
        <h3 className="text-5xl  font-bold text-primary ">
          Nuestras Habitaciones
        </h3>
        {/**Parrafo y botton van en el misma fila */}
        <div className="w-full flex flex-col md:flex-row justify-between items-end gap-6">
          <p className="text-lg text-gray-600 max-w-2xl text-left ">
            Espacios cómodos y acogedores diseñados para tus descansos
          </p>
          <button
            onClick={() => setShowAll(!showAll)}
            className="hidden lg:block text-primary font-semibold hover:text-primary-soft transition-colors cursor-pointer border-b-2 border-transparent hover:border-primary-soft pb-1"
          >
            {showAll ? "Ver menos" : "Ver Todas"}
          </button>
        </div>
        {/**Aca se muestran las habitaciones */}
        <div className="w-full mt-15 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8 h-full justify-items-center">
            {visibleHabitaciones.map((habitacion, index) => (
              <RoomCard key={index} habitacion={habitacion} index = {index} />
            ))}
          </div>
        </div>
        {/** Botón Versión Tablet/Móvil: Se muestra solo debajo de lg */}
        <div className="flex justify-center lg:hidden mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-lg active:scale-95 transition-all"
          >
            {showAll ? "Mostrar menos" : "Ver Todas"}
          </button>
        </div>  
      </div>
    </section>
  );
};

export default RoomSection;
