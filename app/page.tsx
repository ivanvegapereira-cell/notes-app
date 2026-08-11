'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/lib/types';
import { useNotesStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import NoteCard from '@/components/NoteCard';
import NoteModal from '@/components/NoteModal';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Note['category'] | 'all'>('all');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const { notes, addNote, updateNote, getNotesByCategory, filterBySearch } = useNotesStore();

  useEffect(() => {
    setMounted(true);
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      useNotesStore.setState({ notes: JSON.parse(savedNotes) });
    }
  }, []);

  const getDisplayNotes = () => {
    let filtered = activeCategory === 'all' ? notes : getNotesByCategory(activeCategory as Note['category']);
    if (searchQuery) {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onNewNote={handleNewNote}
      />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {activeCategory === 'all' ? 'Todas mis notas' : activeCategory === 'note' ? 'Notas' : activeCategory === 'task' ? 'Tareas' : 'Agenda'}
            </h1>
            <p className="text-gray-600">{displayNotes.length} elemento{displayNotes.length !== 1 ? 's' : ''}</p>
          </div>

          <SearchBar onSearch={setSearchQuery} />

          {displayNotes.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-gray-500 text-lg">No hay notas aquí</p>
              <button
                onClick={handleNewNote}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear primera nota
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                />
              ))}
            </div>
          )}
        </div>
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
