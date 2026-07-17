// Usamos nombres claros y corregimos ortografía (Background, Toggle)
const MyButton = ({ isActive, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-6 rounded-2xl text-sm cursor-pointer ${isActive === true ? "bg-linear-to-r from-primary to-orange-400 text-white font-medium" : "border border-gray-400 font-medium"}`}
    >
      {description}
    </button>
  );
};

export default MyButton;
