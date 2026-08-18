# Guía de Importación de Datos - NotaFlow

NotaFlow permite importar notas y eventos desde múltiples fuentes. Esta guía te explica cómo hacerlo.

## 📥 Cómo Acceder a la Importación

1. En el sidebar de la aplicación, haz clic en el botón **"Importar"**
2. Se abrirá un modal con tres opciones de importación
3. Selecciona la fuente desde la que deseas importar
4. Sube el archivo correspondiente
5. Las notas se importarán automáticamente

## 🗓️ Importar desde Google Calendar

### Paso 1: Exportar tu Google Calendar

1. Ve a [Google Calendar](https://calendar.google.com)
2. En la barra lateral izquierda, busca tu calendario
3. Haz clic en los tres puntos (⋮) junto al nombre del calendario
4. Selecciona **"Configuración"**
5. Baja hasta la sección **"Exportar calendario"**
6. Haz clic en **"Exportar"**
7. Se descargará un archivo `.ics`

### Paso 2: Importar en NotaFlow

1. En NotaFlow, haz clic en **"Importar"**
2. Selecciona **"Google Calendar"**
3. Sube el archivo `.ics` descargado
4. ✅ Los eventos se convertirán en tareas de agenda

### Formato de Importación

Los eventos de Google Calendar se importan como:
- **Categoría**: Agenda
- **Prioridad**: Medio
- **Fecha de Vencimiento**: Fecha del evento
- **Contenido**: Descripción del evento (si existe)

---

## 📔 Importar desde OneNote

### Paso 1: Exportar desde OneNote

#### Opción A: OneNote Web
1. Ve a [OneNote Online](https://www.onenote.com)
2. Abre el cuaderno que deseas exportar
3. Haz clic en **"Más acciones"** (...)
4. Selecciona **"Exportar"**
5. Elige **"Como página HTML"** o **"Como Word"**

#### Opción B: OneNote Desktop (Windows/Mac)
1. Abre OneNote
2. Selecciona las notas que deseas exportar
3. Ve a **"Archivo"** → **"Exportar"**
4. Elige el formato (HTML recomendado)
5. Guarda el archivo

### Paso 2: Importar en NotaFlow

1. En NotaFlow, haz clic en **"Importar"**
2. Selecciona **"OneNote"**
3. Sube el archivo `.html` o `.docx`
4. ✅ Las notas se importarán automáticamente

### Formato de Importación

Las notas de OneNote se importan como:
- **Categoría**: Nota
- **Prioridad**: Medio
- **Contenido**: Todo el texto de la página
- **Fecha de Vencimiento**: No configurada

---

## 📱 Importar desde Samsung Notes

### Paso 1: Exportar desde Samsung Notes

#### En tu dispositivo Samsung:
1. Abre la app **Samsung Notes**
2. Abre la nota que deseas exportar
3. Haz clic en **"Menú"** (⋮)
4. Selecciona **"Compartir"** o **"Exportar"**
5. Elige **"Guardar como archivo"**
6. Guarda como `.txt` o exporta como `.json`

#### Alternativa: Backup en Samsung Cloud
1. En Samsung Notes, ve a **"Menú"**
2. Selecciona **"Configuración"** → **"Backup"**
3. Exporta todas tus notas a un archivo
4. Guarda el archivo en tu computadora

### Paso 2: Importar en NotaFlow

1. En NotaFlow, haz clic en **"Importar"**
2. Selecciona **"Samsung Notes"**
3. Sube tu archivo (`.txt`, `.json` o backup)
4. ✅ Las notas se importarán automáticamente

### Formato de Importación

Las notas de Samsung se importan como:
- **Categoría**: Nota
- **Prioridad**: Medio
- **Contenido**: Texto completo de la nota
- **Favorito**: Se mantiene si está marcado en Samsung
- **Fecha de Vencimiento**: Si la nota tiene fecha

---

## ✨ Características de la Importación

✅ **Conversión Automática**
- Los eventos se convierten en notas/tareas
- Se preserva la máxima información posible
- Los títulos y contenidos se formatean correctamente

✅ **Preservación de Datos**
- Fechas de vencimiento se mantienen
- Prioridades se respetan (donde aplica)
- Elementos marcados como favoritos se importan

✅ **Organización**
- Todas las notas importadas se agregan al Dashboard
- Puedes moverlas a carpetas después
- Se genera automáticamente un ID único para cada nota

✅ **Sin Duplicados**
- Cada importación crea notas nuevas con IDs únicos
- Si importas dos veces el mismo archivo, crea copias
- Puedes eliminar duplicados manualmente

---

## 🔍 Formatos Soportados

### Google Calendar
- ✅ `.ics` (iCalendar format)
- Exportado desde Google Calendar

### OneNote
- ✅ `.html` (Página HTML)
- ✅ `.docx` (Formato Word)
- Exportado desde OneNote Web o Desktop

### Samsung Notes
- ✅ `.txt` (Texto plano)
- ✅ `.json` (Formato JSON estructurado)
- Exportado desde Samsung Notes o Samsung Cloud Backup

---

## 🐛 Solución de Problemas

### "No se encontraron notas en el archivo"

**Causas posibles**:
- El archivo está vacío
- El formato no es compatible
- El archivo está corrupto

**Soluciones**:
1. Verifica que el archivo tenga contenido
2. Asegúrate de exportar en el formato correcto
3. Intenta descargar/exportar nuevamente

### El archivo se carga pero no aparecen notas

1. Verifica que el formato sea compatible
2. Comprueba que el archivo no esté cifrado
3. Intenta con un archivo más pequeño primero

### Las notas importadas no tienen contenido

1. Asegúrate de que el archivo source tenga todo el contenido
2. Algunos formatos pueden truncar texto muy largo
3. Las notas muy largas se pueden cortar a 5000 caracteres

### Error de carga de archivo

1. El archivo es demasiado grande (máximo ~50MB)
2. Intenta con un archivo más pequeño
3. Verifica tu conexión a internet

---

## 💡 Consejos

- 💾 **Haz backup regular**: Exporta periódicamente desde tus fuentes
- 📋 **Revisa antes de importar**: Comprueba que el archivo contiene las notas correctas
- 🏷️ **Organiza después**: Importa todo y luego crea carpetas para organizarlo
- 🔄 **Sincroniza regularmente**: NotaFlow sincroniza automáticamente en la nube

---

## 📧 Soporte

Si encuentras problemas al importar:
1. Verifica que usas el formato correcto
2. Revisa la sección de Solución de Problemas
3. Intenta con un archivo de ejemplo más pequeño

**Última actualización**: Agosto 2026
