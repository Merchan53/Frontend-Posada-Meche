import { FaGithub } from "react-icons/fa6";
import { RiHome5Fill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer>
      <div
        className="flex flex-col   
    justify-center items-center min-h-37.5
     bg-linear-to-r from-primary to-orange-400 
      text-white
      gap-y-2 "
      >
        <RiHome5Fill className="w-7 h-7 " />
        <span className="text-2xl font-bold">Posada Meche</span>

        <span className="flex mt-4 text-[10px] uppercase tracking-widest text-white/90 font-light gap-2 items-center">
          &copy;{new Date().getFullYear()} Johann Merchan <a href="https://github.com/Merchan53"><FaGithub /> </a>{" "}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
