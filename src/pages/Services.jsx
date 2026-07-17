import { FaCameraRetro } from "react-icons/fa6";
import { FaBirthdayCake } from "react-icons/fa";
import { MdFreeBreakfast } from "react-icons/md";
import { GiGlassCelebration } from "react-icons/gi";
import { GiButterflyFlower } from "react-icons/gi";
import { FaWifi } from "react-icons/fa";
import MyButton from "../components/ui/MyButton";
import { motion } from "motion/react"; // ← importado

const servicios = [
  {
    id: 1,
    icono: <GiButterflyFlower />,
    titulo: "Bodas de Enseño",
    descripcion:
      "Cobertura con cocteloboleros membrázate en un relleno limpio y amable.",
    extra: { palabra: "Amor eterno" },
  },
  {
    id: 2,
    icono: <GiGlassCelebration />,
    titulo: "Quince Años de Gala",
    descripcion:
      "Quince años recónditos cocinarás solo con el mejor paquete de comida preparada por ti.",
    extra: { palabra: "Fiesta soñada" },
  },
  {
    id: 3,
    icono: <FaBirthdayCake />,
    titulo: "Cumpleaños y Celebraciones",
    descripcion: "Cumplirás o renueva celebraciones con tu familia.",
    extra: { palabra: "Alegría familiar" },
  },
  {
    id: 4,
    icono: <FaCameraRetro />,
    titulo: "Turismo Local",
    descripcion: "Fotografías, excursiones y visitantes en tus días favoritos.",
    extra: { palabra: "Aventura local" },
  },
  {
    id: 5,
    icono: <MdFreeBreakfast />,
    titulo: "Desayunos Andinos",
    descripcion: "Detecte los mejores desayunos andinos.",
    extra: { palabra: "Sabor andino" },
  },
  {
    id: 6,
    icono: <FaWifi />,
    titulo: "Wi-Fi Gratuito",
    descripcion: "Wi-Fi libre para todos.",
    extra: { palabra: "Conexión libre" },
  },
];

const Services = () => {
  // ⚡ Número de WhatsApp (cámbialo por el tuyo, sin espacios ni caracteres especiales)
  const numeroWhatsApp = "584147209888"; // Ejemplo: 58414... (código país + número)
  
  // 📝 Mensaje personalizado que aparecerá en el chat
  const mensaje = "Hola, me interesa cotizar un evento. ¿Podrían darme más información?";

  const redirigirAWhatsapp = () => {
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  // 🎬 Animaciones (mismo patrón que Rooms y About)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto pb-10 px-4 sm:px-6 lg:px-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="w-full relative h-75 md:h-150 lg:h-130 flex flex-col items-center lg:items-start justify-center rounded-3xl overflow-hidden mb-12 shadow-2xl bg-amber-100"
      >
        <div className="absolute inset-0 bg-[url('/wedding.jpg')] bg-cover md:bg-bottom bg-center"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 px-6 lg:px-12 lg:w-170">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            Experiencias y momentos inolvidables
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl drop-shadow-md">
            Desde bodas y quince años llenas de alegría, hasta deliciosas
            comidas tradicionales y aventuras turísticas inolvidables, Posada
            Meche es el lugar perfecto para crear recuerdos eternos.
          </p>
        </div>
      </motion.div>

      {/* Grid de tarjetas de servicios */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
          >
            <div className="flex justify-center pt-8 pb-4 text-6xl bg-linear-to-r from-primary to-orange-400">
              <span className="transform group-hover:scale-110 transition-transform duration-300 text-white">
                {servicio.icono}
              </span>
            </div>
            <div className="p-5 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 text-center">
                {servicio.titulo}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed mb-5 text-sm md:text-base">
                {servicio.descripcion}
              </p>
              <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full shadow-inner">
                  {servicio.extra.palabra}
                </span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Banner de cotización - fuera del grid, ancho completo */}
      <motion.div
        variants={itemVariants}
        className="mt-12 rounded-2xl overflow-hidden shadow-xl"
      >
        <div
          className="relative w-full h-96 bg-cover bg-center flex flex-col items-center justify-center"
          style={{ backgroundImage: "url('/evento.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Cotiza tu evento
            </h2>
            <MyButton
              isActive={true}
              description="Cotizar ahora"
              onClick={redirigirAWhatsapp}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Services;
