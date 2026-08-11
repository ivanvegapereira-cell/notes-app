# 🚀 Guía de Despliegue en Vercel

Esta guía te llevará paso a paso a través del proceso de desplegar tu aplicación de notas en Vercel.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Opción 1: Despliegue con GitHub (Recomendado)](#opción-1-despliegue-con-github-recomendado)
3. [Opción 2: Despliegue con Vercel CLI](#opción-2-despliegue-con-vercel-cli)
4. [Configurar Sincronización con Supabase](#configurar-sincronización-con-supabase)
5. [Verificar el Despliegue](#verificar-el-despliegue)
6. [Solución de Problemas](#solución-de-problemas)

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

- [Node.js](https://nodejs.org/) 18 o superior instalado
- Una cuenta en [GitHub](https://github.com) (para la Opción 1)
- Una cuenta en [Vercel](https://vercel.com)
- Git instalado en tu computadora

### Verificar requisitos

```bash
node --version  # Debe ser v18 o superior
npm --version
git --version
```

---

## Opción 1: Despliegue con GitHub (Recomendado) ⭐

Esta es la forma más fácil y recomendada. Vercel se integrará con tu repositorio de GitHub y desployará automáticamente cada vez que hagas push.

### Paso 1: Preparar el Proyecto Localmente

```bash
cd C:\Users\ivanv\OneDrive\Desktop\Nueva carpeta\notes-app

# Verificar que todo está en orden
npm install
npm run build
```

### Paso 2: Crear un Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión (crea una cuenta si no la tienes)
2. Haz clic en el **+** en la esquina superior derecha
3. Selecciona **New repository**
4. Llena el formulario:
   - **Repository name**: `notes-app`
   - **Description**: `Aplicación personal de notas y agenda`
   - **Visibility**: `Public` (para desplegar gratuitamente en Vercel) o `Private`
5. Haz clic en **Create repository**

### Paso 3: Subir el Código a GitHub

En tu terminal, desde la carpeta del proyecto:

```bash
# Inicializar git (si no está ya inicializado)
git init

# Añadir los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Notas app with Next.js"

# Añadir la rama main
git branch -M main

# Añadir el remote (reemplaza "tu-usuario" con tu usuario de GitHub)
git remote add origin https://github.com/tu-usuario/notes-app.git

# Hacer push al repositorio
git push -u origin main
```

### Paso 4: Conectar Vercel con GitHub

1. Ve a [Vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **Add New** → **Project**
3. Selecciona **Import Git Repository**
4. Busca y selecciona tu repositorio `notes-app`
5. Haz clic en **Import**

### Paso 5: Configurar Variables de Entorno (Opcional)

Si planeas usar Supabase para sincronización:

1. En el dashboard de Vercel, ve a **Settings**
2. Haz clic en **Environment Variables**
3. Añade las siguientes variables (si tienes credenciales de Supabase):
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Tu URL de Supabase
   - Haz clic en **Add**

4. Repite para:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Tu clave anónima de Supabase

### Paso 6: Desplegar

1. Vercel comenzará automáticamente a compilar y desplegar
2. Espera a que se complete el despliegue (generalmente 1-2 minutos)
3. Verás un botón **Visit** cuando esté listo
4. ¡Haz clic para ver tu app en vivo!

### Actualizaciones Futuras

Ahora, cada vez que hagas push a main en GitHub, Vercel desployará automáticamente:

```bash
# Haz cambios en tu código local
# ...

# Haz commit y push
git add .
git commit -m "Descripción de cambios"
git push
```

---

## Opción 2: Despliegue con Vercel CLI

Si prefieres no usar GitHub, puedes desplegar directamente usando Vercel CLI.

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Autenticarte en Vercel

```bash
vercel login
```

Esto abrirá tu navegador para que inicies sesión. Autoriza el acceso.

### Paso 3: Desplegar

```bash
cd C:\Users\ivanv\OneDrive\Desktop\Nueva carpeta\notes-app

# Ejecuta vercel
vercel
```

Se te harán algunas preguntas:
- **"Set up and deploy "~/notes-app"?"** → Responde `Y` (Yes)
- **"Which scope do you want to deploy to?"** → Selecciona tu cuenta personal
- **"Link to existing project?"** → Responde `N` (No, es un nuevo proyecto)
- **"What's your project's name?"** → `notes-app` (o el nombre que prefieras)
- **"In which directory is your code located?"** → `.` (punto, para el directorio actual)
- **"Want to modify vercel.json?"** → Responde `N`

### Paso 4: Configurar Variables de Entorno (Opcional)

```bash
# Para Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Para Supabase Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Ingresa los valores cuando se te pida.

### Paso 5: Redeploy

```bash
vercel --prod
```

---

## 🔐 Configurar Sincronización con Supabase

Para habilitar la sincronización en tiempo real entre dispositivos, sigue estos pasos:

### 1. Crear Cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en **Sign Up**
3. Crea una cuenta (puedes usar Google, GitHub, etc.)
4. Sigue los pasos de verificación

### 2. Crear un Proyecto en Supabase

1. En el dashboard de Supabase, haz clic en **New Project**
2. Llena el formulario:
   - **Project name**: `notes-app`
   - **Database password**: Crea una contraseña segura
   - **Region**: Selecciona la región más cercana
3. Haz clic en **Create new project**

### 3. Crear la Tabla de Notas

Una vez que tu proyecto esté listo:

1. Ve a **SQL Editor** en el panel izquierdo
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

-- Crear índice para mejor rendimiento
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_notes_category ON notes(category);
```

4. Haz clic en **Run** (botón azul)
5. Verás un mensaje de éxito

### 4. Obtener Credenciales de Supabase

1. Ve a **Settings** → **API** en el panel izquierdo
2. Copia:
   - **Project URL**: Es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade:
   - `NEXT_PUBLIC_SUPABASE_URL` = Tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Tu clave anónima
4. Haz clic en **Save**
5. Re-deploya el proyecto: haz clic en **Deployments** → selecciona el último → **Redeploy**

### 6. Configurar Políticas de Seguridad (RLS)

Para que solo tú puedas acceder a tus notas:

1. En Supabase, ve a **Authentication** → **Policies**
2. Selecciona la tabla `notes`
3. Haz clic en **Add RLS Policy**
4. Crea una política "For all operations":
   - **Using expression**: `auth.uid() = user_id`

*Nota: Para esto necesitas configurar autenticación en tu app. Por ahora funciona sin RLS si la tabla es pública.*

---

## ✅ Verificar el Despliegue

Después de desplegar, verifica que todo funciona:

### En Vercel

1. Ve a tu proyecto en [vercel.com/dashboard](https://vercel.com/dashboard)
2. Verifica el estado de la construcción (debe ser verde ✓)
3. Haz clic en el dominio para visitar tu app
4. Debe mostrar "Todas mis notas"

### Funcionalidad Básica

Prueba estos pasos en tu app desplegada:

1. **Crear una nota**:
   - Haz clic en "Nueva nota"
   - Escribe título y contenido
   - Haz clic en "Crear"
   - Debe aparecer en la lista

2. **Buscar**:
   - Escribe en la barra de búsqueda
   - Debe filtrar las notas

3. **Cambiar categoría**:
   - Haz clic en "Tareas" en la barra lateral
   - Debe mostrar solo tareas

4. **En móvil**:
   - Abre la URL en un teléfono
   - Debe verse bien (responsive design)

---

## 🐛 Solución de Problemas

### El despliegue falla

**Problema**: El build en Vercel falla con error

**Solución**:
1. Revisa los logs en Vercel (haz clic en **Deployments** → **Build Logs**)
2. Busca si falta alguna dependencia
3. Verifica que `npm run build` funciona localmente:
   ```bash
   npm install
   npm run build
   ```

### La app no carga en Vercel

**Problema**: Visitaste la URL pero ves un error

**Solución**:
1. Limpia el caché: Ctrl+Shift+Delete
2. Recarga la página: F5
3. Abre la consola (F12) y busca errores en rojo
4. Si ves errores, revisa los logs del navegador y reporta el error

### Las variables de entorno no funcionan

**Problema**: Supabase no se conecta

**Solución**:
1. Verifica que las variables estén configuradas en Vercel:
   - Settings → Environment Variables
   - Deben estar en "Production"
2. Haz un redeploy:
   - Ve a **Deployments**
   - Selecciona el último
   - Haz clic en **...** → **Redeploy**

### ¿Necesitas revertir a una versión anterior?

1. En Vercel, ve a **Deployments**
2. Encuentra la versión que quieres restaurar
3. Haz clic en **...**
4. Selecciona **Promote to Production**

---

## 🎉 ¡Listo!

Tu aplicación de notas está ahora en vivo en internet. Puedes:

- 📱 Acceder desde cualquier dispositivo
- 🔗 Compartir la URL (si la visibilidad es pública)
- 🔄 Actualizar automáticamente con cada push a GitHub
- 📊 Monitorear el rendimiento en el dashboard de Vercel

### Próximos pasos

- Configura tu dominio personalizado (Settings → Domains en Vercel)
- Configura Supabase para sincronización real
- Añade más características (colores, etiquetas, etc.)
- Invita a otros usuarios (cuando implementes autenticación)

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la [documentación de Vercel](https://vercel.com/docs)
2. Revisa la [documentación de Next.js](https://nextjs.org/docs)
3. Revisa la [documentación de Supabase](https://supabase.com/docs)

¡Buena suerte! 🚀
