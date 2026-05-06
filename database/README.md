# Documentación de Base de Datos

Esta carpeta contiene la definición de la infraestructura de datos de **GoPay**. Aquí se almacenan los esquemas, funciones y políticas de seguridad que deben ejecutarse en el motor de base de datos (PostgreSQL / Supabase).

## Archivos

### 1. `schema.sql`
Es el archivo principal que define la estructura actual de la base de datos.
*   **Propósito**: Crear la tabla de perfiles, tipos de roles y automatizaciones de usuario.
*   **Uso**: Se debe copiar y pegar su contenido en el **SQL Editor** de Supabase en caso de necesitar recrear la base de datos desde cero.

---

## Dependencias de Supabase

Aunque la base de datos es PostgreSQL estándar, el código en esta carpeta utiliza extensiones y configuraciones específicas de la arquitectura de **Supabase**:

| Elemento | Descripción |
| :--- | :--- |
| **`auth.users`** | Tabla interna de Supabase que gestiona las credenciales de acceso. |
| **`auth.uid()`** | Función de Supabase que extrae el ID del usuario que realiza la petición web. |
| **`authenticated`** | Rol de base de datos asignado automáticamente a cualquier usuario con sesión activa. |
| **`service_role`** | Rol con privilegios administrativos que salta todas las reglas de seguridad (RLS). |

## Seguridad (RLS)

Todas las tablas definidas aquí deben tener habilitado **Row Level Security (RLS)**. Esto garantiza que la seguridad se aplique en la capa de datos y no dependa únicamente del código del frontend.
