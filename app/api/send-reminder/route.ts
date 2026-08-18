import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface PendingTask {
  title: string;
  priority: string;
  dueDate: string;
}

interface RequestBody {
  pendingTasks: PendingTask[];
  userEmail: string;
}

function createTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error('Email credentials not configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

function formatTasksHTML(tasks: PendingTask[]): string {
  const taskRows = tasks
    .map(
      (task) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${task.title}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;
          ${
            task.priority === 'high'
              ? 'background-color: #fee; color: #c33;'
              : task.priority === 'medium'
              ? 'background-color: #ffd; color: #aa0;'
              : 'background-color: #efe; color: #0a0;'
          }">
          ${task.priority.toUpperCase()}
        </span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${new Date(task.dueDate).toLocaleDateString('es-ES', {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f5f5f5;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Tarea</th>
          <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Prioridad</th>
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Vencimiento</th>
        </tr>
      </thead>
      <tbody>
        ${taskRows}
      </tbody>
    </table>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { pendingTasks, userEmail } = body;

    if (!pendingTasks || pendingTasks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No pending tasks' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'Email not provided' },
        { status: 400 }
      );
    }

    const transporter = createTransporter();
    const tasksHTML = formatTasksHTML(pendingTasks);

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>📋 Recordatorio de NotaFlow</h2>
            <p>Tienes ${pendingTasks.length} tarea(s) pendiente(s):</p>
            ${tasksHTML}
            <a href="https://notes-app.vercel.app" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px;">
              Abrir NotaFlow
            </a>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `📋 NotaFlow: ${pendingTasks.length} Tarea(s) Pendiente(s)`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: message,
      },
      { status: 500 }
    );
  }
}
