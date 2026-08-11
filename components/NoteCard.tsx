'use client';

import { Note } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
}

export default function NoteCard({ note, onEdit }: NoteCardProps) {
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const categoryColors = {
    note: 'bg-blue-50 border-blue-200',
    task: 'bg-green-50 border-green-200',
    agenda: 'bg-purple-50 border-purple-200',
  };

  const categoryLabels = {
    note: 'Nota',
    task: 'Tarea',
    agenda: 'Agenda',
  };

  return (
    <div
      className={`p-4 rounded-lg border ${categoryColors[note.category]} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{note.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {categoryLabels[note.category]}
            {note.priority && ` • Prioridad: ${note.priority}`}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(note)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Edit2 size={16} className="text-gray-600" />
            </button>
          )}
          <button
            onClick={() => deleteNote(note.id)}
            className="p-1 hover:bg-red-200 rounded"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap break-words">
        {note.content.substring(0, 200)}
        {note.content.length > 200 ? '...' : ''}
      </p>

      {note.dueDate && (
        <div className="text-xs text-gray-500">
          📅{' '}
          {format(new Date(note.dueDate), 'PPP', {
            locale: es,
          })}
        </div>
      )}

      {note.category === 'task' && note.completed && (
        <div className="mt-2 text-xs text-green-600 font-medium">
          ✓ Completada
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">
        {format(new Date(note.updatedAt), 'PPp', {
          locale: es,
        })}
      </div>
    </div>
  );
}
