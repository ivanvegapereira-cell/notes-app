import { create } from 'zustand';
import { Note } from './types';
import { NotesSync } from './sync';
import { CloudSync } from './cloud-sync';
import { isSupabaseEnabled } from './supabase';

const STORAGE_KEY = 'notes';
const SYNC_STATUS_KEY = 'notes_sync_status';

interface NotesStore {
  notes: Note[];
  isSyncing: boolean;
  lastSync: string | null;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  setNotes: (notes: Note[]) => void;
  getNotesByCategory: (category: Note['category']) => Note[];
  getTodayTasks: () => Note[];
  filterBySearch: (query: string) => Note[];
  getDeletedNotes: () => Note[];
  getFavoriteNotes: () => Note[];
  syncWithCloud: () => Promise<void>;
  setIsSyncing: (syncing: boolean) => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  isSyncing: false,
  lastSync: null,

  addNote: async (note) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));

    const state = get();
    saveToLocalStorage(state.notes);

    // Sincronizar con nube en segundo plano
    syncWithCloud(state.notes);

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
    saveToLocalStorage(state.notes);

    // Sincronizar con nube en segundo plano
    syncWithCloud(state.notes);

    if (isSupabaseEnabled && updatedNote) {
      await NotesSync.syncToSupabase(updatedNote, 'update');
    }
  },

  deleteNote: async (id) => {
    const noteToDelete = get().notes.find((n) => n.id === id);

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              isDeleted: true,
              deletedAt: new Date().toISOString(),
            }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);

    if (isSupabaseEnabled && noteToDelete) {
      await NotesSync.syncToSupabase({ ...noteToDelete, isDeleted: true }, 'update');
    }
  },

  restoreNote: async (id) => {
    const noteToRestore = get().notes.find((n) => n.id === id);

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              isDeleted: false,
              deletedAt: undefined,
            }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);

    if (isSupabaseEnabled && noteToRestore) {
      await NotesSync.syncToSupabase({ ...noteToRestore, isDeleted: false }, 'update');
    }
  },

  permanentlyDeleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  toggleFavorite: (id) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  addTag: (id, tag) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, tags: [...(note.tags || []), tag] }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  removeTag: (id, tag) => {
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id
          ? { ...note, tags: (note.tags || []).filter((t) => t !== tag) }
          : note
      ),
    }));

    const state = get();
    saveToLocalStorage(state.notes);
    syncWithCloud(state.notes);
  },

  setNotes: (notes) => {
    set({ notes });
    saveToLocalStorage(notes);
  },

  getNotesByCategory: (category) => {
    return get().notes.filter((note) => note.category === category && !note.isDeleted);
  },

  getTodayTasks: () => {
    const today = new Date().toDateString();
    return get().notes.filter((note) => {
      if (note.isDeleted) return false;
      if (note.category !== 'task' && note.category !== 'agenda') return false;
      if (!note.dueDate) return false;
      return new Date(note.dueDate).toDateString() === today;
    });
  },

  filterBySearch: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().notes.filter(
      (note) =>
        !note.isDeleted &&
        (note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery))
    );
  },

  getDeletedNotes: () => {
    return get().notes.filter((note) => note.isDeleted);
  },

  getFavoriteNotes: () => {
    return get().notes.filter((note) => note.isFavorite && !note.isDeleted);
  },

  syncWithCloud: async () => {
    const state = get();
    set({ isSyncing: true });

    try {
      // Intentar descargar notas de la nube
      const cloudNotes = await CloudSync.downloadNotes();
      if (cloudNotes && cloudNotes.length > 0) {
        const merged = mergeNotes(state.notes, cloudNotes);
        set({ notes: merged });
        saveToLocalStorage(merged);
      }

      // Subir notas actuales a la nube
      await CloudSync.uploadNotes(state.notes);

      set({ lastSync: new Date().toISOString() });
      localStorage.setItem(SYNC_STATUS_KEY, new Date().toISOString());
    } catch (error) {
      console.error('Error syncing with cloud:', error);
    } finally {
      set({ isSyncing: false });
    }
  },

  setIsSyncing: (syncing) => {
    set({ isSyncing: syncing });
  },
}));

// Funciones auxiliares
function saveToLocalStorage(notes: Note[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function loadFromLocalStorage(): Note[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function mergeNotes(local: Note[], remote: Note[]): Note[] {
  const merged = new Map<string, Note>();

  // Añadir notas locales
  local.forEach((note) => merged.set(note.id, note));

  // Merge con notas remotas (usar la más reciente)
  remote.forEach((remoteNote) => {
    const localNote = merged.get(remoteNote.id);
    if (!localNote || new Date(remoteNote.updatedAt) > new Date(localNote.updatedAt)) {
      merged.set(remoteNote.id, remoteNote);
    }
  });

  return Array.from(merged.values());
}

async function syncWithCloud(notes: Note[]) {
  // Sincronizar en segundo plano sin bloquear
  setTimeout(async () => {
    try {
      await CloudSync.uploadNotes(notes);
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }, 1000);
}
