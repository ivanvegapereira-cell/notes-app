'use client';

import { Note } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface DayActivitiesProps {
  selectedDate: Date;
  onClose: () => void;
  onEditNote?: (note: Note) => void;
}

export default function DayActivities({ selectedDate, onClose, onEditNote }: DayActivitiesProps) {
  const notes = useNotesStore((state) => state.notes);
  const { updateNote } = useNotesStore();

  const activitiesForDay = notes
    .filter((note) => !note.isDeleted && note.dueDate && isSameDay(new Date(note.dueDate), selectedDate))
    .sort((a, b) => {
      // Tareas primero, luego agenda, luego notas
      const categoryOrder = { task: 0, agenda: 1, note: 2 };
      return categoryOrder[a.category] - categoryOrder[b.category];
    });

  const categoryColors = {
    note: 'from-blue-500 to-blue-600',
    task: 'from-green-500 to-emerald-600',
    agenda: 'from-purple-500 to-indigo-600',
  };

  const categoryLabels = {
    note: 'Nota',
    task: 'Tarea',
    agenda: 'Evento',
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };

  const toggleComplete = (note: Note) => {
    if (note.category === 'task') {
      updateNote(note.id, { completed: !note.completed });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {format(selectedDate, 'EEEE', { locale: es }).charAt(0).toUpperCase() +
                format(selectedDate, 'EEEE', { locale: es }).slice(1)}
            </h2>
            <p className="text-blue-100 text-sm">
              {format(selectedDate, 'PPP', { locale: es })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activitiesForDay.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No hay actividades para este día
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activitiesForDay.map((activity) => (
                <div
                  key={activity.id}
                  className={`rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all ${
                    activity.isFavorite
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-white dark:bg-slate-700'
                  }`}
                  onClick={() => onEditNote?.(activity)}
                >
                  <div className={`h-1 bg-gradient-to-r ${categoryColors[activity.category]}`}></div>

                  <div className="p-4">
                    {/* Title with Task Checkbox */}
                    <div className="flex items-start gap-3 mb-2">
                      {activity.category === 'task' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(activity);
                          }}
                          className="mt-1 flex-shrink-0 transition hover:scale-110"
                        >
                          {activity.completed ? (
                            <CheckCircle2 size={24} className="text-green-500" />
                          ) : (
                            <Circle size={24} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                          )}
                        </button>
                      ) : (
                        <div className="text-2xl mt-0.5">
                          {activity.category === 'agenda' ? '📅' : '📝'}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-lg text-gray-900 dark:text-white ${
                            activity.category === 'task' && activity.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                          }`}
                        >
                          {activity.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs font-bold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                            {categoryLabels[activity.category]}
                          </span>
                          {activity.priority && activity.category !== 'note' && (
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded ${
                                priorityBadgeColors[activity.priority]
                              }`}
                            >
                              {activity.priority === 'high'
                                ? 'ALTA'
                                : activity.priority === 'medium'
                                ? 'MEDIA'
                                : 'BAJA'}
                            </span>
                          )}
                          {activity.isFavorite && (
                            <span className="text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                              ⭐ Favorito
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p
                      className={`text-sm mb-3 text-gray-800 dark:text-gray-200 ${
                        activity.category === 'task' && activity.completed ? 'text-gray-600 dark:text-gray-400' : ''
                      }`}
                    >
                      {activity.content}
                    </p>

                    {/* Tags */}
                    {activity.tags && activity.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {activity.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold pt-2 border-t border-gray-200 dark:border-slate-600">
                      Actualizado:{' '}
                      {format(new Date(activity.updatedAt), 'PPp', {
                        locale: es,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {activitiesForDay.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
              📊 Total: {activitiesForDay.length} actividad{activitiesForDay.length !== 1 ? 'es' : ''} |
              ✅ Completadas:{' '}
              {activitiesForDay.filter((a) => a.completed).length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
