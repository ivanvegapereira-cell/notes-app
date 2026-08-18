# Email Configuration Guide - NotaFlow

Este guía te ayudará a configurar el sistema de recordatorios por email en NotaFlow.

## 📋 Requisitos

- Cuenta de Gmail
- Acceso al dashboard de Vercel (para producción)

## 🔐 Paso 1: Crear una Contraseña de Aplicación de Gmail

Gmail no permite el acceso directo con tu contraseña principal por razones de seguridad. Debes crear una **Contraseña de Aplicación**.

### Para crear una Contraseña de Aplicación:

1. Ve a tu cuenta de Google: [myaccount.google.com](https://myaccount.google.com)
2. En la barra lateral izquierda, selecciona **"Seguridad"**
3. En la sección **"Acceso a Google"**, activa la **autenticación de dos factores** si no la tienes activada
4. Vuelve a **Seguridad** y busca **"Contraseñas de aplicación"**
5. Selecciona:
   - Aplicación: **Correo**
   - Dispositivo: **Otro (especificar)** → escribe "NotaFlow"
6. Google te generará una contraseña de 16 caracteres
7. **Guarda esta contraseña en un lugar seguro** ⚠️

## 💻 Paso 2: Configuración Local (Desarrollo)

### Crear archivo `.env.local`:

En la raíz del proyecto, crea un archivo `.env.local` con el siguiente contenido:

```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_app_de_16_caracteres
```

### Ejemplo:
```env
EMAIL_USER=coordpedagogico@salesianoconcepcion.cl
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

## 🌍 Paso 3: Configuración en Vercel (Producción)

### Método 1: Usando el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto **"notes-app"**
3. Haz clic en **"Settings"** (Ajustes)
4. En la barra lateral, selecciona **"Environment Variables"**
5. Haz clic en **"Add New"** (Agregar nuevo)
6. Agrega las dos variables:

```
NAME: EMAIL_USER
VALUE: tu_email@gmail.com
√ Production
√ Preview
√ Development
```

```
NAME: EMAIL_PASSWORD
VALUE: tu_contraseña_de_app_de_16_caracteres
√ Production
√ Preview
√ Development
```

7. Haz clic en **"Save"**
8. Espera a que Vercel redeploy automáticamente tu aplicación

### Método 2: Usando Vercel CLI

Si tienes Vercel CLI instalado:

```bash
vercel env add EMAIL_USER
# Ingresa: tu_email@gmail.com

vercel env add EMAIL_PASSWORD
# Ingresa: tu_contraseña_de_app_de_16_caracteres

vercel redeploy
```

## 🧪 Paso 4: Probar la Funcionalidad

### En Desarrollo (Local):

1. Asegúrate de tener el servidor local corriendo:
   ```bash
   npm run dev
   ```

2. Abre la aplicación en `http://localhost:3002`

3. Crea algunas **tareas** y asigna una fecha de vencimiento a una o más

4. En la esquina inferior derecha, verás un botón **"Enviar Recordatorio"**

5. Haz clic en el botón

6. Si todo está configurado correctamente:
   - ✅ Verás un mensaje verde: "Recordatorio enviado exitosamente"
   - ✅ Recibirás un email con un resumen de tus tareas

### En Producción (Vercel):

1. Ve a [https://notes-app.vercel.app](https://notes-app.vercel.app)

2. Crea una tarea y establece una fecha de vencimiento

3. Haz clic en **"Enviar Recordatorio"**

4. Deberías recibir el email en tu bandeja de entrada

## 🐛 Solución de Problemas

### Error: "Email authentication failed"

**Causa**: Contraseña incorrecta o no es una Contraseña de Aplicación

**Solución**:
1. Verifica que estés usando una **Contraseña de Aplicación** (no tu contraseña principal)
2. Copia la contraseña exactamente tal como Gmail la generó (sin espacios extras)
3. En Vercel, elimina la variable anterior y crea una nueva

### Error: "Cannot connect to email server"

**Causa**: Problema de conectividad o firewall

**Solución**:
1. Verifica tu conexión a internet
2. Asegúrate de que tu firewall/antivirus no bloquea conexiones a Gmail
3. Intenta desde otra red o dispositivo

### No recibí el email

**Causas posibles**:
- Las variables de entorno no se han aplicado (espera a que Vercel termine de redeploy)
- El email llegó a la carpeta de Spam
- Las credenciales son incorrectas

**Soluciones**:
1. Revisa tu carpeta de Spam en Gmail
2. Verifica que el proyecto en Vercel haya terminado de redeploy (estado debe ser "Ready")
3. Revisa los logs de Vercel: **Settings → Functions → Logs**

### Error: "Tarea enviada pero no llegó email"

1. Comprueba que EMAIL_PASSWORD tiene exactamente 16 caracteres
2. Intenta crear una nueva Contraseña de Aplicación en Gmail
3. Verifica en los logs de Gmail de tu cuenta si hay alertas de seguridad

## 📧 Características del Email

- ✅ Tabla formateada con todas las tareas pendientes
- ✅ Indicadores de prioridad (Alto, Medio, Bajo) con colores
- ✅ Fechas de vencimiento formateadas en español
- ✅ Botón para abrir rápidamente NotaFlow
- ✅ Diseño responsivo para móvil y desktop
- ✅ Branding de NotaFlow

## 🔒 Seguridad

**IMPORTANTE**: Nunca uses tu contraseña principal de Gmail. Siempre usa una **Contraseña de Aplicación**.

- Las Contraseñas de Aplicación son específicas para NotaFlow
- Si necesitas revocarla, puedes hacerlo en cualquier momento desde Google
- El email y contraseña se almacenan seguros en Vercel (no en el código)

## 📝 Variables de Entorno Requeridas

```
EMAIL_USER        - Tu email de Gmail
EMAIL_PASSWORD    - Tu contraseña de aplicación de 16 caracteres
```

## ✅ Checklist de Configuración

- [ ] He creado una Contraseña de Aplicación en Gmail
- [ ] He agregado EMAIL_USER a Vercel
- [ ] He agregado EMAIL_PASSWORD a Vercel
- [ ] Vercel ha terminado de redeploy (estado: "Ready")
- [ ] He probado el botón "Enviar Recordatorio"
- [ ] He recibido un email de prueba

---

¿Necesitas ayuda? Revisa los logs de Vercel o ponte en contacto con soporte.

**Última actualización**: Agosto 2026
