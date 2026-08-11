'use client';

import { useNotesStore } from '@/lib/store';
import { RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TrashBin() {
  const { getDeletedNotes, restoreNote, permanentlyDeleteNote } = useNotesStore();
  const deletedNotes = getDeletedNotes();

  return (
    <div className="space-y-4">
      {deletedNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">La papelera está vacía</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deletedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                    {note.content.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Eliminado:{' '}
                    {note.deletedAt
                      ? format(new Date(note.deletedAt), 'PPp', { locale: es })
                      : 'N/A'}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => restoreNote(note.id)}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition text-green-600 dark:text-green-400"
                    title="Restaurar"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          '¿Estás seguro? Esta acción no se puede deshacer.'
                        )
                      ) {
                        permanentlyDeleteNote(note.id);
                      }
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400"
                    title="Eliminar permanentemente"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3 text-sm text-yellow-800 dark:text-yellow-200 mt-6">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p>
              Las notas en la papelera se eliminarán automáticamente después de 30 días.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
