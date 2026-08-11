'use client';

import { Note } from '@/lib/types';
import {
  FileText,
  CheckSquare,
  Calendar,
  Plus,
  Settings,
  Home,
} from 'lucide-react';

interface SidebarProps {
  activeCategory: Note['category'] | 'all' | 'dashboard';
  onCategoryChange: (category: Note['category'] | 'all' | 'dashboard') => void;
  onNewNote: () => void;
}

export default function Sidebar({
  activeCategory,
  onCategoryChange,
  onNewNote,
}: SidebarProps) {
  const categories = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'all', label: 'Todas', icon: FileText },
    { id: 'note', label: 'Notas', icon: FileText },
    { id: 'task', label: 'Tareas', icon: CheckSquare },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex flex-col h-screen fixed left-0 top-0 z-40 shadow-2xl">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <h1 className="text-2xl font-bold">NotaFlow</h1>
        </div>
        <p className="text-slate-400 text-sm ml-13">Tu gestor de tareas</p>
      </div>

      {/* Botón Nueva Nota */}
      <button
        onClick={onNewNote}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition shadow-lg mb-8 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Nueva nota
      </button>

      {/* Navegación */}
      <nav className="space-y-1 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menú</p>
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onCategoryChange(id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition group
              ${
                activeCategory === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700'
              }
            `}
          >
            <Icon size={20} className={activeCategory === id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 pt-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 transition group">
          <Settings size={20} className="text-slate-400 group-hover:text-slate-300" />
          <span className="font-medium">Ajustes</span>
        </button>
      </div>
    </aside>
  );
}
