# 🔄 Configurar Sincronización con Supabase

Para que tus notas se sincronicen entre tu computadora y celular, necesitas configurar Supabase. Es totalmente gratuito.

## 📋 Pasos de Configuración:

### 1. Crear Cuenta en Supabase (5 minutos)

1. Ve a https://supabase.com
2. Haz clic en "Sign Up"
3. Inicia sesión con Google o GitHub
4. Confirma tu email

### 2. Crear un Nuevo Proyecto (2 minutos)

1. En el dashboard, haz clic en "New Project"
2. Llena la información:
   - **Project name**: `notes-app` (o el nombre que prefieras)
   - **Database password**: Crea una contraseña segura (guárdala)
   - **Region**: Selecciona la región más cercana a ti
3. Haz clic en "Create new project"
4. Espera a que se cree (2-3 minutos)

### 3. Crear la Tabla de Notas (3 minutos)

1. En Supabase, ve a **SQL Editor** (en el menú izquierdo)
2. Haz clic en **New Query**
3. Copia y pega este SQL:

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT CHECK (category IN ('note', 'task', 'agenda')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMP,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Haz clic en **Run** (botón azul)
5. Deberías ver el mensaje: "Success. No rows returned"

### 4. Habilitar Acceso Público (1 minuto)

1. Ve a **Authentication** → **Policies** en Supabase
2. Haz clic en la tabla `notes`
3. Haz clic en **Enable RLS** (si no está habilitado)
4. Luego haz clic en **New Policy**
5. Selecciona **For all operations**
6. En la expresión, escribe: `true` (permite acceso público)
7. Haz clic en **Save**

### 5. Obtener las Credenciales (2 minutos)

1. En Supabase, ve a **Settings** → **API**
2. Copia:
   - **Project URL** → Será tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6. Añadir Credenciales a tu App

#### Opción A: Variable de Entorno Local (para desarrollo)

1. En tu proyecto, crea/edita el archivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

2. Reinicia tu servidor local (`npm run dev`)

#### Opción B: Vercel (para producción)

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Haz clic en **Settings** → **Environment Variables**
3. Añade:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Tu URL de Supabase
4. Haz clic en **Add**
5. Repite para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Ve a **Deployments** y haz clic en **Redeploy** en el último deploy

---

## 🔄 Cómo Funciona la Sincronización

Una vez configurado:

1. **Cuando abres la app**, automáticamente:
   - ✅ Descarga las notas de Supabase
   - ✅ Fusiona con lo que estaba en tu dispositivo
   - ✅ Guarda en localStorage para acceso rápido

2. **Cuando creas/editas/borras una nota**:
   - ✅ Se guarda inmediatamente en localStorage
   - ✅ Se sincroniza con Supabase en segundo plano
   - ✅ Aparece en otros dispositivos en 30 segundos

3. **Cuando cambias entre navegadores/dispositivos**:
   - ✅ Al ganar foco la ventana, sincroniza automáticamente
   - ✅ Cada 30 segundos se sincroniza en background

---

## ✅ Verificar que Funciona

1. **En tu computadora**:
   - Abre la app
   - Crea una nota nueva
   - Espera 30 segundos

2. **En tu celular**:
   - Abre la app en otro navegador
   - Recarga la página (F5)
   - ¡Deberías ver la nota que creaste en la computadora!

3. **Prueba bidireccional**:
   - Crea una nota en el celular
   - Vuelve a la computadora
   - Recarga la página
   - ¡Deberías ver la nota del celular!

---

## 🐛 Solución de Problemas

### "No veo las notas de otros dispositivos"

1. Verifica que las credenciales estén correctas en `.env.local`
2. Recarga la página (Ctrl+F5 o Cmd+Shift+R para limpiar caché)
3. Abre la consola (F12) y busca errores rojos
4. Verifica que Supabase está activo en https://supabase.com/dashboard

### "Las notas de un dispositivo no aparecen en otro"

1. Espera 30 segundos (intervalo de sincronización)
2. Recarga la página
3. Verifica que ambos dispositivos usan las MISMAS credenciales

### "Ver qué hay en Supabase"

1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto
3. Ve a **Table Editor**
4. Selecciona tabla `notes`
5. Verás todas tus notas sincronizadas

---

## 🔐 Seguridad

**Nota importante**: Las políticas actuales permiten acceso público. Para proteger tus notas:

1. Ve a **Authentication** → **Policies** en Supabase
2. Edita la política y cambia `true` por:
   ```sql
   auth.uid() IS NOT NULL
   ```

Esto requiere que estés autenticado. Si quieres implementar autenticación real, consulta la documentación de Supabase.

---

## 📱 Comportamiento Actual

- ✅ Sincronización automática cada 30 segundos
- ✅ Sincronización al cambiar de pestaña/dispositivo
- ✅ Fusión inteligente de cambios (usa timestamp más reciente)
- ✅ Cola de sincronización offline (guarda cambios locales si no hay internet)
- ✅ Compatible con localStorage como fallback

---

## 🎉 ¡Listo!

Una vez configurado, tus notas estarán sincronizadas automáticamente entre todos tus dispositivos.

**Preguntas?** Revisa la documentación de Supabase: https://supabase.com/docs
