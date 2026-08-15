'use client';

import { useNotesStore } from '@/lib/store';
import { Mail, Loader } from 'lucide-react';
import { useState } from 'react';

export default function SendReminderButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const notes = useNotesStore((state) => state.notes);

  const getPendingTasks = () => {
    return notes.filter(
      (note) =>
        note.category === 'task' &&
        !note.completed &&
        !note.isDeleted &&
        note.dueDate
    );
  };

  const sendReminder = async () => {
    const pendingTasks = getPendingTasks();

    if (pendingTasks.length === 0) {
      setMessage('✅ No hay tareas pendientes');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pendingTasks: pendingTasks.map((task) => ({
            title: task.title,
            priority: task.priority || 'medium',
            dueDate: task.dueDate,
          })),
          userEmail: 'coordpedagogico@salesianoconcepcion.cl',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          '❌ Error al enviar: ' +
            (data.error || 'Intenta nuevamente')
        );
        return;
      }

      setMessage('✅ Recordatorio enviado exitosamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error de conexión');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = getPendingTasks().length;

  if (pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg shadow-lg font-medium text-sm ${
            message.includes('✅')
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={sendReminder}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-white shadow-lg hover:shadow-xl transition ${
          isLoading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        }`}
        title={`Enviar recordatorio con ${pendingCount} tarea${pendingCount !== 1 ? 's' : ''} pendiente${pendingCount !== 1 ? 's' : ''}`}
      >
        {isLoading ? (
          <>
            <Loader size={20} className="animate-spin" />
            <span>Enviando...</span>
          </>
        ) : (
          <>
            <Mail size={20} />
            <div className="flex flex-col items-start">
              <span className="text-sm">Enviar Recordatorio</span>
              <span className="text-xs opacity-90">
                {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
              </span>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
