import { create } from 'zustand';
import { Note } from './types';
import { NotesSync } from './sync';
import { isSupabaseEnabled, createNote, updateNoteInDB, deleteNoteFromDB } from './supabase';

interface NotesStore {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setNotes: (notes: Note[]) => void;
  getNotesByCategory: (category: Note['category']) => Note[];
  getTodayTasks: () => Note[];
  filterBySearch: (query: string) => Note[];
  syncNotes: () => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],

  addNote: async (note) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));

    const state = get();
    NotesSync.saveLocalNotes(state.notes);

    // Sincronizar con Supabase si está disponible
    if (isSupabaseEnabled) {
      await NotesSync.syncToSupabase(note, 'insert');
    }
  },

  updateNote: async (id, updates) => {
    let updatedNote: Note | undefined;

    set((state) => ({
      notes: state.notes.map((note) => {
        if (note.id === id) {
          updatedNote = {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updatedNote;
        }
        return note;
      }),
    }));

    const state = get();
    NotesSync.saveLocalNotes(state.notes);

    // Sincronizar con Supabase si está disponible
    if (isSupabaseEnabled && updatedNote) {
      await NotesSync.syncToSupabase(updatedNote, 'update');
    }
  },

  deleteNote: async (id) => {
    const noteToDelete = get().notes.find((n) => n.id === id);

    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));

    const state = get();
    NotesSync.saveLocalNotes(state.notes);

    // Sincronizar con Supabase si está disponible
    if (isSupabaseEnabled && noteToDelete) {
      await NotesSync.syncToSupabase(noteToDelete, 'delete');
    }
  },

  setNotes: (notes) => {
    set({ notes });
    NotesSync.saveLocalNotes(notes);
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

  syncNotes: async () => {
    if (isSupabaseEnabled) {
      await NotesSync.syncFromSupabase(useNotesStore);
      await NotesSync.processSyncQueue(useNotesStore);
    }
  },
}));
