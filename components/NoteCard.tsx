'use client';

import { Note } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import { Trash2, Edit2, CheckCircle2, Circle, AlertCircle, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
}

export default function NoteCard({ note, onEdit }: NoteCardProps) {
  const { deleteNote, updateNote, toggleFavorite } = useNotesStore();
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categoryColors = {
    note: 'from-blue-500 to-blue-600',
    task: 'from-green-500 to-emerald-600',
    agenda: 'from-purple-500 to-indigo-600',
  };

  const categoryLabels = {
    note: 'Nota',
    task: 'Tarea',
    agenda: 'Agenda',
  };

  const categoryIcons = {
    note: '📝',
    task: '✓',
    agenda: '📅',
  };

  const priorityColors = {
    high: 'text-red-500 bg-red-50',
    medium: 'text-yellow-500 bg-yellow-50',
    low: 'text-green-500 bg-green-50',
  };

  const toggleComplete = () => {
    if (note.category === 'task') {
      updateNote(note.id, { completed: !note.completed });
    }
  };

  return (
    <div
      className={`rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 group ${
        note.isFavorite
          ? 'bg-yellow-50 dark:bg-yellow-900/20'
          : 'bg-white dark:bg-slate-800'
      }`}
    >
      {/* Header con gradiente */}
      <div
        className={`h-1 bg-gradient-to-r ${
          note.isFavorite ? 'from-yellow-400 to-yellow-500' : categoryColors[note.category]
        }`}
      ></div>

      <div className="p-5">
        {/* Título y acciones */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex-1 flex items-start gap-3">
            {note.category === 'task' ? (
              <button
                onClick={toggleComplete}
                className="mt-1 flex-shrink-0 transition hover:scale-110"
              >
                {note.completed ? (
                  <CheckCircle2 size={24} className="text-green-500" />
                ) : (
                  <Circle size={24} className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            ) : (
              <span className="text-2xl mt-1 flex-shrink-0">{categoryIcons[note.category]}</span>
            )}
            <div className="flex-1">
              <h3
                className={`font-semibold text-gray-800 dark:text-white text-lg ${
                  note.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                }`}
              >
                {note.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded">
                  {categoryLabels[note.category]}
                </span>
                {note.priority && note.category !== 'note' && (
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${priorityColors[note.priority]}`}>
                    <AlertCircle size={14} />
                    {note.priority === 'high' ? 'Alta' : note.priority === 'medium' ? 'Media' : 'Baja'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => toggleFavorite(note.id)}
              className={`p-2 rounded-lg transition ${
                note.isFavorite
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
              }`}
              title={note.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Star
                size={18}
                className={note.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
              />
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(note)}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                title="Editar"
              >
                <Edit2 size={18} className="text-blue-600 dark:text-blue-400" />
              </button>
            )}
            <button
              onClick={() => deleteNote(note.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
              title="Eliminar"
            >
              <Trash2 size={18} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <p className={`text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 ${note.completed ? 'text-gray-500 dark:text-gray-400' : ''}`}>
          {note.content.substring(0, 150)}
          {note.content.length > 150 ? '...' : ''}
        </p>

        {/* Tags */}
        {(note.tags && note.tags.length > 0) || showTagInput ? (
          <div className="mb-3 space-y-2">
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => {
                        const { removeTag } = useNotesStore.getState();
                        removeTag(note.id, tag);
                      }}
                      className="hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {showTagInput && (
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    const { addTag } = useNotesStore.getState();
                    addTag(note.id, newTag.trim());
                    setNewTag('');
                    setShowTagInput(false);
                  }
                }}
                placeholder="Agregar tag..."
                className="w-full px-2 py-1 text-xs border border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                autoFocus
              />
            )}
          </div>
        ) : null}

        {/* Metadata */}
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-slate-100 dark:border-slate-700">
          {note.dueDate && (
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>
                {format(new Date(note.dueDate), 'PPP', {
                  locale: es,
                })}
              </span>
            </div>
          )}

          <div className="text-gray-500 dark:text-gray-400">
            {format(new Date(note.updatedAt), 'PPp', {
              locale: es,
            })}
          </div>

          {!showTagInput && (
            <button
              onClick={() => setShowTagInput(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium"
            >
              + Tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
