
  # Replicate landing page structure

  This is a code bundle for Replicate landing page structure. The original project is available at https://www.figma.com/design/IlJz9n7LidHMqSEmc3BYkp/Replicate-landing-page-structure.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Anuncios del inicio

En `/admin`, abre **Anuncios** para subir una imagen o cartel (JPG, PNG, WEBP, GIF o AVIF; máximo 4 MB). Agrega un título y, si hace falta, una descripción y un enlace. Puedes previsualizar, editar, publicar, ocultar o eliminar cada anuncio. Los publicados aparecen en un carrusel debajo del hero, con las imágenes completas y una opción para ampliarlas. Los destacados aparecen primero y después se ordenan por fecha, de más reciente a más antiguo. La fecha se utiliza para ordenar; no programa publicaciones.

La carga utiliza el mismo Firebase Storage de los artículos y requiere `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` y, si el bucket tiene otro nombre, `FIREBASE_STORAGE_BUCKET`. Los anuncios se guardan en la tabla `News` mediante `DATABASE_URL`. Antes de desplegar en un entorno donde todavía falte esa tabla, aplica la migración existente con `npm run db:migrate`. Si el almacenamiento falla, se muestra un error y se conserva el formulario para reintentar.

En desarrollo, sin `DATABASE_URL`, se usan anuncios de muestra y los cambios duran solamente mientras el servidor esté activo. En producción, guardar, ocultar y eliminar requieren una conexión funcional a la base de datos.

Para verificar el entorno de despliegue, `npm run verify:announcements` revisa el esquema y el historial de migraciones sin mostrar credenciales ni registros de usuarios. `npm run verify:announcements -- --smoke` comprueba además el guardado de un anuncio oculto y la subida y descarga de una imagen en Firebase; al terminar elimina esos datos temporales. Ejecuta esa comprobación en el entorno que ya tenga las credenciales configuradas.

En una base de producción con su historial de Prisma ya inicializado, `npm run verify:announcements -- --migrate --smoke` aplica primero las migraciones pendientes, usando una conexión directa cuando la base está en Neon, y después ejecuta las comprobaciones. Si falta el historial, se detiene para evitar aplicar migraciones sobre una base sin revisar.

