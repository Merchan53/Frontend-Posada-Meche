# Guía para escribir código en el proyecto

Esta guía tiene como objetivo mantener consistencia y calidad en el código del proyecto.

## Estructura del proyecto
- **`src/`**: Contiene todo el código fuente.
  - **`components/`**: Componentes reutilizables divididos en subcarpetas.
  - **`layouts/`**: Diseños comunes como encabezados y pies de página.
  - **`pages/`**: Páginas principales de la aplicación.
  - **`routes/`**: Configuración de rutas.
  - **`store/`**: Estado global de la aplicación.

## Convenciones de estilo
- **Formato**: Usa Prettier para formatear el código.
- **Nombres**:
  - Archivos y carpetas: `kebab-case` (ejemplo: `use-booking-store.js`).
  - Componentes: `PascalCase` (ejemplo: `Home.jsx`).
- **Comentarios**: Explica el propósito de funciones y componentes.

## Buenas prácticas
1. **Componentes reutilizables**:
   - Coloca componentes genéricos en `components/shared` o `components/ui`.
2. **Estado global**:
   - Usa `store/` para manejar estados compartidos.
3. **Lazy Loading**:
   - Carga perezosa para mejorar el rendimiento.
4. **Rutas**:
   - Define rutas en `routes/router.jsx`.

## Ejemplo de estructura de un componente
```jsx
import React from 'react';

const ExampleComponent = () => {
  return (
    <div>
      <h1>Hola, mundo</h1>
    </div>
  );
};

export default ExampleComponent;
```

## Configuración del servidor
- Asegúrate de que el servidor redirija todas las rutas al archivo `index.html` para manejar rutas en aplicaciones SPA.

---

Sigue esta guía para mantener un código limpio y organizado.