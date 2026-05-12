// src/components/layout/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { RiHome5Fill, RiDashboardLine, RiCalendarCheckLine, RiMenuLine, RiLogoutBoxLine } from 'react-icons/ri';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../store/useAdminStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const sidebarItems = [
    { to: '/admin/dashboard', icon: <RiDashboardLine />, label: 'Dashboard' },
    {
      label: 'Reservas',
      icon: <RiCalendarCheckLine />,
      subItems: [
        { to: '/admin/reservas', label: 'Reservas' },
        { to: '/admin/habitaciones', label: 'Habitaciones' },
        { to: '/admin/contabilidad', label: 'Contabilidad' },
        { to: '/admin/clientes', label: 'Clientes' },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 70 }}
        className="bg-white shadow-xl flex flex-col overflow-hidden transition-all duration-300"
      >
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-5 py-6 border-b border-gray-100">
          <RiHome5Fill className="w-7 h-7 text-primary flex-shrink-0" />
          {sidebarOpen && <span className="text-xl font-bold text-primary truncate">Posada Meche</span>}
        </Link>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item, idx) =>
            item.subItems ? (
              <div key={idx}>
                <button
                  onClick={() => setSidebarOpen(true)} // asegura que esté abierto al expandir
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-xl hover:bg-primary-soft/20 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
                {sidebarOpen && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.subItems.map((sub, subIdx) => (
                      <Link
                        key={subIdx}
                        to={sub.to}
                        className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-primary-soft/20 hover:text-primary transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={idx}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-xl hover:bg-primary-soft/20 transition-colors"
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          )}
        </nav>

        {/* Botón toggle y logout */}
        <div className="border-t border-gray-100 px-3 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <RiMenuLine className="w-5 h-5" />
          </button>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50"
            >
              <RiLogoutBoxLine className="w-5 h-5" />
              Salir
            </button>
          )}
        </div>
      </motion.aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-700">Panel de Administración</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin</span>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;