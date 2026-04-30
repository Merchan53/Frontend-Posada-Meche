import RoomCard from "./RoomCard"

const  habitacion = {
        name : "Melania - Matrimonial",
        description : "Ideal para un descanso pleno y tranquilo",
        img : {url:"/habitacion.jpg", alt:"Habitacion Alt"},
        services : [{name: "Wifi"}, {name: "Agua Caliente"}],
        price: 150000
    }


const RoomSection = () => {
  return (
    <section className="relative min-h-screen">
        {/**Gradiente */}
        <div className="absolute inset-0 bg-linear-to-b from-white from-5%  via-white/30 via-10% to-primary-soft/80 "></div>
        {/**Contenedor */}
        <div className="relative z-15 flex flex-col items-start max-w-7xl mx-auto px-6  gap-6 py-7  ">

          <h3 className="text-5xl  font-bold text-primary ">Nuestras Habitaciones</h3>
          {/**Parrafo y botton van en el misma fila */}
          <div className="w-full flex flex-col md:flex-row justify-between items-end gap-6">
             <p className="text-lg text-gray-600 max-w-2xl text-left ">Espacios cómodos y acogedores diseñados para tus descansos</p>
             <button className="  text-primary  font-semibold hover:text-primary-soft transition-colors shrink-0 cursor-pointer
             ">Ver Todas</button>

          </div>
          {/**Aca se muestran las habitaciones */}
          <div className="w-full mt-15">
             <RoomCard habitacion={habitacion}/>
          </div>
         
          
        </div>


    </section>
    
  )
}

export default RoomSection