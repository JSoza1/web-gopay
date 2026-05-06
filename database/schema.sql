-- Estructura de la Base de Datos para GoPay
-- Este archivo contiene las definiciones de tablas, roles y políticas de seguridad.

-- 1. TIPOS ENUMERADOS
-- Definición de roles de usuario
CREATE TYPE user_role AS ENUM ('Admin', 'Closer');

-- 2. TABLAS
-- Tabla de perfiles para extender la información de auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  role user_role DEFAULT 'Closer' NOT NULL
);

-- 3. SEGURIDAD (RLS - Row Level Security)
-- Habilitar RLS en la tabla de perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permisos básicos para usuarios autenticados
GRANT ALL ON TABLE public.profiles TO authenticated;

-- Política: Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. AUTOMATIZACIÓN (TRIGGERS)
-- Función para crear un perfil automáticamente cuando se registra un usuario en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email)
  VALUES (new.id, 'Closer', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se dispara después de un INSERT en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
