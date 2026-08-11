# ⚡ Inicio Rápido

## 🚀 Ejecutar localmente

```bash
cd notes-app
npm install
npm run dev
```

Abre [http://localhost:3002](http://localhost:3002) en tu navegador.

## 📝 Características Principales

✨ **Crear notas, tareas y eventos de agenda**
- Título y descripción
- Categoría (Nota, Tarea, Agenda)
- Prioridad (Baja, Media, Alta)
- Fecha de vencimiento
- Marcar tareas como completadas

🔍 **Buscar y filtrar**
- Barra de búsqueda por título/contenido
- Filtros por categoría en la barra lateral
- Ordenamiento por fecha de actualización

💾 **Sincronización**
- Local: Automático con localStorage
- Nube: Opcional con Supabase

📱 **Responsive**
- Funciona perfecto en desktop
- Optimizado para móvil

## 🎯 Primeros pasos

1. **Crear tu primera nota**
   - Haz clic en "Nueva nota"
   - Escribe título y contenido
   - Selecciona tipo y haz clic en "Crear"

2. **Buscar notas**
   - Usa la barra de búsqueda
   - Filtra por categoría en la sidebar

3. **Editar/Eliminar**
   - Haz clic en los iconos en cada tarjeta

## 🔧 Desarrollo

### Scripts disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm start        # Inicia servidor de producción
npm run lint     # Ejecuta linter
```

### Estructura del proyecto

```
notes-app/
├── app/              # Páginas y layouts
├── components/       # Componentes React
├── lib/              # Lógica y tipos
├── public/           # Archivos estáticos
└── package.json
```

## 🚢 Desplegar en Vercel

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

### Resumen rápido:

```bash
# Option 1: Usar GitHub + Vercel (Recomendado)
git push origin main
# Vercel desplegará automáticamente

# Option 2: Usar Vercel CLI
npm i -g vercel
vercel --prod
```

## 📞 Ayuda

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind](https://tailwindcss.com/docs)
- [Documentación de Zustand](https://github.com/pmndrs/zustand)
