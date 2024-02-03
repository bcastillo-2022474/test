# Sistema de Gestión de Contactos

Este proyecto es un Sistema de Gestión de Contactos desarrollado con pura Vanillajs y Tailwind CSS. Proporciona una interfaz amigable para gestionar tus contactos, con características avanzadas y una experiencia de usuario intuitiva.
## Funcionalidades Destacadas

### Persistencia de Datos

El sistema utiliza LocalStorage para garantizar que la información de los contactos persista incluso después de cerrar la aplicación. Esto asegura que los usuarios no pierdan sus datos importantes.

### Autenticación

Es obligatorio iniciar sesión para acceder a ciertas secciones del sistema, lo que proporciona una capa adicional de seguridad y control de acceso a la información sensible.

### Tabla de Contactos Interactiva

La página principal presenta una tabla de contactos con funcionalidades avanzadas:

-   Ordenación Dinámica: Los usuarios pueden ordenar la tabla según diferentes atributos o columnas, facilitando la búsqueda y organización de datos.
-   Columnas Personalizables: Permite ocultar columnas según las preferencias del usuario, brindando flexibilidad en la visualización de la información.
-   Favoritos: Con un simple clic, los usuarios pueden marcar un contacto como favorito para un acceso rápido y fácil.

### Acciones en la Tabla

Cada fila de la tabla incluye una columna de acciones que desencadenan opciones detalladas:

-   Eliminar: Permite eliminar un contacto con confirmación para evitar eliminaciones accidentales.
-   Editar: Redirige a un formulario de edición para actualizar la información del contacto.
-   Ver Registro: Abre una vista detallada del contacto en una tarjeta, proporcionando una visión rápida de la información.

### Barra de Búsqueda Potente

Incluye una barra de búsqueda que facilita la localización rápida de registros específicos, mejorando la eficiencia en la gestión de grandes conjuntos de datos.

### Funcionalidad para Agregar Contactos

Un botón visible en la parte superior de la tabla dirige a los usuarios a un formulario reutilizado para agregar nuevos contactos. Esto asegura una consistencia en la interfaz y simplifica el flujo de trabajo.
### Tecnologías Utilizadas

-   Vanillajs: Para la lógica del lado del cliente.
-   Tailwind CSS: Para un diseño moderno y fácil personalización.

Instrucciones de Uso

-Clonar el Repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
```

Instalar Dependencias:

Este proyecto no utiliza dependencias!

Ejecutar la Aplicación:

```
npx live-server
```
Acceder a la Aplicación:
    Abre tu navegador y visita http://localhost:puerto.
