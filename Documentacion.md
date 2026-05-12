Documentación del Frontend – Posada Meche

1. Introducción

Posada Meche es un sistema web de gestión de reservas de alojamiento, desarrollado con React, Tailwind CSS y Framer Motion. El frontend se divide en dos grandes secciones:

    Sitio público (landing page, habitaciones, información de la posada).

    Panel de administración protegido (gestión de reservas, habitaciones, contabilidad y clientes).

El flujo de negocio principal gira alrededor de la reserva manual por parte del administrador (no hay auto-servicio de cliente), quien la crea cuando un huésped contacta por WhatsApp o llega en persona. Posteriormente se gestionan facturas, pagos y el estado de la reserva.

Este documento explica la arquitectura del proyecto, la lógica de cada módulo, cómo se interconectan las páginas y, finalmente, cómo conectar el frontend a un backend real.

2. Arquitectura General del Proyecto
   2.1 Estructura de Carpetas
   posada-meche/
   ├── public/ # Imágenes, favicon, etc.
   ├── src/
   │ ├── assets/ # Imágenes estáticas (fondo.webp, etc.)
   │ ├── components/
   │ │ ├── layout/ # Header, Footer, MainLayout, AdminLayout
   │ │ ├── rooms/ # RoomCard, RoomSection (dominio habitaciones)
   │ │ ├── shared/ # Loadable (HOC para lazy loading)
   │ │ └── ui/ # Hero, Loader, MyButton (componentes atómicos)
   │ ├── constants/ # Datos estáticos: rooms, features, navigation
   │ ├── pages/ # Vistas principales (páginas)
   │ ├── routes/ # Configuración de rutas (React Router)
   │ ├── store/ # Zustand stores (useBookingStore, useAdminStore)
   │ ├── App.jsx # Proveedor de rutas
   │ └── main.jsx # Punto de entrada
   ├── index.css # Estilos globales y configuración de Tailwind
   ├── tailwind.config.js
   └── vite.config.js

2.2 Tecnologías Clave

    React 18+ con hooks y componentes funcionales.

    Tailwind CSS 4 (modo JIT) con temas personalizados (colores primary, primary-soft, etc.).

    Framer Motion para animaciones fluidas y transiciones.

    Zustand para estado global simple (autenticación y reservas en el frontend).

    React Router v7 con carga diferida (lazy) y diseño de layouts anidados.

3.  Componentes Principales y su Funcionamiento
    3.1 Sitio Público (Landing, About, Rooms, Services)

        MainLayout: Estructura común con Header, Footer y un <Outlet/> donde se renderizan las páginas.

        Home: Combina <Hero/> (imagen de fondo con bienvenida) y <RoomSection/> (tarjetas de habitaciones con lazy loading y botón “Ver más”).

        Rooms: Página de catálogo con filtrado por tipo (Matrimonial, Familiar) usando botones generados dinámicamente y el componente RoomCard.

        About: Historia de la posada con galería de imágenes animada y sección de características.

        Services (pendiente de implementar, similar a About pero para servicios).

Todos los datos estáticos (habitaciones, enlaces de navegación) se almacenan en src/constants/ para mantener una única fuente de verdad. Esto facilita luego reemplazarlos por llamadas a API.
3.2 Panel de Administración (/admin)

La autenticación se simula en el frontend con el store useAdminStore (login/logout con credenciales fijas). En producción se reemplazará por JWT u OAuth.
3.2.1 AdminLayout

Sidebar colapsable con enlaces a las secciones: Dashboard, Reservas, Habitaciones, Contabilidad, Clientes. Incluye un header con nombre de usuario y botón de cerrar sesión. Usa Outlet para renderizar la página activa.
3.2.2 AdminLogin

Pantalla dividida: branding a la izquierda y formulario de inicio de sesión a la derecha. Llama a login() del store y, si es exitoso, redirige a /admin/dashboard.
3.2.3 AdminDashboard

    Ocupación: Calculada sobre 6 habitaciones (constante). Muestra tarjeta con barra de progreso.

    Resumen financiero: Tarjetas con ingresos del mes, pagos recibidos y saldo pendiente (valores mock).

    Reservas recientes: Tabla con datos de ejemplo, filtrable por búsqueda.

    Tareas pendientes: Lista de recordatorios estáticos.

3.2.4 AdminReservas

Funcionalidad completa de CRUD:

    Tabla de reservas con filtro por estado (Pendiente, Confirmada, Pagada, Cancelada).

    Cambio de estado directamente desde un <select> en la tabla (simula PUT /reservas/:id/estado).

    Modal para crear nueva reserva: selecciona habitación (de la constante ROOMS), fechas, cliente, y calcula automáticamente el total basado en el precio por noche de la habitación.

    Modal de edición precargado con los datos de la reserva seleccionada.

Lógica de negocio:

    Una reserva se crea siempre con estado PENDIENTE.

    El administrador puede cambiarla manualmente a CONFIRMADA, PAGADA o CANCELADA.

    El precio total se calcula multiplicando el número de noches por el precio de la habitación (tomado de ROOMS).

    En producción: al crear una reserva se debe verificar disponibilidad (no haya solapamiento con otras reservas activas para la misma habitación) y opcionalmente bloquear la habitación temporalmente.

3.2.5 AdminHabitaciones

    Muestra tarjetas con las 6 habitaciones (imagen, nombre, tipo, precio).

    Cada habitación puede estar activa (disponible) o en mantenimiento (toggle).

    Se pueden agregar bloqueos temporales (fechas inicio/fin) para simular mantenimiento o cierres especiales.

    En producción: los bloqueos deben consultarse junto con las reservas para determinar disponibilidad real. El administrador podría bloquear manualmente o el sistema hacerlo automáticamente al crear una reserva.

3.2.6 AdminContabilidad

Dos pestañas:

    Facturas: Lista las facturas generadas por cada reserva, con estado (PAGADA/PENDIENTE). Cada factura hereda el monto total de la reserva.

    Recibos / Pagos: Muestra los pagos parciales o totales asociados a facturas, con método de pago y monto. Abajo un resumen del total recaudado.

    Lógica: Una reserva puede tener múltiples pagos (recibos). La factura está completamente pagada cuando la suma de recibos iguala su total. El estado de la factura se actualiza consecuentemente.

3.2.7 AdminClientes

CRUD de clientes con búsqueda por nombre o cédula.

    Modal de creación/edición con campos: nombre, cédula, email, teléfono.

    En producción: al crear una reserva, el cliente puede ser seleccionado de esta lista o creado sobre la marcha. La cédula podría ser el identificador único.

4.  Lógica de Negocio y Flujo de Datos
    4.1 Proceso de Reserva (Caso de uso principal)

        Un cliente potencial contacta a la posada (WhatsApp, teléfono, presencial).

        El administrador accede al panel y va a Reservas → Nueva Reserva.

        Introduce el nombre y cédula del cliente (puede seleccionar uno existente o crear nuevo en el futuro).

        Selecciona la habitación deseada y las fechas de check‑in / check‑out.

        El sistema calcula automáticamente el total = precio por noche × número de noches.

        Al guardar, la reserva se crea con estado PENDIENTE.

        Si el cliente confirma, el administrador cambia el estado a CONFIRMADA. (En este momento, si se integra un sistema de bloqueo automático, la habitación quedaría bloqueada para esas fechas).

        Al recibir el pago (total o parcial), se registra un recibo en la sección Contabilidad. El sistema actualiza el estado de la factura (de PENDIENTE a PAGADA cuando se complete el pago). El estado de la reserva puede cambiarse manualmente a PAGADA o mantenerse independiente.

        Finalizada la estancia, la reserva pasa a estado CANCELADA (si no se realizó) o se archiva (no se implementa eliminación).

4.2 Relación entre Módulos

    Reservas ↔ Habitaciones: Una reserva ocupa una habitación. El sistema debe evitar sobreocupación (validación de fechas).

    Reservas ↔ Contabilidad: Cada reserva genera una factura automática. Los pagos (recibos) se asocian a esa factura.

    Clientes ↔ Reservas: Un cliente puede tener varias reservas. La creación de una reserva requiere datos del cliente.

    Cambios de estado: Se registran en la tabla historial_reserva (no implementada en frontend, pero el backend la mantendría para trazabilidad). De momento solo se modifica el campo estado directamente.

4.3 Estados de Reserva y su Significado
Estado Descripción
PENDIENTE Solicitud inicial, a la espera de confirmación o pago.
CONFIRMADA Confirmada por el administrador, se bloquea la habitación (futuro).
PAGADA Pago completado total o parcialmente. La reserva sigue confirmada.
CANCELADA Cancelada por cliente o administrador. La habitación se libera.

Nota: En la versión actual no se implementan fechas de creación ni histórico de cambios, pero son indispensables para el backend.

5. Gestión del Estado con Zustand

   useBookingStore: Almacena temporalmente los datos de una reserva que se está creando (no se usa en el panel actual porque la creación se hace por modal). Podría usarse para mantener el flujo si se implementa asistente paso a paso.

   useAdminStore: Autenticación mock. Contiene isAuthenticated y admin. En producción se usará para guardar el token JWT, roles, etc.

6. Conexión con el Backend
   6.1 Reemplazo de Datos Mock

Actualmente las páginas del panel utilizan arreglos mock (MOCK_RESERVATIONS, MOCK_CLIENTS, etc.). La migración al backend consiste en:

    Crear una capa de API (/src/api/): instancia de Axios o fetch con la base URL del backend.

    Sustituir los estados locales (useState(mockData)) por llamadas a la API dentro de useEffect y carga inicial.

    Manejar estados de carga y error con loaders (reutilizar Loader o crear skeletons).

    Implementar autenticación real: enviar token en headers, protectores de ruta que redirijan a login si no hay sesión.

6.2 API Endpoints Sugeridos

Respetando el modelo entidad-relación definido, los endpoints podrían ser:

POST /api/auth/login → { token, admin }
GET /api/auth/me → Datos del admin logueado

GET /api/clientes → Lista de clientes (búsqueda por cédula o nombre como query)
POST /api/clientes → Crear cliente
PUT /api/clientes/:id → Actualizar cliente
DELETE /api/clientes/:id → Eliminar cliente (soft delete recomendado)

GET /api/habitaciones → Lista de habitaciones (con estado/bloqueos)
POST /api/habitaciones/:id/bloqueos → Agregar bloqueo temporal
DELETE /api/habitaciones/:id/bloqueos/:bloqueoId → Quitar bloqueo

GET /api/reservas → Lista de reservas (filtro: estado, fechas, cliente)
POST /api/reservas → Crear reserva (valida disponibilidad y bloquea automáticamente)
PUT /api/reservas/:id → Actualizar reserva (cambiar estado, fechas, etc.)
GET /api/reservas/:id → Detalle de reserva

GET /api/facturas → Lista de facturas (filtro: estado, fechas)
POST /api/facturas/:id/pagos → Registrar un pago (recibo)
GET /api/recibos → Lista de recibos (filtro: facturaId, fechas)

6.3 Lógica de Negocio en el Backend

    Validación de disponibilidad: Al crear/editar reserva, comprobar que no exista otra reserva confirmada/pagada para la misma habitación en el rango de fechas.

    Bloqueo de habitación: Al confirmar una reserva, se puede insertar un registro en bloqueo_habitacion desde check‑in hasta check‑out. Al cancelar, se elimina.

    Generación automática de factura: Al crear reserva, crear una factura con estado PENDIENTE y total igual al de la reserva.

    Actualización del estado de pago de factura: Cuando la suma de recibos (pagos) asociados a la factura iguala o supera el total, la factura pasa a PAGADA. Opcionalmente, el estado de la reserva puede actualizarse en cascada.

    Historial de cambios: Cada cambio de estado de reserva o factura genera un registro en historial_reserva con el administrador que lo realizó y la fecha.

6.4 Ejemplo de Integración (Fetch o axios)
// src/api/reservas.js
const API_URL = import.meta.env.VITE_API_URL;

export const getReservas = async (filtros) => {
const token = useAdminStore.getState().token;
const res = await fetch(`${API_URL}/reservas?${new URLSearchParams(filtros)}`, {
headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error('Error al obtener reservas');
return res.json();
};

// En AdminReservas.jsx
const [reservas, setReservas] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
getReservas({ estado: filtroEstado !== 'Todas' ? filtroEstado : undefined })
.then(setReservas)
.catch(console.error)
.finally(() => setLoading(false));
}, [filtroEstado]);

6.5 Protección de Rutas

Agregar un componente ProtectedRoute que verifique useAdminStore.isAuthenticated y redirija a /admin si no es true. Esto se aplica al AdminLayout. 7. Interconexiones entre Páginas (Frontend)

    Dashboard → Reservas recientes: Haciendo clic en una fila podría llevar al detalle de la reserva (no implementado).

    Reservas → Clientes: Al crear reserva, el campo "Cliente" podría ser un autocomplete que obtenga lista de clientes del backend.

    Reservas → Habitaciones: La selección de habitación muestra las disponibles según fechas.

    Reservas → Contabilidad: Al crear la reserva, se crea la factura (en backend). Desde la tabla de reservas podría haber un enlace a la factura correspondiente.

    Habitaciones → Reservas: Mostrar el calendario de ocupación para cada habitación.

Estas relaciones aún no están conectadas, pero la estructura de componentes permite añadirlas fácilmente. 8. Mejores Prácticas Aplicadas

    Separación de responsabilidades: Componentes pequeños, reutilizables (UI) y de dominio separados.

    Datos centralizados en constantes (precios, textos, links) para facilitar su modificación.

    Carga diferida con lazy y Loadable para optimizar rendimiento.

    Animaciones declarativas con Framer Motion (variants fuera del JSX).

    Estado global mínimo (solo lo necesario con Zustand).

    Formularios controlados y validaciones básicas.

9. Próximos Pasos para la Integración Backend

   Definir el stack del backend (Node+Express, Django, Laravel, etc.) y la base de datos.

   Crear las tablas según el modelo entidad-relación (ya diseñado).

   Implementar los endpoints sugeridos y la autenticación JWT.

   Crear la capa de servicios en el frontend (/api/).

   Reemplazar todos los estados mock por llamadas reales, manejando estados de carga y error.

   Agregar notificaciones (toasts) para acciones exitosas/erróneas.

   Implementar validación de disponibilidad en tiempo real al seleccionar fechas.

   Mejorar la experiencia de usuario con skeletons, paginación en tablas, etc.

10. Conclusión

El frontend de Posada Meche está diseñado con buenas prácticas de React moderno, totalmente funcional para prototipado y con la arquitectura lista para escalar a un entorno productivo. La documentación aquí provista permite a cualquier desarrollador comprender rápidamente el flujo de trabajo, las interrelaciones entre módulos y la forma de conectar el backend. Con esta base, la construcción del sistema completo de gestión de reservas es un proceso predecible y ordenado.
