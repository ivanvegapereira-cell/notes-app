# 🏗️ Arquitectura de la Aplicación

## 📊 Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                   NAVEGADOR DEL USUARIO                      │
│  Desktop (Chrome, Firefox, Safari) / Mobile (iOS, Android)   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP (Vercel)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Frontend (React Components)              │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │           Page.tsx (Main App)                 │   │   │
│  │  │  ┌──────────────────────────────────────┐   │   │   │
│  │  │  │  ┌────────────────────────────────┐  │   │   │   │
│  │  │  │  │ Sidebar (Navigation & Filter)  │  │   │   │   │
│  │  │  │  │ ┌────────────────────────────┐ │  │   │   │   │
│  │  │  │  │ │ • All Notes                 │ │  │   │   │   │
│  │  │  │  │ │ • Notes                     │ │  │   │   │   │
│  │  │  │  │ │ • Tasks                     │ │  │   │   │   │
│  │  │  │  │ │ • Agenda                    │ │  │   │   │   │
│  │  │  │  │ │ [New Note Button]           │ │  │   │   │   │
│  │  │  │  │ └────────────────────────────┘ │  │   │   │   │
│  │  │  │  └────────────────────────────────┘  │   │   │   │
│  │  │  │                                       │   │   │   │
│  │  │  │  ┌────────────────────────────────┐  │   │   │   │
│  │  │  │  │    Main Content Area           │  │   │   │   │
│  │  │  │  │ ┌────────────────────────────┐ │  │   │   │   │
│  │  │  │  │ │  SearchBar                  │ │  │   │   │   │
│  │  │  │  │ └────────────────────────────┘ │  │   │   │   │
│  │  │  │  │                                 │  │   │   │   │
│  │  │  │  │ ┌──────┐ ┌──────┐ ┌──────┐   │  │   │   │   │
│  │  │  │  │ │Note  │ │Note  │ │Note  │ … │  │   │   │   │
│  │  │  │  │ │Card  │ │Card  │ │Card  │   │  │   │   │   │
│  │  │  │  │ └──────┘ └──────┘ └──────┘   │  │   │   │   │
│  │  │  │  └────────────────────────────┘  │   │   │   │   │
│  │  │  └────────────────────────────────┘  │   │   │   │   │
│  │  │                                       │   │   │   │   │
│  │  │  ┌────────────────────────────────┐  │   │   │   │   │
│  │  │  │    NoteModal (Create/Edit)     │  │   │   │   │   │
│  │  │  │  ┌────────────────────────────┐ │  │   │   │   │   │
│  │  │  │  │ • Title Input               │ │  │   │   │   │   │
│  │  │  │  │ • Category Select           │ │  │   │   │   │   │
│  │  │  │  │ • Content Textarea          │ │  │   │   │   │   │
│  │  │  │  │ • Priority Select           │ │  │   │   │   │   │
│  │  │  │  │ • Due Date Picker           │ │  │   │   │   │   │
│  │  │  │  │ • [Create/Update] Button    │ │  │   │   │   │   │
│  │  │  │  └────────────────────────────┘ │  │   │   │   │   │
│  │  │  └────────────────────────────────┘  │   │   │   │   │
│  │  └──────────────────────────────────────┘   │   │   │   │
│  │                                              │   │   │   │
│  │  ┌──────────────────────────────────────┐   │   │   │   │
│  │  │   State Management (Zustand Store)    │   │   │   │   │
│  │  │  ┌───────────────────────────────┐   │   │   │   │   │
│  │  │  │ • notes: Note[]                │   │   │   │   │   │
│  │  │  │ • addNote()                    │   │   │   │   │   │
│  │  │  │ • updateNote()                 │   │   │   │   │   │
│  │  │  │ • deleteNote()                 │   │   │   │   │   │
│  │  │  │ • filterBySearch()             │   │   │   │   │   │
│  │  │  │ • getNotesByCategory()         │   │   │   │   │   │
│  │  │  │ • getTodayTasks()              │   │   │   │   │   │
│  │  │  └───────────────────────────────┘   │   │   │   │   │
│  │  └──────────────────────────────────────┘   │   │   │   │
│  └──────────────────────────────────────────────┘   │   │   │
│                                                     │   │   │
│  ┌──────────────────────────────────────────────┐  │   │   │
│  │     Local Storage (Browser localStorage)      │  │   │   │
│  │  ┌──────────────────────────────────────┐   │  │   │   │
│  │  │ JSON: {                              │   │  │   │   │
│  │  │   notes: [{                          │   │  │   │   │
│  │  │     id, title, content, category,   │   │  │   │   │
│  │  │     priority, dueDate, completed... │   │  │   │   │
│  │  │   }, ...]                           │   │  │   │   │
│  │  │ }                                    │   │  │   │   │
│  │  └──────────────────────────────────────┘   │  │   │   │
│  │                                              │  │   │   │
│  └──────────────────────────────────────────────┘  │   │   │
└──────────────────────────────────────────────────────┘   │   │
                                                           │   │
                       ┌────────────────────────────────────┘   │
                       │                                        │
                       ▼ (Opcional: Si configuras Supabase)     │
          ┌────────────────────────────────────────────┐       │
          │        Supabase (PostgreSQL + API)        │       │
          │ ┌────────────────────────────────────────┐│       │
          │ │    Database: notes table               ││       │
          │ │  ┌──────────────────────────────────┐ ││       │
          │ │  │ Columns:                         │ ││       │
          │ │  │ • id (UUID Primary Key)          │ ││       │
          │ │  │ • title (TEXT)                   │ ││       │
          │ │  │ • content (TEXT)                 │ ││       │
          │ │  │ • category (note|task|agenda)    │ ││       │
          │ │  │ • priority (low|medium|high)     │ ││       │
          │ │  │ • completed (BOOLEAN)            │ ││       │
          │ │  │ • due_date (TIMESTAMP)           │ ││       │
          │ │  │ • created_at (TIMESTAMP)         │ ││       │
          │ │  │ • updated_at (TIMESTAMP)         │ ││       │
          │ │  └──────────────────────────────────┘ ││       │
          │ └────────────────────────────────────────┘│       │
          │                                            │       │
          │  REST API / Real-time Subscriptions       │       │
          │  (Sincronización en tiempo real)          │       │
          └────────────────────────────────────────────┘       │
                                                              │
└────────────────────────────────────────────────────────────┘

                        VERCEL (Hosting)
               https://notes-app.vercel.app
```

---

## 📂 Flujo de Datos

```
Usuario Interactúa con UI
        │
        ▼
   React Component (page.tsx)
        │
        ├─────────────────────┐
        │                     │
        ▼                     ▼
   Zustand Store      UI State (useState)
        │                     │
        │                     ▼
        │              Update UI/Render
        │
        ▼
   localStorage
        │
        ├─ Guardar automáticamente
        │
        └─ Leer al cargar app
```

---

## 🔄 Ciclo de Vida: Crear una Nota

```
1. Usuario hace clic en "Nueva nota"
        ↓
2. NoteModal abre (modal state = true)
        ↓
3. Usuario completa el formulario
   - Título
   - Contenido
   - Categoría
   - Prioridad
   - Fecha de vencimiento
        ↓
4. Usuario hace clic en "Crear"
        ↓
5. Validación en NoteModal
   - ¿Tiene título?
   - ¿Tienen contenido?
        ↓ (Válido)
6. handleSaveNote() se ejecuta
        ↓
7. Genera UUID para la nota
        ↓
8. useNotesStore.addNote(newNote)
   ├─ Actualiza estado de Zustand
   ├─ Guarda en localStorage
        ↓
9. NoteModal cierra (modal state = false)
        ↓
10. page.tsx re-renderiza
        ↓
11. Nueva nota aparece en la lista
```

---

## 🔍 Ciclo de Vida: Buscar Notas

```
Usuario escribe en SearchBar
        │
        ├─ onChange event
        │
        ├─ setSearchQuery(texto)
        │
        └─ State update en page.tsx
                ↓
        page.tsx se re-renderiza
                ↓
        getDisplayNotes() se ejecuta:
        ├─ Filtra por categoría
        ├─ Filtra por búsqueda
        ├─ Ordena por fecha
                ↓
        Grid de NoteCards se actualiza
                ↓
        Usuario ve resultados filtrados
```

---

## 🎯 Tipos de Datos

### Note
```typescript
interface Note {
  id: string;                           // UUID único
  title: string;                        // "Mi primer nota"
  content: string;                      // Contenido de la nota
  category: 'note' | 'task' | 'agenda'; // Tipo de elemento
  priority?: 'low' | 'medium' | 'high'; // Importancia
  completed?: boolean;                  // ¿Completada?
  dueDate?: string;                     // Fecha de vencimiento (ISO)
  color?: string;                       // Color para futuro uso
  createdAt: string;                    // Fecha de creación (ISO)
  updatedAt: string;                    // Última actualización (ISO)
}
```

---

## 🛠️ Componentes y Responsabilidades

```
Page.tsx (main logic)
├─ Gestiona estado global
├─ Carga datos de localStorage
├─ Implementa CRUD completo
├─ Coordina componentes
│
├─ Sidebar
│  └─ Navegación y filtrado
│
├─ SearchBar
│  └─ Búsqueda en tiempo real
│
├─ NoteCard (múltiples)
│  ├─ Visualización de nota individual
│  ├─ Botones editar/eliminar
│  └─ Información (fecha, categoría, etc)
│
└─ NoteModal
   ├─ Formulario de crear/editar
   ├─ Validación de datos
   └─ Cierre automático después de guardar
```

---

## 🚀 Flujo de Despliegue

```
Local Development
    ↓
git add . && git commit
    ↓
git push origin main
    ↓
GitHub Repository
    ↓
Vercel Webhook (auto)
    ↓
Vercel Build Process
├─ npm install
├─ npm run build (next build)
├─ Optimización
└─ Deploy
    ↓
Live en https://notes-app.vercel.app
    ↓
Usuario accede desde cualquier dispositivo
├─ Desktop
├─ Tablet
└─ Mobile
    ↓
localStorage sincroniza localmente
    ↓
(Opcional) Supabase sincroniza en la nube
```

---

## 💾 Sincronización de Datos

### Opción 1: localStorage (Actual)
```
App              Browser
├─ State (Zustand)
├─ Update
├─ Save JSON
│  └─ localStorage.setItem('notes', JSON.stringify(notes))
└─ Carga siguiente sesión
   └─ localStorage.getItem('notes')
```

### Opción 2: Supabase (Opcional)
```
App              Network              Database
├─ State (Zustand)
├─ User Action
├─ API Call
│  └─ supabase.from('notes').insert(note)
├─ Wait for Response
│  └─ Supabase Webhook
├─ Real-time Update
│  └─ Todos los dispositivos sincronizados
└─ Update Local State
```

---

## 📱 Responsive Design

```
Desktop (> 1024px)
┌────────────────────────────────────┐
│ Sidebar │ Content                  │
│ (240px) │ (Auto)                   │
│         │                          │
└────────────────────────────────────┘

Tablet (768px - 1024px)
┌────────────────────────────────────┐
│ Sidebar │ Content                  │
│ (180px) │ (Auto)                   │
│         │                          │
└────────────────────────────────────┘

Mobile (< 768px)
┌────────────────────────────────────┐
│  Hamburger │ Content               │
│  Menu      │ (Full Width)          │
│            │                       │
└────────────────────────────────────┘

(Nota: Sidebar siempre visible en versión actual,
 podría convertirse en hamburger menu en futuro)
```

---

## ✅ Checklist de Arquitectura

- ✅ Frontend separado en componentes reutilizables
- ✅ Estado global con Zustand
- ✅ Tipos TypeScript completos
- ✅ localStorage para persistencia
- ✅ Preparado para Supabase (código escrito)
- ✅ Responsive design
- ✅ Servidor de desarrollo funcionando
- ✅ Compilación a producción exitosa
- ✅ Configuración de Vercel lista
- ✅ Documentación completa

---

## 🔐 Seguridad

- ✅ localStorage es privado por navegador
- ✅ Validación en frontend
- ✅ Variables de entorno configuradas (.env)
- ✅ TypeScript previene errores de tipo
- ✅ Listo para RLS en Supabase (si se configura)

---

## 📈 Escalabilidad Futura

- Agregar autenticación (Auth0, Supabase Auth)
- Compartir notas con otros usuarios
- Colaboración en tiempo real
- Tags/Etiquetas
- Recordatorios
- Exportar a PDF
- Dark mode
- Múltiples workspaces

