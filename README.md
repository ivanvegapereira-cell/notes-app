# 📝 Mis Notas - Aplicación de Agenda Personal

Una aplicación web moderna para gestionar notas, tareas y agenda del día. Funciona en computadora y móvil, con sincronización local y opcional con Supabase.

## ✨ Características

- 📌 **Notas**: Crea y organiza tus notas personales
- ✅ **Tareas**: Gestiona tu lista de tareas con prioridades
- 📅 **Agenda**: Planifica tus actividades del día
- 🔍 **Búsqueda**: Encuentra notas rápidamente
- 📱 **Responsive**: Funciona perfectamente en web y móvil
- 💾 **Sincronización Local**: Usa localStorage automáticamente
- ☁️ **Sincronización en la nube** (Opcional): Integra con Supabase para sincronización en tiempo real
- 🎨 **Interfaz Moderna**: Diseño limpio y fácil de usar

## 🚀 Instalación Local

### Requisitos previos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clonar o descargar el proyecto**
```bash
cd notes-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno (Opcional)**
```bash
cp .env.example .env.local
```

Si deseas usar Supabase para sincronización en la nube, edita `.env.local` con tus credenciales.

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Cómo Usar

### Crear una nota
1. Haz clic en "Nueva nota" en la barra lateral
2. Llena el formulario:
   - **Título**: Nombre de la nota
   - **Tipo**: Elige entre Nota, Tarea o Agenda
   - **Contenido**: Escribe tu contenido
   - **Prioridad** (solo tareas y agenda): Baja, Media, Alta
   - **Fecha de vencimiento** (tareas y agenda): Selecciona una fecha
3. Haz clic en "Crear"

### Editar una nota
- Haz clic en el icono ✏️ en la tarjeta de la nota
- Realiza los cambios
- Haz clic en "Actualizar"

### Eliminar una nota
- Haz clic en el icono 🗑️ en la tarjeta de la nota
- Confirma la eliminación

### Buscar notas
- Usa la barra de búsqueda en la parte superior
- Escribe palabras clave del título o contenido

### Filtrar por categoría
- Usa el menú de la izquierda para filtrar por:
  - Todas
  - Notas
  - Tareas
  - Agenda

## ☁️ Sincronización con Supabase (Opcional)

Si deseas que tus notas se sincronicen en múltiples dispositivos:

### 1. Crear una cuenta en Supabase
- Ve a [supabase.com](https://supabase.com)
- Crea una nueva cuenta
- Crea un nuevo proyecto

### 2. Crear la tabla en Supabase
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  category TEXT CHECK (category IN ('note', 'task', 'agenda')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT false,
  due_date TIMESTAMP,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Obtener las credenciales
- En el dashboard de Supabase, ve a Settings → API
- Copia `Project URL` y `anon` key

### 4. Configurar variables de entorno
```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

## 🚀 Desplegar en Vercel

### Opción 1: Despliegue rápido desde GitHub

1. **Hacer push del código a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/notas-app.git
git branch -M main
git push -u origin main
```

2. **Conectar con Vercel**
- Ve a [vercel.com](https://vercel.com)
- Haz clic en "New Project"
- Selecciona tu repositorio de GitHub
- Vercel importará automáticamente la configuración

3. **Configurar variables de entorno en Vercel**
- En el panel de Vercel, ve a Settings → Environment Variables
- Añade (opcional):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Haz clic en "Deploy"

### Opción 2: Despliegue desde CLI de Vercel

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Desplegar**
```bash
vercel
```

3. **Configurar variables de entorno** (si es necesario)
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

4. **Redeploy**
```bash
vercel
```

## 📊 Stack Tecnológico

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Estado**: Zustand
- **Sincronización Local**: localStorage
- **Sincronización Nube** (opcional): Supabase
- **Hosting**: Vercel
- **Iconos**: Lucide React
- **Fechas**: date-fns

## 📝 Estructura del Proyecto

```
notes-app/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página principal
│   └── globals.css          # Estilos globales
├── components/
│   ├── Sidebar.tsx          # Barra lateral de navegación
│   ├── NoteCard.tsx         # Tarjeta de nota
│   ├── NoteModal.tsx        # Modal de crear/editar
│   └── SearchBar.tsx        # Barra de búsqueda
├── lib/
│   ├── types.ts             # Tipos TypeScript
│   ├── store.ts             # Store de Zustand
│   └── supabase.ts          # Configuración de Supabase
└── public/                  # Archivos estáticos
```

## 🔒 Seguridad

- Las notas se almacenan localmente en tu navegador (localStorage)
- Si usas Supabase, asegúrate de configurar las políticas de seguridad (RLS) correctamente
- No se envían datos a servidores de terceros a menos que configures Supabase

## 🐛 Solución de Problemas

### Las notas no se guardan
- Verifica que localStorage esté habilitado en tu navegador
- Abre DevTools (F12) → Application → Local Storage

### No se sincronizan con Supabase
- Verifica que las credenciales en `.env.local` sean correctas
- Verifica que la tabla `notes` exista en Supabase
- Revisa la consola del navegador para errores

### Problemas con el despliegue en Vercel
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de construcción en el panel de Vercel

## 📄 Licencia

MIT

## 👨‍💻 Autor

Creada como una aplicación personal de productividad.

---

¿Preguntas o sugerencias? ¡Abre un issue o contribuye al proyecto!
