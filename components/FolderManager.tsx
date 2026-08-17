'use client';

import { useState } from 'react';
import { Folder } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import { X, Trash2, Edit2, Plus } from 'lucide-react';

interface FolderManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOLDER_COLORS = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-purple-100', 'bg-pink-100'];
const FOLDER_EMOJIS = ['📁', '📂', '📋', '🗂️', '📑', '📇'];

export default function FolderManager({ isOpen, onClose }: FolderManagerProps) {
  const [formData, setFormData] = useState<Partial<Folder>>({
    name: '',
    description: '',
    color: FOLDER_COLORS[0],
    emoji: FOLDER_EMOJIS[0],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { folders, addFolder, updateFolder, deleteFolder, getNotesByFolder } = useNotesStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (editingId) {
      updateFolder(editingId, formData);
      setEditingId(null);
    } else {
      const newFolder: Folder = {
        id: crypto.randomUUID(),
        name: formData.name,
        description: formData.description,
        color: formData.color || FOLDER_COLORS[0],
        emoji: formData.emoji || FOLDER_EMOJIS[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addFolder(newFolder);
    }

    setFormData({ name: '', description: '', color: FOLDER_COLORS[0], emoji: FOLDER_EMOJIS[0] });
  };

  const handleEdit = (folder: Folder) => {
    setFormData(folder);
    setEditingId(folder.id);
  };

  const handleDelete = (id: string) => {
    deleteFolder(id);
    setDeleteConfirm(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gestionar Carpetas</h2>
          <button onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-slate-700 p-1 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Reuniones Q1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción opcional"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Emoji
                </label>
                <div className="flex gap-2 flex-wrap">
                  {FOLDER_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-2xl p-2 rounded ${
                        formData.emoji === emoji ? 'bg-blue-200 dark:bg-blue-900' : 'hover:bg-gray-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {FOLDER_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded border-2 ${
                        formData.color === color
                          ? 'border-gray-900 dark:border-white'
                          : 'border-transparent'
                      } ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                {editingId ? 'Actualizar' : 'Crear Carpeta'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', description: '', color: FOLDER_COLORS[0], emoji: FOLDER_EMOJIS[0] });
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Lista de carpetas */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mis Carpetas ({folders.length})</h3>
            {folders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No hay carpetas aún. Crea una para comenzar.</p>
            ) : (
              <div className="space-y-2">
                {folders.map((folder) => {
                  const notesCount = getNotesByFolder(folder.id).length;
                  return (
                    <div
                      key={folder.id}
                      className={`p-4 rounded-lg border ${folder.color} border-gray-300 dark:border-slate-600 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{folder.emoji}</span>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{folder.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notesCount} elemento{notesCount !== 1 ? 's' : ''}
                            {folder.description && ` • ${folder.description}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(folder)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-gray-600 dark:text-gray-400"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(folder.id)}
                          className="p-2 hover:bg-red-200 dark:hover:bg-red-900 rounded text-red-600 dark:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirmación de eliminación */}
          {deleteConfirm && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="font-bold text-red-900 dark:text-red-100 mb-3">
                ¿Eliminar esta carpeta?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-3 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
