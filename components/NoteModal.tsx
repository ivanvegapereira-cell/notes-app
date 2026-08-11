'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/lib/types';
import { X } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  note?: Note;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export default function NoteModal({
  isOpen,
  note,
  onClose,
  onSave,
}: NoteModalProps) {
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'note',
    priority: 'medium',
  });

  useEffect(() => {
    if (note) {
      setFormData(note);
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'note',
        priority: 'medium',
      });
    }
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const now = new Date().toISOString();
    const newNote: Note = {
      id: note?.id || crypto.randomUUID(),
      title: formData.title,
      content: formData.content || '',
      category: (formData.category as Note['category']) || 'note',
      priority: formData.priority as Note['priority'],
      dueDate: formData.dueDate,
      completed: formData.completed || false,
      createdAt: note?.createdAt || now,
      updatedAt: now,
    };

    onSave(newNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {note ? 'Editar' : 'Nueva'} {formData.category === 'note' ? 'Nota' : formData.category === 'task' ? 'Tarea' : 'Agenda'}
          </h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título de la nota"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={formData.category || 'note'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Note['category'],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="note">Nota</option>
                <option value="task">Tarea</option>
                <option value="agenda">Agenda</option>
              </select>
            </div>

            {formData.category !== 'note' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad
                </label>
                <select
                  value={formData.priority || 'medium'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Note['priority'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            )}
          </div>

          {(formData.category === 'task' || formData.category === 'agenda') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={
                    formData.dueDate
                      ? formData.dueDate.split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {formData.category === 'task' && (
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.completed || false}
                      onChange={(e) =>
                        setFormData({ ...formData, completed: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Completada
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contenido
            </label>
            <textarea
              value={formData.content || ''}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-none"
              placeholder="Escribe tu nota aquí..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {note ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
