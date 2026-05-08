import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FEATURES } from "../constants/features.jsx";

// Simulamos unas rutas de imágenes
const images = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
];
const ImageGallery = () => {
  const [index, setIndex] = useState(0);

  // Efecto para cambiar la imagen cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={index} // Importante: indica a Framer que la imagen cambió
          src={images[index]}
          initial={{ opacity: 0.6, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2, // Orquestación de los hijos
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <motion.section
      variants={pageVariants}
      initial="initial"
      animate="visible"
      exit="exit"
      className="max-w-7xl mx-auto px-4 py-12 lg:py-24"
    >
      {/** Seccion Hero y Historia */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div variants={itemVariants} className="space-y-6">
          <header>
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-widest uppercase bg-linear-to-r from-primary to-orange-400 text-white rounded-full">
              Nuestra Historia y esencia
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 leading-tight">
              Un rincón de calidez en{" "}
              <span className="text-white px-2 bg-linear-to-r from-primary to-orange-400">
                Peribeca
              </span>
            </h2>
          </header>
          <p className="text-lg text-slate-600 leading-relaxed">
            {/* Inserta aquí el copy sugerido arriba */}
            En el corazón de Peribeca, nace un refugio diseñado para el
            reencuentro. Posada Meche no es solo un destino, es la
            materialización de la hospitalidad andina. Aquí, el tiempo se
            detiene entre muros que respiran tradición y jardines que invitan al
            descanso absoluto. Nos dedicamos a crear el escenario perfecto para
            que las familias y amigos desconecten del ruido exterior y
            reconecten con lo que verdaderamente importa: el presente.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 "
          >
            <ImageGallery />
            <div className="flex items-center justify-center h-full text-slate-400 italic"></div>
          </motion.div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary -z-10 rounded-2xl"></div>
        </motion.div>
      </div>
      {/**Seccion de Valores y por qué elegirnos */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-3 gap-8 border-t border-slate-200 pt-16"
      >
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-xl hover:bg-primary-soft transition-colors"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-slate-800">
              {feature.title}
            </h3>
            <p className="text-slate-600">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default About;
