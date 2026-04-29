import { useState } from "react";
import { Link } from "react-router";
import { FaRegCalendar } from "react-icons/fa6";
import { RiHome5Fill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io";
import { NAVLINKS } from "../../constants/navigation";

const Header = () => {
 

  const [isOpen, setIsOpen] = useState(false); // Por defecto cerrado
  const toogleMenuMb = () => setIsOpen(!isOpen);

  return (
    // 1. Quitamos h-20 y usamos min-h. Usamos flex-col para el crecimiento vertical.
    <header className="min-h-20 bg-light w-full transition-all duration-300 flex flex-col justify-center">
      
      {/** Fila Superior: Logo y Botón */}
      <div className="mx-auto w-full px-6 py-4">
        <div className="flex justify-between items-center">
          {/** LOGO */}
          <Link to="/" className="flex items-center text-primary font-bold">
            <RiHome5Fill className="w-7 h-7 " />
            <span className="text-2xl ml-2">Posada Meche</span>
          </Link>

          {/** Nav Desktop */}
          <div className="gap-4 hidden md:flex items-center">
            <nav className="flex gap-4 text-Mygray font-medium">
              {NAVLINKS.map((item, index) => (
                <Link to={item.to} key={index} className="hover:text-primary">{item.name}</Link>
              ))}
            </nav>
            <button className="bg-linear-to-r from-primary to-orange-400 h-9 px-6 rounded-2xl text-white text-sm font-medium cursor-pointer">
              Reservar Ahora
            </button>
          </div>

          {/** Botón Hamburguesa */}
          <div className="md:hidden">
            <IoMdMenu onClick={toogleMenuMb} className="h-9 w-9 text-primary cursor-pointer" />
          </div>
        </div>
      </div>

      {/** 2. Menú Desplegable (Crecimiento vertical) */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <nav className="flex flex-col p-6 gap-4 border-t border-gray-100 bg-white">
          {NAVLINKS.map((item, index) => (
            <Link
              to={item.to}
              key={index}
              onClick={toogleMenuMb}
              className="text-Mygray font-medium hover:text-primary py-2 text-lg"
            >
              {item.name}
            </Link>
          ))}
          <button className="flex justify-center items-center gap-2 bg-primary h-12 rounded-xl text-white font-medium">
            Reservar Ahora <FaRegCalendar />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
