'use client';

import { Note } from '@/lib/types';
import {
  FileText,
  CheckSquare,
  Calendar,
  Plus,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeCategory: Note['category'] | 'all';
  onCategoryChange: (category: Note['category'] | 'all') => void;
  onNewNote: () => void;
}

export default function Sidebar({
  activeCategory,
  onCategoryChange,
  onNewNote,
}: SidebarProps) {
  const categories = [
    { id: 'all', label: 'Todas', icon: FileText },
    { id: 'note', label: 'Notas', icon: FileText },
    { id: 'task', label: 'Tareas', icon: CheckSquare },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-4 flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">📝 Notas</h1>
        <p className="text-blue-100 text-sm">Mi agenda personal</p>
      </div>

      <button
        onClick={onNewNote}
        className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 mb-6"
      >
        <Plus size={20} />
        Nueva nota
      </button>

      <nav className="space-y-2 flex-1">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onCategoryChange(id as Note['category'] | 'all')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeCategory === id
                ? 'bg-white text-blue-600 font-semibold'
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-blue-500 pt-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 transition">
          <Settings size={20} />
          <span>Ajustes</span>
        </button>
      </div>
    </aside>
  );
}
