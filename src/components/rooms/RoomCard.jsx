import { motion } from "framer-motion";
const RoomCard = ({ habitacion, index }) => {
  const {
    name = "Habitacion sin nombre",
    description = "Descripcion habitacion",
    img = { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services = [],
    price = 0,
  } = habitacion || {};

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);

  console.log(formattedPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex flex-col h-120 w-95   bg-white rounded-4xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
    >
      {/**Imagen */}
      <div className="w-full h-56">
        <img
          className="w-full h-full object-cover"
          src={img.url}
          alt={img.alt}
        />
      </div>
      {/**Descripcion */}
      <div className="flex flex-col pt-6 px-6 grow">
        <h3 className="text-xl font-bold text-primary">{name}</h3>
        <p className="text-gray-600 mt-2 text-sm border-b border-b-primary-soft pb-6">
          {description}
        </p>
        {/**Spams */}
        <div className=" flex gap-2 justify-start mt-5">
          {services
            .filter((servicio) => servicio.name)
            .map((servicio, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-soft text-white rounded-full text-xs font-semibold"
              >
                {servicio.name}
              </span>
            ))}
        </div>
        {/**Precio por noche logica de negocio siempre es por noche llegue en el dia o en la noche se cobra en la noche */}
        <div className="mt-auto mb-6 flex items-baseline gap-1">
          <span className="text-2xl font-black text-primary">
            {formattedPrice}
          </span>
          <span className="text-gray-500 text-xs font-medium">/ noche</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
