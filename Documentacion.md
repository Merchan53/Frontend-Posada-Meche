posada-meche/
├── src/
│   ├── api/              # Instancias de Axios / Fetch // por ahora no
│   ├── assets/           # Imágenes, fuentes, estilos globales
│   ├── components/
│   │   ├── ui/           # Botones, Inputs (Átomos)
│   │   ├── shared/       # Navbar, Footer, Sidebar
│   │   └── rooms/        # Cards de habitaciones, Grillas
│   ├── hooks/            # Lógica reutilizable (ej: useFetch)//por ahora no
│   ├── layouts/          # MainLayout.jsx, AdminLayout.jsx
│   ├── pages/            # Vistas principales (Lazy Loaded)
│   ├── routes/           # router.jsx
│   ├── store/            # Zustand stores
│   ├── utils/            # Formateadores (moneda, fechas)// por ahora no
│   ├── App.jsx           # Proveedores globales
│   └── main.jsx          # Punto de entrada
├── tailwind.config.js
└── vite.config.js


Guía de Arquitectura y Desarrollo: Posada Meche

Esta guía establece el estándar para la creación de componentes y la organización de la lógica en el proyecto.
1. Manual de Organización por Carpetas

Para decidir dónde colocar un nuevo archivo, sigue estas reglas:
src/components/layout/

    Qué va aquí: Componentes que forman la "cáscara" de la aplicación y que persisten entre navegaciones.

    Ejemplos: Header, Footer, MainLayout, Sidebar.

    Regla: Solo deben contener elementos que se repiten en todas (o casi todas) las páginas.

src/components/ui/

    Qué va aquí: Componentes "tontos" o atómicos. No conocen la lógica de negocio (no saben qué es una "habitación" o una "reserva").

    Ejemplos: Button, Input, Loader, Hero, Card.

    Regla: Se comunican exclusivamente por props. Deben ser altamente reutilizables.

src/components/rooms/ (Domain Components)

    Qué va aquí: Componentes que pertenecen específicamente al dominio de la Posada.

    Ejemplos: RoomCard, RoomGrid, RoomAmenities, PriceTag.

    Regla: Aquí es donde vive la lógica visual de las habitaciones. Pueden consumir datos del store si es necesario.

src/components/shared/

    Qué va aquí: Utilidades de React, High Order Components (HOC) o componentes transversales que no son visuales por sí mismos.

    Ejemplo: Loadable.jsx.

src/pages/

    Qué va aquí: Orquestadores de vistas. Son los componentes que el router carga directamente.

    Regla: Una página no debe tener casi código CSS propio; su función es importar componentes de ui/ o rooms/ y ordenarlos.

2. Flujo de Trabajo para Crear un Componente

Cuando necesites implementar una nueva sección (ej. "Nuestros Servicios"), sigue estos pasos:

    Identificar el tipo: ¿Es una pieza reutilizable (ui) o es una sección de una página específica (pages)?

    Definir los Datos: Si la sección lleva textos o links, agrégalos primero a src/constants/. Nunca escribas textos largos directamente en el JSX.

    Estructura Base (PascalCase): Crea el archivo con el nombre del componente en mayúscula inicial (ej. ServicesGrid.jsx).

    Implementación de Estilos: Usa Tailwind CSS. Si el componente es complejo, divídelo en sub-componentes más pequeños dentro de la misma carpeta.

3. Estándares de Código (Seniority)
Lógica de Estado

    Local: Si el estado solo afecta a ese componente (ej. un isOpen de un modal), usa useState.

    Global: Si los datos deben persistir entre páginas (ej. la habitación seleccionada), usa el useBookingStore.

Animaciones con Framer Motion

Para mantener la limpieza visual:

    Define tus variants (objetos de configuración de animación) fuera del componente o en un archivo de constantes si se repiten mucho.

    Evita llenar el JSX de lógica de animación pesada; usa el componente motion de forma estratégica en los contenedores principales.

Gestión de Rutas

    Siempre usa el archivo src/constants/navigation.js para los links.

    Si añades una nueva página, recuerda registrarla en src/routes/router.jsx usando lazy y envolviéndola en el componente Loadable.