import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ReminderRequest {
  pendingTasks: Array<{
    title: string;
    priority: string;
    dueDate: string;
  }>;
  userEmail: string;
}

// Crear transportador de email usando variables de entorno
const createTransporter = () => {
  // Intentar usar SendGrid primero, luego Gmail, luego fallback
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  // Fallback: usar SMTP genérico si está configurado
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReminderRequest;
    const { pendingTasks, userEmail } = body;

    const transporter = createTransporter();

    if (!transporter) {
      return NextResponse.json(
        {
          error: 'No hay configuración de email. Por favor, configura UNA de estas opciones en Vercel Environment Variables:' +
            '\n1. SENDGRID_API_KEY (recomendado)' +
            '\n2. GMAIL_USER + GMAIL_PASSWORD' +
            '\n3. SMTP_HOST + SMTP_USER + SMTP_PASSWORD + SMTP_PORT',
          success: false,
          instruction: 'Ve a https://vercel.com/dashboard -> Settings -> Environment Variables',
        },
        { status: 500 }
      );
    }

    // Generar HTML del email
    const tasksHTML = pendingTasks
      .map(
        (task) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">
          <strong>${task.title}</strong>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            ${
              task.priority === 'high'
                ? 'background-color: #fee2e2; color: #991b1b;'
                : task.priority === 'medium'
                ? 'background-color: #fef3c7; color: #92400e;'
                : 'background-color: #dcfce7; color: #166534;'
            }
          ">
            ${task.priority === 'high' ? 'ALTA' : task.priority === 'medium' ? 'MEDIA' : 'BAJA'}
          </span>
        </td>
        <td style="padding: 12px; text-align: right;">
          ${new Date(task.dueDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </td>
      </tr>
    `
      )
      .join('');

    const emailHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Recordatorio de Tareas Pendientes</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">📋 Recordatorio de Tareas Pendientes</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">
              ${new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <!-- Content -->
          <div style="margin-bottom: 30px;">
            <p style="margin: 0 0 20px 0; font-size: 16px;">
              Hola,
            </p>
            <p style="margin: 0 0 20px 0; font-size: 16px;">
              Tienes <strong>${pendingTasks.length}</strong> tarea${pendingTasks.length !== 1 ? 's' : ''} pendiente${pendingTasks.length !== 1 ? 's' : ''} por completar. A continuación se muestra el detalle:
            </p>

            <!-- Tasks Table -->
            <div style="margin-bottom: 20px; overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; font-weight: bold; color: #374151;">Tarea</th>
                    <th style="padding: 12px; text-align: center; font-weight: bold; color: #374151;">Prioridad</th>
                    <th style="padding: 12px; text-align: right; font-weight: bold; color: #374151;">Vencimiento</th>
                  </tr>
                </thead>
                <tbody>
                  ${tasksHTML}
                </tbody>
              </table>
            </div>

            <!-- Statistics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-size: 28px; font-weight: bold; color: #16a34a;">
                  ${pendingTasks.length}
                </div>
                <div style="font-size: 14px; color: #15803d; margin-top: 5px;">
                  Tareas pendientes
                </div>
              </div>
              <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 15px; text-align: center;">
                <div style="font-size: 28px; font-weight: bold; color: #dc2626;">
                  ${pendingTasks.filter((t) => t.priority === 'high').length}
                </div>
                <div style="font-size: 14px; color: #b91c1c; margin-top: 5px;">
                  Con prioridad ALTA
                </div>
              </div>
            </div>

            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              ⏰ Te recomendamos revisar y actualizar tus tareas en la aplicación.
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://notes-app-eight-roan.vercel.app" style="
              display: inline-block;
              background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
              color: white;
              padding: 12px 30px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
            ">
              Abrir NotaFlow 🚀
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">
              Este es un recordatorio automático de NotaFlow
            </p>
            <p style="margin: 0;">
              © 2024 NotaFlow. Gestiona tus tareas de manera efectiva.
            </p>
          </div>
        </div>
      </body>
    </html>
    `;

    // Enviar email usando nodemailer
    const senderEmail = process.env.GMAIL_USER || process.env.SMTP_USER || 'noreply@notaflow.app';

    const mailOptions = {
      from: `NotaFlow <${senderEmail}>`,
      to: userEmail,
      subject: `📋 Recordatorio: ${pendingTasks.length} tarea${pendingTasks.length !== 1 ? 's' : ''} pendiente${pendingTasks.length !== 1 ? 's' : ''}`,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info.messageId) {
      return NextResponse.json(
        {
          error: 'Error al enviar email: sin confirmación de envío',
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: `Email enviado exitosamente a ${userEmail}`,
        success: true,
        id: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        success: false,
      },
      { status: 500 }
    );
  }
}
