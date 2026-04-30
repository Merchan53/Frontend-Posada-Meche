const RoomCard = ({ habitacion }) => {
  const {
    name = "Habitacion sin nombre",
    description = "Descripcion habitacion",
    img = { url: "/habitacion.jpg", alt: "Habitacion Alt" },
    services = [],
    price = 0

  } = habitacion || {};

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);

  console.log(formattedPrice);

  return (

    <div className="flex flex-col h-110 w-80 bg-white rounded-4xl shadow-md overflow-hidden">
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
        <h3 className="text-xl font-bold text-primary">
          {name}
        </h3>
        <p className="text-gray-600 mt-2 text-sm border-b border-b-primary-soft pb-6">
          {description}
        </p>
        {/**Spams */}
        <div className=" flex gap-2 justify-start mt-5">
          {services.filter(servicio => servicio.name)
            .map((servicio, index) => (


              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                {servicio.name}
              </span>



            ))}
        </div>
        {/**Precio por noche logica de negocio siempre es por noche llegue en el dia o en la noche se cobra en la noche */}
        <div className="mt-auto mb-6 flex items-baseline gap-1">
          <span className="text-2xl font-black text-primary">{formattedPrice}</span>
          <span className="text-gray-500 text-xs font-medium">/ noche</span>
        </div>
      </div>
    </div>

  );
};

export default RoomCard;
