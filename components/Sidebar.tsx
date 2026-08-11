'use client';

import { Note } from '@/lib/types';
import {
  FileText,
  CheckSquare,
  Calendar,
  Plus,
  Settings,
  Home,
  Menu,
  X,
  Cloud,
  Check,
  Moon,
  Sun,
} from 'lucide-react';
import { useState } from 'react';
import { useNotesStore } from '@/lib/store';
import { useTheme } from '@/lib/theme-context';

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
  const [isOpen, setIsOpen] = useState(false);
  const isSyncing = useNotesStore((state) => state.isSyncing);
  const lastSync = useNotesStore((state) => state.lastSync);
  const { theme, toggleTheme } = useTheme();

  const categories = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'all', label: 'Todas', icon: FileText },
    { id: 'note', label: 'Notas', icon: FileText },
    { id: 'task', label: 'Tareas', icon: CheckSquare },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
  ];

  const handleCategoryChange = (category: any) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          text-white p-6 flex flex-col shadow-2xl transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:relative md:translate-x-0 md:w-72
        `}
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <h1 className="text-2xl font-bold">NotaFlow</h1>
          </div>
          <p className="text-slate-400 text-sm ml-13">Tu gestor</p>
        </div>

        {/* Botón Nueva Nota */}
        <button
          onClick={() => {
            onNewNote();
            setIsOpen(false);
          }}
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
              onClick={() => handleCategoryChange(id as any)}
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
        <div className="border-t border-slate-700 pt-6 space-y-3">
          {/* Sync Status */}
          <div className="px-4 py-2 bg-slate-700 rounded-lg flex items-center gap-2">
            {isSyncing ? (
              <>
                <Cloud size={16} className="text-blue-400 animate-pulse" />
                <span className="text-xs text-slate-300">Sincronizando...</span>
              </>
            ) : (
              <>
                <Check size={16} className="text-green-400" />
                <span className="text-xs text-slate-300">
                  {lastSync ? `Sincronizado` : 'Sin conexión'}
                </span>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 transition group"
            title="Cambiar tema"
          >
            {theme === 'light' ? (
              <>
                <Moon size={20} className="text-slate-400 group-hover:text-slate-300" />
                <span className="font-medium">Oscuro</span>
              </>
            ) : (
              <>
                <Sun size={20} className="text-slate-400 group-hover:text-slate-300" />
                <span className="font-medium">Claro</span>
              </>
            )}
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 transition group">
            <Settings size={20} className="text-slate-400 group-hover:text-slate-300" />
            <span className="font-medium">Ajustes</span>
          </button>
        </div>
      </aside>
    </>
  );
}
