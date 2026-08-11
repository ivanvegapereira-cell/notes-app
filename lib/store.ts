import { create } from 'zustand';
import { Note } from './types';

interface NotesStore {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setNotes: (notes: Note[]) => void;
  getNotesByCategory: (category: Note['category']) => Note[];
  getTodayTasks: () => Note[];
  filterBySearch: (query: string) => Note[];
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],

  addNote: (note) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));
    // Sync to localStorage
    const state = get();
    localStorage.setItem('notes', JSON.stringify(state.notes));
  },

  updateNote: (id, updates) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : note
      ),
    }));
    const state = get();
    localStorage.setItem('notes', JSON.stringify(state.notes));
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
    const state = get();
    localStorage.setItem('notes', JSON.stringify(state.notes));
  },

  setNotes: (notes) => {
    set({ notes });
    localStorage.setItem('notes', JSON.stringify(notes));
  },

  getNotesByCategory: (category) => {
    return get().notes.filter((note) => note.category === category);
  },

  getTodayTasks: () => {
    const today = new Date().toDateString();
    return get().notes.filter((note) => {
      if (note.category !== 'task' && note.category !== 'agenda') return false;
      if (!note.dueDate) return false;
      return new Date(note.dueDate).toDateString() === today;
    });
  },

  filterBySearch: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
    );
  },
}));
