'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import NoteCard from '@/components/NoteCard';
import NoteModal from '@/components/NoteModal';
import SearchBar from '@/components/SearchBar';
import Calendar from '@/components/Calendar';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Note['category'] | 'all' | 'dashboard'>('dashboard');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { notes, addNote, updateNote, getNotesByCategory } = useNotesStore();

  useEffect(() => {
    setMounted(true);
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      useNotesStore.setState({ notes: JSON.parse(savedNotes) });
    }
  }, []);

  const getDisplayNotes = () => {
    let filtered = notes;

    if (activeCategory !== 'dashboard' && activeCategory !== 'all') {
      filtered = getNotesByCategory(activeCategory as Note['category']);
    } else if (activeCategory === 'all') {
      filtered = notes;
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const getTodayTasks = () => {
    const today = new Date().toDateString();
    return notes.filter((note) => {
      if (!note.dueDate) return false;
      return new Date(note.dueDate).toDateString() === today;
    });
  };

  const handleSaveNote = (note: Note) => {
    if (selectedNote) {
      updateNote(selectedNote.id, note);
    } else {
      addNote(note);
    }
    setSelectedNote(undefined);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setIsModalOpen(true);
  };

  if (!mounted) return null;

  const displayNotes = getDisplayNotes();
  const todayTasks = getTodayTasks();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onNewNote={handleNewNote}
      />

      <main className="flex-1 ml-72 overflow-auto">
        {/* Dashboard - Calendario */}
        {activeCategory === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-slate-600">Gestiona tu día de manera efectiva</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendario grande */}
              <div className="lg:col-span-2">
                <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
              </div>

              {/* Tareas de hoy */}
              <div>
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Hoy</h2>
                  <div className="text-sm text-slate-600 mb-4">
                    {new Date().toLocaleDateString('es-ES', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  {todayTasks.length === 0 ? (
                    <p className="text-slate-500 text-sm">No hay tareas para hoy</p>
                  ) : (
                    <div className="space-y-2">
                      {todayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg cursor-pointer transition ${
                            task.completed
                              ? 'bg-green-50 border-l-4 border-green-500'
                              : task.priority === 'high'
                              ? 'bg-red-50 border-l-4 border-red-500'
                              : 'bg-blue-50 border-l-4 border-blue-500'
                          }`}
                          onClick={() => handleEditNote(task)}
                        >
                          <p className="font-medium text-sm text-gray-800">{task.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{task.content.substring(0, 50)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleNewNote}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                  >
                    + Agregar tarea
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vistas por categoría */}
        {activeCategory !== 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {activeCategory === 'all'
                  ? 'Todas mis notas'
                  : activeCategory === 'note'
                  ? 'Notas'
                  : activeCategory === 'task'
                  ? 'Tareas'
                  : 'Agenda'}
              </h1>
              <p className="text-gray-600">
                {displayNotes.length} elemento{displayNotes.length !== 1 ? 's' : ''}
              </p>
            </div>

            <SearchBar onSearch={setSearchQuery} />

            {displayNotes.length === 0 ? (
              <div className="mt-16 text-center">
                <p className="text-gray-500 text-lg">No hay elementos aquí</p>
                <button
                  onClick={handleNewNote}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear primero
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayNotes.map((note) => (
                  <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        note={selectedNote}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(undefined);
        }}
        onSave={handleSaveNote}
      />
    </div>
  );
}
