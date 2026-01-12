# Product Microservice

Microservicio de Productos desarrollado con NestJS y Prisma.

## Dev

Sigue estos pasos para configurar el entorno de desarrollo:

1. **Clonar el repositorio**:

   ```bash
   git clone <URL_DEL_REPOSIXORIO>
   cd products-ms
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` basado en el `.env.template`:

   ```bash
   cp .env.template .env
   ```

   Asegúrate de configurar la variable `DATABASE_URL` y otras variables necesarias en el archivo `.env`.

4. **Ejecutar migración de Prisma**:
   Esto creará la base de datos (si es SQLite) y aplicará las migraciones pendientes.

   ```bash
   npx prisma migrate dev
   ```

5. **Iniciar la aplicación en modo desarrollo**:
   ```bash
   npm run start:dev
   ```

## Descripción

Microservicio de productos, parte fundamental de un sistema de Mini Ecommerce, encargado de la gestión, validación y persistencia del catálogo de productos.
