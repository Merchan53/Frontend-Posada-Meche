import { motion } from "motion/react";
//Voy a crear un container de variables para las animaciones de Motion
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

const Hero = () => {
  return (
    <section className="relative min-h-[95dvh] flex items-center justify-center">
      {/* CAPA 1: La Imagen */}
      <div className="absolute inset-0 bg-[url('/fondo.webp')] bg-cover bg-center"></div>

      {/* CAPA 2: El Gradiente (De blanco abajo a transparente arriba) */}
      <div className="absolute inset-0 bg-linear-to-t from-white  via-white/20 via-10% to-black/50 to-45%"></div>

      {/* CAPA 3: El Contenido (Encima de todo) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-1 gap-y-2.5"
      >
        {/* Tu texto aquí */}
        <motion.span
          variants={itemVariants}
          className="uppercase tracking-[0.3em] 
          text-xs mb-5  
          text-white/90 
          font-medium
          bg-gray-400/50
          rounded-4xl
         px-4 py-1.5
          "
        >
          Tu hogar lejos de casa
        </motion.span>
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight py-6"
        >
          Bienvenido a <br /> Posada Meche
        </motion.h1>

        <motion.p variants={itemVariants} className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Un lugar acogedor donde encontrarás comodidad, calidez y una atención{" "}
          <br />
          excepcional. ¡Disfruta de tu estadía con nosotros!
        </motion.p>

        <motion.div
          variants={itemVariants}
        >
          <motion.button
            transition={{ type: "spring", duration: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.9, y: 2 }}
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
          >
            Hacer Reserva
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
